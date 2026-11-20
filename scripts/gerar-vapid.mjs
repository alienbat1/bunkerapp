// Gera o par de chaves VAPID. Rode UMA vez:  node scripts/gerar-vapid.mjs
// Guarde a saída: a pública vai para o site e o worker, a privada SÓ no worker.
const { subtle } = globalThis.crypto;

const pair = await subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
const raw = new Uint8Array(await subtle.exportKey('raw', pair.publicKey));
const jwk = await subtle.exportKey('jwk', pair.privateKey);

const b64url = (b) => Buffer.from(b).toString('base64url');

console.log('\nVAPID_PUBLIC_KEY (pode ser pública):\n' + b64url(raw));
console.log('\nVAPID_PRIVATE_JWK (SECRETA, nunca no GitHub):\n' + JSON.stringify(jwk));
console.log('');
