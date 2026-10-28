// Resolve only exact saved record/sponsor IDs. Never join by title or name.
export function sponsorRows(rows,catalog){
 const requests=new Map(),bills=new Map();
 for(const r of [...(catalog.requestArchive2027||[]),...(catalog.requests2027||[]),...(catalog.sourceObservedRequests2027||[])]){if(!requests.has(r.trackingID))requests.set(r.trackingID,[]);requests.get(r.trackingID).push(r)}
 for(const b of catalog.measures||[]){const key=b.sessionID+':'+b.billNumber;if(!bills.has(key))bills.set(key,[]);bills.get(key).push(b)}
 const people=new Map();for(const p of [...(catalog.legislators||[]),...(catalog.contactPeople||[])])if(!people.has(p.id))people.set(p.id,p);
 return rows.map(row=>{
  const request=/^#request\/([A-Z]{10})(?:\/history)?$/.exec(row.route),bill=/^#bill\/(?:(20\d{2})\/)?([HS](?:[BR]\d{4}|[JC]R\d{3}))(?:\/history)?$/.exec(row.route),year=request?'2027':bill?.[1]||'2026';
  const records=request?requests.get(request[1])||[]:bill?bills.get(year+'GS:'+bill[2])||[]:[],ids=new Set(records.map(r=>(request?r.sponsor:r.primeSponsor)||''));
  const number=bill?bill[2].replace(/^([A-Z]+)0*(\d+)$/,'$1 $2'):'';
  if(!records.length||ids.size!==1)return {...row,number,sponsorName:'Unavailable',sponsorRoute:null};
  const record=records[0],id=[...ids][0],person=id&&people.get(id),names=new Set(records.map(r=>request?r.sponsorName:r.primeSponsorName).filter(Boolean));
  const name=names.size===1?[...names][0]:names.size>1?'':person?.name||'';
  return {...row,number,sponsorName:name.replace(/^(?:Rep\.|Sen\.)\s*/i,'')||(id?'Unavailable':'Not published'),sponsorRoute:person&&name&&/^[A-Z0-9]+$/.test(id)?'#legislator/'+id+'/'+year:null};
 });
}
