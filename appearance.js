// The tiny head bootstrap owns the same preference before first paint.
const appearance=window.utahAppearance;
const panel=document.querySelector('#appearance-panel');
const trigger=document.querySelector('#appearance-trigger');
const radios=[...panel.querySelectorAll('input[name="appearance"]')];
function sync(){for(const radio of radios)radio.checked=radio.value===appearance.get()}
sync();
panel.addEventListener('change',event=>{if(event.target.name!=='appearance')return;appearance.set(event.target.value);sync();let saved=true;try{saved=localStorage.getItem('utahbills-appearance')===appearance.get()}catch{saved=false}document.querySelector('#appearance-status').textContent=saved?'':'Your choice applies for this visit. This browser could not save it.'});
panel.addEventListener('toggle',event=>{if(event.newState==='open'){sync();radios.find(r=>r.checked).focus()}else if(panel.contains(document.activeElement))trigger.focus({preventScroll:true})});
addEventListener('storage',event=>{if(event.key==='utahbills-appearance'||event.key===null){appearance.sync(event.newValue);sync()}});
