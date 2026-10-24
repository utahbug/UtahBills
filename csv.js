// CSV is a presentation copy. Official source values are never modified.
export function csvCell(value){let text=String(value??'');if(/^[\s\uFEFF]*[=+@-]/u.test(text)||/^[\t\r\n]/u.test(text))text="'"+text;return '"'+text.replaceAll('"','""')+'"'}
export async function csvText(headers,rows){const chunks=[headers.map(csvCell).join(',')];for(let i=0;i<rows.length;i+=500){chunks.push(...rows.slice(i,i+500).map(row=>row.map(csvCell).join(',')));if(i+500<rows.length)await new Promise(r=>setTimeout(r,0))}return '\uFEFF'+chunks.join('\r\n')+'\r\n'}
