// Ignitia · SEO Auditor v9.1 — Updated prompt logic
import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { createRoot } from "react-dom/client";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const T = {
  es: {
    appTagline:"Data-driven. Results-focused.",login:"Autenticación del Sistema",loginSub:"Ingresa tus credenciales para acceder a la consola.",loginBtn:"Ejecutar Login →",loginLoading:"Verificando...",loginError:"Credenciales incorrectas.",loginRestricted:"¿Necesitas acceso? Solicitar autorización",emailLabel:"Identificador",passwordLabel:"Clave de Acceso",emailPlaceholder:"USUARIO@IGNITIA.IO",passwordPlaceholder:"••••••••",dashboard:"Vista General",newAudit:"+ Nueva Auditoría",startAudit:"+ Iniciar Auditoría",emptyTitle:"Haz tu primera auditoría",emptyDesc:"Ingresa el nombre y URL de un negocio para generar tu primer reporte de visibilidad digital",allClients:"Libro Mayor de Auditorías",registered:"entidades activas",client:"Cliente / Endpoint",sector:"Sector",score:"Score de Salud",audits:"Auditorías",lastAudit:"Última Sincronización",noScore:"Sin score",frictionChart:"Índice de Fricción por Cliente",critical:"Crítico (1-4)",regular:"Regular (5-7)",good:"Bueno (8-10)",activeClients:"Clientes Activos",monthAudits:"Auditorías este mes",avgScore:"Score Promedio",improved:"Mejoraron este mes",history:"Historial",historyTitle:"Historial de Auditorías",historyAudits:"auditorías",searchPlaceholder:"Filtrar por dominio o keyword...",filterAll:"Todos",filterMonth:"Este mes",filterClient:"Con cliente",filterCritical:"Críticos",emptyHistory:"No hay auditorías registradas",emptySearch:"Sin resultados para esa búsqueda",viewBtn:"Ver",back:"← Volver",saveClient:"¿Guardar como cliente?",saveClientDesc:"Aparecerá en tu dashboard con su score",nameLabel:"NOMBRE",urlLabel:"URL",sectorLabel:"SECTOR",saveBtn:"Guardar →",skipBtn:"No por ahora",reauditTitle:"Re-auditar",compareBtn:"📊 Comparar con auditoría anterior",compareDesc:"Claude analizará qué mejoró y qué sigue fallando",freshBtn:"🔍 Auditoría nueva desde cero",freshDesc:"Reporte completo sin comparar",cancelBtn:"Cancelar",chat:"Nueva Auditoría",logout:"Cerrar Sesión",cleanBtn:"✕ Limpiar",auditingLabel:"ANALIZANDO",connecting:"Conectando con el auditor...",processing:"Procesando búsqueda web (paso",analyzing:"Analizando resultados...",tracking:"Rastreando sitio",verifying:"Verificando NAP",keywords:"Analizando keywords",comparing:"Comparando competidores",reportLabel:"REPORTE COMPLETO",saved:"✓ Guardado",youLabel:"TÚ",auditBtn:"AUDITAR",auditingBtn:"AUDITANDO...",inputPlaceholder:"CONSULTAR SISTEMA O INICIAR NUEVA AUDITORÍA...",clientPlaceholder:"Auditar",configureClick:"Haz clic para configurar",auditBusiness:"Auditar Negocio",realKeywords:"Keywords Reales",quickWins:"Quick Wins",businessName:"NOMBRE DEL NEGOCIO",businessNamePlaceholder:"Ej: Paseo Interlomas",businessUrl:"URL",businessUrlPlaceholder:"Ej: https://paseointerlomas.mx",businessCity:"NEGOCIO Y CIUDAD",businessCityPlaceholder:"Ej: Dentista en Naucalpan, CDMX",siteUrl:"URL DEL SITIO",siteUrlPlaceholder:"Ej: https://tusitio.mx",auditSubmit:"Auditar →",starterAudit:"🔍 Audita mi negocio:",starterKeywords:"🎯 ¿Por qué palabras clave me encuentra la gente? Mi negocio:",starterWins:"🚀 Dame 5 cambios rápidos para mejorar mi visibilidad. Mi sitio:",previousAudits:"auditorías previas",toastSaved:"guardado en tu dashboard",loading:"Cargando...",errorTitle:"Error",errorApiKey:"Verifica tu conexión",errorUrl:"Verifica que la URL esté completa",prevAuditsLabel:"anterior",prevAuditsLabelPlural:"anteriores",overview:"Vista General",systemStatus:"Estado del Sistema: Operacional",version:"IGNITIA v9.1-STABLE",executionDate:"Fecha",performance:"Performance",queryContext:"Contexto de Consulta",operations:"Operaciones",showingOf:"Mostrando",activeEntities:"entidades activas",
  },
  en: {
    appTagline:"Data-driven. Results-focused.",login:"System Authentication",loginSub:"Enter credentials to access the console.",loginBtn:"Execute Login →",loginLoading:"Verifying...",loginError:"Incorrect credentials.",loginRestricted:"Need clearance? Request Access",emailLabel:"Identifier",passwordLabel:"Access_Key",emailPlaceholder:"USER@IGNITIA.IO",passwordPlaceholder:"••••••••",dashboard:"System Overview",newAudit:"+ New Audit",startAudit:"+ Start Audit",emptyTitle:"Run your first audit",emptyDesc:"Enter a business name and URL to generate your first digital visibility report",allClients:"Master Audit Ledger",registered:"active entities",client:"Client / Endpoint",sector:"Sector",score:"Health Score",audits:"Audits",lastAudit:"Last Sync",noScore:"No score",frictionChart:"Client Friction Index",critical:"Critical (1-4)",regular:"Regular (5-7)",good:"Good (8-10)",activeClients:"Active Clients",monthAudits:"Monthly Audits",avgScore:"Average Score",improved:"Improved this month",history:"History",historyTitle:"Audit History",historyAudits:"audits",searchPlaceholder:"Filter by domain or keyword...",filterAll:"All",filterMonth:"This month",filterClient:"With client",filterCritical:"Critical",emptyHistory:"No audits recorded yet",emptySearch:"No results for that search",viewBtn:"View",back:"← Back",saveClient:"Save as client?",saveClientDesc:"It will appear in your dashboard with its score",nameLabel:"NAME",urlLabel:"URL",sectorLabel:"SECTOR",saveBtn:"Save →",skipBtn:"Not now",reauditTitle:"Re-audit",compareBtn:"📊 Compare with previous audit",compareDesc:"Claude will analyze what improved and what still needs work",freshBtn:"🔍 Fresh audit from scratch",freshDesc:"Full report without comparing",cancelBtn:"Cancel",chat:"New Audit",logout:"Sign Out",cleanBtn:"✕ Clear",auditingLabel:"ANALYZING",connecting:"Connecting to auditor...",processing:"Processing web search (step",analyzing:"Analyzing results...",tracking:"Crawling site",verifying:"Verifying NAP",keywords:"Analyzing keywords",comparing:"Comparing competitors",reportLabel:"FULL REPORT",saved:"✓ Saved",youLabel:"YOU",auditBtn:"AUDIT",auditingBtn:"AUDITING...",inputPlaceholder:"QUERY SYSTEM OR START NEW AUDIT...",clientPlaceholder:"Audit",configureClick:"Click to configure",auditBusiness:"Audit Business",realKeywords:"Real Keywords",quickWins:"Quick Wins",businessName:"BUSINESS NAME",businessNamePlaceholder:"E.g: Paseo Interlomas",businessUrl:"URL",businessUrlPlaceholder:"E.g: https://paseointerlomas.mx",businessCity:"BUSINESS & CITY",businessCityPlaceholder:"E.g: Dentist in Miami, FL",siteUrl:"SITE URL",siteUrlPlaceholder:"E.g: https://yoursite.com",auditSubmit:"Audit →",starterAudit:"🔍 Audit my business:",starterKeywords:"🎯 What keywords do people use to find me? My business:",starterWins:"🚀 Give me 5 quick changes to improve my visibility. My site:",previousAudits:"previous audits",toastSaved:"saved to your dashboard",loading:"Loading...",errorTitle:"Error",errorApiKey:"Check your connection",errorUrl:"Make sure the URL is complete",prevAuditsLabel:"previous",prevAuditsLabelPlural:"previous",overview:"Overview",systemStatus:"System Status: Operational",version:"IGNITIA v9.1-STABLE",executionDate:"Date",performance:"Performance",queryContext:"Query Context",operations:"Operations",showingOf:"Showing",activeEntities:"active entities",
  }
};

const LangContext = createContext({ lang:"es", t:k=>T.es[k]||k, setLang:()=>{} });
function useLang() { return useContext(LangContext); }

// ─── Prompt maestro con nueva estructura ───────────────────────────
function getMasterPrompt(lang) {
  const isEN = lang === "en";

  const system = `Eres un especialista en estrategia digital, conversión y presencia online para Ignitia. ${isEN ? "Respond entirely in English." : "Responde completamente en español."}`;

  const sequence = isEN
    ? `Analyze the business following this exact sequence:
1. SEARCH — Find real information about the business online: website, Google Maps, social media.
2. IDENTIFY — Determine the exact business type and target market.
3. AUDIT — Evaluate digital presence identifying problems relevant to that specific business type: NAP consistency, web friction, SEO, keywords, content, speed, social media.
4. PRIORITIZE — Select the problems with the highest impact on conversion or visibility.`
    : `Analiza el negocio siguiendo esta secuencia exacta:
1. BUSCAR — Busca información real del negocio en internet: sitio web, Google Maps, redes sociales.
2. IDENTIFICAR — Determina el giro exacto del negocio y su mercado objetivo.
3. AUDITAR — Evalúa su presencia digital identificando problemas relevantes para ese giro específico: coherencia NAP, fricción web, SEO, keywords, contenido, velocidad, redes sociales.
4. PRIORIZAR — Selecciona los problemas con mayor impacto en conversión o visibilidad.`;

  const structure = `${isEN ? "Respond using exactly these sections:" : "Responde usando exactamente estas secciones:"}

## 🛠️ ${isEN ? "INTERNAL NOTES" : "NOTAS INTERNAS"}
- ${isEN ? "Technical Analysis: errors, NAP inconsistencies, SEO metrics." : "Análisis Técnico: errores, inconsistencias NAP, métricas SEO."}
- ${isEN ? "Sales Hook: top weak point to offer services." : "Gancho de Venta: punto débil principal para ofrecer servicios."}

## 📄 ${isEN ? "CLIENT REPORT" : "REPORTE PARA EL CLIENTE"}
${isEN ? "Empathetic tone, physical store analogies." : "Tono empático, analogías de tienda física."}
### ⚡ ${isEN ? "Digital Health Diagnosis" : "Diagnóstico de Salud Digital"}
${isEN ? "Score 1-10 of Friction (1 = very easy to find, 10 = impossible)." : "Calificación 1-10 de Fricción (1 = muy fácil encontrarte, 10 = imposible)."}
### 🎯 ${isEN ? "Your Google Showcase" : "Tu Vitrina en Google"}
### 🔍 ${isEN ? "The Road Bumps" : "Los Baches en el Camino"}
### 🏗️ ${isEN ? "Your Main Sign (H1)" : "Tu Letrero Principal (H1)"}
### 🚀 ${isEN ? "Quick Wins Plan (60 min)" : "Plan de Quick Wins (60 min)"}
${isEN ? "Present exactly 5 actions in Markdown table:" : "Presenta exactamente 5 acciones en tabla Markdown:"}
| ${isEN ? "Action" : "Acción"} | ${isEN ? "Where" : "Dónde"} | ${isEN ? "Time" : "Tiempo"} | ${isEN ? "Impact" : "Impacto"} |
|--------|-------|--------|---------|
${isEN ? "Order by impact: High, Medium, Low." : "Ordena: Alto, Medio, Bajo."}

## 🏆 ${isEN ? "COMPETITIVE BENCHMARK" : "BENCHMARK COMPETITIVO"}
${isEN
  ? "Identify 2 main competitors in Google Top 3. For each: name, URL, 2-3 advantages, main keywords, friction score. End with: Main gap + Immediate opportunity."
  : "Identifica 2 competidores principales en el Top 3 de Google. Para cada uno: nombre, URL, 2-3 ventajas, keywords principales, score de fricción. Al final: Brecha principal + Oportunidad inmediata."}

## 📚 ${isEN ? "GLOSSARY FOR BUSINESS OWNERS" : "DICCIONARIO PARA DUEÑOS"}
${isEN ? "Define H1, SEO, NAP, Keywords, Friction with simple analogies." : "Define H1, SEO, NAP, Keywords, Fricción con analogías simples."}

IGNITIA_SCORE: [${isEN ? "number 1-10" : "número 1-10"}]

${isEN ? "If you cannot verify something: 'Could not verify this point, please review manually'. Do not say a website is beautiful if it is not functional." : "Si no puedes verificar algo: 'No pude verificar este punto, favor de revisar manualmente'. No digas que una web es bonita si no es funcional."}`;

  return `${system}\n\n${sequence}\n\n${structure}`;
}

// ─── Storage ───────────────────────────────────────────────────────
function loadClients(){return JSON.parse(localStorage.getItem("ignitia_clients")||"[]")}
function saveClients(c){localStorage.setItem("ignitia_clients",JSON.stringify(c))}
function loadHistory(){return JSON.parse(localStorage.getItem("ignitia_history")||"[]")}
function saveToHistory(query,result,clientId,score){
  const h=loadHistory();
  const entry={id:Date.now(),clientId,score,date:new Date().toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"}),query,result};
  h.unshift(entry);localStorage.setItem("ignitia_history",JSON.stringify(h.slice(0,100)));return entry;
}
function getClientAudits(clientId){return loadHistory().filter(e=>e.clientId===clientId)}
function updateClientScore(clientId,score){
  const c=loadClients();const idx=c.findIndex(x=>x.id===clientId);
  if(idx!==-1){c[idx].lastScore=score;c[idx].lastAudit=new Date().toLocaleDateString("es-MX",{day:"2-digit",month:"short",year:"numeric"});saveClients(c);}
}
function extractScore(text){
  const m=text.match(/IGNITIA_SCORE:\s*(\d+(?:\.\d+)?)/);if(m)return parseFloat(m[1]);
  const m2=text.match(/calificaci[oó]n[^0-9]*(\d+(?:\.\d+)?)\s*\/\s*10/i);if(m2)return parseFloat(m2[1]);
  return null;
}

const SECTORS={
  es:["Restaurante","Clínica / Salud","Tienda / Retail","Agencia","Educación","Inmobiliaria","Fitness / Gym","Belleza / Spa","Legal","Tecnología","Otro"],
  en:["Restaurant","Clinic / Health","Store / Retail","Agency","Education","Real Estate","Fitness / Gym","Beauty / Spa","Legal","Technology","Other"],
};

// ─── Markdown ──────────────────────────────────────────────────────
function getStyle(title){
  if(!title)return{bg:"#171c22",border:"#31353c",accent:"#a2c9ff",tag:"INFO"};
  if(title.includes("NOTAS")||title.includes("INTERNAL")||title.includes("🛠"))return{bg:"#1a0f00",border:"#FF450044",accent:"#FF4500",tag:title.includes("INTERNAL")?"CONSULTANT ONLY":"SOLO CONSULTOR"};
  if(title.includes("REPORTE")||title.includes("REPORT")||title.includes("📄"))return{bg:"#0a1220",border:"#a2c9ff33",accent:"#a2c9ff",tag:title.includes("REPORT")?"FOR CLIENT":"PARA EL CLIENTE"};
  if(title.includes("BENCH")||title.includes("🏆"))return{bg:"#110f1a",border:"#d5bbff33",accent:"#d5bbff",tag:"BENCHMARK"};
  if(title.includes("DICCI")||title.includes("GLOSS")||title.includes("📚"))return{bg:"#0a1a0a",border:"#3fb95033",accent:"#3fb950",tag:title.includes("GLOSS")?"GLOSSARY":"GLOSARIO"};
  return{bg:"#171c22",border:"#31353c",accent:"#a2c9ff",tag:"INFO"};
}

function parseMarkdownSections(text){
  const clean=text.replace(/IGNITIA_SCORE:\s*\d+(?:\.\d+)?/g,"").trim();
  const sections=[],lines=clean.split("\n");let current=null;
  for(const line of lines){
    if(line.startsWith("## ")){if(current)sections.push(current);current={title:line.replace(/^## /,"").trim(),content:[]};}
    else if(current)current.content.push(line);
    else{if(!sections.length)sections.push({title:null,content:[]});sections[0].content.push(line);}
  }
  if(current)sections.push(current);
  return sections.filter(s=>s.title||s.content.join("").trim());
}

function formatInline(text){
  return text.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
    .replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>").replace(/\*(.+?)\*/g,"<em>$1</em>");
}

function renderMd(raw){
  const lines=raw.split("\n");let html="",i=0;
  while(i<lines.length){
    const line=lines[i];
    if(line.trim().startsWith("|")&&lines[i+1]?.trim().startsWith("|---")){
      const headers=line.trim().split("|").filter(c=>c.trim()).map(c=>c.trim());i+=2;
      let rows=[];
      while(i<lines.length&&lines[i].trim().startsWith("|")){rows.push(lines[i].trim().split("|").filter(c=>c.trim()).map(c=>c.trim()));i++;}
      html+=`<div style="overflow-x:auto;margin:12px 0"><table style="width:100%;border-collapse:collapse;font-size:11px;font-family:'IBM Plex Mono',monospace"><thead><tr style="border-bottom:1px solid #31353c">${headers.map(h=>`<th style="text-align:left;padding:8px 12px;color:#484f58;font-weight:700;white-space:nowrap;text-transform:uppercase;letter-spacing:.05em">${formatInline(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((row,ri)=>`<tr style="border-bottom:1px solid #171c22;${ri%2===0?"background:#ffffff05":""}">${row.map(cell=>{const ic=(cell==="Alto"||cell==="High")?"#3fb950":(cell==="Medio"||cell==="Medium")?"#d29922":(cell==="Bajo"||cell==="Low")?"#484f58":(cell==="Crítico"||cell==="Critical")?"#E24B4A":null;return`<td style="padding:8px 12px;color:#dfe2ec;vertical-align:top">${ic?`<span style="background:${ic}22;color:${ic};padding:2px 10px;border-radius:2px;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em">${cell}</span>`:formatInline(cell)}</td>`;}).join("")}</tr>`).join("")}</tbody></table></div>`;
      continue;
    }
    if(line.startsWith("### ")){html+=`<h4 style="font-size:11px;font-weight:700;margin:16px 0 8px;color:#dfe2ec;text-transform:uppercase;letter-spacing:.1em">${formatInline(line.slice(4))}</h4>`;i++;continue;}
    if(line.startsWith("- ")){html+=`<li style="font-size:12px;line-height:1.65;margin-bottom:5px;margin-left:18px;color:#dfe2ec">${formatInline(line.slice(2))}</li>`;i++;continue;}
    if(!line.trim()){html+="<br/>";i++;continue;}
    html+=`<p style="font-size:12px;line-height:1.75;margin-bottom:8px;color:#dfe2ec">${formatInline(line)}</p>`;i++;
  }
  return html;
}

// ─── API loop ──────────────────────────────────────────────────────
async function runAuditLoop(apiMessages,onStatus,systemOverride){
  const MAX_TURNS=12;let msgs=[...apiMessages];
  for(let turn=0;turn<MAX_TURNS;turn++){
    onStatus(turn===0?"connecting":`processing:${turn}`);
    const res=await fetch("/api/audit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:4000,system:systemOverride,tools:[{type:"web_search_20250305",name:"web_search"}],messages:msgs})});
    if(!res.ok){const err=await res.json().catch(()=>({}));throw new Error(err?.error?.message||`HTTP ${res.status}`);}
    const data=await res.json();const{content,stop_reason}=data;
    msgs=[...msgs,{role:"assistant",content}];
    if(stop_reason==="end_turn"){const text=content.filter(b=>b.type==="text").map(b=>b.text).join("\n").trim();if(!text)throw new Error("Empty response.");return text;}
    if(stop_reason==="tool_use"){
      const wr=content.filter(b=>b.type==="web_search_tool_result");if(wr.length>0){onStatus("analyzing");continue;}
      const tu=content.filter(b=>b.type==="tool_use");if(tu.length>0)msgs=[...msgs,{role:"user",content:tu.map(t=>({type:"tool_result",tool_use_id:t.id,content:"OK"}))}];
      continue;
    }
    const fb=content.filter(b=>b.type==="text").map(b=>b.text).join("\n").trim();if(fb)return fb;throw new Error(`Unexpected stop: ${stop_reason}`);
  }
  throw new Error("Too many steps.");
}

// ─── UI Components ─────────────────────────────────────────────────
function ScoreBadge({score}){
  const{t}=useLang();if(!score)return null;
  const color=score<=4?"#E24B4A":score<=7?"#d29922":"#3fb950";
  const label=score<=4?t("critical").split(" ")[0]:score<=7?t("regular").split(" ")[0]:t("good").split(" ")[0];
  return(<span style={{display:"inline-flex",alignItems:"center",gap:6,padding:"3px 10px",borderRadius:2,background:`${color}15`,border:`1px solid ${color}40`}}><span style={{width:6,height:6,borderRadius:"50%",background:color,display:"inline-block",boxShadow:`0 0 6px ${color}`}}/><span style={{color,fontWeight:700,fontSize:10,fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",letterSpacing:"0.1em"}}>{score}/10 · {label}</span></span>);
}

function LangSelector(){
  const{lang,setLang}=useLang();
  return(<div style={{display:"flex",background:"#171c22",border:"1px solid #31353c22",borderRadius:4,overflow:"hidden"}}>{["es","en"].map(l=>(<button key={l} onClick={()=>setLang(l)} style={{background:lang===l?"#FF4500":"transparent",border:"none",color:lang===l?"#fff":"#484f58",padding:"4px 10px",cursor:"pointer",fontFamily:"'IBM Plex Mono',monospace",fontSize:10,fontWeight:700,letterSpacing:"0.1em",transition:"all .15s"}}>{l.toUpperCase()}</button>))}</div>);
}

function Toast({message,onClose}){
  useEffect(()=>{const t=setTimeout(onClose,3500);return()=>clearTimeout(t);},[]);
  return(<div style={{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:500,display:"flex",alignItems:"center",gap:10,background:"#171c22",border:"1px solid #3fb95044",borderRadius:4,padding:"12px 20px",whiteSpace:"nowrap",boxShadow:"0 0 40px rgba(63,185,80,0.1)"}}><span style={{width:8,height:8,borderRadius:"50%",background:"#3fb950",display:"inline-block",boxShadow:"0 0 8px #3fb950"}}/><span style={{color:"#3fb950",fontSize:11,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace",textTransform:"uppercase",letterSpacing:"0.1em"}}>{message}</span><span onClick={onClose} style={{color:"#484f58",fontSize:16,cursor:"pointer",marginLeft:8}}>×</span></div>);
}

function Sidebar({currentView,setView,session,onLogout}){
  const{t}=useLang();
  const items=[{id:"dashboard",label:t("overview"),icon:"▦"},{id:"chat",label:t("chat"),icon:">_"},{id:"history",label:t("history"),icon:"◷"}];
  return(<aside style={{width:240,position:"fixed",left:0,top:0,bottom:0,zIndex:40,background:"#171c22",borderRight:"1px solid rgba(255,69,0,0.1)",display:"flex",flexDirection:"column",paddingTop:80}}>
    <div style={{padding:"0 24px 20px"}}><div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:11,letterSpacing:"0.2em",textTransform:"uppercase",color:"#FF4500"}}>Ignitia Console</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",opacity:0.5,textTransform:"uppercase",marginTop:3}}>V9.1-STABLE</div></div>
    <nav style={{flex:1,padding:"0 12px"}}>{items.map(item=>(<button key={item.id} onClick={()=>setView(item.id)} style={{width:"100%",display:"flex",alignItems:"center",gap:12,padding:"10px 16px",border:"none",borderRight:`3px solid ${currentView===item.id?"#FF4500":"transparent"}`,background:currentView===item.id?"#31353c":"transparent",color:currentView===item.id?"#dfe2ec":"rgba(223,226,236,0.4)",cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2,transition:"all .2s",textAlign:"left"}}><span style={{fontFamily:"monospace",fontSize:12,opacity:0.7}}>{item.icon}</span>{item.label}</button>))}</nav>
    <div style={{padding:"16px 24px",borderTop:"1px solid rgba(255,255,255,0.05)"}}><div style={{fontSize:10,color:"#484f58",fontFamily:"'Cordia New',monospace",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{session?.user?.email}</div><div style={{display:"flex",gap:8,alignItems:"center"}}><LangSelector/><button onClick={onLogout} style={{background:"transparent",border:"1px solid #31353c",color:"#484f58",padding:"4px 8px",borderRadius:4,cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:9,textTransform:"uppercase"}}>{t("logout")}</button></div></div>
  </aside>);
}

function TopBar({setView}){
  return(<nav style={{position:"fixed",top:0,left:0,right:0,height:64,zIndex:50,background:"rgba(23,28,34,0.85)",backdropFilter:"blur(20px)",borderBottom:"1px solid rgba(255,69,0,0.15)",boxShadow:"0 0 40px rgba(255,69,0,0.06)",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 24px"}}>
    <div onClick={()=>setView("dashboard")} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}><div style={{width:32,height:32,background:"linear-gradient(135deg,#FF4500,#c43300)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>🔥</div><span style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:16,color:"#dfe2ec",textTransform:"uppercase",letterSpacing:"0.1em"}}>Ignitia</span></div>
    <div style={{display:"flex",alignItems:"center",gap:16}}><div style={{width:8,height:8,borderRadius:"50%",background:"#3fb950",boxShadow:"0 0 8px rgba(63,185,80,0.5)"}}/><span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em"}}>IGNITIA v9.1-STABLE</span></div>
  </nav>);
}

function LoginScreen(){
  const{t}=useLang();
  const[email,setEmail]=useState("");const[password,setPassword]=useState("");
  const[loading,setLoading]=useState(false);const[error,setError]=useState("");
  const handleLogin=async()=>{
    if(!email||!password)return setError(t("loginError"));
    setLoading(true);setError("");
    const{error}=await supabase.auth.signInWithPassword({email,password});
    if(error)setError(t("loginError"));setLoading(false);
  };
  return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:24,background:"#060a10",position:"relative",overflow:"hidden"}}>
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
        {error&&<div style={{background:"rgba(232,75,74,0.1)",border:"1px solid rgba(232,75,74,0.3)",borderRadius:4,padding:"10px 14px",color:"#E24B4A",fontSize:11,fontFamily:"'Cordia New',monospace",marginBottom:20}}>{error}</div>}
        <button onClick={handleLogin} disabled={loading} style={{width:"100%",background:loading?"#7a2200":"#FF4500",border:"none",borderRadius:8,padding:"14px",color:"#fff",fontFamily:"'Supply',monospace",fontSize:13,fontWeight:700,cursor:loading?"not-allowed":"pointer",textTransform:"uppercase",letterSpacing:"0.2em"}}>{loading?t("loginLoading"):t("loginBtn")}</button>
        <div style={{marginTop:20,textAlign:"center",fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em"}}>{t("loginRestricted")}</div>
      </div>
      <div style={{marginTop:28,display:"flex",justifyContent:"space-between",padding:"0 4px"}}><div style={{display:"flex",alignItems:"center",gap:8}}><span style={{width:8,height:8,borderRadius:"50%",background:"#3fb950",display:"inline-block",boxShadow:"0 0 8px rgba(63,185,80,0.5)"}}/><span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase"}}>System Status: Operational</span></div><span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase"}}>IGNITIA v9.1</span></div>
    </div>
  </div>);
}

function DashboardView({onNewAudit,onSelectClient}){
  const{t}=useLang();
  const clients=loadClients();const history=loadHistory();
  const scored=history.filter(h=>h.score);
  const avgScore=scored.length?(scored.reduce((a,b)=>a+b.score,0)/scored.length).toFixed(1):null;
  const thisMonth=history.filter(h=>{const d=new Date(h.id);const n=new Date();return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear();}).length;
  const improved=clients.filter(c=>{const a=getClientAudits(c.id).filter(x=>x.score);return a.length>=2&&a[0].score>a[1].score;}).length;
  const chartClients=clients.filter(c=>c.lastScore).slice(0,8);

  useEffect(()=>{
    if(!chartClients.length||!window.Chart)return;
    const ex=window.ignitiaChart;if(ex)ex.destroy();
    const ctx=document.getElementById("dashChart");if(!ctx)return;
    window.ignitiaChart=new window.Chart(ctx,{type:"bar",data:{labels:chartClients.map(c=>c.name.length>10?c.name.slice(0,10)+"…":c.name),datasets:[{data:chartClients.map(c=>c.lastScore),backgroundColor:chartClients.map(c=>c.lastScore<=4?"#E24B4A":c.lastScore<=7?"#d29922":"#3fb950"),borderRadius:0}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},scales:{y:{min:0,max:10,ticks:{stepSize:2,color:"#484f58",font:{family:"'Cordia New',monospace",size:10}},grid:{color:"rgba(255,255,255,0.03)"}},x:{ticks:{color:"#484f58",font:{family:"'Cordia New',monospace",size:9},autoSkip:false,maxRotation:45},grid:{display:false}}}}});
  },[clients.length]);

  const stats=[
    {label:t("activeClients"),value:clients.length,change:"",color:"#FF4500"},
    {label:t("monthAudits"),value:thisMonth,change:"TOTAL",color:"#dfe2ec"},
    {label:t("avgScore"),value:avgScore?`${avgScore}`:"—",change:avgScore?(avgScore<=4?"CRÍTICO":avgScore<=7?"REGULAR":"BUENO"):"—",color:avgScore?(avgScore<=4?"#E24B4A":avgScore<=7?"#d29922":"#3fb950"):"#484f58",pulse:!!avgScore},
    {label:t("improved"),value:improved,change:"DOMINIOS",color:"#3fb950"},
  ];

  return(<div style={{display:"flex",flexDirection:"column",gap:36}}>
    <header><div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:36,color:"#fff",textTransform:"uppercase",letterSpacing:"-0.02em",marginBottom:4}}>{t("dashboard")}</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.2em"}}>V9.1-STABLE // ACTIVE SESSION</div></header>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16}}>
      {stats.map((s,i)=>(<div key={i} style={{background:"#171c22",borderLeft:`4px solid ${s.color}`,padding:"18px 22px"}}><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,textTransform:"uppercase",letterSpacing:"0.15em",color:"#484f58",marginBottom:12}}>{s.label}</div><div style={{display:"flex",alignItems:"flex-end",gap:10}}><span style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:32,color:s.color,lineHeight:1}}>{s.value}</span>{s.change&&<div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>{s.pulse&&<span style={{width:6,height:6,borderRadius:"50%",background:s.color,display:"inline-block"}}/>}<span style={{fontFamily:"'Cordia New',monospace",fontSize:8,textTransform:"uppercase",color:s.pulse?s.color:"#484f58",fontWeight:s.pulse?700:400}}>{s.change}</span></div>}</div></div>))}
    </div>
    {clients.length===0?(<div style={{background:"#171c22",border:"1px dashed #31353c",borderRadius:8,padding:"56px 24px",textAlign:"center"}}><div style={{fontSize:36,marginBottom:14}}>🔥</div><div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:16,color:"#fff",textTransform:"uppercase",marginBottom:6}}>{t("emptyTitle")}</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:12,color:"#484f58",lineHeight:1.7,marginBottom:24,maxWidth:360,margin:"0 auto 24px"}}>{t("emptyDesc")}</div><button onClick={onNewAudit} style={{background:"#FF4500",border:"none",color:"#fff",padding:"12px 28px",cursor:"pointer",fontFamily:"'Supply',monospace",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.2em"}}>{t("startAudit")}</button></div>
    ):(<div style={{display:"flex",flexDirection:"column",gap:20}}>
      {chartClients.length>0&&(<div style={{background:"#171c22",padding:28,borderRadius:4}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:28}}><div><div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:16,textTransform:"uppercase"}}>{t("frictionChart")}</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.15em",marginTop:4}}>Cross-segment analysis</div></div><div style={{display:"flex",gap:14}}>{[["#E24B4A","High"],["#d29922","Med"],["#3fb950","Low"]].map(([color,label])=>(<div key={label} style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:7,height:7,borderRadius:"50%",background:color,display:"inline-block"}}/><span style={{fontFamily:"'Cordia New',monospace",fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",color:"#484f58"}}>{label}</span></div>))}</div></div>
        <div style={{position:"relative",height:180}}><canvas id="dashChart"/></div>
      </div>)}
      <div style={{background:"#171c22",borderRadius:4,overflow:"hidden"}}>
        <div style={{padding:"20px 28px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.05)"}}><div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:18,textTransform:"uppercase"}}>{t("allClients")}</div><button onClick={onNewAudit} style={{background:"#FF4500",border:"none",color:"#fff",padding:"8px 18px",cursor:"pointer",fontFamily:"'Supply',monospace",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.15em"}}>+ {t("newAudit").replace("+ ","")}</button></div>
        <div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",fontFamily:"'Cordia New',monospace"}}>
          <thead><tr style={{background:"#0f141a"}}>{[t("client"),t("sector"),t("score"),t("audits"),t("lastAudit"),t("operations")].map((h,i)=>(<th key={h} style={{padding:"12px 20px",textAlign:i>=2?"center":"left",fontFamily:"'Cordia New',monospace",fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.15em",color:"#484f58"}}>{h}</th>))}</tr></thead>
          <tbody>{clients.map(client=>{const audits=getClientAudits(client.id);return(<tr key={client.id} style={{borderBottom:"1px solid rgba(255,255,255,0.03)",cursor:"pointer"}} onMouseOver={e=>e.currentTarget.style.background="#31353c20"} onMouseOut={e=>e.currentTarget.style.background=""}><td style={{padding:"18px 20px"}}><div style={{fontWeight:700,fontSize:13,color:"#dfe2ec",marginBottom:2}}>{client.name}</div><div style={{fontSize:9,color:"#484f58",textTransform:"uppercase"}}>{client.url?.replace("https://","")}</div></td><td style={{padding:"18px 20px"}}><span style={{background:"#31353c",padding:"3px 10px",fontSize:9,color:"#484f58",textTransform:"uppercase"}}>{client.sector}</span></td><td style={{padding:"18px 20px",textAlign:"center"}}>{client.lastScore?<ScoreBadge score={client.lastScore}/>:<span style={{color:"#31353c",fontSize:10}}>{t("noScore")}</span>}</td><td style={{padding:"18px 20px",textAlign:"center",fontWeight:700,fontSize:14,color:"#dfe2ec"}}>{String(audits.length).padStart(2,"0")}</td><td style={{padding:"18px 20px",textAlign:"center",fontSize:10,color:"#484f58",textTransform:"uppercase"}}>{client.lastAudit||"—"}</td><td style={{padding:"18px 20px",textAlign:"right"}}><button onClick={()=>onSelectClient(client)} style={{background:"none",border:"none",color:"#484f58",cursor:"pointer",fontSize:11,textTransform:"uppercase",letterSpacing:"0.1em",fontFamily:"'Cordia New',monospace",fontWeight:700}} onMouseOver={e=>e.currentTarget.style.color="#FF4500"} onMouseOut={e=>e.currentTarget.style.color="#484f58"}>{t("viewBtn")}</button></td></tr>);})}</tbody>
        </table></div>
        <div style={{padding:"12px 28px",background:"#0f141a",borderTop:"1px solid rgba(255,255,255,0.03)"}}><span style={{fontFamily:"'Cordia New',monospace",fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.15em",color:"#484f58"}}>{t("showingOf")} {clients.length} {t("registered")}</span></div>
      </div>
    </div>)}
  </div>);
}

function SaveClientModal({onSave,onSkip,defaultName="",defaultUrl=""}){
  const{t,lang}=useLang();
  const[name,setName]=useState(defaultName);const[url,setUrl]=useState(defaultUrl);
  const[sector,setSector]=useState(SECTORS[lang][SECTORS[lang].length-1]);
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div style={{background:"#0f141a",border:"1px solid rgba(255,255,255,0.05)",borderRadius:8,padding:32,maxWidth:400,width:"100%"}}>
      <div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:18,color:"#fff",textTransform:"uppercase",marginBottom:4}}>{t("saveClient")}</div>
      <div style={{fontFamily:"'Cordia New',monospace",fontSize:11,color:"#484f58",marginBottom:24}}>{t("saveClientDesc")}</div>
      {[{label:t("nameLabel"),value:name,set:setName,placeholder:"Ej: Paseo Interlomas"},{label:t("urlLabel"),value:url,set:setUrl,placeholder:"Ej: https://paseointerlomas.mx"}].map(f=>(<div key={f.label} style={{marginBottom:18}}><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,textTransform:"uppercase",letterSpacing:"0.2em",color:"#484f58",marginBottom:7}}>{f.label}</div><input value={f.value} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder} style={{width:"100%",background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.1)",padding:"8px 0",color:"#fff",fontFamily:"'Cordia New',monospace",fontSize:12,outline:"none",boxSizing:"border-box"}}/></div>))}
      <div style={{marginBottom:22}}><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,textTransform:"uppercase",letterSpacing:"0.2em",color:"#484f58",marginBottom:7}}>{t("sectorLabel")}</div><select value={sector} onChange={e=>setSector(e.target.value)} style={{width:"100%",background:"#171c22",border:"1px solid #31353c",padding:"8px 12px",color:"#dfe2ec",fontFamily:"'Cordia New',monospace",fontSize:11,outline:"none"}}>{SECTORS[lang].map(s=><option key={s} value={s}>{s}</option>)}</select></div>
      <div style={{display:"flex",gap:10}}><button onClick={onSkip} style={{flex:1,background:"transparent",border:"1px solid #31353c",color:"#484f58",padding:"10px",cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:11,textTransform:"uppercase"}}>{t("skipBtn")}</button><button onClick={()=>name.trim()&&onSave({name:name.trim(),url:url.trim(),sector})} style={{flex:1,background:"#FF4500",border:"none",color:"#fff",padding:"10px",cursor:"pointer",fontFamily:"'Supply',monospace",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>{t("saveBtn")}</button></div>
    </div>
  </div>);
}

function ReauditModal({client,onCompare,onFresh,onCancel}){
  const{t}=useLang();const audits=getClientAudits(client.id);
  return(<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:300,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
    <div style={{background:"#0f141a",border:"1px solid rgba(255,255,255,0.05)",borderRadius:8,padding:32,maxWidth:400,width:"100%"}}>
      <div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:18,color:"#fff",textTransform:"uppercase",marginBottom:4}}>{t("reauditTitle")}: {client.name}</div>
      <div style={{fontFamily:"'Cordia New',monospace",fontSize:11,color:"#484f58",marginBottom:24}}>{audits.length} {t("prevAuditsLabelPlural")}</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {audits.length>0&&(<button onClick={onCompare} style={{background:"rgba(162,201,255,0.05)",border:"1px solid rgba(162,201,255,0.2)",color:"#a2c9ff",padding:14,cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:11,fontWeight:700,textAlign:"left"}}>{t("compareBtn")}<div style={{fontSize:10,color:"#484f58",marginTop:4,fontWeight:400}}>{t("compareDesc")}</div></button>)}
        <button onClick={onFresh} style={{background:"rgba(255,69,0,0.05)",border:"1px solid rgba(255,69,0,0.2)",color:"#FF4500",padding:14,cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:11,fontWeight:700,textAlign:"left"}}>{t("freshBtn")}<div style={{fontSize:10,color:"#484f58",marginTop:4,fontWeight:400}}>{t("freshDesc")}</div></button>
        <button onClick={onCancel} style={{background:"transparent",border:"1px solid #31353c",color:"#484f58",padding:10,cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:11,textTransform:"uppercase"}}>{t("cancelBtn")}</button>
      </div>
    </div>
  </div>);
}

function HistoryView({onLoad}){
  const{t}=useLang();
  const[history,setHistory]=useState(loadHistory());
  const[search,setSearch]=useState("");const[filter,setFilter]=useState("todos");
  const clients=loadClients();
  const getClientName=id=>{const c=clients.find(c=>c.id===id);return c?c.name:null;};
  const handleDelete=id=>{const u=history.filter(e=>e.id!==id);localStorage.setItem("ignitia_history",JSON.stringify(u));setHistory(u);};
  const filtered=history.filter(e=>{
    const name=getClientName(e.clientId)||"";
    const ms=!search||e.query.toLowerCase().includes(search.toLowerCase())||name.toLowerCase().includes(search.toLowerCase());
    const mf=filter==="todos"||(filter==="cliente"&&e.clientId)||(filter==="critico"&&e.score&&e.score<=4)||(filter==="mes"&&(()=>{const d=new Date(e.id);const n=new Date();return d.getMonth()===n.getMonth()&&d.getFullYear()===n.getFullYear();})());
    return ms&&mf;
  });
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:36}}>
      <div><div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:32,color:"#fff",textTransform:"uppercase",marginBottom:4}}>{t("historyTitle")}</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:12,color:"#484f58"}}>{history.length} {t("historyAudits")}</div></div>
      <div style={{position:"relative"}}><span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:"#484f58",fontSize:12}}>🔍</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder={t("searchPlaceholder")} style={{background:"#171c22",border:"none",borderBottom:"2px solid rgba(255,255,255,0.1)",padding:"10px 10px 10px 34px",color:"#fff",fontFamily:"'Cordia New',monospace",fontSize:11,outline:"none",width:260}}/></div>
    </div>
    <div style={{display:"flex",gap:10,marginBottom:32,flexWrap:"wrap"}}>{[["todos",t("filterAll")],["mes",t("filterMonth")],["cliente",t("filterClient")],["critico",t("filterCritical")]].map(([val,lbl])=>(<button key={val} onClick={()=>setFilter(val)} style={{padding:"5px 18px",borderRadius:20,border:`1px solid ${filter===val?"#FF4500":"rgba(255,255,255,0.1)"}`,background:filter===val?"rgba(255,69,0,0.05)":"transparent",color:filter===val?"#FF4500":"#484f58",fontFamily:"'Cordia New',monospace",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",cursor:"pointer"}}>{lbl}</button>))}</div>
    {filtered.length===0?(<div style={{textAlign:"center",padding:"56px 0",color:"#484f58"}}><div style={{fontSize:36,marginBottom:14}}>📭</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:11,textTransform:"uppercase"}}>{search?t("emptySearch"):t("emptyHistory")}</div></div>
    ):(<div style={{display:"flex",flexDirection:"column",gap:10}}>{filtered.map(entry=>(<div key={entry.id} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 2fr auto",alignItems:"center",gap:20,background:"#171c22",padding:"18px 24px",borderRadius:4,border:"1px solid rgba(255,255,255,0.03)"}}>
      <div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{t("executionDate")}</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:11}}>{entry.date}</div></div>
      <div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>Client</div>{getClientName(entry.clientId)?<span style={{background:"#31353c",padding:"2px 8px",fontFamily:"'Cordia New',monospace",fontSize:10,color:"#FF4500",fontWeight:700,textTransform:"uppercase"}}>{getClientName(entry.clientId)}</span>:<span style={{color:"#484f58",fontSize:10}}>—</span>}</div>
      <div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{t("performance")}</div>{entry.score?<ScoreBadge score={entry.score}/>:<span style={{color:"#484f58",fontSize:10}}>—</span>}</div>
      <div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:3}}>{t("queryContext")}</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:11,color:"rgba(255,255,255,0.5)",fontStyle:"italic",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>"{entry.query}"</div></div>
      <div style={{display:"flex",gap:14,alignItems:"center"}}><button onClick={()=>onLoad(entry)} style={{background:"none",border:"none",color:"#FF4500",fontFamily:"'Cordia New',monospace",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",cursor:"pointer"}}>{t("viewBtn")}</button><button onClick={()=>handleDelete(entry.id)} style={{background:"none",border:"none",color:"#484f58",cursor:"pointer",fontSize:13}} onMouseOver={e=>e.currentTarget.style.color="#E24B4A"} onMouseOut={e=>e.currentTarget.style.color="#484f58"}>🗑</button></div>
    </div>))}</div>)}
  </div>);
}

function StarterCard({icon,label,fields,onSubmit}){
  const{t}=useLang();
  const[expanded,setExpanded]=useState(false);
  const[values,setValues]=useState(fields.reduce((a,f)=>({...a,[f.key]:""}),{}));
  if(!expanded)return(<button onClick={()=>setExpanded(true)} style={{background:"#171c22",border:"1px solid transparent",borderRadius:10,padding:18,cursor:"pointer",textAlign:"left",width:"100%",transition:"all .2s"}} onMouseOver={e=>{e.currentTarget.style.borderColor="rgba(255,69,0,0.2)";e.currentTarget.style.background="#1a1f26";}} onMouseOut={e=>{e.currentTarget.style.borderColor="transparent";e.currentTarget.style.background="#171c22";}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div style={{background:"rgba(255,69,0,0.1)",padding:"8px",borderRadius:8,fontSize:16}}>{icon}</div><span style={{color:"#484f58",fontSize:14,opacity:0.3}}>→</span></div><div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:12,textTransform:"uppercase",letterSpacing:"0.05em",color:"#dfe2ec",marginBottom:4}}>{label}</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:10,color:"#484f58"}}>{t("configureClick")}</div></button>);
  return(<div style={{background:"#171c22",border:"1px solid rgba(255,69,0,0.2)",borderRadius:10,padding:18}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}><span style={{fontSize:14}}>{icon}</span><span style={{fontFamily:"'Cordia New',monospace",fontSize:10,color:"#FF4500",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em"}}>{label}</span><button onClick={()=>setExpanded(false)} style={{marginLeft:"auto",background:"transparent",border:"none",color:"#484f58",cursor:"pointer",fontSize:16}}>×</button></div>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      {fields.map(f=>(<div key={f.key}><div style={{fontFamily:"'Cordia New',monospace",fontSize:8,color:"#484f58",marginBottom:5,textTransform:"uppercase",letterSpacing:"0.15em"}}>{f.label}</div><input value={values[f.key]} onChange={e=>setValues(v=>({...v,[f.key]:e.target.value}))} placeholder={f.placeholder} onKeyDown={e=>e.key==="Enter"&&onSubmit(values)} style={{width:"100%",background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.1)",padding:"6px 0",color:"#dfe2ec",fontFamily:"'Cordia New',monospace",fontSize:11,outline:"none",boxSizing:"border-box"}}/></div>))}
      <button onClick={()=>onSubmit(values)} style={{background:"#FF4500",border:"none",color:"#fff",padding:"8px",cursor:"pointer",fontFamily:"'Supply',monospace",fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:6,borderRadius:6}}>{t("auditSubmit")}</button>
    </div>
  </div>);
}

// ─── App ───────────────────────────────────────────────────────────
function App(){
  const[lang,setLangState]=useState(()=>localStorage.getItem("ignitia_lang")||"es");
  const t=k=>T[lang][k]||k;
  const setLang=l=>{setLangState(l);localStorage.setItem("ignitia_lang",l);};

  const[session,setSession]=useState(null);const[authLoading,setAuthLoading]=useState(true);
  const[view,setView]=useState("dashboard");
  const[messages,setMessages]=useState([]);const[loading,setLoading]=useState(false);
  const[statusKey,setStatusKey]=useState("");const[input,setInput]=useState("");
  const[saveModal,setSaveModal]=useState(null);const[reauditModal,setReauditModal]=useState(null);
  const[activeClient,setActiveClient]=useState(null);const[toast,setToast]=useState(null);
  const bottomRef=useRef(null);const textareaRef=useRef(null);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{setSession(session);setAuthLoading(false);});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_e,s)=>setSession(s));
    return()=>subscription.unsubscribe();
  },[]);
  useEffect(()=>{bottomRef.current?.scrollIntoView({behavior:"smooth"});},[messages,loading]);

  const getStatusText=key=>{
    if(!key)return"";if(key==="connecting")return t("connecting");
    if(key==="analyzing")return t("analyzing");
    if(key.startsWith("processing:"))return`${t("processing")} ${key.split(":")[1]})...`;return key;
  };

  const sendMessage=async(text,extraContext="")=>{
    const userText=(text!==undefined?text:input).trim();if(!userText||loading)return;
    setInput("");const newMessages=[...messages,{role:"user",content:userText}];
    setMessages(newMessages);setLoading(true);
    const basePrompt=getMasterPrompt(lang);
    const systemPrompt=extraContext?basePrompt+"\n\n"+extraContext:basePrompt;
    try{
      const result=await runAuditLoop(newMessages.map(m=>({role:m.role,content:m.content})),setStatusKey,systemPrompt);
      setMessages(prev=>[...prev,{role:"assistant",content:result}]);
      const score=extractScore(result);const clientId=activeClient?activeClient.id:null;
      saveToHistory(userText,result,clientId,score);
      if(clientId&&score)updateClientScore(clientId,score);
      if(!activeClient)setSaveModal({query:userText,result});
    }catch(e){setMessages(prev=>[...prev,{role:"assistant",content:`## ❌ ${t("errorTitle")}\n\n**${e.message}**\n\n- ${t("errorApiKey")}\n- ${t("errorUrl")}`}]);}
    setLoading(false);setStatusKey("");
  };

  const handleSaveClient=({name,url,sector})=>{
    const clients=loadClients();
    const newClient={id:Date.now(),name,url,sector,createdAt:new Date().toISOString()};
    const history=loadHistory();
    if(history[0]){history[0].clientId=newClient.id;localStorage.setItem("ignitia_history",JSON.stringify(history));if(history[0].score){newClient.lastScore=history[0].score;newClient.lastAudit=history[0].date;}}
    saveClients([newClient,...clients]);setActiveClient(newClient);setSaveModal(null);
    setToast(`${name} ${t("toastSaved")}`);
  };

  const handleSelectClient=(client)=>{
    setActiveClient(client);setView("chat");
    const audits=getClientAudits(client.id);
    if(audits.length>0)setReauditModal(client);
    else{setMessages([]);setInput(`${t("starterAudit")} ${client.name}${client.url?" - "+client.url:""}`);setTimeout(()=>textareaRef.current?.focus(),100);}
  };

  const handleCompare=()=>{
    const audits=getClientAudits(reauditModal.id);const last=audits[0];
    setReauditModal(null);setMessages([]);
    const context=`PREVIOUS AUDIT CONTEXT (${last.date}):\n${last.result.slice(0,1500)}\n\nSPECIAL INSTRUCTION: Compare with previous audit and add a comparison section at the end showing what improved, what got worse, and what remains the same.`;
    setTimeout(()=>sendMessage(`${t("starterAudit")} ${reauditModal.name}${reauditModal.url?" - "+reauditModal.url:""}`,context),100);
  };

  const handleFresh=()=>{
    setReauditModal(null);setMessages([]);
    setInput(`${t("starterAudit")} ${reauditModal.name}${reauditModal.url?" - "+reauditModal.url:""}`);
    setTimeout(()=>textareaRef.current?.focus(),100);
  };

  const STARTER_CONFIGS=[
    {icon:"🔍",label:t("auditBusiness"),fields:[{key:"nombre",label:t("businessName"),placeholder:t("businessNamePlaceholder")},{key:"url",label:t("businessUrl"),placeholder:t("businessUrlPlaceholder")}],build:v=>`${t("starterAudit")} ${v.nombre} - ${v.url}`},
    {icon:"🎯",label:t("realKeywords"),fields:[{key:"negocio",label:t("businessCity"),placeholder:t("businessCityPlaceholder")}],build:v=>`${t("starterKeywords")} ${v.negocio}`},
    {icon:"🚀",label:t("quickWins"),fields:[{key:"url",label:t("siteUrl"),placeholder:t("siteUrlPlaceholder")}],build:v=>`${t("starterWins")} ${v.url}`},
  ];

  const globalStyles=`
    @font-face{font-family:'Supply';src:url('https://fonts.cdnfonts.com/s/77402/Supply-Regular.woff') format('woff');}
    @font-face{font-family:'Cordia New';src:url('https://fonts.cdnfonts.com/s/15444/CordiaNew.woff') format('woff');}
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#060a10;color:#dfe2ec;font-family:'Cordia New',monospace}
    ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#171c22}::-webkit-scrollbar-thumb{background:#31353c}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(1.6)}}
    @keyframes blink{50%{opacity:0}}
    textarea::placeholder{color:#484f58;text-transform:uppercase;letter-spacing:.05em}
    input::placeholder{color:#484f58}
    select option{background:#171c22}
  `;

  if(authLoading)return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#060a10"}}><style>{globalStyles}</style><div style={{fontFamily:"'Cordia New',monospace",fontSize:11,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.2em"}}>{t("loading")}</div></div>);

  return(<LangContext.Provider value={{lang,t,setLang}}>
    <style>{globalStyles}</style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"/>
    {!session?<LoginScreen/>:(
      <div style={{minHeight:"100vh",background:"#060a10"}}>
        <TopBar setView={setView}/>
        <Sidebar currentView={view} setView={v=>{setView(v);if(v==="chat"){setMessages([]);setActiveClient(null);}}} session={session} onLogout={()=>supabase.auth.signOut()}/>
     <main style={{marginLeft:240,paddingTop:64,minHeight:"100vh",width:"calc(100% - 240px)"}}>
         <div style={{padding:"36px 36px 0",maxWidth:1100,width:"100%",boxSizing:"border-box"}}>
            {view==="dashboard"&&<DashboardView onNewAudit={()=>{setMessages([]);setActiveClient(null);setView("chat");}} onSelectClient={handleSelectClient}/>}
            {view==="history"&&<HistoryView onLoad={e=>{setMessages([{role:"user",content:e.query},{role:"assistant",content:e.result}]);setActiveClient(null);setView("chat");}}/>}
            {view==="chat"&&(<div style={{display:"flex",flexDirection:"column",height:"calc(100vh - 100px)"}}>
              {saveModal&&<SaveClientModal defaultName={saveModal.query.replace(/.*?:\s*/,"").split(" - ")[0]||""} defaultUrl={saveModal.query.includes("http")?saveModal.query.match(/https?:\/\/[^\s]+/)?.[0]||"":""} onSave={handleSaveClient} onSkip={()=>setSaveModal(null)}/>}
              {reauditModal&&<ReauditModal client={reauditModal} onCompare={handleCompare} onFresh={handleFresh} onCancel={()=>{setReauditModal(null);setActiveClient(null);}}/>}
              {activeClient&&(<div style={{padding:"10px 0",borderBottom:"1px solid rgba(255,255,255,0.05)",marginBottom:16,display:"flex",alignItems:"center",gap:12}}><span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.2em"}}>Active_Audit:</span><span style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:14,color:"#FF4500",textTransform:"uppercase"}}>{activeClient.name}</span>{activeClient.url&&<span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58"}}>{activeClient.url.replace("https://","")}</span>}<button onClick={()=>{setActiveClient(null);setMessages([]);}} style={{marginLeft:"auto",background:"transparent",border:"1px solid rgba(255,69,0,0.3)",color:"#FF4500",padding:"3px 10px",borderRadius:4,cursor:"pointer",fontFamily:"'Cordia New',monospace",fontSize:9,textTransform:"uppercase"}}>{t("cleanBtn")}</button></div>)}
              <div style={{flex:1,overflowY:"auto",paddingBottom:130}}>
                {messages.length===0&&!loading&&(<div style={{paddingTop:32}}>
                  <div style={{marginBottom:28}}><div style={{fontFamily:"'Supply',monospace",fontWeight:700,fontSize:28,color:"#fff",textTransform:"uppercase",letterSpacing:"-0.01em",marginBottom:4}}>{activeClient?`Active_Audit: ${activeClient.name}`:"Ignitia SEO Console"}</div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.2em"}}>{activeClient?`Status: Online // ${activeClient.sector}`:"Status: System Online // AI Engine Ready"}</div></div>
                  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(210px,1fr))",gap:14,marginBottom:24}}>{STARTER_CONFIGS.map(s=><StarterCard key={s.label} icon={s.icon} label={s.label} fields={s.fields} onSubmit={values=>sendMessage(s.build(values))}/>)}</div>
                </div>)}
                <div style={{display:"flex",flexDirection:"column",gap:24}}>
                  {messages.map((msg,i)=>(<div key={i}>
                    {msg.role==="user"?(<div style={{display:"flex",justifyContent:"flex-end",gap:12}}>
                      <div style={{maxWidth:"60%",textAlign:"right"}}><div style={{background:"#31353c",padding:"12px 16px",borderRadius:"10px 10px 0 10px"}}><div style={{fontFamily:"'Cordia New',monospace",fontSize:12,lineHeight:1.65,color:"#dfe2ec",whiteSpace:"pre-wrap"}}>{msg.content}</div></div><div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginTop:5}}>{t("youLabel")}</div></div>
                      <div style={{width:30,height:30,borderRadius:"50%",border:"1px solid rgba(255,69,0,0.2)",background:"#171c22",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:13}}>👤</div>
                    </div>):(
                      <div style={{display:"flex",gap:12}}>
                        <div style={{width:30,height:30,borderRadius:"50%",background:"#FF4500",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:13}}>🔥</div>
                        <div style={{flex:1}}>
                          <div style={{marginBottom:10,display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}><span style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#FF4500",textTransform:"uppercase",letterSpacing:"0.15em",fontWeight:700}}>Ignitia AI // {t("reportLabel")}</span>{extractScore(msg.content)&&<ScoreBadge score={extractScore(msg.content)}/>}<span style={{marginLeft:"auto",fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58"}}>{t("saved")}</span></div>
                          {parseMarkdownSections(msg.content).map((section,si)=>{const s=getStyle(section.title);return(<div key={si} style={{background:s.bg,border:`1px solid ${s.border}`,borderRadius:8,padding:"18px 22px",marginBottom:10}}>
                            {section.title&&(<div style={{marginBottom:12}}><span style={{fontFamily:"'Cordia New',monospace",fontSize:8,fontWeight:700,letterSpacing:"0.2em",background:`${s.accent}20`,color:s.accent,padding:"3px 10px",textTransform:"uppercase"}}>{s.tag}</span><div style={{fontFamily:"'Supply',monospace",fontSize:14,fontWeight:700,color:s.accent,marginTop:8,textTransform:"uppercase",letterSpacing:"-0.01em"}}>{section.title}</div></div>)}
                            <div dangerouslySetInnerHTML={{__html:renderMd(section.content.join("\n"))}}/>
                          </div>);})}
                          <div style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#484f58",textTransform:"uppercase",letterSpacing:"0.1em",marginTop:5}}>Ignitia AI // Audit_Agent</div>
                        </div>
                      </div>
                    )}
                  </div>))}
                  {loading&&(<div style={{display:"flex",gap:12}}>
                    <div style={{width:30,height:30,borderRadius:"50%",background:"#FF4500",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>🔥</div>
                    <div style={{flex:1,background:"#171c22",border:"1px solid rgba(255,69,0,0.1)",borderRadius:8,padding:"18px 22px"}}><div style={{height:2,background:"linear-gradient(90deg,#FF4500,#ffb5a0,#FF4500)",backgroundSize:"200%",animation:"shimmer 2s linear infinite",marginBottom:14,borderRadius:2}}/><div style={{fontFamily:"'Cordia New',monospace",fontSize:11,color:"#FF4500",marginBottom:8}}>{getStatusText(statusKey)}</div><div style={{display:"flex",gap:14,flexWrap:"wrap"}}>{[t("tracking"),t("verifying"),t("keywords"),t("comparing")].map((txt,i)=>(<span key={i} style={{fontFamily:"'Cordia New',monospace",fontSize:9,color:"#31353c",textTransform:"uppercase",letterSpacing:"0.1em",animation:`blink ${1+i*0.5}s step-end infinite`}}>{txt}...</span>))}</div></div>
                  </div>)}
                  <div ref={bottomRef}/>
                </div>
              </div>
              <div style={{position:"fixed",bottom:0,left:240,right:0,padding:"16px 36px 20px",boxSizing:"border-box",background:"linear-gradient(to top, #060a10 60%, transparent)"}}>
                <div style={{maxWidth:1064,margin:"0 auto",background:"#171c22",border:"1px solid rgba(255,255,255,0.05)",borderRadius:12,boxShadow:"0 -4px 40px rgba(0,0,0,0.3)",padding:"8px 8px 8px 20px",display:"flex",alignItems:"center",gap:12}}>
                  <span style={{color:"#484f58",fontSize:14,flexShrink:0}}>{">"}_</span>
                  <textarea ref={textareaRef} rows={2} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendMessage();}}} placeholder={activeClient?`${t("clientPlaceholder")} ${activeClient.name}...`:t("inputPlaceholder")} style={{flex:1,background:"transparent",border:"none",outline:"none",color:"#dfe2ec",fontFamily:"'Cordia New',monospace",fontSize:12,resize:"none",lineHeight:1.6,textTransform:"uppercase"}}/>
                  <button onClick={()=>sendMessage()} disabled={loading||!input.trim()} style={{background:loading?"#7a2200":"#FF4500",border:"none",color:"#fff",padding:"10px 22px",cursor:loading||!input.trim()?"not-allowed":"pointer",fontFamily:"'Supply',monospace",fontSize:12,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.15em",borderRadius:8,opacity:!input.trim()?0.3:1,flexShrink:0,transition:"all .2s"}}>{loading?t("auditingBtn"):`${t("auditBtn")} ⚡`}</button>
                </div>
                <div style={{textAlign:"center",marginTop:6}}><span style={{fontFamily:"'Cordia New',monospace",fontSize:8,color:"#31353c",textTransform:"uppercase",letterSpacing:"0.3em"}}>Console Secure // Encrypted Connection Enabled</span></div>
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
