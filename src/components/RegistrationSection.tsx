import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import type { RegistrationFormData } from '../types';
import { BUSINESS_CATEGORIES, PARTICIPANT_CATEGORIES, CONSENT_TEXT } from '../data/registration';
import { registrationConfigured } from '../lib/supabase';
import { submitRegistration, validateRegistration } from '../lib/registration';
import { Turnstile } from './Turnstile';
const empty:RegistrationFormData={fullName:'',email:'',whatsapp:'+234',countryResidence:'',category:'',companyName:'',discovery:'',consentRequired:false,website:''};
export function RegistrationSection({preselectedCategory}:{preselectedCategory:string}) {
 const [form,setForm]=useState<RegistrationFormData>(empty);
 const [errors,setErrors]=useState<Record<string,string>>({});
 const [pending,setPending]=useState(false);
 const [success,setSuccess]=useState(false);
 const [failure,setFailure]=useState('');
 const [token,setToken]=useState('');
 const [reset,setReset]=useState(0);
 const locked=useRef(false);
 const successHeading=useRef<HTMLHeadingElement>(null);
 const formRef=useRef<HTMLFormElement>(null);
 const onToken=useCallback((value:string)=>setToken(value),[]);
 useEffect(()=>{if(preselectedCategory)setForm(prev=>({...prev,category:preselectedCategory}));},[preselectedCategory]);
 useEffect(()=>{if(success)successHeading.current?.focus();},[success]);
 const field=(key:keyof RegistrationFormData,value:string|boolean)=>{setForm(prev=>({...prev,[key]:value}));setErrors(prev=>({...prev,[key]:''}));};
 const showCompany=BUSINESS_CATEGORIES.includes(form.category);
 const submit=async(e:React.FormEvent)=>{
  e.preventDefault();if(locked.current)return;
  const found=validateRegistration(form);setErrors(found);setFailure('');
  if(Object.keys(found).length){requestAnimationFrame(()=>formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());return;}
  if(!registrationConfigured){setFailure('Registration is not open yet. Please check back soon.');return;}
  if(!token){setFailure('Please complete the verification check before submitting.');return;}
  locked.current=true;setPending(true);
  try {await submitRegistration(form,token);setSuccess(true);setForm(empty);}
  catch(error){setFailure(error instanceof Error?error.message:'Please try again shortly.');}
  finally{locked.current=false;setPending(false);setToken('');setReset(n=>n+1);}
 };
 const input=(key:'fullName'|'email'|'whatsapp'|'countryResidence'|'companyName'|'discovery',label:string,type='text',placeholder='',autoComplete='off')=><div><label htmlFor={key} className="block text-sm font-semibold mb-2">{label}{key==='discovery' && <span className="font-normal text-[#4A5B53]"> (optional)</span>}</label><input id={key} name={key} type={type} value={form[key]} required={key!=='discovery'} maxLength={key==='email'?254:key==='fullName'?120:key==='whatsapp'?30:key==='countryResidence'?100:160} autoComplete={autoComplete} placeholder={placeholder} className="field" aria-invalid={!!errors[key]} aria-describedby={errors[key]?`${key}-error`:undefined} onChange={e=>field(key,e.target.value)}/>{errors[key]&&<p id={`${key}-error`} className="text-xs text-red-700 mt-2">{errors[key]}</p>}</div>;
 return <section id="register" className="py-20 lg:py-24 px-6 lg:px-12 bg-[#0F3324] text-white relative overflow-hidden"><div aria-hidden="true" className="absolute -right-48 top-24 w-[600px] h-[600px] rounded-full border border-[#7BCB88]/10 pointer-events-none"/><div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 lg:gap-16 relative"><div className="lg:col-span-5"><p className="text-xs uppercase tracking-widest font-bold text-[#7BCB88] mb-6">Free registration</p><h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight leading-[1.12] mb-6">Your next opportunity could start with one introduction.</h2><p className="text-lg font-light text-white/80 leading-relaxed mb-8">Register your interest in the free online seminar and hear about the HyreMoto affiliate opportunity.</p><ul className="space-y-4 text-sm text-white/85">{['Free online seminar','Date to be announced','For individuals, creators, agents and businesses'].map(text=><li key={text} className="flex gap-3 items-center"><CheckCircle2 className="text-[#7BCB88] shrink-0" size={19}/>{text}</li>)}</ul><p className="text-xs text-white/60 leading-relaxed mt-8 max-w-sm">Seminar registration does not automatically approve you as an affiliate. Final eligibility and commission terms will be explained by HyreMoto.</p></div>
 <div className="lg:col-span-7 bg-white text-[#172822] p-6 sm:p-9 rounded-3xl border border-[#172822]/10 shadow-xl">
 {success?<div className="py-10" role="status"><CheckCircle2 size={42} className="text-[#0F3324] mb-6"/><h3 tabIndex={-1} ref={successHeading} className="font-display text-3xl font-bold mb-4">Registration received.</h3><p className="text-[#4A5B53] leading-relaxed">Thank you for registering for the HyreMoto Affiliate Program seminar. The date and access details are to be announced.</p><button className="mt-8 underline text-sm font-bold" onClick={()=>{setSuccess(false);setErrors({});setFailure('');}}>Register another attendee</button></div>:<>
 <h3 className="text-2xl font-display font-bold mb-2">Reserve your free spot</h3><p className="text-sm text-[#4A5B53] mb-7">A few details, and you’re one step closer.</p>
 {!registrationConfigured&&<p className="text-sm bg-[#FFFFFF] border border-[#172822]/10 rounded-xl p-4 mb-6" role="status">Registration opens soon. Event details are being finalised.</p>}
 <form ref={formRef} onSubmit={submit} noValidate className="space-y-5" aria-busy={pending}>
 <fieldset disabled={pending} className="space-y-5"><legend className="sr-only">Attendee details</legend>
 {input('fullName','Full name','text','Your full name','name')}
 <div className="grid sm:grid-cols-2 gap-5">{input('email','Email address','email','you@example.com','email')}{input('whatsapp','WhatsApp number','tel','+2348141234567','tel')}</div>
 <p className="text-xs text-[#4A5B53] -mt-2">Include your country code. For Nigeria, use +234 followed by your number without the initial 0.</p>
 {input('countryResidence','Country of residence','text','e.g. Nigeria','country-name')}
 <div><label htmlFor="category" className="block text-sm font-semibold mb-2">Participant category</label><select id="category" name="category" className="field" value={form.category} required aria-invalid={!!errors.category} aria-describedby={errors.category?'category-error':undefined} onChange={e=>field('category',e.target.value)}><option value="">Select your category</option>{PARTICIPANT_CATEGORIES.map(v=><option key={v}>{v}</option>)}</select>{errors.category&&<p id="category-error" className="text-xs text-red-700 mt-2">{errors.category}</p>}</div>
 {showCompany&&input('companyName','Company or business name','text','Business name','organization')}
 {input('discovery','How did you hear about us?','text','e.g. LinkedIn, WhatsApp or a friend')}
 <div className="absolute -left-[9999px]" aria-hidden="true"><label htmlFor="website">Leave this field empty</label><input id="website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={e=>field('website',e.target.value)}/></div>
 <label className="flex gap-3 text-sm leading-relaxed items-start"><input type="checkbox" required checked={form.consentRequired} onChange={e=>field('consentRequired',e.target.checked)} className="mt-1 w-4 h-4 shrink-0 accent-[#0F3324]" aria-invalid={!!errors.consentRequired} aria-describedby={errors.consentRequired?'consent-error':undefined}/><span>{CONSENT_TEXT}</span></label>
 {errors.consentRequired&&<p id="consent-error" className="text-xs text-red-700">{errors.consentRequired}</p>}
 <p className="text-xs text-[#4A5B53] leading-relaxed">Your details are collected to manage seminar registration and event communications. Bank details and identity documents are not required.</p>
 </fieldset>
 {registrationConfigured&&<Turnstile onToken={onToken} reset={reset}/>}
 {failure&&<p role="alert" className="text-sm text-red-800 bg-red-50 p-4 rounded-xl">{failure}</p>}
 <button type="submit" disabled={pending||!registrationConfigured} className="w-full flex items-center justify-center gap-2 rounded-full bg-[#7BCB88] text-[#0F3324] py-4 font-bold hover:bg-[#A7E2B1]">{pending&&<Loader2 className="animate-spin" size={18}/>} {pending?'Saving registration…':registrationConfigured?'Reserve My Free Spot':'Registration Opens Soon'}</button>
 <p className="text-center text-xs text-[#4A5B53]">Free online seminar · Date to be announced</p>
 </form></>}
 </div></div></section>;
}
