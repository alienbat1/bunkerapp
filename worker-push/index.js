// =====================================================================
// BUNKER — Worker de notificações
// =====================================================================
// Por que um Worker separado do site?
//   O site (Pages) só acorda quando alguém abre. Este Worker tem um
//   "cron": a Cloudflare o acorda sozinha a cada 5 minutos para ver
//   se há lembretes vencidos — mesmo com o iPhone guardado no bolso.
//
// Como o push chega no iPhone:
//   Worker → servidor de push da Apple (endpoint) → iPhone → sw.js
//
// Para a Apple aceitar, cada envio leva uma assinatura VAPID: um
// "crachá" (JWT) assinado com sua chave privada. A Apple confere com a
// chave pública que o iPhone recebeu na inscrição.
//
// Simplificação didática: mandamos o push SEM conteúdo. O sw.js, ao
// receber, busca o texto em /api/reminders/latest. Assim evitamos a
// parte de criptografia do conteúdo (RFC 8291), que é longa.
// =====================================================================

const enc = new TextEncoder();
const b64url = (bytes) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

// Cria o JWT VAPID para um servidor de push específico (aud)
async function vapidJWT(audience, env) {
  const header = b64url(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const payload = b64url(enc.encode(JSON.stringify({
    aud: audience,
    exp: Math.floor(Date.now() / 1000) + 12 * 3600,   // vale 12 horas
    sub: env.VAPID_SUBJECT,                            // ex: mailto:voce@exemplo.com
  })));
  const key = await crypto.subtle.importKey(
    'jwk', JSON.parse(env.VAPID_PRIVATE_JWK),
    { name: 'ECDSA', namedCurve: 'P-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' }, key, enc.encode(`${header}.${payload}`));
  return `${header}.${payload}.${b64url(sig)}`;
}

async function sendPush(sub, env) {
  const audience = new URL(sub.endpoint).origin;
  const jwt = await vapidJWT(audience, env);
  return fetch(sub.endpoint, {
    method: 'POST',
    headers: {
      TTL: '86400',                 // se o iPhone estiver offline, tenta por 24h
      Urgency: 'normal',
      Authorization: `vapid t=${jwt}, k=${env.VAPID_PUBLIC_KEY}`,
      'Content-Length': '0',
    },
  });
}

async function run(env) {
  // Lembretes vencidos e ainda não enviados
  const { results: due } = await env.DB.prepare(
    `SELECT * FROM reminders WHERE sent_at IS NULL AND send_at <= datetime('now') ORDER BY send_at`
  ).all();
  if (!due.length) return { sent: 0 };

  const { results: subs } = await env.DB.prepare('SELECT * FROM push_subscriptions').all();

  for (const r of due) {
    // marca como enviado ANTES: o sw.js vai buscar "o último enviado"
    await env.DB.prepare(`UPDATE reminders SET sent_at = datetime('now') WHERE id = ?`).bind(r.id).run();
    for (const s of subs) {
      const res = await sendPush(s, env);
      // 404/410 = a inscrição morreu (app desinstalado, permissão tirada): limpa
      if (res.status === 404 || res.status === 410) {
        await env.DB.prepare('DELETE FROM push_subscriptions WHERE endpoint = ?').bind(s.endpoint).run();
      }
    }
  }
  return { sent: due.length, devices: subs.length };
}

export default {
  // Chamado pelo cron (wrangler.toml → [triggers])
  async scheduled(_event, env, ctx) {
    ctx.waitUntil(run(env));
  },
  // Chamado se você abrir a URL do worker: útil para testar na mão
  async fetch(request, env) {
    if (request.headers.get('authorization') !== `Bearer ${env.APP_TOKEN}`) {
      return new Response('Senha incorreta', { status: 401 });
    }
    return Response.json(await run(env));
  },
};
