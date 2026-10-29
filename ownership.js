let state;
export function installOwnershipSignature(){
 if(state)return state;
 const key='utahbills-ownership-shortcut';let enabled=true;try{enabled=localStorage.getItem(key)!=='off'}catch{}
 const dialog=document.createElement('dialog');dialog.className='ownership-dialog';dialog.setAttribute('aria-labelledby','ownership-title');dialog.innerHTML='<h2 id="ownership-title">© 2026 Kenneth Roberts</h2><p>This attribution marker does not grant access or establish ownership by itself.</p><button type="button">Close</button>';document.body.append(dialog);
 let previous,sequence='',last=0;const show=()=>{if(dialog.open)return;previous=document.activeElement;dialog.showModal();dialog.querySelector('button').focus()};dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{sequence='';if(previous?.isConnected)previous.focus({preventScroll:true})});
 document.addEventListener('keydown',e=>{if(!enabled||document.querySelector('dialog[open]')||e.repeat||e.isComposing||e.ctrlKey||e.metaKey||e.altKey||e.target.closest?.('input,textarea,select,[contenteditable]:not([contenteditable="false"]),[role="textbox"],[role="combobox"]')){sequence='';return}const now=Date.now();if(now-last>1500)sequence='';last=now;sequence=(sequence+e.key.toLowerCase()).slice(-3);if(sequence==='ksr'){sequence='';show()}});
 window.addEventListener('blur',()=>sequence='');
 state={show,get enabled(){return enabled},setEnabled(value){enabled=value;sequence='';try{localStorage.setItem(key,enabled?'on':'off')}catch{}}};return state;
}
export function ownershipSettings(main){
 const state=installOwnershipSignature(),section=document.createElement('details');section.className='ownership-settings';section.innerHTML='<summary>Ownership shortcut settings</summary><label><input type="checkbox"> Enable K, S, R outside text fields</label><p>The sequence reveals the site attribution. You can disable this character shortcut here.</p><button type="button">Show site attribution</button>';section.querySelector('input').checked=state.enabled;section.querySelector('input').onchange=e=>state.setEnabled(e.target.checked);section.querySelector('button').onclick=state.show;main.append(section);
}
