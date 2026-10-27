// Projection only: no inferred identities, statuses or request-to-bill relationships.
export function requestSponsorship(data){
 const grouped=new Map(),bySponsor=new Map(),unmatched=[],records=[];
 for(const r of [...(data.requests2027||[]),...(data.sourceObservedRequests2027||[])]){
  if(!grouped.has(r.trackingID))grouped.set(r.trackingID,[]);grouped.get(r.trackingID).push(r);
 }
 const roster=new Set((data.legislators||[]).map(p=>p.id));
 for(const [id,versions] of grouped){
  if(versions.some(r=>r.introducedBill||r.currentlyListed===false))continue;
  const r=versions[0];records.push(r);
  const conflict=new Set(versions.map(v=>v.sponsor||'')).size>1;
  if(conflict||!r.sponsor||!roster.has(r.sponsor))unmatched.push({record:r,reason:conflict?'Conflicting saved sponsor IDs':!r.sponsor?'No published sponsor ID':'Sponsor ID absent from the 2026 roster'});
  if(!conflict&&r.sponsor){if(!bySponsor.has(r.sponsor))bySponsor.set(r.sponsor,[]);bySponsor.get(r.sponsor).push(r)}
 }
 return {records,bySponsor,unmatched};
}
