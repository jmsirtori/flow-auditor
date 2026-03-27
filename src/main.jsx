// Ignitia · SEO Auditor v2.0
import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";

const MASTER_PROMPT = `ROL: Eres el "Digital Growth Auditor", un estratega digital de élite. Tu misión es auditar ecosistemas digitales para encontrar "fugas de atención", falta de coherencia y debilidades de posicionamiento (SEO).

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
### 🎯 Tu Vitrina en Google
### 🔍 Los Baches en el Camino
### 🏗️ Tu Letrero Principal (H1)
### 🚀 Plan de Quick Wins (60 min)

## 📚 DICCIONARIO PARA DUEÑOS
Define H1, SEO, NAP, Keywords, Fricción con analogías simples.

III. CONTROL:
- Si no encuentras algo: "No pude verificar este punto, favor de revisar manualmente".
- No digas que una web es bonita si no es funcional.`;

function getStyle(title) {
  if (!title) return { bg: "#0d1117", border: "#30363d", accent: "#8b949e", tag: "INFO" };
  if (title.includes("NOTAS") || title.includes("🛠")) return { bg: "#110800", border: "#FF450055", accent: "#FF4500", tag: "SOLO CONSULTOR" };
  if (title.includes("REPORTE") || title.includes("CLIENTE") || title.includes("📄")) return { bg: "#00091a", border: "#1f6feb88", accent: "#58a6ff", tag: "PARA EL CLIENTE" };
  if (title.includes("DICCI") || title.includes("DUEÑOS") || title.includes("📚")) return { bg: "#001a0a", border: "#23863688", accent: "#3fb950", tag: "GLOSARIO" };
  return { bg: "#0d1117", border: "#30363d", accent: "#8b949e", tag: "INFO" };
}

function parseMarkdownSections(text) {
  const sections = [];
  const lines = text.split("\n");
  let current = null;
  for (const line of lines) {
    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { title: line.replace(/^## /, "").trim(), content: [] };
    } else if (current) {
      current.content.push(line);
    } else {
      if (!sections.length) sections.push({ title: null, content: [] });
      sections[0].content.push(line);
    }
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

async function runAuditLoop(apiMessages, apiKey, onStatus) {
  const MAX_TURNS = 12;
  let msgs = [...apiMessages];
  for (let turn = 0; turn < MAX_TURNS; turn++) {
    onStatus(turn === 0 ? "Conectando con el auditor..." : `Procesando búsqueda web (paso ${turn})...`);
    const res = await fetch("/api/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        system: MASTER_PROMPT,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: msgs,
      }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || `Error HTTP ${res.status}`);
    }
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
      if (toolUseBlocks.length > 0) {
        msgs = [...msgs, { role: "user", content: toolUseBlocks.map(tu => ({ type: "tool_result", tool_use_id: tu.id, content: "OK" })) }];
      }
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

function extractBusinessName(text) {
  const match = text.match(/(?:negocio:|audita|audita mi negocio:?)\s*([^-\n]+)/i);
  if (match) return match[1].trim();
  return text.slice(0, 40).trim();
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("es-MX", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function HistoryPanel({ history, onSelect, onDelete, onClose }) {
  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: 320,
      background: "#0d1117", borderLeft: "1px solid #21262d",
      display: "flex", flexDirection: "column", zIndex: 200,
      animation: "slideIn .2s ease",
    }}>
      <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>
      <div style={{ padding: "16px 20px", borderBottom: "1px solid #21262d", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: "#e6edf3" }}>📋 Historial</div>
          <div style={{ fontSize: 10, color: "#484f58", marginTop: 2 }}>{history.length} auditoría{history.length !== 1 ? "s" : ""} guardada{history.length !== 1 ? "s" : ""}</div>
        </div>
        <button onClick={onClose} style={{ background: "transparent", border: "none", color: "#484f58", cursor: "pointer", fontSize: 20 }}>×</button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {history.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#484f58", fontSize: 12 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📭</div>
            Aún no hay auditorías guardadas
          </div>
        ) : (
          history.map((item) => (
            <div key={item.id} style={{
              background: "#161b22", border: "1px solid #21262d",
              borderRadius: 8, padding: "12px 14px", marginBottom: 8,
              cursor: "pointer", transition: "border-color .2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#FF4500"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#21262d"}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div onClick={() => onSelect(item)} style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#e6edf3", marginBottom: 4 }}>{item.businessName}</div>
                  <div style={{ fontSize: 10, color: "#484f58" }}>{formatDate(item.timestamp)}</div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                  style={{ background: "transparent", border: "none", color: "#484f58", cursor: "pointer", fontSize: 14, padding: "0 0 0 8px" }}
                  title="Eliminar"
                >🗑</button>
              </div>
              <div onClick={() => onSelect(item)} style={{ fontSize: 10, color: "#30363d", marginTop: 6, lineHeight: 1.4 }}>
                {item.query.slice(0, 60)}...
              </div>
            </div>
          ))
        )}
      </div>

      {history.length > 0 && (
        <div style={{ padding: 12, borderTop: "1px solid #21262d" }}>
          <button
            onClick={() => { if (confirm("¿Borrar todo el historial?")) { localStorage.removeItem("ignitia_history"); onDelete("all"); } }}
            style={{ width: "100%", background: "transparent", border: "1px solid #30363d", color: "#484f58", padding: "8px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}
          >
            🗑 Borrar todo el historial
          </button>
        </div>
      )}
    </div>
  );
}

function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("ignitia_api_key") || "");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showSetup, setShowSetup] = useState(!localStorage.getItem("ignitia_api_key"));
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ignitia_history") || "[]"); }
    catch { return []; }
  });
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const saveToHistory = (query, result) => {
    const newItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      businessName: extractBusinessName(query),
      query,
      result,
    };
    const updated = [newItem, ...history].slice(0, 50);
    setHistory(updated);
    localStorage.setItem("ignitia_history", JSON.stringify(updated));
  };

  const deleteFromHistory = (id) => {
    if (id === "all") { setHistory([]); return; }
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem("ignitia_history", JSON.stringify(updated));
  };

  const loadFromHistory = (item) => {
    setMessages([
      { role: "user", content: item.query },
      { role: "assistant", content: item.result },
    ]);
    setShowHistory(false);
  };

  const saveApiKey = () => {
    if (!apiKeyInput.startsWith("sk-ant-")) return alert("La API Key debe empezar con sk-ant-");
    localStorage.setItem("ignitia_api_key", apiKeyInput);
    setApiKey(apiKeyInput);
    setShowSetup(false);
  };

  const sendMessage = async (text) => {
    const userText = (text !== undefined ? text : input).trim();
    if (!userText || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    try {
      const result = await runAuditLoop(
        newMessages.map(m => ({ role: m.role, content: m.content })),
        apiKey,
        setStatus
      );
      setMessages(prev => [...prev, { role: "assistant", content: result }]);
      saveToHistory(userText, result);
    } catch (e) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: `## ❌ Error\n\n**${e.message}**\n\n- Verifica que tu API Key sea correcta\n- Verifica que la URL esté completa`
      }]);
    }
    setLoading(false);
    setStatus("");
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  if (showSetup) return (
    <div style={{ fontFamily: "'IBM Plex Mono',monospace", background: "#060a10", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Space+Grotesk:wght@700&display=swap');*{box-sizing:border-box;margin:0;padding:0}`}</style>
      <div style={{ maxWidth: 420, width: "100%", background: "#0d1117", border: "1px solid #30363d", borderRadius: 12, padding: 32 }}>
        <div style={{ fontSize: 32, marginBottom: 12, textAlign: "center" }}>🔥</div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 18, color: "#e6edf3", textAlign: "center", marginBottom: 4 }}>Ignitia · SEO Auditor</div>
        <div style={{ fontSize: 11, color: "#FF4500", textAlign: "center", marginBottom: 24, letterSpacing: 1 }}>DATA-DRIVEN. RESULTS-FOCUSED.</div>
        <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 6 }}>API KEY DE ANTHROPIC</div>
        <input
          type="password"
          placeholder="sk-ant-api03-..."
          value={apiKeyInput}
          onChange={e => setApiKeyInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && saveApiKey()}
          style={{ width: "100%", background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: "10px 14px", color: "#c9d1d9", fontFamily: "inherit", fontSize: 13, outline: "none", marginBottom: 16 }}
        />
        <button onClick={saveApiKey} style={{ width: "100%", background: "#FF4500", border: "none", borderRadius: 8, padding: 12, color: "#fff", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
          ENCENDER AUDITOR →
        </button>
        <div style={{ fontSize: 10, color: "#30363d", textAlign: "center", marginTop: 14 }}>
          Consigue tu API Key en console.anthropic.com
        </div>
      </div>
    </div>
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
        .loading-bar{height:2px;border-radius:2px;background:linear-gradient(90deg,#FF4500,#ff6a33,#FF4500);background-size:300%;animation:shimmer 1.8s linear infinite}
        .anim{animation:fadeUp .3s ease both}
        .pulse-dot{width:7px;height:7px;border-radius:50%;background:#3fb950;display:inline-block;animation:pulse 2s ease infinite}
        .starter-btn{background:#0d1117;border:1px solid #21262d;color:#8b949e;padding:10px 12px;border-radius:8px;cursor:pointer;font-family:inherit;font-size:11px;transition:all .2s;text-align:left}
        .starter-btn:hover{border-color:#FF4500;color:#FF4500;background:#140900}
        .send-btn{background:#FF4500;border:none;color:#fff;padding:10px 20px;border-radius:8px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;white-space:nowrap;transition:all .2s}
        .send-btn:hover:not(:disabled){background:#FF6A33;transform:translateY(-1px)}
        .send-btn:disabled{opacity:.3;cursor:not-allowed}
        .body-text p{font-size:13px;line-height:1.75;margin-bottom:8px}
        .body-text strong{font-weight:600}
        .body-text ul{padding-left:20px;margin:8px 0}
        .body-text li{font-size:13px;line-height:1.65;margin-bottom:5px}
        textarea{background:transparent;border:none;outline:none;color:#c9d1d9;font-family:inherit;font-size:13px;resize:none;width:100%;line-height:1.6}
        textarea::placeholder{color:#3d444d}
        .history-btn{background:transparent;border:1px solid #21262d;color:#484f58;padding:6px 12px;border-radius:6px;cursor:pointer;font-family:inherit;font-size:10px;transition:all .2s;display:flex;align-items:center;gap:5px}
        .history-btn:hover{border-color:#FF4500;color:#FF4500}
      `}</style>

      {/* Header */}
      <div style={{ padding: "14px 24px", borderBottom: "1px solid #161b22", display: "flex", alignItems: "center", gap: 12, background: "#0d1117", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg,#FF4500,#c43300)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17 }}>🔥</div>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: "#e6edf3" }}>Ignitia · SEO Auditor</div>
          <div style={{ fontSize: 10, color: "#FF4500", marginTop: 2, letterSpacing: 1 }}>DATA-DRIVEN. RESULTS-FOCUSED.</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <button className="history-btn" onClick={() => setShowHistory(true)}>
            📋 Historial {history.length > 0 && <span style={{ background: "#FF4500", color: "#fff", borderRadius: 10, padding: "1px 6px", fontSize: 9 }}>{history.length}</span>}
          </button>
          <button onClick={() => { localStorage.removeItem("ignitia_api_key"); setShowSetup(true); setApiKey(""); }}
            style={{ background: "transparent", border: "1px solid #21262d", color: "#484f58", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 10 }}>
            ⚙ API Key
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px 8px", display: "flex", flexDirection: "column", gap: 24, maxWidth: 820, width: "100%", margin: "0 auto" }}>
        {messages.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "40px 20px" }} className="anim">
            <div style={{ fontSize: 44, marginBottom: 10 }}>🔥</div>
            <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: "#e6edf3", marginBottom: 8 }}>Ignitia · SEO Auditor</div>
            <div style={{ fontSize: 13, color: "#484f58", maxWidth: 380, margin: "0 auto 32px", lineHeight: 1.6 }}>
              Auditorías digitales que encienden tu visibilidad. Detecta fugas de atención, incoherencias de marca y debilidades SEO.
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
            {history.length > 0 && (
              <button className="history-btn" style={{ margin: "0 auto" }} onClick={() => setShowHistory(true)}>
                📋 Ver {history.length} auditoría{history.length !== 1 ? "s" : ""} guardada{history.length !== 1 ? "s" : ""}
              </button>
            )}
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
                <div style={{ fontSize: 10, color: "#484f58", marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: "#FF4500" }}>🔥</span> IGNITIA · REPORTE COMPLETO
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

      {/* Input */}
      <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #161b22", background: "#0d1117", maxWidth: 820, width: "100%", margin: "0 auto" }}>
        {messages.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            {STARTERS.map(s => (
              <button key={s.label} className="starter-btn" style={{ padding: "5px 10px", fontSize: 10 }}
                onClick={() => { setInput(s.template); textareaRef.current?.focus(); }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end", background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "12px 14px" }}>
          <textarea ref={textareaRef} rows={2} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey}
            placeholder="Ej: 🔍 Audita mi negocio: Ignitia - https://ignitia.mx" />
          <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
            {loading ? "AUDITANDO..." : "AUDITAR →"}
          </button>
        </div>
        <div style={{ fontSize: 9, color: "#21262d", textAlign: "center", marginTop: 8, letterSpacing: 1 }}>
          IGNITIA · SEO AUDITOR · DATA-DRIVEN. RESULTS-FOCUSED.
        </div>
      </div>

      {/* History Panel */}
      {showHistory && (
        <>
          <div onClick={() => setShowHistory(false)} style={{ position: "fixed", inset: 0, background: "#00000066", zIndex: 199 }} />
          <HistoryPanel
            history={history}
            onSelect={loadFromHistory}
            onDelete={deleteFromHistory}
            onClose={() => setShowHistory(false)}
          />
        </>
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
