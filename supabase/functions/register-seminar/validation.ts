const categories=['Individual affiliate','Influencer or content creator','Sales agent or broker','Business owner or company representative','Travel agent or travel business','Corporate partnership representative','Other'];
export function normaliseSubmission(value: unknown) {
 if(!value || typeof value!=='object' || Array.isArray(value)) throw new Error('Invalid registration.');
 const input=value as Record<string,unknown>;
 const text=(key:string,max:number)=>{const raw=input[key];if(raw!==undefined && typeof raw!=='string')throw new Error('Invalid field.');const result=(raw as string|undefined??'').trim();if(result.length>max)throw new Error('Field too long.');return result;};
 const full_name=text('fullName',120),email=text('email',254).toLowerCase(),whatsapp=text('whatsapp',30).replace(/[\s()-]/g,''),country=text('countryResidence',100),category=text('category',100);
 const company_name=text('companyName',160),source=text('discovery',160);
 if(full_name.length<2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\+[1-9]\d{7,14}$/.test(whatsapp) || !country || !categories.includes(category) || input.consentRequired!==true)throw new Error('Please complete the required fields.');
 const business=categories.slice(3,6).includes(category);
 if(business&&!company_name)throw new Error('Company name is required.');
 if(text('website',200))throw new Error('Invalid registration.');
 return {full_name,email,whatsapp,country,category,company_name:business?company_name:null,source:source||null};
}
