import { useState, useEffect, useRef, useCallback } from "react";

// ─── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  ravewhite: { name:"RAVER",emoji:"⚡",bg:"#f0ede8",bgCard:"#e8e4de",nav:"rgba(240,237,232,0.97)",border:"#1a1a1a",accent:"#1a1a1a",accent2:"#ff3333",text:"#1a1a1a",textSub:"#666",textInv:"#f0ede8",xpBar:"linear-gradient(90deg,#1a1a1a,#555)",addBtn:"#1a1a1a",addBtnText:"#f0ede8" },
  midnight: { name:"DARK",emoji:"🌑",bg:"#0a0a0a",bgCard:"#141414",nav:"rgba(10,10,10,0.97)",border:"#333",accent:"#e8ff00",accent2:"#ff3333",text:"#f0ede8",textSub:"#555",textInv:"#0a0a0a",xpBar:"linear-gradient(90deg,#e8ff00,#00ffcc)",addBtn:"#e8ff00",addBtnText:"#0a0a0a" },
  pink: { name:"PINK",emoji:"🩷",bg:"#ffe0f0",bgCard:"#ffd0e8",nav:"rgba(255,224,240,0.97)",border:"#1a1a1a",accent:"#1a1a1a",accent2:"#ff0066",text:"#1a1a1a",textSub:"#aa5577",textInv:"#ffe0f0",xpBar:"linear-gradient(90deg,#ff0066,#1a1a1a)",addBtn:"#ff0066",addBtnText:"#fff" },
  acid: { name:"ACID",emoji:"🟢",bg:"#0a1a00",bgCard:"#0d2200",nav:"rgba(10,26,0,0.97)",border:"#39ff14",accent:"#39ff14",accent2:"#ccff00",text:"#39ff14",textSub:"#1a7a00",textInv:"#0a1a00",xpBar:"linear-gradient(90deg,#39ff14,#ccff00)",addBtn:"#39ff14",addBtnText:"#0a1a00" },
  cream: { name:"CREAM",emoji:"🤍",bg:"#faf7f0",bgCard:"#f2ede3",nav:"rgba(250,247,240,0.97)",border:"#c8b89a",accent:"#5c3d1e",accent2:"#8b5e3c",text:"#2d1f0e",textSub:"#9a7a5a",textInv:"#faf7f0",xpBar:"linear-gradient(90deg,#5c3d1e,#c8a06a)",addBtn:"#5c3d1e",addBtnText:"#faf7f0" },
  void: { name:"VOID",emoji:"🟣",bg:"#08001a",bgCard:"#10003a",nav:"rgba(8,0,26,0.97)",border:"#6600ff",accent:"#cc00ff",accent2:"#ff00aa",text:"#f0d0ff",textSub:"#6633aa",textInv:"#08001a",xpBar:"linear-gradient(90deg,#cc00ff,#ff00aa)",addBtn:"#cc00ff",addBtnText:"#08001a" },
};

// ─── SOUND ────────────────────────────────────────────────────────────────────
function useSounds() {
  const ctx = useRef(null);
  const C = () => { if(!ctx.current) ctx.current = new (window.AudioContext||window.webkitAudioContext)(); return ctx.current; };
  const playSuccess = useCallback(()=>{ const c=C();[523,659,784,1047].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=f;o.type="square";g.gain.setValueAtTime(0.12,c.currentTime+i*0.1);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+i*0.1+0.2);o.start(c.currentTime+i*0.1);o.stop(c.currentTime+i*0.1+0.2);}); },[]);
  const playSiren = useCallback(()=>{ const c=C(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type="sawtooth";o.frequency.setValueAtTime(400,c.currentTime);o.frequency.linearRampToValueAtTime(800,c.currentTime+0.3);o.frequency.linearRampToValueAtTime(400,c.currentTime+0.6);o.frequency.linearRampToValueAtTime(800,c.currentTime+0.9);g.gain.setValueAtTime(0.2,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+1.1);o.start(c.currentTime);o.stop(c.currentTime+1.1); },[]);
  const playPoop = useCallback(()=>{ const c=C(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type="sine";o.frequency.setValueAtTime(300,c.currentTime);o.frequency.exponentialRampToValueAtTime(80,c.currentTime+0.4);g.gain.setValueAtTime(0.3,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.5);o.start(c.currentTime);o.stop(c.currentTime+0.5);setTimeout(playSiren,200); },[playSiren]);
  const playTick = useCallback(()=>{ const c=C(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=880;o.type="sine";g.gain.setValueAtTime(0.15,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.08);o.start(c.currentTime);o.stop(c.currentTime+0.08); },[]);
  const playMilestone = useCallback(()=>{ const c=C();[261,329,392,523,659,784,1047].forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.value=f;o.type="triangle";g.gain.setValueAtTime(0.15,c.currentTime+i*0.08);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+i*0.08+0.3);o.start(c.currentTime+i*0.08);o.stop(c.currentTime+i*0.08+0.3);}); },[]);
  const playUndo = useCallback(()=>{ const c=C(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.frequency.setValueAtTime(400,c.currentTime);o.frequency.linearRampToValueAtTime(200,c.currentTime+0.2);g.gain.setValueAtTime(0.1,c.currentTime);g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+0.3);o.start(c.currentTime);o.stop(c.currentTime+0.3); },[]);
  return { playSuccess, playPoop, playTick, playMilestone, playUndo };
}

// ─── CONFETTI ─────────────────────────────────────────────────────────────────
function Confetti({ active, onDone, colors }) {
  const ref=useRef(null);
  useEffect(()=>{
    if(!active)return;
    const canvas=ref.current,ctx=canvas.getContext("2d");
    canvas.width=window.innerWidth;canvas.height=window.innerHeight;
    const c=colors||["#ff3333","#e8ff00","#00ffcc","#fff","#ff00aa"];
    const pieces=Array.from({length:150},()=>({x:Math.random()*canvas.width,y:-20,r:Math.random()*9+4,color:c[Math.floor(Math.random()*c.length)],vx:(Math.random()-0.5)*8,vy:Math.random()*5+2,rot:Math.random()*360,rotV:(Math.random()-0.5)*12,shape:Math.random()>.4?"rect":"circle"}));
    let frame;
    const draw=()=>{ctx.clearRect(0,0,canvas.width,canvas.height);pieces.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.rot+=p.rotV;p.vy+=0.12;ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot*Math.PI/180);ctx.fillStyle=p.color;if(p.shape==="circle"){ctx.beginPath();ctx.arc(0,0,p.r/2,0,Math.PI*2);ctx.fill();}else ctx.fillRect(-p.r/2,-p.r/2,p.r,p.r*1.5);ctx.restore();});if(pieces.some(p=>p.y<canvas.height+30))frame=requestAnimationFrame(draw);else onDone?.();};
    frame=requestAnimationFrame(draw);
    return()=>cancelAnimationFrame(frame);
  },[active]);
  if(!active)return null;
  return <canvas ref={ref} style={{position:"fixed",top:0,left:0,pointerEvents:"none",zIndex:9999}}/>;
}
function Flash({active,color}){if(!active)return null;return <div style={{position:"fixed",inset:0,zIndex:9998,pointerEvents:"none",background:color||"rgba(255,51,51,0.3)",animation:"flashPulse 0.7s ease-out forwards"}}/>;}
function Toast({msg,emoji,show,theme}){const t=THEMES[theme]||THEMES.ravewhite;return <div style={{position:"fixed",top:20,left:"50%",transform:`translateX(-50%) translateY(${show?0:-90}px)`,transition:"transform 0.35s cubic-bezier(.34,1.56,.64,1),opacity 0.25s",opacity:show?1:0,background:t.accent,color:t.textInv,padding:"10px 24px",fontSize:15,fontFamily:"'Black Han Sans',sans-serif",letterSpacing:2,boxShadow:`4px 4px 0 ${t.border}`,zIndex:10000,whiteSpace:"nowrap",border:`2px solid ${t.border}`,textTransform:"uppercase"}}>{emoji} {msg}</div>;}
function MilestoneBanner({show,streak,onDone,theme}){
  const t=THEMES[theme]||THEMES.ravewhite;
  useEffect(()=>{if(show){const id=setTimeout(onDone,3000);return()=>clearTimeout(id);}},[show]);
  if(!show)return null;
  return <div style={{position:"fixed",inset:0,zIndex:9997,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.75)"}}><div style={{background:t.bg,border:`4px solid ${t.accent}`,padding:"40px 52px",textAlign:"center",animation:"milestoneIn 0.4s cubic-bezier(.34,1.56,.64,1)",boxShadow:`8px 8px 0 ${t.accent}`}}><div style={{fontSize:52}}>🏆</div><div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:48,color:t.accent,letterSpacing:4,lineHeight:1,marginTop:8}}>{streak}</div><div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:18,color:t.text,letterSpacing:6,marginTop:4}}>DAY STREAK</div><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:t.textSub,marginTop:8,letterSpacing:2}}>ABSOLUTE LEGEND BEHAVIOR</div></div></div>;
}

// ─── DATA HELPERS ─────────────────────────────────────────────────────────────
const getCount=(h,d)=>{ if(h.repeat<=1)return h.completedDates.includes(d)?1:0; const e=h.completedDates.find(x=>typeof x==="object"&&x.date===d);return e?e.count:0; };
const isDone=(h,d)=>getCount(h,d)>=h.repeat;
const addCount=(arr,d,rep)=>{ if(rep<=1)return[...arr,d]; const e=arr.find(x=>typeof x==="object"&&x.date===d);if(e)return arr.map(x=>(typeof x==="object"&&x.date===d)?{...x,count:Math.min(x.count+1,rep)}:x);return[...arr,{date:d,count:1}]; };
const subCount=(arr,d,rep)=>{ if(rep<=1)return arr.filter(x=>x!==d); return arr.map(x=>(typeof x==="object"&&x.date===d)?{...x,count:Math.max(0,x.count-1)}:x).filter(x=>typeof x!=="object"||x.count>0); };
const totalCompletions=(h)=>{ if(h.repeat<=1)return h.completedDates.length; return h.completedDates.reduce((s,e)=>s+(typeof e==="object"?e.count:1),0); };
const MILESTONES=[3,7,14,21,30,60,100];
const TODAY=()=>{
  const d=new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};
const uid=()=>`${Date.now()}_${Math.random().toString(36).slice(2,7)}`;

// ─── DEFAULT DATA ─────────────────────────────────────────────────────────────
// Structure: categories[] → subcategories[] → habits[]
// habits can also live directly on a category (subcatId: null)
const DEFAULT_DATA = {
  categories: [
    { id:"cat_body", label:"BODY", collapsed:false },
    { id:"cat_health", label:"HEALTH", collapsed:false },
  ],
  subcategories: [
    { id:"sub_meds",  catId:"cat_health", label:"MEDS",  collapsed:false },
    { id:"sub_fiber", catId:"cat_health", label:"FIBER", collapsed:false },
  ],
  habits: [
    { id:"poop",     emoji:"💩",label:"DID YOU POOP?",      catId:"cat_body",   subId:null,       color:"#8B4513",special:"poop",xp:20,streak:0,repeat:1,completedDates:[],isDefault:true },
    { id:"vitamins", emoji:"💊",label:"MORNING VITAMINS",   catId:"cat_health", subId:"sub_meds", color:"#cc0044",special:null, xp:15,streak:0,repeat:1,completedDates:[],isDefault:true },
    { id:"nightmeds",emoji:"🌙",label:"NIGHTTIME MEDS",     catId:"cat_health", subId:"sub_meds", color:"#4400cc",special:null, xp:15,streak:0,repeat:1,completedDates:[],isDefault:true },
    { id:"fiber",    emoji:"🌾",label:"FIBER DOSE",         catId:"cat_health", subId:"sub_fiber",color:"#2a6600",special:null, xp:10,streak:0,repeat:3,completedDates:[],isDefault:true },
  ],
};

const STORAGE_KEY="habittracker_v5";
const GDRIVE_FILENAME="habit-mode-backup.json";
const load=async()=>{try{const r=localStorage.getItem(STORAGE_KEY);return r?JSON.parse(r):null;}catch{return null;}};
const save=async(s)=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(s));}catch{}};

// ─── EXPORT / IMPORT ─────────────────────────────────────────────────────────
function exportData(state) {
  const blob = new Blob([JSON.stringify({...state, exportedAt: new Date().toISOString()}, null, 2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `habit-mode-backup-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(file, onSuccess, onError) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (!data.habits || !data.cats) { onError("Invalid backup file"); return; }
      onSuccess(data);
    } catch { onError("Could not read file"); }
  };
  reader.readAsText(file);
}



// ─── XP BAR ───────────────────────────────────────────────────────────────────
function XPBar({xp,theme}){
  const t=THEMES[theme]||THEMES.ravewhite,level=Math.floor(xp/100)+1,prog=xp%100;
  return <div style={{padding:"14px 18px",background:t.bgCard,marginBottom:14,border:`2px solid ${t.border}`,boxShadow:`3px 3px 0 ${t.border}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:16,color:t.accent,letterSpacing:3}}>LVL {level}</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,color:t.textSub,letterSpacing:2}}>{xp} XP · {prog}/100</span></div><div style={{background:t.bg,height:10,border:`1.5px solid ${t.border}`,overflow:"hidden"}}><div style={{width:`${prog}%`,height:"100%",background:t.xpBar,transition:"width 0.8s cubic-bezier(.34,1.56,.64,1)"}}/></div></div>;
}

// ─── REPEAT DRAWER ────────────────────────────────────────────────────────────
function RepeatDrawer({habit,todayStr,count,onIncrement,onDecrement,onRename,onClose,theme}){
  const t=THEMES[theme]||THEMES.ravewhite;
  const [editing,setEditing]=useState(false);
  const [editVal,setEditVal]=useState(habit.label);
  const inputRef=useRef(null);
  const commit=()=>{if(editVal.trim())onRename(habit.id,editVal.trim().toUpperCase());setEditing(false);};
  const dots=Array.from({length:habit.repeat},(_,i)=>i<count);
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:t.bg,width:"100%",maxWidth:480,border:`3px solid ${t.border}`,borderBottom:"none",boxShadow:`-6px -6px 0 ${t.border}`}} onClick={e=>e.stopPropagation()}>
        <div style={{background:habit.color,padding:"20px 20px 16px",borderBottom:`2px solid ${t.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <span style={{fontSize:36}}>{habit.emoji}</span>
            <div style={{flex:1}}>
              {editing?<input ref={inputRef} value={editVal} onChange={e=>setEditVal(e.target.value.toUpperCase())} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape")setEditing(false);}} style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:20,letterSpacing:3,color:"#fff",background:"transparent",border:"none",borderBottom:"2px solid rgba(255,255,255,0.5)",outline:"none",width:"100%"}} autoFocus/>
              :<div onClick={()=>{setEditVal(habit.label);setEditing(true);setTimeout(()=>inputRef.current?.focus(),50);}} style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:20,color:"#fff",letterSpacing:3,cursor:"text"}}>{habit.label}<span style={{fontSize:11,marginLeft:8,opacity:0.6}}>TAP TO EDIT</span></div>}
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,color:"rgba(255,255,255,0.7)",marginTop:2,letterSpacing:2}}>🔥 {habit.streak} DAY STREAK · {habit.xp} XP EACH</div>
            </div>
          </div>
        </div>
        <div style={{padding:"24px"}}>
          <div style={{display:"flex",justifyContent:"center",gap:12,marginBottom:22}}>
            {dots.map((filled,i)=><div key={i} style={{width:48,height:48,border:`3px solid ${t.border}`,background:filled?habit.color:t.bgCard,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,boxShadow:filled?`3px 3px 0 ${t.border}`:`1px 1px 0 ${t.border}`,transition:"all 0.2s cubic-bezier(.34,1.56,.64,1)",transform:filled?"scale(1.05)":"scale(1)"}}>{filled?"✓":<span style={{color:t.textSub,fontSize:14,fontFamily:"'Black Han Sans',sans-serif"}}>{i+1}</span>}</div>)}
          </div>
          <div style={{textAlign:"center",marginBottom:22}}>
            <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:64,color:count>=habit.repeat?habit.color:t.text,letterSpacing:4,lineHeight:1,transition:"color 0.2s"}}>{count}<span style={{fontSize:28,color:t.textSub}}>/{habit.repeat}</span></div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:t.textSub,letterSpacing:3,marginTop:4}}>{count===0?"NOT STARTED":count>=habit.repeat?"ALL DONE 🎉":`${habit.repeat-count} MORE TO GO`}</div>
          </div>
          <div style={{display:"flex",gap:10,marginBottom:12}}>
            <button onClick={()=>onDecrement(habit.id)} disabled={count<=0} style={{flex:1,padding:"16px",border:`2px solid ${t.border}`,background:count>0?t.bgCard:"transparent",color:count>0?t.text:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:24,cursor:count>0?"pointer":"default",boxShadow:count>0?`2px 2px 0 ${t.border}`:"none",opacity:count>0?1:0.3,transition:"all 0.15s"}}>−</button>
            <button onClick={()=>onIncrement(habit.id)} disabled={count>=habit.repeat} style={{flex:2,padding:"16px",border:`2px solid ${t.border}`,background:count<habit.repeat?t.addBtn:"transparent",color:count<habit.repeat?t.addBtnText:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:16,cursor:count<habit.repeat?"pointer":"default",boxShadow:count<habit.repeat?`3px 3px 0 ${t.border}`:"none",opacity:count<habit.repeat?1:0.4,transition:"all 0.15s",letterSpacing:3}}>{count>=habit.repeat?"COMPLETE ✓":"LOG ONE +"}</button>
          </div>
          <button onClick={onClose} style={{width:"100%",padding:"12px",border:`2px solid ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,cursor:"pointer",letterSpacing:3,textTransform:"uppercase"}}>CLOSE</button>
        </div>
      </div>
    </div>
  );
}

// ─── HABIT ROW ────────────────────────────────────────────────────────────────
function HabitRow({habit,onComplete,onUndoOne,onDelete,onRename,todayStr,theme,onOpenDrawer}){
  const t=THEMES[theme]||THEMES.ravewhite;
  const count=getCount(habit,todayStr),done=isDone(habit,todayStr),isRep=habit.repeat>1;
  const [editing,setEditing]=useState(false);
  const [editVal,setEditVal]=useState(habit.label);
  const [bounce,setBounce]=useState(false);
  const inputRef=useRef(null);
  const handleTap=()=>{ if(editing)return; if(isRep){onOpenDrawer(habit.id);return;} if(done)return; setBounce(true);setTimeout(()=>setBounce(false),300);onComplete(habit.id); };
  const startEdit=e=>{e.stopPropagation();setEditVal(habit.label);setEditing(true);setTimeout(()=>inputRef.current?.focus(),50);};
  const commit=()=>{if(editVal.trim())onRename(habit.id,editVal.trim().toUpperCase());setEditing(false);};
  const pct=isRep?count/habit.repeat:(done?1:0);
  return(
    <div style={{display:"flex",alignItems:"stretch",border:`1.5px solid ${t.border}`,marginBottom:6,background:done?habit.color:t.bg,transition:"all 0.2s cubic-bezier(.34,1.56,.64,1)",transform:bounce?"scale(1.03)":"scale(1)",boxShadow:done?`3px 3px 0 ${t.border}`:`2px 2px 0 ${t.border}`,cursor:"pointer",position:"relative",overflow:"hidden"}}
      onClick={handleTap}>
      {/* partial fill bg */}
      {isRep&&!done&&pct>0&&<div style={{position:"absolute",top:0,left:0,bottom:0,width:`${pct*100}%`,background:`${habit.color}22`,borderRight:`1.5px solid ${habit.color}55`,pointerEvents:"none",transition:"width 0.4s ease"}}/>}
      {/* color pip */}
      <div style={{width:4,background:done?"rgba(255,255,255,0.4)":isRep&&count>0?habit.color:t.border,flexShrink:0,transition:"background 0.3s"}}/>
      <div style={{padding:"11px 12px",display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0,position:"relative"}}>
        <span style={{fontSize:22,flexShrink:0}}>{habit.emoji}</span>
        <div style={{flex:1,minWidth:0}}>
          {editing
            ?<input ref={inputRef} value={editVal} onChange={e=>setEditVal(e.target.value.toUpperCase())} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape")setEditing(false);}} onClick={e=>e.stopPropagation()} style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:13,letterSpacing:2,color:done?"#fff":t.accent,background:"transparent",border:"none",borderBottom:`1.5px solid ${done?"rgba(255,255,255,0.5)":t.accent}`,outline:"none",width:"100%"}}/>
            :<div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:13,color:done?"#fff":t.text,letterSpacing:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{habit.label}</div>}
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:done?"rgba(255,255,255,0.65)":t.textSub,letterSpacing:1,display:"flex",gap:6,alignItems:"center",marginTop:2}}>
            <span>🔥{habit.streak}</span>
            {isRep&&<span style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:done?"rgba(255,255,255,0.9)":count>0?habit.color:t.textSub,background:done?"rgba(255,255,255,0.2)":count>0?`${habit.color}22`:"transparent",padding:"0 6px",border:`1px solid ${done?"rgba(255,255,255,0.3)":count>0?habit.color:t.border}`}}>{count}/{habit.repeat}</span>}
            {!isRep&&<span>+{habit.xp}XP</span>}
          </div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",borderLeft:`1.5px solid ${done?"rgba(255,255,255,0.2)":t.border}`,flexShrink:0,position:"relative"}}>
        {done
          ?<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"8px 12px",gap:3}}><span style={{fontSize:18}}>✅</span><button onClick={e=>{e.stopPropagation();onUndoOne(habit.id);}} style={{fontSize:9,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1,background:"rgba(0,0,0,0.2)",color:"#fff",border:"none",padding:"1px 6px",cursor:"pointer"}}>UNDO</button></div>
          :<div style={{display:"flex",flexDirection:"column",height:"100%"}}>
            <button onClick={e=>{e.stopPropagation();startEdit(e);}} style={{background:"transparent",border:"none",borderBottom:`1px solid ${t.border}`,color:t.textSub,cursor:"pointer",fontSize:10,padding:"8px 10px",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1,flex:1}}>EDIT</button>
            {!habit.isDefault
              ?<button onClick={e=>{e.stopPropagation();onDelete(habit.id);}} style={{background:"transparent",border:"none",color:t.textSub,cursor:"pointer",fontSize:10,padding:"8px 10px",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1,flex:1}}>DEL</button>
              :<div style={{padding:"8px 10px",fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:t.accent,letterSpacing:1,flex:1,display:"flex",alignItems:"center",justifyContent:"center"}}>{isRep?"→":"YES"}</div>}
          </div>}
      </div>
    </div>
  );
}

// ─── SUBCATEGORY BLOCK ────────────────────────────────────────────────────────
function SubcatBlock({subcat,habits,todayStr,theme,onComplete,onUndoOne,onDelete,onRename,onOpenDrawer,onDeleteSubcat,onRenameSubcat}){
  const t=THEMES[theme]||THEMES.ravewhite;
  const [collapsed,setCollapsed]=useState(subcat.collapsed||false);
  const [editing,setEditing]=useState(false);
  const [editVal,setEditVal]=useState(subcat.label);
  const inputRef=useRef(null);
  const doneHere=habits.filter(h=>isDone(h,todayStr)).length;
  const allDone=doneHere===habits.length&&habits.length>0;
  const commit=()=>{if(editVal.trim())onRenameSubcat(subcat.id,editVal.trim().toUpperCase());setEditing(false);};
  return(
    <div style={{marginBottom:8}}>
      {/* Subcat header */}
      <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:collapsed?0:4}}>
        <button onClick={()=>setCollapsed(c=>!c)} style={{background:"transparent",border:`1px solid ${t.border}`,borderRight:"none",padding:"5px 8px",cursor:"pointer",fontFamily:"'Black Han Sans',sans-serif",fontSize:11,color:t.textSub,letterSpacing:1,flexShrink:0}}>{collapsed?"▶":"▼"}</button>
        {editing
          ?<input ref={inputRef} value={editVal} onChange={e=>setEditVal(e.target.value.toUpperCase())} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape")setEditing(false);}} style={{flex:1,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,letterSpacing:2,color:t.accent,background:"transparent",border:`1px solid ${t.accent}`,padding:"5px 8px",outline:"none"}} autoFocus/>
          :<div onClick={()=>setCollapsed(c=>!c)} style={{flex:1,fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.textSub,letterSpacing:3,padding:"5px 10px",border:`1px solid ${t.border}`,borderRight:"none",cursor:"pointer",textTransform:"uppercase",display:"flex",alignItems:"center",gap:8}}>
            {subcat.label}
            {allDone&&<span style={{fontSize:10,color:t.accent}}>✓ ALL</span>}
            {!allDone&&habits.length>0&&<span style={{fontSize:10,color:t.textSub}}>{doneHere}/{habits.length}</span>}
          </div>}
        <button onClick={()=>{setEditVal(subcat.label);setEditing(true);setTimeout(()=>inputRef.current?.focus(),50);}} style={{background:"transparent",border:`1px solid ${t.border}`,borderRight:"none",padding:"5px 8px",cursor:"pointer",fontSize:10,color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1,flexShrink:0}}>EDT</button>
        <button onClick={()=>onDeleteSubcat(subcat.id)} style={{background:"transparent",border:`1px solid ${t.border}`,padding:"5px 8px",cursor:"pointer",fontSize:10,color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1,flexShrink:0}}>×</button>
      </div>
      {!collapsed&&(
        <div style={{paddingLeft:12,borderLeft:`2px solid ${t.border}`}}>
          {habits.map(h=><HabitRow key={h.id} habit={h} onComplete={onComplete} onUndoOne={onUndoOne} onDelete={onDelete} onRename={onRename} todayStr={todayStr} theme={theme} onOpenDrawer={onOpenDrawer}/>)}
        </div>
      )}
    </div>
  );
}

// ─── CATEGORY BLOCK ──────────────────────────────────────────────────────────
function CategoryBlock({cat,subcats,habits,todayStr,theme,onComplete,onUndoOne,onDeleteHabit,onRenameHabit,onOpenDrawer,onDeleteCat,onRenameCat,onAddSubcat,onDeleteSubcat,onRenameSubcat,onAddHabit}){
  const t=THEMES[theme]||THEMES.ravewhite;
  const [collapsed,setCollapsed]=useState(cat.collapsed||false);
  const [editing,setEditing]=useState(false);
  const [editVal,setEditVal]=useState(cat.label);
  const [addingSubcat,setAddingSubcat]=useState(false);
  const [newSubcatVal,setNewSubcatVal]=useState("");
  const inputRef=useRef(null);
  const newSubcatRef=useRef(null);

  // habits directly in category (no subcat)
  const directHabits=habits.filter(h=>h.catId===cat.id&&!h.subId);
  const catSubcats=subcats.filter(s=>s.catId===cat.id);
  const allHabits=habits.filter(h=>h.catId===cat.id);
  const doneCount=allHabits.filter(h=>isDone(h,todayStr)).length;
  const allDone=doneCount===allHabits.length&&allHabits.length>0;

  const commit=()=>{if(editVal.trim())onRenameCat(cat.id,editVal.trim().toUpperCase());setEditing(false);};
  const commitNewSubcat=()=>{
    const v=newSubcatVal.trim();
    if(v){onAddSubcat({id:uid(),catId:cat.id,label:v.toUpperCase(),collapsed:false});}
    setNewSubcatVal("");setAddingSubcat(false);
  };

  return(
    <div style={{marginBottom:14,border:`2px solid ${t.border}`,boxShadow:`3px 3px 0 ${t.border}`}}>
      {/* Category header */}
      <div style={{background:t.bgCard,display:"flex",alignItems:"center",borderBottom:collapsed?`none`:`2px solid ${t.border}`}}>
        <button onClick={()=>setCollapsed(c=>!c)} style={{background:"transparent",border:"none",borderRight:`2px solid ${t.border}`,padding:"12px 14px",cursor:"pointer",fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:t.textSub}}>{collapsed?"▶":"▼"}</button>
        {editing
          ?<input ref={inputRef} value={editVal} onChange={e=>setEditVal(e.target.value.toUpperCase())} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape")setEditing(false);}} style={{flex:1,fontFamily:"'Black Han Sans',sans-serif",fontSize:18,letterSpacing:4,color:t.accent,background:"transparent",border:"none",borderBottom:`2px solid ${t.accent}`,outline:"none",padding:"12px 14px"}} autoFocus/>
          :<div onClick={()=>setCollapsed(c=>!c)} style={{flex:1,fontFamily:"'Black Han Sans',sans-serif",fontSize:18,color:t.text,letterSpacing:4,padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
            {cat.label}
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:allDone?t.accent:t.textSub,letterSpacing:2,fontWeight:400}}>
              {allDone?"ALL DONE ✓":`${doneCount}/${allHabits.length}`}
            </span>
          </div>}
        <button onClick={()=>{setEditVal(cat.label);setEditing(true);setTimeout(()=>inputRef.current?.focus(),50);}} style={{background:"transparent",border:"none",borderLeft:`2px solid ${t.border}`,padding:"12px 10px",cursor:"pointer",fontSize:11,color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1}}>EDT</button>
        <button onClick={()=>onDeleteCat(cat.id)} style={{background:"transparent",border:"none",borderLeft:`2px solid ${t.border}`,padding:"12px 12px",cursor:"pointer",fontSize:16,color:t.textSub}}>×</button>
      </div>

      {!collapsed&&(
        <div style={{padding:"12px 12px 6px"}}>
          {/* Subcategories */}
          {catSubcats.map(sub=>{
            const subHabits=habits.filter(h=>h.subId===sub.id);
            return <SubcatBlock key={sub.id} subcat={sub} habits={subHabits} todayStr={todayStr} theme={theme}
              onComplete={onComplete} onUndoOne={onUndoOne} onDelete={onDeleteHabit} onRename={onRenameHabit} onOpenDrawer={onOpenDrawer}
              onDeleteSubcat={onDeleteSubcat} onRenameSubcat={onRenameSubcat}/>;
          })}

          {/* Direct habits */}
          {directHabits.map(h=><HabitRow key={h.id} habit={h} onComplete={onComplete} onUndoOne={onUndoOne} onDelete={onDeleteHabit} onRename={onRenameHabit} todayStr={todayStr} theme={theme} onOpenDrawer={onOpenDrawer}/>)}

          {/* Action buttons */}
          <div style={{display:"flex",gap:6,marginTop:6,marginBottom:4}}>
            {addingSubcat
              ?<div style={{display:"flex",flex:1,gap:6}}>
                <input ref={newSubcatRef} value={newSubcatVal} onChange={e=>setNewSubcatVal(e.target.value.toUpperCase())}
                  onKeyDown={e=>{if(e.key==="Enter")commitNewSubcat();if(e.key==="Escape"){setAddingSubcat(false);setNewSubcatVal("");}}}
                  placeholder="SUBCATEGORY NAME" autoFocus
                  style={{flex:1,background:t.bg,border:`1.5px solid ${t.accent}`,padding:"8px 10px",color:t.text,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,letterSpacing:2,outline:"none"}}/>
                <button onClick={commitNewSubcat} style={{padding:"8px 12px",border:`1.5px solid ${t.border}`,background:t.addBtn,color:t.addBtnText,fontFamily:"'Black Han Sans',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:1,boxShadow:`2px 2px 0 ${t.border}`}}>ADD</button>
                <button onClick={()=>{setAddingSubcat(false);setNewSubcatVal("");}} style={{padding:"8px 12px",border:`1.5px solid ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,cursor:"pointer"}}>✕</button>
              </div>
              :<>
                <button onClick={()=>{setAddingSubcat(true);setTimeout(()=>newSubcatRef.current?.focus(),50);}} style={{flex:1,padding:"8px",border:`1.5px dashed ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:2}}>+ SUBCATEGORY</button>
                <button onClick={()=>onAddHabit(cat.id,null)} style={{flex:1,padding:"8px",border:`1.5px dashed ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:2}}>+ HABIT</button>
              </>}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ADD HABIT MODAL ──────────────────────────────────────────────────────────
const EMOJIS=["💪","🧘","🏃","🥗","💧","😴","📝","🎸","🧹","🛁","🧠","❤️","🌅","✍️","🎯","🎮","🎨","🧪","📸","🚶","🦷","🫖","🥤","📞","💼","📧","🗂️","🔬","🎵","🏋️"];
function AddHabitModal({catId,subId,cats,subcats,onAdd,onClose,theme}){
  const t=THEMES[theme]||THEMES.ravewhite;
  const [label,setLabel]=useState("");
  const [emoji,setEmoji]=useState("💪");
  const [xp,setXp]=useState(10);
  const [repeat,setRepeat]=useState(1);
  const [selectedCat,setSelectedCat]=useState(catId||cats[0]?.id||"");
  const [selectedSub,setSelectedSub]=useState(subId||"none");
  const availSubs=subcats.filter(s=>s.catId===selectedCat);
  const inp={width:"100%",background:t.bg,border:`2px solid ${t.border}`,padding:"11px 13px",color:t.text,fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,outline:"none",boxSizing:"border-box",marginBottom:10};
  const sel={...inp,appearance:"none",cursor:"pointer"};
  const submit=()=>{
    if(!label.trim()||!selectedCat)return;
    onAdd({id:uid(),emoji,label:label.trim().toUpperCase(),catId:selectedCat,subId:selectedSub==="none"?null:selectedSub,color:"#6c5ce7",special:null,xp,streak:0,repeat,completedDates:[],isDefault:false});
    onClose();
  };
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:t.bg,padding:24,width:"100%",maxWidth:480,border:`3px solid ${t.border}`,borderBottom:"none",boxShadow:`-6px -6px 0 ${t.border}`,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:22,color:t.text,marginBottom:16,letterSpacing:4}}>NEW HABIT</div>
        <input style={inp} placeholder="HABIT NAME" value={label} onChange={e=>setLabel(e.target.value)} autoFocus/>
        {/* Category select */}
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginBottom:4}}>CATEGORY:</div>
        <select style={sel} value={selectedCat} onChange={e=>{setSelectedCat(e.target.value);setSelectedSub("none");}}>
          {cats.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        {/* Subcategory select */}
        {availSubs.length>0&&<>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginBottom:4}}>SUBCATEGORY (OPTIONAL):</div>
          <select style={sel} value={selectedSub} onChange={e=>setSelectedSub(e.target.value)}>
            <option value="none">NONE</option>
            {availSubs.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </>}
        {/* Emoji */}
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginBottom:6}}>EMOJI:</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
          {EMOJIS.map(e=><button key={e} onClick={()=>setEmoji(e)} style={{fontSize:17,background:emoji===e?t.accent:t.bgCard,border:`2px solid ${t.border}`,width:36,height:36,cursor:"pointer",boxShadow:emoji===e?`2px 2px 0 ${t.border}`:"none",color:emoji===e?t.textInv:"inherit"}}>{e}</button>)}
        </div>
        {/* Repeat */}
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginBottom:6}}>TIMES PER DAY: <strong style={{color:t.accent,fontSize:15}}>{repeat}×</strong></div>
        <div style={{display:"flex",gap:5,marginBottom:12}}>
          {[1,2,3,4,5,6].map(n=><button key={n} onClick={()=>setRepeat(n)} style={{flex:1,padding:"9px 0",border:`2px solid ${t.border}`,background:repeat===n?t.accent:t.bgCard,color:repeat===n?t.textInv:t.text,fontFamily:"'Black Han Sans',sans-serif",fontSize:13,cursor:"pointer",boxShadow:repeat===n?`2px 2px 0 ${t.border}`:"none"}}>{n}×</button>)}
        </div>
        {/* XP */}
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginBottom:5}}>XP PER REP: <strong style={{color:t.accent}}>{xp}</strong></div>
        <input type="range" min={5} max={50} step={5} value={xp} onChange={e=>setXp(Number(e.target.value))} style={{width:"100%",marginBottom:14,accentColor:t.accent}}/>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,padding:13,border:`2px solid ${t.border}`,background:"transparent",color:t.text,fontFamily:"'Black Han Sans',sans-serif",fontSize:14,cursor:"pointer",letterSpacing:3}}>CANCEL</button>
          <button onClick={submit} style={{flex:2,padding:13,border:`2px solid ${t.border}`,background:t.addBtn,color:t.addBtnText,fontFamily:"'Black Han Sans',sans-serif",fontSize:14,cursor:"pointer",letterSpacing:3,boxShadow:`3px 3px 0 ${t.border}`}}>ADD HABIT</button>
        </div>
      </div>
    </div>
  );
}

// ─── AI HELPERS ──────────────────────────────────────────────────────────────
async function claudeJSON(prompt) {
  try {
    // Calls our own Vercel serverless proxy at /api/claude
    // which forwards to Anthropic server-side (avoids CORS)
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt + "\n\nRespond ONLY with valid JSON. No markdown fences, no explanation, no extra text — just the raw JSON." }]
      })
    });
    const data = await res.json();
    const raw = data?.content?.[0]?.text?.trim() || "";
    const clean = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/\s*```$/i, "").trim();
    return JSON.parse(clean);
  } catch { return null; }
}

async function fetchRichMeta(url, type) {
  const isLetterboxd = url.includes("letterboxd") || url.includes("boxd.it");
  const isGoodreads = url.includes("goodreads") || url.includes("gr.net");
  const site = isLetterboxd ? "Letterboxd" : isGoodreads ? "Goodreads" : (type==="movie" ? "Letterboxd" : "Goodreads");

  // Step 1: fetch the real page server-side (follows redirects for short links)
  let pageData = null;
  try {
    const r = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "fetch-url", url })
    });
    pageData = await r.json();
  } catch {}

  // Build context for Claude from what we fetched
  const pageContext = pageData ? `
Final URL after redirects: ${pageData.finalUrl || url}
Page title tag: ${pageData.title || "none"}
OG title: ${pageData.ogTitle || "none"}
OG description: ${pageData.ogDesc || "none"}
Page text snippet: ${pageData.bodySnippet || "none"}
` : `URL: ${url}`;

  return claudeJSON(`Extract metadata for this ${site} ${type==="movie"?"film":"book"} page.
${pageContext}
Return JSON: { "title": string, "subtitle": string (${type==="movie"?"director":"author"} name), "year": string|null, "rating": string|null, "genre": string|null, "source": "${site}" }
Use the page content to extract accurate metadata. Title and subtitle are required.`);
}

async function searchItems(query, type) {
  const res = await claudeJSON(`Search for ${type==="movie"?"movies":"books"} matching: "${query}"

Rules:
- Return up to 10 results, ordered by relevance to the search query
- Include EXACT title matches first, then close matches, then related results
- Include both well-known AND obscure titles if they match the query
- For books: include the exact author name as subtitle
- For movies: include the director as subtitle
- Include real ratings where you know them (e.g. IMDb for movies, Goodreads avg for books)
- If the query looks like a specific title, prioritize exact and partial title matches
- If the query looks like an author or director name, return their works

Return a JSON array: [{ "title": string, "subtitle": string, "year": string, "rating": string, "genre": string }]
Return ONLY the JSON array, nothing else.`);
  return Array.isArray(res) ? res : [];
}

// ─── LIST ITEM ────────────────────────────────────────────────────────────────
function ListItem({item,onToggle,onDelete,onRename,type,theme}){
  const t=THEMES[theme]||THEMES.ravewhite;
  const [editing,setEditing]=useState(false);
  const [editVal,setEditVal]=useState(item.title);
  const ref=useRef(null);
  const commit=()=>{if(editVal.trim())onRename(item.id,editVal.trim());setEditing(false);};
  const hasExtra=item.subtitle||item.year||item.rating||item.genre;
  return(
    <div style={{background:item.done?t.bgCard:t.bg,border:`2px solid ${t.border}`,marginBottom:8,display:"flex",alignItems:"stretch",boxShadow:`2px 2px 0 ${t.border}`,overflow:"hidden"}}>
      {/* Cover placeholder */}
      <div style={{width:52,flexShrink:0,background:item.done?t.border:`${t.accent}18`,borderRight:`2px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",position:"relative"}}>
        <span style={{fontSize:20,opacity:item.done?0.3:0.6}}>{type==="movie"?"🎬":"📖"}</span>
        {item.source&&<div style={{position:"absolute",bottom:0,left:0,right:0,background:"rgba(0,0,0,0.65)",fontSize:7,fontFamily:"'Barlow Condensed',sans-serif",color:"#fff",textAlign:"center",letterSpacing:1,padding:"2px 0"}}>{item.source.toUpperCase()}</div>}
      </div>
      {/* Content */}
      <div style={{flex:1,padding:"10px 12px",minWidth:0}}>
        {editing
          ?<input ref={ref} value={editVal} onChange={e=>setEditVal(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape")setEditing(false);}} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,letterSpacing:1,color:t.accent,background:"transparent",border:"none",borderBottom:`2px solid ${t.accent}`,outline:"none",width:"100%"}} autoFocus/>
          :<div onClick={()=>{setEditVal(item.title);setEditing(true);setTimeout(()=>ref.current?.focus(),50);}} style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:13,color:item.done?t.textSub:t.text,textDecoration:item.done?"line-through":"none",letterSpacing:2,cursor:"text",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.title}</div>}
        {hasExtra&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:1,marginTop:3,display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
          {item.subtitle&&<span>{item.subtitle}</span>}
          {item.year&&<span>{item.year}</span>}
          {item.rating&&<span style={{color:t.accent}}>★ {item.rating}</span>}
          {item.genre&&<span style={{background:`${t.accent}18`,padding:"0 5px",border:`1px solid ${t.border}`}}>{item.genre}</span>}
        </div>}
        {item.url&&<a href={item.url} target="_blank" rel="noopener noreferrer" style={{fontSize:10,color:t.accent2,fontFamily:"'Barlow Condensed',sans-serif",textDecoration:"none",display:"block",marginTop:2,letterSpacing:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>↗ {item.url}</a>}
        {item.note&&<div style={{fontSize:10,color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",marginTop:2,letterSpacing:1,fontStyle:"italic"}}>{item.note}</div>}
      </div>
      {/* Actions */}
      <div style={{display:"flex",flexDirection:"column",borderLeft:`2px solid ${t.border}`,flexShrink:0}}>
        <button onClick={()=>onToggle(item.id)} style={{flex:1,width:40,background:item.done?t.accent:"transparent",cursor:"pointer",border:"none",borderBottom:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:item.done?t.textInv:t.textSub,fontFamily:"'Black Han Sans',sans-serif"}}>{item.done?"✓":"○"}</button>
        <button onClick={()=>onDelete(item.id)} style={{flex:1,width:40,background:"none",border:"none",color:t.textSub,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
      </div>
    </div>
  );
}

// ─── MANUAL ADD FORM ──────────────────────────────────────────────────────────
function ManualAddForm({type,onAdd,theme}){
  const t=THEMES[theme]||THEMES.ravewhite;
  const [title,setTitle]=useState("");
  const [note,setNote]=useState("");
  const inp={width:"100%",background:t.bg,border:`2px solid ${t.border}`,padding:"10px 12px",color:t.text,fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,outline:"none",boxSizing:"border-box",marginBottom:8};
  const submit=()=>{if(!title.trim())return;onAdd({title:title.trim(),note:note.trim(),subtitle:null,year:null,rating:null,genre:null,source:null,url:""});};
  return(
    <div>
      <input style={inp} placeholder="TITLE" value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} autoFocus/>
      <input style={{...inp,marginBottom:10}} placeholder="NOTE (OPTIONAL)" value={note} onChange={e=>setNote(e.target.value)}/>
      <button onClick={submit} disabled={!title.trim()} style={{width:"100%",padding:"11px",border:`2px solid ${t.border}`,background:title.trim()?t.addBtn:"transparent",color:title.trim()?t.addBtnText:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:13,cursor:title.trim()?"pointer":"default",letterSpacing:3,boxShadow:title.trim()?`2px 2px 0 ${t.border}`:"none",opacity:title.trim()?1:0.45}}>ADD MANUALLY</button>
    </div>
  );
}

// ─── SHORT LINK FORM ─────────────────────────────────────────────────────────
function ShortLinkForm({type,source,url,note,setNote,onAdd,theme}){
  const t=THEMES[theme]||THEMES.ravewhite;
  const [title,setTitle]=useState("");
  const [searching,setSearching]=useState(false);
  const inp={width:"100%",background:t.bg,border:`2px solid ${t.border}`,padding:"10px 12px",color:t.text,fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,outline:"none",boxSizing:"border-box",marginBottom:8};

  const doSearch=async()=>{
    if(!title.trim())return;
    setSearching(true);
    const res=await searchItems(title.trim(),type);
    setSearching(false);
    if(res.length){
      // take top result and merge with the short URL
      onAdd({...res[0],source,url});
    } else {
      onAdd({title:title.trim(),subtitle:null,year:null,rating:null,genre:null,source,url});
    }
  };

  return(
    <div style={{border:`2px solid ${t.accent}`,boxShadow:`3px 3px 0 ${t.accent}`,marginBottom:10}}>
      <div style={{background:`${t.accent}18`,borderBottom:`2px solid ${t.accent}`,padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:14}}>{source==="Letterboxd"?"🎬":"📚"}</span>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.accent,letterSpacing:2}}>{source||"SHORT LINK"} DETECTED — SHORT LINKS CAN'T BE READ DIRECTLY</span>
      </div>
      <div style={{padding:"14px"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginBottom:6}}>TYPE THE TITLE AND WE'LL LOOK IT UP:</div>
        <input style={inp} placeholder={type==="movie"?"FILM TITLE...":"BOOK TITLE..."} value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()} autoFocus/>
        <input style={{...inp,marginBottom:12}} placeholder="NOTE (OPTIONAL)" value={note} onChange={e=>setNote(e.target.value)}/>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:1,marginBottom:10}}>
          The {source||"short"} link will be saved with the entry. ↗ {url}
        </div>
        <button onClick={doSearch} disabled={!title.trim()||searching} style={{width:"100%",padding:"12px",border:`2px solid ${t.border}`,background:title.trim()?t.accent:"transparent",color:title.trim()?t.textInv:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:14,cursor:title.trim()?"pointer":"default",letterSpacing:3,boxShadow:title.trim()?`2px 2px 0 ${t.border}`:"none",opacity:title.trim()?1:0.45}}>
          {searching?"LOOKING UP...":"FIND & ADD →"}
        </button>
      </div>
    </div>
  );
}

// ─── IMPORT MODAL ─────────────────────────────────────────────────────────────
function AddModal({type,onAdd,onClose,theme}){
  const t=THEMES[theme]||THEMES.ravewhite;
  const [mode,setMode]=useState("url");
  const [urlVal,setUrlVal]=useState("");
  const [searchVal,setSearchVal]=useState("");
  const [note,setNote]=useState("");
  const [status,setStatus]=useState("idle");
  const [preview,setPreview]=useState(null);
  const [results,setResults]=useState([]);
  const inp={width:"100%",background:t.bg,border:`2px solid ${t.border}`,padding:"11px 13px",color:t.text,fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,outline:"none",boxSizing:"border-box"};
  const lbl={fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginBottom:5,textTransform:"uppercase"};

  const doImport=async()=>{
    const u=urlVal.trim();if(!u)return;
    setStatus("loading");
    const meta=await fetchRichMeta(u,type);
    if(meta?.title){
      setPreview({...meta,url:u});
      setStatus("preview");
    } else {
      setStatus("error");
    }
  };
  const doSearch=async()=>{
    const q=searchVal.trim();if(!q)return;
    setStatus("loading");
    const res=await searchItems(q,type);
    if(res.length){setResults(res);setStatus("results");}
    else setStatus("error");
  };
  const addItem=(item)=>{
    onAdd({id:uid(),title:item.title||"Untitled",subtitle:item.subtitle||null,year:item.year||null,rating:item.rating||null,genre:item.genre||null,source:item.source||null,url:item.url||urlVal.trim()||"",note:note.trim(),done:false,addedDate:TODAY()});
    onClose();
  };

  const isGoodreads=urlVal.includes("goodreads")||urlVal.includes("gr.net");
  const isLetterboxd=urlVal.includes("letterboxd")||urlVal.includes("boxd.it");
  const urlHint=isLetterboxd?"🎬 Letterboxd (short links work!)":isGoodreads?"📚 Goodreads":urlVal.trim()?"↗ Custom URL":"";

  const tabBtn=(id,lbl2)=><button onClick={()=>{setMode(id);setStatus("idle");setPreview(null);setResults([]);}} style={{flex:1,padding:"10px",border:`2px solid ${mode===id?t.accent:t.border}`,background:mode===id?t.accent:"transparent",color:mode===id?t.textInv:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:2,boxShadow:mode===id?`2px 2px 0 ${t.border}`:"none"}}>{lbl2}</button>;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:t.bg,width:"100%",maxWidth:500,border:`3px solid ${t.border}`,borderBottom:"none",boxShadow:`-6px -6px 0 ${t.border}`,maxHeight:"90vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"20px 20px 0",flexShrink:0}}>
          <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:22,color:t.text,letterSpacing:4,marginBottom:14}}>{type==="movie"?"🎬 ADD FILM":"📖 ADD BOOK"}</div>
          <div style={{display:"flex",gap:6,marginBottom:16}}>{tabBtn("url","PASTE URL")}{tabBtn("search","SEARCH TITLE")}{tabBtn("manual","MANUAL")}</div>
        </div>
        <div style={{padding:"0 20px 16px",overflowY:"auto",flex:1}}>
          {mode==="url"&&<>
            <div style={lbl}>{type==="movie"?"LETTERBOXD OR ANY LINK":"GOODREADS OR ANY LINK"}</div>
            <div style={{display:"flex",gap:6,marginBottom:urlHint?4:12}}>
              <input style={{...inp,flex:1}} placeholder={type==="movie"?"letterboxd.com/film/...":"goodreads.com/book/..."} value={urlVal} onChange={e=>setUrlVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doImport()} autoFocus/>
              <button onClick={doImport} disabled={!urlVal.trim()||status==="loading"} style={{padding:"11px 14px",border:`2px solid ${t.border}`,background:t.addBtn,color:t.addBtnText,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:1,opacity:!urlVal.trim()?0.4:1,boxShadow:`2px 2px 0 ${t.border}`,flexShrink:0,whiteSpace:"nowrap"}}>{status==="loading"?"...":"IMPORT"}</button>
            </div>
            {urlHint&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.accent,letterSpacing:2,marginBottom:10}}>{urlHint} detected</div>}
          </>}
          {mode==="search"&&<>
            <div style={lbl}>SEARCH BY TITLE</div>
            <div style={{display:"flex",gap:6,marginBottom:12}}>
              <input style={{...inp,flex:1}} placeholder={type==="movie"?"e.g. Mulholland Drive":"e.g. Normal People"} value={searchVal} onChange={e=>setSearchVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()} autoFocus/>
              <button onClick={doSearch} disabled={!searchVal.trim()||status==="loading"} style={{padding:"11px 14px",border:`2px solid ${t.border}`,background:t.addBtn,color:t.addBtnText,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:1,opacity:!searchVal.trim()?0.4:1,boxShadow:`2px 2px 0 ${t.border}`,flexShrink:0}}>{status==="loading"?"...":"GO"}</button>
            </div>
          </>}
          {mode==="manual"&&<ManualAddForm type={type} onAdd={addItem} theme={theme}/>}

          {status==="loading"&&<div style={{textAlign:"center",padding:"22px",border:`2px dashed ${t.border}`}}><div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:14,color:t.accent,letterSpacing:3}}>LOOKING IT UP...</div></div>}

          {status==="nokey"&&<div style={{padding:"14px",border:`2px solid ${t.accent}`,background:`${t.accent}11`,marginBottom:10}}>
            <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:t.accent,letterSpacing:2,marginBottom:6}}>API KEY NEEDED</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.textSub,letterSpacing:1,lineHeight:1.6}}>
              1. Get a free key at console.anthropic.com<br/>
              2. In Vercel → Settings → Environment Variables<br/>
              3. Add: VITE_ANTHROPIC_KEY = your key<br/>
              4. Redeploy — search will work instantly
            </div>
          </div>}

          {status==="error"&&<div style={{padding:"14px",border:`2px solid ${t.accent2}`,background:`${t.accent2}11`,marginBottom:10}}><div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.accent2,letterSpacing:2}}>COULDN'T FIND IT. TRY THE MANUAL TAB.</div></div>}

          {status==="shortlink"&&preview&&<ShortLinkForm type={type} source={preview.source} url={preview.url} note={note} setNote={setNote} onAdd={addItem} theme={theme}/>}

          {status==="preview"&&preview&&<div style={{border:`2px solid ${t.accent}`,boxShadow:`3px 3px 0 ${t.accent}`,marginBottom:10}}>
            <div style={{background:`${t.accent}18`,borderBottom:`2px solid ${t.accent}`,padding:"7px 12px"}}><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.accent,letterSpacing:2}}>✓ FOUND IT</span></div>
            <div style={{display:"flex",gap:12,padding:"14px"}}>
              <div style={{width:48,height:64,background:`${t.accent}18`,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{type==="movie"?"🎬":"📖"}</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:15,color:t.text,letterSpacing:2,lineHeight:1.2}}>{preview.title}</div>
                {preview.subtitle&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.textSub,letterSpacing:1,marginTop:3}}>{preview.subtitle}</div>}
                <div style={{display:"flex",gap:8,marginTop:5,flexWrap:"wrap"}}>
                  {preview.year&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub}}>{preview.year}</span>}
                  {preview.rating&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.accent}}>★ {preview.rating}</span>}
                  {preview.genre&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,background:`${t.accent}18`,padding:"1px 6px",border:`1px solid ${t.border}`}}>{preview.genre}</span>}
                </div>
                {preview.source&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:1,marginTop:3}}>via {preview.source}</div>}
              </div>
            </div>
            <div style={{padding:"0 14px 14px"}}>
              <input style={{...inp,fontSize:12}} placeholder="ADD A NOTE (OPTIONAL)" value={note} onChange={e=>setNote(e.target.value)}/>
            </div>
            <button onClick={()=>addItem(preview)} style={{width:"100%",padding:"13px",border:"none",borderTop:`2px solid ${t.accent}`,background:t.accent,color:t.textInv,fontFamily:"'Black Han Sans',sans-serif",fontSize:15,cursor:"pointer",letterSpacing:4}}>+ ADD TO LIST</button>
          </div>}

          {status==="results"&&results.length>0&&<>
            <div style={lbl}>PICK ONE:</div>
            {results.map((item,i)=>(
              <div key={i} onClick={()=>addItem(item)} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 12px",border:`2px solid ${t.border}`,marginBottom:5,cursor:"pointer",background:t.bg,boxShadow:`2px 2px 0 ${t.border}`,transition:"all 0.12s"}}
                onMouseEnter={e=>{e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.background=`${t.accent}11`;}}
                onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.background=t.bg;}}>
                <div style={{width:36,height:48,background:`${t.accent}14`,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{type==="movie"?"🎬":"📖"}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:13,color:t.text,letterSpacing:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{item.title}</div>
                  {item.subtitle&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:1,marginTop:1}}>{item.subtitle}</div>}
                  <div style={{display:"flex",gap:6,marginTop:2}}>
                    {item.year&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub}}>{item.year}</span>}
                    {item.rating&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.accent}}>★ {item.rating}</span>}
                    {item.genre&&<span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,background:`${t.accent}14`,padding:"0 4px",border:`1px solid ${t.border}`}}>{item.genre}</span>}
                  </div>
                </div>
                <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:16,color:t.accent,flexShrink:0}}>+</div>
              </div>
            ))}
          </>}
        </div>
        <div style={{padding:"0 20px 20px",flexShrink:0}}>
          <button onClick={onClose} style={{width:"100%",padding:"11px",border:`2px solid ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:13,cursor:"pointer",letterSpacing:3}}>CANCEL</button>
        </div>
      </div>
    </div>
  );
}
function ThemePicker({current,onChange,onClose}){
  const t=THEMES[current]||THEMES.ravewhite;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:t.bg,padding:24,width:"100%",maxWidth:500,border:`3px solid ${t.border}`,borderBottom:"none",boxShadow:`-6px -6px 0 ${t.border}`}} onClick={e=>e.stopPropagation()}>
        <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:22,color:t.text,marginBottom:18,letterSpacing:4}}>SELECT THEME</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          {Object.entries(THEMES).map(([key,th])=>(
            <button key={key} onClick={()=>{onChange(key);onClose();}} style={{background:th.bg,border:`3px solid ${current===key?th.accent:th.border}`,padding:"14px 8px",cursor:"pointer",textAlign:"center",boxShadow:current===key?`4px 4px 0 ${th.accent}`:`2px 2px 0 ${th.border}`}}>
              <div style={{fontSize:22}}>{th.emoji}</div>
              <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:th.text,marginTop:5,letterSpacing:2}}>{th.name}</div>
              <div style={{display:"flex",gap:3,justifyContent:"center",marginTop:6}}>
                {[th.accent,th.accent2].map((c,i)=><div key={i} style={{width:10,height:10,background:c,border:`1px solid ${th.border}`}}/>)}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── GOOGLE DRIVE BACKUP ─────────────────────────────────────────────────────
async function pushGdriveBackup(state, setStatus) {
  try {
    const content = JSON.stringify({...state, exportedAt: new Date().toISOString()}, null, 2);
    // Search for existing backup file
    const searchRes = await fetch(
      "https://www.googleapis.com/drive/v3/files?q=name%3D%27habit-mode-backup.json%27+and+trashed%3Dfalse&fields=files(id,name)",
      { headers: { Authorization: `Bearer ${window._gdriveToken}` } }
    );
    const searchData = await searchRes.json();
    const existingId = searchData?.files?.[0]?.id;

    if (existingId) {
      // Update existing file
      await fetch(`https://www.googleapis.com/upload/drive/v3/files/${existingId}?uploadType=media`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${window._gdriveToken}`, "Content-Type": "application/json" },
        body: content
      });
    } else {
      // Create new file
      const meta = JSON.stringify({ name: "habit-mode-backup.json", mimeType: "application/json" });
      const form = new FormData();
      form.append("metadata", new Blob([meta], { type: "application/json" }));
      form.append("file", new Blob([content], { type: "application/json" }));
      await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: { Authorization: `Bearer ${window._gdriveToken}` },
        body: form
      });
    }
    setStatus("connected");
  } catch(e) {
    console.warn("Drive backup failed:", e);
    setStatus("error");
  }
}

async function pullGdriveBackup(token) {
  const searchRes = await fetch(
    "https://www.googleapis.com/drive/v3/files?q=name%3D%27habit-mode-backup.json%27+and+trashed%3Dfalse&fields=files(id,name)",
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const searchData = await searchRes.json();
  const fileId = searchData?.files?.[0]?.id;
  if (!fileId) return null;
  const fileRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return await fileRes.json();
}

// ─── BACKUP PANEL ─────────────────────────────────────────────────────────────
function BackupPanel({theme, state, gdriveStatus, setGdriveStatus, onRestoreGdrive, onExport, onImport, importRef}) {
  const t = THEMES[theme]||THEMES.ravewhite;
  const [restoring, setRestoring] = useState(false);
  const [lastBackup, setLastBackup] = useState(null);
  const s = {fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:2};

  const statusColor = gdriveStatus==="connected" ? "#22c55e" : gdriveStatus==="error" ? t.accent2 : gdriveStatus==="connecting" ? t.accent : t.textSub;
  const statusLabel = gdriveStatus==="connected" ? "AUTO-BACKUP ON" : gdriveStatus==="error" ? "BACKUP ERROR" : gdriveStatus==="connecting" ? "CONNECTING..." : "NOT CONNECTED";

  const doRestore = async () => {
    setRestoring(true);
    try {
      const data = await pullGdriveBackup(window._gdriveToken);
      if (data) { onRestoreGdrive(data); setLastBackup(data.exportedAt); }
      else alert("No backup found in Google Drive.");
    } catch { alert("Could not restore from Drive."); }
    setRestoring(false);
  };

  const btn = (onClick, label, primary=false, disabled=false) => (
    <button onClick={onClick} disabled={disabled} style={{flex:1,padding:"11px 0",border:`2px solid ${t.border}`,background:primary?t.addBtn:"transparent",color:primary?t.addBtnText:disabled?t.textSub:t.text,fontFamily:"'Black Han Sans',sans-serif",fontSize:11,cursor:disabled?"default":"pointer",letterSpacing:2,boxShadow:primary?`2px 2px 0 ${t.border}`:"none",opacity:disabled?0.4:1}}>{label}</button>
  );

  return (
    <div style={{marginBottom:20}}>
      <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:16,color:t.text,letterSpacing:4,marginBottom:10}}>💾 BACKUP</div>

      {/* Google Drive section */}
      <div style={{border:`2px solid ${t.border}`,boxShadow:`2px 2px 0 ${t.border}`,marginBottom:8}}>
        <div style={{background:t.bgCard,borderBottom:`2px solid ${t.border}`,padding:"10px 14px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{...s,fontSize:12,color:t.text}}>☁️ GOOGLE DRIVE</span>
          <span style={{...s,fontSize:10,color:statusColor}}>{statusLabel}</span>
        </div>
        <div style={{padding:"12px 14px"}}>
          <div style={{...s,fontSize:11,color:t.textSub,marginBottom:10,lineHeight:1.5}}>
            {gdriveStatus==="connected"
              ? "Auto-saves to habit-mode-backup.json in your Drive after every change."
              : "Connect to auto-backup your data to Google Drive after every change."}
          </div>
          {lastBackup&&<div style={{...s,fontSize:10,color:t.textSub,marginBottom:8}}>LAST BACKUP: {new Date(lastBackup).toLocaleString()}</div>}
          <div style={{display:"flex",gap:6}}>
            {gdriveStatus!=="connected"
              ? btn(async()=>{
                  setGdriveStatus("connecting");
                  // We use the Google Drive MCP token via a known approach:
                  // trigger a harmless Drive API call which will prompt auth if needed
                  try {
                    const r = await fetch("https://www.googleapis.com/drive/v3/about?fields=user", {
                      headers:{ Authorization: `Bearer ${window._gdriveToken||""}` }
                    });
                    if(r.status===401||r.status===403||!window._gdriveToken){
                      // No token available in artifact — show instructions
                      setGdriveStatus("no-token");
                    } else {
                      setGdriveStatus("connected");
                      await pushGdriveBackup(state, setGdriveStatus);
                    }
                  } catch { setGdriveStatus("no-token"); }
                }, gdriveStatus==="connecting"?"CONNECTING...":"CONNECT DRIVE", true, gdriveStatus==="connecting")
              : btn(doRestore, restoring?"RESTORING...":"RESTORE FROM DRIVE", false, restoring)
            }
            {gdriveStatus==="connected"&&btn(async()=>{ await pushGdriveBackup(state,setGdriveStatus); setLastBackup(new Date().toISOString()); },"BACKUP NOW",true)}
          </div>
          {gdriveStatus==="no-token"&&(
            <div style={{marginTop:10,padding:"10px 12px",border:`1.5px solid ${t.accent}`,background:`${t.accent}11`}}>
              <div style={{...s,fontSize:11,color:t.accent,lineHeight:1.6}}>
                GOOGLE DRIVE AUTO-BACKUP WORKS WHEN THE APP IS DEPLOYED.<br/>
                USE THE EXPORT BUTTON BELOW TO SAVE A BACKUP FILE FOR NOW.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Export / Import section */}
      <div style={{border:`2px solid ${t.border}`,boxShadow:`2px 2px 0 ${t.border}`}}>
        <div style={{background:t.bgCard,borderBottom:`2px solid ${t.border}`,padding:"10px 14px"}}>
          <span style={{...s,fontSize:12,color:t.text}}>📁 EXPORT / IMPORT FILE</span>
        </div>
        <div style={{padding:"12px 14px"}}>
          <div style={{...s,fontSize:11,color:t.textSub,marginBottom:10,lineHeight:1.5}}>
            Export saves everything to a .json file on your phone. Import loads it back.
          </div>
          <div style={{display:"flex",gap:6}}>
            {btn(onExport,"⬇ EXPORT BACKUP",true)}
            {btn(()=>importRef.current?.click(),"⬆ IMPORT BACKUP")}
          </div>
          <input ref={importRef} type="file" accept=".json" style={{display:"none"}} onChange={e=>{const f=e.target.files?.[0];if(f)onImport(f);e.target.value="";}}/>
        </div>
      </div>
    </div>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function HistoryLog({habits,theme}){
  const t=THEMES[theme]||THEMES.ravewhite;
  const todayActual=TODAY();
  const days=Array.from({length:14},(_,i)=>{const d=new Date();d.setDate(d.getDate()-(13-i));return d.toISOString().split("T")[0];});
  const totals=days.map(d=>({date:d,done:habits.filter(h=>isDone(h,d)).length,total:habits.length}));
  return(
    <div>
      <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:26,color:t.text,letterSpacing:4,marginBottom:4}}>HISTORY</div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginBottom:14}}>LAST 14 DAYS</div>
      <div style={{display:"flex",gap:3,alignItems:"flex-end",height:72,marginBottom:3,border:`2px solid ${t.border}`,padding:"6px 6px 0",background:t.bgCard,boxShadow:`3px 3px 0 ${t.border}`}}>
        {totals.map(({date,done,total})=>{const p=total>0?done/total:0,isToday2=date===todayActual;return<div key={date} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center"}}><div style={{width:"100%",background:p===1?t.accent:p>0?t.accent+"88":t.border,height:`${Math.max(p*52+4,4)}px`,border:isToday2?`2px solid ${t.accent2}`:"none",boxSizing:"border-box",transition:"height 0.4s"}}/></div>;})}
      </div>
      <div style={{display:"flex",gap:3,marginBottom:18}}>{totals.map(({date})=><div key={date} style={{flex:1,textAlign:"center",fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,color:t.textSub}}>{new Date(date+"T12:00:00").toLocaleDateString("en-US",{weekday:"short"}).slice(0,1)}</div>)}</div>
      <div style={{overflowX:"auto"}}>
        <div style={{minWidth:"max-content"}}>
          <div style={{display:"flex",gap:3,marginBottom:5,paddingLeft:112}}>{days.map(d=><div key={d} style={{width:26,textAlign:"center",fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,color:t.textSub}}>{new Date(d+"T12:00:00").getDate()}</div>)}</div>
          {habits.map(h=>(
            <div key={h.id} style={{display:"flex",gap:3,alignItems:"center",marginBottom:3}}>
              <div style={{width:108,fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",letterSpacing:1,display:"flex",alignItems:"center",gap:3}}>
                <span>{h.emoji}</span><span>{h.label.slice(0,11)}{h.label.length>11?"…":""}</span>
                {h.repeat>1&&<span style={{fontSize:8,color:t.accent}}>×{h.repeat}</span>}
              </div>
              {days.map(d=>{
                const cnt=getCount(h,d),full=isDone(h,d),today=d===todayActual,pp=h.repeat>1&&!full&&cnt>0?cnt/h.repeat:0;
                return<div key={d} style={{width:26,height:18,background:full?h.color:t.bgCard,border:`${today?"2px":"1px"} solid ${today?t.accent:full?h.color:t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,position:"relative",overflow:"hidden"}}>
                  {!full&&pp>0&&<div style={{position:"absolute",left:0,top:0,bottom:0,width:`${pp*100}%`,background:`${h.color}55`}}/>}
                  <span style={{position:"relative"}}>{full?h.emoji:cnt>0?cnt:""}</span>
                </div>;
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [cats,setCats]=useState(DEFAULT_DATA.categories);
  const [subcats,setSubcats]=useState(DEFAULT_DATA.subcategories);
  const [habits,setHabits]=useState(DEFAULT_DATA.habits);
  const [movies,setMovies]=useState([]);
  const [books,setBooks]=useState([]);
  const [totalXP,setTotalXP]=useState(0);
  const [theme,setTheme]=useState("ravewhite");
  const [tab,setTab]=useState("today");
  const [confetti,setConfetti]=useState(false);
  const [flash,setFlash]=useState(false);
  const [toast,setToast]=useState({show:false,msg:"",emoji:""});
  const [milestone,setMilestone]=useState({show:false,streak:0});
  const [addModal,setAddModal]=useState(null);
  const [addHabitCtx,setAddHabitCtx]=useState(null); // {catId,subId}
  const [showTheme,setShowTheme]=useState(false);
  const [openDrawer,setOpenDrawer]=useState(null);
  const [addingCat,setAddingCat]=useState(false);
  const [newCatVal,setNewCatVal]=useState("");
  const [loaded,setLoaded]=useState(false);
  const [gdriveStatus,setGdriveStatus]=useState("idle"); // idle|connecting|connected|error
  const [showBackup,setShowBackup]=useState(false);
  const [viewOffset,setViewOffset]=useState(0); // 0=today, -1=yesterday, etc.
  const sounds=useSounds();
  const todayStr=TODAY();
  // viewDate: the date currently being viewed
  const viewDate=(() => {
    const d=new Date();
    d.setDate(d.getDate()+viewOffset);
    return d.toISOString().split("T")[0];
  })();
  const isToday=viewOffset===0;
  const viewDateLabel=isToday?"TODAY":viewOffset===-1?"YESTERDAY":new Date(viewDate+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"short",day:"numeric"}).toUpperCase();
  const t=THEMES[theme]||THEMES.ravewhite;
  const newCatRef=useRef(null);
  const importRef=useRef(null);

  useEffect(()=>{load().then(saved=>{if(saved){setCats(saved.cats||DEFAULT_DATA.categories);setSubcats(saved.subcats||DEFAULT_DATA.subcategories);setHabits(saved.habits||DEFAULT_DATA.habits);setMovies(saved.movies||[]);setBooks(saved.books||[]);setTotalXP(saved.totalXP||0);setTheme(saved.theme||"ravewhite");}setLoaded(true);});},[]);
  useEffect(()=>{
    if(!loaded)return;
    const state={cats,subcats,habits,movies,books,totalXP,theme};
    save(state);
    // Auto-backup to Google Drive (debounced — only after 3s of no changes)
    if(gdriveStatus==="connected"){
      clearTimeout(window._gdriveBackupTimer);
      window._gdriveBackupTimer=setTimeout(()=>pushGdriveBackup(state,setGdriveStatus),3000);
    }
  },[cats,subcats,habits,movies,books,totalXP,theme,loaded]);

  const showToast=(msg,emoji)=>{setToast({show:true,msg,emoji});setTimeout(()=>setToast(s=>({...s,show:false})),2200);};

  const completeHabit=(id)=>{
    const h=habits.find(x=>x.id===id);
    if(!h||isDone(h,todayStr))return;
    const cnt=getCount(h,todayStr)+1,nowDone=cnt>=h.repeat,newStreak=nowDone?h.streak+1:h.streak,isMilestone=nowDone&&MILESTONES.includes(newStreak);
    if(h.special==="poop"){sounds.playPoop();setFlash(true);setTimeout(()=>setFlash(false),700);setConfetti(true);showToast("POOPED! KING BEHAVIOR","💩");}
    else if(isMilestone){sounds.playMilestone();setConfetti(true);setMilestone({show:true,streak:newStreak});}
    else if(nowDone){sounds.playSuccess();setConfetti(true);showToast("DONE",h.emoji);}
    else{sounds.playTick();showToast(`${cnt}/${h.repeat} DONE`,h.emoji);}
    setHabits(prev=>prev.map(x=>x.id===id?{...x,completedDates:addCount(x.completedDates,todayStr,x.repeat),streak:newStreak}:x));
    setTotalXP(prev=>prev+(nowDone||h.repeat===1?h.xp:Math.floor(h.xp/h.repeat)));
  };

  const undoOne=(id)=>{
    const h=habits.find(x=>x.id===id);if(!h)return;
    const wasDone=isDone(h,todayStr),cnt=getCount(h,todayStr);if(cnt===0)return;
    sounds.playUndo();
    setHabits(prev=>prev.map(x=>x.id===id?{...x,completedDates:subCount(x.completedDates,todayStr,x.repeat),streak:wasDone?Math.max(0,x.streak-1):x.streak}:x));
    setTotalXP(prev=>Math.max(0,prev-(wasDone?h.xp:Math.floor(h.xp/h.repeat))));
    showToast("UNDONE","↩️");
  };

  // Category / subcat CRUD
  const addCat=(cat)=>setCats(prev=>[...prev,cat]);
  const deleteCat=(id)=>{ setCats(p=>p.filter(c=>c.id!==id)); setSubcats(p=>p.filter(s=>s.catId!==id)); setHabits(p=>p.filter(h=>h.catId!==id)); };
  const renameCat=(id,label)=>setCats(p=>p.map(c=>c.id===id?{...c,label}:c));
  const addSubcat=(sub)=>setSubcats(prev=>[...prev,sub]);
  const deleteSubcat=(id)=>{ setSubcats(p=>p.filter(s=>s.id!==id)); setHabits(p=>p.map(h=>h.subId===id?{...h,subId:null}:h)); };
  const renameSubcat=(id,label)=>setSubcats(p=>p.map(s=>s.id===id?{...s,label}:s));

  // Habit CRUD
  const addHabit=(h)=>{setHabits(prev=>[...prev,h]);showToast("HABIT ADDED",h.emoji);};
  const deleteHabit=(id)=>setHabits(p=>p.filter(h=>h.id!==id));

  const handleExport=()=>exportData({cats,subcats,habits,movies,books,totalXP,theme});
  const handleImport=(file)=>{
    importData(file, (data)=>{
      if(data.cats) setCats(data.cats);
      if(data.subcats) setSubcats(data.subcats);
      if(data.habits) setHabits(data.habits);
      if(data.movies) setMovies(data.movies);
      if(data.books) setBooks(data.books);
      if(data.totalXP!=null) setTotalXP(data.totalXP);
      if(data.theme) setTheme(data.theme);
      showToast("BACKUP RESTORED","💾");
    }, (err)=>showToast(err,"⚠️"));
  };
  const handleRestoreGdrive=(data)=>{
    if(data.cats) setCats(data.cats);
    if(data.subcats) setSubcats(data.subcats);
    if(data.habits) setHabits(data.habits);
    if(data.movies) setMovies(data.movies);
    if(data.books) setBooks(data.books);
    if(data.totalXP!=null) setTotalXP(data.totalXP);
    if(data.theme) setTheme(data.theme);
    showToast("RESTORED FROM DRIVE","☁️");
  };
  const renameHabit=(id,label)=>setHabits(p=>p.map(h=>h.id===id?{...h,label}:h));

  // List CRUD
  const toggleList=(type,id)=>{if(type==="movie")setMovies(p=>p.map(m=>m.id===id?{...m,done:!m.done}:m));else setBooks(p=>p.map(b=>b.id===id?{...b,done:!b.done}:b));};
  const deleteList=(type,id)=>{if(type==="movie")setMovies(p=>p.filter(m=>m.id!==id));else setBooks(p=>p.filter(b=>b.id!==id));};
  const addList=(type,item)=>{if(type==="movie")setMovies(p=>[...p,item]);else setBooks(p=>[...p,item]);};
  const renameList=(type,id,title)=>{if(type==="movie")setMovies(p=>p.map(m=>m.id===id?{...m,title}:m));else setBooks(p=>p.map(b=>b.id===id?{...b,title}:b));};

  const doneCount=habits.filter(h=>isDone(h,viewDate)).length;
  const drawerHabit=habits.find(h=>h.id===openDrawer);

  const navItems=[{id:"today",emoji:"☀️",label:"TODAY"},{id:"movies",emoji:"🎬",label:"FILMS"},{id:"books",emoji:"📖",label:"BOOKS"},{id:"log",emoji:"📊",label:"LOG"},{id:"settings",emoji:"⚙️",label:"SETTINGS"}];

  if(!loaded) return <div style={{background:"#0a0a0a",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:28,color:"#e8ff00",letterSpacing:6}}>LOADING...</div></div>;

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Barlow+Condensed:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{background:${t.bg};}
        @keyframes flashPulse{0%{opacity:1}100%{opacity:0}}
        @keyframes milestoneIn{0%{transform:scale(0.3) rotate(-8deg);opacity:0}100%{transform:scale(1) rotate(0deg);opacity:1}}
        input,select{font-family:'Barlow Condensed',sans-serif;}
        input::placeholder{color:${t.textSub};letter-spacing:2px;}
        select{color:${t.text};background:${t.bg};}
        ::-webkit-scrollbar{width:4px;height:4px;}
        ::-webkit-scrollbar-thumb{background:${t.border};}
        .grain::after{content:"";position:fixed;inset:0;pointer-events:none;opacity:0.04;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");background-size:200px;z-index:99999;}
      `}</style>

      <div className="grain"/>
      <Confetti active={confetti} onDone={()=>setConfetti(false)} colors={[t.accent,t.accent2,"#fff",t.bgCard]}/>
      <Flash active={flash} color={`${t.accent2}44`}/>
      <Toast msg={toast.msg} emoji={toast.emoji} show={toast.show} theme={theme}/>
      <MilestoneBanner show={milestone.show} streak={milestone.streak} onDone={()=>setMilestone({show:false,streak:0})} theme={theme}/>
      {addModal&&<AddModal type={addModal} onAdd={item=>addList(addModal,item)} onClose={()=>setAddModal(null)} theme={theme}/>}
      {addHabitCtx&&<AddHabitModal catId={addHabitCtx.catId} subId={addHabitCtx.subId} cats={cats} subcats={subcats} onAdd={addHabit} onClose={()=>setAddHabitCtx(null)} theme={theme}/>}
      {showTheme&&<ThemePicker current={theme} onChange={setTheme} onClose={()=>setShowTheme(false)}/>}
      {drawerHabit&&<RepeatDrawer habit={drawerHabit} todayStr={viewDate} count={getCount(drawerHabit,viewDate)} onIncrement={isToday?completeHabit:()=>{}} onDecrement={isToday?undoOne:()=>{}} onRename={isToday?renameHabit:()=>{}} onClose={()=>setOpenDrawer(null)} theme={theme}/>}

      <div style={{background:t.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:90}}>
        {/* Header */}
        <div style={{padding:"22px 16px 12px",borderBottom:`2px solid ${t.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:tab==="today"?10:0}}>
            <div>
              <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:32,color:t.text,letterSpacing:5,lineHeight:1}}>HABIT MODE</div>
            </div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,padding:"7px 0"}}>{t.emoji} {t.name}</div>
          </div>
          {/* Day navigation — only shown on Today tab */}
          {tab==="today"&&(
            <div style={{display:"flex",alignItems:"center",gap:0}}>
              <button onClick={()=>setViewOffset(o=>o-1)} style={{background:"transparent",border:`2px solid ${t.border}`,borderRight:"none",padding:"7px 12px",cursor:"pointer",fontFamily:"'Black Han Sans',sans-serif",fontSize:14,color:t.text,boxShadow:`2px 2px 0 ${t.border}`}}>◀</button>
              <div style={{flex:1,textAlign:"center",border:`2px solid ${t.border}`,borderRight:"none",padding:"7px 12px",background:isToday?t.accent:t.bgCard,boxShadow:`2px 2px 0 ${t.border}`}}>
                <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:13,color:isToday?t.textInv:t.text,letterSpacing:3}}>{viewDateLabel}</div>
                {!isToday&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:isToday?t.textInv:t.textSub,letterSpacing:2,marginTop:1}}>{new Date(viewDate+"T12:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>}
              </div>
              <button onClick={()=>setViewOffset(o=>Math.min(0,o+1))} disabled={isToday} style={{background:"transparent",border:`2px solid ${t.border}`,padding:"7px 12px",cursor:isToday?"default":"pointer",fontFamily:"'Black Han Sans',sans-serif",fontSize:14,color:isToday?t.textSub:t.text,opacity:isToday?0.3:1,boxShadow:`2px 2px 0 ${t.border}`}}>▶</button>
              {!isToday&&<button onClick={()=>setViewOffset(0)} style={{background:t.accent,border:`2px solid ${t.border}`,borderLeft:"none",padding:"7px 10px",cursor:"pointer",fontFamily:"'Black Han Sans',sans-serif",fontSize:10,color:t.textInv,letterSpacing:1,boxShadow:`2px 2px 0 ${t.border}`,whiteSpace:"nowrap"}}>TODAY</button>}
            </div>
          )}
          {tab!=="today"&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,marginTop:3,letterSpacing:3}}>{new Date().toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}).toUpperCase()}</div>}
        </div>

        <div style={{padding:"14px 14px 0"}}>
          {tab==="today"&&(
            <>
              <XPBar xp={totalXP} theme={theme}/>
              {/* Overall progress */}
              <div style={{background:t.bgCard,border:`2px solid ${t.border}`,padding:"12px 16px",marginBottom:14,boxShadow:`3px 3px 0 ${t.border}`,display:"flex",alignItems:"center",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                    <span style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:t.text,letterSpacing:3}}>{doneCount===habits.length&&habits.length>0?"ALL DONE 🏆":doneCount===0?"LET'S GO":`${habits.length-doneCount} REMAINING`}</span>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.textSub,letterSpacing:2}}>{doneCount}/{habits.length}</span>
                  </div>
                  <div style={{background:t.bg,height:7,border:`1.5px solid ${t.border}`}}><div style={{width:`${Math.round((doneCount/Math.max(habits.length,1))*100)}%`,height:"100%",background:t.accent,transition:"width 0.6s ease"}}/></div>
                </div>
              </div>

              {/* Past day banner */}
              {!isToday&&<div style={{background:`${t.accent2}18`,border:`2px solid ${t.accent2}`,padding:"10px 14px",marginBottom:12,boxShadow:`2px 2px 0 ${t.border}`}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.accent2,letterSpacing:2}}>VIEWING PAST DAY — READ ONLY</div>
              </div>}
              {/* Categories */}
              {cats.map(cat=>(
                <CategoryBlock key={cat.id} cat={cat} subcats={subcats} habits={habits} todayStr={viewDate} theme={theme}
                  onComplete={isToday?completeHabit:()=>{}} onUndoOne={isToday?undoOne:()=>{}}
                  onDeleteHabit={isToday?deleteHabit:()=>{}} onRenameHabit={isToday?renameHabit:()=>{}}
                  onOpenDrawer={isToday?setOpenDrawer:()=>{}}
                  onDeleteCat={isToday?deleteCat:()=>{}} onRenameCat={isToday?renameCat:()=>{}}
                  onAddSubcat={isToday?addSubcat:()=>{}} onDeleteSubcat={isToday?deleteSubcat:()=>{}} onRenameSubcat={isToday?renameSubcat:()=>{}}
                  onAddHabit={isToday?(catId,subId)=>setAddHabitCtx({catId,subId}):()=>{}}/>
              ))}

              {/* Add category */}
              {addingCat
                ?<div style={{display:"flex",gap:6,marginTop:2}}>
                  <input ref={newCatRef} value={newCatVal} onChange={e=>setNewCatVal(e.target.value.toUpperCase())}
                    onKeyDown={e=>{
                      if(e.key==="Enter"){const v=newCatVal.trim();if(v){addCat({id:uid(),label:v.toUpperCase(),collapsed:false});}setNewCatVal("");setAddingCat(false);}
                      if(e.key==="Escape"){setAddingCat(false);setNewCatVal("");}
                    }}
                    placeholder="CATEGORY NAME" autoFocus
                    style={{flex:1,background:t.bg,border:`2px solid ${t.accent}`,padding:"11px 12px",color:t.text,fontFamily:"'Black Han Sans',sans-serif",fontSize:14,letterSpacing:3,outline:"none"}}/>
                  <button onClick={()=>{const v=newCatVal.trim();if(v){addCat({id:uid(),label:v.toUpperCase(),collapsed:false});}setNewCatVal("");setAddingCat(false);}} style={{padding:"11px 16px",border:`2px solid ${t.border}`,background:t.addBtn,color:t.addBtnText,fontFamily:"'Black Han Sans',sans-serif",fontSize:13,cursor:"pointer",letterSpacing:2,boxShadow:`2px 2px 0 ${t.border}`}}>ADD</button>
                  <button onClick={()=>{setAddingCat(false);setNewCatVal("");}} style={{padding:"11px 12px",border:`2px solid ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,cursor:"pointer"}}>✕</button>
                </div>
                :<button onClick={()=>{setAddingCat(true);setTimeout(()=>newCatRef.current?.focus(),50);}} style={{width:"100%",padding:"13px",border:`2px dashed ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:13,cursor:"pointer",marginTop:2,letterSpacing:4}}>+ ADD CATEGORY</button>}
            </>
          )}

          {(tab==="movies"||tab==="books")&&(
            <>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,borderBottom:`2px solid ${t.border}`,paddingBottom:12}}>
                <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:24,color:t.text,letterSpacing:4}}>{tab==="movies"?"FILMS":"BOOKS"}</div>
                <button onClick={()=>setAddModal(tab==="movies"?"movie":"book")} style={{background:t.addBtn,border:`2px solid ${t.border}`,padding:"8px 16px",fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:t.addBtnText,cursor:"pointer",letterSpacing:2,boxShadow:`2px 2px 0 ${t.border}`}}>+ ADD</button>
              </div>
              {(tab==="movies"?movies:books).length===0
                ?<div style={{textAlign:"center",padding:"44px 20px",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,letterSpacing:2,border:`2px dashed ${t.border}`}}><div style={{fontSize:34,marginBottom:10}}>{tab==="movies"?"🎬":"📖"}</div>NOTHING YET.<br/>PASTE A LINK — TITLE AUTO-FILLS.</div>
                :(tab==="movies"?movies:books).map(item=><ListItem key={item.id} item={item} type={tab==="movies"?"movie":"book"} onToggle={id=>toggleList(tab==="movies"?"movie":"book",id)} onDelete={id=>deleteList(tab==="movies"?"movie":"book",id)} onRename={(id,title)=>renameList(tab==="movies"?"movie":"book",id,title)} theme={theme}/>)}
            </>
          )}

          {tab==="log"&&(
            <>
              {/* Stats grid */}
              <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:22,color:t.text,letterSpacing:4,marginBottom:12}}>📊 STATS</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                {[{label:"TOTAL XP",value:totalXP,emoji:"⚡"},{label:"LEVEL",value:Math.floor(totalXP/100)+1,emoji:"🏆"},{label:"FILMS WATCHED",value:movies.filter(m=>m.done).length,emoji:"🎬"},{label:"BOOKS DONE",value:books.filter(b=>b.done).length,emoji:"📖"},{label:"DONE TODAY",value:doneCount,emoji:"☀️"},{label:"TOTAL HABITS",value:habits.length,emoji:"🎯"}].map(s=>(
                  <div key={s.label} style={{background:t.bgCard,border:`2px solid ${t.border}`,padding:"13px 14px",boxShadow:`2px 2px 0 ${t.border}`}}>
                    <div style={{fontSize:18}}>{s.emoji}</div>
                    <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:28,color:t.accent,marginTop:3,letterSpacing:2}}>{s.value}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,marginTop:1,letterSpacing:2}}>{s.label}</div>
                  </div>
                ))}
              </div>
              {/* Streaks */}
              <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:16,color:t.text,marginBottom:8,letterSpacing:4}}>🔥 STREAKS</div>
              <div style={{marginBottom:20}}>
                {habits.map(h=>(
                  <div key={h.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:7,background:t.bgCard,border:`2px solid ${t.border}`,padding:"11px 12px",boxShadow:`2px 2px 0 ${t.border}`}}>
                    <span style={{fontSize:18}}>{h.emoji}</span>
                    <div style={{flex:1}}>
                      <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:t.text,letterSpacing:2}}>{h.label}{h.repeat>1&&<span style={{fontSize:10,color:t.textSub,marginLeft:5}}>×{h.repeat}/day</span>}</div>
                      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:1}}>{totalCompletions(h)} COMPLETIONS</div>
                      <div style={{display:"flex",gap:3,marginTop:3,flexWrap:"wrap"}}>
                        {MILESTONES.filter(m=>m<=h.streak).map(m=><span key={m} style={{fontSize:9,background:t.accent,color:t.textInv,padding:"1px 5px",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,letterSpacing:1}}>🏅{m}D</span>)}
                      </div>
                    </div>
                    <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:20,color:t.accent2,letterSpacing:2}}>🔥{h.streak}</div>
                  </div>
                ))}
              </div>
              {/* History log */}
              <HistoryLog habits={habits} theme={theme}/>
            </>
          )}

          {tab==="settings"&&(
            <>
              <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:22,color:t.text,letterSpacing:4,marginBottom:14}}>⚙️ SETTINGS</div>

              {/* Theme picker inline */}
              <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:14,color:t.text,letterSpacing:4,marginBottom:10}}>🎨 THEME</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:20}}>
                {Object.entries(THEMES).map(([key,th])=>(
                  <button key={key} onClick={()=>setTheme(key)} style={{background:th.bg,border:`3px solid ${theme===key?th.accent:th.border}`,padding:"14px 8px",cursor:"pointer",textAlign:"center",boxShadow:theme===key?`4px 4px 0 ${th.accent}`:`2px 2px 0 ${th.border}`,transition:"all 0.15s"}}>
                    <div style={{fontSize:22}}>{th.emoji}</div>
                    <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:th.text,marginTop:5,letterSpacing:2}}>{th.name}</div>
                    <div style={{display:"flex",gap:3,justifyContent:"center",marginTop:6}}>
                      {[th.accent,th.accent2].map((c,i)=><div key={i} style={{width:10,height:10,background:c,border:`1px solid ${th.border}`}}/>)}
                    </div>
                  </button>
                ))}
              </div>

              {/* Backup */}
              <BackupPanel
                theme={theme}
                state={{cats,subcats,habits,movies,books,totalXP,theme}}
                gdriveStatus={gdriveStatus}
                setGdriveStatus={setGdriveStatus}
                onRestoreGdrive={handleRestoreGdrive}
                onExport={handleExport}
                onImport={handleImport}
                importRef={importRef}
              />
            </>
          )}
        </div>

        {/* Bottom Nav */}
        <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:t.nav,borderTop:`2px solid ${t.border}`,display:"flex",padding:"10px 0 14px",backdropFilter:"blur(20px)"}}>
          {navItems.map(n=>(
            <button key={n.id} onClick={()=>setTab(n.id)} style={{flex:1,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,opacity:tab===n.id?1:0.3,transition:"all 0.15s",transform:tab===n.id?"translateY(-1px)":"none"}}>
              <span style={{fontSize:18}}>{n.emoji}</span>
              <span style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:9,color:tab===n.id?t.accent:t.text,letterSpacing:2}}>{n.label}</span>
              {tab===n.id&&<div style={{width:14,height:2,background:t.accent,marginTop:1}}/>}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
