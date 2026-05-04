import React, { useState, useEffect, useRef, useCallback } from "react";

// ─── THEMES ───────────────────────────────────────────────────────────────────
const THEMES = {
  hawt:     { name:"HAWT",    emoji:"⚡",bg:"#f0ede8",bgCard:"#e8e4de",nav:"rgba(240,237,232,0.97)",border:"#1a1a1a",accent:"#1a1a1a",accent2:"#ff3333",text:"#1a1a1a",textSub:"#666",textInv:"#f0ede8",xpBar:"linear-gradient(90deg,#1a1a1a,#555)",addBtn:"#1a1a1a",addBtnText:"#f0ede8" },
  midnight: { name:"DARK",    emoji:"🌑",bg:"#0a0a0a",bgCard:"#141414",nav:"rgba(10,10,10,0.97)",border:"#333",accent:"#e8ff00",accent2:"#ff3333",text:"#f0ede8",textSub:"#555",textInv:"#0a0a0a",xpBar:"linear-gradient(90deg,#e8ff00,#00ffcc)",addBtn:"#e8ff00",addBtnText:"#0a0a0a" },
  pink:     { name:"PINK",    emoji:"🩷",bg:"#ffe0f0",bgCard:"#ffd0e8",nav:"rgba(255,224,240,0.97)",border:"#1a1a1a",accent:"#1a1a1a",accent2:"#ff0066",text:"#1a1a1a",textSub:"#aa5577",textInv:"#ffe0f0",xpBar:"linear-gradient(90deg,#ff0066,#1a1a1a)",addBtn:"#ff0066",addBtnText:"#fff" },
  cream:    { name:"CREAM",   emoji:"🤍",bg:"#faf7f0",bgCard:"#f2ede3",nav:"rgba(250,247,240,0.97)",border:"#c8b89a",accent:"#5c3d1e",accent2:"#8b5e3c",text:"#2d1f0e",textSub:"#9a7a5a",textInv:"#faf7f0",xpBar:"linear-gradient(90deg,#5c3d1e,#c8a06a)",addBtn:"#5c3d1e",addBtnText:"#faf7f0" },
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
function Toast({msg,emoji,show,theme}){const t=THEMES[theme]||THEMES.hawt;return <div style={{position:"fixed",top:20,left:"50%",transform:`translateX(-50%) translateY(${show?0:-90}px)`,transition:"transform 0.35s cubic-bezier(.34,1.56,.64,1),opacity 0.25s",opacity:show?1:0,background:t.accent,color:t.textInv,padding:"10px 24px",fontSize:15,fontFamily:"'Black Han Sans',sans-serif",letterSpacing:2,boxShadow:`4px 4px 0 ${t.border}`,zIndex:10000,whiteSpace:"nowrap",border:`2px solid ${t.border}`,textTransform:"uppercase"}}>{emoji} {msg}</div>;}
function MilestoneBanner({show,streak,onDone,theme}){
  const t=THEMES[theme]||THEMES.hawt;
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
// Schedule: null=every day, [0,1,2,3,4,5,6] where 0=Sun,1=Mon...6=Sat
const HABIT_COLORS=["#e74c3c","#e67e22","#f1c40f","#2ecc71","#1abc9c","#3498db","#9b59b6","#e91e63","#ff5722","#607d8b","#8B4513","#2a6600","#cc0044","#4400cc","#6c5ce7","#00b894","#fd79a8","#fdcb6e","#e17055","#74b9ff"];
const SCHEDULE_PRESETS = {
  daily:    {label:"EVERY DAY",   days:null},
  weekdays: {label:"MON–FRI",     days:[1,2,3,4,5]},
  weekends: {label:"SAT–SUN",     days:[0,6]},
  custom:   {label:"CUSTOM",      days:[]},
};
// Every-other-day stored as special marker in schedule
const isEveryOtherDay=(schedule)=>schedule&&schedule.length===1&&schedule[0]==="EOD";
const isScheduledFor=(habit,dateStr)=>{
  if(!habit.schedule||habit.schedule.length===0) return true;
  if(isEveryOtherDay(habit.schedule)){
    // Count days from the habit's creation date (or epoch fallback)
    const anchor=habit.createdDate||"2025-01-01";
    const epoch=new Date(anchor+"T12:00:00");
    const d=new Date(dateStr+"T12:00:00");
    const daysDiff=Math.round((d-epoch)/(1000*60*60*24));
    return daysDiff%2===0;
  }
  const dow=new Date(dateStr+"T12:00:00").getDay();
  return habit.schedule.includes(dow);
};
const DAY_NAMES=["SUN","MON","TUE","WED","THU","FRI","SAT"];

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
    { id:"cat_health", label:"HEALTH", collapsed:false },
    { id:"cat_work",   label:"WORK",   collapsed:false },
  ],
  subcategories: [
    { id:"sub_meds",  catId:"cat_health", label:"MEDS",  collapsed:false },
    { id:"sub_fiber", catId:"cat_health", label:"FIBER", collapsed:false },
  ],
  habits: [
    { id:"poop",     emoji:"💩",label:"DID YOU POOP?",      catId:"cat_health", subId:null,       color:"#8B4513",special:"poop",xp:20,streak:0,repeat:1,schedule:null,createdDate:"2025-01-01",completedDates:[],isDefault:true },
    { id:"vitamins", emoji:"💊",label:"MORNING VITAMINS",   catId:"cat_health", subId:"sub_meds", color:"#cc0044",special:null, xp:15,streak:0,repeat:1,schedule:null,createdDate:"2025-01-01",completedDates:[],isDefault:true },
    { id:"nightmeds",emoji:"🌙",label:"NIGHTTIME MEDS",     catId:"cat_health", subId:"sub_meds", color:"#4400cc",special:null, xp:15,streak:0,repeat:1,schedule:null,createdDate:"2025-01-01",completedDates:[],isDefault:true },
    { id:"fiber",    emoji:"🌾",label:"FIBER DOSE",         catId:"cat_health", subId:"sub_fiber",color:"#2a6600",special:null, xp:10,streak:0,repeat:3,schedule:null,createdDate:"2025-01-01",completedDates:[],isDefault:true },
  ],
  tasks: [
    { id:"sample_task", label:"ADD YOUR FIRST TASK BELOW 👇", note:"tasks are one-time to-dos — check them off when done!", catId:"cat_work", subId:null, scheduledFor:"2025-01-01", dueDate:null, dueTime:null, priority:false, repeatUntilDue:false, done:false, doneDate:null, createdDate:"2025-01-01", isTask:true },
  ]
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
  const t=THEMES[theme]||THEMES.hawt,level=Math.floor(xp/100)+1,prog=xp%100;
  return <div style={{padding:"14px 18px",background:t.bgCard,marginBottom:14,border:`2px solid ${t.border}`,boxShadow:`3px 3px 0 ${t.border}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:7}}><span style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:16,color:t.accent,letterSpacing:3}}>LVL {level}</span><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,color:t.textSub,letterSpacing:2}}>{xp} XP · {prog}/100</span></div><div style={{background:t.bg,height:10,border:`1.5px solid ${t.border}`,overflow:"hidden"}}><div style={{width:`${prog}%`,height:"100%",background:t.xpBar,transition:"width 0.8s cubic-bezier(.34,1.56,.64,1)"}}/></div></div>;
}

// ─── REPEAT DRAWER ────────────────────────────────────────────────────────────
function RepeatDrawer({habit,todayStr,count,onIncrement,onDecrement,onRename,onClose,theme}){
  const t=THEMES[theme]||THEMES.hawt;
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

// ─── EDIT HABIT MODAL ─────────────────────────────────────────────────────────
function EditHabitModal({habit, onSave, onDelete, onClose, theme}) {
  const t=THEMES[theme]||THEMES.hawt;
  const [label,setLabel]=useState(habit.label);
  const [timeOfDay,setTimeOfDay]=useState(habit.timeOfDay||null); // null|"AM"|"PM"|"EVE"
  const commit=()=>{
    if(!label.trim())return;
    onSave(habit.id, label.trim().toUpperCase(), timeOfDay);
    onClose();
  };
  const inp={width:"100%",background:t.bg,border:`2px solid ${t.border}`,padding:"11px 13px",color:t.text,fontSize:14,fontFamily:"'Black Han Sans',sans-serif",letterSpacing:2,outline:"none",boxSizing:"border-box",marginBottom:10};
  const lbl={fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:2,marginBottom:6};
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:t.bg,width:"100%",maxWidth:480,border:`3px solid ${t.border}`,borderBottom:"none",boxShadow:`-6px -6px 0 ${t.border}`,padding:24}} onClick={e=>e.stopPropagation()}>
        <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:20,color:t.text,letterSpacing:4,marginBottom:16,display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:24}}>{habit.emoji}</span> EDIT HABIT
        </div>
        <div style={lbl}>NAME</div>
        <input style={inp} value={label} onChange={e=>setLabel(e.target.value.toUpperCase())} onKeyDown={e=>e.key==="Enter"&&commit()} autoFocus/>
        <div style={lbl}>TIME OF DAY</div>
        <div style={{display:"flex",gap:6,marginBottom:16}}>
          {[[null,"ANY TIME","⏰"],[" AM","MORNING","🌅"],["PM","AFTERNOON","☀️"],["EVE","EVENING","🌙"]].map(([val,lbl2,emoji])=>(
            <button key={String(val)} onClick={()=>setTimeOfDay(val)} style={{flex:1,padding:"10px 4px",border:`2px solid ${timeOfDay===val?t.accent:t.border}`,background:timeOfDay===val?t.accent:"transparent",color:timeOfDay===val?t.textInv:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:9,cursor:"pointer",letterSpacing:1,textAlign:"center",boxShadow:timeOfDay===val?`2px 2px 0 ${t.border}`:"none"}}>
              <div style={{fontSize:16,marginBottom:3}}>{emoji}</div>{lbl2}
            </button>
          ))}
        </div>
        <div style={{display:"flex",gap:8}}>
          {!habit.isDefault&&<button onClick={()=>{onClose();setTimeout(()=>onDelete(habit.id),50);}} style={{flex:1,padding:"12px",border:`2px solid ${t.accent2}`,background:"transparent",color:t.accent2,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:2}}>🗑 DELETE</button>}
          <button onClick={onClose} style={{flex:1,padding:"12px",border:`2px solid ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:2}}>CANCEL</button>
          <button onClick={commit} style={{flex:2,padding:"12px",border:`2px solid ${t.border}`,background:t.addBtn,color:t.addBtnText,fontFamily:"'Black Han Sans',sans-serif",fontSize:13,cursor:"pointer",letterSpacing:3,boxShadow:`2px 2px 0 ${t.border}`}}>SAVE</button>
        </div>
      </div>
    </div>
  );
}

function HabitRow({habit,onComplete,onUndoOne,onDelete,onRename,todayStr,theme,onOpenDrawer}){
  const t=THEMES[theme]||THEMES.hawt;
  const count=getCount(habit,todayStr),done=isDone(habit,todayStr),isRep=habit.repeat>1;
  const [showEdit,setShowEdit]=useState(false);
  const [bounce,setBounce]=useState(false);
  const handleTap=()=>{ if(isRep){onOpenDrawer(habit.id);return;} if(done)return; setBounce(true);setTimeout(()=>setBounce(false),300);onComplete(habit.id); };
  const pct=isRep?count/habit.repeat:(done?1:0);
  const timeTag=habit.timeOfDay?{" AM":"🌅"," PM":"☀️","EVE":"🌙","AM":"🌅","PM":"☀️"}[habit.timeOfDay]:null;
  return(
    <>
    {showEdit&&<EditHabitModal habit={habit} theme={theme}
      onSave={(id,label,timeOfDay)=>{onRename(id,label);onRename(id,label,timeOfDay);}}
      onDelete={(id)=>{setShowEdit(false);onDelete(id);}}
      onClose={()=>setShowEdit(false)}/>}
    <div style={{display:"flex",alignItems:"stretch",border:`1.5px solid ${t.border}`,marginBottom:6,background:done?habit.color:t.bg,transition:"all 0.2s cubic-bezier(.34,1.56,.64,1)",transform:bounce?"scale(1.03)":"scale(1)",boxShadow:done?`3px 3px 0 ${t.border}`:`2px 2px 0 ${t.border}`,cursor:"pointer",position:"relative",overflow:"hidden"}}
      onClick={handleTap}>
      {isRep&&!done&&pct>0&&<div style={{position:"absolute",top:0,left:0,bottom:0,width:`${pct*100}%`,background:`${habit.color}22`,borderRight:`1.5px solid ${habit.color}55`,pointerEvents:"none",transition:"width 0.4s ease"}}/>}
      <div style={{width:4,background:done?"rgba(255,255,255,0.4)":isRep&&count>0?habit.color:t.border,flexShrink:0,transition:"background 0.3s"}}/>
      <div style={{padding:"11px 12px",display:"flex",alignItems:"center",gap:10,flex:1,minWidth:0,position:"relative"}}>
        <span style={{fontSize:22,flexShrink:0}}>{habit.emoji}</span>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:13,color:done?"#fff":t.text,letterSpacing:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{habit.label}</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:done?"rgba(255,255,255,0.65)":t.textSub,letterSpacing:1,display:"flex",gap:6,alignItems:"center",marginTop:2,flexWrap:"wrap"}}>
            <span>🔥{habit.streak}</span>
            {timeTag&&<span style={{fontSize:10}}>{timeTag}</span>}
            {habit.schedule&&habit.schedule.length>0&&<span style={{fontSize:9,background:done?"rgba(255,255,255,0.2)":`${t.accent}22`,color:done?"rgba(255,255,255,0.8)":t.accent,padding:"1px 5px",border:`1px solid ${done?"rgba(255,255,255,0.3)":t.accent}`,letterSpacing:1}}>{isEveryOtherDay(habit.schedule)?"EVERY OTHER":habit.schedule.map(d=>DAY_NAMES[d]).join(" ")}</span>}
            {isRep&&<span style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:done?"rgba(255,255,255,0.9)":count>0?habit.color:t.textSub,background:done?"rgba(255,255,255,0.2)":count>0?`${habit.color}22`:"transparent",padding:"0 6px",border:`1px solid ${done?"rgba(255,255,255,0.3)":count>0?habit.color:t.border}`}}>{count}/{habit.repeat}</span>}
            {!isRep&&<span>+{habit.xp}XP</span>}
          </div>
        </div>
      </div>
      <div style={{display:"flex",alignItems:"center",borderLeft:`1.5px solid ${done?"rgba(255,255,255,0.2)":t.border}`,flexShrink:0}}>
        {done
          ?<div style={{display:"flex",flexDirection:"column",alignItems:"center",padding:"8px 12px",gap:3}}>
            <span style={{fontSize:18}}>✅</span>
            <button onClick={e=>{e.stopPropagation();onUndoOne(habit.id);}} style={{fontSize:9,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1,background:"rgba(0,0,0,0.2)",color:"#fff",border:"none",padding:"1px 6px",cursor:"pointer"}}>UNDO</button>
          </div>
          :<button onClick={e=>{e.stopPropagation();setShowEdit(true);}} style={{background:"transparent",border:"none",color:t.textSub,cursor:"pointer",fontSize:10,padding:"10px 12px",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1,height:"100%",display:"flex",alignItems:"center"}}>
            {isRep?"→":"EDIT"}
          </button>}
      </div>
    </div>
    </>
  );
}

// ─── SUBCATEGORY BLOCK ────────────────────────────────────────────────────────
function SubcatBlock({subcat,habits,tasks,todayStr,theme,onComplete,onUndoOne,onDelete,onRename,onOpenDrawer,onDeleteSubcat,onRenameSubcat,onAddTask,onCompleteTask,onUncompleteTask,onDeleteTask,onRenameTask,onUpdateTask}){
  const t=THEMES[theme]||THEMES.hawt;
  const [collapsed,setCollapsed]=useState(subcat.collapsed||false);
  const [editing,setEditing]=useState(false);
  const [editVal,setEditVal]=useState(subcat.label);
  const inputRef=useRef(null);
  const doneHere=habits.filter(h=>isDone(h,todayStr)).length;
  const allDone=doneHere===habits.length&&habits.length>0;
  const commit=()=>{if(editVal.trim())onRenameSubcat(subcat.id,editVal.trim().toUpperCase());setEditing(false);};
  // Tasks belonging to this subcat
  const subcatTasks=(tasks||[]).filter(t2=>{
    if(t2.subId!==subcat.id) return false;
    if(!t2.scheduledFor) return false;
    if(t2.done) return t2.doneDate===todayStr;
    if(t2.dueDate) return t2.scheduledFor<=todayStr;
    return t2.scheduledFor<=todayStr;
  });
  return(
    <div style={{marginBottom:8}}>
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
          {subcatTasks.map(task=><TaskRow key={task.id} task={task} theme={theme} onComplete={onCompleteTask} onUncomplete={onUncompleteTask} onDelete={onDeleteTask} onRename={onRenameTask} onUpdate={onUpdateTask}/>)}
          <button onClick={e=>{e.stopPropagation();onAddTask(subcat.catId,subcat.id);}} style={{width:"100%",padding:"5px",border:`1px dashed ${t.accent}44`,background:"transparent",color:t.accent,fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,cursor:"pointer",letterSpacing:2,marginTop:3}}>+ TASK</button>
        </div>
      )}
    </div>
  );
}


// ─── TASK ROW ─────────────────────────────────────────────────────────────────
// Tasks are one-time items — checkbox style, disappear when done (or stay visible)
function TaskRow({task, onComplete, onUncomplete, onDelete, onRename, onUpdate, theme}) {
  const t=THEMES[theme]||THEMES.hawt;
  const [editing,setEditing]=useState(false);
  const [editVal,setEditVal]=useState(task.label);
  const [extending,setExtending]=useState(false);
  const [newDate,setNewDate]=useState("");
  const [newTime,setNewTime]=useState("");
  const ref=useRef(null);
  const today=TODAY();
  const isOverdue=!task.done&&task.dueDate&&task.dueDate<=today;
  const commit=()=>{if(editVal.trim())onRename(task.id,editVal.trim());setEditing(false);};

  const extend=()=>{
    if(!newDate)return;
    onUpdate({...task,dueDate:newDate,dueTime:newTime||null,scheduledFor:task.scheduledFor});
    setExtending(false);setNewDate("");setNewTime("");
  };

  const inp={background:t.bg,border:`1.5px solid ${t.border}`,padding:"6px 8px",color:t.text,fontSize:12,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1,outline:"none",colorScheme:"dark"};

  return(
    <div style={{border:`1.5px solid ${isOverdue?t.accent2:task.done?t.border:t.accent+"66"}`,marginBottom:5,background:task.done?t.bgCard:t.bg,transition:"all 0.2s",boxShadow:task.done?"none":`1px 1px 0 ${t.border}`}}>
      <div style={{display:"flex",alignItems:"center",gap:0}}>
        <button onClick={()=>task.done?onUncomplete(task.id):onComplete(task.id)} style={{width:40,alignSelf:"stretch",background:"transparent",border:"none",borderRight:`1.5px solid ${task.done?t.border:t.accent+"66"}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,color:task.done?t.accent:t.textSub,flexShrink:0}}>
          {task.done?"☑":"☐"}
        </button>
        <div style={{flex:1,padding:"9px 10px",minWidth:0}}>
          {editing
            ?<input ref={ref} value={editVal} onChange={e=>setEditVal(e.target.value)} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape")setEditing(false);}} onClick={e=>e.stopPropagation()} style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,letterSpacing:1,color:t.text,background:"transparent",border:"none",borderBottom:`1.5px solid ${t.accent}`,outline:"none",width:"100%"}} autoFocus/>
            :<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,color:task.done?t.textSub:t.text,letterSpacing:1,textDecoration:task.done?"line-through":"none",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",display:"flex",alignItems:"center",gap:5}}>
              {task.priority&&<span style={{fontSize:12,flexShrink:0}}>⭐</span>}{task.label}
            </div>
          }
          {task.note&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:1,marginTop:1}}>{task.note}</div>}
          <div style={{display:"flex",gap:6,alignItems:"center",marginTop:1,flexWrap:"wrap"}}>
            {task.dueDate&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,color:isOverdue?t.accent2:t.textSub,letterSpacing:1}}>
              {isOverdue?"⚠️ OVERDUE:":""} DUE {task.dueDate}{task.dueTime?" @ "+task.dueTime:""}
            </div>}
            {isOverdue&&!extending&&<button onClick={e=>{e.stopPropagation();setExtending(true);}} style={{fontSize:9,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1,background:`${t.accent2}22`,color:t.accent2,border:`1px solid ${t.accent2}`,padding:"1px 6px",cursor:"pointer"}}>EXTEND</button>}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",borderLeft:`1.5px solid ${t.border}`,flexShrink:0}}>
          <button onClick={e=>{e.stopPropagation();setEditVal(task.label);setEditing(true);setTimeout(()=>ref.current?.focus(),50);}} style={{background:"transparent",border:"none",borderBottom:`1px solid ${t.border}`,color:t.textSub,cursor:"pointer",fontSize:10,padding:"7px 10px",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1}}>EDT</button>
          <button onClick={e=>{e.stopPropagation();onDelete(task.id);}} style={{background:"transparent",border:"none",color:t.textSub,cursor:"pointer",fontSize:13,padding:"7px 10px",display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
      </div>
      {/* Overdue extension panel */}
      {extending&&(
        <div style={{borderTop:`1px solid ${t.border}`,padding:"10px 12px",background:`${t.accent2}0a`,display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}} onMouseDown={e=>e.stopPropagation()} onDragStart={e=>e.preventDefault()}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.accent2,letterSpacing:1,flex:"0 0 100%",marginBottom:4}}>PICK NEW DUE DATE:</div>
          <input type="date" style={{...inp,flex:2}} value={newDate} onMouseDown={e=>e.stopPropagation()} onChange={e=>setNewDate(e.target.value)}/>
          <select style={{...inp,flex:1,appearance:"none",cursor:"pointer"}} value={newTime} onChange={e=>setNewTime(e.target.value)}>
            <option value="">ANY TIME</option>
            {["12:00 AM","1:00 AM","2:00 AM","3:00 AM","4:00 AM","5:00 AM","6:00 AM","7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM","10:00 PM","11:00 PM"].map(t2=><option key={t2} value={t2}>{t2}</option>)}
          </select>
          <button onClick={extend} disabled={!newDate} style={{padding:"6px 12px",border:`1.5px solid ${t.accent}`,background:newDate?t.accent:"transparent",color:newDate?t.textInv:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:10,cursor:newDate?"pointer":"default",letterSpacing:1}}>SET</button>
          <button onClick={()=>setExtending(false)} style={{padding:"6px 10px",border:`1.5px solid ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,cursor:"pointer"}}>✕</button>
        </div>
      )}
    </div>
  );
}

// ─── ADD TASK MODAL ───────────────────────────────────────────────────────────
function AddTaskModal({catId, subId, cats, subcats, onAdd, onClose, theme, defaultDate}) {
  const t=THEMES[theme]||THEMES.hawt;
  const [label,setLabel]=useState("");
  const [note,setNote]=useState("");
  const [dueDate,setDueDate]=useState("");
  const [repeatUntilDue,setRepeatUntilDue]=useState(false);
  const [dueTime,setDueTime]=useState("");
  const [priority,setPriority]=useState(false);
  const [selectedCat,setSelectedCat]=useState(catId||cats[0]?.id||"");
  const [selectedSub,setSelectedSub]=useState(subId||"none");
  const availSubs=subcats.filter(s=>s.catId===selectedCat);
  const inp={width:"100%",background:t.bg,border:`2px solid ${t.border}`,padding:"11px 13px",color:t.text,fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,outline:"none",boxSizing:"border-box",marginBottom:10};
  const sel={...inp,appearance:"none",cursor:"pointer"};

  const submit=()=>{
    if(!label.trim()||!selectedCat)return;
    onAdd({
      id:uid(), label:label.trim(), note:note.trim(),
      catId:selectedCat, subId:selectedSub==="none"?null:selectedSub,
      scheduledFor:defaultDate||TODAY(),
      dueDate:dueDate||null,
      dueTime:dueTime||null,
      priority:priority,
      repeatUntilDue:repeatUntilDue&&!!dueDate,
      done:false, doneDate:null,
      createdDate:TODAY(), isTask:true
    });
    onClose();
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:2000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:t.bg,padding:24,width:"100%",maxWidth:480,border:`3px solid ${t.accent}`,borderBottom:"none",boxShadow:`-6px -6px 0 ${t.accent}`,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()} onMouseDown={e=>e.stopPropagation()} onDragStart={e=>e.preventDefault()}>
        <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:22,color:t.text,marginBottom:4,letterSpacing:4}}>NEW TASK</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginBottom:16}}>ONE-TIME · WON'T REPEAT</div>
        <input style={inp} placeholder="TASK NAME" value={label} onChange={e=>setLabel(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} autoFocus/>
        <input style={inp} placeholder="NOTES (OPTIONAL)" value={note} onChange={e=>setNote(e.target.value)}/>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginBottom:4}}>CATEGORY:</div>
        <select style={sel} value={selectedCat} onChange={e=>{setSelectedCat(e.target.value);setSelectedSub("none");}}>
          {cats.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        {availSubs.length>0&&<>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginBottom:4}}>SUBCATEGORY:</div>
          <select style={sel} value={selectedSub} onChange={e=>setSelectedSub(e.target.value)}>
            <option value="none">NONE</option>
            {availSubs.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </>}
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginBottom:4}}>DUE DATE & TIME (OPTIONAL):</div>
        <div style={{display:"flex",gap:6,marginBottom:dueDate?8:16}}>
          <input type="date" style={{...inp,flex:2,marginBottom:0,colorScheme:"dark"}} value={dueDate} onMouseDown={e=>e.stopPropagation()} onChange={e=>{setDueDate(e.target.value);if(!e.target.value){setRepeatUntilDue(false);setDueTime("");}}}/>
          <select style={{...inp,flex:1,marginBottom:0,appearance:"none",cursor:"pointer"}} value={dueTime} onMouseDown={e=>e.stopPropagation()} onChange={e=>setDueTime(e.target.value)} disabled={!dueDate}>
            <option value="">ANY TIME</option>
            {["12:00 AM","1:00 AM","2:00 AM","3:00 AM","4:00 AM","5:00 AM","6:00 AM","7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM","10:00 PM","11:00 PM"].map(t2=><option key={t2} value={t2}>{t2}</option>)}
          </select>
        </div>
        {dueDate&&<div style={{marginBottom:16}}>
          <button onClick={()=>setRepeatUntilDue(v=>!v)} style={{width:"100%",padding:"10px 14px",border:`2px solid ${repeatUntilDue?t.accent:t.border}`,background:repeatUntilDue?`${t.accent}18`:"transparent",color:repeatUntilDue?t.accent:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:2,display:"flex",alignItems:"center",gap:10,textAlign:"left"}}>
            <div style={{width:18,height:18,border:`2px solid ${repeatUntilDue?t.accent:t.border}`,background:repeatUntilDue?t.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,color:t.textInv,flexShrink:0}}>{repeatUntilDue?"✓":""}</div>
            <div>
              <div>SHOW DAILY UNTIL DUE DATE</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:1,marginTop:2,fontWeight:400}}>Appears every day until done or due date passes</div>
            </div>
          </button>
        </div>}
        <button onClick={()=>setPriority(v=>!v)} style={{width:"100%",padding:"10px",border:`2px solid ${priority?"#f1c40f":t.border}`,background:priority?"#f1c40f22":"transparent",color:priority?"#f1c40f":t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:2,marginBottom:10,display:"flex",alignItems:"center",gap:8,justifyContent:"center"}}>
          <span style={{fontSize:16}}>⭐</span>{priority?"MARKED AS IMPORTANT":"MARK AS IMPORTANT"}
        </button>
        <div style={{display:"flex",gap:8}}>
          <button onClick={onClose} style={{flex:1,padding:13,border:`2px solid ${t.border}`,background:"transparent",color:t.text,fontFamily:"'Black Han Sans',sans-serif",fontSize:14,cursor:"pointer",letterSpacing:3}}>CANCEL</button>
          <button onClick={submit} style={{flex:2,padding:13,border:`2px solid ${t.accent}`,background:t.accent,color:t.textInv,fontFamily:"'Black Han Sans',sans-serif",fontSize:14,cursor:"pointer",letterSpacing:3,boxShadow:`3px 3px 0 ${t.border}`}}>ADD TASK</button>
        </div>
      </div>
    </div>
  );
}

// ─── CATEGORY BLOCK ──────────────────────────────────────────────────────────
function CategoryBlock({cat,subcats,habits,todayStr,theme,onComplete,onUndoOne,onDeleteHabit,onRenameHabit,onOpenDrawer,onDeleteCat,onRenameCat,onColorCat,onHideDays,onAddSubcat,onDeleteSubcat,onRenameSubcat,onAddHabit,onAddTask,tasks,onCompleteTask,onUncompleteTask,onDeleteTask,onRenameTask,onUpdateTask,onReorderCat,onReorderHabit,onReorderSubcat}){
  const t=THEMES[theme]||THEMES.hawt;
  const [collapsed,setCollapsed]=useState(cat.collapsed||false);
  const [editing,setEditing]=useState(false);
  const [editVal,setEditVal]=useState(cat.label);
  const [pickingColor,setPickingColor]=useState(false);
  const [addingSubcat,setAddingSubcat]=useState(false);
  const [newSubcatVal,setNewSubcatVal]=useState("");
  const inputRef=useRef(null);
  const newSubcatRef=useRef(null);

  const catColor=cat.color||t.accent;
  const directHabits=habits.filter(h=>h.catId===cat.id&&!h.subId);
  const catTasks=(tasks||[]).filter(t=>{
    if(t.catId!==cat.id) return false;
    if(t.subId) return false;
    if(!t.scheduledFor) return false;
    if(t.done) return t.doneDate===todayStr; // completed tasks only show on their completion day
    // Task with due date: show every day from scheduledFor until done (keep nagging)
    if(t.dueDate) return t.scheduledFor<=todayStr;
    // One-time task no due date: show from scheduled day until checked off
    return t.scheduledFor<=todayStr;
  });
  const catSubcats=subcats.filter(s=>s.catId===cat.id);
  const allHabits=habits.filter(h=>h.catId===cat.id);
  const doneCount=allHabits.filter(h=>isDone(h,todayStr)).length;
  const catTasksAll=(tasks||[]).filter(t=>t.catId===cat.id&&t.scheduledFor<=todayStr&&!t.done&&!t.doneDate);
  const allDone=doneCount===allHabits.length&&allHabits.length>0&&catTasksAll.length===0;
  const totalItems=allHabits.length+catTasksAll.length;
  const doneItems=doneCount+(tasks||[]).filter(t=>t.catId===cat.id&&t.done&&t.doneDate===todayStr).length;

  // Habits inherit category color unless they have their own
  const withCatColor=(h)=>({...h,color:h.color&&!h.isDefault?h.color:catColor});

  const commit=()=>{if(editVal.trim())onRenameCat(cat.id,editVal.trim().toUpperCase());setEditing(false);};
  const commitNewSubcat=()=>{
    const v=newSubcatVal.trim();
    if(v){onAddSubcat({id:uid(),catId:cat.id,label:v.toUpperCase(),collapsed:false});}
    setNewSubcatVal("");setAddingSubcat(false);
  };

  return(
    <div
      draggable
      onDragStart={e=>{e.dataTransfer.setData("catId",cat.id);e.dataTransfer.effectAllowed="move";}}
      onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect="move";}}
      onDrop={e=>{e.preventDefault();const fromId=e.dataTransfer.getData("catId");if(fromId)onReorderCat(fromId,cat.id);}}
      style={{marginBottom:14,border:`2px solid ${t.border}`,boxShadow:`3px 3px 0 ${t.border}`,overflow:"hidden"}}>
      {/* Color picker dropdown */}
      {pickingColor&&(
        <div style={{background:t.bgCard,borderBottom:`2px solid ${t.border}`,padding:"10px 12px"}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:2,marginBottom:8}}>CATEGORY COLOR</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
            {HABIT_COLORS.map(c=>(
              <button key={c} onClick={()=>{onColorCat(cat.id,c);}} style={{width:28,height:28,background:c,border:`3px solid ${catColor===c?t.text:"transparent"}`,cursor:"pointer",transition:"all 0.1s",boxShadow:catColor===c?`0 0 0 1px ${t.border}`:"none"}}/>
            ))}
            <button onClick={()=>{onColorCat(cat.id,null);}} style={{width:28,height:28,background:t.bgCard,border:`2px dashed ${t.border}`,cursor:"pointer",fontSize:10,color:t.textSub,display:"flex",alignItems:"center",justifyContent:"center"}} title="Reset">↺</button>
          </div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:2,marginBottom:6}}>HIDE ON DAYS</div>
          <div style={{display:"flex",gap:4,marginBottom:8}}>
            {["SUN","MON","TUE","WED","THU","FRI","SAT"].map((day,i)=>{
              const hidden=(cat.hideDays||[]).includes(i);
              return <button key={i} onClick={()=>{
                const cur=cat.hideDays||[];
                onHideDays(cat.id,hidden?cur.filter(d=>d!==i):[...cur,i].sort());
              }} style={{flex:1,padding:"6px 0",border:`2px solid ${hidden?t.accent2:t.border}`,background:hidden?t.accent2:t.bgCard,color:hidden?t.textInv:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:9,cursor:"pointer",letterSpacing:0}}>{day}</button>;
            })}
          </div>
          {(cat.hideDays||[]).length>0&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.accent2,letterSpacing:1,marginBottom:4}}>
            HIDDEN ON: {(cat.hideDays||[]).map(d=>["SUN","MON","TUE","WED","THU","FRI","SAT"][d]).join(", ")}
          </div>}
        </div>
      )}
      {/* Category header */}
      <div style={{background:t.bgCard,display:"flex",alignItems:"center",borderBottom:collapsed?`none`:`2px solid ${t.border}`}}>
        {/* Color accent bar */}
        <div style={{width:6,alignSelf:"stretch",background:catColor,flexShrink:0}}/>
        {/* Drag handle */}
        <div className="drag-handle" style={{padding:"12px 8px",cursor:"grab",color:t.textSub,fontSize:14,userSelect:"none",borderRight:`2px solid ${t.border}`,display:"flex",alignItems:"center"}}>⠿</div>
        <button onClick={()=>setCollapsed(c=>!c)} style={{background:"transparent",border:"none",borderRight:`2px solid ${t.border}`,padding:"12px 10px",cursor:"pointer",fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:t.textSub}}>{collapsed?"▶":"▼"}</button>
        {editing
          ?<input ref={inputRef} value={editVal} onChange={e=>setEditVal(e.target.value.toUpperCase())} onBlur={commit} onKeyDown={e=>{if(e.key==="Enter")commit();if(e.key==="Escape")setEditing(false);}} style={{flex:1,fontFamily:"'Black Han Sans',sans-serif",fontSize:18,letterSpacing:4,color:t.accent,background:"transparent",border:"none",borderBottom:`2px solid ${t.accent}`,outline:"none",padding:"12px 14px"}} autoFocus/>
          :<div onClick={()=>setCollapsed(c=>!c)} style={{flex:1,fontFamily:"'Black Han Sans',sans-serif",fontSize:18,color:t.text,letterSpacing:4,padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
            {cat.label}
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:allDone?catColor:t.textSub,letterSpacing:2,fontWeight:400}}>
              {allDone?"ALL DONE ✓":`${doneItems}/${totalItems}`}
            </span>
          </div>}
        {/* Color dot button */}
        <button onClick={()=>setPickingColor(v=>!v)} style={{background:"transparent",border:"none",borderLeft:`2px solid ${t.border}`,padding:"12px 10px",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}} title="Change color">
          <div style={{width:14,height:14,background:catColor,border:`2px solid ${t.border}`,borderRadius:2}}/>
        </button>
        <button onClick={()=>{setEditVal(cat.label);setEditing(true);setTimeout(()=>inputRef.current?.focus(),50);}} style={{background:"transparent",border:"none",borderLeft:`2px solid ${t.border}`,padding:"12px 10px",cursor:"pointer",fontSize:11,color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1}}>EDT</button>
        <button onClick={()=>onDeleteCat(cat.id)} style={{background:"transparent",border:"none",borderLeft:`2px solid ${t.border}`,padding:"12px 12px",cursor:"pointer",fontSize:16,color:t.textSub}}>×</button>
      </div>

      {!collapsed&&(
        <div style={{padding:"12px 12px 6px"}}>
          {/* Subcategories */}
          {catSubcats.map(sub=>{
            const subHabits=habits.filter(h=>h.subId===sub.id).map(withCatColor);
            return(
              <div key={sub.id} draggable
                onDragStart={e=>{e.dataTransfer.setData("subcatId",sub.id);e.dataTransfer.effectAllowed="move";e.stopPropagation();}}
                onDragOver={e=>{e.preventDefault();e.stopPropagation();}}
                onDrop={e=>{e.preventDefault();e.stopPropagation();const fromId=e.dataTransfer.getData("subcatId");if(fromId&&fromId!==sub.id)onReorderSubcat(fromId,sub.id);}}>
                <SubcatBlock subcat={sub} habits={subHabits} tasks={tasks} todayStr={todayStr} theme={theme}
                  onComplete={onComplete} onUndoOne={onUndoOne} onDelete={onDeleteHabit} onRename={onRenameHabit} onOpenDrawer={onOpenDrawer}
                  onDeleteSubcat={onDeleteSubcat} onRenameSubcat={onRenameSubcat}
                  onAddTask={onAddTask} onCompleteTask={onCompleteTask} onUncompleteTask={onUncompleteTask} onDeleteTask={onDeleteTask} onRenameTask={onRenameTask} onUpdateTask={onUpdateTask}/>
              </div>
            );
          })}

          {/* Direct habits — inherit category color, draggable to reorder */}
          {directHabits.map(withCatColor).map(h=>(
            <div key={h.id} draggable
              onDragStart={e=>{e.dataTransfer.setData("habitId",h.id);e.dataTransfer.effectAllowed="move";e.stopPropagation();}}
              onDragOver={e=>{e.preventDefault();e.stopPropagation();}}
              onDrop={e=>{e.preventDefault();e.stopPropagation();const fromId=e.dataTransfer.getData("habitId");if(fromId&&fromId!==h.id)onReorderHabit(fromId,h.id);}}>
              <HabitRow habit={h} onComplete={onComplete} onUndoOne={onUndoOne} onDelete={onDeleteHabit} onRename={onRenameHabit} todayStr={todayStr} theme={theme} onOpenDrawer={onOpenDrawer}/>
            </div>
          ))}

          {/* Tasks for this category */}
          {catTasks.map(task=>(
            <TaskRow key={task.id} task={task} theme={theme}
              onComplete={onCompleteTask} onUncomplete={onUncompleteTask}
              onDelete={onDeleteTask} onRename={onRenameTask} onUpdate={onUpdateTask}/>
          ))}

          {/* Action buttons */}
          <div style={{display:"flex",gap:6,marginTop:6,marginBottom:4}} onDragStart={e=>e.stopPropagation()} onDragOver={e=>e.stopPropagation()} onDrop={e=>e.stopPropagation()}>
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
                <button onClick={e=>{e.stopPropagation();onAddHabit(cat.id,null);}} style={{flex:1,padding:"8px",border:`1.5px dashed ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:2}}>+ HABIT</button>
                <button onClick={e=>{e.stopPropagation();onAddTask(cat.id,null);}} style={{flex:1,padding:"8px",border:`1.5px dashed ${t.accent}66`,background:"transparent",color:t.accent,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:2}}>+ TASK</button>
                <button onClick={e=>{e.stopPropagation();setAddingSubcat(true);setTimeout(()=>newSubcatRef.current?.focus(),50);}} style={{flex:1,padding:"8px",border:`1.5px dashed ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:2}}>+ SUBCAT</button>
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
  const t=THEMES[theme]||THEMES.hawt;
  const [label,setLabel]=useState("");
  const [emoji,setEmoji]=useState("💪");
  const [xp,setXp]=useState(10);
  const [repeat,setRepeat]=useState(1);
  const [schedulePreset,setSchedulePreset]=useState("daily");
  const [customDays,setCustomDays]=useState([]);
  const [selectedCat,setSelectedCat]=useState(catId||cats[0]?.id||"");
  const [selectedSub,setSelectedSub]=useState(subId||"none");
  const availSubs=subcats.filter(s=>s.catId===selectedCat);
  const inp={width:"100%",background:t.bg,border:`2px solid ${t.border}`,padding:"11px 13px",color:t.text,fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,outline:"none",boxSizing:"border-box",marginBottom:10};
  const sel={...inp,appearance:"none",cursor:"pointer"};

  const getSchedule=()=>{
    if(schedulePreset==="daily") return null;
    if(schedulePreset==="weekdays") return [1,2,3,4,5];
    if(schedulePreset==="weekends") return [0,6];
    if(schedulePreset==="eod") return ["EOD"];
    return customDays.length>0?customDays:null;
  };

  const submit=()=>{
    if(!label.trim()||!selectedCat)return;
    onAdd({id:uid(),emoji,label:label.trim().toUpperCase(),catId:selectedCat,subId:selectedSub==="none"?null:selectedSub,color:null,special:null,xp,streak:0,repeat,schedule:getSchedule(),createdDate:TODAY(),completedDates:[],isDefault:false});
    onClose();
  };

  const scheduleLabel = schedulePreset==="daily"?"EVERY DAY"
    :schedulePreset==="weekdays"?"MON–FRI"
    :schedulePreset==="weekends"?"SAT & SUN"
    :schedulePreset==="eod"?"EVERY OTHER DAY"
    :customDays.length>0?customDays.map(d=>DAY_NAMES[d]).join(", "):"PICK DAYS";

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:t.bg,padding:24,width:"100%",maxWidth:480,border:`3px solid ${t.border}`,borderBottom:"none",boxShadow:`-6px -6px 0 ${t.border}`,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:22,color:t.text,marginBottom:16,letterSpacing:4}}>NEW HABIT</div>
        <input style={inp} placeholder="HABIT NAME" value={label} onChange={e=>setLabel(e.target.value)} autoFocus/>
        {/* Category */}
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginBottom:4}}>CATEGORY:</div>
        <select style={sel} value={selectedCat} onChange={e=>{setSelectedCat(e.target.value);setSelectedSub("none");}}>
          {cats.map(c=><option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
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
        {/* Schedule */}
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginBottom:6}}>SCHEDULE: <strong style={{color:t.accent}}>{scheduleLabel}</strong></div>
        <div style={{display:"flex",gap:5,marginBottom:schedulePreset==="custom"?8:12,flexWrap:"wrap"}}>
          {[...Object.entries(SCHEDULE_PRESETS),["eod",{label:"EVERY OTHER"}]].map(([key,p])=>(
            <button key={key} onClick={()=>setSchedulePreset(key)} style={{padding:"9px 12px",border:`2px solid ${t.border}`,background:schedulePreset===key?t.accent:t.bgCard,color:schedulePreset===key?t.textInv:t.text,fontFamily:"'Black Han Sans',sans-serif",fontSize:10,cursor:"pointer",letterSpacing:1,boxShadow:schedulePreset===key?`2px 2px 0 ${t.border}`:"none"}}>{p.label}</button>
          ))}
        </div>
        {schedulePreset==="custom"&&<div style={{display:"flex",gap:4,marginBottom:12}}>
          {DAY_NAMES.map((day,i)=>{
            const on=customDays.includes(i);
            return <button key={i} onClick={()=>setCustomDays(prev=>on?prev.filter(d=>d!==i):[...prev,i].sort())} style={{flex:1,padding:"8px 0",border:`2px solid ${on?t.accent:t.border}`,background:on?t.accent:t.bgCard,color:on?t.textInv:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:9,cursor:"pointer",letterSpacing:1,boxShadow:on?`2px 2px 0 ${t.border}`:"none"}}>{day}</button>;
          })}
        </div>}
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
  const t=THEMES[theme]||THEMES.hawt;
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
  const t=THEMES[theme]||THEMES.hawt;
  const [title,setTitle]=useState("");
  const [subtitle,setSubtitle]=useState("");
  const [year,setYear]=useState("");
  const [genre,setGenre]=useState("");
  const [note,setNote]=useState("");
  const isBook=type==="book";
  const isMovie=type==="movie";
  const subtitleLabel=isBook?"AUTHOR *":isMovie?"DIRECTOR (OPTIONAL)":"CREATOR (OPTIONAL)";
  const canAdd=title.trim()&&(!isBook||subtitle.trim());
  const inp={width:"100%",background:t.bg,border:`2px solid ${t.border}`,padding:"10px 12px",color:t.text,fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,outline:"none",boxSizing:"border-box",marginBottom:8};
  const submit=()=>{if(!canAdd)return;onAdd({title:title.trim(),subtitle:subtitle.trim()||null,year:year.trim()||null,rating:null,genre:genre.trim()||null,source:null,url:"",note:note.trim()});};
  return(
    <div>
      <input style={inp} placeholder="TITLE *" value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} autoFocus/>
      <input style={{...inp,border:`2px solid ${isBook&&!subtitle.trim()?t.accent+"88":t.border}`}} placeholder={subtitleLabel} value={subtitle} onChange={e=>setSubtitle(e.target.value)}/>
      <div style={{display:"flex",gap:8}}>
        <input style={{...inp,flex:1}} placeholder="YEAR (OPTIONAL)" value={year} onChange={e=>setYear(e.target.value)}/>
        <input style={{...inp,flex:1}} placeholder="GENRE (OPTIONAL)" value={genre} onChange={e=>setGenre(e.target.value)}/>
      </div>
      <input style={{...inp,marginBottom:10}} placeholder="NOTE (OPTIONAL)" value={note} onChange={e=>setNote(e.target.value)}/>
      {isBook&&!subtitle.trim()&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.accent,letterSpacing:1,marginBottom:8}}>↑ AUTHOR IS REQUIRED FOR BOOKS</div>}
      <button onClick={submit} disabled={!canAdd} style={{width:"100%",padding:"11px",border:`2px solid ${t.border}`,background:canAdd?t.addBtn:"transparent",color:canAdd?t.addBtnText:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:13,cursor:canAdd?"pointer":"default",letterSpacing:3,boxShadow:canAdd?`2px 2px 0 ${t.border}`:"none",opacity:canAdd?1:0.45}}>ADD MANUALLY</button>
    </div>
  );
}

// ─── SHORT LINK FORM ─────────────────────────────────────────────────────────
function ShortLinkForm({type,source,url,note,setNote,onAdd,theme}){
  const t=THEMES[theme]||THEMES.hawt;
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
// ─── TV MANUAL FORM ──────────────────────────────────────────────────────────
const STREAMING = ["Netflix","HBO Max","Hulu","Apple TV+","Prime Video","Disney+","Peacock","Paramount+","Showtime","AMC+","Other"];
function TvManualForm({onAdd, theme, t, inp, lbl}) {
  const [title,setTitle]=useState("");
  const [platform,setPlatform]=useState("");
  const [year,setYear]=useState("");
  const [note,setNote]=useState("");
  const submit=()=>{
    if(!title.trim())return;
    onAdd({title:title.trim(),subtitle:platform.trim()||null,year:year.trim()||null,rating:null,genre:null,source:platform.trim()||"TV",url:"",note:note.trim()});
  };
  return(
    <div>
      <input style={inp} placeholder="SHOW TITLE" value={title} onChange={e=>setTitle(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submit()} autoFocus/>
      <div style={lbl}>STREAMING PLATFORM</div>
      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
        {STREAMING.map(s=>(
          <button key={s} onClick={()=>setPlatform(platform===s?"":s)} style={{padding:"5px 10px",border:`1.5px solid ${platform===s?t.accent:t.border}`,background:platform===s?t.accent:"transparent",color:platform===s?t.textInv:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:1,boxShadow:platform===s?`1px 1px 0 ${t.border}`:"none"}}>{s}</button>
        ))}
      </div>
      <input style={inp} placeholder="YEAR (OPTIONAL)" value={year} onChange={e=>setYear(e.target.value)}/>
      <input style={{...inp,marginBottom:10}} placeholder="NOTE (OPTIONAL)" value={note} onChange={e=>setNote(e.target.value)}/>
      <button onClick={submit} disabled={!title.trim()} style={{width:"100%",padding:"11px",border:`2px solid ${t.border}`,background:title.trim()?t.addBtn:"transparent",color:title.trim()?t.addBtnText:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:13,cursor:title.trim()?"pointer":"default",letterSpacing:3,boxShadow:title.trim()?`2px 2px 0 ${t.border}`:"none",opacity:title.trim()?1:0.45}}>ADD SHOW</button>
    </div>
  );
}

function AddModal({type,onAdd,onClose,theme}){
  const t=THEMES[theme]||THEMES.hawt;
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
          <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:22,color:t.text,letterSpacing:4,marginBottom:14}}>{type==="movie"?"🎬 ADD FILM":type==="tv"?"📺 ADD TV SHOW":"📖 ADD BOOK"}</div>
          {type!=="tv"&&<div style={{display:"flex",gap:6,marginBottom:16}}>{tabBtn("url","PASTE URL")}{tabBtn("search","SEARCH TITLE")}{tabBtn("manual","MANUAL")}</div>}
          {type==="tv"&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginBottom:16}}>ADD MANUALLY — SEARCH NOT AVAILABLE FOR TV</div>}
        </div>
        <div style={{padding:"0 20px 16px",overflowY:"auto",flex:1}}>
          {type==="tv"&&<TvManualForm onAdd={addItem} theme={theme} t={t} inp={inp} lbl={lbl}/>}
          {type!=="tv"&&mode==="url"&&<>
            <div style={lbl}>{type==="movie"?"LETTERBOXD OR ANY LINK":"GOODREADS OR ANY LINK"}</div>
            <div style={{display:"flex",gap:6,marginBottom:urlHint?4:12}}>
              <input style={{...inp,flex:1}} placeholder={type==="movie"?"letterboxd.com/film/...":"goodreads.com/book/..."} value={urlVal} onChange={e=>setUrlVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doImport()} autoFocus/>
              <button onClick={doImport} disabled={!urlVal.trim()||status==="loading"} style={{padding:"11px 14px",border:`2px solid ${t.border}`,background:t.addBtn,color:t.addBtnText,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:1,opacity:!urlVal.trim()?0.4:1,boxShadow:`2px 2px 0 ${t.border}`,flexShrink:0,whiteSpace:"nowrap"}}>{status==="loading"?"...":"IMPORT"}</button>
            </div>
            {urlHint&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.accent,letterSpacing:2,marginBottom:10}}>{urlHint} detected</div>}
          </>}
          {type!=="tv"&&mode==="search"&&<>
            <div style={lbl}>SEARCH BY TITLE</div>
            <div style={{display:"flex",gap:6,marginBottom:12}}>
              <input style={{...inp,flex:1}} placeholder={type==="movie"?"e.g. Mulholland Drive":"e.g. Normal People"} value={searchVal} onChange={e=>setSearchVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doSearch()} autoFocus/>
              <button onClick={doSearch} disabled={!searchVal.trim()||status==="loading"} style={{padding:"11px 14px",border:`2px solid ${t.border}`,background:t.addBtn,color:t.addBtnText,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:1,opacity:!searchVal.trim()?0.4:1,boxShadow:`2px 2px 0 ${t.border}`,flexShrink:0}}>{status==="loading"?"...":"GO"}</button>
            </div>
          </>}
          {type!=="tv"&&mode==="manual"&&<ManualAddForm type={type} onAdd={addItem} theme={theme}/>}

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
  const t=THEMES[current]||THEMES.hawt;
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


// ─── WEEKLY SUMMARY ───────────────────────────────────────────────────────────
function WeeklySummary({habits, totalXP, onClose, theme, t}) {
  // Get Mon-Sun of current week
  const today = new Date();
  const dow = today.getDay(); // 0=Sun
  const monday = new Date(today); monday.setDate(today.getDate() - (dow===0?6:dow-1));
  const days = Array.from({length:7},(_,i)=>{ const d=new Date(monday); d.setDate(monday.getDate()+i); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; });
  const dayNames=["MON","TUE","WED","THU","FRI","SAT","SUN"];

  const weekXP = habits.reduce((sum,h)=>sum+days.reduce((s,d)=>s+(isDone(h,d)?h.xp:h.repeat>1?Math.floor(h.xp/h.repeat)*getCount(h,d):0),0),0);
  const perfectDays = days.filter(d=>habits.filter(h=>isScheduledFor(h,d)).every(h=>isDone(h,d))).length;
  const totalScheduled = days.reduce((s,d)=>s+habits.filter(h=>isScheduledFor(h,d)).length,0);
  const totalDone = days.reduce((s,d)=>s+habits.filter(h=>isDone(h,d)).length,0);
  const pct = totalScheduled>0?Math.round(totalDone/totalScheduled*100):0;

  const topStreaks = [...habits].filter(h=>h.streak>0).sort((a,b)=>b.streak-a.streak).slice(0,3);

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:t.bg,width:"100%",maxWidth:500,border:`3px solid ${t.border}`,borderBottom:"none",boxShadow:`-6px -6px 0 ${t.border}`,maxHeight:"88vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"20px 20px 16px",borderBottom:`2px solid ${t.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:22,color:t.text,letterSpacing:4}}>WEEKLY RECAP</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginTop:2}}>{monday.toLocaleDateString("en-US",{month:"short",day:"numeric"})} — {new Date(days[6]+"T12:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})}</div>
          </div>
          <button onClick={onClose} style={{background:"transparent",border:`2px solid ${t.border}`,padding:"6px 12px",cursor:"pointer",fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:t.textSub,letterSpacing:1}}>✕</button>
        </div>
        <div style={{padding:"16px 20px"}}>
          {/* Big stats */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:16}}>
            {[
              {label:"COMPLETION",value:`${pct}%`,sub:`${totalDone}/${totalScheduled}`},
              {label:"XP EARNED",value:weekXP,sub:"this week"},
              {label:"PERFECT DAYS",value:perfectDays,sub:"out of 7"},
            ].map(s=>(
              <div key={s.label} style={{background:t.bgCard,border:`2px solid ${t.border}`,padding:"12px 10px",boxShadow:`2px 2px 0 ${t.border}`,textAlign:"center"}}>
                <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:22,color:t.accent,letterSpacing:1}}>{s.value}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,color:t.textSub,letterSpacing:2,marginTop:2}}>{s.label}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,color:t.textSub,letterSpacing:1}}>{s.sub}</div>
              </div>
            ))}
          </div>
          {/* Day grid */}
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:2,marginBottom:6}}>DAILY BREAKDOWN</div>
          <div style={{display:"flex",gap:4,marginBottom:16}}>
            {days.map((d,i)=>{
              const scheduled=habits.filter(h=>isScheduledFor(h,d));
              const done=scheduled.filter(h=>isDone(h,d)).length;
              const pct2=scheduled.length>0?done/scheduled.length:0;
              const isToday=d===TODAY();
              return(
                <div key={d} style={{flex:1,textAlign:"center"}}>
                  <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,color:isToday?t.accent:t.textSub,letterSpacing:1,marginBottom:4}}>{dayNames[i]}</div>
                  <div style={{height:48,background:t.bgCard,border:`1.5px solid ${isToday?t.accent:t.border}`,display:"flex",alignItems:"flex-end",overflow:"hidden",boxShadow:isToday?`1px 1px 0 ${t.accent}`:`1px 1px 0 ${t.border}`}}>
                    <div style={{width:"100%",background:pct2===1?t.accent:pct2>0?t.accent+"88":t.border,height:`${Math.max(pct2*100,pct2>0?8:0)}%`,transition:"height 0.4s ease"}}/>
                  </div>
                  <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:9,color:pct2===1?t.accent:t.textSub,marginTop:3,letterSpacing:1}}>{done}/{scheduled.length}</div>
                </div>
              );
            })}
          </div>
          {/* Top streaks */}
          {topStreaks.length>0&&<>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:2,marginBottom:6}}>TOP STREAKS</div>
            {topStreaks.map(h=>(
              <div key={h.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,background:t.bgCard,border:`2px solid ${t.border}`,padding:"10px 12px",boxShadow:`2px 2px 0 ${t.border}`}}>
                <span style={{fontSize:18}}>{h.emoji}</span>
                <div style={{flex:1,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:t.text,letterSpacing:2}}>{h.label}</div>
                <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:18,color:t.accent2}}>🔥{h.streak}</div>
              </div>
            ))}
          </>}
          {/* Motivational line */}
          <div style={{marginTop:16,padding:"12px 14px",border:`2px solid ${t.accent}`,background:`${t.accent}11`,textAlign:"center"}}>
            <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:13,color:t.accent,letterSpacing:3}}>
              {pct===100?"PERFECT WEEK. ACTUAL LEGEND. 🏆":pct>=80?"GREAT WEEK. ALMOST THERE. 💪":pct>=50?"SOLID EFFORT. KEEP GOING. 🔥":"EVERY DAY IS A NEW SHOT. LET'S GO. ✨"}
            </div>
          </div>
        </div>
        <div style={{padding:"0 20px 20px"}}>
          <button onClick={onClose} style={{width:"100%",padding:"11px",border:`2px solid ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:3}}>CLOSE</button>
        </div>
      </div>
    </div>
  );
}

// ─── BACKUP PANEL ─────────────────────────────────────────────────────────────
function BackupPanel({theme, state, gdriveStatus, setGdriveStatus, onRestoreGdrive, onExport, onImport, importRef}) {
  const t = THEMES[theme]||THEMES.hawt;
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
function CalendarView({habits,theme}){
  const t=THEMES[theme]||THEMES.hawt;
  const todayActual=TODAY();
  const [calOffset,setCalOffset]=useState(0); // 0=current month, -1=last month etc
  const [selectedDay,setSelectedDay]=useState(null);

  const refDate=new Date();
  refDate.setDate(1);
  refDate.setMonth(refDate.getMonth()+calOffset);
  const year=refDate.getFullYear();
  const month=refDate.getMonth();
  const monthLabel=refDate.toLocaleDateString("en-US",{month:"long",year:"numeric"}).toUpperCase();

  const daysInMonth=new Date(year,month+1,0).getDate();
  const firstDow=new Date(year,month,1).getDay(); // 0=Sun
  const toStr=(d)=>`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

  const getDayPct=(dateStr)=>{
    const scheduled=habits.filter(h=>isScheduledFor(h,dateStr));
    if(!scheduled.length) return null;
    const done=scheduled.filter(h=>isDone(h,dateStr)).length;
    return done/scheduled.length;
  };

  const selectedStr=selectedDay?toStr(selectedDay):null;
  const selectedHabits=selectedStr?habits.filter(h=>isScheduledFor(h,selectedStr)):[];
  const DAY_NAMES=["SUN","MON","TUE","WED","THU","FRI","SAT"];

  return(
    <div>
      {/* Month nav */}
      <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:14,border:`2px solid ${t.border}`,boxShadow:`2px 2px 0 ${t.border}`}}>
        <button onClick={()=>{setCalOffset(o=>o-1);setSelectedDay(null);}} style={{background:"transparent",border:"none",borderRight:`2px solid ${t.border}`,padding:"10px 14px",cursor:"pointer",fontFamily:"'Black Han Sans',sans-serif",fontSize:14,color:t.textSub}}>◀</button>
        <div style={{flex:1,textAlign:"center",fontFamily:"'Black Han Sans',sans-serif",fontSize:14,color:t.text,letterSpacing:3,padding:"10px"}}>{monthLabel}</div>
        <button onClick={()=>{setCalOffset(o=>Math.min(0,o+1));setSelectedDay(null);}} disabled={calOffset===0} style={{background:"transparent",border:"none",borderLeft:`2px solid ${t.border}`,padding:"10px 14px",cursor:calOffset===0?"default":"pointer",fontFamily:"'Black Han Sans',sans-serif",fontSize:14,color:calOffset===0?t.border:t.textSub}}>▶</button>
      </div>

      {/* Day of week headers */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:2}}>
        {DAY_NAMES.map(d=><div key={d} style={{textAlign:"center",fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,color:t.textSub,letterSpacing:1,padding:"4px 0"}}>{d}</div>)}
      </div>

      {/* Calendar grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:16}}>
        {Array.from({length:firstDow},(_,i)=><div key={`e${i}`}/>)}
        {Array.from({length:daysInMonth},(_,i)=>{
          const day=i+1;
          const dateStr=toStr(day);
          const pct=getDayPct(dateStr);
          const isToday=dateStr===todayActual;
          const isFuture=dateStr>todayActual;
          const isSel=selectedDay===day;
          const bg=isFuture?"transparent":pct===null?"transparent":pct===1?t.accent:pct>0?t.accent+"66":t.bgCard;
          return(
            <div key={day} onClick={()=>!isFuture&&setSelectedDay(isSel?null:day)} style={{
              aspectRatio:"1",display:"flex",alignItems:"center",justifyContent:"center",
              background:bg,
              border:`${isToday||isSel?"2px":"1px"} solid ${isSel?t.accent2:isToday?t.accent:isFuture?t.border+"44":pct===1?t.accent:t.border}`,
              cursor:isFuture?"default":"pointer",
              position:"relative",
              opacity:isFuture?0.3:1,
              boxShadow:isSel?`2px 2px 0 ${t.accent2}`:"none",
              transition:"all 0.1s"
            }}>
              <span style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:11,color:pct===1?t.textInv:isToday?t.accent:t.text,letterSpacing:0}}>{day}</span>
            </div>
          );
        })}
      </div>

      {/* Selected day detail */}
      {selectedStr&&(
        <div style={{border:`2px solid ${t.accent}`,boxShadow:`3px 3px 0 ${t.accent}`,marginBottom:16}}>
          <div style={{background:`${t.accent}18`,borderBottom:`2px solid ${t.accent}`,padding:"8px 12px"}}>
            <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:13,color:t.accent,letterSpacing:3}}>
              {new Date(selectedStr+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric"}).toUpperCase()}
            </div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginTop:2}}>
              {selectedHabits.filter(h=>isDone(h,selectedStr)).length}/{selectedHabits.length} HABITS DONE
            </div>
          </div>
          <div style={{padding:"8px 12px"}}>
            {selectedHabits.map(h=>{
              const done=isDone(h,selectedStr);
              const cnt=getCount(h,selectedStr);
              return(
                <div key={h.id} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:`1px solid ${t.border}`}}>
                  <span style={{fontSize:16}}>{h.emoji}</span>
                  <div style={{flex:1,fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:done?t.text:t.textSub,letterSpacing:1}}>{h.label}</div>
                  <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:11,color:done?t.accent:t.textSub}}>
                    {done?"✓":h.repeat>1?`${cnt}/${h.repeat}`:"✗"}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── TRY TAB ─────────────────────────────────────────────────────────────────
const PLACE_CATS = ["🍽️ Restaurant","☕ Cafe","🍸 Bar","🛍️ Store","🛒 Grocery","🌿 Park","🎨 Art/Culture","🎵 Music/Venue","💆 Wellness","🎭 Entertainment","📦 Other"];
const PLACE_VIBES = ["🌅 Breakfast","🥂 Brunch","🍝 Casual Dinner","🕯️ Nice Dinner","⚡ Quick Lunch","💼 Sit-down Lunch","🪩 Shaking Ass","🔥 Hotties","🌙 Late Night","🏖️ Outdoor","🤫 Hidden Gem","💸 Splurge","💰 Budget","👨‍👩‍👧 Family","🥳 Special Occasion"];

async function searchPlace(query, locationHint) {
  try {
    const body = { query };
    if (locationHint) body.near = locationHint;
    const r = await fetch("/api/places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (data.error) {
      console.warn("Foursquare error:", data.error, data.detail || "");
      return { error: data.error };
    }
    if (data.places?.length) return data.places;
    return [];
  } catch (e) {
    console.warn("searchPlace failed:", e);
    return [];
  }
}

async function fetchPlaceMeta(url) {
  const isMaps = url.includes("maps.google") || url.includes("maps.app.goo.gl") || url.includes("goo.gl/maps") || url.includes("g.co/");
  
  if (isMaps) {
    // Google Maps blocks server-side fetching — extract what we can from URL params
    // then ask Claude to identify the place from any info in the URL
    let placeHint = "";
    try {
      // Extract place name from URLs like /place/Name+of+Place/
      const placeMatch = url.match(/\/place\/([^/@]+)/);
      if (placeMatch) placeHint = decodeURIComponent(placeMatch[1].replace(/\+/g," "));
      // Extract from query param ?q=Name
      const qMatch = url.match(/[?&]q=([^&]+)/);
      if (!placeHint && qMatch) placeHint = decodeURIComponent(qMatch[1].replace(/\+/g," "));
    } catch {}
    
    if (placeHint) {
      // We have a name — look it up properly
      const res = await claudeJSON(`I have a Google Maps link for a place called: "${placeHint}"
Return JSON with everything you know about it: {"name":string,"category":string,"city":string,"neighborhood":string,"address":string,"description":string}
Be as specific as possible with neighborhood. If unsure of exact location details, make your best inference.`);
      return res;
    } else {
      // Short/opaque Maps link — return a signal to show manual fallback
      return { _mapsShortLink: true };
    }
  }
  
  // Non-Maps URL — try to fetch the page
  try {
    const r = await fetch("/api/claude", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({mode:"fetch-url", url})
    });
    const pageData = await r.json();
    if (pageData.error) return null;
    return claudeJSON(`Extract place info from this webpage.
Final URL after redirect: ${pageData.finalUrl||url}
Page title: ${pageData.ogTitle||pageData.title||""}
Description: ${pageData.ogDesc||""}
Page text: ${pageData.bodySnippet||""}
Return JSON: {"name":string,"category":string,"city":string,"neighborhood":string,"address":string,"description":string}
Extract as much as possible. Name is required.`);
  } catch { return null; }
}

function EditPlaceModal({place, onSave, onDelete, onClose, theme, t, uid, existingCities, existingNeighborhoods}) {
  const [form,setForm]=useState({
    name:place.name||"",category:place.category||PLACE_CATS[0],
    vibes:place.vibes||[],
    city:place.city||"",neighborhood:place.neighborhood||"",
    address:place.address||"",description:place.description||"",url:place.url||""
  });
  const [newVibe,setNewVibe]=useState("");
  const fld=(k,v)=>setForm(p=>({...p,[k]:v}));
  const inp={width:"100%",background:t.bg,border:`2px solid ${t.border}`,padding:"11px 13px",color:t.text,fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,outline:"none",boxSizing:"border-box",marginBottom:8};
  const lbl={fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:2,marginBottom:4};
  const cityNeighborhoods=form.city.trim()?(existingNeighborhoods[form.city.trim()]||[]):Object.values(existingNeighborhoods).flat();
  const canSave=form.name.trim()&&form.city.trim();
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:t.bg,width:"100%",maxWidth:500,border:`3px solid ${t.border}`,borderBottom:"none",boxShadow:`-6px -6px 0 ${t.border}`,maxHeight:"92vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"18px 18px 12px",borderBottom:`2px solid ${t.border}`,flexShrink:0}}>
          <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:20,color:t.text,letterSpacing:4}}>✏️ EDIT PLACE</div>
        </div>
        <div style={{padding:"14px 18px",overflowY:"auto",flex:1}}>
          <input style={{...inp,fontSize:15,fontFamily:"'Black Han Sans',sans-serif",letterSpacing:2,marginBottom:10}} placeholder="PLACE NAME *" value={form.name} onChange={e=>fld("name",e.target.value)} autoFocus/>
          <div style={{display:"flex",gap:8}}>
            <div style={{flex:1}}>
              <div style={lbl}>CITY *</div>
              <AutocompleteInput value={form.city} onChange={v=>{fld("city",v);fld("neighborhood","");}} options={existingCities} placeholder="e.g. Los Angeles" style={inp} theme={theme} t={t}/>
            </div>
            <div style={{flex:1}}>
              <div style={lbl}>NEIGHBORHOOD</div>
              <AutocompleteInput value={form.neighborhood} onChange={v=>fld("neighborhood",v)} options={cityNeighborhoods} placeholder="e.g. Silver Lake" style={inp} theme={theme} t={t}/>
            </div>
          </div>
          <div style={lbl}>TYPE</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
            {PLACE_CATS.map(c=>{
              const active=form.category===c;
              const emoji=c.split(" ")[0];
              const label=c.split(" ").slice(1).join(" ");
              return(
                <button key={c} onClick={()=>fld("category",c)} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 10px",border:`2px solid ${active?t.accent:t.border}`,background:active?t.accent:t.bgCard,color:active?t.textInv:t.text,fontFamily:"'Black Han Sans',sans-serif",fontSize:10,letterSpacing:1,cursor:"pointer",boxShadow:active?`2px 2px 0 ${t.border}`:"none",transform:active?"translateY(-1px)":"none",transition:"all 0.1s"}}>
                  <span style={{fontSize:14}}>{emoji}</span><span>{label}</span>
                </button>
              );
            })}
          </div>
          <div style={lbl}>VIBE <span style={{opacity:0.5}}>(OPTIONAL — SELECT MULTIPLE)</span></div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
            {PLACE_VIBES.map(v=>{
              const on=form.vibes.includes(v);
              return <button key={v} onClick={()=>fld("vibes",on?form.vibes.filter(x=>x!==v):[...form.vibes,v])} style={{padding:"5px 9px",border:`1.5px solid ${on?t.accent:t.border}`,background:on?t.accent:"transparent",color:on?t.textInv:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:1,boxShadow:on?`1px 1px 0 ${t.border}`:"none"}}>{v}</button>;
            })}
          </div>
          {/* Custom vibe */}
          <div style={{display:"flex",gap:6,marginBottom:10}}>
            <input style={{...inp,flex:1,marginBottom:0,fontSize:11}} placeholder="+ ADD YOUR OWN VIBE" value={newVibe} onChange={e=>setNewVibe(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newVibe.trim()){fld("vibes",[...form.vibes,newVibe.trim()]);setNewVibe("");}}}/>
            {newVibe.trim()&&<button onClick={()=>{fld("vibes",[...form.vibes,newVibe.trim()]);setNewVibe("");}} style={{padding:"8px 12px",border:`2px solid ${t.border}`,background:t.addBtn,color:t.addBtnText,fontFamily:"'Black Han Sans',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:1}}>ADD</button>}
          </div>
          <div style={lbl}>ADDRESS <span style={{opacity:0.5}}>(OPTIONAL)</span></div>
          <input style={inp} placeholder="123 Main St" value={form.address} onChange={e=>fld("address",e.target.value)}/>
          <div style={lbl}>NOTES <span style={{opacity:0.5}}>(OPTIONAL)</span></div>
          <input style={inp} placeholder="get the #3, cash only, go at lunch..." value={form.description} onChange={e=>fld("description",e.target.value)}/>
          <div style={lbl}>LINK <span style={{opacity:0.5}}>(OPTIONAL)</span></div>
          <input style={{...inp,marginBottom:0}} placeholder="yelp.com/... maps.google.com/..." value={form.url} onChange={e=>fld("url",e.target.value)}/>
        </div>
        <div style={{padding:"12px 18px 18px",flexShrink:0,borderTop:`2px solid ${t.border}`}}>
          {onDelete&&<button onClick={()=>{if(window.confirm(`Delete "${place.name}"?`)){onDelete(place.id);onClose();}}} style={{width:"100%",padding:"10px",border:`2px solid ${t.accent2}`,background:"transparent",color:t.accent2,fontFamily:"'Black Han Sans',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:2,marginBottom:8}}>🗑 DELETE PLACE</button>}
          <div style={{display:"flex",gap:8}}>
            <button onClick={onClose} style={{flex:1,padding:"12px",border:`2px solid ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:2}}>CANCEL</button>
            <button onClick={()=>canSave&&onSave({...place,...form,name:form.name.trim(),city:form.city.trim(),neighborhood:form.neighborhood.trim()})} disabled={!canSave} style={{flex:2,padding:"12px",border:`2px solid ${t.border}`,background:canSave?t.addBtn:"transparent",color:canSave?t.addBtnText:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:13,cursor:canSave?"pointer":"default",letterSpacing:3,boxShadow:canSave?`3px 3px 0 ${t.border}`:"none",opacity:canSave?1:0.4}}>SAVE</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Rating modal shown after marking visited
function RatingModal({place, onRate, onSkip, theme, t}) {
  const [rating,setRating]=useState(0);
  const [note,setNote]=useState("");
  const [photo,setPhoto]=useState(null);
  const photoRef=useRef(null);

  const handlePhoto=(e)=>{
    const file=e.target.files?.[0];
    if(!file)return;
    // Compress to max 400px wide before storing as base64
    const img=new Image();
    const url=URL.createObjectURL(file);
    img.onload=()=>{
      const canvas=document.createElement("canvas");
      const MAX=400;
      const scale=Math.min(1,MAX/img.width,MAX/img.height);
      canvas.width=img.width*scale;
      canvas.height=img.height*scale;
      canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
      setPhoto(canvas.toDataURL("image/jpeg",0.7));
      URL.revokeObjectURL(url);
    };
    img.src=url;
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1001,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 16px"}} onClick={onSkip}>
      <div style={{background:t.bg,width:"100%",maxWidth:400,border:`3px solid ${t.border}`,boxShadow:`6px 6px 0 ${t.border}`,padding:24,maxHeight:"90vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
        <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:18,color:t.text,letterSpacing:3,marginBottom:4}}>HOW WAS IT?</div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,color:t.textSub,letterSpacing:2,marginBottom:16}}>{place.name}</div>
        {/* Stars */}
        <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:16}}>
          {[1,2,3,4,5].map(s=>(
            <button key={s} onClick={()=>setRating(s)} style={{fontSize:32,background:"none",border:"none",cursor:"pointer",opacity:s<=rating?1:0.25,transform:s<=rating?"scale(1.1)":"scale(1)",transition:"all 0.1s"}}>★</button>
          ))}
        </div>
        <input style={{width:"100%",background:t.bgCard,border:`2px solid ${t.border}`,padding:"10px 12px",color:t.text,fontSize:12,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,outline:"none",boxSizing:"border-box",marginBottom:10}} placeholder="LEAVE A NOTE (OPTIONAL)" value={note} onChange={e=>setNote(e.target.value)}/>
        {/* Photo upload */}
        <input ref={photoRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
        {photo
          ?<div style={{marginBottom:12,position:"relative"}}>
            <img src={photo} style={{width:"100%",border:`2px solid ${t.border}`,display:"block"}} alt="visit"/>
            <button onClick={()=>setPhoto(null)} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,0.7)",border:"none",color:"#fff",width:24,height:24,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
          </div>
          :<button onClick={()=>photoRef.current?.click()} style={{width:"100%",padding:"10px",border:`2px dashed ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:2,marginBottom:12}}>📷 ADD A PHOTO (OPTIONAL)</button>
        }
        <div style={{display:"flex",gap:8}}>
          <button onClick={onSkip} style={{flex:1,padding:"11px",border:`2px solid ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:2}}>SKIP</button>
          <button onClick={()=>onRate(rating,note,photo)} disabled={rating===0} style={{flex:2,padding:"11px",border:`2px solid ${t.border}`,background:rating>0?t.addBtn:"transparent",color:rating>0?t.addBtnText:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:rating>0?"pointer":"default",letterSpacing:2,boxShadow:rating>0?`2px 2px 0 ${t.border}`:"none",opacity:rating>0?1:0.4}}>SAVE</button>
        </div>
      </div>
    </div>
  );
}

function PlaceCard({place, onToggle, onDelete, onEdit, onUpdate, theme, t, existingCities, existingNeighborhoods}) {
  const [editing,setEditing]=useState(false);
  const [showRating,setShowRating]=useState(false);
  const [expanded,setExpanded]=useState(false);
  const catEmoji = place.category?.split(" ")?.[0] || "📍";

  const handleToggle=()=>{
    if(!place.visited){
      onToggle(place.id);
      setShowRating(true);
    } else {
      onToggle(place.id);
    }
  };

  const handleRate=(rating,note,photo)=>{
    onUpdate({...place,visited:true,rating:rating||null,visitNote:note||null,visitPhoto:photo||null,visitedDate:TODAY()});
    setShowRating(false);
  };

  return (
    <>
    {editing&&<EditPlaceModal
      place={place}
      onSave={updated=>{onEdit(updated);setEditing(false);}}
      onDelete={(id)=>{onDelete(id);setEditing(false);}}
      onClose={()=>setEditing(false)}
      theme={theme} t={t} uid={()=>place.id}
      existingCities={existingCities||[]}
      existingNeighborhoods={existingNeighborhoods||{}}
    />}
    {showRating&&<RatingModal place={place} onRate={handleRate} onSkip={()=>setShowRating(false)} theme={theme} t={t}/>}
    <div style={{border:`2px solid ${place.listType==="favorite"?t.accent2:t.border}`,marginBottom:8,boxShadow:`2px 2px 0 ${place.listType==="favorite"?t.accent2:t.border}`,overflow:"hidden"}}>
      {/* Collapsed row */}
      <div style={{background:place.visited?t.bgCard:t.bg,display:"flex",alignItems:"stretch",cursor:"pointer"}} onClick={()=>setExpanded(e=>!e)}>
        <div style={{width:6,background:place.listType==="favorite"?t.accent2:`${t.accent}44`,flexShrink:0}}/>
        <div style={{width:40,flexShrink:0,background:place.visited?t.border:`${t.accent}18`,borderRight:`2px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{catEmoji}</div>
        <div style={{flex:1,padding:"10px 12px",minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:1}}>
            <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:13,color:place.visited?t.textSub:t.text,letterSpacing:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",flex:1}}>{place.name}</div>
            {place.listType==="favorite"&&<span style={{fontSize:12,flexShrink:0}}>❤️</span>}
          </div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:1,marginTop:1,display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
            {place.neighborhood&&<span style={{color:t.accent}}>📍{place.neighborhood}</span>}
            {place.category&&<span style={{background:`${t.accent}18`,padding:"0 4px",border:`1px solid ${t.border}`}}>{place.category}</span>}
            {place.rating&&<span style={{color:"#f1c40f"}}>{"★".repeat(place.rating)}{"☆".repeat(5-place.rating)}</span>}
            {place.vibes?.length>0&&place.vibes.slice(0,2).map((v,i)=><span key={i} style={{background:`${t.accent2}18`,padding:"0 4px",border:`1px solid ${t.accent2}44`,color:t.accent2,fontSize:9}}>{v.split(" ").slice(1).join(" ")||v}</span>)}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",borderLeft:`2px solid ${t.border}`,flexShrink:0}}>
          <button onClick={e=>{e.stopPropagation();handleToggle();}} style={{flex:1,width:44,background:place.visited?t.accent:"transparent",border:"none",borderBottom:`1px solid ${t.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,color:place.visited?t.textInv:t.textSub}}>✓</button>
          <button onClick={e=>{e.stopPropagation();onUpdate({...place,listType:place.listType==="favorite"?"wishlist":"favorite"});}} style={{flex:1,width:44,background:"none",border:"none",borderBottom:`1px solid ${t.border}`,color:place.listType==="favorite"?t.accent2:t.textSub,cursor:"pointer",fontSize:15,display:"flex",alignItems:"center",justifyContent:"center"}}>❤</button>
          <button onClick={e=>{e.stopPropagation();setEditing(true);}} style={{flex:1,width:44,background:"none",border:"none",color:t.textSub,cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,letterSpacing:1,display:"flex",alignItems:"center",justifyContent:"center"}}>EDIT</button>
        </div>
      </div>

      {/* Expanded detail panel */}
      {expanded&&(
        <div style={{borderTop:`2px solid ${t.border}`,background:t.bgCard,padding:"12px 14px"}}>
          {place.visitPhoto&&<img src={place.visitPhoto} alt="visit" style={{width:"100%",marginBottom:10,border:`1px solid ${t.border}`,display:"block",maxHeight:200,objectFit:"cover"}}/>}
          {place.visitNote&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.text,letterSpacing:1,marginBottom:8,fontStyle:"italic",lineHeight:1.5}}>"{place.visitNote}"</div>}
          {place.description&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.textSub,letterSpacing:1,marginBottom:8,lineHeight:1.5}}>{place.description}</div>}
          {place.vibes?.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
            {place.vibes.map((v,i)=><span key={i} style={{background:`${t.accent2}18`,padding:"3px 8px",border:`1px solid ${t.accent2}44`,color:t.accent2,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:1}}>{v}</span>)}
          </div>}
          {place.address&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:1,marginBottom:place.url?6:0,display:"flex",gap:6,alignItems:"center"}}>
            <span>📍</span><span>{place.address}</span>
          </div>}
          {place.url&&<a href={place.url} target="_blank" rel="noopener noreferrer" style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.accent2,textDecoration:"none",display:"flex",gap:6,alignItems:"center",letterSpacing:1}}>
            <span>↗</span><span>{place.url.replace(/^https?:\/\//,"").slice(0,50)}</span>
          </a>}
          {place.visitedDate&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:1,marginTop:8}}>VISITED {place.visitedDate}</div>}
        </div>
      )}
    </div>
    </>
  );
}

// ─── AUTOCOMPLETE INPUT ───────────────────────────────────────────────────────
function AutocompleteInput({value, onChange, options, placeholder, style, theme, t}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value||"");
  const ref = useRef(null);

  // Sync if parent value changes
  useEffect(()=>{ setQuery(value||""); },[value]);

  // Close on outside click
  useEffect(()=>{
    const handler = e => { if(ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return ()=>document.removeEventListener("mousedown", handler);
  },[]);

  const filtered = query.trim()
    ? options.filter(o=>o.toLowerCase().includes(query.toLowerCase())).slice(0,8)
    : options.slice(0,8);

  const select = (val) => {
    setQuery(val);
    onChange(val);
    setOpen(false);
  };

  return(
    <div ref={ref} style={{position:"relative"}}>
      <input
        style={style}
        placeholder={placeholder}
        value={query}
        autoComplete="off"
        onChange={e=>{ setQuery(e.target.value); onChange(e.target.value); setOpen(true); }}
        onFocus={()=>setOpen(true)}
        onKeyDown={e=>{
          if(e.key==="Escape") setOpen(false);
          if(e.key==="Enter"&&filtered.length>0){ select(filtered[0]); e.preventDefault(); }
        }}
      />
      {open&&filtered.length>0&&(
        <div style={{position:"absolute",top:"100%",left:0,right:0,background:t.bg,border:`2px solid ${t.accent}`,borderTop:"none",zIndex:100,maxHeight:200,overflowY:"auto",boxShadow:`3px 3px 0 ${t.border}`}}>
          {filtered.map((o,i)=>(
            <div key={i} onMouseDown={()=>select(o)} style={{padding:"9px 12px",fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,color:t.text,letterSpacing:2,cursor:"pointer",borderBottom:`1px solid ${t.border}`,background:"transparent",transition:"background 0.1s"}}
              onMouseEnter={e=>e.currentTarget.style.background=`${t.accent}22`}
              onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              {o}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddPlaceModal({onAdd, onClose, theme, t, uid, existingCities, existingNeighborhoods, lockedCity}) {
  const [form,setForm]=useState({name:"",category:PLACE_CATS[0],vibes:[],city:lockedCity||"",neighborhood:"",address:"",description:"",url:""});
  const [newVibe,setNewVibe]=useState("");
  const fld=(k,v)=>setForm(p=>({...p,[k]:v}));
  const inp={width:"100%",background:t.bg,border:`2px solid ${t.border}`,padding:"11px 13px",color:t.text,fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,outline:"none",boxSizing:"border-box",marginBottom:8};
  const lbl={fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:2,marginBottom:4};
  const canAdd=form.name.trim()&&(lockedCity||form.city.trim());

  const cityNeighborhoods = form.city.trim()
    ? (existingNeighborhoods[form.city.trim()] || [])
    : Object.values(existingNeighborhoods).flat();

  const add=()=>{
    if(!canAdd)return;
    onAdd({id:uid(),name:form.name.trim(),category:form.category,vibes:form.vibes,city:lockedCity||form.city.trim(),neighborhood:form.neighborhood.trim(),address:form.address.trim(),description:form.description.trim(),url:form.url.trim(),visited:false,addedDate:new Date().toISOString().split("T")[0]});
    onClose();
  };
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:t.bg,width:"100%",maxWidth:500,border:`3px solid ${t.border}`,borderBottom:"none",boxShadow:`-6px -6px 0 ${t.border}`,maxHeight:"92vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"18px 18px 12px",borderBottom:`2px solid ${t.border}`,flexShrink:0}}>
          <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:20,color:t.text,letterSpacing:4}}>📍 ADD A PLACE</div>
        </div>
        <div style={{padding:"14px 18px",overflowY:"auto",flex:1}}>
          <input style={{...inp,fontSize:15,fontFamily:"'Black Han Sans',sans-serif",letterSpacing:2,marginBottom:10}} placeholder="PLACE NAME *" value={form.name} onChange={e=>fld("name",e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} autoFocus/>
          {lockedCity
            ? <div style={{marginBottom:8}}>
                <div style={lbl}>NEIGHBORHOOD</div>
                <AutocompleteInput
                  value={form.neighborhood}
                  onChange={v=>fld("neighborhood",v)}
                  options={cityNeighborhoods}
                  placeholder="e.g. Silver Lake"
                  style={inp}
                  theme={theme} t={t}
                />
              </div>
            : <div style={{display:"flex",gap:8}}>
                <div style={{flex:1}}>
                  <div style={lbl}>CITY *</div>
                  <AutocompleteInput
                    value={form.city}
                    onChange={v=>{fld("city",v);fld("neighborhood","");}}
                    options={existingCities}
                    placeholder="e.g. Los Angeles"
                    style={inp}
                    theme={theme} t={t}
                  />
                </div>
                <div style={{flex:1}}>
                  <div style={lbl}>NEIGHBORHOOD</div>
                  <AutocompleteInput
                    value={form.neighborhood}
                    onChange={v=>fld("neighborhood",v)}
                    options={cityNeighborhoods}
                    placeholder="e.g. Silver Lake"
                    style={inp}
                    theme={theme} t={t}
                  />
                </div>
              </div>
          }
          <div style={lbl}>TYPE</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
            {PLACE_CATS.map(c=>{
              const active=form.category===c;
              const emoji=c.split(" ")[0];
              const label=c.split(" ").slice(1).join(" ");
              return(
                <button key={c} onClick={()=>fld("category",c)} style={{display:"flex",alignItems:"center",gap:4,padding:"6px 10px",border:`2px solid ${active?t.accent:t.border}`,background:active?t.accent:t.bgCard,color:active?t.textInv:t.text,fontFamily:"'Black Han Sans',sans-serif",fontSize:10,letterSpacing:1,cursor:"pointer",boxShadow:active?`2px 2px 0 ${t.border}`:"none",transform:active?"translateY(-1px)":"none",transition:"all 0.1s"}}>
                  <span style={{fontSize:14}}>{emoji}</span><span>{label}</span>
                </button>
              );
            })}
          </div>
          <div style={lbl}>VIBE <span style={{opacity:0.5}}>(OPTIONAL — SELECT MULTIPLE)</span></div>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:8}}>
            {PLACE_VIBES.map(v=>{
              const on=form.vibes.includes(v);
              return <button key={v} onClick={()=>fld("vibes",on?form.vibes.filter(x=>x!==v):[...form.vibes,v])} style={{padding:"5px 9px",border:`1.5px solid ${on?t.accent:t.border}`,background:on?t.accent:"transparent",color:on?t.textInv:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:1,boxShadow:on?`1px 1px 0 ${t.border}`:"none"}}>{v}</button>;
            })}
          </div>
          {/* Custom vibe */}
          <div style={{display:"flex",gap:6,marginBottom:10}}>
            <input style={{...inp,flex:1,marginBottom:0,fontSize:11}} placeholder="+ ADD YOUR OWN VIBE" value={newVibe} onChange={e=>setNewVibe(e.target.value)} onKeyDown={e=>{if(e.key==="Enter"&&newVibe.trim()){fld("vibes",[...form.vibes,newVibe.trim()]);setNewVibe("");}}}/>
            {newVibe.trim()&&<button onClick={()=>{fld("vibes",[...form.vibes,newVibe.trim()]);setNewVibe("");}} style={{padding:"8px 12px",border:`2px solid ${t.border}`,background:t.addBtn,color:t.addBtnText,fontFamily:"'Black Han Sans',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:1}}>ADD</button>}
          </div>
          <div style={lbl}>ADDRESS <span style={{opacity:0.5}}>(OPTIONAL)</span></div>
          <input style={inp} placeholder="123 Main St" value={form.address} onChange={e=>fld("address",e.target.value)}/>
          <div style={lbl}>NOTES <span style={{opacity:0.5}}>(OPTIONAL)</span></div>
          <input style={inp} placeholder="get the #3, cash only, go at lunch..." value={form.description} onChange={e=>fld("description",e.target.value)}/>
          <div style={lbl}>LINK <span style={{opacity:0.5}}>(OPTIONAL)</span></div>
          <input style={{...inp,marginBottom:0}} placeholder="yelp.com/... maps.google.com/..." value={form.url} onChange={e=>fld("url",e.target.value)}/>
        </div>
        <div style={{padding:"12px 18px 18px",flexShrink:0,borderTop:`2px solid ${t.border}`}}>
          {!canAdd&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:1,marginBottom:8,textAlign:"center"}}>NAME AND CITY REQUIRED</div>}
          <div style={{display:"flex",gap:8}}>
            <button onClick={onClose} style={{flex:1,padding:"12px",border:`2px solid ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:2}}>CANCEL</button>
            <button onClick={add} disabled={!canAdd} style={{flex:2,padding:"12px",border:`2px solid ${t.border}`,background:canAdd?t.addBtn:"transparent",color:canAdd?t.addBtnText:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:13,cursor:canAdd?"pointer":"default",letterSpacing:3,boxShadow:canAdd?`3px 3px 0 ${t.border}`:"none",opacity:canAdd?1:0.4}}>ADD PLACE</button>
          </div>
        </div>
      </div>
    </div>
  );
}


// Suggested starter cities — shown on landing screen
const STARTER_CITIES = [
  {name:"NEW YORK",emoji:"🗽"},
  {name:"LOS ANGELES",emoji:"🌴"},
  {name:"TOKYO",emoji:"🗼"},
  {name:"LONDON",emoji:"💂"},
  {name:"PARIS",emoji:"🥐"},
  {name:"MEXICO CITY",emoji:"🌮"},
  {name:"MIAMI",emoji:"🌊"},
  {name:"CHICAGO",emoji:"🍕"},
  {name:"BERLIN",emoji:"🍺"},
  {name:"BARCELONA",emoji:"🎨"},
  {name:"SEOUL",emoji:"🌸"},
  {name:"SYDNEY",emoji:"🦘"},
];

// City view — places for one city with filters
function CityView({city, places, setPlaces, theme, t, uid, onBack, cityEmoji}) {
  const [showAdd,setShowAdd]=useState(false);
  const [showShare,setShowShare]=useState(false);
  const [filterNeighborhood,setFilterNeighborhood]=useState("ALL");
  const [filterCat,setFilterCat]=useState("ALL");
  const [search,setSearch]=useState("");
  const [showVisited,setShowVisited]=useState(false);

  const cityPlaces=places.filter(p=>p.city===city);
  const neighborhoods=["ALL",...[...new Set(cityPlaces.map(p=>p.neighborhood).filter(Boolean))].sort()];
  const cats=[...new Set(cityPlaces.map(p=>p.category).filter(Boolean))].sort();

  const [filterList,setFilterList]=useState("ALL"); // ALL | wishlist | favorite
  const filtered=cityPlaces.filter(p=>{
    if(!showVisited&&p.visited) return false;
    if(filterNeighborhood!=="ALL"&&p.neighborhood!==filterNeighborhood) return false;
    if(filterCat!=="ALL"&&p.category!==filterCat) return false;
    if(filterList==="favorite"&&p.listType!=="favorite") return false;
    if(filterList==="wishlist"&&p.listType==="favorite") return false;
    if(search.trim()&&!`${p.name} ${p.neighborhood} ${p.category} ${p.description}`.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const doneCount=cityPlaces.filter(p=>p.visited).length;

  // Category pill — emoji + label, bold border style
  const CatPill=({cat,active})=>{
    const emoji=cat.split(" ")[0];
    const label=cat.split(" ").slice(1).join(" ");
    return(
      <button onClick={()=>setFilterCat(active?"ALL":cat)} style={{
        display:"flex",alignItems:"center",gap:5,
        padding:"7px 12px",
        border:`2px solid ${active?t.accent:t.border}`,
        background:active?t.accent:t.bgCard,
        color:active?t.textInv:t.text,
        fontFamily:"'Black Han Sans',sans-serif",
        fontSize:11,letterSpacing:2,cursor:"pointer",
        boxShadow:active?`2px 2px 0 ${t.border}`:`1px 1px 0 ${t.border}`,
        whiteSpace:"nowrap",
        transform:active?"translateY(-1px)":"none",
        transition:"all 0.12s",
      }}>
        <span style={{fontSize:14}}>{emoji}</span>
        <span>{label||cat}</span>
      </button>
    );
  };

  return(
    <div>
      {showAdd&&<AddPlaceModal
        onAdd={p=>setPlaces(prev=>[...prev,{...p,city:city}])}
        onClose={()=>setShowAdd(false)}
        theme={theme} t={t} uid={uid}
        lockedCity={city}
        existingCities={[...new Set(places.map(p=>p.city).filter(Boolean))].sort()}
        existingNeighborhoods={places.reduce((acc,p)=>{if(p.city&&p.neighborhood){if(!acc[p.city])acc[p.city]=[];if(!acc[p.city].includes(p.neighborhood))acc[p.city].push(p.neighborhood);}return acc;},{})}
      />}

      {showShare&&<FriendsModeView places={cityPlaces} city={city} cityEmoji={cityEmoji||"📍"} onClose={()=>setShowShare(false)} theme={theme} t={t}/>}
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:14,borderBottom:`2px solid ${t.border}`,paddingBottom:10}}>
        <button onClick={onBack} style={{background:"transparent",border:`2px solid ${t.border}`,borderRight:"none",padding:"8px 12px",cursor:"pointer",fontFamily:"'Black Han Sans',sans-serif",fontSize:13,color:t.textSub,boxShadow:`2px 2px 0 ${t.border}`}}>◀</button>
        <div style={{flex:1,padding:"8px 14px",border:`2px solid ${t.border}`,borderRight:"none",background:t.bgCard,boxShadow:`2px 2px 0 ${t.border}`}}>
          <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:18,color:t.text,letterSpacing:4,lineHeight:1}}>{city}</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginTop:2}}>{cityPlaces.length} PLACES · {doneCount} VISITED</div>
        </div>
        <button onClick={()=>setShowShare(true)} style={{background:"transparent",border:`2px solid ${t.border}`,borderRight:"none",padding:"8px 12px",fontFamily:"'Black Han Sans',sans-serif",fontSize:11,color:t.textSub,cursor:"pointer",letterSpacing:1,alignSelf:"stretch",display:"flex",alignItems:"center"}}>👥</button>
        <button onClick={()=>setShowAdd(true)} style={{background:t.addBtn,border:`2px solid ${t.border}`,padding:"8px 14px",fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:t.addBtnText,cursor:"pointer",letterSpacing:2,boxShadow:`2px 2px 0 ${t.border}`,whiteSpace:"nowrap",alignSelf:"stretch",display:"flex",alignItems:"center"}}>+ ADD</button>
      </div>

      {/* Search */}
      <input style={{width:"100%",background:t.bgCard,border:`2px solid ${t.border}`,padding:"10px 12px",color:t.text,fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,outline:"none",boxSizing:"border-box",marginBottom:10}} placeholder="SEARCH IN THIS CITY..." value={search} onChange={e=>setSearch(e.target.value)}/>

      {/* Neighborhood pills */}
      {neighborhoods.length>2&&<div style={{marginBottom:10}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:2,marginBottom:5}}>NEIGHBORHOOD</div>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          {neighborhoods.map(n=>(
            <button key={n} onClick={()=>setFilterNeighborhood(n)} style={{
              padding:"6px 12px",border:`2px solid ${filterNeighborhood===n?t.accent:t.border}`,
              background:filterNeighborhood===n?t.accent:t.bgCard,
              color:filterNeighborhood===n?t.textInv:t.textSub,
              fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,letterSpacing:2,
              cursor:"pointer",whiteSpace:"nowrap",
              boxShadow:filterNeighborhood===n?`2px 2px 0 ${t.border}`:"none",
              fontWeight:filterNeighborhood===n?700:400,
            }}>{n}</button>
          ))}
        </div>
      </div>}

      {/* Category pills — improved design */}
      {cats.length>0&&<div style={{marginBottom:10}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:2,marginBottom:5}}>TYPE</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
          {cats.map(c=><CatPill key={c} cat={c} active={filterCat===c}/>)}
        </div>
      </div>}

      {/* Count + visited toggle */}
      {cityPlaces.length>0&&<>
        <div style={{display:"flex",gap:5,marginBottom:8}}>
          {[["ALL","ALL"],["wishlist","🗺 WISHLIST"],["favorite","❤️ FAVORITES"]].map(([val,lbl])=>(
            <button key={val} onClick={()=>setFilterList(val)} style={{padding:"5px 10px",border:`1.5px solid ${filterList===val?t.accent:t.border}`,background:filterList===val?t.accent:"transparent",color:filterList===val?t.textInv:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:9,cursor:"pointer",letterSpacing:1,boxShadow:filterList===val?`1px 1px 0 ${t.border}`:"none"}}>{lbl}</button>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2}}>{filtered.length} SHOWING</span>
          <button onClick={()=>setShowVisited(v=>!v)} style={{padding:"5px 10px",border:`1.5px solid ${t.border}`,background:showVisited?t.bgCard:"transparent",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,cursor:"pointer",letterSpacing:1}}>{showVisited?"HIDE VISITED ✓":"SHOW VISITED"}</button>
        </div>
      </>}

      {/* Empty state for this city */}
      {cityPlaces.length===0&&<div style={{textAlign:"center",padding:"40px 20px",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,letterSpacing:2,border:`2px dashed ${t.border}`}}>
        <div style={{fontSize:32,marginBottom:8}}>📍</div>
        NO PLACES IN {city} YET.<br/>HIT + ADD TO START YOUR LIST.
      </div>}

      {/* Places */}
      {filtered.map(p=>(
        <PlaceCard key={p.id} place={p} theme={theme} t={t}
          onToggle={id=>setPlaces(prev=>prev.map(pl=>pl.id===id?{...pl,visited:!pl.visited}:pl))}
          onDelete={id=>setPlaces(prev=>prev.filter(pl=>pl.id!==id))}
          onEdit={updated=>setPlaces(prev=>prev.map(pl=>pl.id===updated.id?updated:pl))}
          onUpdate={updated=>setPlaces(prev=>prev.map(pl=>pl.id===updated.id?updated:pl))}
          existingCities={[...new Set(places.map(p=>p.city).filter(Boolean))].sort()}
          existingNeighborhoods={places.reduce((acc,p)=>{if(p.city&&p.neighborhood){if(!acc[p.city])acc[p.city]=[];if(!acc[p.city].includes(p.neighborhood))acc[p.city].push(p.neighborhood);}return acc;},{})}/>
      ))}
      {cityPlaces.length>0&&filtered.length===0&&<div style={{textAlign:"center",padding:"28px",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,letterSpacing:2,border:`2px dashed ${t.border}`}}>NO MATCHES — TRY CLEARING FILTERS</div>}
    </div>
  );
}

// City emojis stored separately so user can customize without needing places
const CITY_EMOJI_OPTIONS = ["🗽","🌴","🗼","💂","🥐","🌮","🌊","🍕","🍺","🎨","🌸","🦘","🌃","🏙️","🌉","🗺️","✈️","🏖️","🏔️","🌏","🇯🇵","🇺🇸","🇬🇧","🇫🇷","🇮🇹","🇲🇽","🇰🇷","🇦🇺","🇩🇪","🇧🇷"];

function ManageCitiesView({cityList, setCityList, cityEmojis, setCityEmojis, places, onBack, theme, t}) {
  const [editingEmoji,setEditingEmoji]=useState(null);
  const [dragIdx,setDragIdx]=useState(null);   // index being dragged
  const [overIdx,setOverIdx]=useState(null);   // index being hovered over
  const [touchDragIdx,setTouchDragIdx]=useState(null);
  const [touchOverIdx,setTouchOverIdx]=useState(null);
  const listRef=useRef(null);

  const getCityEmoji=(city)=>cityEmojis[city]||(STARTER_CITIES.find(s=>s.name===city)?.emoji)||"📍";

  const removeCity=(city)=>{
    if(!window.confirm(`Remove ${city} from your list? Places in ${city} will also be deleted.`))return;
    setCityList(prev=>prev.filter(c=>c!==city));
  };

  const reorder=(fromIdx,toIdx)=>{
    if(fromIdx===toIdx||toIdx==null)return;
    const l=[...cityList];
    const [moved]=l.splice(fromIdx,1);
    l.splice(toIdx,0,moved);
    setCityList(l);
  };

  // Mouse drag handlers
  const onDragStart=(i)=>setDragIdx(i);
  const onDragEnter=(i)=>setOverIdx(i);
  const onDragEnd=()=>{ reorder(dragIdx,overIdx); setDragIdx(null);setOverIdx(null); };

  // Touch drag handlers
  const onTouchStart=(i,e)=>{
    setTouchDragIdx(i);
    e.currentTarget.style.opacity="0.5";
  };
  const onTouchMove=(e)=>{
    e.preventDefault();
    const touch=e.touches[0];
    const el=document.elementFromPoint(touch.clientX,touch.clientY);
    const row=el?.closest("[data-drag-idx]");
    if(row){
      const idx=parseInt(row.getAttribute("data-drag-idx"));
      if(!isNaN(idx)) setTouchOverIdx(idx);
    }
  };
  const onTouchEnd=(e)=>{
    e.currentTarget.style.opacity="1";
    reorder(touchDragIdx,touchOverIdx??touchDragIdx);
    setTouchDragIdx(null);setTouchOverIdx(null);
  };

  return(
    <div>
      {editingEmoji&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.8)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={()=>setEditingEmoji(null)}>
          <div style={{background:t.bg,width:"100%",maxWidth:480,border:`3px solid ${t.border}`,borderBottom:"none",padding:20,boxShadow:`-6px -6px 0 ${t.border}`}} onClick={e=>e.stopPropagation()}>
            <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:16,color:t.text,letterSpacing:3,marginBottom:14}}>PICK EMOJI FOR {editingEmoji}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:14}}>
              {CITY_EMOJI_OPTIONS.map(e=>(
                <button key={e} onClick={()=>{setCityEmojis(prev=>({...prev,[editingEmoji]:e}));setEditingEmoji(null);}} style={{fontSize:24,width:44,height:44,border:`2px solid ${getCityEmoji(editingEmoji)===e?t.accent:t.border}`,background:getCityEmoji(editingEmoji)===e?t.accent:t.bgCard,cursor:"pointer"}}>{e}</button>
              ))}
            </div>
            <button onClick={()=>setEditingEmoji(null)} style={{width:"100%",padding:"11px",border:`2px solid ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:3}}>CANCEL</button>
          </div>
        </div>
      )}
      <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:16,borderBottom:`2px solid ${t.border}`,paddingBottom:10}}>
        <button onClick={onBack} style={{background:"transparent",border:`2px solid ${t.border}`,borderRight:"none",padding:"8px 12px",cursor:"pointer",fontFamily:"'Black Han Sans',sans-serif",fontSize:13,color:t.textSub,boxShadow:`2px 2px 0 ${t.border}`}}>◀</button>
        <div style={{flex:1,padding:"8px 14px",border:`2px solid ${t.border}`,background:t.bgCard,boxShadow:`2px 2px 0 ${t.border}`}}>
          <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:16,color:t.text,letterSpacing:4}}>MANAGE CITIES</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginTop:1}}>DRAG TO REORDER · TAP EMOJI TO CHANGE · × TO REMOVE</div>
        </div>
      </div>
      <div ref={listRef}>
        {cityList.map((city,i)=>{
          const placeCount=places.filter(p=>p.city===city).length;
          const isOver=(overIdx===i&&dragIdx!==null&&dragIdx!==i)||(touchOverIdx===i&&touchDragIdx!==null&&touchDragIdx!==i);
          const isDragging=dragIdx===i||touchDragIdx===i;
          return(
            <div key={city}
              data-drag-idx={i}
              draggable
              onDragStart={()=>onDragStart(i)}
              onDragEnter={()=>onDragEnter(i)}
              onDragEnd={onDragEnd}
              onDragOver={e=>e.preventDefault()}
              onTouchStart={e=>onTouchStart(i,e)}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              style={{
                display:"flex",alignItems:"center",gap:0,marginBottom:6,
                border:`2px solid ${isOver?t.accent:t.border}`,
                background:isDragging?`${t.accent}18`:t.bgCard,
                boxShadow:isOver?`3px 3px 0 ${t.accent}`:`2px 2px 0 ${t.border}`,
                opacity:isDragging?0.5:1,
                transform:isOver?"translateY(-2px)":"none",
                transition:"transform 0.1s, border-color 0.1s, box-shadow 0.1s",
                touchAction:"none",
                cursor:"grab",
              }}>
              {/* Drag handle */}
              <div style={{borderRight:`2px solid ${t.border}`,padding:"14px 12px",color:t.textSub,fontSize:14,flexShrink:0,userSelect:"none"}}>⠿</div>
              {/* Emoji — tap to change */}
              <button onClick={()=>setEditingEmoji(city)} style={{background:"transparent",border:"none",borderRight:`2px solid ${t.border}`,padding:"12px 14px",cursor:"pointer",fontSize:22,flexShrink:0}}>{getCityEmoji(city)}</button>
              {/* Name + count */}
              <div style={{flex:1,padding:"10px 12px",userSelect:"none"}}>
                <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:14,color:t.text,letterSpacing:2}}>{city}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:1,marginTop:2}}>{placeCount} place{placeCount!==1?"s":""}</div>
              </div>
              {/* Remove */}
              <button onClick={()=>removeCity(city)} style={{background:"transparent",border:"none",borderLeft:`2px solid ${t.border}`,padding:"12px 14px",cursor:"pointer",color:t.textSub,fontSize:16,flexShrink:0}}>×</button>
            </div>
          );
        })}
      </div>
      {cityList.length===0&&<div style={{textAlign:"center",padding:"32px",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,letterSpacing:2,border:`2px dashed ${t.border}`}}>NO CITIES YET</div>}
    </div>
  );
}

// ─── FRIENDS MODE ─────────────────────────────────────────────────────────────
function FriendsModeView({places, city, cityEmoji, onClose, theme, t}) {
  const [mode, setMode] = useState(null); // null | "city" | "neighborhood" | "type"
  const [selected, setSelected] = useState([]);

  // Derived options
  const neighborhoods = [...new Set(places.map(p=>p.neighborhood).filter(Boolean))].sort();
  const types = [...new Set(places.map(p=>p.category).filter(Boolean))].sort();

  const toggle = (val) => setSelected(prev =>
    prev.includes(val) ? prev.filter(x=>x!==val) : [...prev, val]
  );

  // Compute the places to share based on mode + selection
  const sharePlaces = (() => {
    if (!mode) return [];
    if (mode === "city") return places;
    if (mode === "neighborhood") return selected.length ? places.filter(p => selected.includes(p.neighborhood)) : [];
    if (mode === "type") return selected.length ? places.filter(p => selected.includes(p.category)) : [];
    return [];
  })();

  // Build share title
  const shareTitle = (() => {
    if (mode === "city") return `${cityEmoji} ${city}`;
    if (mode === "neighborhood") return selected.length === 1 ? `${cityEmoji} ${selected[0]}` : `${cityEmoji} ${city} — ${selected.join(", ")}`;
    if (mode === "type") return `${cityEmoji} ${city} — ${selected.map(c=>c.split(" ").slice(1).join(" ")||c).join(" + ")}`;
    return `${cityEmoji} ${city}`;
  })();

  const doShare = () => {
    if (!sharePlaces.length) return;
    const lines = [shareTitle, ""];
    sharePlaces.forEach(p => {
      let line = `${p.category?.split(" ")[0]||"📍"} ${p.name}`;
      if (p.neighborhood) line += ` · ${p.neighborhood}`;
      if (p.listType === "favorite") line += " ❤️";
      if (p.rating > 0) line += " " + "★".repeat(p.rating);
      lines.push(line);
    });
    lines.push("", "made with habit mode ✨");
    const text = lines.join("\n");
    if (navigator.share) {
      navigator.share({ title: shareTitle, text }).catch(()=>{});
    } else {
      navigator.clipboard.writeText(text)
        .then(()=>alert("Copied to clipboard!"))
        .catch(()=>prompt("Copy this:", text));
    }
  };

  const modeBtn = (id, label, emoji) => (
    <button onClick={()=>{ setMode(id); setSelected(id==="city"?["all"]:[]);}} style={{
      flex:1, padding:"14px 8px",
      border:`2px solid ${mode===id?t.accent:t.border}`,
      background:mode===id?t.accent:"transparent",
      color:mode===id?t.textInv:t.textSub,
      fontFamily:"'Black Han Sans',sans-serif", fontSize:11,
      cursor:"pointer", letterSpacing:2, textAlign:"center",
      boxShadow:mode===id?`2px 2px 0 ${t.border}`:"none",
      transition:"all 0.12s"
    }}>
      <div style={{fontSize:20,marginBottom:4}}>{emoji}</div>
      <div>{label}</div>
    </button>
  );

  const optionRow = (val, label, sub) => {
    const on = selected.includes(val);
    return (
      <div key={val} onClick={()=>toggle(val)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",border:`2px solid ${on?t.accent:t.border}`,marginBottom:5,cursor:"pointer",background:on?`${t.accent}11`:t.bg,transition:"all 0.1s"}}>
        <div style={{width:20,height:20,border:`2px solid ${on?t.accent:t.border}`,background:on?t.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:t.textInv,flexShrink:0}}>{on?"✓":""}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:t.text,letterSpacing:2}}>{label}</div>
          {sub&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:1,marginTop:1}}>{sub}</div>}
        </div>
      </div>
    );
  };

  const canShare = mode === "city" || (mode && selected.length > 0);

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:t.bg,width:"100%",maxWidth:500,border:`3px solid ${t.border}`,borderBottom:"none",boxShadow:`-6px -6px 0 ${t.border}`,maxHeight:"90vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>

        <div style={{padding:"18px 18px 14px",borderBottom:`2px solid ${t.border}`,flexShrink:0,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:20,color:t.text,letterSpacing:4,marginBottom:2}}>{cityEmoji} {city}</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2}}>SHARE YOUR PICKS</div>
          </div>
          {mode&&<button onClick={()=>{setMode(null);setSelected([]);}} style={{background:"transparent",border:`1.5px solid ${t.border}`,padding:"4px 10px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:1}}>← BACK</button>}
        </div>

        <div style={{padding:"14px 18px",overflowY:"auto",flex:1}}>

          {/* Mode picker */}
          {!mode&&<>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:2,marginBottom:10}}>SHARE BY...</div>
            <div style={{display:"flex",gap:8,marginBottom:16}}>
              {modeBtn("city","WHOLE CITY","🗺️")}
              {neighborhoods.length>0&&modeBtn("neighborhood","NEIGHBORHOOD","📍")}
              {types.length>0&&modeBtn("type","TYPE","🍽️")}
            </div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:1,lineHeight:1.6,padding:"10px 12px",border:`1.5px solid ${t.border}`,background:t.bgCard}}>
              WHOLE CITY shares everything · NEIGHBORHOOD shares one or more areas · TYPE shares by category (restaurants, cafes, etc.)
            </div>
          </>}

          {/* City mode — just confirm */}
          {mode==="city"&&<>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginBottom:10}}>SHARING ALL {places.length} PLACES IN {city}</div>
            {places.map(p=>(
              <div key={p.id} style={{display:"flex",gap:8,padding:"8px 10px",border:`1.5px solid ${t.border}`,marginBottom:4,background:t.bgCard}}>
                <span style={{fontSize:14}}>{p.category?.split(" ")[0]||"📍"}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:11,color:t.text,letterSpacing:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{p.name}</div>
                  {p.neighborhood&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,color:t.textSub,letterSpacing:1}}>📍{p.neighborhood}</div>}
                </div>
                {p.listType==="favorite"&&<span style={{fontSize:11}}>❤️</span>}
              </div>
            ))}
          </>}

          {/* Neighborhood mode */}
          {mode==="neighborhood"&&<>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:2,marginBottom:8}}>PICK NEIGHBORHOODS (can select multiple)</div>
            {neighborhoods.map(n=>{
              const cnt = places.filter(p=>p.neighborhood===n).length;
              return optionRow(n, n, `${cnt} place${cnt!==1?"s":""}`);
            })}
          </>}

          {/* Type mode */}
          {mode==="type"&&<>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:2,marginBottom:8}}>PICK TYPES (can select multiple)</div>
            {types.map(c=>{
              const cnt = places.filter(p=>p.category===c).length;
              const emoji = c.split(" ")[0];
              const label = c.split(" ").slice(1).join(" ")||c;
              return optionRow(c, `${emoji} ${label}`, `${cnt} place${cnt!==1?"s":""}`);
            })}
          </>}

        </div>

        <div style={{padding:"12px 18px 18px",borderTop:`2px solid ${t.border}`,flexShrink:0}}>
          {canShare&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:1,marginBottom:8,textAlign:"center"}}>{sharePlaces.length} PLACES · "{shareTitle}"</div>}
          <button onClick={doShare} disabled={!canShare} style={{width:"100%",padding:"14px",border:`2px solid ${t.border}`,background:canShare?t.addBtn:"transparent",color:canShare?t.addBtnText:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:14,cursor:canShare?"pointer":"default",letterSpacing:3,boxShadow:canShare?`3px 3px 0 ${t.border}`:"none",opacity:canShare?1:0.4,marginBottom:8}}>
            👥 SHARE
          </button>
          <button onClick={onClose} style={{width:"100%",padding:"11px",border:`2px solid ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:3}}>CANCEL</button>
        </div>
      </div>
    </div>
  );
}


function TryTab({places, setPlaces, cityList, setCityList, cityEmojis, setCityEmojis, theme, t, uid}) {
  const [selectedCity,setSelectedCity]=useState(null);
  const [managing,setManaging]=useState(false);
  const [addingCity,setAddingCity]=useState(false);
  const [newCityVal,setNewCityVal]=useState("");
  const newCityInputRef=useRef(null);

  const getCityEmoji=(city)=>cityEmojis[city]||(STARTER_CITIES.find(s=>s.name===city)?.emoji)||"📍";

  // Add city to list if not already there
  const addCity=(name)=>{
    const n=name.trim().toUpperCase();
    if(!n)return;
    if(!cityList.includes(n)) setCityList(prev=>[...prev,n]);
    setSelectedCity(n);
  };

  // Cities with places sorted first, then rest in list order
  const citiesWithPlaces=new Set(places.map(p=>p.city).filter(Boolean));
  const sortedCities=[
    ...cityList.filter(c=>citiesWithPlaces.has(c)),
    ...cityList.filter(c=>!citiesWithPlaces.has(c)),
  ];

  useEffect(()=>{
    if(selectedCity&&!cityList.includes(selectedCity)&&!citiesWithPlaces.has(selectedCity)){
      setSelectedCity(null);
    }
  },[cityList,places]);

  if(managing){
    return <ManageCitiesView cityList={cityList} setCityList={setCityList} cityEmojis={cityEmojis} setCityEmojis={setCityEmojis} places={places} onBack={()=>setManaging(false)} theme={theme} t={t}/>;
  }

  if(selectedCity){
    return <CityView city={selectedCity} places={places} setPlaces={setPlaces} theme={theme} t={t} uid={uid} onBack={()=>setSelectedCity(null)} cityEmoji={getCityEmoji(selectedCity)}/>;
  }

  return(
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,borderBottom:`2px solid ${t.border}`,paddingBottom:10}}>
        <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:22,color:t.text,letterSpacing:4}}>📍 TRY</div>
        <div style={{display:"flex",gap:6}}>
          <button onClick={()=>setManaging(true)} style={{background:"transparent",border:`1.5px solid ${t.border}`,padding:"6px 10px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:1}}>⚙ MANAGE</button>
        </div>
      </div>

      {/* Single unified grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:14}}>
        {sortedCities.map(city=>{
          const hasPlaces=citiesWithPlaces.has(city);
          const cityPlaces=places.filter(p=>p.city===city);
          const visited=cityPlaces.filter(p=>p.visited).length;
          return(
            <button key={city} onClick={()=>setSelectedCity(city)} style={{
              background:hasPlaces?t.bgCard:"transparent",
              border:`2px ${hasPlaces?"solid":"dashed"} ${hasPlaces?t.accent:t.border}`,
              boxShadow:hasPlaces?`3px 3px 0 ${t.accent}`:"none",
              padding:"14px 8px",cursor:"pointer",textAlign:"center",
              transition:"all 0.12s",position:"relative",
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";if(!hasPlaces){e.currentTarget.style.borderColor=t.accent;e.currentTarget.style.borderStyle="solid";}}}
            onMouseLeave={e=>{e.currentTarget.style.transform="none";if(!hasPlaces){e.currentTarget.style.borderColor=t.border;e.currentTarget.style.borderStyle="dashed";}}}>
              <div style={{fontSize:22}}>{getCityEmoji(city)}</div>
              <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:10,color:hasPlaces?t.text:t.textSub,letterSpacing:1,marginTop:4,lineHeight:1.2}}>{city}</div>
              {hasPlaces&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,color:t.accent,letterSpacing:1,marginTop:3}}>{cityPlaces.length} · {visited}✓</div>}
              {hasPlaces&&<div style={{display:"flex",gap:2,justifyContent:"center",marginTop:3}}>
                {[...new Set(cityPlaces.map(p=>p.category?.split(" ")[0]).filter(Boolean))].slice(0,3).map((e,i)=>(<span key={i} style={{fontSize:10}}>{e}</span>))}
              </div>}
            </button>
          );
        })}
      </div>

      {/* Add city */}
      {addingCity
        ?<div style={{display:"flex",gap:6}}>
          <input ref={newCityInputRef} value={newCityVal} onChange={e=>setNewCityVal(e.target.value.toUpperCase())}
            onKeyDown={e=>{if(e.key==="Enter"){addCity(newCityVal);setAddingCity(false);setNewCityVal("");}if(e.key==="Escape"){setAddingCity(false);setNewCityVal("");}}}
            placeholder="CITY NAME" autoFocus
            style={{flex:1,background:t.bg,border:`2px solid ${t.accent}`,padding:"10px 12px",color:t.text,fontFamily:"'Black Han Sans',sans-serif",fontSize:13,letterSpacing:3,outline:"none"}}/>
          <button onClick={()=>{addCity(newCityVal);setAddingCity(false);setNewCityVal("");}} style={{padding:"10px 16px",border:`2px solid ${t.border}`,background:t.addBtn,color:t.addBtnText,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:2,boxShadow:`2px 2px 0 ${t.border}`}}>ADD</button>
          <button onClick={()=>{setAddingCity(false);setNewCityVal("");}} style={{padding:"10px 12px",border:`2px solid ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,cursor:"pointer"}}>✕</button>
        </div>
        :<button onClick={()=>{setAddingCity(true);setTimeout(()=>newCityInputRef.current?.focus(),50);}} style={{width:"100%",padding:"12px",border:`2px dashed ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:3}}>+ ADD A CITY</button>}
    </div>
  );
}

// ─── INSIGHTS TAB ─────────────────────────────────────────────────────────────
function InsightsTab({habits, movies, books, places, totalXP, insights, setInsights, loading, setLoading, theme, t}) {

  const generate = async () => {
    setLoading(true);
    // Build a data summary to send to Claude
    const totalDays = habits.length > 0
      ? Math.ceil((Date.now() - new Date(Math.min(...habits.flatMap(h => h.completedDates.map(d => new Date(typeof d==="string"?d:d.date).getTime())).filter(Boolean))).getTime()) / 86400000)
      : 0;

    const habitSummary = habits.map(h => ({
      name: h.label,
      streak: h.streak,
      completions: h.completedDates.length,
      schedule: h.schedule ? h.schedule.map(d => ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][d]).join(",") : "daily"
    }));

    const dayStats = Array.from({length:7},(_,i) => {
      const done = habits.reduce((s,h) => s + h.completedDates.filter(e => {
        const d = typeof e==="string"?e:e.date;
        return new Date(d+"T12:00:00").getDay()===i;
      }).length, 0);
      return {day:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"][i], completions: done};
    });

    const prompt = `You are analyzing someone's personal habit tracking data. Be warm, specific, and insightful. Don't be generic.

Habit data:
${JSON.stringify(habitSummary, null, 2)}

Day of week completions:
${JSON.stringify(dayStats, null, 2)}

Other stats:
- Total XP: ${totalXP}
- Level: ${Math.floor(totalXP/100)+1}
- Films watched: ${movies.filter(m=>m.done).length} of ${movies.length}
- Books done: ${books.filter(b=>b.done).length} of ${books.length}
- Places visited: ${places.filter(p=>p.visited).length} of ${places.length}

Give me 4-5 short, specific insights about their habits. Each insight should be 1-2 sentences. Be honest about weaknesses but encouraging. Notice patterns, streaks, consistency. Point out what's working and what could improve.

Return JSON array of objects: [{"emoji": string, "title": string, "body": string}]
Use emojis that match the insight tone. Titles should be punchy (3-5 words max).`;

    const result = await claudeJSON(prompt);
    setInsights(Array.isArray(result) ? result : null);
    setLoading(false);
  };

  return (
    <div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,borderBottom:`2px solid ${t.border}`,paddingBottom:10}}>
        <div>
          <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:22,color:t.text,letterSpacing:4}}>✨ INSIGHTS</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginTop:2}}>AI-POWERED ANALYSIS OF YOUR HABITS</div>
        </div>
        <button onClick={generate} disabled={loading} style={{background:t.addBtn,border:`2px solid ${t.border}`,padding:"8px 14px",cursor:loading?"default":"pointer",fontFamily:"'Black Han Sans',sans-serif",fontSize:11,color:t.addBtnText,letterSpacing:2,boxShadow:`2px 2px 0 ${t.border}`,opacity:loading?0.6:1}}>
          {loading?"ANALYZING...":"✨ ANALYZE"}
        </button>
      </div>

      {!insights&&!loading&&(
        <div style={{textAlign:"center",padding:"44px 20px",border:`2px dashed ${t.border}`,color:t.textSub}}>
          <div style={{fontSize:36,marginBottom:12}}>✨</div>
          <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:14,letterSpacing:3,marginBottom:8,color:t.text}}>WHAT'S YOUR DATA SAYING?</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,letterSpacing:2,lineHeight:1.6}}>
            HIT ANALYZE AND CLAUDE WILL LOOK AT<br/>YOUR STREAKS, PATTERNS, AND CONSISTENCY<br/>TO GIVE YOU REAL OBSERVATIONS.
          </div>
        </div>
      )}

      {loading&&(
        <div style={{textAlign:"center",padding:"44px 20px",border:`2px dashed ${t.border}`}}>
          <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:14,color:t.accent,letterSpacing:4}}>READING YOUR DATA...</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:2,marginTop:8}}>THIS TAKES A FEW SECONDS</div>
        </div>
      )}

      {insights&&!loading&&<>
        {insights.map((ins,i)=>(
          <div key={i} style={{background:t.bgCard,border:`2px solid ${t.border}`,padding:"16px 16px",marginBottom:10,boxShadow:`3px 3px 0 ${t.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
              <span style={{fontSize:24}}>{ins.emoji}</span>
              <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:14,color:t.accent,letterSpacing:3}}>{ins.title?.toUpperCase()}</div>
            </div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,color:t.text,letterSpacing:1,lineHeight:1.6}}>{ins.body}</div>
          </div>
        ))}
        <button onClick={()=>setInsights(null)} style={{width:"100%",padding:"10px",border:`2px solid ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:2,marginTop:4}}>CLEAR — ANALYZE AGAIN</button>
      </>}
    </div>
  );
}


// ─── EVENTS TAB ───────────────────────────────────────────────────────────────
const EVENT_CATS = ["🎵 Concert/Show","🍽️ Food/Pop-up","🎨 Art/Gallery","🎭 Theater/Comedy","🏃 Fitness/Wellness","🎉 Party/Social","📚 Talk/Workshop","📦 Other"];

async function fetchRaEvent(eventId) {
  // RA has a GraphQL API we can query directly
  try {
    const query = `{"query":"{ event(id: ${eventId}) { title date startTime venue { name area { name } location { city } } images { filename } } }"}`;
    const r = await fetch("https://ra.co/graphql", {
      method:"POST",
      headers:{"Content-Type":"application/json","Referer":"https://ra.co"},
      body: query
    });
    const data = await r.json();
    const ev = data?.data?.event;
    if(!ev) return null;
    const date = ev.date ? ev.date.split("T")[0] : null;
    const rawTime = ev.startTime;
    let time = "";
    if(rawTime) {
      const [h,m] = rawTime.split(":").map(Number);
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      time = `${h12}:${String(m).padStart(2,"0")} ${ampm}`;
    }
    return {
      title: ev.title,
      date,
      time,
      venue: ev.venue?.name || "",
      neighborhood: ev.venue?.area?.name || "",
      city: ev.venue?.location?.city || "",
      category: "🎵 Concert/Show",
      notes: ""
    };
  } catch { return null; }
}

async function fetchEventMeta(url) {
  // RA special handling — use their GraphQL API
  const raMatch = url.match(/ra\.co\/events\/(\d+)/);
  if(raMatch) {
    const meta = await fetchRaEvent(raMatch[1]);
    if(meta) return {...meta, url};
  }

  // Generic fetch for other sites
  try {
    const r = await fetch("/api/claude", {
      method:"POST", headers:{"Content-Type":"application/json"},
      body: JSON.stringify({mode:"fetch-url", url})
    });
    const pageData = await r.json();
    if(!pageData.ogTitle&&!pageData.bodySnippet) return null;
    return claudeJSON(`Extract event details from this webpage.
Final URL: ${pageData.finalUrl||url}
Title: ${pageData.ogTitle||pageData.title||""}
Description: ${pageData.ogDesc||""}
Text: ${pageData.bodySnippet||""}
Return JSON: {"title":string,"date":string (YYYY-MM-DD format),"time":string (12hr e.g. "8:00 PM"),"venue":string,"neighborhood":string,"city":string,"category":string (one of the types like Concert/Show),"notes":string}
Extract as much as possible. Title is required.`);
  } catch { return null; }
}

function AddEventModal({onAdd, onClose, theme, t}) {
  const [mode,setMode]=useState("url");
  const [urlVal,setUrlVal]=useState("");
  const [status,setStatus]=useState("idle");
  const [preview,setPreview]=useState(null);
  const [form,setForm]=useState({title:"",date:"",time:"",venue:"",neighborhood:"",city:"",category:EVENT_CATS[0],notes:"",url:""});
  const fld=(k,v)=>setForm(p=>({...p,[k]:v}));
  const inp={width:"100%",background:t.bg,border:`2px solid ${t.border}`,padding:"10px 12px",color:t.text,fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:2,outline:"none",boxSizing:"border-box",marginBottom:8};
  const lbl={fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:2,marginBottom:4};

  const doImport=async()=>{
    if(!urlVal.trim())return;
    setStatus("loading");
    const meta=await fetchEventMeta(urlVal.trim());
    if(meta?.title){
      setPreview({...meta,url:urlVal.trim()});
      setStatus("preview");
    } else setStatus("error");
  };

  const addEvent=(e)=>{
    onAdd({id:uid(),title:e.title||"Event",date:e.date||"",time:e.time||"",venue:e.venue||"",neighborhood:e.neighborhood||"",city:e.city||"",category:e.category||EVENT_CATS[0],notes:e.notes||"",url:e.url||urlVal||"",going:false,interested:true,addedDate:TODAY()});
    onClose();
  };

  const tabBtn=(id,lbl2)=>(
    <button onClick={()=>{setMode(id);setStatus("idle");setPreview(null);}} style={{flex:1,padding:"9px",border:`2px solid ${mode===id?t.accent:t.border}`,background:mode===id?t.accent:"transparent",color:mode===id?t.textInv:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:2,boxShadow:mode===id?`2px 2px 0 ${t.border}`:"none"}}>{lbl2}</button>
  );

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.85)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:t.bg,width:"100%",maxWidth:500,border:`3px solid ${t.border}`,borderBottom:"none",boxShadow:`-6px -6px 0 ${t.border}`,maxHeight:"92vh",display:"flex",flexDirection:"column"}} onClick={e=>e.stopPropagation()}>
        <div style={{padding:"18px 18px 12px",borderBottom:`2px solid ${t.border}`,flexShrink:0}}>
          <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:20,color:t.text,letterSpacing:4,marginBottom:12}}>📅 ADD EVENT</div>
          <div style={{display:"flex",gap:6}}>{tabBtn("url","PASTE LINK")}{tabBtn("manual","MANUAL")}</div>
        </div>
        <div style={{padding:"14px 18px",overflowY:"auto",flex:1}}>
          {mode==="url"&&<>
            <div style={lbl}>EVENT URL (RA, EVENTBRITE, INSTAGRAM, ETC)</div>
            <div style={{display:"flex",gap:6,marginBottom:10}}>
              <input style={{...inp,flex:1,marginBottom:0}} placeholder="https://..." value={urlVal} onChange={e=>setUrlVal(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doImport()} autoFocus/>
              <button onClick={doImport} disabled={!urlVal.trim()||status==="loading"} style={{padding:"10px 14px",border:`2px solid ${t.border}`,background:t.addBtn,color:t.addBtnText,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:1,opacity:!urlVal.trim()?0.4:1,boxShadow:`2px 2px 0 ${t.border}`,flexShrink:0}}>{status==="loading"?"...":"IMPORT"}</button>
            </div>
            {status==="loading"&&<div style={{textAlign:"center",padding:"20px",border:`2px dashed ${t.border}`}}><div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:13,color:t.accent,letterSpacing:3}}>EXTRACTING EVENT INFO...</div></div>}
            {status==="error"&&<div style={{padding:"12px",border:`2px solid ${t.accent2}`,background:`${t.accent2}11`,marginBottom:8}}>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.accent2,letterSpacing:2,marginBottom:6}}>COULDN'T READ IT AUTOMATICALLY</div>
      <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:1,marginBottom:8}}>This site requires JavaScript to load — add it manually and paste the link in the URL field.</div>
      <button onClick={()=>{setMode("manual");setStatus("idle");}} style={{width:"100%",padding:"9px",border:`2px solid ${t.border}`,background:t.addBtn,color:t.addBtnText,fontFamily:"'Black Han Sans',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:2}}>FILL IN MANUALLY →</button>
    </div>}
            {status==="preview"&&preview&&(
              <div style={{border:`2px solid ${t.accent}`,boxShadow:`3px 3px 0 ${t.accent}`}}>
                <div style={{background:`${t.accent}18`,borderBottom:`2px solid ${t.accent}`,padding:"7px 12px"}}><span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.accent,letterSpacing:2}}>✓ FOUND IT — REVIEW & CONFIRM</span></div>
                <div style={{padding:"14px"}}>
                  <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:15,color:t.text,letterSpacing:2,marginBottom:6}}>{preview.title}</div>
                  <div style={{display:"flex",flexDirection:"column",gap:4}}>
                    {preview.date&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.textSub,letterSpacing:1}}>📅 {new Date(preview.date+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}{preview.time?" · "+preview.time:""}</div>}
                    {preview.venue&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.textSub,letterSpacing:1}}>📍 {preview.venue}{preview.neighborhood?" · "+preview.neighborhood:""}{preview.city?" · "+preview.city:""}</div>}
                    {preview.category&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.accent,letterSpacing:1}}>{preview.category}</div>}
                    {preview.notes&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:1,marginTop:4,lineHeight:1.5}}>{preview.notes}</div>}
                  </div>
                </div>
                <button onClick={()=>addEvent(preview)} style={{width:"100%",padding:"12px",border:"none",borderTop:`2px solid ${t.accent}`,background:t.accent,color:t.textInv,fontFamily:"'Black Han Sans',sans-serif",fontSize:14,cursor:"pointer",letterSpacing:4}}>+ ADD TO CALENDAR</button>
              </div>
            )}
          </>}
          {mode==="manual"&&<>
            <input style={{...inp,fontFamily:"'Black Han Sans',sans-serif",fontSize:14}} placeholder="EVENT TITLE" value={form.title} onChange={e=>fld("title",e.target.value)} autoFocus/>
            <div style={{display:"flex",gap:8}}>
              <div style={{flex:2}}>
                <div style={lbl}>DATE</div>
                <input type="date" style={{...inp,colorScheme:"dark"}} value={form.date} onChange={e=>fld("date",e.target.value)}/>
              </div>
              <div style={{flex:1}}>
                <div style={lbl}>TIME</div>
                <select style={{...inp,appearance:"none"}} value={form.time} onChange={e=>fld("time",e.target.value)}>
                  <option value="">TBD</option>
                  {["12:00 AM","1:00 AM","2:00 AM","3:00 AM","4:00 AM","5:00 AM","6:00 AM","7:00 AM","8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM","8:00 PM","9:00 PM","10:00 PM","11:00 PM"].map(t2=><option key={t2} value={t2}>{t2}</option>)}
                </select>
              </div>
            </div>
            <div style={lbl}>CATEGORY</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
              {EVENT_CATS.map(c=>{
                const on=form.category===c;
                return <button key={c} onClick={()=>fld("category",c)} style={{padding:"5px 10px",border:`1.5px solid ${on?t.accent:t.border}`,background:on?t.accent:"transparent",color:on?t.textInv:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:9,cursor:"pointer",letterSpacing:1,boxShadow:on?`1px 1px 0 ${t.border}`:"none"}}>{c}</button>;
              })}
            </div>
            <input style={inp} placeholder="VENUE NAME" value={form.venue} onChange={e=>fld("venue",e.target.value)}/>
            <div style={{display:"flex",gap:8}}>
              <input style={{...inp,flex:1}} placeholder="NEIGHBORHOOD" value={form.neighborhood} onChange={e=>fld("neighborhood",e.target.value)}/>
              <input style={{...inp,flex:1}} placeholder="CITY" value={form.city} onChange={e=>fld("city",e.target.value)}/>
            </div>
            <input style={inp} placeholder="NOTES (OPTIONAL)" value={form.notes} onChange={e=>fld("notes",e.target.value)}/>
            <input style={{...inp,marginBottom:0}} placeholder="LINK (OPTIONAL)" value={form.url} onChange={e=>fld("url",e.target.value)}/>
          </>}
        </div>
        <div style={{padding:"12px 18px 18px",flexShrink:0,borderTop:`2px solid ${t.border}`}}>
          {mode==="manual"&&<button onClick={()=>form.title.trim()&&addEvent(form)} disabled={!form.title.trim()} style={{width:"100%",padding:"13px",border:`2px solid ${t.border}`,background:form.title.trim()?t.addBtn:"transparent",color:form.title.trim()?t.addBtnText:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:13,cursor:form.title.trim()?"pointer":"default",letterSpacing:3,boxShadow:form.title.trim()?`3px 3px 0 ${t.border}`:"none",opacity:form.title.trim()?1:0.4,marginBottom:8}}>ADD EVENT</button>}
          <button onClick={onClose} style={{width:"100%",padding:"11px",border:`2px solid ${t.border}`,background:"transparent",color:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:12,cursor:"pointer",letterSpacing:3}}>CANCEL</button>
        </div>
      </div>
    </div>
  );
}

function EventCard({event, onUpdate, onDelete, theme, t}) {
  const [expanded,setExpanded]=useState(false);
  const today=TODAY();
  const isPast=event.date&&event.date<today;
  const catEmoji=event.category?.split(" ")[0]||"📅";

  return(
    <div style={{border:`2px solid ${event.going?t.accent:t.border}`,marginBottom:8,boxShadow:`2px 2px 0 ${event.going?t.accent:t.border}`,overflow:"hidden",opacity:isPast?0.6:1}}>
      <div style={{background:event.going?`${t.accent}11`:t.bg,display:"flex",alignItems:"stretch",cursor:"pointer"}} onClick={()=>setExpanded(e=>!e)}>
        {/* Date block */}
        <div style={{width:52,flexShrink:0,background:event.going?t.accent:t.bgCard,borderRight:`2px solid ${t.border}`,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"8px 4px"}}>
          {event.date
            ?<>
              <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:18,color:event.going?t.textInv:t.text,lineHeight:1}}>{new Date(event.date+"T12:00:00").getDate()}</div>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,color:event.going?t.textInv:t.textSub,letterSpacing:1}}>{new Date(event.date+"T12:00:00").toLocaleDateString("en-US",{month:"short"}).toUpperCase()}</div>
            </>
            :<div style={{fontSize:20}}>{catEmoji}</div>
          }
        </div>
        {/* Info */}
        <div style={{flex:1,padding:"9px 12px",minWidth:0}}>
          <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:13,color:t.text,letterSpacing:2,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{event.title}</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.textSub,letterSpacing:1,marginTop:2,display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
            {event.time&&<span>🕐 {event.time}</span>}
            {event.venue&&<span>📍 {event.venue}{event.neighborhood?" · "+event.neighborhood:""}</span>}
            {event.category&&<span style={{background:`${t.accent}18`,padding:"0 4px",border:`1px solid ${t.border}`,fontSize:9}}>{event.category}</span>}
          </div>
        </div>
        {/* Actions */}
        <div style={{display:"flex",flexDirection:"column",borderLeft:`2px solid ${t.border}`,flexShrink:0}}>
          <button onClick={e=>{e.stopPropagation();onUpdate({...event,going:!event.going,interested:true});}} style={{flex:1,width:44,background:event.going?t.accent:"transparent",border:"none",borderBottom:`1px solid ${t.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:event.going?11:14,color:event.going?t.textInv:t.textSub,fontFamily:"'Black Han Sans',sans-serif",letterSpacing:0}} title="Going">
            {event.going?"GOING":"✓"}
          </button>
          <button onClick={e=>{e.stopPropagation();onUpdate({...event,interested:!event.interested});}} style={{flex:1,width:44,background:event.interested&&!event.going?`${t.accent}22`:"transparent",border:"none",borderBottom:`1px solid ${t.border}`,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,color:event.interested?t.accent:t.textSub}} title="Interested">
            ★
          </button>
          <button onClick={e=>{e.stopPropagation();if(window.confirm("Delete this event?"))onDelete(event.id);}} style={{flex:1,width:44,background:"none",border:"none",color:t.textSub,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center"}}>×</button>
        </div>
      </div>
      {/* Expanded panel */}
      {expanded&&(
        <div style={{borderTop:`2px solid ${t.border}`,background:t.bgCard,padding:"12px 14px"}}>
          {event.date&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.text,letterSpacing:1,marginBottom:6}}>📅 {new Date(event.date+"T12:00:00").toLocaleDateString("en-US",{weekday:"long",month:"long",day:"numeric",year:"numeric"})}{event.time?" · "+event.time:""}</div>}
          {event.venue&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.textSub,letterSpacing:1,marginBottom:4}}>📍 {[event.venue,event.neighborhood,event.city].filter(Boolean).join(" · ")}</div>}
          {event.notes&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.textSub,letterSpacing:1,marginBottom:4,lineHeight:1.5}}>{event.notes}</div>}
          {event.url&&<a href={event.url} target="_blank" rel="noopener noreferrer" style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.accent2,textDecoration:"none",letterSpacing:1,display:"block"}}>↗ {event.url.replace(/^https?:\/\//,"").slice(0,50)}</a>}
        </div>
      )}
    </div>
  );
}

function EventsTab({events, setEvents, theme, t}) {
  const [showAdd,setShowAdd]=useState(false);
  const [view,setView]=useState("upcoming"); // upcoming | calendar | past
  const [calOffset,setCalOffset]=useState(0);
  const [filterCat,setFilterCat]=useState("ALL");
  const today=TODAY();

  const addEvent=(e)=>setEvents(prev=>[...prev,e]);
  const updateEvent=(e)=>setEvents(prev=>prev.map(ev=>ev.id===e.id?e:ev));
  const deleteEvent=(id)=>setEvents(prev=>prev.filter(ev=>ev.id!==id));

  const upcoming=events.filter(e=>!e.date||e.date>=today).sort((a,b)=>a.date?.localeCompare(b.date)||0);
  const past=events.filter(e=>e.date&&e.date<today).sort((a,b)=>b.date.localeCompare(a.date));
  const cats=["ALL",...[...new Set(events.map(e=>e.category).filter(Boolean))].sort()];

  const filtered=(view==="past"?past:upcoming).filter(e=>filterCat==="ALL"||e.category===filterCat);

  // Calendar setup
  const refDate=new Date(); refDate.setDate(1); refDate.setMonth(refDate.getMonth()+calOffset);
  const year=refDate.getFullYear(), month=refDate.getMonth();
  const daysInMonth=new Date(year,month+1,0).getDate();
  const firstDow=new Date(year,month,1).getDay();
  const monthLabel=refDate.toLocaleDateString("en-US",{month:"long",year:"numeric"}).toUpperCase();
  const toStr=(d)=>`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const [calDay,setCalDay]=useState(null);
  const calDayEvents=calDay?events.filter(e=>e.date===toStr(calDay)):[];

  return(
    <div>
      {showAdd&&<AddEventModal onAdd={addEvent} onClose={()=>setShowAdd(false)} theme={theme} t={t}/>}

      {/* Header */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,borderBottom:`2px solid ${t.border}`,paddingBottom:10}}>
        <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:22,color:t.text,letterSpacing:4}}>📅 EVENTS</div>
        <button onClick={()=>setShowAdd(true)} style={{background:t.addBtn,border:`2px solid ${t.border}`,padding:"8px 14px",fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:t.addBtnText,cursor:"pointer",letterSpacing:2,boxShadow:`2px 2px 0 ${t.border}`}}>+ ADD</button>
      </div>

      {/* View switcher */}
      <div style={{display:"flex",gap:0,marginBottom:12,border:`2px solid ${t.border}`,boxShadow:`2px 2px 0 ${t.border}`}}>
        {[["upcoming","📋 UPCOMING"],["calendar","📅 CALENDAR"],["past","🕐 PAST"]].map(([id,lbl],i)=>(
          <button key={id} onClick={()=>setView(id)} style={{flex:1,padding:"9px",border:"none",borderRight:i<2?`2px solid ${t.border}`:"none",background:view===id?t.accent:"transparent",color:view===id?t.textInv:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:10,cursor:"pointer",letterSpacing:1}}>{lbl}</button>
        ))}
      </div>

      {/* Category filter */}
      {cats.length>1&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:10}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setFilterCat(c)} style={{padding:"4px 10px",border:`1.5px solid ${filterCat===c?t.accent:t.border}`,background:filterCat===c?t.accent:"transparent",color:filterCat===c?t.textInv:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,cursor:"pointer",letterSpacing:1,boxShadow:filterCat===c?`1px 1px 0 ${t.border}`:"none"}}>{c==="ALL"?"ALL":c.split(" ").slice(1).join(" ")||c}</button>
        ))}
      </div>}

      {/* CALENDAR VIEW */}
      {view==="calendar"&&<>
        <div style={{display:"flex",alignItems:"center",gap:0,marginBottom:10,border:`2px solid ${t.border}`,boxShadow:`2px 2px 0 ${t.border}`}}>
          <button onClick={()=>{setCalOffset(o=>o-1);setCalDay(null);}} style={{background:"transparent",border:"none",borderRight:`2px solid ${t.border}`,padding:"9px 13px",cursor:"pointer",fontSize:14,color:t.textSub}}>◀</button>
          <div style={{flex:1,textAlign:"center",fontFamily:"'Black Han Sans',sans-serif",fontSize:13,color:t.text,letterSpacing:3}}>{monthLabel}</div>
          <button onClick={()=>{setCalOffset(o=>o+1);setCalDay(null);}} style={{background:"transparent",border:"none",borderLeft:`2px solid ${t.border}`,padding:"9px 13px",cursor:"pointer",fontSize:14,color:t.textSub}}>▶</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:4}}>
          {["S","M","T","W","T","F","S"].map((d,i)=><div key={i} style={{textAlign:"center",fontFamily:"'Barlow Condensed',sans-serif",fontSize:9,color:t.textSub,padding:"3px 0"}}>{d}</div>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2,marginBottom:12}}>
          {Array.from({length:firstDow},(_,i)=><div key={`e${i}`}/>)}
          {Array.from({length:daysInMonth},(_,i)=>{
            const day=i+1, dateStr=toStr(day);
            const dayEvents=events.filter(e=>e.date===dateStr);
            const isToday2=dateStr===today;
            const isSel=calDay===day;
            return(
              <div key={day} onClick={()=>setCalDay(isSel?null:day)} style={{aspectRatio:"1",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:1,border:`${isToday2||isSel?"2px":"1px"} solid ${isSel?t.accent2:isToday2?t.accent:t.border}`,background:isSel?`${t.accent2}18`:isToday2?`${t.accent}18`:t.bg,cursor:"pointer",position:"relative",transition:"all 0.1s"}}>
                <span style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:11,color:isSel?t.accent2:isToday2?t.accent:t.text}}>{day}</span>
                {dayEvents.length>0&&<div style={{display:"flex",gap:1,justifyContent:"center",flexWrap:"wrap"}}>
                  {dayEvents.slice(0,3).map((e,i)=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:e.going?t.accent:t.accent+"88"}}/>)}
                </div>}
              </div>
            );
          })}
        </div>
        {/* Selected day events */}
        {calDay&&calDayEvents.length>0&&calDayEvents.map(e=>(
          <EventCard key={e.id} event={e} theme={theme} t={t} onUpdate={updateEvent} onDelete={deleteEvent}/>
        ))}
        {calDay&&calDayEvents.length===0&&<div style={{textAlign:"center",padding:"16px",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,letterSpacing:2}}>NO EVENTS THIS DAY</div>}
      </>}

      {/* LIST VIEW (upcoming + past) */}
      {view!=="calendar"&&<>
        {filtered.length===0
          ?<div style={{textAlign:"center",padding:"44px 20px",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,letterSpacing:2,border:`2px dashed ${t.border}`}}>
            <div style={{fontSize:36,marginBottom:10}}>📅</div>
            {view==="past"?"NO PAST EVENTS YET":"NO UPCOMING EVENTS — ADD ONE!"}
          </div>
          :filtered.map(e=>(
            <EventCard key={e.id} event={e} theme={theme} t={t} onUpdate={updateEvent} onDelete={deleteEvent}/>
          ))
        }
      </>}
    </div>
  );
}


// ─── ONBOARDING TOUR ──────────────────────────────────────────────────────────
function OnboardingTour({onDone, theme}) {
  const t=THEMES[theme]||THEMES.hawt;
  const [step,setStep]=useState(0);
  const steps=[
    {emoji:"👋",title:"WELCOME TO HABIT MODE",body:"Your personal dashboard for habits, tasks, places, media, and events — all in one app.",cta:"LET'S GO →"},
    {emoji:"☀️",title:"TODAY TAB",body:"Check off daily habits, add one-time tasks, and scroll through past or future days with the arrows.",cta:"GOT IT →"},
    {emoji:"📍",title:"TRY TAB",body:"Build your personal city guide. Add restaurants, cafes, bars and stores — organized by city and neighborhood.",cta:"NICE →"},
    {emoji:"🎬",title:"MEDIA TAB",body:"Track films, TV shows and books. Import from Letterboxd or Goodreads with a link, or add manually.",cta:"COOL →"},
    {emoji:"📅",title:"EVENTS TAB",body:"Save concerts, pop-ups and events. Paste a link to auto-import details, or add manually.",cta:"AWESOME →"},
    {emoji:"📊",title:"LOG TAB",body:"See your stats, streaks, and habit history. Settings and themes live here too.",cta:"START TRACKING 🔥"},
  ];
  const s=steps[step];
  const isLast=step===steps.length-1;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.92)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center",padding:"0 24px"}}>
      <div style={{background:t.bg,width:"100%",maxWidth:400,border:`3px solid ${t.border}`,boxShadow:`8px 8px 0 ${t.border}`,overflow:"hidden"}}>
        {/* Progress bar */}
        <div style={{height:4,background:t.bgCard}}>
          <div style={{height:"100%",background:t.accent,width:`${((step+1)/steps.length)*100}%`,transition:"width 0.3s ease"}}/>
        </div>
        <div style={{padding:"32px 28px"}}>
          <div style={{fontSize:52,marginBottom:16,textAlign:"center"}}>{s.emoji}</div>
          <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:22,color:t.text,letterSpacing:4,marginBottom:12,whiteSpace:"pre-line",textAlign:"center",lineHeight:1.2}}>{s.title}</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,color:t.textSub,letterSpacing:1,lineHeight:1.7,textAlign:"center",marginBottom:28}}>{s.body}</div>
          {/* Step dots */}
          <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:24}}>
            {steps.map((_,i)=><div key={i} style={{width:i===step?20:6,height:6,background:i===step?t.accent:t.border,transition:"all 0.3s",borderRadius:3}}/>)}
          </div>
          <button onClick={()=>isLast?onDone():setStep(s=>s+1)} style={{width:"100%",padding:"14px",border:`2px solid ${t.border}`,background:t.addBtn,color:t.addBtnText,fontFamily:"'Black Han Sans',sans-serif",fontSize:14,cursor:"pointer",letterSpacing:4,boxShadow:`3px 3px 0 ${t.border}`}}>{s.cta}</button>
          {!isLast&&<button onClick={onDone} style={{width:"100%",padding:"10px",border:"none",background:"transparent",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:2,marginTop:8}}>SKIP TOUR</button>}
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
  const [tasks,setTasks]=useState([]); // one-time tasks
  const [events,setEvents]=useState([]);
  const [movies,setMovies]=useState([]);
  const [books,setBooks]=useState([]);
  const [tvshows,setTvshows]=useState([]);
  const [totalXP,setTotalXP]=useState(0);
  const [places,setPlaces]=useState([]);
  const [cityList,setCityList]=useState(STARTER_CITIES.map(c=>c.name)); // ordered list of all cities
  const [cityEmojis,setCityEmojis]=useState({}); // {cityName: customEmoji}
  const [watchSubtab,setWatchSubtab]=useState("movies"); // movies|books|tv
  const [theme,setTheme]=useState("hawt");
  const [tab,setTab]=useState("today");
  const [confetti,setConfetti]=useState(false);
  const [flash,setFlash]=useState(false);
  const [toast,setToast]=useState({show:false,msg:"",emoji:""});
  const [milestone,setMilestone]=useState({show:false,streak:0});
  const [addModal,setAddModal]=useState(null);
  const [addHabitCtx,setAddHabitCtx]=useState(null); // {catId,subId}
  const [addTaskCtx,setAddTaskCtx]=useState(null); // {catId,subId}
  const [showTheme,setShowTheme]=useState(false);
  const [openDrawer,setOpenDrawer]=useState(null);
  const [addingCat,setAddingCat]=useState(false);
  const [newCatVal,setNewCatVal]=useState("");
  const [loaded,setLoaded]=useState(false);
  const [showOnboarding,setShowOnboarding]=useState(false);
  const [gdriveStatus,setGdriveStatus]=useState("idle"); // idle|connecting|connected|error
  const [showBackup,setShowBackup]=useState(false);
  const [pendingDelete,setPendingDelete]=useState(null);
  const pendingDeleteTimer=useRef(null);
  const [showWeekly,setShowWeekly]=useState(false);
  const [viewOffset,setViewOffset]=useState(0); // 0=today, -1=yesterday, etc.
  const sounds=useSounds();
  const todayStr=TODAY();
  // viewDate: the date currently being viewed — uses local time to match todayStr
  const viewDate=(()=>{
    const d=new Date();
    d.setDate(d.getDate()+viewOffset);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
  })();
  const isToday=viewOffset===0;
  const isPast=viewOffset<0;
  const viewDateLabel=isToday?"TODAY":viewOffset===-1?"YESTERDAY":viewOffset===1?"TOMORROW":new Date(viewDate+"T12:00:00").toLocaleDateString("en-US",{weekday:"long"}).toUpperCase();
  const t=THEMES[theme]||THEMES.hawt;
  const newCatRef=useRef(null);
  const importRef=useRef(null);

  useEffect(()=>{load().then(saved=>{if(saved){setCats(saved.cats||DEFAULT_DATA.categories);setSubcats(saved.subcats||DEFAULT_DATA.subcategories);setHabits(saved.habits||DEFAULT_DATA.habits);setTasks(saved.tasks||DEFAULT_DATA.tasks||[]);setEvents(saved.events||[]);setMovies(saved.movies||[]);setBooks(saved.books||[]);setTvshows(saved.tvshows||[]);setPlaces(saved.places||[]);setCityList(saved.cityList||STARTER_CITIES.map(c=>c.name));setCityEmojis(saved.cityEmojis||{});setTotalXP(saved.totalXP||0);setTheme(saved.theme||"hawt");}else{setShowOnboarding(true);}setLoaded(true);});},[]);
  useEffect(()=>{
    if(!loaded)return;
    const state={cats,subcats,habits,tasks,events,movies,books,tvshows,places,cityList,cityEmojis,totalXP,theme};
    save(state);
    // Auto-backup to Google Drive (debounced — only after 3s of no changes)
    if(gdriveStatus==="connected"){
      clearTimeout(window._gdriveBackupTimer);
      window._gdriveBackupTimer=setTimeout(()=>pushGdriveBackup(state,setGdriveStatus),3000);
    }
  },[cats,subcats,habits,tasks,events,movies,books,places,cityList,cityEmojis,totalXP,theme,loaded]);

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
  const scheduleDelete=(label,doDelete)=>{
    clearTimeout(pendingDeleteTimer.current);
    const snap={cats:[...cats],subcats:[...subcats],habits:[...habits]};
    doDelete();
    setPendingDelete({label,undo:()=>{setCats(snap.cats);setSubcats(snap.subcats);setHabits(snap.habits);setPendingDelete(null);clearTimeout(pendingDeleteTimer.current);}});
    pendingDeleteTimer.current=setTimeout(()=>setPendingDelete(null),6000);
  };
  const deleteCat=(id)=>{
    const cat=cats.find(c=>c.id===id);
    const hc=habits.filter(h=>h.catId===id).length;
    if(!window.confirm(`Delete "${cat?.label}"${hc>0?` and its ${hc} habit${hc!==1?"s":""}`:""}? This can't be undone.`)) return;
    scheduleDelete(cat?.label||"category",()=>{setCats(p=>p.filter(c=>c.id!==id));setSubcats(p=>p.filter(s=>s.catId!==id));setHabits(p=>p.filter(h=>h.catId!==id));});
  };
  const renameCat=(id,label)=>setCats(p=>p.map(c=>c.id===id?{...c,label}:c));
  const reorderSubcats=(fromId,toId)=>{
    if(fromId===toId)return;
    setSubcats(prev=>{
      const arr=[...prev];
      const fi=arr.findIndex(s=>s.id===fromId),ti=arr.findIndex(s=>s.id===toId);
      if(fi<0||ti<0)return prev;
      const [item]=arr.splice(fi,1);arr.splice(ti,0,item);return arr;
    });
  };
  const reorderCats=(fromId,toId)=>{
    if(fromId===toId)return;
    setCats(prev=>{
      const arr=[...prev];
      const fi=arr.findIndex(c=>c.id===fromId),ti=arr.findIndex(c=>c.id===toId);
      if(fi<0||ti<0)return prev;
      const [item]=arr.splice(fi,1);arr.splice(ti,0,item);return arr;
    });
  };
  const reorderHabits=(fromId,toId)=>{
    if(fromId===toId)return;
    setHabits(prev=>{
      const arr=[...prev];
      const fi=arr.findIndex(h=>h.id===fromId),ti=arr.findIndex(h=>h.id===toId);
      if(fi<0||ti<0)return prev;
      const [item]=arr.splice(fi,1);arr.splice(ti,0,item);return arr;
    });
  };
  const colorCat=(id,color)=>setCats(p=>p.map(c=>c.id===id?{...c,color}:c));
  const hideDaysCat=(id,hideDays)=>setCats(p=>p.map(c=>c.id===id?{...c,hideDays}:c));
  const addSubcat=(sub)=>setSubcats(prev=>[...prev,sub]);
  const deleteSubcat=(id)=>{
    const sub=subcats.find(s=>s.id===id);
    if(!window.confirm(`Delete subcategory "${sub?.label}"? Habits inside will stay but lose their subcategory.`)) return;
    scheduleDelete(sub?.label||"subcategory",()=>{setSubcats(p=>p.filter(s=>s.id!==id));setHabits(p=>p.map(h=>h.subId===id?{...h,subId:null}:h));});
  };
  const renameSubcat=(id,label)=>setSubcats(p=>p.map(s=>s.id===id?{...s,label}:s));

  // Habit CRUD
  const addHabit=(h)=>{setHabits(prev=>[...prev,h]);showToast("HABIT ADDED",h.emoji);};
  const addTask=(task)=>setTasks(prev=>[...prev,task]);
  const completeTask=(id)=>setTasks(prev=>prev.map(t=>t.id===id?{...t,done:true,doneDate:TODAY()}:t));
  const uncompleteTask=(id)=>setTasks(prev=>prev.map(t=>t.id===id?{...t,done:false,doneDate:null}:t));
  const deleteTask=(id)=>setTasks(prev=>prev.filter(t=>t.id!==id));
  const renameTask=(id,label)=>setTasks(prev=>prev.map(t=>t.id===id?{...t,label}:t));
  const updateTask=(task)=>setTasks(prev=>prev.map(t=>t.id===task.id?task:t));
  const deleteHabit=(id)=>{
    const h=habits.find(x=>x.id===id);
    if(!window.confirm(`Delete "${h?.label}"? All streak and completion data will be lost.`)) return;
    scheduleDelete(h?.label||"habit",()=>setHabits(p=>p.filter(x=>x.id!==id)));
  };

  const handleExport=()=>exportData({cats,subcats,habits,tasks,events,movies,books,tvshows,places,cityList,cityEmojis,totalXP,theme});
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
    if(data.tasks) setTasks(data.tasks);
    if(data.events) setEvents(data.events);
    if(data.movies) setMovies(data.movies);
    if(data.books) setBooks(data.books);
    if(data.tvshows) setTvshows(data.tvshows);
    if(data.places) setPlaces(data.places);
    if(data.cityList) setCityList(data.cityList);
    if(data.cityEmojis) setCityEmojis(data.cityEmojis);
    if(data.totalXP!=null) setTotalXP(data.totalXP);
    if(data.theme) setTheme(data.theme);
    showToast("RESTORED FROM DRIVE","☁️");
  };
  const renameHabit=(id,label,timeOfDay)=>setHabits(p=>p.map(h=>h.id===id?{...h,label,timeOfDay:timeOfDay!==undefined?timeOfDay:h.timeOfDay}:h));

  // List CRUD
  const toggleList=(type,id)=>{if(type==="movie")setMovies(p=>p.map(m=>m.id===id?{...m,done:!m.done}:m));else setBooks(p=>p.map(b=>b.id===id?{...b,done:!b.done}:b));};
  const deleteList=(type,id)=>{if(type==="movie")setMovies(p=>p.filter(m=>m.id!==id));else setBooks(p=>p.filter(b=>b.id!==id));};
  const addList=(type,item)=>{if(type==="movie")setMovies(p=>[...p,item]);else setBooks(p=>[...p,item]);};
  const renameList=(type,id,title)=>{if(type==="movie")setMovies(p=>p.map(m=>m.id===id?{...m,title}:m));else setBooks(p=>p.map(b=>b.id===id?{...b,title}:b));};

  const doneCount=habits.filter(h=>isDone(h,viewDate)).length+(tasks||[]).filter(t=>t.done&&(t.scheduledFor===viewDate||t.doneDate===viewDate)).length;
  // Habits scheduled for the viewed date
  const scheduledHabits=habits.filter(h=>isScheduledFor(h,viewDate)&&(!h.createdDate||h.createdDate<=viewDate));
  const scheduledTasks=(tasks||[]).filter(t=>t.scheduledFor<=viewDate&&(!t.done||t.doneDate===viewDate));
  const drawerHabit=habits.find(h=>h.id===openDrawer);

  const navItems=[{id:"today",emoji:"☀️",label:"TODAY"},{id:"watchread",emoji:"🎬",label:"MEDIA"},{id:"try",emoji:"📍",label:"TRY"},{id:"events",emoji:"📅",label:"EVENTS"},{id:"log",emoji:"📊",label:"LOG"}];

  if(!loaded) return <div style={{background:"#0a0a0a",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center"}}><div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:28,color:"#e8ff00",letterSpacing:6}}>LOADING...</div></div>;

  return(
    <>
      <style>{`
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
      {showOnboarding&&<OnboardingTour theme={theme} onDone={()=>setShowOnboarding(false)}/>}
      {pendingDelete&&(
        <div style={{position:"fixed",bottom:90,left:"50%",transform:"translateX(-50%)",zIndex:10001,display:"flex",alignItems:"center",border:`2px solid ${t.border}`,boxShadow:`3px 3px 0 ${t.border}`,whiteSpace:"nowrap",overflow:"hidden"}}>
          <div style={{padding:"10px 14px",fontFamily:"'Black Han Sans',sans-serif",fontSize:11,letterSpacing:2,background:t.accent2,color:"#fff"}}>🗑 "{pendingDelete.label}" DELETED</div>
          <button onClick={pendingDelete.undo} style={{background:t.bg,color:t.text,border:"none",borderLeft:`2px solid ${t.border}`,padding:"10px 14px",cursor:"pointer",fontFamily:"'Black Han Sans',sans-serif",fontSize:11,letterSpacing:2}}>↩ UNDO</button>
        </div>
      )}
      <Confetti active={confetti} onDone={()=>setConfetti(false)} colors={[t.accent,t.accent2,"#fff",t.bgCard]}/>
      <Flash active={flash} color={`${t.accent2}44`}/>
      <Toast msg={toast.msg} emoji={toast.emoji} show={toast.show} theme={theme}/>
      <MilestoneBanner show={milestone.show} streak={milestone.streak} onDone={()=>setMilestone({show:false,streak:0})} theme={theme}/>
      {addModal&&<AddModal type={addModal} onAdd={item=>addList(addModal,item)} onClose={()=>setAddModal(null)} theme={theme}/>}
      {addTaskCtx&&<AddTaskModal catId={addTaskCtx.catId} subId={addTaskCtx.subId} cats={cats} subcats={subcats} onAdd={addTask} onClose={()=>setAddTaskCtx(null)} theme={theme} defaultDate={viewDate}/>}
      {addHabitCtx&&<AddHabitModal catId={addHabitCtx.catId} subId={addHabitCtx.subId} cats={cats} subcats={subcats} onAdd={addHabit} onClose={()=>setAddHabitCtx(null)} theme={theme}/>}
      {showTheme&&<ThemePicker current={theme} onChange={setTheme} onClose={()=>setShowTheme(false)}/>}
      {showWeekly&&<WeeklySummary habits={habits} totalXP={totalXP} onClose={()=>setShowWeekly(false)} theme={theme} t={t}/>}
      {drawerHabit&&<RepeatDrawer habit={drawerHabit} todayStr={viewDate} count={getCount(drawerHabit,viewDate)} onIncrement={!isPast?completeHabit:()=>{}} onDecrement={!isPast?undoOne:()=>{}} onRename={!isPast?renameHabit:()=>{}} onClose={()=>setOpenDrawer(null)} theme={theme}/>}

      <div style={{background:t.bg,minHeight:"100vh",maxWidth:480,margin:"0 auto",paddingBottom:90}}>
        {/* Header */}
        <div style={{padding:"22px 16px 12px",borderBottom:`2px solid ${t.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:tab==="today"?10:0}}>
            <div>
              <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:32,color:t.text,letterSpacing:5,lineHeight:1}}>HABIT MODE</div>
            </div>
            {tab!=="log"&&<button onClick={()=>setTab("log")} style={{background:"transparent",border:`1.5px solid ${t.border}`,padding:"6px 10px",cursor:"pointer",fontFamily:"'Black Han Sans',sans-serif",fontSize:13,color:t.textSub,letterSpacing:1}}>⚙️</button>}
          </div>
          {/* Day navigation — only shown on Today tab */}
          {tab==="today"&&(
            <div style={{display:"flex",alignItems:"center",gap:0}}>
              <button onClick={()=>setViewOffset(o=>o-1)} style={{background:"transparent",border:`2px solid ${t.border}`,borderRight:"none",padding:"7px 12px",cursor:"pointer",fontFamily:"'Black Han Sans',sans-serif",fontSize:14,color:t.text,boxShadow:`2px 2px 0 ${t.border}`}}>◀</button>
              <div style={{flex:1,textAlign:"center",border:`2px solid ${t.border}`,borderRight:"none",padding:"7px 12px",background:isToday?t.accent:t.bgCard,boxShadow:`2px 2px 0 ${t.border}`}}>
                <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:13,color:isToday?t.textInv:t.text,letterSpacing:3}}>{viewDateLabel}</div>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:isToday?t.textInv:t.textSub,letterSpacing:2,marginTop:1}}>{new Date(viewDate+"T12:00:00").toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</div>
              </div>
              <button onClick={()=>setViewOffset(o=>o+1)} disabled={false} style={{background:"transparent",border:`2px solid ${t.border}`,padding:"7px 12px",cursor:isToday?"default":"pointer",fontFamily:"'Black Han Sans',sans-serif",fontSize:14,color:isToday?t.textSub:t.text,opacity:isToday?0.3:1,boxShadow:`2px 2px 0 ${t.border}`}}>▶</button>
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
                    <span style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:t.text,letterSpacing:3}}>{doneCount===scheduledHabits.length&&scheduledHabits.length>0?"ALL DONE 🏆":doneCount===0?"LET'S GO":`${scheduledHabits.length-doneCount} REMAINING`}</span>
                    <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.textSub,letterSpacing:2}}>{doneCount}/{scheduledHabits.length}</span>
                  </div>
                  <div style={{background:t.bg,height:7,border:`1.5px solid ${t.border}`}}><div style={{width:`${Math.round((doneCount/Math.max(scheduledHabits.length,1))*100)}%`,height:"100%",background:t.accent,transition:"width 0.6s ease"}}/></div>
                </div>
              </div>

              {/* Reset day button — only shown on today */}
              {!isPast&&doneCount>0&&<div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}>
                <button onClick={()=>{
                  if(!window.confirm("Reset all habits for today? This can't be undone.")) return;
                  setHabits(prev=>prev.map(h=>{
                    const wasFullyDone=isDone(h,todayStr);
                    const xpLost=wasFullyDone?h.xp:h.repeat>1?Math.floor(h.xp/h.repeat)*getCount(h,todayStr):0;
                    setTotalXP(xp=>Math.max(0,xp-xpLost));
                    return {...h,
                      completedDates:h.repeat<=1?h.completedDates.filter(d=>d!==todayStr):h.completedDates.filter(e=>typeof e!=="object"||e.date!==todayStr),
                      streak:wasFullyDone?Math.max(0,h.streak-1):h.streak
                    };
                  }));
                  showToast("DAY RESET","🔄");
                }} style={{background:"transparent",border:`1.5px solid ${t.accent2}`,padding:"5px 12px",cursor:"pointer",fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,color:t.accent2,letterSpacing:2}}>↺ RESET DAY</button>
              </div>}
              {/* Past day banner */}
              {isPast&&<div style={{background:`${t.accent2}18`,border:`2px solid ${t.accent2}`,padding:"10px 14px",marginBottom:12,boxShadow:`2px 2px 0 ${t.border}`}}>
                <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.accent2,letterSpacing:2}}>VIEWING PAST DAY — READ ONLY</div>
              </div>}
              {/* Categories */}
              {cats.filter(cat=>!cat.hideDays||cat.hideDays.length===0||!cat.hideDays.includes(new Date(viewDate+"T12:00:00").getDay())).map(cat=>(
                <CategoryBlock key={cat.id} cat={cat} subcats={subcats} habits={scheduledHabits} todayStr={viewDate} theme={theme}
                  onComplete={!isPast?completeHabit:()=>{}} onUndoOne={!isPast?undoOne:()=>{}}
                  onDeleteHabit={!isPast?deleteHabit:()=>{}} onRenameHabit={!isPast?renameHabit:()=>{}}
                  onOpenDrawer={!isPast?setOpenDrawer:()=>{}}
                  onDeleteCat={!isPast?deleteCat:()=>{}} onRenameCat={!isPast?renameCat:()=>{}} onColorCat={colorCat} onHideDays={hideDaysCat}
                  onAddSubcat={!isPast?addSubcat:()=>{}} onDeleteSubcat={!isPast?deleteSubcat:()=>{}} onRenameSubcat={!isPast?renameSubcat:()=>{}}
                  onAddHabit={!isPast?(catId,subId)=>setAddHabitCtx({catId,subId}):()=>{}}
                  onAddTask={(catId,subId)=>setAddTaskCtx({catId,subId})}
                  tasks={tasks||[]}
                  onCompleteTask={!isPast?completeTask:()=>{}} onUncompleteTask={!isPast?uncompleteTask:()=>{}}
                  onDeleteTask={deleteTask} onRenameTask={renameTask} onUpdateTask={updateTask}
                  onReorderCat={reorderCats} onReorderHabit={reorderHabits} onReorderSubcat={reorderSubcats}/>
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

          {tab==="watchread"&&(
            <>
              {/* Sub-tabs */}
              <div style={{display:"flex",gap:0,marginBottom:14,border:`2px solid ${t.border}`,boxShadow:`2px 2px 0 ${t.border}`}}>
                {[["movies","🎬 FILMS"],["tv","📺 TV"],["books","📖 BOOKS"]].map(([st,lbl],i)=>(
                  <button key={st} onClick={()=>setWatchSubtab(st)} style={{flex:1,padding:"10px",border:"none",borderRight:i<2?`2px solid ${t.border}`:"none",background:watchSubtab===st?t.accent:"transparent",color:watchSubtab===st?t.textInv:t.textSub,fontFamily:"'Black Han Sans',sans-serif",fontSize:11,cursor:"pointer",letterSpacing:2}}>
                    {lbl}
                  </button>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"flex-end",marginBottom:12}}>
                <button onClick={()=>setAddModal(watchSubtab==="movies"?"movie":watchSubtab==="tv"?"tv":"book")} style={{background:t.addBtn,border:`2px solid ${t.border}`,padding:"8px 16px",fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:t.addBtnText,cursor:"pointer",letterSpacing:2,boxShadow:`2px 2px 0 ${t.border}`}}>+ ADD</button>
              </div>
              {(watchSubtab==="movies"?movies:watchSubtab==="tv"?tvshows:books).length===0
                ?<div style={{textAlign:"center",padding:"44px 20px",color:t.textSub,fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,letterSpacing:2,border:`2px dashed ${t.border}`}}><div style={{fontSize:34,marginBottom:10}}>{watchSubtab==="movies"?"🎬":watchSubtab==="tv"?"📺":"📖"}</div>NOTHING YET.<br/>PASTE A LINK — TITLE AUTO-FILLS.</div>
                :(watchSubtab==="movies"?movies:watchSubtab==="tv"?tvshows:books).map(item=><ListItem key={item.id} item={item} type={watchSubtab==="movies"?"movie":watchSubtab==="tv"?"tv":"book"} onToggle={id=>toggleList(watchSubtab,id)} onDelete={id=>deleteList(watchSubtab,id)} onRename={(id,title)=>renameList(watchSubtab,id,title)} theme={theme}/>)}
            </>
          )}

          {tab==="try"&&(
            <TryTab places={places} setPlaces={setPlaces} cityList={cityList} setCityList={setCityList} cityEmojis={cityEmojis} setCityEmojis={setCityEmojis} theme={theme} t={t} uid={uid}/>
          )}

          {tab==="events"&&(
            <EventsTab events={events} setEvents={setEvents} theme={theme} t={t}/>
          )}

          {tab==="log"&&(
            <>
              {/* Stats grid */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:22,color:t.text,letterSpacing:4}}>📊 STATS</div>
                <button onClick={()=>setShowWeekly(true)} style={{background:t.addBtn,border:`2px solid ${t.border}`,padding:"7px 12px",cursor:"pointer",fontFamily:"'Black Han Sans',sans-serif",fontSize:11,color:t.addBtnText,letterSpacing:2,boxShadow:`2px 2px 0 ${t.border}`}}>📅 THIS WEEK</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
                {[{label:"TOTAL XP",value:totalXP,emoji:"⚡"},{label:"LEVEL",value:Math.floor(totalXP/100)+1,emoji:"🏆"},{label:"FILMS WATCHED",value:movies.filter(m=>m.done).length,emoji:"🎬"},{label:"BOOKS DONE",value:books.filter(b=>b.done).length,emoji:"📖"},{label:"DONE TODAY",value:doneCount,emoji:"☀️"},{label:"TOTAL HABITS",value:habits.length,emoji:"🎯"}].map(s=>(
                  <div key={s.label} style={{background:t.bgCard,border:`2px solid ${t.border}`,padding:"13px 14px",boxShadow:`2px 2px 0 ${t.border}`}}>
                    <div style={{fontSize:18}}>{s.emoji}</div>
                    <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:28,color:t.accent,marginTop:3,letterSpacing:2}}>{s.value}</div>
                    <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,marginTop:1,letterSpacing:2}}>{s.label}</div>
                  </div>
                ))}
              </div>
              {/* Best/Worst day */}
              {(()=>{
                const DAY_FULL=["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
                const stats=Array.from({length:7},(_,i)=>({dow:i,done:0,total:0}));
                habits.forEach(h=>{
                  h.completedDates.forEach(entry=>{
                    const d=typeof entry==="string"?entry:entry.date;
                    const dow=new Date(d+"T12:00:00").getDay();
                    stats[dow].done+=(typeof entry==="object"?entry.count:1);
                    stats[dow].total+=h.repeat||1;
                  });
                  // add scheduled-but-missed days
                });
                const withPct=stats.map(s=>({...s,pct:s.total>0?s.done/s.total:null})).filter(s=>s.pct!==null);
                if(withPct.length<2) return null;
                const best=withPct.reduce((a,b)=>b.pct>a.pct?b:a);
                const worst=withPct.reduce((a,b)=>b.pct<a.pct?b:a);
                return(
                  <div style={{marginBottom:16}}>
                    <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:16,color:t.text,marginBottom:8,letterSpacing:4}}>📅 BEST & WORST DAY</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
                      <div style={{background:t.bgCard,border:`2px solid ${t.accent}`,padding:"12px 14px",boxShadow:`2px 2px 0 ${t.accent}`}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.accent,letterSpacing:2,marginBottom:4}}>BEST DAY</div>
                        <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:18,color:t.text,letterSpacing:2}}>{DAY_FULL[best.dow]}</div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.textSub,letterSpacing:1,marginTop:2}}>{Math.round(best.pct*100)}% avg completion</div>
                      </div>
                      <div style={{background:t.bgCard,border:`2px solid ${t.accent2}`,padding:"12px 14px",boxShadow:`2px 2px 0 ${t.accent2}`}}>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.accent2,letterSpacing:2,marginBottom:4}}>NEEDS WORK</div>
                        <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:18,color:t.text,letterSpacing:2}}>{DAY_FULL[worst.dow]}</div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:12,color:t.textSub,letterSpacing:1,marginTop:2}}>{Math.round(worst.pct*100)}% avg completion</div>
                      </div>
                    </div>
                    {/* Day bar chart */}
                    <div style={{display:"flex",gap:4,alignItems:"flex-end",height:50,border:`2px solid ${t.border}`,padding:"6px 8px 0",background:t.bgCard,boxShadow:`2px 2px 0 ${t.border}`}}>
                      {stats.map(s=>{
                        const p=s.pct||0;
                        const dow=s.dow;
                        const isB=dow===best.dow,isW=dow===worst.dow;
                        return(
                          <div key={dow} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                            <div style={{width:"100%",background:isB?t.accent:isW?t.accent2:t.border,height:`${Math.max(p*34,2)}px`,transition:"height 0.4s"}}/>
                            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:8,color:isB?t.accent:isW?t.accent2:t.textSub,letterSpacing:0}}>{"SMTWTFS"[dow]}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()}

              {/* Completed Tasks */}
              {(()=>{
                const doneTasks=(tasks||[]).filter(t=>t.done&&t.doneDate).sort((a,b)=>b.doneDate.localeCompare(a.doneDate)).slice(0,20);
                if(!doneTasks.length) return null;
                return(
                  <div style={{marginBottom:20}}>
                    <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:16,color:t.text,marginBottom:8,letterSpacing:4}}>☑ COMPLETED TASKS</div>
                    {doneTasks.map(t=>(
                      <div key={t.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:5,background:t.bgCard,border:`1.5px solid ${t.border}`,padding:"9px 12px",boxShadow:`1px 1px 0 ${t.border}`}}>
                        <span style={{fontSize:14,color:t.accent}}>☑</span>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,color:t.textSub,letterSpacing:1,textDecoration:"line-through",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.label}</div>
                          {t.note&&<div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:1,marginTop:1}}>{t.note}</div>}
                        </div>
                        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,color:t.textSub,letterSpacing:1,flexShrink:0}}>{t.doneDate}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}
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
              <CalendarView habits={habits} theme={theme}/>

              {/* Settings section */}
              <div style={{marginTop:24,paddingTop:16,borderTop:`2px solid ${t.border}`}}>
                <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:16,color:t.text,letterSpacing:4,marginBottom:12}}>⚙️ SETTINGS</div>
                <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:12,color:t.text,letterSpacing:3,marginBottom:8}}>🎨 THEME</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:16}}>
                  {Object.entries(THEMES).map(([key,th])=>(
                    <button key={key} onClick={()=>setTheme(key)} style={{background:th.bg,border:`3px solid ${theme===key?th.accent:th.border}`,padding:"12px 6px",cursor:"pointer",textAlign:"center",boxShadow:theme===key?`3px 3px 0 ${th.accent}`:`2px 2px 0 ${th.border}`,transition:"all 0.15s"}}>
                      <div style={{fontSize:20}}>{th.emoji}</div>
                      <div style={{fontFamily:"'Black Han Sans',sans-serif",fontSize:10,color:th.text,marginTop:4,letterSpacing:1}}>{th.name}</div>
                    </button>
                  ))}
                </div>
                <BackupPanel
                  theme={theme}
                  state={{cats,subcats,habits,tasks,movies,books,tvshows,places,cityList,cityEmojis,totalXP,theme}}
                  gdriveStatus={gdriveStatus}
                  setGdriveStatus={setGdriveStatus}
                  onRestoreGdrive={handleRestoreGdrive}
                  onExport={handleExport}
                  onImport={handleImport}
                  importRef={importRef}
                />
              </div>
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
