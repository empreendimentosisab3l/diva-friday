const {config,campaignState,checkoutUrl}=DivaCampaign;
const $=s=>document.querySelector(s);
function tick(){
 const state=campaignState();
 $('#count-label').textContent=state.phase==='upcoming'?'A Black abre em':state.phase==='ended'?'Diva Friday encerrada':state.remaining===null?'Diva Friday chegou':'A Black acaba em';
 $('#countdown').hidden=state.remaining===null||state.phase==='ended';
 $('#countdown').style.display=$('#countdown').hidden?'none':'';
 if(state.remaining!==null){let t=Math.max(0,Math.floor(state.remaining/1000));const values=[Math.floor(t/86400),Math.floor(t%86400/3600),Math.floor(t%3600/60),t%60];['days','hours','minutes','seconds'].forEach((id,i)=>$('#'+id).textContent=String(values[i]).padStart(2,'0'));}
 $('#offer-status').textContent=state.phase==='ended'?'Campanha encerrada':'Frete Grátis + Brindes especiais';
 document.querySelectorAll('.checkout').forEach(a=>{a.href=state.phase==='live'&&config.checkoutVerified?checkoutUrl(a.dataset.base,location.search,a.dataset.kit):'#quero';a.textContent=state.phase==='upcoming'?'Conhecer este kit ↗':state.phase==='ended'?'Campanha encerrada':'Quero este kit ↗'});
}
tick();setInterval(tick,1000);
const range=$('.compare-range');range.addEventListener('input',()=>{const v=Number(range.value);$('.compare .top').style.clipPath=`inset(0 ${100-v}% 0 0)`;$('.compare-divider').style.left=v+'%';});
document.querySelectorAll('[data-carousel]').forEach(car=>{const rail=car.querySelector('.rail');const buttons=car.querySelectorAll('[data-dir]');function update(){buttons.forEach(b=>b.disabled=Number(b.dataset.dir)<0?rail.scrollLeft<2:rail.scrollLeft+rail.clientWidth>=rail.scrollWidth-3)}buttons.forEach(b=>b.addEventListener('click',()=>rail.scrollBy({left:Number(b.dataset.dir)*(rail.firstElementChild.getBoundingClientRect().width+parseFloat(getComputedStyle(rail).gap)),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})));rail.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update);update();});
const dialog=$('#media-dialog'),content=$('#media-content');let previousFocus;
function openMedia(node){previousFocus=document.activeElement;content.replaceChildren(node);dialog.showModal();document.body.style.overflow='hidden';}
function closeMedia(){dialog.close();}
$('.dialog-close').addEventListener('click',closeMedia);dialog.addEventListener('click',e=>{if(e.target===dialog)closeMedia()});dialog.addEventListener('close',()=>{content.replaceChildren();document.body.style.overflow='';previousFocus?.focus()});
document.querySelectorAll('[data-image]').forEach(b=>b.addEventListener('click',()=>{const img=new Image();img.src=b.dataset.image;img.alt='Relato compartilhado por cliente Diva';openMedia(img)}));
document.querySelectorAll('[data-video]').forEach(b=>b.addEventListener('click',()=>{const frame=document.createElement('iframe');frame.src=`https://www.youtube-nocookie.com/embed/${b.dataset.video}?autoplay=1&playsinline=1`;frame.title='Depoimento Diva';frame.allow='autoplay; encrypted-media; picture-in-picture';frame.allowFullscreen=true;openMedia(frame)}));
document.querySelectorAll('.checkout').forEach(a=>{a.href=campaignState().phase==='live'&&config.checkoutVerified?checkoutUrl(a.dataset.base,location.search,a.dataset.kit):'#quero';a.addEventListener('click',event=>{const state=campaignState();if(state.phase!=='live'||!config.checkoutVerified){event.preventDefault();const box=document.createElement('div');box.className='notice';const title=document.createElement('h3'),p=document.createElement('p');title.textContent=state.phase==='upcoming'?'Sua Diva Friday começa em 24/11':state.phase==='ended'?'A Diva Friday terminou':'Oferta em preparação';p.textContent=state.phase==='upcoming'?'Os valores de Black Friday apresentados nesta página são para a campanha a partir de 24 de novembro. Acompanhe a Diva para saber da abertura.':state.phase==='ended'?'Acompanhe a Diva para conhecer as próximas ofertas.':'A liberação desta oferta será anunciada pelos canais oficiais da Diva.';const social=document.createElement('a');social.className='btn';social.href='https://www.instagram.com/usedivabrasil/';social.target='_blank';social.rel='noopener';social.textContent='Acompanhar @usedivabrasil ↗';box.append(title,p,social);openMedia(box)}})});
const mobile=$('.mobile-cta');new IntersectionObserver(entries=>{mobile.classList.toggle('hide',entries[0].isIntersecting)},{threshold:0}).observe($('#quero'));

// Automatic testimonial movement pauses whenever the visitor interacts.
const photoRail=document.querySelector('#photo-rail');
let photoPaused=false;
photoRail.addEventListener('pointerenter',()=>photoPaused=true);
photoRail.addEventListener('pointerleave',()=>photoPaused=false);
photoRail.addEventListener('touchstart',()=>photoPaused=true,{passive:true});
photoRail.addEventListener('touchend',()=>{setTimeout(()=>photoPaused=false,8000)},{passive:true});
setInterval(()=>{
 if(photoPaused||document.hidden||dialog.open||photoRail.contains(document.activeElement))return;
 const r=photoRail.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;
 const end=photoRail.scrollLeft+photoRail.clientWidth>=photoRail.scrollWidth-3;
 photoRail.scrollTo({left:end?0:photoRail.scrollLeft+photoRail.firstElementChild.getBoundingClientRect().width+parseFloat(getComputedStyle(photoRail).gap),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
},5500);
