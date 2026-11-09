// Visible pointer/focus labels; Escape dismisses without changing the control action.
const installed=new WeakSet();
export function controlTooltip(button,label){
 button.dataset.tooltip=label;button.title=label;
 if(installed.has(button))return;installed.add(button);
 const reset=()=>delete button.dataset.tooltipDismissed;
 button.addEventListener('pointerenter',reset);button.addEventListener('pointerleave',reset);
 button.addEventListener('focus',reset);button.addEventListener('blur',reset);
 button.addEventListener('keydown',e=>{if(e.key==='Escape')button.dataset.tooltipDismissed='true'});
}
