// Persistent settings and localStorage store.
export const store={get(k,d){try{const v=localStorage.getItem('kol_'+k);return v==null?d:JSON.parse(v);}catch(e){return d;}},
             set(k,v){try{localStorage.setItem('kol_'+k,JSON.stringify(v));}catch(e){}}};

export const settings={admin:store.get('admin',false),view:store.get('view','auto'),solf:store.get('solf',true),strict:store.get('strict',false),sens:store.get('sens',6),lat:store.get('lat',120),click:store.get('click',true)};

export const sensToDb=v=>24-2*v;
