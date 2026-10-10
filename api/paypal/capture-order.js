const {paypal,issueToken}=require('../../lib/paypal');
const LEGENDARY=new Set(['dragon','fenix','unicornio','hidra','kraken','yeti','sirena','fantasma','golem','vampiro']);
const PAID=new Set([
 'lobo','leon','zorro','oso','tigre','rino','tortuga','cocodrilo',
 'delfin','ballena','globo','cangrejo','calamar','foca','payaso',
 'escorpion','abeja','hormiga','mariposa','escarabajo','arana','mosquito','grillo','oruga','caracol',
 'pavo','flamenco','camello','jirafa','cebra','mono','panda','perezoso','loro','koala',
 ...LEGENDARY
]);
module.exports=async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({error:'Método no permitido'});
 try{
  const orderID=String(req.body&&req.body.orderID||'');
  const animal=String(req.body&&req.body.animal||'');
  if(!/^[A-Z0-9]{8,40}$/i.test(orderID)||!PAID.has(animal))return res.status(400).json({error:'Orden o animal no válido.'});
  const expected=LEGENDARY.has(animal)?'3.00':'1.00';
  const before=await paypal('/v2/checkout/orders/'+encodeURIComponent(orderID));
  const unit=before.purchase_units&&before.purchase_units[0];
  if(!unit||unit.custom_id!==animal||!unit.amount||unit.amount.currency_code!=='USD'||unit.amount.value!==expected)return res.status(400).json({error:'La orden no coincide con esta compra.'});
  let captured=before;
  if(before.status!=='COMPLETED')captured=await paypal('/v2/checkout/orders/'+encodeURIComponent(orderID)+'/capture',{method:'POST',body:'{}'});
  const pu=captured.purchase_units&&captured.purchase_units[0];
  const cap=pu&&pu.payments&&pu.payments.captures&&pu.payments.captures[0];
  if(captured.status!=='COMPLETED'||!pu||pu.custom_id!==animal||!cap||cap.status!=='COMPLETED'||!cap.amount||cap.amount.currency_code!=='USD'||cap.amount.value!==expected)return res.status(402).json({error:'PayPal no confirmó el pago completo. No se desbloqueó el animal.'});
  return res.status(200).json({token:issueToken(animal)});
 }catch(e){console.error('capture-order:',e.message);return res.status(502).json({error:'No se pudo confirmar el pago. Si PayPal ya te cobró, conserva el recibo y contacta con soporte.'})}
};
