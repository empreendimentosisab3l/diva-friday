// Campaign dates use Sao Paulo time. End stays null until supplied by the brand.
(function(root){
 const config={startsAt:'2026-11-24T00:00:00-03:00',endsAt:null,checkoutVerified:false,purchaseMode:'group',groupUrl:'https://chat.whatsapp.com/I08koZAaq97E9eNe2oXuvQ?s=cl&p=i&mlu=4&ilr=4&iam=2'};
 function campaignState(now=Date.now(),settings=config){
  const start=Date.parse(settings.startsAt),end=settings.endsAt?Date.parse(settings.endsAt):null;
  if(now<start)return {phase:'upcoming',remaining:start-now};
  if(end!==null&&now>=end)return {phase:'ended',remaining:0};
  return {phase:'live',remaining:end===null?null:end-now};
 }
 function checkoutUrl(base,search,kit){
  const url=new URL(base),incoming=new URLSearchParams(search);
  for(const [key,value] of incoming){if(/^(utm_[a-z_]+|src|sck|fbclid|gclid|ttclid|clickid|rtkcid)$/.test(key)&&value)url.searchParams.set(key,value);}
  if(incoming.get('rtkcid')&&!incoming.get('clickid'))url.searchParams.set('clickid',incoming.get('rtkcid'));
  url.searchParams.set('kit',String(kit));return url.toString();
 }
 root.DivaCampaign={config,campaignState,checkoutUrl};
 if(typeof module!=='undefined')module.exports=root.DivaCampaign;
})(typeof window!=='undefined'?window:globalThis);
