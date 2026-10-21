import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { RegistrationRow } from '../types';
import { PARTICIPANT_CATEGORIES, EVENT_ID } from '../data/registration';
import { registrationCsv } from '../lib/csv';
export function AdminPage() {
 const [session,setSession]=useState<Session|null>(null);
 const [email,setEmail]=useState('');const [password,setPassword]=useState('');
 const [rows,setRows]=useState<RegistrationRow[]>([]);const [status,setStatus]=useState('');const [busy,setBusy]=useState(false);const [allowed,setAllowed]=useState(false);
 const [query,setQuery]=useState('');const [category,setCategory]=useState('');const [country,setCountry]=useState('');const [from,setFrom]=useState('');const [to,setTo]=useState('');
 useEffect(()=>{if(!supabase)return;supabase.auth.getSession().then(({data})=>setSession(data.session));const {data}=supabase.auth.onAuthStateChange((_event,s)=>{setSession(s);setRows([]);setAllowed(false);});return()=>data.subscription.unsubscribe();},[]);
 const load=async()=>{
  if(!supabase||!session)return;
  setBusy(true);setStatus('');setRows([]);setAllowed(false);
  try {
   const {data:admin,error:authError}=await supabase.from('seminar_admins').select('user_id').eq('user_id',session.user.id).maybeSingle();
   if(authError||!admin)throw new Error('This account is not authorised to view seminar registrations.');
   setAllowed(true);
   let all:RegistrationRow[]=[];
   for(let start=0;;start+=500){const {data,error}=await supabase.from('seminar_registrations').select('*').eq('event_id',EVENT_ID).order('created_at',{ascending:false}).order('id').range(start,start+499);if(error)throw new Error('Could not load registrations. Try again.');all=all.concat(data as RegistrationRow[]);if(data.length<500)break;}
   setRows(all);
  }catch(e){setStatus(e instanceof Error?e.message:'Could not load registrations.');}finally{setBusy(false);}
 };
 useEffect(()=>{if(session)void load();},[session]);
 const filtered=rows.filter(r=>{const day=r.created_at.slice(0,10);return (!query||[r.full_name,r.email,r.whatsapp,r.company_name??''].join(' ').toLowerCase().includes(query.toLowerCase()))&&(!category||r.category===category)&&(!country||r.country===country)&&(!from||day>=from)&&(!to||day<=to);});
 const download=()=>{const url=URL.createObjectURL(new Blob([registrationCsv(filtered)],{type:'text/csv;charset=utf-8;'}));const a=document.createElement('a');a.href=url;a.download=`hyremoto-registrations-${new Date().toISOString().slice(0,10)}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
 return <main className="min-h-screen bg-[#FFFFFF] px-5 py-10 text-[#172822]"><div className="max-w-7xl mx-auto"><a href="./" className="font-display font-bold text-xl text-[#0F3324]">HYREMOTO</a><h1 className="section-heading mt-8">Seminar registrations</h1>
 {!supabase?<p>Admin access is available after Supabase is connected.</p>:!session?<form className="max-w-md bg-white p-7 rounded-2xl space-y-5" onSubmit={async e=>{e.preventDefault();setBusy(true);setStatus('');try{const{error}=await supabase!.auth.signInWithPassword({email,password});if(error)setStatus('Unable to sign in. Check your credentials.');setPassword('');}catch{setStatus('Unable to connect. Please try again.');}finally{setBusy(false);}}}><p className="text-sm text-[#4A5B53]">Authorised HyreMoto team members only.</p><label className="block">Email<input required type="email" autoComplete="username" className="field mt-2" value={email} onChange={e=>setEmail(e.target.value)}/></label><label className="block">Password<input required type="password" autoComplete="current-password" className="field mt-2" value={password} onChange={e=>setPassword(e.target.value)}/></label><button disabled={busy} className="bg-[#0F3324] text-white rounded-full px-6 py-3">{busy?'Signing in…':'Sign in'}</button></form>:<>
 <div className="flex flex-wrap gap-3 mb-8"><button onClick={load} disabled={busy} className="bg-[#0F3324] text-white rounded-full px-5 py-3">{busy?'Loading…':'Refresh'}</button><button onClick={download} disabled={busy||!allowed||!filtered.length} className="bg-[#7BCB88] rounded-full px-5 py-3 font-bold">Export filtered CSV ({filtered.length})</button><button onClick={async()=>{setRows([]);setAllowed(false);await supabase!.auth.signOut();}} className="underline px-4">Sign out</button></div>
 {allowed&&<><p className="mb-4 text-sm">{rows.length} registrations · {filtered.length} matching filters · Date filters use UTC</p><div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-7"><label className="text-xs font-bold">Search<input className="field mt-2" placeholder="Name, email or phone" value={query} onChange={e=>setQuery(e.target.value)}/></label><label className="text-xs font-bold">Category<select className="field mt-2" value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{PARTICIPANT_CATEGORIES.map(c=><option key={c}>{c}</option>)}</select></label><label className="text-xs font-bold">Country<select className="field mt-2" value={country} onChange={e=>setCountry(e.target.value)}><option value="">All countries</option>{[...new Set(rows.map(r=>r.country))].sort().map(c=><option key={c}>{c}</option>)}</select></label><label className="text-xs font-bold">From<input type="date" className="field mt-2" value={from} onChange={e=>setFrom(e.target.value)}/></label><label className="text-xs font-bold">To<input type="date" className="field mt-2" value={to} onChange={e=>setTo(e.target.value)}/></label></div><div className="overflow-x-auto bg-white rounded-xl border border-[#172822]/10"><table className="w-full text-sm text-left"><caption className="sr-only">Registered seminar attendees</caption><thead className="bg-[#0F3324] text-white"><tr>{['Name','Email','WhatsApp','Country','Category','Company','Registered'].map(c=><th key={c} scope="col" className="p-4 whitespace-nowrap">{c}</th>)}</tr></thead><tbody>{filtered.slice(0,200).map(r=><tr key={r.id} className="border-b border-[#172822]/10">{[r.full_name,r.email,r.whatsapp,r.country,r.category,r.company_name??'—',new Date(r.created_at).toLocaleString()].map((v,i)=><td key={i} className="p-4 whitespace-nowrap">{v}</td>)}</tr>)}{!filtered.length&&!busy&&<tr><td colSpan={7} className="p-8 text-center">No registrations match these filters.</td></tr>}</tbody></table></div>{filtered.length>200&&<p className="mt-4 text-xs">Showing the first 200 matches. CSV export includes all {filtered.length} matching records.</p>}</>}
 </>}
 {status&&<p role="alert" className="mt-5 bg-white rounded-xl p-4 text-red-800">{status}</p>}
 </div></main>;
}
