// XP, levels, streaks, achievements, ranks and the HUD.
import { $, toast } from './dom.js';
import { settings, store } from './state.js';
import { WORLDS } from './worlds.js';

export const P=Object.assign({xp:0,done:{},ach:[],streak:0,lastDay:null,log:[],best:{}},store.get('prog',{}));

export function saveP(){store.set('prog',P);}

export function dayStr(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');}

export function touchStreak(){
  const t=dayStr(new Date());if(P.lastDay===t)return 0;
  const y=dayStr(new Date(Date.now()-86400000));
  P.streak=(P.lastDay===y)?P.streak+1:1;P.lastDay=t;
  if(P.streak>=7)ach('streak7');
  const bonus=Math.min(50,5*P.streak);P.xp+=bonus;return bonus;
}

export function levelOf(xp){let Lv=1;while(xp>=250*Lv*(Lv+1)/2)Lv++;return Lv;}

export function addXP(n,why){
  if(settings.admin){if(n>0&&why)toast('Admin mode — no XP saved');return {levelUp:false,bonus:0};}
  const before=levelOf(P.xp);const bonus=touchStreak();P.xp+=n;saveP();
  const after=levelOf(P.xp);
  if(after>before)toast(`⬆️ Level ${after}!`);else if(n>0&&why)toast(`+${n} XP${bonus?` · 🔥 +${bonus} streak bonus`:''}`);
  renderHud();return {levelUp:after>before,bonus};
}

export function logEvt(s){P.log.push(dayStr(new Date())+' '+s);if(P.log.length>40)P.log.splice(0,P.log.length-40);saveP();}

export const ACH={first:'🌅 First Light — first quest done',metronome:'🎯 Metronome’s Friend — 3 clean runs in a row',boss:'👹 Boss Slayer — first boss defeated',
  twohands:'🙌 Two-Handed — first hands-together piece',reader:'📖 Staff Reader — 20/20 reading round',streak7:'🔥 Streak 7 — a week in a row',
  perfect:'🧘 Perfect Posture — boss form check passed',scale:'🧗 Scale Runner — first scale hands together',shape:'🔄 Shapeshifter — all inversions, both hands',
  minor:'🌘 Minor Key — first piece in a minor key',composer:'✍️ Composer — your own 8-bar melody',jam:'🎷 First Jam — your first improvisation',pedal:'🦶 Pedal Pusher — first pedalled piece',legend:'👑 Legend — every world conquered'};

export function ach(id){if(settings.admin||P.ach.includes(id))return;P.ach.push(id);saveP();setTimeout(()=>toast('Achievement! '+ACH[id]),900);}

export const RANKS=['Key Finder','Apprentice of the Ivory','Melody Scout','Staff Ranger','Rhythm Rider','Scale Climber','Harmony Mage','Castle Virtuoso','Keys of Legend'];

export function rank(){let r=0;WORLDS.filter(w=>!w.noRank).forEach((w,i)=>{if(P.done[w.boss.id])r=i+1;});return RANKS[r];}

export function renderHud(){
  const Lv=levelOf(P.xp),lo=250*(Lv-1)*Lv/2,hi=250*Lv*(Lv+1)/2;
  $('hud').innerHTML=`<div class="row between"><b style="color:var(--gold)">${rank()}</b><span>Lv ${Lv} · 🔥 ${P.streak}</span></div>
   <div class="xpbar"><div style="width:${Math.round(100*(P.xp-lo)/(hi-lo))}%"></div></div>
   <div class="row between"><span class="sub">${P.xp-lo} / ${hi-lo} XP to Lv ${Lv+1}</span><button class="btn small" id="teachBtn">Copy for teacher</button></div>`;
  $('teachBtn').onclick=async()=>{const t=teacherText();try{await navigator.clipboard.writeText(t);toast('Copied — paste it in your teacher chat');}catch(e){toast('Copy failed — see Settings backup');}};
}

export function nextQuest(){for(const w of WORLDS)for(const q of [...w.quests,w.boss])if(!P.done[q.id])return q;return null;}

export function teacherText(){
  const done=Object.keys(P.done);const nq=nextQuest();
  return `Keys of Legend app progress (${dayStr(new Date())})\nRank: ${rank()} · Lv ${levelOf(P.xp)} · ${P.xp} XP · streak ${P.streak} days\n`+
    `Completed: ${done.join(', ')||'none'}\nNext: ${nq?nq.id+' '+nq.title:'all app worlds done'}\n`+
    `Achievements: ${P.ach.map(a=>ACH[a].split(' — ')[0]).join(', ')||'none'}\nRecent:\n`+P.log.slice(-8).map(l=>'- '+l).join('\n');
}
