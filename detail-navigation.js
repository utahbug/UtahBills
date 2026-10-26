// Open the whole disclosure ancestry before focusing or measuring a destination.
export function revealDetail(target){
 if(!target)return;
 for(let node=target;node;node=node.parentElement)if(node.tagName==='DETAILS')node.open=true;
 const focus=target.matches('details')?target.querySelector(':scope > summary'):target;
 if(!focus.hasAttribute('tabindex')&&!focus.matches('summary,a,button,input,select'))focus.tabIndex=-1;
 focus.focus({preventScroll:true});
 const position=()=>{const header=document.querySelector('header'),scale=header?header.getBoundingClientRect().height/header.offsetHeight:1;scrollBy(0,(focus.getBoundingClientRect().top-(header?.getBoundingClientRect().bottom||0)-12)/(scale||1))};
 position();requestAnimationFrame(()=>requestAnimationFrame(position));
}
