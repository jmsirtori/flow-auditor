// Ignitia · SEO Auditor v11.0
import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ─── Constants ─────────────────────────────────────────────────────
const SECTORS = [
  "Restaurante / Food & Beverage",
  "Retail / Tienda física",
  "eCommerce",
  "Salud / Clínica / Médico",
  "Belleza / Spa / Estética",
  "Educación",
  "Servicios profesionales",
  "Bienes raíces",
  "Automotriz",
  "Turismo / Hotelería",
  "Fitness / Deporte",
  "Tecnología",
  "Construcción / Arquitectura",
  "Legal / Jurídico",
  "Otro",
];

const MODELS = [
  { id: "claude-sonnet-4-6", label: "Sonnet 4.6", cost: "$0.05/audit", color: "#FF4500" },
  { id: "claude-haiku-4-5-20251001", label: "Haiku 4.5", cost: "$0.01/audit", color: "#3fb950" },
];

// ─── Lang ──────────────────────────────────────────────────────────
const LangCtx = createContext({ lang: "es", t: k => k });
const useLang = () => useContext(LangCtx);

// ─── Supabase helpers ──────────────────────────────────────────────
async function dbGetClients(userId) {
  const { data } = await supabase.from("clients").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  return data || [];
}
async function dbCreateClient(payload, userId) {
  const { data } = await supabase.from("clients").insert([{ ...payload, user_id: userId }]).select().single();
  return data;
}
async function dbUpdateClient(id, updates, userId) {
  await supabase.from("clients").update(updates).eq("id", id).eq("user_id", userId);
}
async function dbGetAudits(userId) {
  const { data } = await supabase.from("audits").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(100);
  return data || [];
}
async function dbSaveAudit(payload, userId) {
  const { data } = await supabase.from("audits").insert([{ ...payload, user_id: userId }]).select().single();
  return data;
}
async function dbDeleteAudit(id) {
  await supabase.from("audits").delete().eq("id", id);
}
async function dbGetClientAudits(clientId) {
  const { data } = await supabase.from("audits").select("*").eq("client_id", clientId).order("created_at", { ascending: false });
  return data || [];
}

// ─── Master Prompt ─────────────────────────────────────────────────
function buildPrompt(lang, pagespeedData, useSentiment) {
  const es = lang !== "en";

  const intro = es
    ? `Eres un especialista en estrategia digital, conversión y presencia online para Ignitia. Responde completamente en español.`
    : `You are a digital strategy specialist for Ignitia. Respond entirely in English.`;

  const sequence = es
    ? `Analiza el negocio en este orden exacto:
1. BUSCAR — Encuentra información real online: sitio web, Google Maps, redes sociales.
2. IDENTIFICAR — Determina el giro y mercado objetivo.
3. AUDITAR — Evalúa presencia digital: NAP, SEO, velocidad, contenido, redes, GBP.
4. PRIORIZAR — Selecciona los problemas de mayor impacto.`
    : `Analyze the business in this exact order:
1. SEARCH — Find real information online: website, Google Maps, social media.
2. IDENTIFY — Determine the business type and target market.
3. AUDIT — Evaluate digital presence: NAP, SEO, speed, content, social, GBP.
4. PRIORITIZE — Select the highest-impact problems.`;

  const pagespeedSection = pagespeedData
    ? (es
      ? `\nDATOS REALES DE PAGESPEED (usa estos valores exactos, no estimes):
- Performance Móvil: ${pagespeedData.mobile.performance}/100
- Performance Desktop: ${pagespeedData.desktop.performance}/100
- LCP: ${pagespeedData.mobile.lcp} | FCP: ${pagespeedData.mobile.fcp}
- CLS: ${pagespeedData.mobile.cls} | TBT: ${pagespeedData.mobile.fid}
- Speed Index: ${pagespeedData.mobile.speedIndex}
- SEO Score: ${pagespeedData.mobile.seo}/100`
      : `\nREAL PAGESPEED DATA (use these exact values, do not estimate):
- Mobile Performance: ${pagespeedData.mobile.performance}/100
- Desktop Performance: ${pagespeedData.desktop.performance}/100
- LCP: ${pagespeedData.mobile.lcp} | FCP: ${pagespeedData.mobile.fcp}
- CLS: ${pagespeedData.mobile.cls} | TBT: ${pagespeedData.mobile.fid}
- Speed Index: ${pagespeedData.mobile.speedIndex}
- SEO Score: ${pagespeedData.mobile.seo}/100`)
    : "";

  const structure = es
    ? `Usa EXACTAMENTE estas secciones en tu respuesta:

## 🛠️ NOTAS INTERNAS (solo para el consultor)
- Análisis técnico: errores, inconsistencias NAP, métricas SEO
${useSentiment ? "- Sentiment de reseñas Google: qué elogian, qué critican, patrones\n" : ""}- Gancho de venta: punto débil principal

## 📄 REPORTE PARA EL CLIENTE

### ⚡ Score de Presencia Digital
[Número del 1 al 10, donde 1=presencia muy débil y 10=presencia excelente]
Explica brevemente qué significa este score para el negocio.

### 🎯 Tu Vitrina en Google
[Cómo aparece el negocio en búsquedas]

### 🔍 Problemas Detectados
[Tabla con: Problema | Gravedad | Impacto]

### 📍 Google Business Profile
[Evalúa: fotos, horarios, reseñas, Q&A, publicaciones. Puntúa cada aspecto del 1-10]

### 🏗️ Letrero Principal (H1 y Título)
[Análisis y recomendación]

### 🚀 Quick Wins
Presenta exactamente 5 acciones en este formato:

| Acción | Dónde | Tiempo | Impacto |
|--------|-------|--------|---------|
| ...    | ...   | ...    | ...     |

QW1: [descripción de la acción 1]
QW2: [descripción de la acción 2]
QW3: [descripción de la acción 3]
QW4: [descripción de la acción 4]
QW5: [descripción de la acción 5]

## 🏆 BENCHMARK COMPETITIVO
[2 competidores principales en Google Top 3]

## 📚 GLOSARIO
Define estos términos con analogías simples para dueños de negocio:
- SEO, NAP, H1, Keywords, Score de Presencia Digital, Google Business Profile
${pagespeedData ? "- LCP, FCP, CLS, TBT, Speed Index, Performance Score, Core Web Vitals\n" : ""}- CTR, Conversión, Fricción Digital`
    : `Use EXACTLY these sections in your response:

## 🛠️ INTERNAL NOTES (consultant only)
- Technical analysis: errors, NAP inconsistencies, SEO metrics
${useSentiment ? "- Google Reviews sentiment: what they praise, criticize, patterns\n" : ""}- Sales hook: main weak point

## 📄 CLIENT REPORT

### ⚡ Digital Presence Score
[Number from 1 to 10, where 1=very weak presence and 10=excellent presence]
Briefly explain what this score means for the business.

### 🎯 Your Google Showcase
[How the business appears in searches]

### 🔍 Detected Problems
[Table: Problem | Severity | Impact]

### 📍 Google Business Profile
[Evaluate: photos, hours, reviews, Q&A, posts. Score each aspect 1-10]

### 🏗️ Main Sign (H1 and Title)
[Analysis and recommendation]

### 🚀 Quick Wins
Present exactly 5 actions in this format:

| Action | Where | Time | Impact |
|--------|-------|------|--------|
| ...    | ...   | ...  | ...    |

QW1: [description of action 1]
QW2: [description of action 2]
QW3: [description of action 3]
QW4: [description of action 4]
QW5: [description of action 5]

## 🏆 COMPETITIVE BENCHMARK
[2 main competitors in Google Top 3]

## 📚 GLOSSARY
Define these terms with simple analogies for business owners:
- SEO, NAP, H1, Keywords, Digital Presence Score, Google Business Profile
${pagespeedData ? "- LCP, FCP, CLS, TBT, Speed Index, Performance Score, Core Web Vitals\n" : ""}- CTR, Conversion, Digital Friction`;

  const antiHallucination = es
    ? `\nREGLAS ANTI-ALUCINACIÓN (obligatorias):
1. Solo presenta como hecho lo que encontraste en búsqueda web. Cita la fuente: "947k visitas/mes (Similarweb, Feb 2026)".
2. Si inferiste algo, dilo: "Estimado basado en [fuente/observación]..."
3. Si no encontraste un dato: "No pude verificar: [dato] — favor revisar manualmente."
4. NUNCA inventes métricas, rankings, reseñas o cifras de tráfico sin fuente verificable.
5. No uses conocimiento de tu entrenamiento para llenar vacíos — solo lo que el web search devolvió.`
    : `\nANTI-HALLUCINATION RULES (mandatory):
1. Only present as fact what you found via web search. Always cite the source: "947k visits/month (Similarweb, Feb 2026)".
2. If you inferred something, say so: "Estimated based on [source/observation]..."
3. If you couldn't find data: "Could not verify: [data point] — please review manually."
4. NEVER invent metrics, rankings, reviews or traffic figures without a verifiable source.
5. Do not use training data to fill gaps — only use what web search returned in this session.`;

  const mandatoryTags = es
    ? `\nTAGS OBLIGATORIOS — incluye estos EXACTAMENTE al final de tu respuesta, en líneas propias:
IGNITIA_SCORE: [número entero del 1 al 10]
IGNITIA_SECTOR: [sector específico detectado, máximo 4 palabras]

Ejemplo:
IGNITIA_SCORE: 6
IGNITIA_SECTOR: Clínica dental`
    : `\nMANDATORY TAGS — include these EXACTLY at the end of your response, on their own lines:
IGNITIA_SCORE: [integer from 1 to 10]
IGNITIA_SECTOR: [specific detected sector, max 4 words]

Example:
IGNITIA_SCORE: 6
IGNITIA_SECTOR: Dental clinic`;

  return `${intro}\n\n${sequence}${pagespeedSection}\n\n${structure}${antiHallucination}${mandatoryTags}`;
}

// ─── Parsers ───────────────────────────────────────────────────────
function parseScore(text) {
  const m = text.match(/IGNITIA_SCORE:\s*(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : null;
}
function parseSector(text) {
  const m = text.match(/IGNITIA_SECTOR:\s*([^\n]+)/);
  return m ? m[1].trim() : null;
}
function parseQuickWins(text) {
  return text.split("\n").filter(l => /^QW\d+:\s*.+/.test(l)).map(l => l.replace(/^QW\d+:\s*/, "").trim());
}
function cleanForDisplay(text) {
  return text.replace(/IGNITIA_SCORE:\s*\d+(?:\.\d+)?/g, "").replace(/IGNITIA_SECTOR:\s*[^\n]+/g, "").replace(/QW\d+:\s*[^\n]+/g, "").trim();
}

// ─── Markdown renderer ─────────────────────────────────────────────
function renderMarkdown(raw) {
  const lines = raw.split("\n");
  let html = "";
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const safe = line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const fmt = s => s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/\*(.+?)\*/g, "<em>$1</em>");

    if (line.startsWith("### ")) {
      html += `<h4 style="font-size:12px;font-weight:700;margin:14px 0 6px;color:#dfe2ec;text-transform:uppercase;letter-spacing:.08em">${fmt(safe.slice(4))}</h4>`;
      i++; continue;
    }
    if (line.trim().startsWith("|") && lines[i + 1]?.trim().startsWith("|---")) {
      const headers = line.trim().split("|").filter(c => c.trim()).map(c => c.trim());
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(lines[i].trim().split("|").filter(c => c.trim()).map(c => c.trim()));
        i++;
      }
      html += `<div style="overflow-x:auto;margin:10px 0;-webkit-overflow-scrolling:touch"><table style="width:100%;border-collapse:collapse;font-size:11px;min-width:400px"><thead><tr style="border-bottom:1px solid #31353c">${headers.map(h => `<th style="text-align:left;padding:7px 10px;color:#484f58;font-weight:700;text-transform:uppercase;letter-spacing:.05em;white-space:nowrap">${h}</th>`).join("")}</tr></thead><tbody>${rows.map((row, ri) => `<tr style="border-bottom:1px solid #171c22;background:${ri % 2 === 0 ? "#ffffff05" : "transparent"}">${row.map(cell => {
        const colors = { "Alto": "#E24B4A", "High": "#E24B4A", "Crítico": "#E24B4A", "Critical": "#E24B4A", "Medio": "#d29922", "Medium": "#d29922", "Bajo": "#484f58", "Low": "#484f58" };
        const c = colors[cell];
        return `<td style="padding:7px 10px;color:#dfe2ec;vertical-align:top">${c ? `<span style="background:${c}22;color:${c};padding:2px 8px;border-radius:2px;font-size:10px;font-weight:700;text-transform:uppercase">${cell}</span>` : fmt(cell.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"))}</td>`;
      }).join("")}</tr>`).join("")}</tbody></table></div>`;
      continue;
    }
    if (line.startsWith("- ")) { html += `<li style="font-size:12px;line-height:1.7;margin-bottom:4px;margin-left:16px;color:#dfe2ec">${fmt(safe.slice(2))}</li>`; i++; continue; }
    if (!line.trim()) { html += "<br/>"; i++; continue; }
    html += `<p style="font-size:12px;line-height:1.75;margin-bottom:6px;color:#dfe2ec">${fmt(safe)}</p>`;
    i++;
  }
  return html;
}

// ─── Section styles ────────────────────────────────────────────────
function getSectionStyle(title) {
  if (!title) return { bg: "#171c22", border: "#31353c", accent: "#a2c9ff", tag: "INFO" };
  if (/NOTAS|INTERNAL|🛠/.test(title)) return { bg: "#1a0f00", border: "#FF450044", accent: "#FF4500", tag: "SOLO CONSULTOR" };
  if (/REPORTE|REPORT|📄/.test(title)) return { bg: "#0a1220", border: "#a2c9ff33", accent: "#a2c9ff", tag: "PARA EL CLIENTE" };
  if (/BENCH|🏆/.test(title)) return { bg: "#110f1a", border: "#d5bbff33", accent: "#d5bbff", tag: "BENCHMARK" };
  if (/GLOSARIO|GLOSSARY|📚/.test(title)) return { bg: "#0a1a0a", border: "#3fb95033", accent: "#3fb950", tag: "GLOSARIO" };
  return { bg: "#171c22", border: "#31353c", accent: "#a2c9ff", tag: "INFO" };
}

// ─── Audit loop ────────────────────────────────────────────────────
async function runAudit(messages, onStatus, systemPrompt, model) {
  const MAX = 12;
  let msgs = [...messages];
  let totalIn = 0, totalOut = 0, totalCost = 0;

  for (let turn = 0; turn < MAX; turn++) {
    onStatus(turn === 0 ? "connecting" : `step:${turn}`);
    const res = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        max_tokens: model.includes("haiku") ? 2000 : 4000,
        system: systemPrompt,
        tools: [{ type: "web_search_20250305", name: "web_search" }],
        messages: msgs,
      }),
    });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(e?.error?.message || `HTTP ${res.status}`); }
    const data = await res.json();
    const { content, stop_reason } = data;
    if (data._cost) { totalIn += data._cost.input_tokens; totalOut += data._cost.output_tokens; totalCost += data._cost.cost; }
    msgs = [...msgs, { role: "assistant", content }];

    if (stop_reason === "end_turn") {
      const text = content.filter(b => b.type === "text").map(b => b.text).join("\n").trim();
      if (!text) throw new Error("Respuesta vacía");
      return { text, tokens: { input: totalIn, output: totalOut, cost: parseFloat(totalCost.toFixed(5)) } };
    }
    if (stop_reason === "tool_use") {
      const searches = content.filter(b => b.type === "web_search_tool_result");
      if (searches.length) { onStatus("searching"); continue; }
      const tools = content.filter(b => b.type === "tool_use");
      if (tools.length) msgs = [...msgs, { role: "user", content: tools.map(t => ({ type: "tool_result", tool_use_id: t.id, content: "OK" })) }];
      continue;
    }
    const fb = content.filter(b => b.type === "text").map(b => b.text).join("\n").trim();
    if (fb) return { text: fb, tokens: { input: totalIn, output: totalOut, cost: parseFloat(totalCost.toFixed(5)) } };
    throw new Error(`Stop inesperado: ${stop_reason}`);
  }
  throw new Error("Demasiados pasos.");
}

// ─── PageSpeed ─────────────────────────────────────────────────────
async function fetchPageSpeed(url) {
  try {
    const res = await fetch("/api/pagespeed", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url }) });
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

// ─── Global styles ─────────────────────────────────────────────────
const G = `
@font-face{font-family:'Supply';src:url('https://fonts.cdnfonts.com/s/77402/Supply-Regular.woff') format('woff');}
*{box-sizing:border-box;margin:0;padding:0}
body{background:#060a10;color:#dfe2ec;font-family:'Cordia New',monospace}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#171c22}::-webkit-scrollbar-thumb{background:#31353c;border-radius:2px}
@keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
@keyframes blink{50%{opacity:0}}
input::placeholder,textarea::placeholder{color:#484f58}
`;

// ─── Score display ─────────────────────────────────────────────────
function ScoreHero({ score }) {
  if (!score) return null;
  const color = score <= 3 ? "#E24B4A" : score <= 6 ? "#d29922" : score <= 8 ? "#3fb950" : "#a2c9ff";
  const label = score <= 3 ? "Muy débil" : score <= 6 ? "En desarrollo" : score <= 8 ? "Bueno" : "Excelente";
  return (
    <div style={{ background: `${color}10`, border: `1px solid ${color}40`, borderRadius: 10, padding: "16px 20px", marginBottom: 14, display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{ textAlign: "center", flexShrink: 0 }}>
        <div style={{ fontFamily: "'Supply',monospace", fontWeight: 700, fontSize: 48, color, lineHeight: 1 }}>{score}</div>
        <div style={{ fontFamily: "monospace", fontSize: 9, color: "#484f58", textTransform: "uppercase", marginTop: 2 }}>/10</div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: "'Supply',monospace", fontWeight: 700, fontSize: 15, color, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
        <div style={{ height: 6, background: "#21262d", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ height: "100%", background: color, borderRadius: 3, width: `${score * 10}%`, transition: "width 1s ease" }} />
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 9, color: "#484f58", marginTop: 4 }}>1 = MUY DÉBIL · 10 = EXCELENTE</div>
      </div>
    </div>
  );
}

function ScoreBadge({ score }) {
  if (!score) return <span style={{ color: "#484f58", fontSize: 11 }}>—</span>;
  const color = score <= 3 ? "#E24B4A" : score <= 6 ? "#d29922" : "#3fb950";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 4, background: `${color}15`, border: `1px solid ${color}40` }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
      <span style={{ color, fontWeight: 700, fontSize: 11, fontFamily: "monospace" }}>{score}/10</span>
    </span>
  );
}

// ─── Quick Wins table ──────────────────────────────────────────────
function QuickWinsTable({ wins }) {
  if (!wins.length) return null;
  return (
    <div style={{ background: "#0f141a", border: "1px solid #21262d", borderRadius: 8, padding: 16, marginBottom: 12 }}>
      <div style={{ fontFamily: "monospace", fontSize: 9, color: "#484f58", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 10 }}>🚀 Quick Wins</div>
      {wins.map((w, i) => (
        <div key={i} style={{ display: "flex", gap: 10, padding: "8px 0", borderBottom: i < wins.length - 1 ? "1px solid #161b22" : "none" }}>
          <span style={{ fontFamily: "monospace", fontSize: 10, fontWeight: 700, color: "#FF4500", flexShrink: 0, marginTop: 1 }}>#{i + 1}</span>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#c9d1d9", lineHeight: 1.5 }}>{w}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Report sections ───────────────────────────────────────────────
function ReportSections({ text, clientMode }) {
  const clean = cleanForDisplay(text);
  const sections = [];
  let current = null;
  for (const line of clean.split("\n")) {
    if (line.startsWith("## ")) {
      if (current) sections.push(current);
      current = { title: line.replace(/^## /, "").trim(), lines: [] };
    } else if (current) current.lines.push(line);
    else { if (!sections.length) sections.push({ title: null, lines: [] }); sections[0].lines.push(line); }
  }
  if (current) sections.push(current);

  const visible = clientMode
    ? sections.filter(s => !s.title || !/NOTAS|INTERNAL|🛠|GLOSARIO|GLOSSARY|📚/.test(s.title))
    : sections;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {visible.filter(s => s.title || s.lines.join("").trim()).map((s, i) => {
        const st = getSectionStyle(s.title);
        return (
          <div key={i} style={{ background: st.bg, border: `1px solid ${st.border}`, borderRadius: 8, padding: "14px 18px" }}>
            {s.title && (
              <div style={{ marginBottom: 10 }}>
                <span style={{ fontFamily: "monospace", fontSize: 8, fontWeight: 700, letterSpacing: ".2em", background: `${st.accent}20`, color: st.accent, padding: "2px 8px", textTransform: "uppercase" }}>{st.tag}</span>
                <div style={{ fontFamily: "'Supply',monospace", fontSize: 12, fontWeight: 700, color: st.accent, marginTop: 6, textTransform: "uppercase" }}>{s.title}</div>
              </div>
            )}
            <div dangerouslySetInnerHTML={{ __html: renderMarkdown(s.lines.join("\n")) }} />
          </div>
        );
      })}
    </div>
  );
}

// ─── Modals ────────────────────────────────────────────────────────
function SaveClientModal({ defaultName, defaultUrl, defaultSector, onSave, onSkip }) {
  const [name, setName] = useState(defaultName || "");
  const [url, setUrl] = useState(defaultUrl || "");
  const [sector, setSector] = useState(defaultSector || "");
  const [customSector, setCustomSector] = useState("");
  const isOther = sector === "Otro";
  const finalSector = isOther ? customSector : sector;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#0f141a", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10, padding: 28, width: "100%", maxWidth: 420 }}>
        <div style={{ fontFamily: "'Supply',monospace", fontWeight: 700, fontSize: 17, color: "#fff", textTransform: "uppercase", marginBottom: 4 }}>¿Guardar como cliente?</div>
        <div style={{ fontFamily: "monospace", fontSize: 11, color: "#484f58", marginBottom: 22 }}>Aparecerá en tu dashboard con el score de esta auditoría</div>

        {[{ label: "NOMBRE", value: name, set: setName, placeholder: "Ej: Paseo Interlomas" }, { label: "URL", value: url, set: setUrl, placeholder: "Ej: https://paseointerlomas.mx" }].map(f => (
          <div key={f.label} style={{ marginBottom: 18 }}>
            <div style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: ".2em", color: "#484f58", marginBottom: 6 }}>{f.label}</div>
            <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder} style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "7px 0", color: "#fff", fontFamily: "monospace", fontSize: 12, outline: "none" }} />
          </div>
        ))}

        <div style={{ marginBottom: isOther ? 10 : 22 }}>
          <div style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: ".2em", color: "#484f58", marginBottom: 6 }}>
            SECTOR {defaultSector && <span style={{ color: "#3fb950", fontSize: 8 }}>✓ AUTO-DETECTADO</span>}
          </div>
          <select value={sector} onChange={e => setSector(e.target.value)} style={{ width: "100%", background: "#171c22", border: "1px solid #31353c", borderRadius: 4, padding: "8px 10px", color: sector ? "#fff" : "#484f58", fontFamily: "monospace", fontSize: 12, outline: "none" }}>
            <option value="">Selecciona un sector...</option>
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {isOther && (
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: ".2em", color: "#484f58", marginBottom: 6 }}>ESPECIFICA EL SECTOR</div>
            <input value={customSector} onChange={e => setCustomSector(e.target.value)} placeholder="Ej: Galería de arte contemporáneo" style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "7px 0", color: "#fff", fontFamily: "monospace", fontSize: 12, outline: "none" }} />
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onSkip} style={{ flex: 1, background: "transparent", border: "1px solid #31353c", color: "#484f58", padding: 10, cursor: "pointer", fontFamily: "monospace", fontSize: 11, textTransform: "uppercase", borderRadius: 6 }}>No por ahora</button>
          <button onClick={() => name.trim() && onSave({ name: name.trim(), url: url.trim(), sector: finalSector.trim() })} style={{ flex: 1, background: "#FF4500", border: "none", color: "#fff", padding: 10, cursor: "pointer", fontFamily: "'Supply',monospace", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", borderRadius: 6 }}>Guardar →</button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ onConfirm }) {
  const [confirming, setConfirming] = useState(false);
  if (confirming) return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      <button onClick={() => { onConfirm(); setConfirming(false); }} style={{ background: "#E24B4A22", border: "1px solid #E24B4A", color: "#E24B4A", cursor: "pointer", fontSize: 9, fontFamily: "monospace", fontWeight: 700, padding: "2px 7px", borderRadius: 3, textTransform: "uppercase" }}>Sí</button>
      <button onClick={() => setConfirming(false)} style={{ background: "transparent", border: "1px solid #31353c", color: "#484f58", cursor: "pointer", fontSize: 9, fontFamily: "monospace", padding: "2px 7px", borderRadius: 3 }}>No</button>
    </div>
  );
  return <button onClick={() => setConfirming(true)} style={{ background: "none", border: "none", color: "#484f58", cursor: "pointer", fontSize: 13, padding: "0 4px" }} onMouseOver={e => e.currentTarget.style.color = "#E24B4A"} onMouseOut={e => e.currentTarget.style.color = "#484f58"}>🗑</button>;
}

function Toast({ msg, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 500, display: "flex", alignItems: "center", gap: 10, background: "#171c22", border: "1px solid #3fb95044", borderRadius: 6, padding: "10px 18px", whiteSpace: "nowrap", boxShadow: "0 0 30px rgba(63,185,80,0.1)" }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3fb950", display: "inline-block" }} />
      <span style={{ color: "#3fb950", fontSize: 11, fontWeight: 700, fontFamily: "monospace", textTransform: "uppercase", letterSpacing: ".1em" }}>{msg}</span>
      <span onClick={onClose} style={{ color: "#484f58", fontSize: 16, cursor: "pointer", marginLeft: 6 }}>×</span>
    </div>
  );
}

// ─── Login ─────────────────────────────────────────────────────────
function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const submit = async () => {
    if (!email || !pass) return setErr("Completa ambos campos");
    setLoading(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) setErr("Credenciales incorrectas");
    setLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "#060a10" }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: "linear-gradient(135deg,#FF4500,#c43300)", borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, margin: "0 auto 14px", boxShadow: "0 8px 24px rgba(255,69,0,0.3)" }}>🔥</div>
          <div style={{ fontFamily: "'Supply',monospace", fontWeight: 700, fontSize: 32, color: "#fff", textTransform: "uppercase", letterSpacing: ".1em" }}>Ignitia</div>
          <div style={{ fontFamily: "monospace", fontSize: 10, color: "#484f58", textTransform: "uppercase", letterSpacing: ".2em", marginTop: 4 }}>Data-driven. Results-focused.</div>
        </div>
        <div style={{ background: "#0f141a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 12, padding: 32 }}>
          {[{ label: "Email", type: "email", value: email, set: setEmail, ph: "usuario@ignitia.io" }, { label: "Contraseña", type: "password", value: pass, set: setPass, ph: "••••••••" }].map(f => (
            <div key={f.label} style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: ".2em", color: "#484f58", marginBottom: 7 }}>{f.label}</div>
              <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder={f.ph} style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "9px 0", color: "#fff", fontFamily: "monospace", fontSize: 13, outline: "none" }} />
            </div>
          ))}
          {err && <div style={{ background: "rgba(232,75,74,0.1)", border: "1px solid rgba(232,75,74,0.3)", borderRadius: 4, padding: "9px 12px", color: "#E24B4A", fontSize: 11, fontFamily: "monospace", marginBottom: 18 }}>{err}</div>}
          <button onClick={submit} disabled={loading} style={{ width: "100%", background: loading ? "#7a2200" : "#FF4500", border: "none", borderRadius: 8, padding: 13, color: "#fff", fontFamily: "'Supply',monospace", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", textTransform: "uppercase", letterSpacing: ".2em" }}>
            {loading ? "Verificando..." : "Ejecutar Login →"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Sidebar ───────────────────────────────────────────────────────
function Sidebar({ view, setView, session, onLogout }) {
  const nav = [{ id: "dashboard", icon: "▦", label: "Vista General" }, { id: "chat", icon: ">_", label: "Nueva Auditoría" }, { id: "history", icon: "◷", label: "Historial" }];
  return (
    <aside style={{ width: 220, position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 40, background: "#0f141a", borderRight: "1px solid rgba(255,69,0,0.1)", display: "flex", flexDirection: "column", paddingTop: 72 }}>
      <div style={{ padding: "0 20px 18px" }}>
        <div style={{ fontFamily: "'Supply',monospace", fontWeight: 700, fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#FF4500" }}>Ignitia</div>
        <div style={{ fontFamily: "monospace", fontSize: 9, color: "#484f58", marginTop: 2 }}>v11.0-STABLE</div>
      </div>
      <nav style={{ flex: 1, padding: "0 10px" }}>
        {nav.map(item => (
          <button key={item.id} onClick={() => setView(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 14px", border: "none", borderRight: `3px solid ${view === item.id ? "#FF4500" : "transparent"}`, background: view === item.id ? "#31353c" : "transparent", color: view === item.id ? "#dfe2ec" : "rgba(223,226,236,0.4)", cursor: "pointer", fontFamily: "monospace", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 2, transition: "all .15s", textAlign: "left" }}>
            <span style={{ fontSize: 12, opacity: 0.7 }}>{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: "14px 20px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ fontSize: 10, color: "#484f58", fontFamily: "monospace", marginBottom: 10, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session?.user?.email}</div>
        <button onClick={onLogout} style={{ background: "transparent", border: "1px solid #31353c", color: "#484f58", padding: "4px 10px", borderRadius: 4, cursor: "pointer", fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", width: "100%" }}>Cerrar Sesión</button>
      </div>
    </aside>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────
function Dashboard({ clients, history, onNewAudit, onViewClient }) {
  const thisMonth = history.filter(h => { const d = new Date(h.created_at), n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).length;
  const scored = history.filter(h => h.score);
  const avg = scored.length ? (scored.reduce((a, b) => a + parseFloat(b.score), 0) / scored.length).toFixed(1) : null;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: "'Supply',monospace", fontWeight: 700, fontSize: 30, color: "#fff", textTransform: "uppercase", marginBottom: 4 }}>Vista General</div>
        <div style={{ fontFamily: "monospace", fontSize: 9, color: "#484f58", textTransform: "uppercase", letterSpacing: ".2em" }}>IGNITIA v11.0</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12, marginBottom: 28 }}>
        {[
          { label: "Clientes", value: clients.length, color: "#FF4500" },
          { label: "Auditorías este mes", value: thisMonth, color: "#dfe2ec" },
          { label: "Score promedio", value: avg ? `${avg}/10` : "—", color: avg ? (avg <= 3 ? "#E24B4A" : avg <= 6 ? "#d29922" : "#3fb950") : "#484f58" },
        ].map((s, i) => (
          <div key={i} style={{ background: "#171c22", borderLeft: `4px solid ${s.color}`, padding: "14px 18px" }}>
            <div style={{ fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: ".15em", color: "#484f58", marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: "'Supply',monospace", fontWeight: 700, fontSize: 28, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {clients.length === 0 ? (
        <div style={{ background: "#171c22", border: "1px dashed #31353c", borderRadius: 8, padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔥</div>
          <div style={{ fontFamily: "'Supply',monospace", fontWeight: 700, fontSize: 15, color: "#fff", textTransform: "uppercase", marginBottom: 8 }}>Haz tu primera auditoría</div>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: "#484f58", marginBottom: 22, lineHeight: 1.7 }}>Ingresa el nombre y URL de un negocio para generar tu primer reporte de visibilidad digital</div>
          <button onClick={onNewAudit} style={{ background: "#FF4500", border: "none", color: "#fff", padding: "10px 24px", cursor: "pointer", fontFamily: "'Supply',monospace", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", borderRadius: 6 }}>+ Iniciar Auditoría</button>
        </div>
      ) : (
        <div style={{ background: "#0f141a", borderRadius: 6, overflow: "hidden", border: "1px solid #21262d" }}>
          <div style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <div style={{ fontFamily: "'Supply',monospace", fontWeight: 700, fontSize: 14, textTransform: "uppercase" }}>Libro Mayor</div>
            <button onClick={onNewAudit} style={{ background: "#FF4500", border: "none", color: "#fff", padding: "6px 14px", cursor: "pointer", fontFamily: "'Supply',monospace", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", borderRadius: 4 }}>+ Nueva</button>
          </div>
          <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", minWidth: 480 }}>
              <thead>
                <tr style={{ background: "#060a10" }}>
                  {["Cliente", "Sector", "Score", "Última Auditoría", ""].map(h => (
                    <th key={h} style={{ padding: "9px 16px", textAlign: "left", fontFamily: "monospace", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".15em", color: "#484f58" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map(c => (
                  <tr key={c.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ fontWeight: 700, fontSize: 13, color: "#dfe2ec" }}>{c.name}</div>
                      <div style={{ fontSize: 9, color: "#484f58", marginTop: 2 }}>{c.url?.replace("https://", "")}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ background: "#31353c", padding: "3px 8px", fontSize: 9, color: "#484f58", textTransform: "uppercase", borderRadius: 3 }}>{c.sector || "—"}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}><ScoreBadge score={c.last_score} /></td>
                    <td style={{ padding: "14px 16px", fontSize: 10, color: "#484f58" }}>{c.last_audit || "—"}</td>
                    <td style={{ padding: "14px 16px", textAlign: "right" }}>
                      <button onClick={() => onViewClient(c)} style={{ background: "none", border: "none", color: "#FF4500", fontFamily: "monospace", fontSize: 11, fontWeight: 700, textTransform: "uppercase", cursor: "pointer", letterSpacing: ".1em" }}>Ver →</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ padding: "8px 20px", background: "#060a10", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
            <span style={{ fontFamily: "monospace", fontSize: 9, color: "#484f58", textTransform: "uppercase" }}>Mostrando {clients.length} entidades activas</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── History ───────────────────────────────────────────────────────
function History({ history, clients, onLoad, onDelete }) {
  const [search, setSearch] = useState("");
  const getName = id => clients.find(c => c.id === id)?.name || null;
  const filtered = history.filter(e => !search || e.query.toLowerCase().includes(search.toLowerCase()) || (getName(e.client_id) || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Supply',monospace", fontWeight: 700, fontSize: 28, color: "#fff", textTransform: "uppercase" }}>Historial</div>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: "#484f58", marginTop: 4 }}>{history.length} auditorías</div>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filtrar..." style={{ background: "#171c22", border: "none", borderBottom: "2px solid rgba(255,255,255,0.1)", padding: "8px 12px", color: "#fff", fontFamily: "monospace", fontSize: 11, outline: "none", width: 200, borderRadius: "4px 4px 0 0" }} />
      </div>
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: "#484f58" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
          <div style={{ fontFamily: "monospace", fontSize: 11, textTransform: "uppercase" }}>{search ? "Sin resultados" : "Sin auditorías registradas"}</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.map(e => (
            <div key={e.id} style={{ background: "#171c22", borderRadius: 6, border: "1px solid rgba(255,255,255,0.03)", padding: "14px 18px", display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
              <div style={{ minWidth: 90 }}>
                <div style={{ fontFamily: "monospace", fontSize: 9, color: "#484f58", textTransform: "uppercase", marginBottom: 3 }}>Fecha</div>
                <div style={{ fontFamily: "monospace", fontSize: 11 }}>{new Date(e.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" })}</div>
              </div>
              <div style={{ minWidth: 100 }}>
                <div style={{ fontFamily: "monospace", fontSize: 9, color: "#484f58", textTransform: "uppercase", marginBottom: 3 }}>Cliente</div>
                {getName(e.client_id) ? <span style={{ background: "#31353c", padding: "2px 8px", fontFamily: "monospace", fontSize: 10, color: "#FF4500", fontWeight: 700, textTransform: "uppercase", borderRadius: 3 }}>{getName(e.client_id)}</span> : <span style={{ color: "#484f58", fontSize: 10 }}>—</span>}
              </div>
              <div style={{ minWidth: 80 }}>
                <div style={{ fontFamily: "monospace", fontSize: 9, color: "#484f58", textTransform: "uppercase", marginBottom: 3 }}>Score</div>
                <ScoreBadge score={e.score} />
              </div>
              <div style={{ flex: 1, minWidth: 120, overflow: "hidden" }}>
                <div style={{ fontFamily: "monospace", fontSize: 9, color: "#484f58", textTransform: "uppercase", marginBottom: 3 }}>Consulta</div>
                <div style={{ fontFamily: "monospace", fontSize: 10, color: "rgba(255,255,255,0.4)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>"{e.query}"</div>
              </div>
              {e.cost && (
                <div>
                  <div style={{ fontFamily: "monospace", fontSize: 9, color: "#484f58", textTransform: "uppercase", marginBottom: 3 }}>Costo</div>
                  <div style={{ fontFamily: "monospace", fontSize: 11, color: "#3fb950" }}>${e.cost.toFixed(4)}</div>
                </div>
              )}
              <div style={{ display: "flex", gap: 12, alignItems: "center", flexShrink: 0 }}>
                <button onClick={() => onLoad(e)} style={{ background: "none", border: "none", color: "#FF4500", fontFamily: "monospace", fontSize: 11, fontWeight: 700, textTransform: "uppercase", cursor: "pointer" }}>Ver</button>
                <DeleteConfirm onConfirm={() => onDelete(e.id)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Chat ──────────────────────────────────────────────────────────
function Chat({ session, clients, history, onClientsChange, onHistoryChange }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [saveModal, setSaveModal] = useState(null);
  const [toast, setToast] = useState(null);
  const [activeClient, setActiveClient] = useState(null);
  const [clientMode, setClientMode] = useState(false);
  const [model, setModel] = useState(() => localStorage.getItem("ignitia_model") || "claude-sonnet-4-6");
  const [usePageSpeed, setUsePageSpeed] = useState(false);
  const [useSentiment, setUseSentiment] = useState(false);
  const [addCtx, setAddCtx] = useState(false);
  const [ctxInput, setCtxInput] = useState("");
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const statusLabel = s => {
    if (!s) return "";
    if (s === "connecting") return "Conectando con el auditor...";
    if (s === "searching") return "Procesando búsqueda web...";
    if (s === "pagespeed") return "Obteniendo métricas de velocidad...";
    if (s.startsWith("step:")) return `Analizando resultados (paso ${s.split(":")[1]})...`;
    return s;
  };

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput(""); setAddCtx(false); setCtxInput("");
    const newMsgs = [...messages, { role: "user", content: q }];
    setMessages(newMsgs);
    setLoading(true);

    let psData = null;
    if (usePageSpeed) {
      const urlMatch = q.match(/https?:\/\/[^\s]+/);
      if (urlMatch) { setStatus("pagespeed"); psData = await fetchPageSpeed(urlMatch[0]); }
    }

    const prompt = buildPrompt("es", psData, useSentiment);

    try {
      const { text: result, tokens } = await runAudit(newMsgs.map(m => ({ role: m.role, content: m.content })), setStatus, prompt, model);
      const score = parseScore(result);
      const sector = parseSector(result);
      const clientId = activeClient?.id || null;

      const saved = await dbSaveAudit({ query: q, result, score: score || null, client_id: clientId, input_tokens: tokens?.input || null, output_tokens: tokens?.output || null, cost: tokens?.cost || null, model }, session.user.id);

      if (clientId && score) {
        await dbUpdateClient(clientId, { last_score: score, last_audit: new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }) }, session.user.id);
        const freshClients = await dbGetClients(session.user.id);
        onClientsChange(freshClients);
      }

      const freshHistory = await dbGetAudits(session.user.id);
      onHistoryChange(freshHistory);

      setMessages(prev => [...prev, { role: "assistant", content: result, auditId: saved?.id, score }]);

      if (!activeClient && score) setSaveModal({ query: q, result, score, sector });

    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: `## ❌ Error\n\n**${e.message}**\n\n- Verifica tu conexión\n- Verifica que la URL esté completa` }]);
    }
    setLoading(false); setStatus("");
  };

  const STARTERS = [
    { icon: "🔍", label: "Auditar negocio", fields: [{ key: "nombre", label: "NOMBRE", ph: "Ej: Paseo Interlomas" }, { key: "url", label: "URL", ph: "Ej: https://paseointerlomas.mx" }, { key: "ctx", label: "CONTEXTO (opcional)", ph: "Ej: presupuesto bajo, enfocarse en Instagram...", multi: true }], build: v => `🔍 Audita mi negocio: ${v.nombre} - ${v.url}${v.ctx ? `\n\nContexto: ${v.ctx}` : ""}` },
    { icon: "🎯", label: "Keywords reales", fields: [{ key: "negocio", label: "NEGOCIO Y CIUDAD", ph: "Ej: Dentista en Naucalpan, CDMX" }], build: v => `🎯 ¿Por qué palabras clave me encuentra la gente? Mi negocio: ${v.negocio}` },
    { icon: "🚀", label: "Quick Wins", fields: [{ key: "url", label: "URL DEL SITIO", ph: "Ej: https://tusitio.mx" }, { key: "ctx", label: "CONTEXTO (opcional)", ph: "Ej: negocio nuevo, sin presupuesto...", multi: true }], build: v => `🚀 Dame 5 cambios rápidos para mejorar mi visibilidad. Mi sitio: ${v.url}${v.ctx ? `\n\nContexto: ${v.ctx}` : ""}` },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 100px)" }}>
      {saveModal && (
        <SaveClientModal
          defaultName={saveModal.query.match(/:\s*([^-\n]+)/)?.[1]?.trim() || ""}
          defaultUrl={saveModal.query.match(/https?:\/\/[^\s]+/)?.[0] || ""}
          defaultSector={saveModal.sector || ""}
          onSave={async ({ name, url, sector }) => {
            const freshHistory = await dbGetAudits(session.user.id);
            const lastAudit = freshHistory[0];
            const saved = await dbCreateClient({ name, url, sector, last_score: saveModal.score || null, last_audit: saveModal.score ? new Date().toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" }) : null }, session.user.id);
            if (saved && lastAudit && !lastAudit.client_id) {
              await supabase.from("audits").update({ client_id: saved.id }).eq("id", lastAudit.id);
            }
            const freshClients = await dbGetClients(session.user.id);
            const freshHistory2 = await dbGetAudits(session.user.id);
            onClientsChange(freshClients);
            onHistoryChange(freshHistory2);
            setActiveClient(saved);
            setSaveModal(null);
            setToast(`${name} guardado en tu dashboard`);
          }}
          onSkip={() => setSaveModal(null)}
        />
      )}

      {activeClient && (
        <div style={{ padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", marginBottom: 12, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: "monospace", fontSize: 9, color: "#484f58", textTransform: "uppercase" }}>Active_Audit:</span>
          <span style={{ fontFamily: "'Supply',monospace", fontWeight: 700, fontSize: 13, color: "#FF4500", textTransform: "uppercase" }}>{activeClient.name}</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button onClick={() => setClientMode(m => !m)} style={{ background: clientMode ? "#FF450022" : "transparent", border: `1px solid ${clientMode ? "#FF4500" : "#31353c"}`, color: clientMode ? "#FF4500" : "#484f58", padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontFamily: "monospace", fontSize: 9, textTransform: "uppercase" }}>
              {clientMode ? "Modo cliente: ON" : "Modo cliente: OFF"}
            </button>
            <button onClick={() => { setActiveClient(null); setMessages([]); }} style={{ background: "transparent", border: "1px solid rgba(255,69,0,0.3)", color: "#FF4500", padding: "3px 10px", borderRadius: 4, cursor: "pointer", fontFamily: "monospace", fontSize: 9, textTransform: "uppercase" }}>✕ Limpiar</button>
          </div>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", paddingBottom: 140 }}>
        {messages.length === 0 && !loading && (
          <div style={{ paddingTop: 20 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontFamily: "'Supply',monospace", fontWeight: 700, fontSize: 22, color: "#fff", textTransform: "uppercase", marginBottom: 14 }}>
                {activeClient ? `Auditoría: ${activeClient.name}` : "Ignitia SEO Console"}
              </div>

              {/* Model + module selector */}
              <div style={{ background: "#0f141a", border: "1px solid #21262d", borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
                <div style={{ fontFamily: "monospace", fontSize: 9, color: "#484f58", textTransform: "uppercase", letterSpacing: ".15em", marginBottom: 10 }}>Configuración</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                  {MODELS.map(m => (
                    <button key={m.id} onClick={() => { setModel(m.id); localStorage.setItem("ignitia_model", m.id); }} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", padding: "7px 12px", border: `1px solid ${model === m.id ? m.color : "#31353c"}`, borderRadius: 6, background: model === m.id ? `${m.color}15` : "transparent", cursor: "pointer", transition: "all .15s" }}>
                      <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: model === m.id ? m.color : "#dfe2ec" }}>{m.label}</span>
                      <span style={{ fontFamily: "monospace", fontSize: 9, color: model === m.id ? m.color : "#484f58" }}>{m.cost}</span>
                    </button>
                  ))}
                </div>
                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                  {[{ key: "ps", label: "PageSpeed Insights", val: usePageSpeed, set: setUsePageSpeed }, { key: "se", label: "Análisis de reseñas", val: useSentiment, set: setUseSentiment }].map(m => (
                    <div key={m.key} onClick={() => m.set(v => !v)} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                      <div style={{ width: 30, height: 16, borderRadius: 8, background: m.val ? "#FF4500" : "#31353c", position: "relative", transition: "background .2s", flexShrink: 0 }}>
                        <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: m.val ? 16 : 2, transition: "left .2s" }} />
                      </div>
                      <span style={{ fontFamily: "monospace", fontSize: 10, color: m.val ? "#dfe2ec" : "#484f58" }}>{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
                {STARTERS.map(s => <StarterCard key={s.label} {...s} onSubmit={v => send(s.build(v))} />)}
              </div>
            </div>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {messages.map((msg, i) => {
            const isBot = msg.role === "assistant";
            const score = isBot ? parseScore(msg.content) : null;
            const wins = isBot ? parseQuickWins(msg.content) : [];
            const isLast = i === messages.length - 1;

            return (
              <div key={i}>
                {msg.role === "user" ? (
                  <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                    <div style={{ maxWidth: "65%", background: "#31353c", padding: "10px 14px", borderRadius: "10px 10px 0 10px" }}>
                      <div style={{ fontFamily: "monospace", fontSize: 12, lineHeight: 1.65, color: "#dfe2ec", whiteSpace: "pre-wrap" }}>{msg.content}</div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#FF4500", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 13 }}>🔥</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "monospace", fontSize: 9, color: "#FF4500", textTransform: "uppercase", letterSpacing: ".15em", fontWeight: 700 }}>Ignitia AI // Reporte</span>
                        {score && <ScoreBadge score={score} />}
                        <span style={{ marginLeft: "auto", fontFamily: "monospace", fontSize: 9, color: "#484f58" }}>✓ Guardado</span>
                      </div>
                      {score && <ScoreHero score={score} />}
                      {wins.length > 0 && <QuickWinsTable wins={wins} />}
                      <ReportSections text={msg.content} clientMode={clientMode} />
                      {isLast && (
                        <div style={{ marginTop: 8 }}>
                          {!addCtx ? (
                            <button onClick={() => setAddCtx(true)} style={{ background: "transparent", border: "1px solid #31353c", color: "#484f58", padding: "5px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "monospace", fontSize: 10, textTransform: "uppercase" }}>+ Agregar contexto</button>
                          ) : (
                            <div style={{ background: "#0f141a", border: "1px solid #21262d", borderRadius: 8, padding: 12 }}>
                              <textarea value={ctxInput} onChange={e => setCtxInput(e.target.value)} placeholder="Ej: también tienen TikTok con 50k seguidores, ¿cómo cambian las recomendaciones?" rows={2} style={{ width: "100%", background: "transparent", border: "none", outline: "none", color: "#dfe2ec", fontFamily: "monospace", fontSize: 12, resize: "none", lineHeight: 1.6 }} />
                              <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "flex-end" }}>
                                <button onClick={() => { setAddCtx(false); setCtxInput(""); }} style={{ background: "transparent", border: "1px solid #31353c", color: "#484f58", padding: "4px 10px", borderRadius: 5, cursor: "pointer", fontFamily: "monospace", fontSize: 10 }}>✕</button>
                                <button onClick={() => ctxInput.trim() && send(ctxInput)} style={{ background: "#FF4500", border: "none", color: "#fff", padding: "4px 14px", borderRadius: 5, cursor: "pointer", fontFamily: "monospace", fontSize: 10, fontWeight: 700 }}>Enviar →</button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#FF4500", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🔥</div>
              <div style={{ flex: 1, background: "#171c22", border: "1px solid rgba(255,69,0,0.1)", borderRadius: 8, padding: "14px 18px" }}>
                <div style={{ height: 2, background: "linear-gradient(90deg,#FF4500,#ffb5a0,#FF4500)", backgroundSize: "200%", animation: "shimmer 2s linear infinite", marginBottom: 10, borderRadius: 2 }} />
                <div style={{ fontFamily: "monospace", fontSize: 11, color: "#FF4500" }}>{statusLabel(status)}</div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div style={{ position: "fixed", bottom: 0, left: 220, right: 0, padding: "12px 28px 16px", background: "linear-gradient(to top,#060a10 60%,transparent)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", background: "#171c22", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: "7px 7px 7px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#484f58", fontSize: 12, flexShrink: 0 }}>{">"}_</span>
          <textarea ref={inputRef} rows={2} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder={activeClient ? `Auditar ${activeClient.name}...` : "Consultar sistema o iniciar nueva auditoría..."} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#dfe2ec", fontFamily: "monospace", fontSize: 12, resize: "none", lineHeight: 1.6, textTransform: "uppercase" }} />
          <button onClick={() => send()} disabled={loading || !input.trim()} style={{ background: loading ? "#7a2200" : "#FF4500", border: "none", color: "#fff", padding: "9px 18px", cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontFamily: "'Supply',monospace", fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", borderRadius: 7, opacity: !input.trim() ? 0.3 : 1, flexShrink: 0, transition: "all .2s" }}>
            {loading ? "Auditando..." : "Auditar ⚡"}
          </button>
        </div>
      </div>

      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

// ─── StarterCard ───────────────────────────────────────────────────
function StarterCard({ icon, label, fields, onSubmit }) {
  const [open, setOpen] = useState(false);
  const [vals, setVals] = useState({});
  if (!open) return (
    <button onClick={() => setOpen(true)} style={{ background: "#171c22", border: "1px solid transparent", borderRadius: 10, padding: 14, cursor: "pointer", textAlign: "left", width: "100%", transition: "all .15s" }} onMouseOver={e => { e.currentTarget.style.borderColor = "rgba(255,69,0,0.2)"; e.currentTarget.style.background = "#1a1f26"; }} onMouseOut={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "#171c22"; }}>
      <div style={{ fontSize: 18, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontFamily: "'Supply',monospace", fontWeight: 700, fontSize: 11, textTransform: "uppercase", color: "#dfe2ec", marginBottom: 2 }}>{label}</div>
      <div style={{ fontFamily: "monospace", fontSize: 9, color: "#484f58" }}>Haz clic para configurar</div>
    </button>
  );
  return (
    <div style={{ background: "#171c22", border: "1px solid rgba(255,69,0,0.2)", borderRadius: 10, padding: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ fontFamily: "monospace", fontSize: 10, color: "#FF4500", fontWeight: 700, textTransform: "uppercase" }}>{label}</span>
        <button onClick={() => setOpen(false)} style={{ marginLeft: "auto", background: "transparent", border: "none", color: "#484f58", cursor: "pointer", fontSize: 15 }}>×</button>
      </div>
      {fields.map(f => (
        <div key={f.key} style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: "monospace", fontSize: 8, color: "#484f58", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".15em" }}>{f.label}</div>
          {f.multi
            ? <textarea value={vals[f.key] || ""} onChange={e => setVals(v => ({ ...v, [f.key]: e.target.value }))} placeholder={f.ph} rows={2} style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "5px 0", color: "#dfe2ec", fontFamily: "monospace", fontSize: 11, outline: "none", resize: "none" }} />
            : <input value={vals[f.key] || ""} onChange={e => setVals(v => ({ ...v, [f.key]: e.target.value }))} onKeyDown={e => e.key === "Enter" && onSubmit(vals)} placeholder={f.ph} style={{ width: "100%", background: "transparent", border: "none", borderBottom: "1px solid rgba(255,255,255,0.1)", padding: "5px 0", color: "#dfe2ec", fontFamily: "monospace", fontSize: 11, outline: "none" }} />
          }
        </div>
      ))}
      <button onClick={() => onSubmit(vals)} style={{ background: "#FF4500", border: "none", color: "#fff", padding: "7px", cursor: "pointer", fontFamily: "'Supply',monospace", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".1em", marginTop: 6, borderRadius: 5, width: "100%" }}>Auditar →</button>
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────
function App() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [view, setView] = useState("dashboard");
  const [clients, setClients] = useState([]);
  const [history, setHistory] = useState([]);
  const [chatKey, setChatKey] = useState(0);
  const [viewingAudit, setViewingAudit] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setAuthLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    dbGetClients(session.user.id).then(setClients);
    dbGetAudits(session.user.id).then(setHistory);
  }, [session]);

  const handleViewClient = async (client) => {
    const audits = await dbGetClientAudits(client.id);
    if (audits.length > 0) {
      setViewingAudit({ client, audit: audits[0] });
      setView("view_audit");
    } else {
      setChatKey(k => k + 1);
      setView("chat");
    }
  };

  const handleDeleteAudit = async (id) => {
    await dbDeleteAudit(id);
    const fresh = await dbGetAudits(session.user.id);
    setHistory(fresh);
  };

  if (authLoading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#060a10" }}><style>{G}</style><div style={{ fontFamily: "monospace", fontSize: 11, color: "#484f58", textTransform: "uppercase" }}>Cargando...</div></div>;

  return (
    <LangCtx.Provider value={{ lang: "es", t: k => k }}>
      <style>{G}</style>
      {!session ? <Login /> : (
        <div style={{ minHeight: "100vh", background: "#060a10" }}>
          {/* TopBar */}
          <nav style={{ position: "fixed", top: 0, left: 0, right: 0, height: 62, zIndex: 50, background: "rgba(15,20,26,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,69,0,0.12)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 22px" }}>
            <div onClick={() => setView("dashboard")} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
              <div style={{ width: 30, height: 30, background: "linear-gradient(135deg,#FF4500,#c43300)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15 }}>🔥</div>
              <span style={{ fontFamily: "'Supply',monospace", fontWeight: 700, fontSize: 15, color: "#dfe2ec", textTransform: "uppercase", letterSpacing: ".1em" }}>Ignitia</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#3fb950", boxShadow: "0 0 6px rgba(63,185,80,0.5)" }} />
              <span style={{ fontFamily: "monospace", fontSize: 9, color: "#484f58", textTransform: "uppercase" }}>v11.0</span>
            </div>
          </nav>

          <Sidebar view={view} setView={v => { setView(v); if (v === "chat") setChatKey(k => k + 1); }} session={session} onLogout={() => supabase.auth.signOut()} />

          {/* Main content */}
          <main style={{ marginLeft: 220, paddingTop: 62, minHeight: "100vh", width: "calc(100% - 220px)" }}>
            <div style={{ padding: "28px 28px 0", maxWidth: 1000, margin: "0 auto", width: "100%", boxSizing: "border-box" }}>

              {view === "dashboard" && (
                <Dashboard
                  clients={clients}
                  history={history}
                  onNewAudit={() => { setChatKey(k => k + 1); setView("chat"); }}
                  onViewClient={handleViewClient}
                />
              )}

              {view === "history" && (
                <History
                  history={history}
                  clients={clients}
                  onLoad={e => { setViewingAudit({ audit: e }); setView("view_audit"); }}
                  onDelete={handleDeleteAudit}
                />
              )}

              {view === "chat" && (
                <Chat
                  key={chatKey}
                  session={session}
                  clients={clients}
                  history={history}
                  onClientsChange={setClients}
                  onHistoryChange={setHistory}
                />
              )}

              {view === "view_audit" && viewingAudit && (() => {
                const { client, audit } = viewingAudit;
                const score = parseScore(audit.result);
                const wins = parseQuickWins(audit.result);
                return (
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22, flexWrap: "wrap" }}>
                      <button onClick={() => setView(client ? "dashboard" : "history")} style={{ background: "transparent", border: "1px solid #31353c", color: "#484f58", padding: "5px 12px", borderRadius: 5, cursor: "pointer", fontFamily: "monospace", fontSize: 10, textTransform: "uppercase" }}>← Volver</button>
                      {client && <div style={{ fontFamily: "'Supply',monospace", fontWeight: 700, fontSize: 20, color: "#fff", textTransform: "uppercase" }}>{client.name}</div>}
                      <div style={{ fontFamily: "monospace", fontSize: 10, color: "#484f58" }}>{new Date(audit.created_at).toLocaleDateString("es-MX", { day: "2-digit", month: "long", year: "numeric" })}</div>
                      {score && <ScoreBadge score={score} />}
                    </div>
                    {score && <ScoreHero score={score} />}
                    {wins.length > 0 && <QuickWinsTable wins={wins} />}
                    <ReportSections text={audit.result} clientMode={false} />
                  </div>
                );
              })()}

            </div>
          </main>
        </div>
      )}
    </LangCtx.Provider>
  );
}

createRoot(document.getElementById("root")).render(<App />);
