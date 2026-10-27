// The tiny head bootstrap owns the same preference before first paint.
const appearance=window.utahAppearance;
const trigger=document.querySelector('#appearance-trigger');
let panel;
function sync(){for(const radio of panel?.querySelectorAll('input[name="appearance"]')||[])radio.checked=radio.value===appearance.get()}
trigger.addEventListener('click',()=>{
 if(panel)return;
 panel=document.querySelector('#appearance-template').content.firstElementChild.cloneNode(true);
 document.body.append(panel);sync();
 panel.addEventListener('change',event=>{
  if(event.target.name!=='appearance')return;
  appearance.set(event.target.value);sync();let saved=true;
  try{saved=localStorage.getItem('utahbills-appearance')===appearance.get()}catch{saved=false}
  panel.querySelector('#appearance-status').textContent=saved?'':'Your choice applies for this visit. This browser could not save it.';
 });
 panel.querySelector('.appearance-close').onclick=()=>panel.close();
 panel.addEventListener('click',event=>{const r=panel.getBoundingClientRect();if(event.target===panel&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))panel.close()});
 panel.addEventListener('close',()=>{panel.remove();panel=undefined;trigger.focus({preventScroll:true})},{once:true});
 panel.showModal();panel.querySelector('input:checked').focus();
});
addEventListener('storage',event=>{if(event.key==='utahbills-appearance'||event.key===null){appearance.sync(event.newValue);sync()}});
