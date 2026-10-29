// Histories are projected from checksum-checked official snapshots, never title joins.
const official=source=>{try{return /^[a-f0-9]{64}$/.test(source?.sha256)&&new URL(source.url).protocol==='https:'&&['le.utah.gov','www.le.utah.gov'].includes(new URL(source.url).hostname)}catch{return false}};
export function historicalTitles(record){
 const request=record.kind==='Request',history=request?record.history:record.titleHistory;
 if(request&&!/^[A-Z]{10}$/.test(record.trackingID||''))return [];
 return [...new Set((history||[]).filter(h=>official(h.source)&&(request?(!h.trackingID||h.trackingID===record.trackingID):(h.sessionID===record.sessionID&&h.billNumber===record.billNumber))).map(h=>h.shortTitle?.trim()).filter(t=>t&&t!==record.shortTitle?.trim()))];
}
