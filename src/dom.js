// Small DOM helpers.
import { segHtml } from './render.js';
import { settings, store } from './state.js';

export const $=id=>document.getElementById(id);

// which notation to show: staff (sheet music), names (letters), or both
export function resolveView(world){return settings.view==='auto'?(world!=null&&world>=2?'staff':'both'):settings.view;}

export function wireSeg(el,cur,onPick){el.innerHTML=segHtml(cur);el.querySelectorAll('button').forEach(b=>b.onclick=()=>{settings.view=b.dataset.v;store.set('view',settings.view);$('viewSel').value=settings.view;onPick(b.dataset.v);});}

export function toast(msg){const t=$('toast');t.textContent=msg;t.classList.remove('hidden');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.add('hidden'),2600);}

export const PERF=document.getElementById('perf'); // shared song display; moved between Song tab and lesson steps

export function parkPerf(){document.getElementById('perfHome').appendChild(PERF);}
