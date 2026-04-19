import { useState, useRef, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap');`;

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'DM Sans', sans-serif; background: #080808; color: #f0ede8; }
  ::-webkit-scrollbar { width: 3px; } ::-webkit-scrollbar-track { background: #111; } ::-webkit-scrollbar-thumb { background: #e85d2f; border-radius: 2px; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .nav { display:flex; align-items:center; justify-content:space-between; padding:0 16px; height:52px; background:#0f0f0f; border-bottom:1px solid #1c1c1c; position:sticky; top:0; z-index:100; gap:10px; }
  .nav-logo { font-family:'Bebas Neue',sans-serif; font-size:20px; color:#e85d2f; letter-spacing:2px; white-space:nowrap; }
  .nav-tabs { display:flex; gap:2px; overflow-x:auto; } .nav-tabs::-webkit-scrollbar{display:none;}
  .nav-tab { padding:5px 11px; border-radius:6px; border:none; cursor:pointer; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:500; background:transparent; color:#666; transition:all 0.18s; white-space:nowrap; }
  .nav-tab:hover { color:#f0ede8; background:#1a1a1a; } .nav-tab.active { background:#e85d2f; color:#fff; }
  .onboard { flex:1; display:flex; align-items:center; justify-content:center; padding:28px 14px; }
  .onboard-card { width:100%; max-width:480px; background:#111; border:1px solid #1e1e1e; border-radius:16px; padding:32px 28px; }
  .onboard-title { font-family:'Bebas Neue',sans-serif; font-size:38px; color:#e85d2f; letter-spacing:3px; margin-bottom:4px; }
  .onboard-sub { color:#666; font-size:13px; margin-bottom:24px; line-height:1.6; }
  .field { margin-bottom:14px; }
  .field label { display:block; font-size:10px; font-weight:600; color:#777; text-transform:uppercase; letter-spacing:1px; margin-bottom:5px; }
  .field input, .field select, .field textarea { width:100%; padding:9px 12px; background:#161616; border:1px solid #242424; border-radius:8px; color:#f0ede8; font-family:'DM Sans',sans-serif; font-size:13px; outline:none; transition:border 0.18s; }
  .field input:focus, .field select:focus, .field textarea:focus { border-color:#e85d2f; }
  .field select option { background:#161616; } .field textarea { resize:vertical; min-height:56px; line-height:1.5; }
  .field-row { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
  .field-row3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; }
  .btn-primary { width:100%; padding:12px; border-radius:10px; border:none; background:#e85d2f; color:#fff; font-family:'Bebas Neue',sans-serif; font-size:17px; letter-spacing:2px; cursor:pointer; transition:opacity 0.18s; }
  .btn-primary:hover{opacity:.87;} .btn-primary:disabled{opacity:.38;cursor:not-allowed;}
  .btn-outline { padding:8px 16px; border-radius:8px; border:1px solid #e85d2f; background:transparent; color:#e85d2f; font-family:'DM Sans',sans-serif; font-size:12px; font-weight:600; cursor:pointer; transition:all 0.18s; }
  .btn-outline:hover{background:#e85d2f18;} .btn-outline:disabled{opacity:.38;cursor:not-allowed;}
  .btn-ghost { padding:6px 12px; border-radius:6px; border:1px solid #222; background:transparent; color:#777; font-size:12px; cursor:pointer; transition:all 0.18s; }
  .btn-ghost:hover{border-color:#444;color:#f0ede8;}
  .btn-danger { padding:4px 9px; border-radius:5px; border:1px solid #c0392b33; background:transparent; color:#c0392b; font-size:11px; cursor:pointer; transition:all 0.18s; }
  .btn-danger:hover{background:#c0392b18;}
  .main { flex:1; display:flex; flex-direction:column; }
  .section { padding:20px 18px; max-width:880px; width:100%; margin:0 auto; }
  .section-title { font-family:'Bebas Neue',sans-serif; font-size:23px; letter-spacing:2px; color:#e85d2f; margin-bottom:16px; }
  .card { background:#111; border:1px solid #1c1c1c; border-radius:12px; padding:14px; }
  .stat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(110px,1fr)); gap:9px; margin-bottom:18px; }
  .stat-card { background:#111; border:1px solid #1c1c1c; border-radius:10px; padding:12px; text-align:center; }
  .stat-val { font-family:'Bebas Neue',sans-serif; font-size:26px; color:#e85d2f; line-height:1; }
  .stat-label { font-size:10px; color:#555; text-transform:uppercase; letter-spacing:1px; margin-top:3px; }
  .badge { display:inline-block; padding:2px 7px; border-radius:4px; font-size:9px; font-weight:700; text-transform:uppercase; letter-spacing:1px; background:#e85d2f22; color:#e85d2f; margin-left:5px; }
  .empty { text-align:center; padding:40px 20px; color:#333; }
  .empty-icon { font-size:34px; margin-bottom:10px; } .empty-text { font-size:13px; line-height:1.6; }
  /* CHAT */
  .chat-wrap { display:flex; flex-direction:column; height:calc(100vh - 52px); }
  .chat-messages { flex:1; overflow-y:auto; padding:16px 18px; display:flex; flex-direction:column; gap:13px; }
  .msg { display:flex; gap:8px; align-items:flex-start; max-width:84%; }
  .msg.user { align-self:flex-end; flex-direction:row-reverse; }
  .msg-av { width:28px; height:28px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:13px; flex-shrink:0; }
  .msg.coach .msg-av{background:#e85d2f;} .msg.user .msg-av{background:#2a2a2a;}
  .msg-bubble { padding:10px 14px; border-radius:13px; font-size:13px; line-height:1.65; white-space:pre-wrap; }
  .msg.coach .msg-bubble { background:#141414; border:1px solid #202020; border-top-left-radius:3px; }
  .msg.user .msg-bubble { background:#e85d2f; color:#fff; border-top-right-radius:3px; }
  .typing { display:flex; gap:4px; padding:10px 14px; background:#141414; border:1px solid #202020; border-radius:13px; border-top-left-radius:3px; }
  .typing span { width:5px; height:5px; background:#e85d2f; border-radius:50%; animation:bounce 1.2s infinite; }
  .typing span:nth-child(2){animation-delay:.2s;} .typing span:nth-child(3){animation-delay:.4s;}
  @keyframes bounce{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
  .quick-prompts { display:flex; gap:6px; flex-wrap:wrap; padding:8px 14px 0; }
  .qp-btn { padding:5px 11px; border-radius:16px; border:1px solid #222; background:#141414; color:#888; font-size:11px; cursor:pointer; transition:all 0.18s; white-space:nowrap; }
  .qp-btn:hover{border-color:#e85d2f;color:#e85d2f;}
  .chat-input-bar { padding:11px 14px; background:#0f0f0f; border-top:1px solid #1c1c1c; display:flex; gap:8px; align-items:center; }
  .chat-input { flex:1; padding:9px 14px; background:#161616; border:1px solid #222; border-radius:22px; color:#f0ede8; font-family:'DM Sans',sans-serif; font-size:13px; outline:none; resize:none; transition:border 0.18s; line-height:1.4; }
  .chat-input:focus{border-color:#e85d2f;}
  .send-btn { width:36px; height:36px; border-radius:50%; border:none; background:#e85d2f; color:white; font-size:14px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:opacity 0.18s; flex-shrink:0; }
  .send-btn:hover{opacity:.85;} .send-btn:disabled{opacity:.38;cursor:not-allowed;}
  /* RUTINAS */
  .routine-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(240px,1fr)); gap:11px; }
  .day-card { background:#111; border:1px solid #1c1c1c; border-radius:12px; overflow:hidden; }
  .day-header { padding:10px 13px; background:#151515; display:flex; justify-content:space-between; align-items:center; }
  .day-name { font-family:'Bebas Neue',sans-serif; font-size:17px; letter-spacing:1px; }
  .day-focus { font-size:10px; color:#e85d2f; text-transform:uppercase; letter-spacing:1px; }
  .exercise-list { padding:10px 13px; display:flex; flex-direction:column; gap:8px; }
  .ex-item { display:flex; gap:8px; align-items:flex-start; }
  .ex-num { width:17px; height:17px; border-radius:50%; background:#e85d2f18; color:#e85d2f; font-size:9px; font-weight:700; display:flex; align-items:center; justify-content:center; flex-shrink:0; margin-top:1px; }
  .ex-name{font-size:12px;font-weight:500;} .ex-detail{font-size:10px;color:#555;margin-top:1px;} .ex-note{font-size:10px;color:#e85d2f88;font-style:italic;margin-top:1px;}
  /* DIARIO */
  .inner-tabs { display:flex; gap:3px; margin-bottom:16px; border-bottom:1px solid #1c1c1c; }
  .inner-tab { padding:7px 13px; font-size:12px; font-weight:500; color:#555; border:none; background:transparent; cursor:pointer; border-bottom:2px solid transparent; transition:all 0.18s; margin-bottom:-1px; }
  .inner-tab.active{color:#e85d2f;border-bottom-color:#e85d2f;}
  .week-strip { display:grid; grid-template-columns:repeat(7,1fr); gap:5px; margin-bottom:16px; }
  .week-day { background:#111; border:1px solid #1c1c1c; border-radius:8px; padding:7px 3px; text-align:center; transition:all 0.18s; }
  .week-day.today{border-color:#e85d2f;} .week-day.has-session{background:#e85d2f18;}
  .week-day-name{font-size:8px;color:#555;text-transform:uppercase;letter-spacing:.5px;}
  .week-day-num{font-family:'Bebas Neue',sans-serif;font-size:17px;line-height:1;margin-top:1px;}
  .week-day-dot{width:4px;height:4px;background:#e85d2f;border-radius:50%;margin:2px auto 0;}
  .session-card { background:#111; border:1px solid #1c1c1c; border-radius:12px; overflow:hidden; margin-bottom:10px; }
  .session-header { padding:11px 14px; background:#151515; display:flex; justify-content:space-between; align-items:center; cursor:pointer; }
  .session-date-title{font-weight:600;font-size:13px;} .session-sub{font-size:11px;color:#666;margin-top:1px;}
  .chip { padding:2px 8px; border-radius:4px; font-size:9px; font-weight:700; text-transform:uppercase; }
  .chip-orange{background:#e85d2f22;color:#e85d2f;} .chip-blue{background:#2196f322;color:#2196f3;}
  .session-body{padding:13px 14px;border-top:1px solid #1a1a1a;}
  .log-table{width:100%;border-collapse:collapse;}
  .log-table th{font-size:9px;color:#555;text-transform:uppercase;letter-spacing:.8px;text-align:left;padding:3px 6px 7px;font-weight:600;}
  .log-table td{font-size:12px;padding:5px 6px;border-bottom:1px solid #161616;vertical-align:middle;}
  .log-table tr:last-child td{border-bottom:none;}
  .set-row{display:flex;gap:4px;flex-wrap:wrap;}
  .set-pill{padding:2px 6px;background:#1e1e1e;border-radius:4px;font-size:10px;color:#bbb;}
  .new-session-form{background:#111;border:1px solid #1c1c1c;border-radius:12px;padding:16px;margin-bottom:16px;}
  .form-title{font-size:11px;font-weight:700;color:#777;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;}
  .sets-input{display:flex;gap:5px;flex-wrap:wrap;align-items:center;margin-top:4px;}
  .set-entry{display:flex;gap:3px;align-items:center;background:#1a1a1a;border:1px solid #222;border-radius:5px;padding:3px 7px;}
  .set-entry input{width:36px;background:transparent;border:none;color:#f0ede8;font-size:11px;text-align:center;outline:none;padding:0;font-family:'DM Sans',sans-serif;}
  .add-set-btn{padding:3px 7px;background:#e85d2f18;border:1px solid #e85d2f33;border-radius:4px;color:#e85d2f;font-size:10px;cursor:pointer;}
  .macro-bar-wrap{margin-bottom:10px;}
  .macro-label{display:flex;justify-content:space-between;font-size:11px;color:#888;margin-bottom:3px;}
  .macro-bar-bg{height:5px;background:#1e1e1e;border-radius:3px;overflow:hidden;}
  .macro-bar-fill{height:100%;border-radius:3px;transition:width 0.4s;}
  /* CHARTS */
  .chart-container{background:#111;border:1px solid #1c1c1c;border-radius:12px;padding:14px;margin-bottom:12px;}
  .chart-title{font-size:11px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;}
  .medidas-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(80px,1fr));gap:7px;}
  .medida-item{background:#161616;border:1px solid #202020;border-radius:7px;padding:8px;text-align:center;}
  .medida-val{font-family:'Bebas Neue',sans-serif;font-size:20px;color:#e85d2f;}
  .medida-label{font-size:9px;color:#555;text-transform:uppercase;letter-spacing:.8px;margin-top:1px;}
  .meal-card{background:#111;border:1px solid #1c1c1c;border-radius:11px;overflow:hidden;margin-bottom:9px;}
  .meal-header{padding:9px 13px;background:#151515;display:flex;justify-content:space-between;align-items:center;}
  .meal-name{font-weight:600;font-size:12px;} .meal-kcal{font-family:'Bebas Neue',sans-serif;font-size:16px;color:#e85d2f;}
  .meal-items{padding:9px 13px;}
  .meal-item{font-size:12px;color:#aaa;padding:3px 0;border-bottom:1px solid #181818;}
  .meal-item:last-child{border:none;}
`;

// ─── UTILS ───────────────────────────────────────────────────────────
const today = () => new Date().toISOString().split("T")[0];
const fmtDate = (d) => new Date(d + "T12:00:00").toLocaleDateString("es-ES", { day:"2-digit", month:"short" });
const fmtDateLong = (d) => new Date(d + "T12:00:00").toLocaleDateString("es-ES", { day:"2-digit", month:"short", year:"numeric" });
const DIAS_ES = ["Dom","Lun","Mar","Mié","Jue","Vie","Sáb"];

function getWeekDays() {
  const now = new Date(); const day = now.getDay();
  return Array.from({length:7},(_,i)=>{ const d=new Date(now); d.setDate(now.getDate()-day+i); return d.toISOString().split("T")[0]; });
}

async function askClaude(messages, system) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST", headers:{"Content-Type":"application/json"},
    body: JSON.stringify({ model:"claude-sonnet-4-20250514", max_tokens:1000, system, messages }),
  });
  const data = await res.json();
  return data.content?.[0]?.text || "Error en la respuesta.";
}

function buildSystem(p) {
  return `Eres APEX Coach, entrenador personal y nutricionista IA. Tutea siempre, directo y motivador. Español siempre.
Perfil: ${p.name}, ${p.age} años, ${p.weight}kg, ${p.height}cm. Objetivo: ${p.goal}. Nivel: ${p.level}. Días: ${p.days}/sem. Equipo: ${p.equipment}. Restricciones: ${p.restrictions||"ninguna"}.`;
}

// ─── ONBOARDING ──────────────────────────────────────────────────────
function Onboarding({ onComplete }) {
  const [f,setF] = useState({name:"",age:"",weight:"",height:"",goal:"perder grasa",level:"intermedio",days:"4",equipment:"gimnasio completo",restrictions:""});
  const set = k => e => setF({...f,[k]:e.target.value});
  return (
    <div className="onboard">
      <div className="onboard-card">
        <div className="onboard-title">APEX COACH</div>
        <div className="onboard-sub">Tu entrenador personal IA gratuito. Sin suscripciones. Cuéntame quién eres 🔥</div>
        <div className="field-row">
          <div className="field"><label>Nombre</label><input value={f.name} onChange={set("name")} placeholder="Lucía"/></div>
          <div className="field"><label>Edad</label><input type="number" value={f.age} onChange={set("age")} placeholder="27"/></div>
        </div>
        <div className="field-row">
          <div className="field"><label>Peso (kg)</label><input type="number" value={f.weight} onChange={set("weight")} placeholder="62"/></div>
          <div className="field"><label>Altura (cm)</label><input type="number" value={f.height} onChange={set("height")} placeholder="165"/></div>
        </div>
        <div className="field"><label>Objetivo</label>
          <select value={f.goal} onChange={set("goal")}>
            <option value="perder grasa">Perder grasa y definir</option>
            <option value="ganar músculo">Ganar músculo / volumen</option>
            <option value="recomposición">Recomposición corporal</option>
            <option value="mejorar resistencia">Mejorar resistencia / cardio</option>
            <option value="tonificar">Tonificar y ponerme en forma</option>
          </select>
        </div>
        <div className="field-row">
          <div className="field"><label>Nivel</label>
            <select value={f.level} onChange={set("level")}>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>
          <div className="field"><label>Días/semana</label>
            <select value={f.days} onChange={set("days")}>
              {["2","3","4","5","6"].map(d=><option key={d} value={d}>{d} días</option>)}
            </select>
          </div>
        </div>
        <div className="field"><label>Equipamiento</label>
          <select value={f.equipment} onChange={set("equipment")}>
            <option value="gimnasio completo">Gimnasio completo</option>
            <option value="mancuernas en casa">Mancuernas en casa</option>
            <option value="peso corporal">Solo peso corporal</option>
            <option value="gimnasio básico">Gimnasio básico</option>
          </select>
        </div>
        <div className="field"><label>Restricciones / alergias</label><input value={f.restrictions} onChange={set("restrictions")} placeholder="ej: vegetariana, intolerante lactosa..."/></div>
        <button className="btn-primary" onClick={()=>onComplete(f)} disabled={!f.name||!f.age||!f.weight||!f.height}>EMPEZAR MI TRANSFORMACIÓN →</button>
      </div>
    </div>
  );
}

// ─── COACH TAB ───────────────────────────────────────────────────────
const QPS = ["Dame motivación","Técnica de sentadilla","¿Qué como antes de entrenar?","Tengo agujetas","¿Cuándo veré resultados?","Cómo mejorar el descanso"];

function CoachTab({profile}) {
  const [msgs,setMsgs] = useState([{role:"coach",text:`¡Hola ${profile.name}! 💪 Soy tu coach personal IA, aquí 24/7. Objetivo: **${profile.goal}**. ¿Qué necesitas hoy?`}]);
  const [input,setInput] = useState(""); const [loading,setLoading] = useState(false);
  const endRef = useRef(null);
  useEffect(()=>{ endRef.current?.scrollIntoView({behavior:"smooth"}); },[msgs]);
  const send = async(txt) => {
    const t=(txt||input).trim(); if(!t||loading)return;
    setInput(""); setMsgs(p=>[...p,{role:"user",text:t}]); setLoading(true);
    const history=[...msgs,{role:"user",text:t}].slice(1).map(m=>({role:m.role==="coach"?"assistant":"user",content:m.text}));
    try{ const r=await askClaude(history,buildSystem(profile)); setMsgs(p=>[...p,{role:"coach",text:r}]); }
    catch{ setMsgs(p=>[...p,{role:"coach",text:"Error de conexión. Inténtalo de nuevo."}]); }
    setLoading(false);
  };
  return (
    <div className="chat-wrap">
      <div className="chat-messages">
        {msgs.map((m,i)=>(
          <div key={i} className={`msg ${m.role}`}>
            <div className="msg-av">{m.role==="coach"?"🤖":"👤"}</div>
            <div className="msg-bubble">{m.text}</div>
          </div>
        ))}
        {loading&&<div className="msg coach"><div className="msg-av">🤖</div><div className="typing"><span/><span/><span/></div></div>}
        <div ref={endRef}/>
      </div>
      <div className="quick-prompts">{QPS.map(q=><button key={q} className="qp-btn" onClick={()=>send(q)}>{q}</button>)}</div>
      <div className="chat-input-bar">
        <textarea className="chat-input" rows={1} value={input} onChange={e=>setInput(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Pregunta a tu coach..."/>
        <button className="send-btn" onClick={()=>send()} disabled={!input.trim()||loading}>▶</button>
      </div>
    </div>
  );
}

// ─── RUTINAS ─────────────────────────────────────────────────────────
function RutinasTab({profile}) {
  const [routine,setRoutine]=useState(null); const [loading,setLoading]=useState(false);
  const gen=async()=>{
    setLoading(true);
    const prompt=`Rutina semanal para ${profile.name}. Objetivo:${profile.goal}. Nivel:${profile.level}. Días:${profile.days}. Equipo:${profile.equipment}.
SOLO JSON sin markdown: {"dias":[{"nombre":"Lunes","enfoque":"Pecho y Tríceps","ejercicios":[{"nombre":"Press banca","series":"4","reps":"8-10","descanso":"90s","nota":"espalda pegada"}]}]}
Máx 6 ejercicios/día. ${profile.days} días de entreno.`;
    try{const r=await askClaude([{role:"user",content:prompt}],buildSystem(profile));setRoutine(JSON.parse(r.replace(/```json|```/g,"").trim()));}
    catch{alert("Error generando rutina.");}
    setLoading(false);
  };
  return (
    <div className="section">
      <div className="section-title">RUTINA <span className="badge">IA</span></div>
      <button className="btn-outline" onClick={gen} disabled={loading} style={{marginBottom:16}}>{loading?"Generando...":routine?"🔄 Regenerar":"⚡ Generar mi rutina"}</button>
      {loading&&<div className="empty"><div className="empty-icon">⚙️</div><div className="empty-text">Diseñando tu plan...</div></div>}
      {routine&&<div className="routine-grid">{routine.dias.map((d,i)=>(
        <div key={i} className="day-card">
          <div className="day-header"><span className="day-name">{d.nombre}</span><span className="day-focus">{d.enfoque}</span></div>
          <div className="exercise-list">{d.ejercicios.map((ex,j)=>(
            <div key={j} className="ex-item">
              <div className="ex-num">{j+1}</div>
              <div><div className="ex-name">{ex.nombre}</div><div className="ex-detail">{ex.series}×{ex.reps} · ⏱{ex.descanso}</div>{ex.nota&&<div className="ex-note">{ex.nota}</div>}</div>
            </div>
          ))}</div>
        </div>
      ))}</div>}
      {!routine&&!loading&&<div className="empty"><div className="empty-icon">🏋️</div><div className="empty-text">Genera tu rutina personalizada basada en tu perfil.</div></div>}
    </div>
  );
}

// ─── DIARIO ──────────────────────────────────────────────────────────
function newEx(){return {name:"",sets:[{kg:"",reps:""},{kg:"",reps:""},{kg:"",reps:""}]};}

function DiarioTab({profile,sessions,setSessions,calorias,setCalorias}) {
  const [innerTab,setInnerTab]=useState(0);
  const [showForm,setShowForm]=useState(false);
  const [expanded,setExpanded]=useState(null);
  const weekDays=getWeekDays();
  const [sesForm,setSesForm]=useState({date:today(),tipo:"",duracion:"",notas:"",ejercicios:[newEx()]});
  const [calForm,setCalForm]=useState({date:today(),kcal:"",proteinas:"",carbos:"",grasas:"",notas:""});

  const setEx=(i,k,v)=>{const exs=[...sesForm.ejercicios];exs[i]={...exs[i],[k]:v};setSesForm({...sesForm,ejercicios:exs});};
  const setSet=(ei,si,k,v)=>{const exs=[...sesForm.ejercicios];const sets=[...exs[ei].sets];sets[si]={...sets[si],[k]:v};exs[ei]={...exs[ei],sets};setSesForm({...sesForm,ejercicios:exs});};
  const addSet=(ei)=>{const exs=[...sesForm.ejercicios];exs[ei]={...exs[ei],sets:[...exs[ei].sets,{kg:"",reps:""}]};setSesForm({...sesForm,ejercicios:exs});};
  const removeSet=(ei,si)=>{const exs=[...sesForm.ejercicios];exs[ei].sets=exs[ei].sets.filter((_,i)=>i!==si);setSesForm({...sesForm,ejercicios:exs});};

  const saveSession=()=>{
    if(!sesForm.tipo)return;
    setSessions(p=>[{...sesForm,id:Date.now()},...p]);
    setSesForm({date:today(),tipo:"",duracion:"",notas:"",ejercicios:[newEx()]});
    setShowForm(false);
  };
  const saveCal=()=>{
    if(!calForm.kcal)return;
    setCalorias(p=>[{...calForm,id:Date.now()},...p]);
    setCalForm({date:today(),kcal:"",proteinas:"",carbos:"",grasas:"",notas:""});
  };

  const sessionDates=new Set(sessions.map(s=>s.date));
  const weekSessions=sessions.filter(s=>weekDays.includes(s.date)).length;
  const weekKcalArr=calorias.filter(c=>weekDays.includes(c.date));
  const avgKcal=weekKcalArr.length?Math.round(weekKcalArr.reduce((a,c)=>a+Number(c.kcal||0),0)/weekKcalArr.length):0;
  const todayCal=calorias.find(c=>c.date===today());

  return (
    <div className="section">
      <div className="section-title">DIARIO</div>
      <div className="inner-tabs">
        {["🏋️ Entrenos","🥗 Calorías"].map((t,i)=>(
          <button key={i} className={`inner-tab ${innerTab===i?"active":""}`} onClick={()=>setInnerTab(i)}>{t}</button>
        ))}
      </div>

      {/* SEMANA */}
      <div className="week-strip">
        {weekDays.map((d,i)=>(
          <div key={d} className={`week-day ${d===today()?"today":""} ${sessionDates.has(d)?"has-session":""}`}>
            <div className="week-day-name">{DIAS_ES[i]}</div>
            <div className="week-day-num">{parseInt(d.split("-")[2])}</div>
            {sessionDates.has(d)&&<div className="week-day-dot"/>}
          </div>
        ))}
      </div>

      <div className="stat-grid" style={{marginBottom:16}}>
        <div className="stat-card"><div className="stat-val">{weekSessions}</div><div className="stat-label">Entrenos semana</div></div>
        <div className="stat-card"><div className="stat-val">{sessions.length}</div><div className="stat-label">Total sesiones</div></div>
        <div className="stat-card"><div className="stat-val">{avgKcal||"—"}</div><div className="stat-label">Kcal media/día</div></div>
        <div className="stat-card"><div className="stat-val">{todayCal?.kcal||"—"}</div><div className="stat-label">Kcal hoy</div></div>
      </div>

      {/* ENTRENOS */}
      {innerTab===0&&<>
        <button className="btn-outline" onClick={()=>setShowForm(!showForm)} style={{marginBottom:14}}>{showForm?"✕ Cancelar":"+ Registrar entreno"}</button>
        {showForm&&(
          <div className="new-session-form">
            <div className="form-title">Nuevo entreno</div>
            <div className="field-row">
              <div className="field"><label>Fecha</label><input type="date" value={sesForm.date} onChange={e=>setSesForm({...sesForm,date:e.target.value})}/></div>
              <div className="field"><label>Tipo de sesión</label><input value={sesForm.tipo} onChange={e=>setSesForm({...sesForm,tipo:e.target.value})} placeholder="ej: Pecho & Tríceps"/></div>
            </div>
            <div className="field-row">
              <div className="field"><label>Duración (min)</label><input type="number" value={sesForm.duracion} onChange={e=>setSesForm({...sesForm,duracion:e.target.value})} placeholder="60"/></div>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontSize:10,fontWeight:700,color:"#777",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Ejercicios</div>
              {sesForm.ejercicios.map((ex,ei)=>(
                <div key={ei} style={{background:"#161616",border:"1px solid #222",borderRadius:8,padding:"9px 11px",marginBottom:7}}>
                  <div style={{display:"flex",gap:7,marginBottom:7,alignItems:"center"}}>
                    <input value={ex.name} onChange={e=>setEx(ei,"name",e.target.value)} placeholder={`Ejercicio ${ei+1} (ej: Press banca)`}
                      style={{flex:1,padding:"6px 9px",background:"#1a1a1a",border:"1px solid #282828",borderRadius:6,color:"#f0ede8",fontFamily:"'DM Sans',sans-serif",fontSize:12,outline:"none"}}/>
                    {sesForm.ejercicios.length>1&&<button className="btn-danger" onClick={()=>setSesForm({...sesForm,ejercicios:sesForm.ejercicios.filter((_,i)=>i!==ei)})}>✕</button>}
                  </div>
                  <div style={{fontSize:9,color:"#666",marginBottom:5,textTransform:"uppercase",letterSpacing:.8}}>Series · kg × reps</div>
                  <div className="sets-input">
                    {ex.sets.map((s,si)=>(
                      <div key={si} className="set-entry">
                        <span style={{fontSize:9,color:"#555",minWidth:10}}>{si+1}.</span>
                        <input value={s.kg} onChange={e=>setSet(ei,si,"kg",e.target.value)} placeholder="kg"/>
                        <span style={{color:"#444",fontSize:10}}>×</span>
                        <input value={s.reps} onChange={e=>setSet(ei,si,"reps",e.target.value)} placeholder="reps"/>
                        {ex.sets.length>1&&<span style={{cursor:"pointer",color:"#555",fontSize:9}} onClick={()=>removeSet(ei,si)}>✕</span>}
                      </div>
                    ))}
                    <span className="add-set-btn" onClick={()=>addSet(ei)}>+ serie</span>
                  </div>
                </div>
              ))}
              <button className="btn-ghost" onClick={()=>setSesForm({...sesForm,ejercicios:[...sesForm.ejercicios,newEx()]})} style={{fontSize:11,marginTop:3}}>+ Añadir ejercicio</button>
            </div>
            <div className="field"><label>Notas</label><textarea value={sesForm.notas} onChange={e=>setSesForm({...sesForm,notas:e.target.value})} placeholder="Cómo me he sentido, nuevo PR, etc."/></div>
            <button className="btn-primary" onClick={saveSession} disabled={!sesForm.tipo}>GUARDAR ENTRENO</button>
          </div>
        )}
        {sessions.length===0
          ?<div className="empty"><div className="empty-icon">📓</div><div className="empty-text">Registra tu primer entreno. Cada sesión queda guardada con todos los ejercicios, series y pesos.</div></div>
          :sessions.map((s,i)=>(
            <div key={s.id} className="session-card">
              <div className="session-header" onClick={()=>setExpanded(expanded===s.id?null:s.id)}>
                <div><div className="session-date-title">{fmtDateLong(s.date)} · {s.tipo}</div><div className="session-sub">{s.ejercicios.filter(e=>e.name).length} ejercicios{s.duracion?` · ${s.duracion}min`:""}</div></div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  {s.duracion&&<span className="chip chip-blue">{s.duracion}min</span>}
                  <span style={{color:"#555",fontSize:12}}>{expanded===s.id?"▲":"▼"}</span>
                </div>
              </div>
              {expanded===s.id&&(
                <div className="session-body">
                  <table className="log-table">
                    <thead><tr><th>Ejercicio</th><th>Series</th></tr></thead>
                    <tbody>{s.ejercicios.filter(e=>e.name).map((ex,j)=>(
                      <tr key={j}>
                        <td style={{fontWeight:500}}>{ex.name}</td>
                        <td><div className="set-row">{ex.sets.filter(s=>s.kg||s.reps).map((set,k)=>(
                          <span key={k} className="set-pill">{set.kg?`${set.kg}kg`:""}×{set.reps||"?"}</span>
                        ))}</div></td>
                      </tr>
                    ))}</tbody>
                  </table>
                  {s.notas&&<div style={{marginTop:9,padding:"7px 9px",background:"#161616",borderRadius:6,fontSize:12,color:"#888",fontStyle:"italic"}}>💬 {s.notas}</div>}
                  <div style={{marginTop:9,textAlign:"right"}}>
                    <button className="btn-danger" onClick={()=>setSessions(p=>p.filter(x=>x.id!==s.id))}>Eliminar sesión</button>
                  </div>
                </div>
              )}
            </div>
          ))
        }
      </>}

      {/* CALORÍAS */}
      {innerTab===1&&<>
        <div className="new-session-form">
          <div className="form-title">Registro de hoy</div>
          <div className="field-row">
            <div className="field"><label>Fecha</label><input type="date" value={calForm.date} onChange={e=>setCalForm({...calForm,date:e.target.value})}/></div>
            <div className="field"><label>Calorías totales</label><input type="number" value={calForm.kcal} onChange={e=>setCalForm({...calForm,kcal:e.target.value})} placeholder="1850"/></div>
          </div>
          <div className="field-row3">
            <div className="field"><label>Proteínas (g)</label><input type="number" value={calForm.proteinas} onChange={e=>setCalForm({...calForm,proteinas:e.target.value})} placeholder="140"/></div>
            <div className="field"><label>Carbos (g)</label><input type="number" value={calForm.carbos} onChange={e=>setCalForm({...calForm,carbos:e.target.value})} placeholder="180"/></div>
            <div className="field"><label>Grasas (g)</label><input type="number" value={calForm.grasas} onChange={e=>setCalForm({...calForm,grasas:e.target.value})} placeholder="60"/></div>
          </div>
          {calForm.kcal&&<>
            {[{label:"Proteínas",val:calForm.proteinas,target:Math.round(profile.weight*2),color:"#4caf50"},
              {label:"Carbohidratos",val:calForm.carbos,target:Math.round((calForm.kcal*0.45)/4),color:"#2196f3"},
              {label:"Grasas",val:calForm.grasas,target:Math.round((calForm.kcal*0.25)/9),color:"#ff9800"}
            ].map(m=>(
              <div key={m.label} className="macro-bar-wrap">
                <div className="macro-label"><span>{m.label}</span><span>{m.val||0}g / ~{m.target}g objetivo</span></div>
                <div className="macro-bar-bg"><div className="macro-bar-fill" style={{width:`${Math.min(((m.val||0)/m.target)*100,100)}%`,background:m.color}}/></div>
              </div>
            ))}
          </>}
          <div className="field"><label>Notas</label><input value={calForm.notas} onChange={e=>setCalForm({...calForm,notas:e.target.value})} placeholder="ej: día de recarga, cena fuera..."/></div>
          <button className="btn-primary" onClick={saveCal} disabled={!calForm.kcal} style={{marginTop:8}}>GUARDAR CALORÍAS</button>
        </div>
        {calorias.length===0
          ?<div className="empty"><div className="empty-icon">🥗</div><div className="empty-text">Registra tus calorías y macros. Verás las gráficas en la sección Progreso.</div></div>
          :calorias.map((c,i)=>(
            <div key={c.id} className="card" style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:9}}>
              <div>
                <div style={{fontWeight:600,fontSize:13}}>{fmtDateLong(c.date)}</div>
                {c.notas&&<div style={{fontSize:11,color:"#555",marginTop:1}}>{c.notas}</div>}
                {(c.proteinas||c.carbos||c.grasas)&&<div style={{fontSize:11,color:"#777",marginTop:2}}>P:{c.proteinas||"?"}g · C:{c.carbos||"?"}g · G:{c.grasas||"?"}g</div>}
              </div>
              <div style={{display:"flex",gap:10,alignItems:"center"}}>
                <div style={{textAlign:"right"}}>
                  <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:22,color:"#e85d2f"}}>{c.kcal}</div>
                  <div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:.8}}>kcal</div>
                </div>
                <button className="btn-danger" onClick={()=>setCalorias(p=>p.filter(x=>x.id!==c.id))}>✕</button>
              </div>
            </div>
          ))
        }
      </>}
    </div>
  );
}

// ─── PROGRESO ─────────────────────────────────────────────────────────
function ProgresoTab({profile,sessions,calorias}) {
  const [medForm,setMedForm]=useState({date:today(),peso:"",grasa:"",cintura:"",cadera:"",pecho:"",brazo:"",muslo:""});
  const [medidas,setMedidas]=useState([]);
  const [innerTab,setInnerTab]=useState(0);
  const setF=k=>e=>setMedForm({...medForm,[k]:e.target.value});

  const saveMedida=()=>{
    if(!medForm.peso)return;
    setMedidas(p=>[{...medForm,id:Date.now()},...p]);
    setMedForm({date:today(),peso:"",grasa:"",cintura:"",cadera:"",pecho:"",brazo:"",muslo:""});
  };

  const pesoData=[...medidas].reverse().slice(-12).map(m=>({fecha:fmtDate(m.date),peso:parseFloat(m.peso)||null,grasa:parseFloat(m.grasa)||null}));
  const kcalData=[...calorias].reverse().slice(-14).map(c=>({fecha:fmtDate(c.date),kcal:parseInt(c.kcal)||null}));
  const volMap=sessions.reduce((acc,s)=>{
    if(!acc[s.date])acc[s.date]={fecha:fmtDate(s.date),series:0};
    acc[s.date].series+=s.ejercicios.filter(e=>e.name).reduce((a,ex)=>a+ex.sets.filter(s=>s.kg||s.reps).length,0);
    return acc;
  },{});
  const volArr=Object.values(volMap).slice(-10);

  const deltaPeso=medidas.length>=2?(parseFloat(medidas[0].peso)-parseFloat(medidas[medidas.length-1].peso)).toFixed(1):null;

  const tooltipStyle={contentStyle:{background:"#161616",border:"1px solid #2a2a2a",borderRadius:8,fontSize:11},itemStyle:{color:"#f0ede8"},labelStyle:{color:"#888"}};

  return (
    <div className="section">
      <div className="section-title">PROGRESO</div>
      <div className="inner-tabs">
        {["📏 Medidas","📈 Gráficas","🏆 Logros"].map((t,i)=>(
          <button key={i} className={`inner-tab ${innerTab===i?"active":""}`} onClick={()=>setInnerTab(i)}>{t}</button>
        ))}
      </div>

      {innerTab===0&&<>
        <div className="new-session-form">
          <div className="form-title">Nueva medición</div>
          <div className="field-row">
            <div className="field"><label>Fecha</label><input type="date" value={medForm.date} onChange={setF("date")}/></div>
            <div className="field"><label>Peso (kg)</label><input type="number" step=".1" value={medForm.peso} onChange={setF("peso")} placeholder="62.5"/></div>
          </div>
          <div className="field-row">
            <div className="field"><label>% Grasa corporal</label><input type="number" step=".1" value={medForm.grasa} onChange={setF("grasa")} placeholder="20.0"/></div>
            <div className="field"><label>Cintura (cm)</label><input type="number" step=".5" value={medForm.cintura} onChange={setF("cintura")} placeholder="72"/></div>
          </div>
          <div className="field-row3">
            <div className="field"><label>Pecho (cm)</label><input type="number" step=".5" value={medForm.pecho} onChange={setF("pecho")} placeholder="90"/></div>
            <div className="field"><label>Brazo (cm)</label><input type="number" step=".5" value={medForm.brazo} onChange={setF("brazo")} placeholder="30"/></div>
            <div className="field"><label>Muslo (cm)</label><input type="number" step=".5" value={medForm.muslo} onChange={setF("muslo")} placeholder="55"/></div>
          </div>
          <button className="btn-primary" onClick={saveMedida} disabled={!medForm.peso}>GUARDAR MEDICIÓN</button>
        </div>
        {medidas.length===0
          ?<div className="empty"><div className="empty-icon">📏</div><div className="empty-text">Registra tu primera medición para ver tu evolución.</div></div>
          :medidas.map((m,i)=>{
            const prev=medidas[i+1];
            const diff=prev?(parseFloat(m.peso)-parseFloat(prev.peso)).toFixed(1):null;
            return (
              <div key={m.id} className="card" style={{marginBottom:9}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:9}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:13}}>{fmtDateLong(m.date)}</div>
                    {diff&&<div style={{fontSize:11,marginTop:1,color:parseFloat(diff)<0?"#4caf50":"#e85d2f"}}>{diff>0?"+":""}{diff} kg vs anterior</div>}
                  </div>
                  <div style={{display:"flex",gap:8,alignItems:"center"}}>
                    <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:24,color:"#e85d2f"}}>{m.peso}kg</div>
                    <button className="btn-danger" onClick={()=>setMedidas(p=>p.filter(x=>x.id!==m.id))}>✕</button>
                  </div>
                </div>
                <div className="medidas-grid">
                  {[["Grasa",m.grasa,"%"],["Cintura",m.cintura,"cm"],["Pecho",m.pecho,"cm"],["Brazo",m.brazo,"cm"],["Muslo",m.muslo,"cm"]].filter(x=>x[1]).map(([l,v,u])=>(
                    <div key={l} className="medida-item"><div className="medida-val">{v}<span style={{fontSize:10}}>{u}</span></div><div className="medida-label">{l}</div></div>
                  ))}
                </div>
              </div>
            );
          })
        }
      </>}

      {innerTab===1&&<>
        {pesoData.length>=2
          ?<div className="chart-container">
            <div className="chart-title">Evolución de peso (kg)</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={pesoData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a"/>
                <XAxis dataKey="fecha" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false} domain={["auto","auto"]}/>
                <Tooltip {...tooltipStyle}/>
                <Line type="monotone" dataKey="peso" stroke="#e85d2f" strokeWidth={2} dot={{fill:"#e85d2f",r:3}} activeDot={{r:5}} name="Peso"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          :<div className="empty"><div className="empty-icon">📈</div><div className="empty-text">Necesitas al menos 2 mediciones de peso para ver la gráfica.</div></div>
        }
        {pesoData.some(d=>d.grasa)&&<div className="chart-container">
          <div className="chart-title">% Grasa corporal</div>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={pesoData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a"/>
              <XAxis dataKey="fecha" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip {...tooltipStyle}/>
              <Line type="monotone" dataKey="grasa" stroke="#ff9800" strokeWidth={2} dot={{fill:"#ff9800",r:3}} name="% Grasa"/>
            </LineChart>
          </ResponsiveContainer>
        </div>}
        {kcalData.length>=2&&<div className="chart-container">
          <div className="chart-title">Calorías diarias</div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={kcalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a"/>
              <XAxis dataKey="fecha" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip {...tooltipStyle}/>
              <Bar dataKey="kcal" fill="#e85d2f" radius={[4,4,0,0]} name="Kcal"/>
            </BarChart>
          </ResponsiveContainer>
        </div>}
        {volArr.length>=2&&<div className="chart-container">
          <div className="chart-title">Volumen entrenamiento (series/día)</div>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={volArr}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a"/>
              <XAxis dataKey="fecha" tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:"#555",fontSize:10}} axisLine={false} tickLine={false}/>
              <Tooltip {...tooltipStyle}/>
              <Bar dataKey="series" fill="#4caf50" radius={[4,4,0,0]} name="Series"/>
            </BarChart>
          </ResponsiveContainer>
        </div>}
      </>}

      {innerTab===2&&<>
        <div className="stat-grid">
          <div className="stat-card"><div className="stat-val">{sessions.length}</div><div className="stat-label">Sesiones totales</div></div>
          <div className="stat-card"><div className="stat-val">{sessions.reduce((a,s)=>a+parseInt(s.duracion||0),0)}</div><div className="stat-label">Minutos totales</div></div>
          <div className="stat-card"><div className="stat-val">{sessions.reduce((a,s)=>a+s.ejercicios.filter(e=>e.name).reduce((b,ex)=>b+ex.sets.filter(s=>s.kg||s.reps).length,0),0)}</div><div className="stat-label">Series totales</div></div>
          <div className="stat-card">
            <div className="stat-val" style={{color:deltaPeso!=null?(parseFloat(deltaPeso)<0?"#4caf50":"#e85d2f"):"#555"}}>
              {deltaPeso!=null?(deltaPeso>0?"+":"")+deltaPeso+"kg":"—"}
            </div>
            <div className="stat-label">Cambio de peso</div>
          </div>
        </div>
        <div style={{marginTop:4}}>
          {[
            {icon:"🎯",title:"Primera sesión",desc:"Primer entreno registrado",done:sessions.length>=1},
            {icon:"🔥",title:"Semana consistente",desc:"5 o más entrenos en total",done:sessions.length>=5},
            {icon:"💪",title:"Veterano",desc:"20 sesiones completadas",done:sessions.length>=20},
            {icon:"📊",title:"Tracking activo",desc:"7 días de calorías registradas",done:calorias.length>=7},
            {icon:"⚖️",title:"Control de peso",desc:"5 mediciones registradas",done:medidas.length>=5},
            {icon:"🏆",title:"Un mes de consistencia",desc:"30 sesiones completadas",done:sessions.length>=30},
          ].map((h,i)=>(
            <div key={i} className="card" style={{display:"flex",gap:11,alignItems:"center",marginBottom:9,opacity:h.done?1:0.42}}>
              <span style={{fontSize:20}}>{h.icon}</span>
              <div style={{flex:1}}><div style={{fontWeight:600,fontSize:13}}>{h.title}</div><div style={{fontSize:11,color:"#666",marginTop:1}}>{h.desc}</div></div>
              <span style={{fontSize:15}}>{h.done?"✅":"🔒"}</span>
            </div>
          ))}
        </div>
      </>}
    </div>
  );
}

// ─── NUTRICIÓN ───────────────────────────────────────────────────────
function NutricionTab({profile}) {
  const [plan,setPlan]=useState(null); const [loading,setLoading]=useState(false);
  const gen=async()=>{
    setLoading(true);
    const p=`Plan nutrición para ${profile.name}. Objetivo:${profile.goal}. Peso:${profile.weight}kg. Altura:${profile.height}cm. Edad:${profile.age}. Restricciones:${profile.restrictions||"ninguna"}.
SOLO JSON sin markdown: {"calorias_totales":1900,"proteinas_g":140,"carbos_g":180,"grasas_g":65,"comidas":[{"nombre":"Desayuno","hora":"08:00","kcal":420,"alimentos":["Avena 60g","2 huevos","Plátano"]}],"tips":["Bebe 2.5L agua"]}
5-6 comidas. Alimentos supermercado español.`;
    try{const r=await askClaude([{role:"user",content:p}],buildSystem(profile));setPlan(JSON.parse(r.replace(/```json|```/g,"").trim()));}
    catch{alert("Error. Inténtalo de nuevo.");}
    setLoading(false);
  };
  const imc=(profile.weight/Math.pow(profile.height/100,2)).toFixed(1);
  const bmr=Math.round(10*profile.weight+6.25*profile.height-5*profile.age-161);
  const tdee=Math.round(bmr*1.55);
  return (
    <div className="section">
      <div className="section-title">NUTRICIÓN <span className="badge">IA</span></div>
      <div className="stat-grid" style={{marginBottom:14}}>
        <div className="stat-card"><div className="stat-val">{tdee}</div><div className="stat-label">Kcal mantenimiento</div></div>
        <div className="stat-card"><div className="stat-val">{Math.round(profile.weight*2)}g</div><div className="stat-label">Proteína objetivo</div></div>
        <div className="stat-card"><div className="stat-val">{imc}</div><div className="stat-label">IMC</div></div>
      </div>
      <button className="btn-outline" onClick={gen} disabled={loading} style={{marginBottom:16}}>{loading?"Calculando macros...":plan?"🔄 Regenerar":"🍽️ Generar mi plan nutricional"}</button>
      {plan&&<>
        <div className="stat-grid">
          {[["Calorías",plan.calorias_totales],["Proteínas",plan.proteinas_g+"g"],["Carbos",plan.carbos_g+"g"],["Grasas",plan.grasas_g+"g"]].map(([l,v])=>(
            <div key={l} className="stat-card"><div className="stat-val">{v}</div><div className="stat-label">{l}</div></div>
          ))}
        </div>
        <div style={{margin:"14px 0"}}>{plan.comidas.map((c,i)=>(
          <div key={i} className="meal-card">
            <div className="meal-header"><span className="meal-name">{c.nombre} · {c.hora}</span><span className="meal-kcal">{c.kcal} kcal</span></div>
            <div className="meal-items">{c.alimentos.map((a,j)=><div key={j} className="meal-item">• {a}</div>)}</div>
          </div>
        ))}</div>
        {plan.tips&&<div className="card">{plan.tips.map((t,i)=><div key={i} style={{fontSize:12,color:"#888",padding:"3px 0"}}>💡 {t}</div>)}</div>}
      </>}
      {!plan&&!loading&&<div className="empty"><div className="empty-icon">🥗</div><div className="empty-text">Genera tu plan nutricional con macros adaptados a tu objetivo.</div></div>}
    </div>
  );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────
function DashTab({profile,sessions,calorias,setTab}) {
  const bmr=Math.round(10*profile.weight+6.25*profile.height-5*profile.age-161);
  const tdee=Math.round(bmr*1.55);
  const imc=(profile.weight/Math.pow(profile.height/100,2)).toFixed(1);
  const imcCat=imc<18.5?"Bajo peso":imc<25?"Normal":imc<30?"Sobrepeso":"Obesidad";
  const weekDays=getWeekDays();
  const weekSessions=sessions.filter(s=>weekDays.includes(s.date)).length;
  const todayCal=calorias.find(c=>c.date===today());
  const streak=(()=>{let count=0;let d=new Date();while(true){const ds=d.toISOString().split("T")[0];if(sessions.some(s=>s.date===ds)){count++;d.setDate(d.getDate()-1);}else break;}return count;})();
  return (
    <div className="section">
      <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:20}}>
        <div style={{width:44,height:44,borderRadius:"50%",background:"#e85d2f",display:"flex",alignItems:"center",justifyContent:"center",fontSize:19}}>💪</div>
        <div>
          <div style={{fontFamily:"'Bebas Neue',sans-serif",fontSize:21,letterSpacing:1}}>{profile.name.toUpperCase()}</div>
          <div style={{fontSize:11,color:"#555"}}>{profile.age} años · {profile.goal} · Nivel {profile.level}</div>
        </div>
      </div>
      <div className="section-title">HOY</div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-val" style={{color:todayCal?"#4caf50":"#555"}}>{todayCal?todayCal.kcal:"—"}</div><div className="stat-label">Kcal hoy</div></div>
        <div className="stat-card"><div className="stat-val" style={{color:sessions.some(s=>s.date===today())?"#4caf50":"#555"}}>{sessions.some(s=>s.date===today())?"✓":"—"}</div><div className="stat-label">Entreno hoy</div></div>
        <div className="stat-card"><div className="stat-val">{weekSessions}</div><div className="stat-label">Días esta semana</div></div>
        <div className="stat-card"><div className="stat-val">{streak}</div><div className="stat-label">Racha (días)</div></div>
      </div>
      <div className="section-title" style={{marginTop:6}}>TUS DATOS</div>
      <div className="stat-grid">
        <div className="stat-card"><div className="stat-val">{profile.weight}kg</div><div className="stat-label">Peso</div></div>
        <div className="stat-card"><div className="stat-val">{imc}</div><div className="stat-label">{`IMC·${imcCat}`}</div></div>
        <div className="stat-card"><div className="stat-val">{tdee}</div><div className="stat-label">Kcal mantenimiento</div></div>
        <div className="stat-card"><div className="stat-val">{sessions.length}</div><div className="stat-label">Total sesiones</div></div>
      </div>
      <div className="card" style={{marginTop:6}}>
        <div style={{fontSize:10,fontWeight:700,color:"#e85d2f",textTransform:"uppercase",letterSpacing:1,marginBottom:11}}>Accesos rápidos</div>
        {[["💬 Hablar con el coach",1],["🏋️ Ver mi rutina IA",2],["📓 Apuntar entreno de hoy",3],["🍽️ Plan nutricional",4],["📊 Ver mi progreso",5]].map(([l,t])=>(
          <div key={l} onClick={()=>setTab(t)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #1a1a1a",cursor:"pointer"}}>
            <span style={{fontSize:13}}>{l}</span><span style={{color:"#555",fontSize:12}}>→</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── STORAGE HELPER ──────────────────────────────────────────────────
function usePersistedState(key, defaultValue) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem("apex_" + key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch { return defaultValue; }
  });
  const setAndPersist = (value) => {
    setState(prev => {
      const next = typeof value === "function" ? value(prev) : value;
      try { localStorage.setItem("apex_" + key, JSON.stringify(next)); } catch {}
      return next;
    });
  };
  return [state, setAndPersist];
}

// ─── APP ─────────────────────────────────────────────────────────────
const TABS = ["🏠","💬 Coach","🏋️ Rutinas","📓 Diario","🍽️ Nutrición","📊 Progreso"];

export default function App() {
  const [profile, setProfile]   = usePersistedState("profile", null);
  const [tab,     setTab]       = usePersistedState("tab", 0);
  const [sessions,setSessions]  = usePersistedState("sessions", []);
  const [calorias,setCalorias]  = usePersistedState("calorias", []);

  const saveProfile = (p) => { setProfile(p); setTab(0); };

  return (
    <>
      <style>{FONTS}{css}</style>
      <div className="app">
        {!profile ? <Onboarding onComplete={saveProfile}/> : <>
          <nav className="nav">
            <div className="nav-logo">APEX</div>
            <div className="nav-tabs">
              {TABS.map((t,i)=>(
                <button key={i} className={`nav-tab ${tab===i?"active":""}`} onClick={()=>setTab(i)}>{t}</button>
              ))}
            </div>
            <button onClick={()=>{if(confirm("¿Borrar todos los datos y empezar de nuevo?")){localStorage.clear();window.location.reload();}}}
              style={{background:"transparent",border:"none",color:"#333",fontSize:16,cursor:"pointer",flexShrink:0}} title="Resetear">⚙️</button>
          </nav>
          <div className="main">
            {tab===0&&<DashTab profile={profile} sessions={sessions} calorias={calorias} setTab={setTab}/>}
            {tab===1&&<CoachTab profile={profile}/>}
            {tab===2&&<RutinasTab profile={profile}/>}
            {tab===3&&<DiarioTab profile={profile} sessions={sessions} setSessions={setSessions} calorias={calorias} setCalorias={setCalorias}/>}
            {tab===4&&<NutricionTab profile={profile}/>}
            {tab===5&&<ProgresoTab profile={profile} sessions={sessions} calorias={calorias}/>}
          </div>
        </>}
      </div>
    </>
  );
}
