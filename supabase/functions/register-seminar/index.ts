import { createClient } from 'npm:@supabase/supabase-js@2.118.0';
import { normaliseSubmission } from './validation.ts';
const eventId='hyremoto-affiliate-seminar';
const consentText='I agree to receive confirmation, seminar access details and reminders from HyreMoto by email and WhatsApp.';
Deno.serve(async(req:Request)=>{
 const origin=req.headers.get('origin')??'';
 const origins=(Deno.env.get('ALLOWED_ORIGINS')??'').split(',').map(v=>v.trim()).filter(Boolean);
 const headers={'Access-Control-Allow-Origin':origins.includes(origin)?origin:'null','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS','Vary':'Origin','Cache-Control':'no-store'};
 const reply=(body:unknown,status=200)=>Response.json(body,{status,headers});
 if(!origin || !origins.includes(origin))return reply({error:'Origin not allowed.'},403);
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers});
 if(req.method!=='POST')return reply({error:'Method not allowed.'},405);
 const secret=Deno.env.get('TURNSTILE_SECRET_KEY');const salt=Deno.env.get('RATE_LIMIT_SALT');
 if(Deno.env.get('REGISTRATION_OPEN')!=='true'||!secret||!salt)return reply({error:'Registration is not open.'},503);
 try {
  if(!req.headers.get('content-type')?.includes('application/json'))return reply({error:'Expected JSON.'},415);
  if(Number(req.headers.get('content-length')??0)>8192)return reply({error:'Payload too large.'},413);
  // Bound decoded request body even when content-length is absent/chunked.
  const reader=req.body?.getReader();if(!reader)return reply({error:'Invalid request.'},400);
  let size=0;const chunks:Uint8Array[]=[];
  while(true){const{done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>8192){await reader.cancel();return reply({error:'Payload too large.'},413);}chunks.push(value);}
  const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
  let input:Record<string,unknown>;let row:ReturnType<typeof normaliseSubmission>;
  try{input=JSON.parse(new TextDecoder().decode(bytes));row=normaliseSubmission(input);}catch{return reply({error:'Please complete the required fields.'},400);}
  if(typeof input.token!=='string'||input.token.length>2048)return reply({error:'Verification required.'},400);
  const verify=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret,response:input.token}),signal:AbortSignal.timeout(10000)});
  if(!verify.ok)return reply({error:'Verification unavailable.'},503);
  const result=await verify.json();
  const allowedHosts=origins.map(o=>new URL(o).hostname);
  if(!result.success||result.action!=='seminar-registration'||!allowedHosts.includes(result.hostname))return reply({error:'Verification failed.'},400);
  const db=createClient(Deno.env.get('SUPABASE_URL')!,Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,{auth:{persistSession:false,autoRefreshToken:false}});
  // Prefer gateway-provided forwarding headers. Turnstile is the primary public abuse control.
  const client=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()??'unknown';
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+':'+client));
  const key=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  const {data:allowed,error:limitError}=await db.rpc('consume_seminar_limit',{limit_key:key});
  if(limitError)return reply({error:'Registration unavailable.'},503);
  if(!allowed)return reply({error:'Please try again later.'},429);
  const {error}=await db.from('seminar_registrations').insert({...row,event_id:eventId,consent_version:'seminar-2026-10-v1',consent_text:consentText});
  // A duplicate email receives the same response, without exposing existing attendee details.
  // Do not overwrite existing details or consent on an unauthenticated duplicate request.
  if(error&&error.code!=='23505')return reply({error:'Registration unavailable.'},503);
  return reply({ok:true});
 }catch{return reply({error:'Registration unavailable. Please try again.'},503);}
});
