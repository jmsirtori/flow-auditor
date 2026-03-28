// Ignitia · SEO Auditor v4.0 — Dashboard
import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";

// ─── Storage ───────────────────────────────────────────────────────
function loadClients() { return JSON.parse(localStorage.getItem("ignitia_clients") || "[]"); }
function saveClients(c) { localStorage.setItem("ignitia_clients", JSON.stringify(c)); }
function loadHistory() { return JSON.parse(localStorage.getItem("ignitia_history") || "[]"); }
function saveToHistory(query, result, clientId, score) {
  const history = loadHistory();
  const entry = { id: Date.now(), clientId, score, date: new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }), query, result };
  history.unshift(entry);
  localStorage.setItem("ignitia_history", JSON.stringify(history.slice(0, 100)));
  return entry;
}
function getClientAudits(clientId) { return loadHistory().filter(e => e.clientId === clientId); }
function updateClientScore(clientId, score) {
  const clients = loadClients();
  const idx = clients.findIndex(c => c.id === clientId);
  if (idx !== -1) { clients[idx].lastScore = score; clients[idx].lastAudit = new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }); saveClients(clients); }
}

// ─── Extract score from Claude response ────────────────────────────
function extractScore(text) {
  const match = text.match(/IGNITIA_SCORE:\s*(\d+(?:\.\d+)?)/);
  if (match) return parseFloat(match[1]);
  const m2 = text.match(/calificaci[oó]n[^0-9]*(\d+(?:\.\d+)?)\s*\/\s*10/i);
  if (m2) return parseFloat(m2[1]);
  return null;
}

const SECTORS = ["Restaurante", "Clínica / Salud", "Tienda / Retail", "Agencia", "Educación", "Inmobiliaria", "Fitness / Gym", "Belleza / Spa", "Legal", "Tecnología", "Otro"];

const MASTER_PROMPT = `ROL: Eres el "Digital Growth Auditor" de Ignitia, un estratega digital de élite. Tu misión es auditar ecosistemas digitales para encontrar "fugas de atención", falta de coherencia y debilidades de posicionamiento (SEO).

FILOSOFÍA: La visibilidad es un sistema conectado. Si un punto falla (web lenta, Google Business desactualizado, mensaje inconsistente), el cliente se pierde. No buscas errores; optimizas el flujo de dinero.

I. PROTOCOLO DE AUDITORÍA:
1. Coherencia de Marca (NAP Consistency): Compara Nombre, Dirección y Teléfono en Web, Google Maps y Redes.
2. Análisis SEO Profundo: Extrae keywords del sitio, simula búsqueda real y compara con competidores Top 3.
3. Diagnóstico de Fricción Web: Identifica H1. Si depende de JavaScript, márcalo como "Persiana Cerrada para Google".
4. Flujo Conectado: Revisa si los enlaces en Redes Sociales son estratégicos.

II. ESTRUCTURA DE RESPUESTA (usa exactamente estos encabezados):

## 🛠️ NOTAS INTERNAS
Tono técnico para el consultor.
- Análisis Técnico: errores, inconsistencias NAP, métricas SEO.
- Gancho de Venta: punto débil clave.

## 📄 REPORTE PARA EL CLIENTE
Tono empático, analogías de tienda física.
### ⚡ Diagnóstico de Salud Digital
Calificación 1-10 de Fricción (donde 1 = muy fácil comprar, 10 = imposible encontrarte).
### 🎯 Tu Vitrina en Google
### 🔍 Los Baches en el Camino
### 🏗️ Tu Letrero Principal (H1)
### 🚀 Plan de Quick Wins (60 min)
Presenta exactamente 5 acciones en formato de tabla Markdown con estas columnas:
| Acción | Dónde hacerlo | Tiempo | Impacto |
|--------|---------------|--------|---------|
- Acción: qué hacer, explicado en lenguaje simple sin tecnicismos
- Dónde hacerlo: la plataforma o lugar exacto (ej: Google Business, Instagram, WordPress)
- Tiempo: estimado realista en minutos (ej: 10 min, 30 min)
- Impacto: Alto, Medio o Bajo
Ordena de mayor a menor impacto.

## 🏆 BENCHMARK COMPETITIVO
Identifica los 2 competidores principales que aparecen en el Top 3 de Google para las keywords clave del negocio auditado. Para cada uno incluye:
- Nombre y URL
- 2-3 cosas que hacen mejor que el negocio auditado
- Sus keywords principales
- Su score de fricción estimado vs el del negocio auditado
Al final incluye:
- **Brecha principal:** lo que ellos tienen y el negocio no
- **Oportunidad inmediata:** la acción más rápida para cerrar esa brecha

## 📚 DICCIONARIO PARA DUEÑOS

## 📚 DICCIONARIO PARA DUEÑOS
Define H1, SEO, NAP, Keywords, Fricción con analogías simples.

III. INSTRUCCIÓN CRÍTICA — AL FINAL DE CADA REPORTE:
Después del diccionario, agrega SIEMPRE esta línea exacta con el número del score de fricción que diste:
IGNITIA_SCORE: [número del 1 al 10]

IV. CONTROL:
- Si no encuentras algo: "No pude verificar este punto, favor de revisar manualmente".
- No digas que una web es bonita si no es funcional.`;

// ─── Markdown ──────────────────────────────────────────────────────
function getStyle(title) {
  if (!title) return { bg: "#0d1117", border: "#30363d", accent: "#8b949e", tag: "INFO" };
  if (title.includes("NOTAS") || title.includes("🛠")) return { bg: "#110a00", border: "#FF450055", accent: "#FF4500", tag: "SOLO CONSULTOR" };
  if (title.includes("REPORTE") || title.includes("CLIENTE") || title.includes("📄")) return { bg: "#00091a", border: "#1f6feb88", accent: "#58a6ff", tag: "PARA EL CLIENTE" };
  if (title.includes("DICCI") || title.includes("DUEÑOS") || title.includes("📚")) return { bg: "#001a0a", border: "#23863688", accent: "#3fb950", tag: "GLOSARIO" };
  return { bg: "#0d1117", border: "#30363d", accent: "#8b949e", tag: "INFO" };
}
function parseMarkdownSections(text) {
  const clean = text.replace(/IGNITIA_SCORE:\s*\d+(?:\.\d+)?/g, "").trim();
  const sections = [], lines = clean.split("\n");
  let current = null;
  for (const line of lines) {
    if (line.startsWith("## ")) { if (current) sections.push(current); current = { title: line.replace(/^## /, "").trim(), content: [] }; }
    else if (current) current.content.push(line);
    else { if (!sections.length) sections.push({ title: null, content: [] }); sections[0].content.push(line); }
  }
  if (current) sections.push(current);
  return sections.filter(s => s.title || s.content.join("").trim());
}
function renderMd(raw) {
  return raw
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, '<h4 style="font-size:13px;font-weight:700;margin:16px 0 8px">$1</h4>')
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*?<\/li>(\n|$))+/g, m => `<ul style="padding-left:18px;margin:8px 0">${m}</ul>`)
    .replace(/\n\n+/g, "</p><p style='margin-bottom:8px'>")
    .replace(/\n/g, "<br/>")
    .replace(/^/, "<p style='margin-bottom:8px'>")
    .replace(/$/, "</p>");
}

// ─── API loop ──────────────────────────────────────────────────────
async function runAuditLoop(apiMessages, apiKey, onStatus, systemOverride) {
  const MAX_TURNS = 12;
  let msgs = [...apiMessages];
  for (let turn = 0; turn < MAX_TURNS; turn++) {
    onStatus(turn === 0 ? "Conectando con el auditor..." : `Procesando búsqueda web (paso ${turn})...`);
    const res = await fetch("/api/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 4000, system: systemOverride || MASTER_PROMPT, tools: [{ type: "web_search_20250305", name: "web_search" }], messages: msgs }),
    });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err?.error?.message || `Error HTTP ${res.status}`); }
    const data = await res.json();
    const { content, stop_reason } = data;
    msgs = [...msgs, { role: "assistant", content }];
    if (stop_reason === "end_turn") {
      const text = content.filter(b => b.type === "text").map(b => b.text).join("\n").trim();
      if (!text) throw new Error("Respuesta vacía. Intenta de nuevo.");
      return text;
    }
    if (stop_reason === "tool_use") {
      const webResults = content.filter(b => b.type === "web_search_tool_result");
      if (webResults.length > 0) { onStatus("Analizando resultados..."); continue; }
      const toolUseBlocks = content.filter(b => b.type === "tool_use");
      if (toolUseBlocks.length > 0) msgs = [...msgs, { role: "user", content: toolUseBlocks.map(tu => ({ type: "tool_result", tool_use_id: tu.id, content: "OK" })) }];
      continue;
    }
    const fallback = content.filter(b => b.type === "text").map(b => b.text).join("\n").trim();
    if (fallback) return fallback;
    throw new Error(`Stop inesperado: ${stop_reason}`);
  }
  throw new Error("Demasiados pasos. Intenta con una consulta más específica.");
}

const STARTERS = [
  { icon: "🔍", label: "Auditar negocio", template: "🔍 Audita mi negocio: [Nombre] - [URL]" },
  { icon: "🎯", label: "Keywords reales", template: "🎯 ¿Por qué palabras clave me encuentra la gente? Mi negocio: [descripción y ciudad]" },
  { icon: "🚀", label: "Quick wins", template: "🚀 Dame 5 cambios rápidos para mejorar mi visibilidad. Mi sitio: [URL]" },
];

// ─── Score badge ───────────────────────────────────────────────────
function ScoreBadge({ score, size = "sm" }) {
  if (!score) return null;
  const color = score <= 4 ? "#E24B4A" : score <= 7 ? "#EF9F27" : "#639922";
  const bg = score <= 4 ? "#FCEBEB" : score <= 7 ? "#FAEEDA" : "#EAF3DE";
  const textColor = score <= 4 ? "#A32D2D" : score <= 7 ? "#854F0B" : "#3B6D11";
  const label = score <= 4 ? "Crítico" : score <= 7 ? "Regular" : "Bueno";
  return (
    <span style={{ background: bg, color: textColor, fontSize: size === "lg" ? 13 : 11, fontWeight: 600, padding: size === "lg" ? "4px 12px" : "2px 8px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
      {score}/10 · {label}
    </span>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────
function Dashboard({ onNewAudit, onSelectClient }) {
  const clients = loadClients();
  const history = loadHistory();
  const scored = history.filter(h => h.score);
  const avgScore = scored.length ? (scored.reduce((a, b) => a + b.score, 0) / scored.length).toFixed(1) : "—";
  const thisMonth = history.filter(h => { const d = new Date(h.id); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length;
  const improved = clients.filter(c => { const audits = getClientAudits(c.id).filter(a => a.score); if (audits.length < 2) return false; return audits[0].score > audits[1].score; }).length;

  const chartClients = clients.filter(c => c.lastScore).slice(0, 8);

  useEffect(() => {
    if (!chartClients.length || typeof window === "undefined") return;
    const existing = window.ignitiaChart;
    if (existing) existing.destroy();
    const ctx = document.getElementById("dashChart");
    if (!ctx || !window.Chart) return;
    window.ignitiaChart = new window.Chart(ctx, {
      type: "bar",
      data: {
        labels: chartClients.map(c => c.name.length > 12 ? c.name.slice(0, 12) + "…" : c.name),
        datasets: [{ data: chartClients.map(c => c.lastScore), backgroundColor: chartClients.map(c => c.lastScore <= 4 ? "#E24B4A" : c.lastScore <= 7 ? "#EF9F27" : "#639922"), borderRadius: 4 }]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 10, ticks: { stepSize: 2, color: "#666" }, grid: { color: "rgba(128,128,128,0.1)" } }, x: { ticks: { color: "#666", font: { size: 11 }, autoSkip: false, maxRotation: 30 }, grid: { display: false } } } }
    });
  }, [clients.length]);

  return (
    <div style={{ fontFamily: "'IBM Plex Mono',monospace", background: "#060a10", minHeight: "100vh", color: "#c9d1d9" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Space+Grotesk:wght@700&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#30363d;border-radius:4px}`}</style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js" />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
          <div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 20, color: "#e6edf3" }}>Dashboard</div>
            <div style={{ fontSize: 11, color: "#484f58", marginTop: 3 }}>Ignitia · SEO Auditor · Data-driven. Results-focused.</div>
          </div>
          <button onClick={onNewAudit} style={{ background: "#FF4500", border: "none", color: "#fff", padding: "10px 18px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700 }}>
            + Nueva auditoría
          </button>
        </div>

        {/* Metric cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Clientes activos", value: clients.length, color: "#e6edf3" },
            { label: "Auditorías este mes", value: thisMonth, color: "#e6edf3" },
            { label: "Score promedio", value: avgScore !== "—" ? `${avgScore}/10` : "—", color: avgScore <= 4 ? "#E24B4A" : avgScore <= 7 ? "#EF9F27" : "#3fb950" },
            { label: "Mejoraron este mes", value: improved, color: "#3fb950" },
          ].map(m => (
            <div key={m.label} style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 8, padding: "14px 16px" }}>
              <div style={{ fontSize: 11, color: "#484f58", marginBottom: 8 }}>{m.label}</div>
              <div style={{ fontSize: 22, fontWeight: 600, color: m.color }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Chart */}
        {chartClients.length > 0 && (
          <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, padding: "20px", marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#c9d1d9", marginBottom: 12 }}>Score de fricción por cliente</div>
            <div style={{ display: "flex", gap: 16, marginBottom: 12, fontSize: 11, color: "#484f58" }}>
              {[["#E24B4A", "Crítico (1-4)"], ["#EF9F27", "Regular (5-7)"], ["#639922", "Bueno (8-10)"]].map(([color, label]) => (
                <span key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: "inline-block" }} />{label}
                </span>
              ))}
            </div>
            <div style={{ position: "relative", height: 200 }}>
              <canvas id="dashChart" />
            </div>
          </div>
        )}

        {/* Client table */}
        <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ padding: "16px 20px", borderBottom: "1px solid #21262d", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#c9d1d9" }}>Todos los clientes</div>
            <div style={{ fontSize: 10, color: "#484f58" }}>{clients.length} registrados</div>
          </div>
          {clients.length === 0 ? (
            <div style={{ padding: "48px 20px", textAlign: "center", color: "#484f58" }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>👥</div>
              <div style={{ fontSize: 13 }}>Aún no tienes clientes guardados</div>
              <div style={{ fontSize: 11, marginTop: 6 }}>Haz una auditoría y guarda el negocio como cliente</div>
            </div>
          ) : (
            <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", tableLayout: "fixed" }}>
              <thead>
                <tr style={{ background: "#0a0e15" }}>
                  {["Cliente", "Sector", "Score", "Auditorías", "Última auditoría"].map((h, i) => (
                    <th key={h} style={{ textAlign: i >= 2 && i <= 3 ? "center" : "left", padding: "10px 16px", color: "#484f58", fontWeight: 400, width: ["28%","20%","18%","14%","20%"][i] }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map((client, i) => {
                  const audits = getClientAudits(client.id);
                  return (
                    <tr key={client.id} onClick={() => onSelectClient(client)}
                      style={{ borderTop: "1px solid #161b22", cursor: "pointer", transition: "background .15s" }}
                      onMouseOver={e => e.currentTarget.style.background = "#0d1420"}
                      onMouseOut={e => e.currentTarget.style.background = ""}>
                      <td style={{ padding: "12px 16px", color: "#e6edf3", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{client.name}</td>
                      <td style={{ padding: "12px 16px", color: "#484f58", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{client.sector}</td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>
                        {client.lastScore ? <ScoreBadge score={client.lastScore} /> : <span style={{ color: "#30363d", fontSize: 11 }}>Sin score</span>}
                      </td>
                      <td style={{ padding: "12px 16px", textAlign: "center", color: "#484f58" }}>{audits.length}</td>
                      <td style={{ padding: "12px 16px", color: "#484f58", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{client.lastAudit || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Modals ────────────────────────────────────────────────────────
function SaveClientModal({ onSave, onSkip, defaultName = "", defaultUrl = "" }) {
  const [name, setName] = useState(defaultName);
  const [url, setUrl] = useState(defaultUrl);
  const [sector, setSector] = useState("Otro");
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000bb", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 12, padding: 28, maxWidth: 400, width: "100%" }}>
        <div style={{ fontSize: 22, marginBottom: 8, textAlign: "center" }}>💾</div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16, color: "#e6edf3", textAlign: "center", marginBottom: 4 }}>¿Guardar como cliente?</div>
        <div style={{ fontSize: 12, color: "#484f58", textAlign: "center", marginBottom: 20 }}>Aparecerá en tu dashboard con su score</div>
        {[{ label: "NOMBRE", value: name, set: setName, placeholder: "Ej: Paseo Interlomas" }, { label: "URL", value: url, set: setUrl, placeholder: "Ej: https://paseointerlomas.mx" }].map(f => (
          <div key={f.label} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "#8b949e", marginBottom: 5, letterSpacing: 1 }}>{f.label}</div>
            <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
              style={{ width: "100%", background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: "9px 12px", color: "#c9d1d9", fontFamily: "inherit", fontSize: 12, outline: "none" }} />
          </div>
        ))}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "#8b949e", marginBottom: 5, letterSpacing: 1 }}>SECTOR</div>
          <select value={sector} onChange={e => setSector(e.target.value)}
            style={{ width: "100%", background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: "9px 12px", color: "#c9d1d9", fontFamily: "inherit", fontSize: 12, outline: "none" }}>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onSkip} style={{ flex: 1, background: "transparent", border: "1px solid #30363d", color: "#8b949e", padding: 10, borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>No por ahora</button>
          <button onClick={() => name.trim() && onSave({ name: name.trim(), url: url.trim(), sector })}
            style={{ flex: 1, background: "#FF4500", border: "none", color: "#fff", padding: 10, borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700 }}>Guardar →</button>
        </div>
      </div>
    </div>
  );
}

function ReauditModal({ client, onCompare, onFresh, onCancel }) {
  const audits = getClientAudits(client.id);
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000bb", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 12, padding: 28, maxWidth: 400, width: "100%" }}>
        <div style={{ fontSize: 22, marginBottom: 8, textAlign: "center" }}>🔄</div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16, color: "#e6edf3", textAlign: "center", marginBottom: 4 }}>Re-auditar {client.name}</div>
        <div style={{ fontSize: 12, color: "#484f58", textAlign: "center", marginBottom: 20 }}>{audits.length} auditoría{audits.length !== 1 ? "s" : ""} anterior{audits.length !== 1 ? "es" : ""}</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {audits.length > 0 && (
            <button onClick={onCompare} style={{ background: "#00091a", border: "1px solid #1f6feb88", color: "#58a6ff", padding: 12, borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, textAlign: "left" }}>
              📊 Comparar con auditoría anterior
              <div style={{ fontSize: 10, color: "#484f58", marginTop: 3, fontWeight: 400 }}>Claude analizará qué mejoró y qué sigue fallando</div>
            </button>
          )}
          <button onClick={onFresh} style={{ background: "#110a00", border: "1px solid #FF450055", color: "#FF4500", padding: 12, borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, textAlign: "left" }}>
            🔍 Auditoría nueva desde cero
            <div style={{ fontSize: 10, color: "#484f58", marginTop: 3, fontWeight: 400 }}>Reporte completo sin comparar</div>
          </button>
          <button onClick={onCancel} style={{ background: "transparent", border: "1px solid #21262d", color: "#484f58", padding: 10, borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

// ─── History panel ─────────────────────────────────────────────────
function HistoryPanel({ onClose, onLoad }) {
  const [history, setHistory] = useState(loadHistory());
  const clients = loadClients();
  const getClientName = id => { const c = clients.find(c => c.id === id); return c ? c.name : null; };
  const handleDelete = id => { const u = history.filter(e => e.id !== id); localStorage.setItem("ignitia_history", JSON.stringify(u)); setHistory(u); };
  return (
    <div style={{ position: "fixed", inset: 0, background: "#060a10", zIndex: 200, display: "flex", flexDirection: "column", fontFamily: "'IBM Plex Mono',monospace" }}>
      <div style={{ padding: "14px 24px", borderBottom: "1px solid #161b22", display: "flex", alignItems: "center", gap: 12, background: "#0d1117" }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: "#e6edf3" }}>📋 Historial · {history.length} auditorías</div>
        <button onClick={onClose} style={{ marginLeft: "auto", background: "transparent", border: "1px solid #21262d", color: "#8b949e", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}>← Volver</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", maxWidth: 820, width: "100%", margin: "0 auto" }}>
        {history.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 80, color: "#484f58" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
            <div>Aún no tienes auditorías guardadas</div>
          </div>
        ) : history.map(entry => (
          <div key={entry.id} style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, padding: "16px 18px", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <div style={{ fontSize: 10, color: "#484f58" }}>{entry.date}</div>
                  {getClientName(entry.clientId) && <div style={{ fontSize: 9, color: "#FF4500", background: "#FF450015", padding: "1px 6px", borderRadius: 4 }}>{getClientName(entry.clientId)}</div>}
                  {entry.score && <ScoreBadge score={entry.score} />}
                </div>
                <div style={{ fontSize: 13, color: "#c9d1d9", fontWeight: 600 }}>{entry.query}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => { onLoad(entry); onClose(); }} style={{ background: "#FF4500", border: "none", color: "#fff", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 600 }}>Ver →</button>
                <button onClick={() => handleDelete(entry.id)} style={{ background: "transparent", border: "1px solid #30363d", color: "#484f58", padding: "6px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}>🗑</button>
              </div>
            </div>
            <div style={{ fontSize: 11, color: "#484f58", background: "#161b22", borderRadius: 6, padding: "8px 12px" }}>{entry.result.slice(0, 180)}...</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────
function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("ignitia_api_key") || "");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showSetup, setShowSetup] = useState(!localStorage.getItem("ignitia_api_key"));
  const [screen, setScreen] = useState("dashboard");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [input, setInput] = useState("");
  const [saveModal, setSaveModal] = useState(null);
  const [reauditModal, setReauditModal] = useState(null);
  const [activeClient, setActiveClient] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const saveApiKey = () => {
    if (!apiKeyInput.startsWith("sk-ant-")) return alert("La API Key debe empezar con sk-ant-");
    localStorage.setItem("ignitia_api_key", apiKeyInput);
    setApiKey(apiKeyInput); setShowSetup(false);
  };

  const sendMessage = async (text, extraContext = "") => {
    const userText = (text !== undefined ? text : input).trim();
    if (!userText || loading) return;
    setInput("");
    const systemWithContext = extraContext ? MASTER_PROMPT + "\n\n" + extraContext : MASTER_PROMPT;
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const result = await runAuditLoop(newMessages.map(m => ({ role: m.role, content: m.content })), apiKey, setStatus, systemWithContext);
      setMessages(prev => [...prev, { role: "assistant", content: result }]);
      const score = extractScore(result);
      const clientId = activeClient ? activeClient.id : null;
      saveToHistory(userText, result, clientId, score);
      if (clientId && score) updateClientScore(clientId, score);
      if (!activeClient) setSaveModal({ query: userText, result });
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: `## ❌ Error\n\n**${e.message}**\n\n- Verifica tu API Key\n- Verifica que la URL esté completa` }]);
    }
    setLoading(false); setStatus("");
  };

  const handleSaveClient = ({ name, url, sector }) => {
    const clients = loadClients();
    const newClient = { id: Date.now(), name, url, sector, createdAt: new Date().toISOString() };
    const history = loadHistory();
    if (history[0]) { history[0].clientId = newClient.id; localStorage.setItem("ignitia_history", JSON.stringify(history)); if (history[0].score) { newClient.lastScore = history[0].score; newClient.lastAudit = history[0].date; } }
    saveClients([newClient, ...clients]);
    setActiveClient(newClient); setSaveModal(null);
  };

  const handleSelectClient = (client) => {
    setActiveClient(client); setScreen("chat");
    const audits = getClientAudits(client.id);
    if (audits.length > 0) setReauditModal(client);
    else { setMessages([]); setInput(`🔍 Audita mi negocio: ${client.name}${client.url ? " - " + client.url : ""}`); setTimeout(() => textareaRef.current?.focus(), 100); }
  };

  const handleCompare = () => {
    const audits = getClientAudits(reauditModal.id);
    const last = audits[0];
    setReauditModal(null); setMessages([]);
    const context = `CONTEXTO DE AUDITORÍA ANTERIOR (${last.date}):\n${last.result.slice(0, 1500)}\n\nINSTRUCCIÓN ESPECIAL: Compara con la anterior. Al final agrega:\n## 📈 COMPARACIÓN CON AUDITORÍA ANTERIOR\nIndica qué mejoró, qué empeoró y qué sigue igual.`;
    const query = `🔍 Re-audita y compara: ${reauditModal.name}${reauditModal.url ? " - " + reauditModal.url : ""}`;
    setTimeout(() => sendMessage(query, context), 100);
  };

  const handleFresh = () => {
    setReauditModal(null); setMessages([]);
    setInput(`🔍 Audita mi negocio: ${reauditModal.name}${reauditModal.url ? " - " + reauditModal.url : ""}`);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const historyCount = loadHistory().length;
  const clientsCount = loadClients().length;

  if (showSetup) return (
    <div style={{ fontFamily: "'IBM Plex Mono',monospace", background: "#060a10", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Space+Grotesk:wght@700&display=swap');*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ maxWidth: 420, width: "100%", background: "#0d1117", border: "1px solid #30363d", borderRadius: 12, padding: 32 }}>
        <div style={{ fontSize: 32, marginBottom: 12, textAlign: "center" }}>🔥</div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, color: "#e6edf3", textAlign: "center", marginBottom: 8 }}>Ignitia · SEO Auditor</div>
        <div style={{ fontSize: 12, color: "#484f58", textAlign: "center", marginBottom: 28, lineHeight: 1.6 }}>Ingresa tu API Key de Anthropic para comenzar.<br />Se guarda solo en tu navegador.</div>
        <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 6 }}>API KEY DE ANTHROPIC</div>
        <input type="password" placeholder="sk-ant-api03-..." value={apiKeyInput} onChange={e => setApiKeyInput(e.target.value)} onKeyDown={e => e.key === "Enter" && saveApiKey()}
          style={{ width: "100%", background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: "10px 14px", color: "#c9d1d9", fontFamily: "inherit", fontSize: 13, outline: "none", marginBottom: 16 }} />
        <button onClick={saveApiKey} style={{ width: "100%", background: "#FF4500", border: "none", borderRadius: 8, padding: 12, color: "#fff", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>COMENZAR →</button>
        <div style={{ fontSize: 10, color: "#30363d", textAlign: "center", marginTop: 14 }}>Consigue tu API Key en console.anthropic.com</div>
      </div>
    </div>
  );

  if (screen === "dashboard") return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Space+Grotesk:wght@700&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#30363d;border-radius:4px}`}</style>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js" />
      <div style={{ fontFamily: "'IBM Plex Mono',monospace", background: "#060a10", minHeight: "100vh" }}>
        <div style={{ padding: "14px 24px", borderBottom: "1px solid #161b22", display: "flex", alignItems: "center", gap: 12, background: "#0d1117", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg,#FF4500,#c43300)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🔥</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: "#e6edf3" }}>Ignitia · SEO Auditor</div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            {["chat","history"].map(s => (
              <button key={s} onClick={() => { if (s === "chat") { setMessages([]); setActiveClient(null); } setScreen(s); }}
                style={{ background: "transparent", border: "1px solid #21262d", color: "#484f58", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 10 }}>
                {s === "chat" ? "💬 Chat" : `📋 Historial (${historyCount})`}
              </button>
            ))}
            <button onClick={() => { localStorage.removeItem("ignitia_api_key"); setShowSetup(true); setApiKey(""); }}
              style={{ background: "transparent", border: "1px solid #21262d", color: "#484f58", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 10 }}>⚙ API Key</button>
          </div>
        </div>
        <Dashboard onNewAudit={() => { setMessages([]); setActiveClient(null); setScreen("chat"); }} onSelectClient={handleSelectClient} />
      </div>
    </>
  );

  if (screen === "history") return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Space+Grotesk:wght@700&display=swap');*{box-sizing:border-box;margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#30363d;border-radius:4px}`}</style>
      <HistoryPanel onClose={() => setScreen("dashboard")} onLoad={e => {   setMessages([{ role: "user", content: e.query }, { role: "assistant", content: e.result }]);   setActiveClient(null);   setTimeout(() => setScreen("chat"), 50); }} />
    </>
  );

  return (
    <div style={{ fontFamily: "'IBM Plex Mono',monospace", background: "#060a10", minHeight: "100vh", color: "#c9d1d9", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Space+Grotesk:wght@700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#30363d;border-radius:4px}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.6)}}
        @keyframes blink{50%{opacity:0}}
        .loading-bar{height:2px;border-radius:2px;background:linear-gradient(90deg,#FF4500,#58a6ff,#3fb950,#FF4500);background-size:300%;animation:shimmer 1.8s linear infinite}
        .anim{animation:fadeUp .3s ease both}
        .pulse-dot{width:7px;height:7px;border-radius:50%;background:#3fb950;display:inline-block;animation:pulse 2s ease infinite}
        .nav-btn{background:transparent;border:1px solid #21262d;color:#484f58;padding:5px 10px;border-radius:6px;cursor:pointer;font-family:inherit;font-size:10px;transition:all .2s}
        .nav-btn:hover{border-color:#FF4500;color:#FF4500}
        .starter-btn{background:#0d1117;border:1px solid #21262d;color:#8b949e;padding:10px 12px;border-radius:8px;cursor:pointer;font-family:inherit;font-size:11px;transition:all .2s;text-align:left}
        .starter-btn:hover{border-color:#FF4500;color:#FF4500;background:#1a0800}
        .send-btn{background:#FF4500;border:none;color:#fff;padding:10px 20px;border-radius:8px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;white-space:nowrap;transition:all .2s}
        .send-btn:hover:not(:disabled){background:#FF6A33;transform:translateY(-1px)}
        .send-btn:disabled{opacity:.3;cursor:not-allowed}
        .body-text p{font-size:13px;line-height:1.75;margin-bottom:8px}
        .body-text strong{font-weight:600}
        .body-text ul{padding-left:20px;margin:8px 0}
        .body-text li{font-size:13px;line-height:1.65;margin-bottom:5px}
        textarea{background:transparent;border:none;outline:none;color:#c9d1d9;font-family:inherit;font-size:13px;resize:none;width:100%;line-height:1.6}
        textarea::placeholder{color:#3d444d}
        select option{background:#161b22}
      `}</style>

      {saveModal && <SaveClientModal
        defaultName={saveModal.query.replace(/.*?:\s*/, "").split(" - ")[0] || ""}
        defaultUrl={saveModal.query.includes("http") ? saveModal.query.match(/https?:\/\/[^\s]+/)?.[0] || "" : ""}
        onSave={handleSaveClient} onSkip={() => setSaveModal(null)} />}
      {reauditModal && <ReauditModal client={reauditModal} onCompare={handleCompare} onFresh={handleFresh} onCancel={() => { setReauditModal(null); setActiveClient(null); }} />}

      <div style={{ padding: "14px 24px", borderBottom: "1px solid #161b22", display: "flex", alignItems: "center", gap: 12, background: "#0d1117", position: "sticky", top: 0, zIndex: 50 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg,#FF4500,#c43300)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🔥</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: "#e6edf3" }}>
            Ignitia · SEO Auditor {activeClient && <span style={{ fontSize: 11, color: "#FF4500", fontWeight: 400 }}>· {activeClient.name}</span>}
          </div>
          <div style={{ fontSize: 10, color: "#484f58", display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
            <span className="pulse-dot" /> Data-driven. Results-focused.
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {activeClient && <button className="nav-btn" onClick={() => { setActiveClient(null); setMessages([]); }} style={{ color: "#FF4500", borderColor: "#FF450055" }}>✕ {activeClient.name}</button>}
          <button className="nav-btn" onClick={() => setScreen("dashboard")}>📊 Dashboard</button>
          <button className="nav-btn" onClick={() => setScreen("history")}>📋 Historial ({historyCount})</button>
          <button className="nav-btn" onClick={() => { localStorage.removeItem("ignitia_api_key"); setShowSetup(true); setApiKey(""); }}>⚙ API Key</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px 8px", display: "flex", flexDirection: "column", gap: 24, maxWidth: 820, width: "100%", margin: "0 auto" }}>
        {messages.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "40px 20px" }} className="anim">
            <div style={{ fontSize: 44, marginBottom: 10 }}>🔥</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: "#e6edf3", marginBottom: 8 }}>
              {activeClient ? `Auditar ${activeClient.name}` : "Ignitia · SEO Auditor"}
            </div>
            <div style={{ fontSize: 13, color: "#484f58", maxWidth: 380, margin: "0 auto 32px", lineHeight: 1.6 }}>
              {activeClient ? `Sector: ${activeClient.sector} · ${getClientAudits(activeClient.id).length} auditorías previas` : "Auditorías digitales que encienden tu visibilidad."}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10, maxWidth: 600, margin: "0 auto 32px" }}>
              {STARTERS.map(s => (
                <button key={s.label} className="starter-btn" onClick={() => { setInput(s.template); textareaRef.current?.focus(); }}>
                  <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontWeight: 600, color: "#c9d1d9", marginBottom: 4 }}>{s.label}</div>
                  <div style={{ lineHeight: 1.4, opacity: .6, fontSize: 10 }}>{s.template}</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className="anim">
            {msg.role === "user" ? (
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "12px 12px 4px 12px", padding: "12px 16px", maxWidth: "75%" }}>
                  <div style={{ fontSize: 10, color: "#484f58", marginBottom: 6, letterSpacing: 1 }}>TÚ</div>
                  <div style={{ fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{msg.content}</div>
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontSize: 10, color: "#484f58", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#FF4500" }}>🔥</span> IGNITIA · REPORTE COMPLETO
                  {extractScore(msg.content) && <ScoreBadge score={extractScore(msg.content)} />}
                  <span style={{ marginLeft: "auto", fontSize: 9, color: "#30363d" }}>✓ Guardado</span>
                </div>
                {parseMarkdownSections(msg.content).map((section, si) => {
                  const s = getStyle(section.title);
                  return (
                    <div key={si} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: "18px 20px", marginBottom: 12 }}>
                      {section.title && (
                        <div style={{ marginBottom: 12 }}>
                          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, background: s.accent + "20", color: s.accent, padding: "3px 8px", borderRadius: 4 }}>{s.tag}</span>
                          <div style={{ fontSize: 14, fontWeight: 600, color: s.accent, marginTop: 8 }}>{section.title}</div>
                        </div>
                      )}
                      <div className="body-text" dangerouslySetInnerHTML={{ __html: renderMd(section.content.join("\n")) }} />
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="anim">
            <div style={{ fontSize: 10, color: "#484f58", marginBottom: 10 }}><span style={{ color: "#FF4500" }}>🔥</span> IGNITIA · ANALIZANDO</div>
            <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, padding: 20 }}>
              <div className="loading-bar" style={{ marginBottom: 14 }} />
              <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 10 }}>{status}</div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {["Rastreando sitio", "Verificando NAP", "Analizando keywords", "Comparando competidores"].map((t, i) => (
                  <span key={i} style={{ fontSize: 10, color: "#30363d", animation: `blink ${1 + i * 0.5}s step-end infinite` }}>{t}...</span>
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #161b22", background: "#0d1117", maxWidth: 820, width: "100%", margin: "0 auto" }}>
        {messages.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            {STARTERS.map(s => (
              <button key={s.label} className="starter-btn" style={{ padding: "5px 10px", fontSize: 10 }} onClick={() => { setInput(s.template); textareaRef.current?.focus(); }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "12px 14px" }}>
          <textarea ref={textareaRef} rows={2} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder={activeClient ? `Auditar ${activeClient.name}...` : "Ej: 🔍 Audita mi negocio: Ignitia - https://ignitia.mx"} />
          <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            {loading ? "AUDITANDO..." : "AUDITAR →"}
          </button>
        </div>
        <div style={{ fontSize: 9, color: "#21262d", textAlign: "center", marginTop: 8, letterSpacing: 1 }}>IGNITIA · SEO AUDITOR · DATA-DRIVEN. RESULTS-FOCUSED.</div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
