// =====================================================================
// api.js — a ÚNICA porta entre o app e o servidor
// =====================================================================
// Toda conversa com o banco passa por aqui. Vantagem: se um dia mudar
// o servidor, só este arquivo muda.
// =====================================================================

const TOKEN_KEY = 'bunker-token';

// A senha fica em dois lugares:
//  - localStorage: para o app
//  - um cache chamado 'bunker-auth': para o service worker, que não enxerga localStorage
export const token = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => {
    localStorage.setItem(TOKEN_KEY, t);
    globalThis.caches?.open('bunker-auth').then((c) => c.put('/token', new Response(t)));
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    globalThis.caches?.delete('bunker-auth');
  },
};

// Erro com código: o app usa err.status === 401 para pedir a senha de novo
class ApiError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

async function request(method, path, data) {
  const res = await fetch(`/api${path}`, {
    method,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${token.get() || ''}`,
    },
    body: data ? JSON.stringify(data) : undefined,
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, payload.error || 'Erro no servidor');
  return payload;
}

// Atalhos legíveis: api.get('/projects'), api.patch('/steps/3', {status:'pausado'})
export const api = {
  get:    (p)    => request('GET', p),
  post:   (p, d) => request('POST', p, d),
  patch:  (p, d) => request('PATCH', p, d),
  delete: (p)    => request('DELETE', p),
};
