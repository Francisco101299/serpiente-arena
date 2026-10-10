const {verifyToken}=require('../../lib/paypal');
const PAID=new Set([
 'lobo','leon','zorro','oso','tigre','rino','tortuga','cocodrilo',
 'delfin','ballena','globo','cangrejo','calamar','foca','payaso',
 'escorpion','abeja','hormiga','mariposa','escarabajo','arana','mosquito','grillo','oruga','caracol',
 'pavo','flamenco','camello','jirafa','cebra','mono','panda','perezoso','loro','koala',
 'dragon','fenix','unicornio','hidra','kraken','yeti','sirena','fantasma','golem','vampiro'
]);
module.exports=async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({valid:false});
 const d=verifyToken(req.body&&req.body.token);
 if(!d||!PAID.has(d.animal))return res.status(200).json({valid:false});
 return res.status(200).json({valid:true,animal:d.animal});
};
