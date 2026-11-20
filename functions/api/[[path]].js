// =====================================================================
// BUNKER — API (Cloudflare Pages Functions)
// =====================================================================
// O nome do arquivo "[[path]].js" dentro de functions/api/ significa:
// "toda URL que começa com /api/ cai aqui". Ex: /api/projects/3/steps
//
// Fluxo de cada pedido:
//   1. confere a senha (token)       → protege seus dados
//   2. acha a rota certa na tabela   → qual função responde
//   3. a função conversa com o D1    → env.DB.prepare(...)
//   4. devolve JSON                  → o app desenha a tela
// =====================================================================

const STATUSES = ['andamento', 'pausado', 'bloqueado', 'concluido'];

// ---------- utilidades ----------------------------------------------

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });

const fail = (status, message) => json({ error: message }, status);

// Lê o corpo do pedido como JSON; se vier vazio, devolve {}
async function body(request) {
  try { return await request.json(); } catch { return {}; }
}

// Monta "UPDATE tabela SET a = ?, b = ?" só com os campos permitidos
// que realmente vieram no pedido. Evita sobrescrever o que você não mandou.
function buildUpdate(table, id, data, allowed) {
  const keys = Object.keys(data).filter((k) => allowed.includes(k));
  if (!keys.length) return null;
  const sets = keys.map((k) => `${k} = ?`);
  if (['projects', 'steps'].includes(table)) sets.push(`updated_at = datetime('now')`);
  return {
    sql: `UPDATE ${table} SET ${sets.join(', ')} WHERE id = ?`,
    args: [...keys.map((k) => data[k]), id],
  };
}

// ---------- rotas ----------------------------------------------------
// Cada linha: [MÉTODO, padrão da URL, função]
// ":id" no padrão vira params.id na função.

const routes = [
  // --- categorias (sem DELETE de propósito) ---
  ['GET', '/categories', async ({ env, url }) => {
    const all = url.searchParams.get('all') === '1';
    const { results } = await env.DB.prepare(
      `SELECT * FROM categories ${all ? '' : 'WHERE archived = 0'} ORDER BY position`
    ).all();
    return json(results);
  }],

  ['POST', '/categories', async ({ env, data }) => {
    if (!data.name?.trim()) return fail(400, 'Nome obrigatório');
    const row = await env.DB.prepare(
      `INSERT INTO categories (name, position)
       VALUES (?, (SELECT COALESCE(MAX(position), 0) + 1 FROM categories))
       RETURNING *`
    ).bind(data.name.trim()).first();
    return json(row, 201);
  }],

  ['PATCH', '/categories/:id', async ({ env, params, data }) => {
    const q = buildUpdate('categories', params.id, data, ['name', 'position', 'archived']);
    if (!q) return fail(400, 'Nada para atualizar');
    await env.DB.prepare(q.sql).bind(...q.args).run();
    return json({ ok: true });
  }],

  // --- projetos ---
  // A lista já vem com a contagem de steps por status: o card mostra o progresso
  // sem precisar de um segundo pedido.
  ['GET', '/projects', async ({ env, url }) => {
    const cat = url.searchParams.get('category');
    const horizon = url.searchParams.get('horizon');
    const archived = url.searchParams.get('archived') === '1' ? 1 : 0;
    const where = ['p.archived = ?'];
    const args = [archived];
    if (cat) { where.push('p.category_id = ?'); args.push(cat); }
    if (horizon) { where.push('p.horizon = ?'); args.push(horizon); }

    const { results } = await env.DB.prepare(
      `SELECT p.*, c.name AS category_name,
         COUNT(s.id)                                             AS steps_total,
         SUM(CASE WHEN s.status = 'concluido' THEN 1 ELSE 0 END) AS steps_done,
         SUM(CASE WHEN s.status = 'bloqueado' THEN 1 ELSE 0 END) AS steps_blocked
       FROM projects p
       LEFT JOIN categories c ON c.id = p.category_id
       LEFT JOIN steps s ON s.project_id = p.id
       WHERE ${where.join(' AND ')}
       GROUP BY p.id
       ORDER BY p.position, p.id`
    ).bind(...args).all();
    return json(results);
  }],

  // Um projeto completo: dados + steps + orçamentos vinculados
  ['GET', '/projects/:id', async ({ env, params }) => {
    const project = await env.DB.prepare('SELECT * FROM projects WHERE id = ?')
      .bind(params.id).first();
    if (!project) return fail(404, 'Projeto não encontrado');
    // batch = vários comandos numa ida só ao banco (mais rápido)
    const [steps, budgets] = await env.DB.batch([
      env.DB.prepare('SELECT * FROM steps WHERE project_id = ? ORDER BY position, id').bind(params.id),
      env.DB.prepare(
        `SELECT b.*, COALESCE(SUM(e.amount_cents), 0) AS balance_cents
         FROM budgets b LEFT JOIN budget_entries e ON e.budget_id = b.id
         WHERE b.project_id = ? AND b.archived = 0
         GROUP BY b.id`
      ).bind(params.id),
    ]);
    return json({ ...project, steps: steps.results, budgets: budgets.results });
  }],

['POST', '/projects', async ({ env, data }) => {
    if (!data.title?.trim() || !data.category_id) return fail(400, 'Título e categoria obrigatórios');
    const row = await env.DB.prepare(
      `INSERT INTO projects (category_id, title, summary, horizon, honest_note, target_count, current_count, count_unit)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *`
    ).bind(
      data.category_id,
      data.title.trim(),
      data.summary ?? '',
      data.horizon === 'next_year' ? 'next_year' : 'this_year',
      data.honest_note ?? '',
      Math.max(0, Math.round(Number(data.target_count) || 0)),
      Math.max(0, Math.round(Number(data.current_count) || 0)),
      (data.count_unit || 'sessões').trim()
    ).first();
    return json(row, 201);
  }],

  ['PATCH', '/projects/:id', async ({ env, params, data }) => {
    const q = buildUpdate('projects', params.id, data,
      ['title', 'summary', 'category_id', 'position', 'archived', 'horizon', 'honest_note', 'target_count', 'current_count', 'count_unit']);
    if (!q) return fail(400, 'Nada para atualizar');
    await env.DB.prepare(q.sql).bind(...q.args).run();
    return json({ ok: true });
  }],

  ['POST', '/projects/:id/tick', async ({ env, params, data }) => {
    const delta = Math.round(Number(data.delta) || 1);
    const row = await env.DB.prepare(
      `UPDATE projects
       SET current_count = MAX(0, current_count + ?), updated_at = datetime('now')
       WHERE id = ? RETURNING *`
    ).bind(delta, params.id).first();
    return json(row);
  }],
  ['DELETE', '/projects/:id', async ({ env, params }) => {
    await env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(params.id).run();
    return json({ ok: true });
  }],

  // --- steps ---
  ['POST', '/projects/:id/steps', async ({ env, params, data }) => {
    if (!data.what?.trim()) return fail(400, 'O "o que fazer" é obrigatório');
    const status = STATUSES.includes(data.status) ? data.status : 'andamento';
    const row = await env.DB.prepare(
      `INSERT INTO steps (project_id, what, place, why, status, due_date, position)
       VALUES (?, ?, ?, ?, ?, ?,
         (SELECT COALESCE(MAX(position), 0) + 1 FROM steps WHERE project_id = ?))
       RETURNING *`
    ).bind(params.id, data.what.trim(), data.place ?? '', data.why ?? '',
           status, data.due_date || null, params.id).first();
    return json(row, 201);
  }],

  ['PATCH', '/steps/:id', async ({ env, params, data }) => {
    if (data.status && !STATUSES.includes(data.status)) return fail(400, 'Status inválido');
    const q = buildUpdate('steps', params.id, data,
      ['what', 'place', 'why', 'status', 'blocked_by', 'due_date', 'position']);
    if (!q) return fail(400, 'Nada para atualizar');
    await env.DB.prepare(q.sql).bind(...q.args).run();
    return json({ ok: true });
  }],

  ['DELETE', '/steps/:id', async ({ env, params }) => {
    await env.DB.prepare('DELETE FROM steps WHERE id = ?').bind(params.id).run();
    return json({ ok: true });
  }],

  // --- metas financeiras ---
  ['GET', '/budgets', async ({ env }) => {
    const { results } = await env.DB.prepare(
      `SELECT b.*, p.title AS project_title, COALESCE(SUM(e.amount_cents), 0) AS balance_cents
       FROM budgets b
       LEFT JOIN projects p ON p.id = b.project_id
       LEFT JOIN budget_entries e ON e.budget_id = b.id
       WHERE b.archived = 0
       GROUP BY b.id ORDER BY b.id`
    ).all();
    return json(results);
  }],

  ['GET', '/budgets/:id', async ({ env, params }) => {
    const budget = await env.DB.prepare(
      `SELECT b.*, COALESCE((SELECT SUM(amount_cents) FROM budget_entries WHERE budget_id = b.id), 0)
         AS balance_cents
       FROM budgets b WHERE b.id = ?`
    ).bind(params.id).first();
    if (!budget) return fail(404, 'Meta não encontrada');
    const { results } = await env.DB.prepare(
      'SELECT * FROM budget_entries WHERE budget_id = ? ORDER BY date DESC, id DESC'
    ).bind(params.id).all();
    return json({ ...budget, entries: results });
  }],

  ['POST', '/budgets', async ({ env, data }) => {
    if (!data.title?.trim()) return fail(400, 'Título obrigatório');
    const row = await env.DB.prepare(
      `INSERT INTO budgets (project_id, title, target_cents, period) VALUES (?, ?, ?, ?) RETURNING *`
    ).bind(data.project_id || null, data.title.trim(),
           Math.round(Number(data.target_cents) || 0),
           data.period === 'mensal' ? 'mensal' : 'total').first();
    return json(row, 201);
  }],

  ['PATCH', '/budgets/:id', async ({ env, params, data }) => {
    const q = buildUpdate('budgets', params.id, data,
      ['title', 'target_cents', 'period', 'project_id', 'archived']);
    if (!q) return fail(400, 'Nada para atualizar');
    await env.DB.prepare(q.sql).bind(...q.args).run();
    return json({ ok: true });
  }],

  ['POST', '/budgets/:id/entries', async ({ env, params, data }) => {
    const cents = Math.round(Number(data.amount_cents));
    if (!cents) return fail(400, 'Valor obrigatório');
    const row = await env.DB.prepare(
      `INSERT INTO budget_entries (budget_id, amount_cents, note, date)
       VALUES (?, ?, ?, COALESCE(?, date('now'))) RETURNING *`
    ).bind(params.id, cents, data.note ?? '', data.date || null).first();
    return json(row, 201);
  }],

  ['DELETE', '/entries/:id', async ({ env, params }) => {
    await env.DB.prepare('DELETE FROM budget_entries WHERE id = ?').bind(params.id).run();
    return json({ ok: true });
  }],

  // --- push ---
  // A chave pública VAPID é o "remetente" que o iPhone precisa conhecer
  ['GET', '/push/key', async ({ env }) => json({ key: env.VAPID_PUBLIC_KEY || null })],

  ['POST', '/push/subscribe', async ({ env, data }) => {
    const { endpoint, keys } = data;
    if (!endpoint || !keys?.p256dh || !keys?.auth) return fail(400, 'Inscrição inválida');
    await env.DB.prepare(
      `INSERT INTO push_subscriptions (endpoint, p256dh, auth) VALUES (?, ?, ?)
       ON CONFLICT(endpoint) DO UPDATE SET p256dh = excluded.p256dh, auth = excluded.auth`
    ).bind(endpoint, keys.p256dh, keys.auth).run();
    return json({ ok: true }, 201);
  }],

  ['POST', '/reminders', async ({ env, data }) => {
    if (!data.title || !data.send_at) return fail(400, 'Título e horário obrigatórios');
    const row = await env.DB.prepare(
      `INSERT INTO reminders (step_id, title, body, send_at) VALUES (?, ?, ?, ?) RETURNING *`
    ).bind(data.step_id || null, data.title, data.body ?? '', data.send_at).first();
    return json(row, 201);
  }],

  // O service worker chama isto quando chega um push "vazio" (ver worker-push/)
  ['GET', '/reminders/latest', async ({ env }) => {
    const row = await env.DB.prepare(
      `SELECT * FROM reminders WHERE sent_at IS NOT NULL ORDER BY sent_at DESC LIMIT 1`
    ).first();
    return json(row ?? { title: 'Bunker', body: 'Você tem um lembrete.' });
  }],
];

// ---------- roteador --------------------------------------------------
// Compara "/projects/12/steps" com "/projects/:id/steps" pedaço por pedaço.
function match(pattern, path) {
  const a = pattern.split('/'), b = path.split('/');
  if (a.length !== b.length) return null;
  const params = {};
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith(':')) params[a[i].slice(1)] = decodeURIComponent(b[i]);
    else if (a[i] !== b[i]) return null;
  }
  return params;
}

// ---------- ponto de entrada -----------------------------------------
// onRequest é a função que a Cloudflare chama para todo pedido em /api/*
export async function onRequest({ request, env }) {
  // 1. Senha. APP_TOKEN é um "secret" configurado no painel da Cloudflare.
  //    Sem ele configurado, a API recusa tudo (falha fechada, não aberta).
  const auth = request.headers.get('authorization') || '';
  if (!env.APP_TOKEN || auth !== `Bearer ${env.APP_TOKEN}`) {
    return fail(401, 'Senha incorreta');
  }

  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, '').replace(/\/$/, '') || '/';

  for (const [method, pattern, handler] of routes) {
    if (method !== request.method) continue;
    const params = match(pattern, path);
    if (!params) continue;
    try {
      const data = ['POST', 'PATCH'].includes(method) ? await body(request) : {};
      return await handler({ env, url, params, data });
    } catch (err) {
      // O gatilho do banco que impede deletar categoria cai aqui também
      return fail(500, err.message);
    }
  }
  return fail(404, 'Rota não encontrada');
}
