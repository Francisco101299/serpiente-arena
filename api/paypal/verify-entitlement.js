const {verifyToken}=require('../../lib/paypal');
module.exports=async function handler(req,res){
 if(req.method!=='POST')return res.status(405).json({valid:false});
 const d=verifyToken(req.body&&req.body.token);if(!d)return res.status(200).json({valid:false});
 if(!['dragon','fenix','unicornio','hidra','kraken','yeti','sirena','fantasma','golem','vampiro'].includes(d.animal))return res.status(200).json({valid:false});
 return res.status(200).json({valid:true,animal:d.animal});
};
