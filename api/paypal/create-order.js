const {paypal}=require('../../lib/paypal');
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
  const animal=String(req.body&&req.body.animal||'');
  if(!PAID.has(animal))return res.status(400).json({error:'Animal no válido para compra.'});
  const value=LEGENDARY.has(animal)?'3.00':'1.00';
  const order=await paypal('/v2/checkout/orders',{method:'POST',body:JSON.stringify({intent:'CAPTURE',purchase_units:[{reference_id:'super-serpientes-'+animal,custom_id:animal,description:'Super Serpientes - '+animal,amount:{currency_code:'USD',value}}]})});
  return res.status(200).json({id:order.id});
 }catch(e){console.error('create-order:',e.message);return res.status(502).json({error:'No se pudo iniciar el pago. Revisa la configuración de PayPal.'})}
};
