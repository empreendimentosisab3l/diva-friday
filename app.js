const {config,campaignState,checkoutUrl}=DivaCampaign;
const $=s=>document.querySelector(s);
function tick(){
 const state=campaignState();
 $('#count-label').textContent=state.phase==='upcoming'?'A Black abre em':state.phase==='ended'?'Diva Friday encerrada':state.remaining===null?'Diva Friday chegou':'A Black acaba em';
 $('#countdown').hidden=state.remaining===null||state.phase==='ended';
 $('#countdown').style.display=$('#countdown').hidden?'none':'';
 if(state.remaining!==null){let t=Math.max(0,Math.floor(state.remaining/1000));const values=[Math.floor(t/86400),Math.floor(t%86400/3600),Math.floor(t%3600/60),t%60];['days','hours','minutes','seconds'].forEach((id,i)=>$('#'+id).textContent=String(values[i]).padStart(2,'0'));}
 $('#offer-status').textContent=config.purchaseMode==='group'?'Estoque esgotado · Entre no grupo de reposição':state.phase==='ended'?'Campanha encerrada':'Frete Grátis + Brindes especiais';
 const stockNote=document.querySelector('.stock-note');if(stockNote){stockNote.dataset.original ||= stockNote.textContent;stockNote.textContent=config.purchaseMode==='group'?'Estoque esgotado — entre no grupo para ser avisada assim que o Diva Slim voltar e garantir o seu produto.':stockNote.dataset.original;}
 document.querySelectorAll('.checkout').forEach(a=>{a.href=config.purchaseMode==='group'?config.groupUrl:checkoutUrl(a.dataset.base,location.search,a.dataset.kit);a.textContent=config.purchaseMode==='group'?'Comprar agora':'Quero este kit ↗';if(config.purchaseMode==='group')a.setAttribute('aria-haspopup','dialog');else a.removeAttribute('aria-haspopup');});
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
// Switch purchaseMode to 'checkout' in campaign.js to restore original per-kit links.
function openStockNotice(){
 const box=document.createElement('div');box.className='stock-notice';
 const logo=document.createElement('img');logo.src='diva-logo.svg?v=2';logo.alt='Diva';logo.className='stock-logo';
 const eyebrow=document.createElement('span');eyebrow.className='eyebrow';eyebrow.textContent='AVISO IMPORTANTE';
 const title=document.createElement('h2');title.id='stock-title';title.textContent='Nosso estoque esgotou!';
 const p=document.createElement('p');p.id='stock-description';p.textContent='Devido à alta procura na Black Friday, o estoque do Diva Slim esgotou!';
 const invite=document.createElement('p');invite.textContent='Entre no nosso grupo de WhatsApp para ser avisada assim que os estoques voltarem e garantir o seu produto.';
 const link=document.createElement('a');link.className='btn stock-group';link.href=config.groupUrl;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Entrar no grupo de reposição ↗';
 const note=document.createElement('small');note.textContent='Acompanhe pelo grupo as novidades sobre a reposição.';
 box.append(logo,eyebrow,title,p,invite,link,note);dialog.setAttribute('aria-labelledby','stock-title');dialog.setAttribute('aria-describedby','stock-description');openMedia(box);
}
document.addEventListener('click',event=>{
 if(config.purchaseMode!=='group'||!(event.target instanceof Element)||!event.target.closest('.kit')||window.getSelection()?.toString())return;
 event.preventDefault();event.stopImmediatePropagation();if(!dialog.open)openStockNotice();
},true);
dialog.addEventListener('close',()=>{dialog.removeAttribute('aria-labelledby');dialog.removeAttribute('aria-describedby');});
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
