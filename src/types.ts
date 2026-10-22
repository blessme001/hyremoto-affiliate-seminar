export interface RegistrationFormData {
 fullName:string; email:string; whatsapp:string; countryResidence:string; category:string; companyName:string; discovery:string; consentRequired:boolean; website:string;
}
export interface RegistrationRow {
 id:string; event_id:string; full_name:string; email:string; whatsapp:string; country:string; category:string; company_name:string|null; source:string|null; consent_version:string; consent_text:string; consent_at:string|null;
reminder_opt_in:boolean; created_at:string;
}
