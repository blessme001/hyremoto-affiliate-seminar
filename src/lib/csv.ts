import type { RegistrationRow } from '../types';
// Prevent spreadsheet formula execution when a cell starts with a control/formula character.
export function csvCell(value:unknown) {
 let text=String(value??'');
 if (/^[\s\u0000-\u001f]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text="'"+text;
 return '"'+text.replaceAll('"','""')+'"';
}
export function registrationCsv(rows:RegistrationRow[]) {
 const columns: (keyof RegistrationRow)[]=['id','event_id','full_name','email','whatsapp','country','category','company_name','source','consent_version','consent_text','consent_at','created_at'];
 return '\uFEFF'+[columns.map(csvCell).join(','),...rows.map(row=>columns.map(key=>csvCell(row[key])).join(','))].join('\r\n');
}
