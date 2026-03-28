// Ignitia · SEO Auditor v8.0 — i18n ES/EN
import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// ─── Translations ──────────────────────────────────────────────────
const T = {
  es: {
    appTagline: "Data-driven. Results-focused.",
    login: "Iniciar sesión",
    loginBtn: "ENTRAR →",
    loginLoading: "Verificando...",
    loginError: "Credenciales incorrectas. Intenta de nuevo.",
    loginRestricted: "Acceso restringido · Solo usuarios autorizados",
    emailLabel: "EMAIL",
    passwordLabel: "CONTRASEÑA",
    emailPlaceholder: "tu@email.com",
    passwordPlaceholder: "••••••••",
    dashboard: "Dashboard",
    newAudit: "+ Nueva auditoría",
    startAudit: "+ Empezar auditoría",
    emptyTitle: "Haz tu primera auditoría",
    emptyDesc: "Ingresa el nombre y URL de un negocio para generar tu primer reporte de visibilidad digital",
    allClients: "Todos los clientes",
    registered: "registrados",
    client: "Cliente",
    sector: "Sector",
    score: "Score",
    audits: "Auditorías",
    lastAudit: "Última auditoría",
    noScore: "Sin score",
    frictionChart: "Score de fricción por cliente",
    critical: "Crítico (1-4)",
    regular: "Regular (5-7)",
    good: "Bueno (8-10)",
    activeClients: "Clientes activos",
    monthAudits: "Auditorías este mes",
    avgScore: "Score promedio",
    improved: "Mejoraron este mes",
    history: "Historial",
    historyTitle: "Historial · ",
    historyAudits: "auditorías",
    searchPlaceholder: "Buscar por negocio o fecha...",
    filterAll: "Todos",
    filterMonth: "Este mes",
    filterClient: "Con cliente",
    filterCritical: "Críticos",
    emptyHistory: "Aún no tienes auditorías guardadas",
    emptySearch: "No encontré auditorías con esa búsqueda",
    viewBtn: "Ver →",
    back: "← Volver",
    saveClient: "¿Guardar como cliente?",
    saveClientDesc: "Aparecerá en tu dashboard con su score",
    nameLabel: "NOMBRE",
    urlLabel: "URL",
    sectorLabel: "SECTOR",
    saveBtn: "Guardar →",
    skipBtn: "No por ahora",
    reauditTitle: "Re-auditar",
    compareBtn: "📊 Comparar con auditoría anterior",
    compareDesc: "Claude analizará qué mejoró y qué sigue fallando",
    freshBtn: "🔍 Auditoría nueva desde cero",
    freshDesc: "Reporte completo sin comparar",
    cancelBtn: "Cancelar",
    chat: "💬 Chat",
    logout: "Cerrar sesión",
    logoutIcon: "🚪",
    cleanBtn: "✕ Limpiar",
    auditingLabel: "ANALIZANDO",
    connecting: "Conectando con el auditor...",
    processing: "Procesando búsqueda web (paso",
    analyzing: "Analizando resultados...",
    tracking: "Rastreando sitio",
    verifying: "Verificando NAP",
    keywords: "Analizando keywords",
    comparing: "Comparando competidores",
    reportLabel: "REPORTE COMPLETO",
    saved: "✓ Guardado",
    youLabel: "TÚ",
    auditBtn: "AUDITAR →",
    auditingBtn: "AUDITANDO...",
    inputPlaceholder: "Ej: 🔍 Audita mi negocio: Ignitia - https://ignitia.mx",
    clientPlaceholder: "Auditar",
    configureClick: "Haz clic para configurar",
    auditBusiness: "Auditar negocio",
    realKeywords: "Keywords reales",
    quickWins: "Quick wins",
    businessName: "NOMBRE DEL NEGOCIO",
    businessNamePlaceholder: "Ej: Paseo Interlomas",
    businessUrl: "URL",
    businessUrlPlaceholder: "Ej: https://paseointerlomas.mx",
    businessCity: "NEGOCIO Y CIUDAD",
    businessCityPlaceholder: "Ej: Dentista en Naucalpan, CDMX",
    siteUrl: "URL DEL SITIO",
    siteUrlPlaceholder: "Ej: https://tusitio.mx",
    auditSubmit: "Auditar →",
    starterAudit: "🔍 Audita mi negocio:",
    starterKeywords: "🎯 ¿Por qué palabras clave me encuentra la gente? Mi negocio:",
    starterWins: "🚀 Dame 5 cambios rápidos para mejorar mi visibilidad. Mi sitio:",
    previousAudits: "auditorías previas",
    toastSaved: "guardado en tu dashboard",
    loading: "Cargando...",
    errorTitle: "Error",
    errorApiKey: "Verifica tu conexión",
    errorUrl: "Verifica que la URL esté completa",
    prevAuditsLabel: "anterior",
    prevAuditsLabelPlural: "anteriores",
  },
  en: {
    appTagline: "Data-driven. Results-focused.",
    login: "Sign in",
    loginBtn: "SIGN IN →",
    loginLoading: "Verifying...",
    loginError: "Incorrect credentials. Please try again.",
    loginRestricted: "Restricted access · Authorized users only",
    emailLabel: "EMAIL",
    passwordLabel: "PASSWORD",
    emailPlaceholder: "you@email.com",
    passwordPlaceholder: "••••••••",
    dashboard: "Dashboard",
    newAudit: "+ New audit",
    startAudit: "+ Start audit",
    emptyTitle: "Run your first audit",
    emptyDesc: "Enter a business name and URL to generate your first digital visibility report",
    allClients: "All clients",
    registered: "registered",
    client: "Client",
    sector: "Sector",
    score: "Score",
    audits: "Audits",
    lastAudit: "Last audit",
    noScore: "No score",
    frictionChart: "Friction score by client",
    critical: "Critical (1-4)",
    regular: "Regular (5-7)",
    good: "Good (8-10)",
    activeClients: "Active clients",
    monthAudits: "Audits this month",
    avgScore: "Average score",
    improved: "Improved this month",
    history: "History",
    historyTitle: "History · ",
    historyAudits: "audits",
    searchPlaceholder: "Search by business or date...",
    filterAll: "All",
    filterMonth: "This month",
    filterClient: "With client",
    filterCritical: "Critical",
    emptyHistory: "No audits saved yet",
    emptySearch: "No audits found for that search",
    viewBtn: "View →",
    back: "← Back",
    saveClient: "Save as client?",
    saveClientDesc: "It will appear in your dashboard with its score",
    nameLabel: "NAME",
    urlLabel: "URL",
    sectorLabel: "SECTOR",
    saveBtn: "Save →",
    skipBtn: "Not now",
    reauditTitle: "Re-audit",
    compareBtn: "📊 Compare with previous audit",
    compareDesc: "Claude will analyze what improved and what still needs work",
    freshBtn: "🔍 Fresh audit from scratch",
    freshDesc: "Full report without comparing",
    cancelBtn: "Cancel",
    chat: "💬 Chat",
    logout: "Sign out",
    logoutIcon: "🚪",
    cleanBtn: "✕ Clear",
    auditingLabel: "ANALYZING",
    connecting: "Connecting to auditor...",
    processing: "Processing web search (step",
    analyzing: "Analyzing results...",
    tracking: "Crawling site",
    verifying: "Verifying NAP",
    keywords: "Analyzing keywords",
    comparing: "Comparing competitors",
    reportLabel: "FULL REPORT",
    saved: "✓ Saved",
    youLabel: "YOU",
    auditBtn: "AUDIT →",
    auditingBtn: "AUDITING...",
    inputPlaceholder: "E.g: 🔍 Audit my business: Ignitia - https://ignitia.mx",
    clientPlaceholder: "Audit",
    configureClick: "Click to configure",
    auditBusiness: "Audit business",
    realKeywords: "Real keywords",
    quickWins: "Quick wins",
    businessName: "BUSINESS NAME",
    businessNamePlaceholder: "E.g: Paseo Interlomas",
    businessUrl: "URL",
    businessUrlPlaceholder: "E.g: https://paseointerlomas.mx",
    businessCity: "BUSINESS & CITY",
    businessCityPlaceholder: "E.g: Dentist in Miami, FL",
    siteUrl: "SITE URL",
    siteUrlPlaceholder: "E.g: https://yoursite.com",
    auditSubmit: "Audit →",
    starterAudit: "🔍 Audit my business:",
    starterKeywords: "🎯 What keywords do people use to find me? My business:",
    starterWins: "🚀 Give me 5 quick changes to improve my visibility. My site:",
    previousAudits: "previous audits",
    toastSaved: "saved to your dashboard",
    loading: "Loading...",
    errorTitle: "Error",
    errorApiKey: "Check your connection",
    errorUrl: "Make sure the URL is complete",
    prevAuditsLabel: "previous",
    prevAuditsLabelPlural: "previous",
  }
};

// ─── Language context ──────────────────────────────────────────────
const LangContext = createContext({ lang: "es", t: k => T.es[k] || k, setLang: () => {} });
function useLang() { return useContext(LangContext); }

// ─── Master prompt by language ─────────────────────────────────────
function getMasterPrompt(lang) {
  const isEN = lang === "en";
  return `ROL: You are the "Digital Growth Auditor" of Ignitia, an elite digital strategist. Your mission is to audit digital ecosystems to find "attention leaks", lack of coherence and positioning weaknesses (SEO).

IMPORTANT: ${isEN ? "Respond ENTIRELY in English. All sections, labels, and content must be in English." : "Responde COMPLETAMENTE en español. Todas las secciones, etiquetas y contenido deben estar en español."}

PHILOSOPHY: Visibility is a connected system. If one point fails (slow website, outdated Google Business, inconsistent message), the customer is lost. You don't look for errors; you optimize the money flow.

I. AUDIT PROTOCOL:
1. Brand Consistency (NAP): Compare Name, Address and Phone on Web, Google Maps and Social Media.
2. Deep SEO Analysis: Extract site keywords, simulate real user search and compare with Top 3 competitors.
3. Web Friction Diagnosis: Identify H1. If it depends on JavaScript, mark it as "Closed Shutter for Google".
4. Connected Flow: Check if Social Media links are strategic landing pages.

II. RESPONSE STRUCTURE (use exactly these headings):

## 🛠️ ${isEN ? "INTERNAL NOTES" : "NOTAS INTERNAS"}
${isEN ? "Technical tone for the consultant." : "Tono técnico para el consultor."}
- ${isEN ? "Technical Analysis: rendering errors, NAP inconsistencies, SEO metrics." : "Análisis Técnico: errores, inconsistencias NAP, métricas SEO."}
- ${isEN ? "Sales Hook: key weak point to offer services." : "Gancho de Venta: punto débil clave."}

## 📄 ${isEN ? "CLIENT REPORT" : "REPORTE PARA EL CLIENTE"}
${isEN ? "Empathetic tone, physical store analogies." : "Tono empático, analogías de tienda física."}
### ⚡ ${isEN ? "Digital Health Diagnosis" : "Diagnóstico de Salud Digital"}
${isEN ? "Score 1-10 of Friction (1 = very easy to find, 10 = impossible to find)." : "Calificación 1-10 de Fricción (1 = muy fácil encontrarte, 10 = imposible encontrarte)."}
### 🎯 ${isEN ? "Your Google Showcase" : "Tu Vitrina en Google"}
### 🔍 ${isEN ? "The Road Bumps" : "Los Baches en el Camino"}
### 🏗️ ${isEN ? "Your Main Sign (H1)" : "Tu Letrero Principal (H1)"}
### 🚀 ${isEN ? "Quick Wins Plan (60 min)" : "Plan de Quick Wins (60 min)"}
${isEN ? "Present exactly 5 actions in Markdown table format:" : "Presenta exactamente 5 acciones en formato de tabla Markdown:"}
| ${isEN ? "Action" : "Acción"} | ${isEN ? "Where to do it" : "Dónde hacerlo"} | ${isEN ? "Time" : "Tiempo"} | ${isEN ? "Impact" : "Impacto"} |
|--------|---------------|--------|---------|
${isEN ? "Order from highest to lowest impact. Impact can be: High, Medium or Low." : "Ordena de mayor a menor impacto. Impacto puede ser: Alto, Medio o Bajo."}

## 🏆 ${isEN ? "COMPETITIVE BENCHMARK" : "BENCHMARK COMPETITIVO"}
${isEN ? "Identify the 2 main competitors in the Google Top 3. For each:" : "Identifica los 2 competidores principales en el Top 3 de Google. Para cada uno:"}
- ${isEN ? "Name and URL" : "Nombre y URL"}
- ${isEN ? "2-3 things they do better than the audited business" : "2-3 cosas que hacen mejor que el negocio auditado"}
- ${isEN ? "Their main keywords" : "Sus keywords principales"}
- ${isEN ? "Their estimated friction score" : "Su score de fricción estimado"}
${isEN ? "At the end: **Main gap** and **Immediate opportunity**." : "Al final: **Brecha principal** y **Oportunidad inmediata**."}

## 📚 ${isEN ? "GLOSSARY FOR BUSINESS OWNERS" : "DICCIONARIO PARA DUEÑOS"}
${isEN ? "Define H1, SEO, NAP, Keywords, Friction with simple analogies." : "Define H1, SEO, NAP, Keywords, Fricción con analogías simples."}

III. ${isEN ? "CRITICAL INSTRUCTION" : "INSTRUCCIÓN CRÍTICA"}:
${isEN ? "At the end always add:" : "Al final agrega siempre:"}
IGNITIA_SCORE: [${isEN ? "number from 1 to 10" : "número del 1 al 10"}]

IV. ${isEN ? "CONTROL" : "CONTROL"}:
- ${isEN ? "If you can't find something: \"Could not verify this point, please review manually\"." : "Si no encuentras algo: \"No pude verificar este punto, favor de revisar manualmente\"."}
- ${isEN ? "Don't say a website is 'beautiful' if it's not 'functional'." : "No digas que una web es bonita si no es funcional."}`;
}

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
function extractScore(text) {
  const match = text.match(/IGNITIA_SCORE:\s*(\d+(?:\.\d+)?)/);
  if (match) return parseFloat(match[1]);
  const m2 = text.match(/calificaci[oó]n[^0-9]*(\d+(?:\.\d+)?)\s*\/\s*10/i);
  if (m2) return parseFloat(m2[1]);
  return null;
}

const SECTORS = {
  es: ["Restaurante","Clínica / Salud","Tienda / Retail","Agencia","Educación","Inmobiliaria","Fitness / Gym","Belleza / Spa","Legal","Tecnología","Otro"],
  en: ["Restaurant","Clinic / Health","Store / Retail","Agency","Education","Real Estate","Fitness / Gym","Beauty / Spa","Legal","Technology","Other"],
};

// ─── Markdown ──────────────────────────────────────────────────────
function getStyle(title) {
  if (!title) return { bg: "#0d1117", border: "#30363d", accent: "#8b949e", tag: "INFO" };
  if (title.includes("NOTAS") || title.includes("INTERNAL") || title.includes("🛠")) return { bg: "#110a00", border: "#FF450055", accent: "#FF4500", tag: title.includes("INTERNAL") ? "CONSULTANT" : "SOLO CONSULTOR" };
  if (title.includes("REPORTE") || title.includes("REPORT") || title.includes("CLIENTE") || title.includes("CLIENT") || title.includes("📄")) return { bg: "#00091a", border: "#1f6feb88", accent: "#58a6ff", tag: title.includes("CLIENT") ? "FOR CLIENT" : "PARA EL CLIENTE" };
  if (title.includes("BENCH") || title.includes("🏆")) return { bg: "#0a0a1a", border: "#6e40c988", accent: "#a371f7", tag: "BENCHMARK" };
  if (title.includes("DICCI") || title.includes("GLOSS") || title.includes("DUEÑOS") || title.includes("OWNERS") || title.includes("📚")) return { bg: "#001a0a", border: "#23863688", accent: "#3fb950", tag: title.includes("GLOSS") || title.includes("OWNERS") ? "GLOSSARY" : "GLOSARIO" };
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
function formatInline(text) {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>");
}
function renderMd(raw) {
  const lines = raw.split("\n");
  let html = "", i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith("|") && lines[i + 1]?.trim().startsWith("|---")) {
      const headers = line.trim().split("|").filter(c => c.trim()).map(c => c.trim());
      i += 2;
      let rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) { rows.push(lines[i].trim().split("|").filter(c => c.trim()).map(c => c.trim())); i++; }
      const impactWords = ["Alto","Medio","Bajo","Crítico","High","Medium","Low","Critical"];
      html += `<div style="overflow-x:auto;margin:12px 0"><table style="width:100%;border-collapse:collapse;font-size:12px"><thead><tr style="border-bottom:1px solid #30363d">${headers.map(h => `<th style="text-align:left;padding:8px 12px;color:#8b949e;font-weight:600;white-space:nowrap">${formatInline(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((row, ri) => `<tr style="border-bottom:1px solid #161b22;${ri % 2 === 0 ? "background:#ffffff08" : ""}">${row.map(cell => { const ic = (cell === "Alto" || cell === "High") ? "#3fb950" : (cell === "Medio" || cell === "Medium") ? "#d29922" : (cell === "Bajo" || cell === "Low") ? "#8b949e" : (cell === "Crítico" || cell === "Critical") ? "#f85149" : null; return `<td style="padding:8px 12px;color:#c9d1d9;vertical-align:top">${ic ? `<span style="background:${ic}22;color:${ic};padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600">${cell}</span>` : formatInline(cell)}</td>`; }).join("")}</tr>`).join("")}</tbody></table></div>`;
      continue;
    }
    if (line.startsWith("### ")) { html += `<h4 style="font-size:13px;font-weight:700;margin:16px 0 8px;color:#c9d1d9">${formatInline(line.slice(4))}</h4>`; i++; continue; }
    if (line.startsWith("- ")) { html += `<li style="font-size:13px;line-height:1.65;margin-bottom:5px;margin-left:18px">${formatInline(line.slice(2))}</li>`; i++; continue; }
    if (!line.trim()) { html += "<br/>"; i++; continue; }
    html += `<p style="font-size:13px;line-height:1.75;margin-bottom:8px">${formatInline(line)}</p>`;
    i++;
  }
  return html;
}

// ─── API loop ──────────────────────────────────────────────────────
async function runAuditLoop(apiMessages, onStatus, systemOverride) {
  const MAX_TURNS = 12;
  let msgs = [...apiMessages];
  for (let turn = 0; turn < MAX_TURNS; turn++) {
    onStatus(turn === 0 ? "connecting" : `processing:${turn}`);
    const res = await fetch("/api/audit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "claude-sonnet-4-6", max_tokens: 4000, system: systemOverride, tools: [{ type: "web_search_20250305", name: "web_search" }], messages: msgs }),
    });
    if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err?.error?.message || `HTTP ${res.status}`); }
    const data = await res.json();
    const { content, stop_reason } = data;
    msgs = [...msgs, { role: "assistant", content }];
    if (stop_reason === "end_turn") {
      const text = content.filter(b => b.type === "text").map(b => b.text).join("\n").trim();
      if (!text) throw new Error("Empty response. Please try again.");
      return text;
    }
    if (stop_reason === "tool_use") {
      const webResults = content.filter(b => b.type === "web_search_tool_result");
      if (webResults.length > 0) { onStatus("analyzing"); continue; }
      const toolUseBlocks = content.filter(b => b.type === "tool_use");
      if (toolUseBlocks.length > 0) msgs = [...msgs, { role: "user", content: toolUseBlocks.map(tu => ({ type: "tool_result", tool_use_id: tu.id, content: "OK" })) }];
      continue;
    }
    const fallback = content.filter(b => b.type === "text").map(b => b.text).join("\n").trim();
    if (fallback) return fallback;
    throw new Error(`Unexpected stop: ${stop_reason}`);
  }
  throw new Error("Too many steps. Try with a more specific query.");
}

// ─── Score badge ───────────────────────────────────────────────────
function ScoreBadge({ score }) {
  const { t } = useLang();
  if (!score) return null;
  const color = score <= 4 ? "#E24B4A" : score <= 7 ? "#EF9F27" : "#639922";
  const bg = score <= 4 ? "#FCEBEB" : score <= 7 ? "#FAEEDA" : "#EAF3DE";
  const textColor = score <= 4 ? "#A32D2D" : score <= 7 ? "#854F0B" : "#3B6D11";
  const label = score <= 4 ? t("critical").split(" ")[0] : score <= 7 ? t("regular").split(" ")[0] : t("good").split(" ")[0];
  return (
    <span style={{ background: bg, color: textColor, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6, display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
      {score}/10 · {label}
    </span>
  );
}

// ─── Language selector ─────────────────────────────────────────────
function LangSelector() {
  const { lang, setLang } = useLang();
  return (
    <div style={{ display: "flex", background: "#161b22", border: "1px solid #21262d", borderRadius: 6, overflow: "hidden" }}>
      {["es","en"].map(l => (
        <button key={l} onClick={() => setLang(l)}
          style={{ background: lang === l ? "#FF4500" : "transparent", border: "none", color: lang === l ? "#fff" : "#484f58", padding: "5px 10px", cursor: "pointer", fontFamily: "inherit", fontSize: 10, fontWeight: lang === l ? 700 : 400, transition: "all .15s" }}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

// ─── Toast ─────────────────────────────────────────────────────────
function Toast({ message, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, []);
  return (
    <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 500, display: "flex", alignItems: "center", gap: 10, background: "#161b22", border: "1px solid #3fb95066", borderRadius: 10, padding: "12px 18px", whiteSpace: "nowrap" }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#3fb95022", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#3fb950" }}>✓</div>
      <div style={{ color: "#3fb950", fontSize: 12, fontWeight: 600 }}>{message}</div>
      <div onClick={onClose} style={{ color: "#30363d", fontSize: 16, cursor: "pointer", marginLeft: 8 }}>×</div>
    </div>
  );
}

// ─── NavLogo ───────────────────────────────────────────────────────
function NavLogo({ onClick, clientName }) {
  const [hover, setHover] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", opacity: hover ? 0.75 : 1, transition: "opacity .2s" }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: "linear-gradient(135deg,#FF4500,#c43300)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 17, flexShrink: 0 }}>🔥</div>
      <div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: "#e6edf3", display: "flex", alignItems: "center", gap: 8 }}>
          Ignitia · SEO Auditor
          {clientName && <span style={{ fontSize: 11, color: "#FF4500", fontWeight: 400 }}>· {clientName}</span>}
        </div>
        <div style={{ fontSize: 10, color: "#484f58", display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#3fb950", display: "inline-block" }} />
          Data-driven. Results-focused.
        </div>
      </div>
    </div>
  );
}

// ─── Hamburger menu ────────────────────────────────────────────────
function HamburgerMenu({ items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(o => !o)} style={{ background: "transparent", border: "1px solid #21262d", borderRadius: 6, padding: "7px 10px", cursor: "pointer", display: "flex", flexDirection: "column", gap: 3 }}>
        {[0,1,2].map(i => <span key={i} style={{ width: 16, height: 1.5, background: "#8b949e", borderRadius: 1, display: "block" }} />)}
      </button>
      {open && (
        <div style={{ position: "absolute", right: 0, top: "calc(100% + 6px)", background: "#0d1117", border: "1px solid #30363d", borderRadius: 10, overflow: "hidden", minWidth: 160, zIndex: 100, boxShadow: "0 8px 24px #000000aa" }}>
          {items.map((item, i) => (
            <button key={i} onClick={() => { item.onClick(); setOpen(false); }}
              style={{ width: "100%", background: "transparent", border: "none", borderBottom: i < items.length - 1 ? "1px solid #161b22" : "none", color: item.danger ? "#f85149" : "#c9d1d9", padding: "11px 16px", cursor: "pointer", fontFamily: "inherit", fontSize: 12, textAlign: "left", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13 }}>{item.icon}</span> {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Starter cards ─────────────────────────────────────────────────
function StarterCard({ icon, label, fields, onSubmit }) {
  const { t } = useLang();
  const [expanded, setExpanded] = useState(false);
  const [values, setValues] = useState(fields.reduce((a, f) => ({ ...a, [f.key]: "" }), {}));
  if (!expanded) return (
    <button onClick={() => setExpanded(true)} style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 8, padding: "12px", cursor: "pointer", fontFamily: "inherit", textAlign: "left", width: "100%" }}
      onMouseOver={e => { e.currentTarget.style.borderColor = "#FF4500"; e.currentTarget.style.background = "#1a0800"; }}
      onMouseOut={e => { e.currentTarget.style.borderColor = "#21262d"; e.currentTarget.style.background = "#0d1117"; }}>
      <div style={{ fontSize: 18, marginBottom: 6 }}>{icon}</div>
      <div style={{ fontWeight: 600, color: "#c9d1d9", fontSize: 11, marginBottom: 4 }}>{label}</div>
      <div style={{ color: "#484f58", fontSize: 10 }}>{t("configureClick")}</div>
    </button>
  );
  return (
    <div style={{ background: "#0d1117", border: "1px solid #FF450055", borderRadius: 8, padding: "14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span style={{ fontSize: 14 }}>{icon}</span>
        <span style={{ color: "#FF4500", fontSize: 11, fontWeight: 600 }}>{label}</span>
        <button onClick={() => setExpanded(false)} style={{ marginLeft: "auto", background: "transparent", border: "none", color: "#484f58", cursor: "pointer", fontSize: 14 }}>×</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {fields.map(f => (
          <div key={f.key}>
            <div style={{ fontSize: 9, color: "#484f58", marginBottom: 4, letterSpacing: 1 }}>{f.label}</div>
            <input value={values[f.key]} onChange={e => setValues(v => ({ ...v, [f.key]: e.target.value }))}
              placeholder={f.placeholder} onKeyDown={e => e.key === "Enter" && onSubmit(values)}
              style={{ width: "100%", background: "#161b22", border: "1px solid #30363d", borderRadius: 6, padding: "8px 10px", color: "#c9d1d9", fontFamily: "inherit", fontSize: 11, outline: "none" }} />
          </div>
        ))}
        <button onClick={() => onSubmit(values)}
          style={{ background: "#FF4500", border: "none", color: "#fff", padding: "8px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 700, marginTop: 4 }}>
          {t("auditSubmit")}
        </button>
      </div>
    </div>
  );
}

// ─── Login ─────────────────────────────────────────────────────────
function LoginScreen() {
  const { t } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) return setError(t("loginError"));
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(t("loginError"));
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "'IBM Plex Mono',monospace", background: "#060a10", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Space+Grotesk:wght@700&display=swap');*{box-sizing:border-box;margin:0;padding:0}@keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>
      <div style={{ maxWidth: 400, width: "100%", animation: "fadeUp .4s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "linear-gradient(135deg,#FF4500,#c43300)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, margin: "0 auto 14px" }}>🔥</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 20, color: "#e6edf3" }}>Ignitia · SEO Auditor</div>
          <div style={{ fontSize: 11, color: "#484f58", marginTop: 4 }}>Data-driven. Results-focused.</div>
          <div style={{ marginTop: 12, display: "flex", justifyContent: "center" }}><LangSelector /></div>
        </div>
        <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 14, padding: 28 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#e6edf3", marginBottom: 20 }}>{t("login")}</div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, color: "#8b949e", marginBottom: 6, letterSpacing: 1 }}>{t("emailLabel")}</div>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder={t("emailPlaceholder")}
              style={{ width: "100%", background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: "10px 14px", color: "#c9d1d9", fontFamily: "inherit", fontSize: 13, outline: "none" }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, color: "#8b949e", marginBottom: 6, letterSpacing: 1 }}>{t("passwordLabel")}</div>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()} placeholder={t("passwordPlaceholder")}
              style={{ width: "100%", background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: "10px 14px", color: "#c9d1d9", fontFamily: "inherit", fontSize: 13, outline: "none" }} />
          </div>
          {error && <div style={{ background: "#f8514922", border: "1px solid #f8514944", borderRadius: 8, padding: "10px 14px", color: "#f85149", fontSize: 12, marginBottom: 16 }}>{error}</div>}
          <button onClick={handleLogin} disabled={loading}
            style={{ width: "100%", background: loading ? "#7a2200" : "#FF4500", border: "none", borderRadius: 8, padding: "12px", color: "#fff", fontFamily: "inherit", fontSize: 13, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer" }}>
            {loading ? t("loginLoading") : t("loginBtn")}
          </button>
          <div style={{ fontSize: 10, color: "#30363d", textAlign: "center", marginTop: 16 }}>{t("loginRestricted")}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────
function Dashboard({ onNewAudit, onSelectClient }) {
  const { t } = useLang();
  const clients = loadClients();
  const history = loadHistory();
  const scored = history.filter(h => h.score);
  const avgScore = scored.length ? (scored.reduce((a, b) => a + b.score, 0) / scored.length).toFixed(1) : null;
  const thisMonth = history.filter(h => { const d = new Date(h.id); const now = new Date(); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); }).length;
  const improved = clients.filter(c => { const audits = getClientAudits(c.id).filter(a => a.score); if (audits.length < 2) return false; return audits[0].score > audits[1].score; }).length;
  const chartClients = clients.filter(c => c.lastScore).slice(0, 8);

  useEffect(() => {
    if (!chartClients.length || !window.Chart) return;
    const existing = window.ignitiaChart;
    if (existing) existing.destroy();
    const ctx = document.getElementById("dashChart");
    if (!ctx) return;
    window.ignitiaChart = new window.Chart(ctx, {
      type: "bar",
      data: { labels: chartClients.map(c => c.name.length > 12 ? c.name.slice(0, 12) + "…" : c.name), datasets: [{ data: chartClients.map(c => c.lastScore), backgroundColor: chartClients.map(c => c.lastScore <= 4 ? "#E24B4A" : c.lastScore <= 7 ? "#EF9F27" : "#639922"), borderRadius: 4 }] },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { min: 0, max: 10, ticks: { stepSize: 2, color: "#666" }, grid: { color: "rgba(128,128,128,0.1)" } }, x: { ticks: { color: "#666", font: { size: 11 }, autoSkip: false, maxRotation: 30 }, grid: { display: false } } } }
    });
  }, [clients.length]);

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 20, color: "#e6edf3" }}>{t("dashboard")}</div>
          <div style={{ fontSize: 11, color: "#484f58", marginTop: 3 }}>Ignitia · SEO Auditor</div>
        </div>
        <button onClick={onNewAudit} style={{ background: "#FF4500", border: "none", color: "#fff", padding: "10px 18px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700 }}>{t("newAudit")}</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: t("activeClients"), value: clients.length, color: clients.length ? "#e6edf3" : "#30363d" },
          { label: t("monthAudits"), value: thisMonth, color: thisMonth ? "#e6edf3" : "#30363d" },
          { label: t("avgScore"), value: avgScore ? `${avgScore}/10` : "—", color: avgScore ? (avgScore <= 4 ? "#E24B4A" : avgScore <= 7 ? "#EF9F27" : "#3fb950") : "#30363d" },
          { label: t("improved"), value: improved, color: improved ? "#3fb950" : "#30363d" },
        ].map(m => (
          <div key={m.label} style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 8, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, color: "#484f58", marginBottom: 8 }}>{m.label}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: m.color }}>{m.value}</div>
          </div>
        ))}
      </div>
      {clients.length === 0 ? (
        <div style={{ background: "#0d1117", border: "1px dashed #30363d", borderRadius: 12, padding: "64px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>🔥</div>
          <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16, color: "#e6edf3", marginBottom: 8 }}>{t("emptyTitle")}</div>
          <div style={{ color: "#484f58", fontSize: 13, lineHeight: 1.7, marginBottom: 28, maxWidth: 380, margin: "0 auto 28px" }}>{t("emptyDesc")}</div>
          <button onClick={onNewAudit} style={{ background: "#FF4500", border: "none", color: "#fff", padding: "12px 24px", borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 700 }}>{t("startAudit")}</button>
        </div>
      ) : (
        <>
          {chartClients.length > 0 && (
            <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, padding: 20, marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#c9d1d9", marginBottom: 12 }}>{t("frictionChart")}</div>
              <div style={{ display: "flex", gap: 16, marginBottom: 12, fontSize: 11, color: "#484f58" }}>
                {[["#E24B4A", t("critical")],["#EF9F27", t("regular")],["#639922", t("good")]].map(([color, label]) => (
                  <span key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: color, display: "inline-block" }} />{label}
                  </span>
                ))}
              </div>
              <div style={{ position: "relative", height: 200 }}><canvas id="dashChart" /></div>
            </div>
          )}
          <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #21262d", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#c9d1d9" }}>{t("allClients")}</div>
              <div style={{ fontSize: 10, color: "#484f58" }}>{clients.length} {t("registered")}</div>
            </div>
            <table style={{ width: "100%", fontSize: 12, borderCollapse: "collapse", tableLayout: "fixed" }}>
              <thead>
                <tr style={{ background: "#0a0e15" }}>
                  {[t("client"),t("sector"),t("score"),t("audits"),t("lastAudit")].map((h, i) => (
                    <th key={h} style={{ textAlign: i >= 2 && i <= 3 ? "center" : "left", padding: "10px 16px", color: "#484f58", fontWeight: 400, width: ["28%","20%","18%","14%","20%"][i] }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map(client => {
                  const audits = getClientAudits(client.id);
                  return (
                    <tr key={client.id} onClick={() => onSelectClient(client)} style={{ borderTop: "1px solid #161b22", cursor: "pointer" }}
                      onMouseOver={e => e.currentTarget.style.background = "#0d1420"}
                      onMouseOut={e => e.currentTarget.style.background = ""}>
                      <td style={{ padding: "12px 16px", color: "#e6edf3", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{client.name}</td>
                      <td style={{ padding: "12px 16px", color: "#484f58", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{client.sector}</td>
                      <td style={{ padding: "12px 16px", textAlign: "center" }}>{client.lastScore ? <ScoreBadge score={client.lastScore} /> : <span style={{ color: "#30363d", fontSize: 11 }}>{t("noScore")}</span>}</td>
                      <td style={{ padding: "12px 16px", textAlign: "center", color: "#484f58" }}>{audits.length}</td>
                      <td style={{ padding: "12px 16px", color: "#484f58", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{client.lastAudit || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Modals ────────────────────────────────────────────────────────
function SaveClientModal({ onSave, onSkip, defaultName = "", defaultUrl = "" }) {
  const { t, lang } = useLang();
  const [name, setName] = useState(defaultName);
  const [url, setUrl] = useState(defaultUrl);
  const [sector, setSector] = useState(SECTORS[lang][SECTORS[lang].length - 1]);
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000bb", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 12, padding: 28, maxWidth: 400, width: "100%" }}>
        <div style={{ fontSize: 22, marginBottom: 8, textAlign: "center" }}>💾</div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16, color: "#e6edf3", textAlign: "center", marginBottom: 4 }}>{t("saveClient")}</div>
        <div style={{ fontSize: 12, color: "#484f58", textAlign: "center", marginBottom: 20 }}>{t("saveClientDesc")}</div>
        {[{ label: t("nameLabel"), value: name, set: setName, placeholder: "Ej: Paseo Interlomas" }, { label: t("urlLabel"), value: url, set: setUrl, placeholder: "Ej: https://paseointerlomas.mx" }].map(f => (
          <div key={f.label} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 10, color: "#8b949e", marginBottom: 5, letterSpacing: 1 }}>{f.label}</div>
            <input value={f.value} onChange={e => f.set(e.target.value)} placeholder={f.placeholder}
              style={{ width: "100%", background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: "9px 12px", color: "#c9d1d9", fontFamily: "inherit", fontSize: 12, outline: "none" }} />
          </div>
        ))}
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: "#8b949e", marginBottom: 5, letterSpacing: 1 }}>{t("sectorLabel")}</div>
          <select value={sector} onChange={e => setSector(e.target.value)}
            style={{ width: "100%", background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: "9px 12px", color: "#c9d1d9", fontFamily: "inherit", fontSize: 12, outline: "none" }}>
            {SECTORS[lang].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onSkip} style={{ flex: 1, background: "transparent", border: "1px solid #30363d", color: "#8b949e", padding: 10, borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>{t("skipBtn")}</button>
          <button onClick={() => name.trim() && onSave({ name: name.trim(), url: url.trim(), sector })}
            style={{ flex: 1, background: "#FF4500", border: "none", color: "#fff", padding: 10, borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 700 }}>{t("saveBtn")}</button>
        </div>
      </div>
    </div>
  );
}

function ReauditModal({ client, onCompare, onFresh, onCancel }) {
  const { t } = useLang();
  const audits = getClientAudits(client.id);
  return (
    <div style={{ position: "fixed", inset: 0, background: "#000000bb", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: 12, padding: 28, maxWidth: 400, width: "100%" }}>
        <div style={{ fontSize: 22, marginBottom: 8, textAlign: "center" }}>🔄</div>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 16, color: "#e6edf3", textAlign: "center", marginBottom: 4 }}>{t("reauditTitle")} {client.name}</div>
        <div style={{ fontSize: 12, color: "#484f58", textAlign: "center", marginBottom: 20 }}>
          {audits.length} {audits.length !== 1 ? t("prevAuditsLabelPlural") : t("prevAuditsLabel")}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {audits.length > 0 && (
            <button onClick={onCompare} style={{ background: "#00091a", border: "1px solid #1f6feb88", color: "#58a6ff", padding: 12, borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, textAlign: "left" }}>
              {t("compareBtn")}
              <div style={{ fontSize: 10, color: "#484f58", marginTop: 3, fontWeight: 400 }}>{t("compareDesc")}</div>
            </button>
          )}
          <button onClick={onFresh} style={{ background: "#110a00", border: "1px solid #FF450055", color: "#FF4500", padding: 12, borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12, fontWeight: 600, textAlign: "left" }}>
            {t("freshBtn")}
            <div style={{ fontSize: 10, color: "#484f58", marginTop: 3, fontWeight: 400 }}>{t("freshDesc")}</div>
          </button>
          <button onClick={onCancel} style={{ background: "transparent", border: "1px solid #21262d", color: "#484f58", padding: 10, borderRadius: 8, cursor: "pointer", fontFamily: "inherit", fontSize: 12 }}>{t("cancelBtn")}</button>
        </div>
      </div>
    </div>
  );
}

// ─── History ───────────────────────────────────────────────────────
function HistoryPanel({ onClose, onLoad }) {
  const { t } = useLang();
  const [history, setHistory] = useState(loadHistory());
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos");
  const clients = loadClients();
  const getClientName = id => { const c = clients.find(c => c.id === id); return c ? c.name : null; };
  const handleDelete = id => { const u = history.filter(e => e.id !== id); localStorage.setItem("ignitia_history", JSON.stringify(u)); setHistory(u); };
  const filtered = history.filter(e => {
    const name = getClientName(e.clientId) || "";
    const matchSearch = !search || e.query.toLowerCase().includes(search.toLowerCase()) || name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "todos" || (filter === "cliente" && e.clientId) || (filter === "critico" && e.score && e.score <= 4) || (filter === "mes" && (() => { const d = new Date(e.id); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); })());
    return matchSearch && matchFilter;
  });
  return (
    <div style={{ position: "fixed", inset: 0, background: "#060a10", zIndex: 200, display: "flex", flexDirection: "column", fontFamily: "'IBM Plex Mono',monospace" }}>
      <nav style={{ padding: "14px 24px", borderBottom: "1px solid #161b22", display: "flex", alignItems: "center", gap: 12, background: "#0d1117" }}>
        <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 14, color: "#e6edf3" }}>📋 {t("historyTitle")}{history.length} {t("historyAudits")}</div>
        <button onClick={onClose} style={{ marginLeft: "auto", background: "transparent", border: "1px solid #21262d", color: "#8b949e", padding: "6px 14px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}>{t("back")}</button>
      </nav>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", maxWidth: 1100, width: "100%", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <div style={{ flex: 1, background: "#161b22", border: "1px solid #30363d", borderRadius: 8, padding: "9px 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#484f58", fontSize: 12 }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t("searchPlaceholder")}
              style={{ background: "transparent", border: "none", outline: "none", color: "#c9d1d9", fontFamily: "inherit", fontSize: 12, width: "100%" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[["todos", t("filterAll")],["mes", t("filterMonth")],["cliente", t("filterClient")],["critico", t("filterCritical")]].map(([val, lbl]) => (
            <button key={val} onClick={() => setFilter(val)}
              style={{ background: filter === val ? "#FF450022" : "#21262d", border: `1px solid ${filter === val ? "#FF450055" : "transparent"}`, color: filter === val ? "#FF4500" : "#484f58", borderRadius: 6, padding: "4px 12px", cursor: "pointer", fontFamily: "inherit", fontSize: 10 }}>
              {lbl}
            </button>
          ))}
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", paddingTop: 60, color: "#484f58" }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📭</div>
            <div>{search ? t("emptySearch") : t("emptyHistory")}</div>
          </div>
        ) : filtered.map(entry => (
          <div key={entry.id} style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, padding: "16px 18px", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 10, color: "#484f58" }}>{entry.date}</div>
                  {getClientName(entry.clientId) && <div style={{ fontSize: 9, color: "#FF4500", background: "#FF450015", padding: "1px 6px", borderRadius: 4 }}>{getClientName(entry.clientId)}</div>}
                  {entry.score && <ScoreBadge score={entry.score} />}
                </div>
                <div style={{ fontSize: 13, color: "#c9d1d9", fontWeight: 600 }}>{entry.query}</div>
              </div>
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button onClick={() => onLoad(entry)} style={{ background: "#FF4500", border: "none", color: "#fff", padding: "6px 12px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 11, fontWeight: 600 }}>{t("viewBtn")}</button>
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
  const [lang, setLangState] = useState(() => localStorage.getItem("ignitia_lang") || "es");
  const t = k => T[lang][k] || k;
  const setLang = l => { setLangState(l); localStorage.setItem("ignitia_lang", l); };

  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [screen, setScreen] = useState("dashboard");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusKey, setStatusKey] = useState("");
  const [input, setInput] = useState("");
  const [saveModal, setSaveModal] = useState(null);
  const [reauditModal, setReauditModal] = useState(null);
  const [activeClient, setActiveClient] = useState(null);
  const [toast, setToast] = useState(null);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); setAuthLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const getStatusText = key => {
    if (!key) return "";
    if (key === "connecting") return t("connecting");
    if (key === "analyzing") return t("analyzing");
    if (key.startsWith("processing:")) return `${t("processing")} ${key.split(":")[1]})...`;
    return key;
  };

  const goHome = () => { setMessages([]); setActiveClient(null); setScreen("chat"); };
  const handleLogout = async () => { await supabase.auth.signOut(); };

  const sendMessage = async (text, extraContext = "") => {
    const userText = (text !== undefined ? text : input).trim();
    if (!userText || loading) return;
    setInput("");
    const newMessages = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setLoading(true);
    const systemPrompt = extraContext ? getMasterPrompt(lang) + "\n\n" + extraContext : getMasterPrompt(lang);
    try {
      const result = await runAuditLoop(newMessages.map(m => ({ role: m.role, content: m.content })), setStatusKey, systemPrompt);
      setMessages(prev => [...prev, { role: "assistant", content: result }]);
      const score = extractScore(result);
      const clientId = activeClient ? activeClient.id : null;
      saveToHistory(userText, result, clientId, score);
      if (clientId && score) updateClientScore(clientId, score);
      if (!activeClient) setSaveModal({ query: userText, result });
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", content: `## ❌ ${t("errorTitle")}\n\n**${e.message}**\n\n- ${t("errorApiKey")}\n- ${t("errorUrl")}` }]);
    }
    setLoading(false); setStatusKey("");
  };

  const handleSaveClient = ({ name, url, sector }) => {
    const clients = loadClients();
    const newClient = { id: Date.now(), name, url, sector, createdAt: new Date().toISOString() };
    const history = loadHistory();
    if (history[0]) { history[0].clientId = newClient.id; localStorage.setItem("ignitia_history", JSON.stringify(history)); if (history[0].score) { newClient.lastScore = history[0].score; newClient.lastAudit = history[0].date; } }
    saveClients([newClient, ...clients]);
    setActiveClient(newClient); setSaveModal(null);
    setToast(`${name} ${t("toastSaved")}`);
  };

  const handleSelectClient = (client) => {
    setActiveClient(client); setScreen("chat");
    const audits = getClientAudits(client.id);
    if (audits.length > 0) setReauditModal(client);
    else { setMessages([]); setInput(`${t("starterAudit")} ${client.name}${client.url ? " - " + client.url : ""}`); setTimeout(() => textareaRef.current?.focus(), 100); }
  };

  const handleCompare = () => {
    const audits = getClientAudits(reauditModal.id);
    const last = audits[0];
    setReauditModal(null); setMessages([]);
    const context = `PREVIOUS AUDIT CONTEXT (${last.date}):\n${last.result.slice(0, 1500)}\n\nSPECIAL INSTRUCTION: Compare with the previous audit. At the end add a section showing what improved, what got worse and what remains the same.`;
    setTimeout(() => sendMessage(`${t("starterAudit")} ${reauditModal.name}${reauditModal.url ? " - " + reauditModal.url : ""}`, context), 100);
  };

  const handleFresh = () => {
    setReauditModal(null); setMessages([]);
    setInput(`${t("starterAudit")} ${reauditModal.name}${reauditModal.url ? " - " + reauditModal.url : ""}`);
    setTimeout(() => textareaRef.current?.focus(), 100);
  };

  const historyCount = loadHistory().length;

  const STARTER_CONFIGS = [
    { icon: "🔍", label: t("auditBusiness"), fields: [{ key: "nombre", label: t("businessName"), placeholder: t("businessNamePlaceholder") }, { key: "url", label: t("businessUrl"), placeholder: t("businessUrlPlaceholder") }], build: v => `${t("starterAudit")} ${v.nombre} - ${v.url}` },
    { icon: "🎯", label: t("realKeywords"), fields: [{ key: "negocio", label: t("businessCity"), placeholder: t("businessCityPlaceholder") }], build: v => `${t("starterKeywords")} ${v.negocio}` },
    { icon: "🚀", label: t("quickWins"), fields: [{ key: "url", label: t("siteUrl"), placeholder: t("siteUrlPlaceholder") }], build: v => `${t("starterWins")} ${v.url}` },
  ];

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Space+Grotesk:wght@700&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#30363d;border-radius:4px}
    @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.6)}}
    @keyframes blink{50%{opacity:0}}
    .loading-bar{height:2px;border-radius:2px;background:linear-gradient(90deg,#FF4500,#58a6ff,#3fb950,#FF4500);background-size:300%;animation:shimmer 1.8s linear infinite}
    .anim{animation:fadeUp .3s ease both}
    .send-btn{background:#FF4500;border:none;color:#fff;padding:10px 20px;border-radius:8px;cursor:pointer;font-family:inherit;font-size:12px;font-weight:700;white-space:nowrap;transition:all .2s}
    .send-btn:hover:not(:disabled){background:#FF6A33;transform:translateY(-1px)}
    .send-btn:disabled{opacity:.3;cursor:not-allowed}
    textarea{background:transparent;border:none;outline:none;color:#c9d1d9;font-family:inherit;font-size:13px;resize:none;width:100%;line-height:1.6}
    textarea::placeholder{color:#3d444d}
    select option{background:#161b22}
  `;

  const navMenuItems = [
    { icon: "💬", label: t("chat"), onClick: goHome },
    { icon: "📊", label: t("dashboard"), onClick: () => setScreen("dashboard") },
    { icon: "📋", label: `${t("history")} (${historyCount})`, onClick: () => setScreen("history") },
    { icon: t("logoutIcon"), label: t("logout"), onClick: handleLogout },
  ];

  if (authLoading) return (
    <div style={{ fontFamily: "'IBM Plex Mono',monospace", background: "#060a10", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#484f58", fontSize: 13 }}>{t("loading")}</div>
    </div>
  );

  return (
    <LangContext.Provider value={{ lang, t, setLang }}>
      {!session ? <LoginScreen /> : (
        <>
          {screen === "history" ? (
            <>
              <style>{globalStyles}</style>
              <HistoryPanel
                onClose={() => setScreen("dashboard")}
                onLoad={e => { setMessages([{ role: "user", content: e.query }, { role: "assistant", content: e.result }]); setActiveClient(null); setTimeout(() => setScreen("chat"), 50); }}
              />
            </>
          ) : screen === "dashboard" ? (
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", background: "#060a10", minHeight: "100vh", color: "#c9d1d9" }}>
              <style>{globalStyles}</style>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js" />
              <nav style={{ padding: "14px 24px", borderBottom: "1px solid #161b22", display: "flex", alignItems: "center", gap: 12, background: "#0d1117", position: "sticky", top: 0, zIndex: 50 }}>
                <NavLogo onClick={goHome} />
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
                  <LangSelector />
                  <div style={{ fontSize: 10, color: "#484f58" }}>{session.user.email}</div>
                  <HamburgerMenu items={navMenuItems} />
                </div>
              </nav>
              <Dashboard onNewAudit={goHome} onSelectClient={handleSelectClient} />
              {toast && <Toast message={toast} onClose={() => setToast(null)} />}
            </div>
          ) : (
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", background: "#060a10", minHeight: "100vh", color: "#c9d1d9", display: "flex", flexDirection: "column" }}>
              <style>{globalStyles}</style>
              {saveModal && <SaveClientModal
                defaultName={saveModal.query.replace(/.*?:\s*/, "").split(" - ")[0] || ""}
                defaultUrl={saveModal.query.includes("http") ? saveModal.query.match(/https?:\/\/[^\s]+/)?.[0] || "" : ""}
                onSave={handleSaveClient} onSkip={() => setSaveModal(null)} />}
              {reauditModal && <ReauditModal client={reauditModal} onCompare={handleCompare} onFresh={handleFresh} onCancel={() => { setReauditModal(null); setActiveClient(null); }} />}
              {toast && <Toast message={toast} onClose={() => setToast(null)} />}
              <nav style={{ padding: "14px 24px", borderBottom: "1px solid #161b22", display: "flex", alignItems: "center", gap: 12, background: "#0d1117", position: "sticky", top: 0, zIndex: 50 }}>
                <NavLogo onClick={goHome} clientName={activeClient?.name} />
                <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                  {activeClient && <button onClick={() => { setActiveClient(null); setMessages([]); }} style={{ background: "transparent", border: "1px solid #FF450055", color: "#FF4500", padding: "5px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "inherit", fontSize: 10 }}>{t("cleanBtn")}</button>}
                  <LangSelector />
                  <div style={{ fontSize: 10, color: "#484f58" }}>{session.user.email}</div>
                  <HamburgerMenu items={navMenuItems} />
                </div>
              </nav>
              <div style={{ flex: 1, overflowY: "auto", padding: "24px 20px 8px", display: "flex", flexDirection: "column", gap: 24, maxWidth: 1100, width: "100%", margin: "0 auto" }}>
                {messages.length === 0 && !loading && (
                  <div style={{ textAlign: "center", padding: "40px 20px" }} className="anim">
                    <div style={{ fontSize: 44, marginBottom: 10 }}>🔥</div>
                    <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, fontWeight: 700, color: "#e6edf3", marginBottom: 8 }}>
                      {activeClient ? `${t("clientPlaceholder")} ${activeClient.name}` : "Ignitia · SEO Auditor"}
                    </div>
                    <div style={{ fontSize: 13, color: "#484f58", maxWidth: 380, margin: "0 auto 32px", lineHeight: 1.6 }}>
                      {activeClient ? `${t("sector")}: ${activeClient.sector} · ${getClientAudits(activeClient.id).length} ${t("previousAudits")}` : "Auditorías digitales que encienden tu visibilidad."}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, maxWidth: 680, margin: "0 auto" }}>
                      {STARTER_CONFIGS.map(s => (
                        <StarterCard key={s.label} icon={s.icon} label={s.label} fields={s.fields} onSubmit={values => sendMessage(s.build(values))} />
                      ))}
                    </div>
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className="anim">
                    {msg.role === "user" ? (
                      <div style={{ display: "flex", justifyContent: "flex-end" }}>
                        <div style={{ background: "#161b22", border: "1px solid #30363d", borderRadius: "12px 12px 4px 12px", padding: "12px 16px", maxWidth: "75%" }}>
                          <div style={{ fontSize: 10, color: "#484f58", marginBottom: 6, letterSpacing: 1 }}>{t("youLabel")}</div>
                          <div style={{ fontSize: 13, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{msg.content}</div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ fontSize: 10, color: "#484f58", marginBottom: 12, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ color: "#FF4500" }}>🔥</span> IGNITIA · {t("reportLabel")}
                          {extractScore(msg.content) && <ScoreBadge score={extractScore(msg.content)} />}
                          <span style={{ marginLeft: "auto", fontSize: 9, color: "#30363d" }}>{t("saved")}</span>
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
                              <div dangerouslySetInnerHTML={{ __html: renderMd(section.content.join("\n")) }} />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="anim">
                    <div style={{ fontSize: 10, color: "#484f58", marginBottom: 10 }}><span style={{ color: "#FF4500" }}>🔥</span> IGNITIA · {t("auditingLabel")}</div>
                    <div style={{ background: "#0d1117", border: "1px solid #21262d", borderRadius: 10, padding: 20 }}>
                      <div className="loading-bar" style={{ marginBottom: 14 }} />
                      <div style={{ fontSize: 11, color: "#8b949e", marginBottom: 10 }}>{getStatusText(statusKey)}</div>
                      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                        {[t("tracking"),t("verifying"),t("keywords"),t("comparing")].map((txt, i) => (
                          <span key={i} style={{ fontSize: 10, color: "#30363d", animation: `blink ${1 + i * 0.5}s step-end infinite` }}>{txt}...</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>
              <div style={{ padding: "12px 20px 16px", borderTop: "1px solid #161b22", background: "#0d1117", maxWidth: 1100, width: "100%", margin: "0 auto" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-end", background: "#161b22", border: "1px solid #30363d", borderRadius: 10, padding: "12px 14px" }}>
                  <textarea ref={textareaRef} rows={2} value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                    placeholder={activeClient ? `${t("clientPlaceholder")} ${activeClient.name}...` : t("inputPlaceholder")} />
                  <button className="send-btn" onClick={() => sendMessage()} disabled={loading || !input.trim()}>
                    {loading ? t("auditingBtn") : t("auditBtn")}
                  </button>
                </div>
                <div style={{ fontSize: 9, color: "#21262d", textAlign: "center", marginTop: 8, letterSpacing: 1 }}>IGNITIA · SEO AUDITOR · DATA-DRIVEN. RESULTS-FOCUSED.</div>
              </div>
            </div>
          )}
        </>
      )}
    </LangContext.Provider>
  );
}

createRoot(document.getElementById("root")).render(<App />);
