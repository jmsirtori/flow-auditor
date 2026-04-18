// Ignitia · SEO Auditor v10.0
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
    appTagline:"Data-driven. Results-focused.",login:"Autenticación del Sistema",loginSub:"Ingresa tus credenciales para acceder a la consola.",loginBtn:"Ejecutar Login →",loginLoading:"Verificando...",loginError:"Credenciales incorrectas.",loginRestricted:"¿Necesitas acceso? Solicitar autorización",emailLabel:"Identificador",passwordLabel:"Clave de Acceso",emailPlaceholder:"USUARIO@IGNITIA.IO",passwordPlaceholder:"••••••••",dashboard:"Vista General",newAudit:"+ Nueva Auditoría",startAudit:"+ Iniciar Auditoría",emptyTitle:"Haz tu primera auditoría",emptyDesc:"Ingresa el nombre y URL de un negocio para generar tu primer reporte de visibilidad digital",allClients:"Libro Mayor de Auditorías",registered:"entidades activas",client:"Cliente / Endpoint",sector:"Sector",score:"Score",audits:"Auditorías",lastAudit:"Última Sync",noScore:"—",frictionChart:"Índice de Fricción por Cliente",critical:"Crítico",regular:"Regular",good:"Bueno",activeClients:"Clientes Activos",monthAudits:"Auditorías este mes",avgScore:"Score Promedio",improved:"Mejoraron",history:"Historial",historyTitle:"Historial de Auditorías",historyAudits:"auditorías",searchPlaceholder:"Filtrar por dominio o keyword...",filterAll:"Todos",filterMonth:"Este mes",filterClient:"Con cliente",filterCritical:"Críticos",emptyHistory:"No hay auditorías registradas",emptySearch:"Sin resultados",viewBtn:"Ver",saveClient:"¿Guardar como cliente?",saveClientDesc:"Aparecerá en tu dashboard con su score",nameLabel:"NOMBRE",urlLabel:"URL",sectorLabel:"SECTOR",sectorPlaceholder:"Ej: Restaurante de mariscos",saveBtn:"Guardar →",skipBtn:"No por ahora",reauditTitle:"Re-auditar",compareBtn:"📊 Comparar con auditoría anterior",compareDesc:"Claude analizará qué mejoró y qué sigue fallando",freshBtn:"🔍 Auditoría nueva desde cero",freshDesc:"Reporte completo sin comparar",cancelBtn:"Cancelar",chat:"Nueva Auditoría",logout:"Cerrar Sesión",cleanBtn:"✕ Limpiar",auditingLabel:"ANALIZANDO",connecting:"Conectando con el auditor...",processing:"Procesando búsqueda web (paso",analyzing:"Analizando resultados...",tracking:"Rastreando sitio",verifying:"Verificando NAP",keywords:"Analizando keywords",comparing:"Comparando competidores",reportLabel:"REPORTE COMPLETO",saved:"✓ Guardado",youLabel:"TÚ",auditBtn:"AUDITAR",auditingBtn:"AUDITANDO...",inputPlaceholder:"CONSULTAR SISTEMA O INICIAR NUEVA AUDITORÍA...",clientPlaceholder:"Auditar",configureClick:"Haz clic para configurar",contextLabel:"CONTEXTO ADICIONAL (OPCIONAL)",contextPlaceholder:"Ej: tienen TikTok 50k seguidores, presupuesto bajo, enfocarse en Instagram...",auditSubmit:"Auditar →",starterAudit:"🔍 Audita mi negocio:",starterKeywords:"🎯 ¿Por qué palabras clave me encuentra la gente? Mi negocio:",starterWins:"🚀 Dame 5 cambios rápidos para mejorar mi visibilidad. Mi sitio:",toastSaved:"guardado en tu dashboard",loading:"Cargando...",errorTitle:"Error",errorConn:"Verifica tu conexión",errorUrl:"Verifica que la URL esté completa",prevLabel:"anterior",prevLabelPlural:"anteriores",overview:"Vista General",version:"IGNITIA v10.0",executionDate:"Fecha",performance:"Performance",queryContext:"Consulta",operations:"Ops",showingOf:"Mostrando",addContextBtn:"+ Agregar contexto al reporte",addContextPlaceholder:"Ej: también tienen TikTok con 50k seguidores, ¿cómo cambian las recomendaciones?",sendContext:"Enviar →",clientModeOn:"Modo cliente: ON",clientModeOff:"Modo cliente: OFF",modules:"Módulos opcionales",modulePagespeed:"PageSpeed Insights",modulePagespeedDesc:"Core Web Vitals reales vía Google API",moduleSentiment:"Análisis de reseñas",moduleSentimentDesc:"Sentiment de Google Reviews",quickWinsDone:"Quick wins completados",loadingPagespeed:"Obteniendo métricas de velocidad...",tabConsultor:"Consultor",tabCliente:"Cliente",tabBenchmark:"Benchmark",tabGlosario:"Glosario",indexTitle:"Índice del reporte",radarTitle:"Diagnóstico visual",
  },
  en: {
    appTagline:"Data-driven. Results-focused.",login:"System Authentication",loginSub:"Enter credentials to access the console.",loginBtn:"Execute Login →",loginLoading:"Verifying...",loginError:"Incorrect credentials.",loginRestricted:"Need clearance? Request Access",emailLabel:"Identifier",passwordLabel:"Access_Key",emailPlaceholder:"USER@IGNITIA.IO",passwordPlaceholder:"••••••••",dashboard:"System Overview",newAudit:"+ New Audit",startAudit:"+ Start Audit",emptyTitle:"Run your first audit",emptyDesc:"Enter a business name and URL to generate your first digital visibility report",allClients:"Master Audit Ledger",registered:"active entities",client:"Client / Endpoint",sector:"Sector",score:"Score",audits:"Audits",lastAudit:"Last Sync",noScore:"—",frictionChart:"Client Friction Index",critical:"Critical",regular:"Regular",good:"Good",activeClients:"Active Clients",monthAudits:"Monthly Audits",avgScore:"Average Score",improved:"Improved",history:"History",historyTitle:"Audit History",historyAudits:"audits",searchPlaceholder:"Filter by domain or keyword...",filterAll:"All",filterMonth:"This month",filterClient:"With client",filterCritical:"Critical",emptyHistory:"No audits recorded yet",emptySearch:"No results",viewBtn:"View",saveClient:"Save as client?",saveClientDesc:"It will appear in your dashboard with its score",nameLabel:"NAME",urlLabel:"URL",sectorLabel:"SECTOR",sectorPlaceholder:"E.g: Seafood restaurant",saveBtn:"Save →",skipBtn:"Not now",reauditTitle:"Re-audit",compareBtn:"📊 Compare with previous audit",compareDesc:"Claude will analyze what improved and what still needs work",freshBtn:"🔍 Fresh audit from scratch",freshDesc:"Full report without comparing",cancelBtn:"Cancel",chat:"New Audit",logout:"Sign Out",cleanBtn:"✕ Clear",auditingLabel:"ANALYZING",connecting:"Connecting to auditor...",processing:"Processing web search (step",analyzing:"Analyzing results...",tracking:"Crawling site",verifying:"Verifying NAP",keywords:"Analyzing keywords",comparing:"Comparing competitors",reportLabel:"FULL REPORT",saved:"✓ Saved",youLabel:"YOU",auditBtn:"AUDIT",auditingBtn:"AUDITING...",inputPlaceholder:"QUERY SYSTEM OR START NEW AUDIT...",clientPlaceholder:"Audit",configureClick:"Click to configure",contextLabel:"ADDITIONAL CONTEXT (OPTIONAL)",contextPlaceholder:"E.g: they have TikTok 50k followers, low budget, focus on Instagram...",auditSubmit:"Audit →",starterAudit:"🔍 Audit my business:",starterKeywords:"🎯 What keywords do people use to find me? My business:",starterWins:"🚀 Give me 5 quick changes to improve my visibility. My site:",toastSaved:"saved to your dashboard",loading:"Loading...",errorTitle:"Error",errorConn:"Check your connection",errorUrl:"Make sure the URL is complete",prevLabel:"previous",prevLabelPlural:"previous",overview:"Overview",version:"IGNITIA v10.0",executionDate:"Date",performance:"Performance",queryContext:"Query",operations:"Ops",showingOf:"Showing",addContextBtn:"+ Add context to report",addContextPlaceholder:"E.g: they also have TikTok with 50k followers, how do recommendations change?",sendContext:"Send →",clientModeOn:"Client mode: ON",clientModeOff:"Client mode: OFF",modules:"Optional modules",modulePagespeed:"PageSpeed Insights",modulePagespeedDesc:"Real Core Web Vitals via Google API",moduleSentiment:"Review analysis",moduleSentimentDesc:"Google Reviews sentiment",quickWinsDone:"Quick wins completed",loadingPagespeed:"Fetching speed metrics...",tabConsultor:"Consultant",tabCliente:"Client",tabBenchmark:"Benchmark",tabGlosario:"Glossary",indexTitle:"Report index",radarTitle:"Visual diagnosis",
  }
};

const LangContext = createContext({ lang:"es", t:k=>T.es[k]||k, setLang:()=>{} });
function useLang() { return useContext(LangContext); }

// ─── Master prompt ─────────────────────────────────────────────────
function getMasterPrompt(lang, pagespeedData, modules) {
  const isEN = lang === "en";
  const system = `Eres un especialista en estrategia digital, conversión y presencia online para Ignitia. ${isEN ? "Respond entirely in English." : "Responde completamente en español."}`;

  const sequence = isEN ? `Analyze the business following this exact sequence:
1. SEARCH — Find real information about the business online: website, Google Maps, social media.
2. IDENTIFY — Determine the exact business type and target market.
3. AUDIT — Evaluate digital presence: NAP consistency, web friction, SEO, keywords, content, speed, social media.
4. PRIORITIZE — Select problems with highest impact on conversion or visibility.`
  : `Analiza el negocio siguiendo esta secuencia exacta:
1. BUSCAR — Busca información real del negocio en internet: sitio web, Google Maps, redes sociales.
2. IDENTIFICAR — Determina el giro exacto del negocio y su mercado objetivo.
3. AUDITAR — Evalúa su presencia digital: coherencia NAP, fricción web, SEO, keywords, contenido, velocidad, redes sociales.
4. PRIORIZAR — Selecciona los problemas con mayor impacto en conversión o visibilidad.`;

  const pagespeedContext = pagespeedData ? `
${isEN ? "REAL PAGESPEED DATA (use these exact values, do not estimate):" : "DATOS REALES DE PAGESPEED (usa estos valores exactos, no estimes):"}
- Mobile Performance: ${pagespeedData.mobile.performance}/100
- Desktop Performance: ${pagespeedData.desktop.performance}/100
- LCP: ${pagespeedData.mobile.lcp}
- FCP: ${pagespeedData.mobile.fcp}
- CLS: ${pagespeedData.mobile.cls}
- TBT: ${pagespeedData.mobile.fid}
- Speed Index: ${pagespeedData.mobile.speedIndex}
- Mobile SEO: ${pagespeedData.mobile.seo}/100
- Desktop SEO: ${pagespeedData.desktop.seo}/100` : "";

  const sentimentInstruction = modules?.sentiment ? (isEN
    ? "\n- REVIEWS: Search for Google reviews of this business. Analyze sentiment: what do they praise most, what are the main complaints, patterns, and recommendations."
    : "\n- RESEÑAS: Busca las reseñas de Google de este negocio. Analiza el sentiment: qué elogian más, cuáles son las quejas principales, patrones y recomendaciones.")
  : "";

  const structure = `${isEN ? "Respond using exactly these sections:" : "Responde usando exactamente estas secciones:"}

## 🛠️ ${isEN ? "INTERNAL NOTES" : "NOTAS INTERNAS"}
- ${isEN ? "Technical Analysis: errors, NAP inconsistencies, SEO metrics." : "Análisis Técnico: errores, inconsistencias NAP, métricas SEO."}${sentimentInstruction}
- ${isEN ? "Sales Hook: top weak point." : "Gancho de Venta: punto débil principal."}

## 📄 ${isEN ? "CLIENT REPORT" : "REPORTE PARA EL CLIENTE"}
### ⚡ ${isEN ? "Digital Presence Score" : "Score de Presencia Digital"}
${isEN ? "Score 1-10 of Digital Presence (1=very weak presence, 10=excellent presence). Evaluate how solid their overall online presence is." : "Score 1-10 de Presencia Digital (1=presencia muy débil, 10=presencia excelente). Evalúa qué tan sólida es su presencia online en conjunto."}
### 🎯 ${isEN ? "Your Google Showcase" : "Tu Vitrina en Google"}
### 🔍 ${isEN ? "The Road Bumps" : "Los Baches en el Camino"}
### 🏗️ ${isEN ? "Your Main Sign (H1)" : "Tu Letrero Principal (H1)"}
### 📍 ${isEN ? "Google Business Profile" : "Google Business Profile"}
${isEN ? "Evaluate: photos (quantity/quality), hours, responses to reviews, Q&A, posts. Score each aspect." : "Evalúa: fotos (cantidad/calidad), horarios, respuestas a reseñas, Q&A, publicaciones. Puntúa cada aspecto."}
### 🚀 ${isEN ? "Quick Wins (60 min)" : "Plan de Quick Wins (60 min)"}
${isEN ? "Present exactly 5 actions in this EXACT format — one per line after the table:" : "Presenta exactamente 5 acciones en este formato EXACTO — una por línea después de la tabla:"}
| ${isEN?"Action":"Acción"} | ${isEN?"Where":"Dónde"} | ${isEN?"Time":"Tiempo"} | ${isEN?"Impact":"Impacto"} |
|--------|-------|--------|---------|
${isEN?"After the table, list each quick win on its own line starting with QW:":"Después de la tabla, lista cada quick win en su propia línea comenzando con QW:"}
QW1: [${isEN?"action description":"descripción de la acción"}]
QW2: [${isEN?"action description":"descripción de la acción"}]
QW3: [${isEN?"action description":"descripción de la acción"}]
QW4: [${isEN?"action description":"descripción de la acción"}]
QW5: [${isEN?"action description":"descripción de la acción"}]

## 🏆 ${isEN ? "COMPETITIVE BENCHMARK" : "BENCHMARK COMPETITIVO"}
${isEN ? "2 main competitors in Google Top 3. For each: name, URL, 2-3 advantages, main keywords, friction score. End: Main gap + Immediate opportunity." : "2 competidores principales en Google Top 3. Para cada uno: nombre, URL, 2-3 ventajas, keywords principales, score de fricción. Al final: Brecha principal + Oportunidad inmediata."}

## 📚 ${isEN ? "GLOSSARY FOR BUSINESS OWNERS" : "DICCIONARIO PARA DUEÑOS"}
${isEN ? `Define the following terms using simple, physical-world analogies (no technical jargon):
- H1, SEO, NAP, Keywords, Digital Presence Score
${pagespeedData ? `- LCP (Largest Contentful Paint): how long until the main content appears
- FCP (First Contentful Paint): how long until anything appears on screen  
- TBT (Total Blocking Time): how long the page is frozen and unresponsive
- CLS (Cumulative Layout Shift): how much the page jumps around while loading
- Speed Index: how quickly the page looks visually complete
- Performance Score: Google's overall grade for page speed (0-100)
- Core Web Vitals: Google's 3 official speed metrics that affect rankings` : ""}` 
: `Define los siguientes términos con analogías del mundo físico (sin tecnicismos):
- H1, SEO, NAP, Keywords, Score de Presencia Digital
${pagespeedData ? `- LCP (Largest Contentful Paint): cuánto tarda en aparecer el contenido principal — como esperar a que abran la puerta de una tienda
- FCP (First Contentful Paint): cuánto tarda en aparecer cualquier cosa en pantalla — la primera señal de vida
- TBT (Total Blocking Time): cuánto tiempo la página está congelada e irresponsiva — como un empleado que no puede atenderte porque está ocupado
- CLS (Cumulative Layout Shift): cuánto se mueve el contenido mientras carga — como leer un menú que sigue cambiando de lugar
- Speed Index: qué tan rápido se ve visualmente completa la página — la primera impresión de tu vitrina
- Performance Score: la calificación general de velocidad de Google (0-100) — como una inspección de salud del sitio
- Core Web Vitals: las 3 métricas oficiales de velocidad de Google que afectan directamente tu posicionamiento en búsquedas` : ""}`}

${isEN?"At the end always include ALL of these tags (required for dashboard):":"Al final incluye SIEMPRE TODOS estos tags (requeridos para el dashboard):"}
IGNITIA_SCORE: [${isEN?"digital presence score 1-10":"score de presencia digital 1-10"}]
IGNITIA_SECTOR: [${isEN?"specific detected sector, max 4 words":"sector específico detectado, máximo 4 palabras"}]
IGNITIA_RADAR: SEO=${isEN?"[1-10]":"[1-10]"},LOCAL=${isEN?"[1-10]":"[1-10]"},CONTENT=${isEN?"[1-10]":"[1-10]"},SPEED=${isEN?"[1-10]":"[1-10]"},SOCIAL=${isEN?"[1-10]":"[1-10]"}

${isEN ? `ANTI-HALLUCINATION RULES (mandatory):
1. VERIFIED DATA: Only present as fact what you found via web search. Always cite the source in parentheses: "947k visits/month (Similarweb, Feb 2026)".
2. ESTIMATES: If you infer something from indirect signals, prefix it: "Estimated based on [source/observation]:..."
3. NOT FOUND: If you could not find specific data, write exactly: "Could not verify: [data point] — please review manually."
4. NEVER invent metrics, rankings, review counts, or traffic numbers. If you did not find it in search results, it does not exist in this report.
5. TRAINING DATA: Do not use knowledge from your training to fill gaps — only use what the web search returned in this session.` 
: `REGLAS ANTI-ALUCINACIÓN (obligatorias):
1. DATOS VERIFICADOS: Solo presenta como hecho lo que encontraste mediante búsqueda web. Siempre cita la fuente entre paréntesis: "947k visitas/mes (Similarweb, Feb 2026)".
2. ESTIMACIONES: Si infierres algo a partir de señales indirectas, anteponle: "Estimado basado en [fuente/observación]:..."
3. NO ENCONTRADO: Si no pudiste encontrar un dato específico, escribe exactamente: "No pude verificar: [dato] — favor de revisar manualmente."
4. NUNCA inventes métricas, posicionamientos, cantidad de reseñas o cifras de tráfico. Si no lo encontraste en los resultados de búsqueda, no existe en este reporte.
5. DATOS DE ENTRENAMIENTO: No uses conocimiento de tu entrenamiento para llenar vacíos — solo usa lo que el web search devolvió en esta sesión.`}`;

  return `${system}\n\n${sequence}${pagespeedContext}\n\n${structure}`;
}

// ─── Supabase DB ───────────────────────────────────────────────────
async function dbLoadClients(userId) {
  const { data, error } = await supabase.from("clients").select("*").eq("user_id", userId).order("created_at", { ascending: false });
  if (error) { console.error("Error loading clients:", error); return []; }
  return data || [];
}
async function dbSaveClient(client, userId) {
  const { data, error } = await supabase.from("clients").insert([{ ...client, user_id: userId }]).select().single();
  if (error) { console.error("Error saving client:", error); return null; }
  return data;
}
async function dbUpdateClient(id, updates, userId) {
  const { error } = await supabase.from("clients").update(updates).eq("id", id).eq("user_id", userId);
  if (error) console.error("Error updating client:", error);
}
async function dbLoadHistory(userId) {
  const { data, error } = await supabase.from("audits").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(100);
  if (error) { console.error("Error loading history:", error); return []; }
  return data || [];
}
async function dbSaveAudit(audit, userId) {
  const { data, error } = await supabase.from("audits").insert([{ ...audit, user_id: userId }]).select().single();
  if (error) { console.error("Error saving audit:", error); return null; }
  return data;
}
async function dbLoadQuickWins(auditId) {
  const { data, error } = await supabase.from("quick_wins").select("*").eq("audit_id", auditId).order("created_at");
  if (error) { console.error("Error loading quick wins:", error); return []; }
  return data || [];
}
async function dbSaveQuickWins(wins, auditId, clientId, userId) {
  const rows = wins.map((w, i) => ({ action: w, completed: false, audit_id: auditId, client_id: clientId || null, user_id: userId }));
  const { error } = await supabase.from("quick_wins").insert(rows);
  if (error) console.error("Error saving quick wins:", error);
}
async function dbToggleQuickWin(id, completed) {
  const { error } = await supabase.from("quick_wins").update({ completed }).eq("id", id);
  if (error) console.error("Error toggling quick win:", error);
}
async function dbLoadPendingQuickWins(clientId) {
async function dbDeleteAudit(id) {
  const { error } = await supabase.from("audits").delete().eq("id", id);
  if (error) console.error("Error deleting audit:", error);
}
  const { data, error } = await supabase.from("quick_wins").select("*").eq("client_id", clientId).eq("completed", false).order("created_at");
  if (error) { console.error("Error loading pending wins:", error); return []; }
  return data || [];
}

// ─── Parsers ───────────────────────────────────────────────────────
function extractScore(text) {
  const m = text.match(/IGNITIA_SCORE:\s*(\d+(?:\.\d+)?)/);
  if (m) return parseFloat(m[1]);
  const m2 = text.match(/[Ff]ricci[oó]n[^0-9]*(\d+(?:\.\d+)?)\s*\/\s*10/);
  if (m2) return parseFloat(m2[1]);
  return null;
}
function extractSector(text) {
  const m = text.match(/IGNITIA_SECTOR:\s*([^\n]+)/);
  if (m) return m[1].trim();
  return null;
}
function extractRadar(text) {
  const m = text.match(/IGNITIA_RADAR:\s*SEO=(\d+)[,\s]+LOCAL=(\d+)[,\s]+CONTENT=(\d+)[,\s]+SPEED=(\d+)[,\s]+SOCIAL=(\d+)/i);
  if (!m) return null;
  return { seo:parseInt(m[1]), local:parseInt(m[2]), content:parseInt(m[3]), speed:parseInt(m[4]), social:parseInt(m[5]) };
}
function extractQuickWins(text) {
  const wins = [];
  const lines = text.split("\n");
  for (const line of lines) {
    const m = line.match(/^QW\d+:\s*(.+)/);
    if (m && m[1].trim()) wins.push(m[1].trim());
  }
  return wins;
}
function cleanText(text) {
  return text
    .replace(/IGNITIA_SCORE:\s*\d+(?:\.\d+)?/g, "")
    .replace(/IGNITIA_SECTOR:\s*[^\n]+/g, "")
    .replace(/IGNITIA_RADAR:\s*[^\n]+/g, "")
    .replace(/QW\d+:\s*[^\n]+/g, "")
    .trim();
}

// ─── Markdown renderer ─────────────────────────────────────────────
function getStyle(title) {
  if (!title) return { bg:"#171c22", border:"#31353c", accent:"#a2c9ff", tag:"INFO" };
  if (title.includes("NOTAS")||title.includes("INTERNAL")||title.includes("🛠")) return { bg:"#1a0f00", border:"#FF450044", accent:"#FF4500", tag:title.includes("INTERNAL")?"CONSULTANT ONLY":"SOLO CONSULTOR" };
  if (title.includes("REPORTE")||title.includes("REPORT")||title.includes("📄")) return { bg:"#0a1220", border:"#a2c9ff33", accent:"#a2c9ff", tag:title.includes("REPORT")?"FOR CLIENT":"PARA EL CLIENTE" };
  if (title.includes("BENCH")||title.includes("🏆")) return { bg:"#110f1a", border:"#d5bbff33", accent:"#d5bbff", tag:"BENCHMARK" };
  if (title.includes("DICCI")||title.includes("GLOSS")||title.includes("📚")) return { bg:"#0a1a0a", border:"#3fb95033", accent:"#3fb950", tag:title.includes("GLOSS")?"GLOSSARY":"GLOSARIO" };
  return { bg:"#171c22", border:"#31353c", accent:"#a2c9ff", tag:"INFO" };
}
function parseMarkdownSections(text) {
  const clean = cleanText(text);
  const sections = [], lines = clean.split("\n"); let current = null;
  for (const line of lines) {
    if (line.startsWith("## ")) { if (current) sections.push(current); current = { title: line.replace(/^## /, "").trim(), content: [] }; }
    else if (current) current.content.push(line);
    else { if (!sections.length) sections.push({ title: null, content: [] }); sections[0].content.push(line); }
  }
  if (current) sections.push(current);
  return sections.filter(s => s.title || s.content.join("").trim());
}
function formatInline(text) {
  return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>");
}
function renderMd(raw) {
  const lines = raw.split("\n"); let html = "", i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim().startsWith("|") && lines[i+1]?.trim().startsWith("|---")) {
      const headers = line.trim().split("|").filter(c=>c.trim()).map(c=>c.trim()); i += 2;
      let rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) { rows.push(lines[i].trim().split("|").filter(c=>c.trim()).map(c=>c.trim())); i++; }
      html += `<div style="overflow-x:auto;margin:12px 0"><table style="width:100%;border-collapse:collapse;font-size:11px"><thead><tr style="border-bottom:1px solid #31353c">${headers.map(h=>`<th style="text-align:left;padding:8px 12px;color:#484f58;font-weight:700;text-transform:uppercase;letter-spacing:.05em">${formatInline(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((row,ri)=>`<tr style="border-bottom:1px solid #171c22;${ri%2===0?"background:#ffffff05":""}">${row.map(cell=>{const ic=(cell==="Alto"||cell==="High")?"#3fb950":(cell==="Medio"||cell==="Medium")?"#d29922":(cell==="Bajo"||cell==="Low")?"#484f58":(cell==="Crítico"||cell==="Critical")?"#E24B4A":null;return`<td style="padding:8px 12px;color:#dfe2ec;vertical-align:top">${ic?`<span style="background:${ic}22;color:${ic};padding:2px 8px;border-radius:2px;font-size:10px;font-weight:700;text-transform:uppercase">${cell}</span>`:formatInline(cell)}</td>`;}).join("")}</tr>`).join("")}</tbody></table></div>`;
      continue;
    }
    if (line.startsWith("### ")) { html += `<h4 style="font-size:11px;font-weight:700;margin:16px 0 8px;color:#dfe2ec;text-transform:uppercase;letter-spacing:.1em">${formatInline(line.slice(4))}</h4>`; i++; continue; }
    if (line.startsWith("- ")) { html += `<li style="font-size:12px;line-height:1.65;margin-bottom:5px;margin-left:18px;color:#dfe2ec">${formatInline(line.slice(2))}</li>`; i++; continue; }
    if (!line.trim()) { html += "<br/>"; i++; continue; }
    html += `<p style="font-size:12px;line-height:1.75;margin-bottom:8px;color:#dfe2ec">${formatInline(line)}</p>`; i++;
  }
  return html;
}

// ─── API ───────────────────────────────────────────────────────────
async function fetchPageSpeed(url) {
  const res = await fetch("/api/pagespeed", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ url }) });
  if (!res.ok) return null;
  return await res.json();
}
async function runAuditLoop(apiMessages, onStatus, systemOverride, model="claude-sonnet-4-6") {
  const MAX_TURNS = 12; let msgs = [...apiMessages];
  let totalInputTokens = 0; let totalOutputTokens = 0; let totalCost = 0;
  for (let turn = 0; turn < MAX_TURNS; turn++) {
    onStatus(turn === 0 ? "connecting" : `processing:${turn}`);
    const res = await fetch("/api/audit", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ model, max_tokens:model==="claude-haiku-4-5-20251001"?2000:4000, system:systemOverride, tools:[{type:"web_search_20250305",name:"web_search"}], messages:msgs }) });
    if (!res.ok) { const err = await res.json().catch(()=>({})); throw new Error(err?.error?.message||`HTTP ${res.status}`); }
    const data = await res.json(); const { content, stop_reason } = data;
    if (data._cost) {
      totalInputTokens += data._cost.input_tokens;
      totalOutputTokens += data._cost.output_tokens;
      totalCost += data._cost.cost;
    }
    msgs = [...msgs, { role:"assistant", content }];
    if (stop_reason === "end_turn") {
      const text = content.filter(b=>b.type==="text").map(b=>b.text).join("\n").trim();
      if (!text) throw new Error("Empty response.");
      return { text, tokens: { input: totalInputTokens, output: totalOutputTokens, cost: parseFloat(totalCost.toFixed(5)) } };
    }
    if (stop_reason === "tool_use") {
      const wr = content.filter(b=>b.type==="web_search_tool_result"); if (wr.length > 0) { onStatus("analyzing"); continue; }
      const tu = content.filter(b=>b.type==="tool_use"); if (tu.length > 0) msgs = [...msgs, { role:"user", content:tu.map(t=>({type:"tool_result",tool_use_id:t.id,content:"OK"})) }];
      continue;
    }
    const fb = content.filter(b=>b.type==="text").map(b=>b.text).join("\n").trim();
    if (fb) return { text: fb, tokens: { input: totalInputTokens, output: totalOutputTokens, cost: parseFloat(totalCost.toFixed(5)) } };
    throw new Error(`Unexpected stop: ${stop_reason}`);
  }
  throw new Error("Too many steps.");
}

// ─── UI Components ─────────────────────────────────────────────────
function ScoreBadge({ score, size="sm" }) {
  const { t } = useLang(); if (!score) return null;
  const color = score<=4?"#E24B4A":score<=7?"#d29922":"#3fb950";
  const label = score<=4?t("critical"):score<=7?t("regular"):t("good");
  return (<span style={{display:"inline-flex",alignItems:"center",gap:5,padding:size==="lg"?"4px 12px":"3px 8px",borderRadius:2,background:`${color}15`,border:`1px solid ${color}40`}}><span style={{width:6,height:6,borderRadius:"50%",background:color,boxShadow:`0 0 6px ${color}`,display:"inline-block"}}/><span style={{color,fontWeight:700,fontSize:size==="lg"?12:10,fontFamily:"'Cordia New',monospace",textTransform:"uppercase",letterSpacing:"0.1em"}}>{score}/10 · {label}</span></span>);
}

function TrendBadge({ current, previous }) {
  if (!current || !previous) return null;
  const diff = (current - previous).toFixed(1);
  const up = current > previous;
  const color = up ? "#3fb950" : "#E24B4A";
  const arrow = up ? "↓" : "↑";
  return (<span style={{fontSize:10,color,fontFamily:"'Cordia New',monospace",fontWeight:700,marginLeft:4}}>{arrow}{Math.abs(diff)}</span>);
}

function LangSelector() {
  const { lang, setLang } = useLang();
  return (<div style={{display:"flex",background:"#171c22",borderRadius:4,overflow:"hidden",border:"1px solid #31353c22"}}>{["es","en"].map(l=>(<button key={l} onClick={()=>setLang(l)} style={{background:lang===l?"#FF4500":"transparent",border:"none",color:lang===l?"#fff":"#484f58",padding:"4px 10px",cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:10,fontWeight:700,letterSpacing:"0.1em",transition:"all .15s"}}>{l.toUpperCase()}</button>))}</div>);
}

function Toast({ message, onClose }) {
  useEffect(()=>{ const t = setTimeout(onClose,3500); return ()=>clearTimeout(t); },[]);
  return (<div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:500,display:"flex",alignItems:"center",gap:10,background:"#171c22",border:"1px solid #3fb95044",borderRadius:4,padding:"12px 20px",whiteSpace:"nowrap",boxShadow:"0 0 40px rgba(63,185,80,0.1)"}}><span style={{width:8,height:8,borderRadius:"50%",background:"#3fb950",boxShadow:"0 0 8px #3fb950",display:"inline-block"}}/><span style={{color:"#3fb950",fontSize:11,fontWeight:700,fontFamily:"'Cordia New',monospace",textTransform:"uppercase",letterSpacing:"0.1em"}}>{message}</span><span onClick={onClose} style={{color:"#484f58",fontSize:16,cursor:"pointer",marginLeft:8}}>×</span></div>);
}

function Sidebar({ currentView, setView, session, onLogout }) {
  const { t } = useLang();
  const items = [{ id:"dashboard", label:t("overview"), icon:"▦" }, { id:"chat", label:t("chat"), icon:">_" }, { id:"history", label:t("history"), icon:"◷" }];
  return (<aside style={{width:240,position:"fixed",left:0,top:0,bottom:0,zIndex:40,background:"#171c22",borderRight:"1px solid rgba(255,69,0,0.1)",display:"flex",flexDirection:"column",paddingTop:80}}>
    <div style={{padding:"0 24px 20px"}}><div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#FF4500"}}>Ignitia Console</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",opacity:0.5,textTransform:"uppercase",marginTop:3}}>V10.0-STABLE</div></div>
    <nav style={{flex:1,padding:"0 12px"}}>{items.map(item=>(<button key={item.id} onClick={()=>setView(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"10px 16px",border:"none",borderRight:`3px solid ${currentView===item.id?"#FF4500":"transparent"}`,background:currentView===item.id?"#31353c":"transparent",color:currentView===item.id?"#dfe2ec":"rgba(223,226,236,0.4)",cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2,transition:"all .2s",textAlign:"left"}}><span style={{fontFamily:"monospace",fontSize:12,opacity:0.7}}>{item.icon}</span>{item.label}</button>))}</nav>
    <div style={{padding:"16px 24px",borderTop:"1px solid rgba(255,255,255,0.05)"}}><div style={{fontSize:10,color:"#484f58",fontFamily:"'Cordia New',monospace",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{session?.user?.email}</div><div style={{display:"flex",gap:8,alignItems:"center"}}><LangSelector/><button onClick={onLogout} style={{background:"transparent",border:"1px solid #31353c",color:"#484f58",padding:"4px 8px",borderRadius:4,cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:9,textTransform:"uppercase"}}>{t("logout")}</button></div></div>
  </aside>);
}

function TopBar({ setView }) {
  return (<nav style={{position:"fixed",top:0,left:0,right:0,height:64,zIndex:50,background:"rgba(23,28,34,0.85)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,69,0,0.15)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px"}}>
    <div onClick={()=>setView("dashboard")} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}><div style={{width:32,height:32,background:"linear-gradient(135deg,#FF4500,#c43300)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🔥</div><span style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:16,color:"#dfe2ec",textTransform:"uppercase",letterSpacing:"0.1em"}}>Ignitia</span></div>
    <div style={{display:"flex",alignItems:"center",gap:16}}><div style={{width:8,height:8,borderRadius:"50%",background:"#3fb950",boxShadow:"0 0 8px rgba(63,185,80,0.5)"}}/><span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em"}}>IGNITIA v10.0</span></div>
  </nav>);
}

// ─── Radar Chart ───────────────────────────────────────────────────
function RadarChart({ data, lang }) {
  const canvasRef = useRef(null);
  const labels = lang === "en" ? ["SEO","Local","Content","Speed","Social"] : ["SEO","Local","Contenido","Velocidad","Redes"];
  useEffect(() => {
    const loadAndRender = () => {
      if (window.Chart) { renderRadar(); return; }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
      script.onload = renderRadar;
      document.head.appendChild(script);
    };
    const renderRadar = () => {
      if (!data || !canvasRef.current || !window.Chart) return;
      const existing = canvasRef.current._chartInst;
      if (existing) existing.destroy();
      canvasRef.current._chartInst = new window.Chart(canvasRef.current, {
        type: "radar",
        data: { labels, datasets: [{ data: [data.seo, data.local, data.content, data.speed, data.social], backgroundColor:"rgba(255,69,0,0.15)", borderColor:"#FF4500", borderWidth:2, pointBackgroundColor:"#FF4500", pointRadius:4 }] },
        options: { responsive:true, maintainAspectRatio:true, plugins:{ legend:{ display:false } }, scales:{ r:{ min:0, max:10, ticks:{ stepSize:2, color:"#484f58", font:{ size:9 }, backdropColor:"transparent" }, grid:{ color:"rgba(255,255,255,0.07)" }, pointLabels:{ color:"#8b949e", font:{ size:10 } }, angleLines:{ color:"rgba(255,255,255,0.07)" } } } }
      });
    };
    loadAndRender();
  }, [data]);
  if (!data) return null;
  return (<div style={{background:"#0f141a",border:"1px solid #21262d",borderRadius:8,padding:16,marginBottom:12}}>
    <div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:10}}>{lang==="en"?"Visual diagnosis":"Diagnóstico visual"}</div>
    <div style={{width:"100%",maxWidth:240,margin:"0 auto"}}><canvas ref={canvasRef}/></div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4,marginTop:10}}>
      {labels.map((l,i)=>{const val=[data.seo,data.local,data.content,data.speed,data.social][i];const color=val<=4?"#E24B4A":val<=7?"#d29922":"#3fb950";return(<div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"#171c22",borderRadius:4,padding:"4px 8px"}}><span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase"}}>{l}</span><span style={{fontFamily:"'Cordia New',monospace",fontSize:10,fontWeight:700,color}}>{val}/10</span></div>);})}
    </div>
  </div>);
}

// ─── Quick Wins Checklist ──────────────────────────────────────────
function QuickWinsChecklist({ wins, auditId, userId }) {
  const { t } = useLang();
  const [items, setItems] = useState([]);
  useEffect(() => {
    if (!auditId) { setItems(wins.map((w,i)=>({ id:i, action:w, completed:false, dbId:null }))); return; }
    dbLoadQuickWins(auditId).then(data => {
      if (data.length > 0) setItems(data.map(d=>({ id:d.id, action:d.action, completed:d.completed, dbId:d.id })));
      else setItems(wins.map((w,i)=>({ id:i, action:w, completed:false, dbId:null })));
    });
  }, [auditId]);
  const toggle = async (item) => {
    const newCompleted = !item.completed;
    setItems(prev => prev.map(i => i.id===item.id ? {...i,completed:newCompleted} : i));
    if (item.dbId) await dbToggleQuickWin(item.dbId, newCompleted);
  };
  const done = items.filter(i=>i.completed).length;
  if (!items.length) return null;
  return (<div style={{background:"#0f141a",border:"1px solid #21262d",borderRadius:8,padding:16,marginBottom:12}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.15em"}}>Quick Wins</div>
      <div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:done===items.length?"#3fb950":"#484f58"}}>{done}/{items.length} {t("quickWinsDone")}</div>
    </div>
    <div style={{height:3,background:"#31353c",borderRadius:2,marginBottom:12,overflow:"hidden"}}><div style={{height:"100%",background:"#3fb950",borderRadius:2,transition:"width .3s",width:`${(done/items.length)*100}%`}}/></div>
    {items.map((item,i) => (<div key={item.id} onClick={()=>toggle(item)} style={{display:"flex",alignItems:"flex-start",gap:10,padding:"8px 0",borderBottom:i<items.length-1?"1px solid #161b22":"none",cursor:"pointer"}}>
      <div style={{width:16,height:16,borderRadius:3,border:`1.5px solid ${item.completed?"#3fb950":"#31353c"}`,background:item.completed?"#3fb95022":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,transition:"all .15s"}}>
        {item.completed && <span style={{color:"#3fb950",fontSize:10,fontWeight:700}}>✓</span>}
      </div>
      <span style={{fontFamily:"'Cordia New',monospace",fontSize:11,color:item.completed?"#484f58":"#c9d1d9",lineHeight:1.5,textDecoration:item.completed?"line-through":"none"}}>{item.action}</span>
    </div>))}
  </div>);
}

// ─── Report Index ──────────────────────────────────────────────────
function ReportIndex({ sections, lang }) {
  const icons = { "🛠":"#FF4500", "📄":"#a2c9ff", "🏆":"#d5bbff", "📚":"#3fb950" };
  const titled = sections.filter(s=>s.title);
  if (titled.length < 2) return null;
  return (<div style={{background:"#0f141a",border:"1px solid #21262d",borderRadius:8,padding:"12px 16px",marginBottom:16}}>
    <div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:10}}>{lang==="en"?"Report index":"Índice del reporte"}</div>
    <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
      {titled.map((s,i)=>{const emoji=s.title.match(/[\u{1F300}-\u{1FFFF}]|[🛠📄🏆📚]/u)?.[0]||"·";const color=icons[emoji]||"#8b949e";return(<a key={i} href={`#section-${i}`} onClick={e=>{e.preventDefault();document.getElementById(`section-${i}`)?.scrollIntoView({behavior:"smooth",block:"start"});}} style={{display:"inline-flex",alignItems:"center",gap:5,background:"#171c22",border:`1px solid ${color}33`,borderRadius:4,padding:"4px 10px",textDecoration:"none",cursor:"pointer"}}><span style={{fontSize:11}}>{emoji}</span><span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color,textTransform:"uppercase",letterSpacing:"0.05em"}}>{s.title.replace(/[^\w\s·]/g,"").trim().slice(0,20)}</span></a>);})}
    </div>
  </div>);
}

// ─── Score Hero ────────────────────────────────────────────────────
function ScoreHero({ score, lang }) {
  if (!score) return null;
  const color = score<=4?"#E24B4A":score<=7?"#d29922":"#3fb950";
  const label = score<=4?(lang==="en"?"Critical":"Crítico"):score<=7?(lang==="en"?"Regular":"Regular"):(lang==="en"?"Good":"Bueno");
  const desc = score<=4?(lang==="en"?"Very weak digital presence — immediate action needed":"Presencia digital muy débil — acción inmediata"):score<=7?(lang==="en"?"Moderate presence — several opportunities to improve":"Presencia moderada — varias oportunidades de mejora"):(lang==="en"?"Strong digital presence — well positioned":"Presencia digital sólida — bien posicionado");
  return (<div style={{background:`${color}08`,border:`1px solid ${color}33`,borderRadius:10,padding:"20px 24px",marginBottom:16,display:"flex",alignItems:"center",gap:24}}>
    <div style={{textAlign:"center",flexShrink:0}}>
      <div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:52,color,lineHeight:1}}>{score}</div>
      <div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginTop:2}}>/ 10</div>
    </div>
    <div style={{flex:1}}>
      <div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:16,color,textTransform:"uppercase",marginBottom:4}}>{label}</div>
      <div style={{fontFamily:"'Cordia New',monospace",fontSize:11,color:"#8b949e",marginBottom:10}}>{desc}</div>
      <div style={{height:6,background:"#21262d",borderRadius:3,overflow:"hidden"}}><div style={{height:"100%",background:color,borderRadius:3,width:`${score*10}%`,transition:"width 1s ease"}}/></div>
    </div>
  </div>);
}

// ─── Login ─────────────────────────────────────────────────────────
function LoginScreen() {
  const { t } = useLang();
  const [email,setEmail] = useState(""); const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false); const [error,setError] = useState("");
  const handleLogin = async () => {
    if (!email||!password) return setError(t("loginError"));
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(t("loginError")); setLoading(false);
  };
  return (<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,background:"#060a10",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:"-20%",left:"-10%",width:"60%",height:"60%",borderRadius:"50%",background:"rgba(255,69,0,0.03)",filter:"blur(120px)"}}/>
    <div style={{position:"absolute",bottom:"-20%",right:"-10%",width:"50%",height:"50%",borderRadius:"50%",background:"rgba(255,69,0,0.03)",filter:"blur(120px)"}}/>
    <div style={{position:"relative",zIndex:10,width:"100%",maxWidth:420}}>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:24}}><LangSelector/></div>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{width:64,height:64,background:"linear-gradient(135deg,#FF4500,#c43300)",borderRadius:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,margin:"0 auto 16px",boxShadow:"0 10px 30px rgba(255,69,0,0.3)"}}>🔥</div>
        <div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:36,color:"#fff",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>Ignitia</div>
        <div style={{fontFamily:"'Cordia New',monospace",fontSize:10,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.2em"}}>{t("appTagline")}</div>
      </div>
      <div style={{background:"#0f141a",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,padding:36,boxShadow:"0 0 40px rgba(255,69,0,0.05)"}}>
        <div style={{marginBottom:28}}><div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:18,color:"#fff",textTransform:"uppercase",marginBottom:4}}>{t("login")}</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:11,color:"#484f58"}}>{t("loginSub")}</div></div>
        {[{label:t("emailLabel"),type:"email",value:email,set:setEmail,placeholder:t("emailPlaceholder")},{label:t("passwordLabel"),type:"password",value:password,set:setPassword,placeholder:t("passwordPlaceholder")}].map(f=>(<div key={f.label} style={{marginBottom:24}}><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,textTransform:"uppercase",letterSpacing:"0.2em",color:"#484f58",marginBottom:8}}>{f.label}</div><input type={f.type} value={f.value} onChange={e=>f.set(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleLogin()} placeholder={f.placeholder} style={{width:"100%",background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.1)",padding:"10px 0",color:"#fff",fontFamily:"'Cordia New',monospace",fontSize:13,outline:"none",boxSizing:"border-box"}}/></div>))}
        {error && <div style={{background:"rgba(232,75,74,0.1)",border:"1px solid rgba(232,75,74,0.3)",borderRadius:4,padding:"10px 14px",color:"#E24B4A",fontSize:11,fontFamily:"'Cordia New',monospace",marginBottom:20}}>{error}</div>}
        <button onClick={handleLogin} disabled={loading} style={{width:"100%",background:loading?"#7a2200":"#FF4500",border:"none",borderRadius:8,padding:"14px",color:"#fff",fontFamily:"'Supply',monospace",fontSize:13,fontWeight:700,cursor:loading?"not-allowed":"pointer",textTransform:"uppercase",letterSpacing:"0.2em"}}>{loading?t("loginLoading"):t("loginBtn")}</button>
        <div style={{marginTop:20,textAlign:"center",fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em"}}>{t("loginRestricted")}</div>
      </div>
    </div>
  </div>);
}

// ─── Dashboard ─────────────────────────────────────────────────────
function DashboardView({ clients, history, onNewAudit, onSelectClient, onViewClient }) {
  const { t, lang } = useLang();
  const scored = history.filter(h=>h.score);
  const avgScore = scored.length ? (scored.reduce((a,b)=>a+b.score,0)/scored.length).toFixed(1) : null;
  const thisMonth = history.filter(h=>{ const d=new Date(h.created_at); const n=new Date(); return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear(); }).length;
  const improved = clients.filter(c=>{ const a=history.filter(h=>h.client_id===c.id&&h.score); return a.length>=2&&a[0].score>a[1].score; }).length;
  const chartClients = clients.filter(c=>c.last_score).slice(0,8);

  useEffect(()=>{
    const loadChart = () => {
      if (window.Chart) { renderChart(); return; }
      const script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js";
      script.onload = renderChart;
      document.head.appendChild(script);
    };
    const renderChart = () => {
      if (!chartClients.length||!window.Chart) return;
      const ex = window.ignitiaChart; if (ex) ex.destroy();
      const ctx = document.getElementById("dashChart"); if (!ctx) return;
      window.ignitiaChart = new window.Chart(ctx,{ type:"bar", data:{ labels:chartClients.map(c=>c.name.length>10?c.name.slice(0,10)+"…":c.name), datasets:[{ data:chartClients.map(c=>c.last_score), backgroundColor:chartClients.map(c=>c.last_score<=4?"#E24B4A":c.last_score<=7?"#d29922":"#3fb950"), borderRadius:0 }] }, options:{ responsive:true, maintainAspectRatio:false, plugins:{ legend:{ display:false } }, scales:{ y:{ min:0, max:10, ticks:{ stepSize:2, color:"#484f58", font:{ family:"'Cordia New',monospace", size:9 } }, grid:{ color:"rgba(255,255,255,0.03)" } }, x:{ ticks:{ color:"#484f58", font:{ family:"'Cordia New',monospace", size:9 }, autoSkip:false, maxRotation:45 }, grid:{ display:false } } } } });
    };
    loadChart();
  },[clients.length]);

  const stats = [
    {label:t("activeClients"),value:clients.length,change:"",color:"#FF4500"},
    {label:t("monthAudits"),value:thisMonth,change:"TOTAL",color:"#dfe2ec"},
    {label:t("avgScore"),value:avgScore||"—",change:avgScore?(avgScore<=4?t("critical"):avgScore<=7?t("regular"):t("good")):"—",color:avgScore?(avgScore<=4?"#E24B4A":avgScore<=7?"#d29922":"#3fb950"):"#484f58",pulse:!!avgScore},
    {label:t("improved"),value:improved,change:"",color:"#3fb950"},
  ];

  return (<div style={{display:"flex",flexDirection:"column",gap:32}}>
    <header><div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:36,color:"#fff",textTransform:"uppercase",letterSpacing:"-0.02em",marginBottom:4}}>{t("dashboard")}</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.2em"}}>V10.0 // ACTIVE SESSION</div></header>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14}}>
      {stats.map((s,i)=>(<div key={i} style={{background:"#171c22",borderLeft:`4px solid ${s.color}`,padding:"16px 20px"}}><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,textTransform:"uppercase",letterSpacing:"0.15em",color:"#484f58",marginBottom:10}}>{s.label}</div><div style={{display:"flex",alignItems:"flex-end",gap:8}}><span style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:30,color:s.color,lineHeight:1}}>{s.value}</span>{s.change&&<span style={{fontFamily:"'Cordia New',monospace",fontSize:8,textTransform:"uppercase",color:s.pulse?s.color:"#484f58",fontWeight:s.pulse?700:400,marginBottom:3}}>{s.change}</span>}</div></div>))}
    </div>
    {/* Cost tracking section */}
    {history.filter(h=>h.cost).length > 0 && (() => {
      const auditsWithCost = history.filter(h=>h.cost);
      const monthAudits = auditsWithCost.filter(h=>{const d=new Date(h.created_at);const n=new Date();return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear();});
      const totalMonth = monthAudits.reduce((a,b)=>a+(b.cost||0),0);
      const totalAll = auditsWithCost.reduce((a,b)=>a+(b.cost||0),0);
      const avgCost = auditsWithCost.length ? totalAll/auditsWithCost.length : 0;
      const projected = totalMonth > 0 ? (totalMonth / new Date().getDate()) * 30 : 0;
      return (<div style={{background:"#171c22",borderRadius:4,padding:"20px 24px",marginBottom:16}}>
        <div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:12,textTransform:"uppercase",marginBottom:16,color:"#dfe2ec"}}>Seguimiento de Costos API</div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
          {[
            {label:"Gasto este mes",value:`$${totalMonth.toFixed(3)}`,color:"#FF4500"},
            {label:"Auditorías con datos",value:auditsWithCost.length,color:"#dfe2ec"},
            {label:"Costo promedio",value:`$${avgCost.toFixed(4)}`,color:"#d29922"},
            {label:"Proyección mensual",value:`$${projected.toFixed(3)}`,color:"#a2c9ff"},
          ].map((s,i)=>(<div key={i} style={{background:"#0f141a",borderRadius:4,padding:"12px 16px"}}><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:6}}>{s.label}</div><div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:20,color:s.color}}>{s.value}</div></div>))}
        </div>
      </div>);
    })()}

    {clients.length===0?(<div style={{background:"#171c22",border:"1px dashed #31353c",borderRadius:8,padding:"56px 24px",textAlign:"center"}}><div style={{fontSize:36,marginBottom:14}}>🔥</div><div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:16,color:"#fff",textTransform:"uppercase",marginBottom:6}}>{t("emptyTitle")}</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:12,color:"#484f58",lineHeight:1.7,marginBottom:24,maxWidth:360,margin:"0 auto 24px"}}>{t("emptyDesc")}</div><button onClick={onNewAudit} style={{background:"#FF4500",border:"none",color:"#fff",padding:"12px 28px",cursor:"pointer",fontFamily:"'Supply',monospace",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.2em"}}>{t("startAudit")}</button></div>)
    :(<div style={{display:"flex",flexDirection:"column",gap:16}}>
      {chartClients.length>0&&(<div style={{background:"#171c22",padding:24,borderRadius:4}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}><div><div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:14,textTransform:"uppercase"}}>{t("frictionChart")}</div></div><div style={{display:"flex",gap:12}}>{[["#E24B4A","High"],["#d29922","Med"],["#3fb950","Low"]].map(([c,l])=>(<div key={l} style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:7,height:7,borderRadius:"50%",background:c,display:"inline-block"}}/><span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase"}}>{l}</span></div>))}</div></div>
        <div style={{position:"relative",height:160}}><canvas id="dashChart"/></div>
      </div>)}
      <div style={{background:"#171c22",borderRadius:4,overflow:"hidden"}}>
        <div style={{padding:"16px 24px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.05)"}}><div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:16,textTransform:"uppercase"}}>{t("allClients")}</div><button onClick={onNewAudit} style={{background:"#FF4500",border:"none",color:"#fff",padding:"7px 16px",cursor:"pointer",fontFamily:"'Supply',monospace",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.15em"}}>+ {t("newAudit").replace("+ ","")}</button></div>
        <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'Cordia New',monospace"}}>
          <thead><tr style={{background:"#0f141a"}}>{[t("client"),t("sector"),t("score"),t("audits"),t("lastAudit"),t("operations")].map((h,i)=>(<th key={h} style={{padding:"10px 18px",textAlign:i>=2?"center":"left",fontFamily:"'Cordia New',monospace",fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.15em",color:"#484f58"}}>{h}</th>))}</tr></thead>
          <tbody>{clients.map(client=>{
            const clientAudits = history.filter(h=>h.client_id===client.id);
            const prev = clientAudits.find((a,i)=>i>0&&a.score);
            return (<tr key={client.id} style={{borderBottom:"1px solid rgba(255,255,255,0.03)",cursor:"pointer"}} onMouseOver={e=>e.currentTarget.style.background="#31353c20"} onMouseOut={e=>e.currentTarget.style.background=""}>
              <td style={{padding:"16px 18px"}}><div style={{fontWeight:700,fontSize:13,color:"#dfe2ec",marginBottom:2}}>{client.name}</div><div style={{fontSize:9,color:"#484f58",textTransform:"uppercase"}}>{client.url?.replace("https://","")}</div></td>
              <td style={{padding:"16px 18px"}}><span style={{background:"#31353c",padding:"3px 8px",fontSize:9,color:"#484f58",textTransform:"uppercase"}}>{client.sector||"—"}</span></td>
              <td style={{padding:"16px 18px",textAlign:"center"}}><div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4}}>{client.last_score?<ScoreBadge score={client.last_score}/>:<span style={{color:"#31353c",fontSize:10}}>{t("noScore")}</span>}{client.last_score&&prev?.score&&<TrendBadge current={client.last_score} previous={prev.score}/>}</div></td>
              <td style={{padding:"16px 18px",textAlign:"center",fontWeight:700,fontSize:13,color:"#dfe2ec"}}>{String(clientAudits.length).padStart(2,"0")}</td>
              <td style={{padding:"16px 18px",textAlign:"center",fontSize:10,color:"#484f58",textTransform:"uppercase"}}>{client.last_audit||"—"}</td>
              <td style={{padding:"16px 18px",textAlign:"right"}}><div style={{display:"flex",gap:16,justifyContent:"flex-end"}}><button onClick={()=>onViewClient(client)} style={{background:"none",border:"none",color:"#484f58",cursor:"pointer",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'Cordia New',monospace",fontWeight:700}} onMouseOver={e=>e.currentTarget.style.color="#FF4500"} onMouseOut={e=>e.currentTarget.style.color="#484f58"}>{t("viewBtn")}</button><button onClick={()=>onSelectClient(client)} style={{background:"none",border:"none",color:"#484f58",cursor:"pointer",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'Cordia New',monospace",fontWeight:700}} onMouseOver={e=>e.currentTarget.style.color="#FF4500"} onMouseOut={e=>e.currentTarget.style.color="#484f58"}>+</button></div></td>
            </tr>);
          })}</tbody>
        </table></div>
        <div style={{padding:"10px 24px",background:"#0f141a",borderTop:"1px solid rgba(255,255,255,0.03)"}}><span style={{fontFamily:"'Cordia New',monospace",fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.15em",color:"#484f58"}}>{t("showingOf")} {clients.length} {t("registered")}</span></div>
      </div>
    </div>)}
  </div>);
}

// ─── Modals ────────────────────────────────────────────────────────
function SaveClientModal({ onSave, onSkip, defaultName="", defaultUrl="", defaultSector="" }) {
  const { t } = useLang();
  const [name,setName] = useState(defaultName); const [url,setUrl] = useState(defaultUrl);
  const [sector,setSector] = useState(defaultSector);
  return (<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div style={{background:"#0f141a",border:"1px solid rgba(255,255,255,0.05)",borderRadius:8,padding:32,maxWidth:400,width:"100%"}}>
      <div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:18,color:"#fff",textTransform:"uppercase",marginBottom:4}}>{t("saveClient")}</div>
      <div style={{fontFamily:"'Cordia New',monospace",fontSize:11,color:"#484f58",marginBottom:24}}>{t("saveClientDesc")}</div>
      {[{label:t("nameLabel"),value:name,set:setName,placeholder:"Ej: Paseo Interlomas"},{label:t("urlLabel"),value:url,set:setUrl,placeholder:"Ej: https://paseointerlomas.mx"}].map(f=>(<div key={f.label} style={{marginBottom:18}}><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,textTransform:"uppercase",letterSpacing:"0.2em",color:"#484f58",marginBottom:7}}>{f.label}</div><input value={f.value} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder} style={{width:"100%",background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.1)",padding:"8px 0",color:"#fff",fontFamily:"'Cordia New',monospace",fontSize:12,outline:"none",boxSizing:"border-box"}}/></div>))}
      <div style={{marginBottom:22}}>
        <div style={{fontFamily:"'Cordia New',monospace",fontSize:9,textTransform:"uppercase",letterSpacing:"0.2em",color:"#484f58",marginBottom:7}}>{t("sectorLabel")} {defaultSector&&<span style={{color:"#3fb950",fontSize:8}}>✓ AUTO-DETECTED</span>}</div>
        <input value={sector} onChange={e=>setSector(e.target.value)} placeholder={t("sectorPlaceholder")} style={{width:"100%",background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.1)",padding:"8px 0",color:"#fff",fontFamily:"'Cordia New',monospace",fontSize:12,outline:"none",boxSizing:"border-box"}}/>
        <div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",marginTop:4}}>Ej: Restaurante de mariscos, Clínica dental, Agencia digital...</div>
      </div>
      <div style={{display:"flex",gap:10}}><button onClick={onSkip} style={{flex:1,background:"transparent",border:"1px solid #31353c",color:"#484f58",padding:"10px",cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:11,textTransform:"uppercase"}}>{t("skipBtn")}</button><button onClick={()=>name.trim()&&onSave({name:name.trim(),url:url.trim(),sector:sector.trim()})} style={{flex:1,background:"#FF4500",border:"none",color:"#fff",padding:"10px",cursor:"pointer",fontFamily:"'Supply',monospace",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>{t("saveBtn")}</button></div>
    </div>
  </div>);
}

function ReauditModal({ client, auditCount, onCompare, onFresh, onCancel }) {
  const { t } = useLang();
  return (<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div style={{background:"#0f141a",border:"1px solid rgba(255,255,255,0.05)",borderRadius:8,padding:32,maxWidth:400,width:"100%"}}>
      <div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:18,color:"#fff",textTransform:"uppercase",marginBottom:4}}>{t("reauditTitle")}: {client.name}</div>
      <div style={{fontFamily:"'Cordia New',monospace",fontSize:11,color:"#484f58",marginBottom:24}}>{auditCount} {auditCount===1?t("prevLabel"):t("prevLabelPlural")} · {client.last_audit||"—"}</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <button onClick={onCompare} style={{background:"rgba(162,201,255,0.05)",border:"1px solid rgba(162,201,255,0.2)",color:"#a2c9ff",padding:14,cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:11,fontWeight:700,textAlign:"left"}}>{t("compareBtn")}<div style={{fontSize:10,color:"#484f58",marginTop:4,fontWeight:400}}>{t("compareDesc")}</div></button>
        <button onClick={onFresh} style={{background:"rgba(255,69,0,0.05)",border:"1px solid rgba(255,69,0,0.2)",color:"#FF4500",padding:14,cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:11,fontWeight:700,textAlign:"left"}}>{t("freshBtn")}<div style={{fontSize:10,color:"#484f58",marginTop:4,fontWeight:400}}>{t("freshDesc")}</div></button>
        <button onClick={onCancel} style={{background:"transparent",border:"1px solid #31353c",color:"#484f58",padding:10,cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:11,textTransform:"uppercase"}}>{t("cancelBtn")}</button>
      </div>
    </div>
  </div>);
}

// ─── History ───────────────────────────────────────────────────────
function HistoryView({ history, clients, onLoad, onDelete }) {
  const { t } = useLang();
  const [search,setSearch] = useState(""); const [filter,setFilter] = useState("todos");
  const getClientName = id => clients.find(c=>c.id===id)?.name||null;
  const filtered = history.filter(e=>{
    const name = getClientName(e.client_id)||"";
    const ms = !search||e.query.toLowerCase().includes(search.toLowerCase())||name.toLowerCase().includes(search.toLowerCase());
    const mf = filter==="todos"||(filter==="cliente"&&e.client_id)||(filter==="critico"&&e.score&&e.score<=4)||(filter==="mes"&&(()=>{const d=new Date(e.created_at);const n=new Date();return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear();})());
    return ms&&mf;
  });
  return (<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:32}}>
      <div><div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:32,color:"#fff",textTransform:"uppercase",marginBottom:4}}>{t("historyTitle")}</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:12,color:"#484f58"}}>{history.length} {t("historyAudits")}</div></div>
      <div style={{position:"relative"}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#484f58",fontSize:12}}>🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("searchPlaceholder")} style={{background:"#171c22",border:"none",borderBottom:"2px solid rgba(255,255,255,0.1)",padding:"9px 9px 9px 32px",color:"#fff",fontFamily:"'Cordia New',monospace",fontSize:11,outline:"none",width:240}}/></div>
    </div>
    <div style={{display:"flex",gap:8,marginBottom:28,flexWrap:"wrap"}}>{[["todos",t("filterAll")],["mes",t("filterMonth")],["cliente",t("filterClient")],["critico",t("filterCritical")]].map(([val,lbl])=>(<button key={val} onClick={()=>setFilter(val)} style={{padding:"5px 16px",borderRadius:20,border:`1px solid ${filter===val?"#FF4500":"rgba(255,255,255,0.1)"}`,background:filter===val?"rgba(255,69,0,0.05)":"transparent",color:filter===val?"#FF4500":"#484f58",fontFamily:"'Cordia New',monospace",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",cursor:"pointer"}}>{lbl}</button>))}</div>
    {filtered.length===0?(<div style={{textAlign:"center",padding:"48px 0",color:"#484f58"}}><div style={{fontSize:36,marginBottom:12}}>📭</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:11,textTransform:"uppercase"}}>{search?t("emptySearch"):t("emptyHistory")}</div></div>)
    :(<div style={{display:"flex",flexDirection:"column",gap:10}}>{filtered.map(entry=>(<div key={entry.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 2fr 80px auto",alignItems:"center",gap:16,background:"#171c22",padding:"16px 20px",borderRadius:4,border:"1px solid rgba(255,255,255,0.03)"}}>
      <div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{t("executionDate")}</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:11}}>{new Date(entry.created_at).toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"})}</div></div>
      <div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>Client</div>{getClientName(entry.client_id)?<span style={{background:"#31353c",padding:"2px 8px",fontFamily:"'Cordia New',monospace",fontSize:10,color:"#FF4500",fontWeight:700,textTransform:"uppercase"}}>{getClientName(entry.client_id)}</span>:<span style={{color:"#484f58",fontSize:10}}>—</span>}</div>
      <div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{t("performance")}</div>{entry.score?<ScoreBadge score={entry.score}/>:<span style={{color:"#484f58",fontSize:10}}>—</span>}</div>
      <div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{t("queryContext")}</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:11,color:"rgba(255,255,255,0.5)",fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>"{entry.query}"</div></div>
      <div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>Costo</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:11,color:entry.cost?"#3fb950":"#484f58",fontWeight:entry.cost?700:400}}>{entry.cost?`$${entry.cost.toFixed(4)}`:"—"}</div></div>
      <div style={{display:"flex",gap:12,alignItems:"center"}}><button onClick={()=>onLoad(entry)} style={{background:"none",border:"none",color:"#FF4500",fontFamily:"'Cordia New',monospace",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",cursor:"pointer"}}>{t("viewBtn")}</button><button onClick={()=>onDelete(entry.id)} style={{background:"none",border:"none",color:"#484f58",cursor:"pointer",fontSize:13}} onMouseOver={e=>e.currentTarget.style.color="#E24B4A"} onMouseOut={e=>e.currentTarget.style.color="#484f58"}>🗑</button></div>
    </div>))}</div>)}
  </div>);
}

// ─── Starter card ──────────────────────────────────────────────────
function StarterCard({ icon, label, fields, onSubmit }) {
  const { t } = useLang();
  const [expanded,setExpanded] = useState(false);
  const [values,setValues] = useState(fields.reduce((a,f)=>({...a,[f.key]:""}),{}));
  if (!expanded) return (<button onClick={()=>setExpanded(true)} style={{background:"#171c22",border:"1px solid transparent",borderRadius:10,padding:16,cursor:"pointer",textAlign:"left",width:"100%",transition:"all .2s"}} onMouseOver={e=>{e.currentTarget.style.borderColor="rgba(255,69,0,0.2)";e.currentTarget.style.background="#1a1f26";}} onMouseOut={e=>{e.currentTarget.style.borderColor="transparent";e.currentTarget.style.background="#171c22";}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div style={{background:"rgba(255,69,0,0.1)",padding:"8px",borderRadius:8,fontSize:15}}>{icon}</div><span style={{color:"#484f58",fontSize:13,opacity:0.3}}>→</span></div><div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:"0.05em",color:"#dfe2ec",marginBottom:3}}>{label}</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:10,color:"#484f58"}}>{t("configureClick")}</div></button>);
  return (<div style={{background:"#171c22",border:"1px solid rgba(255,69,0,0.2)",borderRadius:10,padding:16}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}><span style={{fontSize:14}}>{icon}</span><span style={{fontFamily:"'Cordia New',monospace",fontSize:10,color:"#FF4500",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>{label}</span><button onClick={()=>setExpanded(false)} style={{marginLeft:"auto",background:"transparent",border:"none",color:"#484f58",cursor:"pointer",fontSize:16}}>×</button></div>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      {fields.map(f=>(<div key={f.key}><div style={{fontFamily:"'Cordia New',monospace",fontSize:8,color:"#484f58",marginBottom:4,textTransform:"uppercase",letterSpacing:"0.15em"}}>{f.label}</div>{f.multiline?(<textarea value={values[f.key]} onChange={e=>setValues(v=>({...v,[f.key]:e.target.value}))} placeholder={f.placeholder} rows={2} style={{width:"100%",background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.1)",padding:"6px 0",color:"#dfe2ec",fontFamily:"'Cordia New',monospace",fontSize:11,outline:"none",resize:"none",boxSizing:"border-box"}}/>):(<input value={values[f.key]} onChange={e=>setValues(v=>({...v,[f.key]:e.target.value}))} placeholder={f.placeholder} onKeyDown={e=>e.key==="Enter"&&!f.multiline&&onSubmit(values)} style={{width:"100%",background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.1)",padding:"6px 0",color:"#dfe2ec",fontFamily:"'Cordia New',monospace",fontSize:11,outline:"none",boxSizing:"border-box"}}/>)}</div>))}
      <button onClick={()=>onSubmit(values)} style={{background:"#FF4500",border:"none",color:"#fff",padding:"8px",cursor:"pointer",fontFamily:"'Supply',monospace",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:4,borderRadius:6}}>{t("auditSubmit")}</button>
    </div>
  </div>);
}

// ─── Module Toggles ────────────────────────────────────────────────
function ModuleToggles({ modules, setModules, selectedModel, setSelectedModel }) {
  const { t } = useLang();
  const [open,setOpen] = useState(false);
  const items = [
    { key:"pagespeed", label:t("modulePagespeed"), desc:t("modulePagespeedDesc"), cost:"+$0.00" },
    { key:"sentiment", label:t("moduleSentiment"), desc:t("moduleSentimentDesc"), cost:"+$0.03" },
  ];
  const active = Object.values(modules).filter(Boolean).length;
  return (<div style={{marginBottom:16}}>
    <button onClick={()=>setOpen(o=>!o)} style={{background:"transparent",border:"1px solid #31353c",color:active>0?"#FF4500":"#484f58",padding:"6px 12px",borderRadius:6,cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em",display:"flex",alignItems:"center",gap:6}}>
      ⚙ {t("modules")} · <span style={{color:selectedModel==="claude-haiku-4-5-20251001"?"#3fb950":"#FF4500",fontWeight:700}}>{selectedModel==="claude-haiku-4-5-20251001"?"Haiku":"Sonnet"}</span>{active>0&&<span style={{background:"#FF4500",color:"#fff",borderRadius:10,padding:"1px 6px",fontSize:9,fontWeight:700,marginLeft:4}}>{active}</span>}
    </button>
    {open&&(<div style={{marginTop:8,background:"#0f141a",border:"1px solid #21262d",borderRadius:8,overflow:"hidden"}}>
      <div style={{padding:"10px 16px",borderBottom:"1px solid #161b22"}}>
        <div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.15em",marginBottom:8}}>Modelo</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {[
            {id:"claude-sonnet-4-6",label:"Sonnet 4.6",desc:"Máxima calidad",cost:"$0.05/audit",color:"#FF4500"},
            {id:"claude-haiku-4-5-20251001",label:"Haiku 4.5",desc:"Rápido y económico",cost:"$0.01/audit",color:"#3fb950"},
          ].map(m=>(<button key={m.id} onClick={()=>setSelectedModel(m.id)} style={{display:"flex",flexDirection:"column",alignItems:"flex-start",gap:2,padding:"8px 12px",border:`1px solid ${selectedModel===m.id?m.color:"#31353c"}`,borderRadius:6,background:selectedModel===m.id?`${m.color}15`:"transparent",cursor:"pointer",transition:"all .15s"}}>
            <span style={{fontFamily:"'Cordia New',monospace",fontSize:11,fontWeight:700,color:selectedModel===m.id?m.color:"#dfe2ec"}}>{m.label}</span>
            <span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58"}}>{m.desc} · <span style={{color:selectedModel===m.id?m.color:"#484f58"}}>{m.cost}</span></span>
          </button>))}
        </div>
      </div>
      {items.map(item=>(<div key={item.key} onClick={()=>setModules(m=>({...m,[item.key]:!m[item.key]}))} style={{display:"flex",alignItems:"center",gap:12,padding:"12px 16px",borderBottom:"1px solid #161b22",cursor:"pointer"}} onMouseOver={e=>e.currentTarget.style.background="#171c22"} onMouseOut={e=>e.currentTarget.style.background=""}>
        <div style={{width:32,height:18,borderRadius:9,background:modules[item.key]?"#FF4500":"#31353c",position:"relative",flexShrink:0,transition:"background .2s"}}><div style={{width:14,height:14,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:modules[item.key]?16:2,transition:"left .2s"}}/></div>
        <div style={{flex:1}}><div style={{fontFamily:"'Cordia New',monospace",fontSize:11,fontWeight:700,color:"#dfe2ec"}}>{item.label}</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",marginTop:1}}>{item.desc}</div></div>
        <span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:modules[item.key]?"#3fb950":"#484f58",fontWeight:700}}>{item.cost}/audit</span>
      </div>))}
    </div>)}
  </div>);
}

// ─── App ───────────────────────────────────────────────────────────
function App() {
  const [lang,setLangState] = useState(()=>localStorage.getItem("ignitia_lang")||"es");
  const t = k => T[lang][k]||k;
  const setLang = l => { setLangState(l); localStorage.setItem("ignitia_lang",l); };

  const [session,setSession] = useState(null); const [authLoading,setAuthLoading] = useState(true);
  const [clients,setClients] = useState([]); const [history,setHistory] = useState([]);
  const [view,setView] = useState("dashboard");
  const [messages,setMessages] = useState([]); const [loading,setLoading] = useState(false);
  const [statusKey,setStatusKey] = useState(""); const [input,setInput] = useState("");
  const [saveModal,setSaveModal] = useState(null); const [reauditModal,setReauditModal] = useState(null);
  const [activeClient,setActiveClient] = useState(null); const [toast,setToast] = useState(null);
  const [clientMode,setClientMode] = useState(false);
  const [modules,setModules] = useState({ pagespeed:false, sentiment:false });
  const [selectedModel,setSelectedModel] = useState(()=>localStorage.getItem('ignitia_model')||'claude-sonnet-4-6');
  const [addContextMode,setAddContextMode] = useState(false); const [addContextInput,setAddContextInput] = useState("");
  const bottomRef = useRef(null); const textareaRef = useRef(null);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{ setSession(session); setAuthLoading(false); });
    const {data:{subscription}} = supabase.auth.onAuthStateChange((_e,s)=>setSession(s));
    return ()=>subscription.unsubscribe();
  },[]);

  useEffect(()=>{
    if (!session) return;
    dbLoadClients(session.user.id).then(setClients);
    dbLoadHistory(session.user.id).then(setHistory);
  },[session]);

  useEffect(()=>{ bottomRef.current?.scrollIntoView({behavior:"smooth"}); },[messages,loading]);

  const getStatusText = key => {
    if (!key) return "";
    if (key==="connecting") return t("connecting");
    if (key==="analyzing") return t("analyzing");
    if (key==="pagespeed") return t("loadingPagespeed");
    if (key.startsWith("processing:")) return `${t("processing")} ${key.split(":")[1]})...`;
    return key;
  };

  const sendMessage = async (text, extraContext="") => {
    const userText = (text!==undefined?text:input).trim();
    if (!userText||loading) return;
    setInput(""); setAddContextMode(false); setAddContextInput("");
    const newMessages = [...messages, { role:"user", content:userText }];
    setMessages(newMessages); setLoading(true);

    let pagespeedData = null;
    if (modules.pagespeed) {
      const urlMatch = userText.match(/https?:\/\/[^\s]+/);
      if (urlMatch) {
        setStatusKey("pagespeed");
        pagespeedData = await fetchPageSpeed(urlMatch[0]).catch(()=>null);
      }
    }

    const systemPrompt = extraContext
      ? getMasterPrompt(lang, pagespeedData, modules) + "\n\n" + extraContext
      : getMasterPrompt(lang, pagespeedData, modules);

    try {
      const { text: result, tokens } = await runAuditLoop(newMessages.map(m=>({role:m.role,content:m.content})), setStatusKey, systemPrompt, selectedModel);
      setMessages(prev=>[...prev, { role:"assistant", content:result }]);
      const score = extractScore(result);
      const sector = extractSector(result);
      const quickWins = extractQuickWins(result);
      const clientId = activeClient?.id||null;

      const saved = await dbSaveAudit({ query:userText, result, score:score||null, client_id:clientId, input_tokens:tokens?.input||null, output_tokens:tokens?.output||null, cost:tokens?.cost||null, model:selectedModel }, session.user.id);
      const [freshClients, freshHistory] = await Promise.all([dbLoadClients(session.user.id), dbLoadHistory(session.user.id)]);
      setClients(freshClients); setHistory(freshHistory);

      if (saved && quickWins.length) await dbSaveQuickWins(quickWins, saved.id, clientId, session.user.id);

      if (clientId && score) {
        await dbUpdateClient(clientId, { last_score:score, last_audit:new Date().toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"}) }, session.user.id);
        const newClients = await dbLoadClients(session.user.id); setClients(newClients);
      }
      if (!activeClient) setSaveModal({ query:userText, result, detectedSector:sector });
    } catch(e) {
      setMessages(prev=>[...prev, { role:"assistant", content:`## ❌ ${t("errorTitle")}\n\n**${e.message}**\n\n- ${t("errorConn")}\n- ${t("errorUrl")}` }]);
    }
    setLoading(false); setStatusKey("");
  };

  const handleSaveClient = async ({ name, url, sector }) => {
    const lastAudit = history[0];
    const scoreFromAudit = lastAudit?.score || null;
    const dateFromAudit = scoreFromAudit ? new Date().toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"}) : null;
    const saved = await dbSaveClient({ name, url, sector, last_score:scoreFromAudit, last_audit:dateFromAudit }, session.user.id);
    if (saved) {
      if (lastAudit && !lastAudit.client_id) {
        await supabase.from("audits").update({ client_id:saved.id }).eq("id",lastAudit.id);
      }
      const [newClients, newHistory] = await Promise.all([
        dbLoadClients(session.user.id),
        dbLoadHistory(session.user.id)
      ]);
      setClients(newClients);
      setHistory(newHistory);
      setActiveClient(saved); setSaveModal(null);
      setToast(`${name} ${t("toastSaved")}`);
    }
  };

  const handleSelectClient = async (client) => {
    setActiveClient(client);
    const fresh = await dbLoadHistory(session.user.id);
    setHistory(fresh);
    const clientAudits = fresh.filter(h=>h.client_id===client.id);
    if (clientAudits.length>0) { setReauditModal(client); setView("chat"); }
    else { setMessages([]); setInput(`${t("starterAudit")} ${client.name}${client.url?" - "+client.url:""}`); setView("chat"); setTimeout(()=>textareaRef.current?.focus(),100); }
  };

  const handleCompare = async () => {
    const clientAudits = history.filter(h=>h.client_id===reauditModal.id);
    const last = clientAudits[0];
    const pendingWins = await dbLoadPendingQuickWins(reauditModal.id);
    setReauditModal(null); setMessages([]);
    const pendingContext = pendingWins.length ? `\n\n${lang==="en"?"PENDING QUICK WINS NOT YET IMPLEMENTED:":"QUICK WINS PENDIENTES AÚN NO IMPLEMENTADOS:"}\n${pendingWins.map((w,i)=>`${i+1}. ${w.action}`).join("\n")}` : "";
    const context = `${lang==="en"?"PREVIOUS AUDIT CONTEXT":"CONTEXTO DE AUDITORÍA ANTERIOR"} (${new Date(last.created_at).toLocaleDateString()}):\n${last.result.slice(0,1500)}${pendingContext}\n\n${lang==="en"?"SPECIAL INSTRUCTION: Compare with previous. Show what improved, what got worse, what remains the same. If there are pending quick wins, evaluate if they are still relevant.":"INSTRUCCIÓN ESPECIAL: Compara con la auditoría anterior. Indica qué mejoró, qué empeoró y qué sigue igual. Si hay quick wins pendientes, evalúa si siguen siendo relevantes."}`;
    setTimeout(()=>sendMessage(`${t("starterAudit")} ${reauditModal.name}${reauditModal.url?" - "+reauditModal.url:""}`,context),100);
  };

  const handleFresh = () => {
    setReauditModal(null); setMessages([]);
    setInput(`${t("starterAudit")} ${reauditModal.name}${reauditModal.url?" - "+reauditModal.url:""}`);
    setTimeout(()=>textareaRef.current?.focus(),100);
  };

  const STARTER_CONFIGS = [
    { icon:"🔍", label:t("auditBusiness"), fields:[{key:"nombre",label:t("businessName"),placeholder:t("businessNamePlaceholder")},{key:"url",label:t("businessUrl"),placeholder:t("businessUrlPlaceholder")},{key:"contexto",label:t("contextLabel"),placeholder:t("contextPlaceholder"),multiline:true}], build:v=>`${t("starterAudit")} ${v.nombre} - ${v.url}${v.contexto?`\n\nContexto: ${v.contexto}`:""}` },
    { icon:"🎯", label:t("realKeywords"), fields:[{key:"negocio",label:t("businessCity"),placeholder:t("businessCityPlaceholder")},{key:"contexto",label:t("contextLabel"),placeholder:t("contextPlaceholder"),multiline:true}], build:v=>`${t("starterKeywords")} ${v.negocio}${v.contexto?"\n\nContexto: "+v.contexto:""}` },
    { icon:"🚀", label:t("quickWins"), fields:[{key:"url",label:t("siteUrl"),placeholder:t("siteUrlPlaceholder")},{key:"contexto",label:t("contextLabel"),placeholder:t("contextPlaceholder"),multiline:true}], build:v=>`${t("starterWins")} ${v.url}${v.contexto?"\n\nContexto: "+v.contexto:""}` },
  ];

  const globalStyles = `
    @font-face{font-family:'Supply';src:url('https://fonts.cdnfonts.com/s/77402/Supply-Regular.woff') format('woff');}
    @font-face{font-family:'Cordia New';src:url('https://fonts.cdnfonts.com/s/15444/CordiaNew.woff') format('woff');}
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#060a10;color:#dfe2ec;font-family:'Cordia New',monospace}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#171c22}::-webkit-scrollbar-thumb{background:#31353c}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes blink{50%{opacity:0}}
    textarea::placeholder{color:#484f58}input::placeholder{color:#484f58}
    select option{background:#171c22}
  `;

  if (authLoading) return (<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#060a10"}}><style>{globalStyles}</style><div style={{fontFamily:"'Cordia New',monospace",fontSize:11,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.2em"}}>{t("loading")}</div></div>);

  return (<LangContext.Provider value={{lang,t,setLang}}>
    <style>{globalStyles}</style>
    
    {!session ? <LoginScreen/> : (
      <div style={{minHeight:"100vh",background:"#060a10"}}>
        <TopBar setView={setView}/>
        <Sidebar currentView={view} setView={v=>{setView(v);if(v==="chat"){setMessages([]);setActiveClient(null);}}} session={session} onLogout={()=>supabase.auth.signOut()}/>
        <main style={{marginLeft:240,paddingTop:64,minHeight:"100vh",width:"calc(100% - 240px)"}}>
          <div style={{padding:"36px 36px 0",width:"100%",maxWidth:1100,boxSizing:"border-box",margin:"0 auto"}}>
            {view==="dashboard"&&<DashboardView clients={clients} history={history} onNewAudit={()=>{setMessages([]);setActiveClient(null);setView("chat");}} onSelectClient={handleSelectClient} onViewClient={async(client)=>{const fresh=await dbLoadHistory(session.user.id);setHistory(fresh);const lastAudit=fresh.find(h=>h.client_id===client.id);if(lastAudit){setMessages([{role:"user",content:lastAudit.query},{role:"assistant",content:lastAudit.result}]);setActiveClient(client);setView("chat");}else{setMessages([]);setActiveClient(client);setInput(`${t("starterAudit")} ${client.name}${client.url?" - "+client.url:""}`);setView("chat");}}}/>}
            {view==="history"&&<HistoryView history={history} clients={clients} onLoad={e=>{setMessages([{role:"user",content:e.query},{role:"assistant",content:e.result}]);setActiveClient(null);setView("chat");}} onDelete={async(id)=>{if(!window.confirm("¿Borrar esta auditoría?"))return;await dbDeleteAudit(id);const newHistory=await dbLoadHistory(session.user.id);setHistory(newHistory);}}/>}
            {view==="chat"&&(<div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 100px)"}}>
              {saveModal&&<SaveClientModal defaultName={saveModal.query.replace(/.*?:\s*/,"").split(" - ")[0]||""} defaultUrl={saveModal.query.includes("http")?saveModal.query.match(/https?:\/\/[^\s]+/)?.[0]||"":""} defaultSector={saveModal.detectedSector||""} onSave={handleSaveClient} onSkip={()=>setSaveModal(null)}/>}
              {reauditModal&&<ReauditModal client={reauditModal} auditCount={history.filter(h=>h.client_id===reauditModal.id).length} onCompare={handleCompare} onFresh={handleFresh} onCancel={()=>{setReauditModal(null);setActiveClient(null);}}/>}
              {activeClient&&(<div style={{padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",marginBottom:12,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                <span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.2em"}}>Active_Audit:</span>
                <span style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:13,color:"#FF4500",textTransform:"uppercase"}}>{activeClient.name}</span>
                {activeClient.url&&<span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58"}}>{activeClient.url.replace("https://","")}</span>}
                <div style={{marginLeft:"auto",display:"flex",gap:8}}>
                  <button onClick={()=>setClientMode(m=>!m)} style={{background:clientMode?"#FF450022":"transparent",border:`1px solid ${clientMode?"#FF4500":"#31353c"}`,color:clientMode?"#FF4500":"#484f58",padding:"3px 10px",borderRadius:4,cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:9,textTransform:"uppercase"}}>{clientMode?t("clientModeOn"):t("clientModeOff")}</button>
                  <button onClick={()=>{setActiveClient(null);setMessages([]);}} style={{background:"transparent",border:"1px solid rgba(255,69,0,0.3)",color:"#FF4500",padding:"3px 10px",borderRadius:4,cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:9,textTransform:"uppercase"}}>{t("cleanBtn")}</button>
                </div>
              </div>)}
              <div style={{flex:1,overflowY:"auto",paddingBottom:130}}>
                {messages.length===0&&!loading&&(<div style={{paddingTop:28}}>
                  <div style={{marginBottom:24}}>
                    <div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:26,color:"#fff",textTransform:"uppercase",letterSpacing:"-0.01em",marginBottom:4}}>{activeClient?`Active_Audit: ${activeClient.name}`:"Ignitia SEO Console"}</div>
                    <div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.2em",marginBottom:16}}>{activeClient?`Status: Online // ${activeClient.sector||""}`:""}</div>
                    <ModuleToggles modules={modules} setModules={setModules} selectedModel={selectedModel} setSelectedModel={m=>{setSelectedModel(m);localStorage.setItem("ignitia_model",m);}}/>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:12}}>{STARTER_CONFIGS.map(s=><StarterCard key={s.label} icon={s.icon} label={s.label} fields={s.fields} onSubmit={values=>sendMessage(s.build(values))}/>)}</div>
                </div>)}
                <div style={{display:"flex",flexDirection:"column",gap:20}}>
                  {messages.map((msg,i)=>{
                    const isAssistant = msg.role==="assistant";
                    const score = isAssistant ? extractScore(msg.content) : null;
                    const radar = isAssistant ? extractRadar(msg.content) : null;
                    const wins = isAssistant ? extractQuickWins(msg.content) : [];
                    const auditEntry = isAssistant ? history.find(h=>h.query===messages[i-1]?.content) : null;
                    const sections = isAssistant ? parseMarkdownSections(msg.content) : [];
                    const filteredSections = clientMode ? sections.filter(s=>!s.title||(s.title&&!s.title.includes("NOTAS")&&!s.title.includes("INTERNAL")&&!s.title.includes("🛠")&&!s.title.includes("DICCI")&&!s.title.includes("GLOSS")&&!s.title.includes("📚"))) : sections;
                    return (<div key={i}>
                      {msg.role==="user"?(<div style={{display:"flex",justifyContent:"flex-end",gap:10}}>
                        <div style={{maxWidth:"60%",textAlign:"right"}}><div style={{background:"#31353c",padding:"10px 14px",borderRadius:"10px 10px 0 10px"}}><div style={{fontFamily:"'Cordia New',monospace",fontSize:12,lineHeight:1.65,color:"#dfe2ec",whiteSpace:"pre-wrap"}}>{msg.content}</div></div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginTop:4}}>{t("youLabel")}</div></div>
                        <div style={{width:28,height:28,borderRadius:"50%",border:"1px solid rgba(255,69,0,0.2)",background:"#171c22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12}}>👤</div>
                      </div>):(
                        <div style={{display:"flex",gap:10}}>
                          <div style={{width:28,height:28,borderRadius:"50%",background:"#FF4500",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12}}>🔥</div>
                          <div style={{flex:1,minWidth:0}}>
                            <div style={{marginBottom:10,display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}><span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#FF4500",textTransform:"uppercase",letterSpacing:"0.15em",fontWeight:700}}>Ignitia AI // {t("reportLabel")}</span>{score&&<ScoreBadge score={score}/>}<span style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:8}}>{auditEntry?.cost&&<span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#3fb950"}}>💸 ${auditEntry.cost.toFixed(4)}</span>}{auditEntry?.model&&<span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58"}}>{auditEntry.model.includes('haiku')?'Haiku 4.5':'Sonnet 4.6'}</span>}<span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58"}}>{t("saved")}</span></span></div>
                            {score&&<ScoreHero score={score} lang={lang}/>}
                            <ReportIndex sections={filteredSections} lang={lang}/>
                            {radar&&<RadarChart data={radar} lang={lang}/>}
                            {wins.length>0&&<QuickWinsChecklist wins={wins} auditId={auditEntry?.id} userId={session.user.id}/>}
                            {filteredSections.map((section,si)=>{
                              const s = getStyle(section.title);
                              return (<div key={si} id={`section-${si}`} style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:8,padding:"16px 20px",marginBottom:10}}>
                                {section.title&&(<div style={{marginBottom:10}}><span style={{fontFamily:"'Cordia New',monospace",fontSize:8,fontWeight:700,letterSpacing:"0.2em",background:`${s.accent}20`,color:s.accent,padding:"2px 8px",textTransform:"uppercase"}}>{s.tag}</span><div style={{fontFamily:"'Supply',monospace",fontSize:13,fontWeight:700,color:s.accent,marginTop:7,textTransform:"uppercase",letterSpacing:"-0.01em"}}>{section.title}</div></div>)}
                                <div dangerouslySetInnerHTML={{__html:renderMd(section.content.join("\n"))}}/>
                              </div>);
                            })}
                            {i===messages.length-1&&isAssistant&&(
                              <div style={{marginTop:8}}>
                                {!addContextMode?(<button onClick={()=>setAddContextMode(true)} style={{background:"transparent",border:"1px solid #31353c",color:"#484f58",padding:"6px 12px",borderRadius:6,cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em"}}>{t("addContextBtn")}</button>)
                                :(<div style={{background:"#0f141a",border:"1px solid #21262d",borderRadius:8,padding:12}}>
                                  <textarea value={addContextInput} onChange={e=>setAddContextInput(e.target.value)} placeholder={t("addContextPlaceholder")} rows={2} style={{width:"100%",background:"transparent",border:"none",outline:"none",color:"#dfe2ec",fontFamily:"'Cordia New',monospace",fontSize:12,resize:"none",lineHeight:1.6}}/>
                                  <div style={{display:"flex",gap:8,marginTop:8,justifyContent:"flex-end"}}>
                                    <button onClick={()=>{setAddContextMode(false);setAddContextInput("");}} style={{background:"transparent",border:"1px solid #31353c",color:"#484f58",padding:"5px 12px",borderRadius:6,cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:10,textTransform:"uppercase"}}>✕</button>
                                    <button onClick={()=>addContextInput.trim()&&sendMessage(addContextInput)} style={{background:"#FF4500",border:"none",color:"#fff",padding:"5px 14px",borderRadius:6,cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:10,textTransform:"uppercase",fontWeight:700}}>{t("sendContext")}</button>
                                  </div>
                                </div>)}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>);
                  })}
                  {loading&&(<div style={{display:"flex",gap:10}}>
                    <div style={{width:28,height:28,borderRadius:"50%",background:"#FF4500",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>🔥</div>
                    <div style={{flex:1,background:"#171c22",border:"1px solid rgba(255,69,0,0.1)",borderRadius:8,padding:"16px 20px"}}><div style={{height:2,background:"linear-gradient(90deg,#FF4500,#ffb5a0,#FF4500)",backgroundSize:"200%",animation:"shimmer 2s linear infinite",marginBottom:12,borderRadius:2}}/><div style={{fontFamily:"'Cordia New',monospace",fontSize:11,color:"#FF4500",marginBottom:6}}>{getStatusText(statusKey)}</div><div style={{display:"flex",gap:12,flexWrap:"wrap"}}>{[t("tracking"),t("verifying"),t("keywords"),t("comparing")].map((txt,i)=>(<span key={i} style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#31353c",textTransform:"uppercase",letterSpacing:"0.1em",animation:`blink ${1+i*0.5}s step-end infinite`}}>{txt}...</span>))}</div></div>
                  </div>)}
                  <div ref={bottomRef}/>
                </div>
              </div>
              <div style={{position:"fixed",bottom:0,left:240,right:0,padding:"14px 36px 18px",background:"linear-gradient(to top, #060a10 60%, transparent)"}}>
                <div style={{maxWidth:1064,margin:"0 auto",background:"#171c22",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,boxShadow:"0 -4px 40px rgba(0,0,0,0.3)",padding:"8px 8px 8px 18px",display:"flex",alignItems:"center",gap:10}}>
                  <span style={{color:"#484f58",fontSize:13,flexShrink:0}}>{">"}_</span>
                  <textarea ref={textareaRef} rows={2} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}} placeholder={activeClient?`${t("clientPlaceholder")} ${activeClient.name}...`:t("inputPlaceholder")} style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#dfe2ec",fontFamily:"'Cordia New',monospace",fontSize:12,resize:"none",lineHeight:1.6,textTransform:"uppercase"}}/>
                  <button onClick={()=>sendMessage()} disabled={loading||!input.trim()} style={{background:loading?"#7a2200":"#FF4500",border:"none",color:"#fff",padding:"10px 20px",cursor:loading||!input.trim()?"not-allowed":"pointer",fontFamily:"'Supply',monospace",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.15em",borderRadius:8,opacity:!input.trim()?0.3:1,flexShrink:0,transition:"all .2s"}}>{loading?t("auditingBtn"):`${t("auditBtn")} ⚡`}</button>
                </div>
                <div style={{textAlign:"center",marginTop:5}}><span style={{fontFamily:"'Cordia New',monospace",fontSize:8,color:"#31353c",textTransform:"uppercase",letterSpacing:"0.3em"}}>Console Secure // Encrypted Connection Enabled</span></div>
              </div>
            </div>)}
          </div>
        </main>
        {toast&&<Toast message={toast} onClose={()=>setToast(null)}/>}
      </div>
    )}
  </LangContext.Provider>);
}

createRoot(document.getElementById("root")).render(<App/>);
