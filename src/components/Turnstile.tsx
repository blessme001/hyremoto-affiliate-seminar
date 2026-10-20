import { useEffect, useRef } from 'react';
declare global { interface Window { turnstile?: { render:(el:HTMLElement, options:Record<string,unknown>)=>string; remove:(id:string)=>void }; } }
export function Turnstile({onToken,reset}:{onToken:(token:string)=>void;reset:number}) {
 const el=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  let stopped=false;let widget:string|undefined;
  let script=document.querySelector<HTMLScriptElement>('script[data-turnstile]');
  if(!script){script=document.createElement('script');script.dataset.turnstile='true';script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';script.async=true;document.head.appendChild(script);}
  const mount=()=>{if(!stopped && window.turnstile && el.current && !widget){widget=window.turnstile.render(el.current,{'sitekey':import.meta.env.VITE_TURNSTILE_SITE_KEY,'callback':onToken,'expired-callback':()=>onToken(''),'error-callback':()=>onToken(''),theme:'light',action:'seminar-registration'});}};
  const timer=window.setInterval(mount,250);mount();
  return()=>{stopped=true;clearInterval(timer);if(widget)window.turnstile?.remove(widget);};
 },[onToken,reset]);
 return <div ref={el} className="min-h-16 overflow-x-auto" aria-label="Spam protection" />;
}
