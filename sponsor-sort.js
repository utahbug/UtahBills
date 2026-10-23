// Exact source IDs select names, not membership. Only explicit surname-first names
// are sortable; unresolved IDs/names follow identified sponsors without guessing.
const collator=new Intl.Collator('en',{sensitivity:'base',numeric:true});
export function sponsorKey(record,catalog){
 const id=record.primeSponsor||record.sponsor;if(!id)return null;
 const person=(catalog.legislators||[]).find(p=>p.id===id)||(catalog.contactPeople||[]).find(p=>p.id===id);
 const name=(person?.name||record.sponsorName||record.primeSponsorName||'').replace(/^(?:Rep\.|Sen\.)\s*/i,'').trim();
 const comma=name.indexOf(',');return comma>0?[name.slice(0,comma).trim(),name.slice(comma+1).trim()]:null;
}
export function compareSponsors(a,b,catalog){
 const x=sponsorKey(a,catalog),y=sponsorKey(b,catalog);
 return (x&&y?(collator.compare(x[0],y[0])||collator.compare(x[1],y[1])):x?-1:y?1:0)||collator.compare(a.shortTitle.trim(),b.shortTitle.trim())||collator.compare(a.trackingID||a.billNumber,b.trackingID||b.billNumber);
}
