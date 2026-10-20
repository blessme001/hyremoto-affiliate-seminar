import type { RegistrationFormData } from '../types';
import { BUSINESS_CATEGORIES, PARTICIPANT_CATEGORIES } from '../data/registration';
import { registrationConfigured, supabase } from './supabase';
export function validateRegistration(data: RegistrationFormData) {
 const errors: Record<string,string> = {};
 if (data.fullName.trim().length<2 || data.fullName.trim().length>120) errors.fullName='Enter your full name (2–120 characters).';
 if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim()) || data.email.length>254) errors.email='Enter a valid email address.';
 if (!/^\+[1-9]\d{7,14}$/.test(data.whatsapp.replace(/[\s()-]/g,''))) errors.whatsapp='Include your country code, for example +2348141234567.';
 if(!data.countryResidence.trim() || data.countryResidence.trim().length>100) errors.countryResidence='Enter your country of residence.';
 if(!PARTICIPANT_CATEGORIES.includes(data.category)) errors.category='Choose your participant category.';
 if(BUSINESS_CATEGORIES.includes(data.category) && !data.companyName.trim()) errors.companyName='Enter your company or business name.';
 if(data.companyName.length>160) errors.companyName='Use 160 characters or fewer.';
 if(data.discovery.length>160) errors.discovery='Use 160 characters or fewer.';
 if(!data.consentRequired) errors.consentRequired='Please agree to receive seminar communications to register.';
 return errors;
}
export async function submitRegistration(data:RegistrationFormData,token:string) {
 if(!registrationConfigured || !supabase) throw new Error('Registration is not open yet. Please check back soon.');
 const {data:response,error}=await supabase.functions.invoke('register-seminar',{body:{...data,token}});
 if(error || response?.ok!==true) throw new Error('We could not complete registration. Please try again shortly.');
}
