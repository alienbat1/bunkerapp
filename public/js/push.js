// =====================================================================
// push.js — pede permissão e cadastra este iPhone para receber push
// =====================================================================
// Passo a passo do que acontece:
//   1. pede ao servidor a chave pública VAPID (a "assinatura" do Bunker)
//   2. pede permissão ao iOS (só funciona após um toque num botão)
//   3. o iOS devolve uma "inscrição": um endereço único deste aparelho
//   4. guardamos esse endereço no D1; o Worker usa para mandar push
// =====================================================================

import { api } from './api.js';

// A chave vem em base64-url; o navegador quer bytes
function b64urlToBytes(s) {
  const pad = '='.repeat((4 - (s.length % 4)) % 4);
  const raw = atob((s + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}

export async function enablePush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Instale o Bunker na Tela de Início primeiro.');
  }
  const { key } = await api.get('/push/key');
  if (!key) throw new Error('Falta configurar VAPID_PUBLIC_KEY na Cloudflare.');

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Permissão negada nos Ajustes do iPhone.');

  const reg = await navigator.serviceWorker.ready;
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,                 // obrigatório: todo push mostra um aviso
    applicationServerKey: b64urlToBytes(key),
  });
  await api.post('/push/subscribe', sub.toJSON());
}
