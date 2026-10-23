import {createElement,Info,FileSearch,CalendarClock,Flag} from 'lucide';
export const infoIcon=()=>createElement(Info,{'aria-hidden':'true',width:20,height:20}).outerHTML;

export const sourceIcon=()=>createElement(FileSearch,{"aria-hidden":"true",width:20,height:20}).outerHTML;
export const deadlineIcon=()=>createElement(CalendarClock,{"aria-hidden":"true",width:16,height:16}).outerHTML;

export const discrepancyFlag=()=>{const svg=createElement(Flag);for(const [key,value] of Object.entries({role:'img','aria-label':'Source discrepancy',width:'16',height:'16'}))svg.setAttribute(key,value);return `<span class="source-discrepancy">${svg.outerHTML} Official status not confirmed</span>`};
export const discrepancyDetails=(pending=false)=>`<details class="source-discrepancy-details"><summary>Source discrepancy details</summary><p>${pending?'This request was observed without a matching status. A later matching status row is present, but the record is still awaiting catalog reconciliation.':'This request appears in the Legislature’s public request feed but is absent from the corresponding status listing. The reason has not been independently established.'}</p><p><a href="https://le.utah.gov/data/2027GS/filelist.json">Official public request feed</a> · <a href="https://le.utah.gov/bills/billSearch.jsp?sess=2027GS&amp;disp=all&amp;sub=all">Separate official status listing</a></p></details>`;
