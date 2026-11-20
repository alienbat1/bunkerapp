// =====================================================================
// sw.js — SERVICE WORKER
// =====================================================================
// Um script que o iPhone mantém "por trás" do app, mesmo fechado.
// Duas funções aqui:
//   1. CACHE: guarda os arquivos do app para abrir rápido e sem internet
//   2. PUSH:  recebe a notificação e mostra na tela
//
// IMPORTANTE: ao mudar qualquer arquivo de public/, aumente a VERSAO.
// É assim que o iPhone descobre que precisa baixar a versão nova.
// =====================================================================

const VERSAO = 'bunker-v1';

const ARQUIVOS = [
  '/',
  '/index.html',
  '/css/bunker.css',
  '/js/app.js',
  '/js/api.js',
  '/js/ui.js',
  '/js/push.js',
  '/manifest.webmanifest',
  '/icons/icon-192.png',
];

// Instalação: baixa tudo da lista
self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSAO).then((c) => c.addAll(ARQUIVOS)));
  self.skipWaiting();
});

// Ativação: apaga caches de versões antigas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== VERSAO && k !== 'bunker-auth').map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

// Cada pedido de rede passa por aqui
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // API: sempre rede (seus dados precisam estar frescos)
  if (url.pathname.startsWith('/api/')) return;

  // Fontes do Google: guarda na primeira vez e reusa
  if (url.host.includes('fonts.g')) {
    event.respondWith(
      caches.open(VERSAO).then(async (c) => {
        const hit = await c.match(event.request);
        if (hit) return hit;
        const res = await fetch(event.request);
        c.put(event.request, res.clone());
        return res;
      })
    );
    return;
  }

  // Arquivos do app: rede primeiro, cache se estiver offline
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(VERSAO).then((c) => c.put(event.request, copy));
        return res;
      })
      .catch(() => caches.match(event.request).then((r) => r || caches.match('/')))
  );
});

// PUSH: o Worker manda um push "vazio" (sem conteúdo criptografado, mais simples).
// Ao receber, buscamos o texto do lembrete na API e mostramos.
self.addEventListener('push', (event) => {
  event.waitUntil((async () => {
    let title = 'Bunker', body = 'Você tem um lembrete.';
    try {
      // o SW não tem localStorage: o token é guardado no cache pelo app (ver nota no README)
      const t = await (await caches.open('bunker-auth')).match('/token');
      const res = await fetch('/api/reminders/latest', {
        headers: { authorization: `Bearer ${t ? await t.text() : ''}` },
      });
      if (res.ok) ({ title, body } = await res.json());
    } catch {}
    await self.registration.showNotification(title, {
      body, icon: '/icons/icon-192.png', badge: '/icons/icon-192.png',
    });
  })());
});

// Tocar na notificação abre o app
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow('/'));
});
