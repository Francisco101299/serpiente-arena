const crypto = require('node:crypto');
const API = process.env.PAYPAL_ENV === 'sandbox' ? 'https://api-m.sandbox.paypal.com' : 'https://api-m.paypal.com';
async function accessToken(){
  const id=process.env.PAYPAL_CLIENT_ID, secret=process.env.PAYPAL_CLIENT_SECRET;
  if(!id||!secret) throw new Error('Faltan PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET en Vercel.');
  const r=await fetch(API+'/v1/oauth2/token',{method:'POST',headers:{Authorization:'Basic '+Buffer.from(id+':'+secret).toString('base64'),'Content-Type':'application/x-www-form-urlencoded'},body:'grant_type=client_credentials'});
  const d=await r.json(); if(!r.ok||!d.access_token) throw new Error('PayPal no autorizó las credenciales.'); return d.access_token;
}
async function paypal(path, opts={}){
 const token=await accessToken(); const r=await fetch(API+path,{...opts,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json',...(opts.headers||{})}}); const d=await r.json().catch(()=>({})); if(!r.ok) throw new Error(d.message||'Error de PayPal'); return d;
}
function issueToken(animal){
 const secret=process.env.ENTITLEMENT_SECRET; if(!secret||secret.length<32) throw new Error('Configura ENTITLEMENT_SECRET (mínimo 32 caracteres) en Vercel.');
 const payload=Buffer.from(JSON.stringify({animal,exp:Date.now()+1000*60*60*24*365*10})).toString('base64url');
 const sig=crypto.createHmac('sha256',secret).update(payload).digest('base64url'); return payload+'.'+sig;
}
function verifyToken(token){
 try {const [payload,sig]=String(token||'').split('.'); if(!payload||!sig)return null;const secret=process.env.ENTITLEMENT_SECRET;if(!secret)return null;const expected=crypto.createHmac('sha256',secret).update(payload).digest();const got=Buffer.from(sig,'base64url');if(got.length!==expected.length||!crypto.timingSafeEqual(got,expected))return null;const d=JSON.parse(Buffer.from(payload,'base64url').toString('utf8'));if(!d.animal||!Number.isFinite(d.exp)||d.exp<Date.now())return null;return d;}catch(e){return null}
}
module.exports={paypal,issueToken,verifyToken};
