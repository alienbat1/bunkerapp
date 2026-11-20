// =====================================================================
// app.js — o cérebro: decide qual tela mostrar e desenha
// =====================================================================

import { api, token } from './api.js';
import { h, STATUS, statusTag, money, toCents, bar, toast, sheet } from './ui.js';
import { enablePush } from './push.js';

const tela = document.getElementById('tela');
const abas = document.getElementById('abas');
const fab  = document.getElementById('fab');

const state = {
  categories: [],
  currentCat: Number(localStorage.getItem('bunker-cat')) || null,
};

// ---------- utilidades do ano e cálculo honesto ------------------------
function yearStats() {
  const now = new Date();
  const year = now.getFullYear();
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31, 23, 59, 59);
  const daysLeft = Math.max(0, Math.ceil((end - now) / 86400000));
  const yearPct = Math.min(100, Math.max(1, Math.round(((now - start) / (end - start)) * 100)));
  return { year, daysLeft, yearPct };
}

function projectProgress(p) {
  if (p.target_count > 0) {
    const pct = Math.min(100, Math.round((p.current_count / p.target_count) * 100));
    return { pct, done: p.current_count, total: p.target_count, isHabit: true };
  }
  const total = p.steps_total || 0;
  const done = p.steps_done || 0;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { pct, done, total, isHabit: false };
}

function evaluateHonesty(p) {
  const { pct, done, total, isHabit } = projectProgress(p);
  const { year, daysLeft, yearPct } = yearStats();
  const nextYear = year + 1;

  if (p.horizon === 'next_year') {
    return {
      badge: { cls: 'warn', text: `Para ${nextYear}` },
      note: p.honest_note || `Planejado para ${nextYear}. Sem culpa este ano — foco no que é prioridade agora.`,
    };
  }

  if (pct >= 100) {
    return { badge: { cls: 'ok', text: 'Concluído' }, note: p.honest_note || '' };
  }

  if (isHabit) {
    const remaining = Math.max(0, total - done);
    if (remaining > daysLeft) {
      const realisticMore = Math.max(1, Math.min(remaining, Math.floor(daysLeft / 3)));
      return {
        badge: { cls: 'low', text: `${pct}% · fora do prazo` },
        note: p.honest_note ||
          `Meta de ${total} ${p.count_unit} não é alcançável nos ${daysLeft} dias restantes de ${year}. ` +
          `Mas fechar mais ${realisticMore} ${p.count_unit} antes de 1º de janeiro já reduz a distância para ${nextYear}.`,
      };
    }
    if (pct + 15 < yearPct) {
      return {
        badge: { cls: 'warn', text: `${pct}% · ritmo lento` },
        note: p.honest_note || `Faltam ${remaining} ${p.count_unit} em ${daysLeft} dias. Ainda dá, mas exige constância semanal.`,
      };
    }
    return { badge: { cls: 'ok', text: `${pct}% · no ritmo` }, note: p.honest_note || '' };
  }

  if (total === 0) {
    return {
      badge: { cls: 'low', text: 'Não iniciado' },
      note: p.honest_note || 'Nenhum step definido ainda. Quebre em 2 ou 3 passos curtos ou mova para o próximo ano.',
    };
  }

  const remainingSteps = total - done;
  if (daysLeft <= 45 && pct < 40 && remainingSteps >= 3) {
    return {
      badge: { cls: 'low', text: `${pct}% · apertado` },
      note: p.honest_note || `Faltam ${remainingSteps} steps em ${daysLeft} dias. Se não for essencial agora, considere mover para ${nextYear}.`,
    };
  }

  if (pct >= 60) {
    return {
      badge: { cls: 'ok', text: `${pct}% · no ritmo` },
      note: p.honest_note || `Alcançável até o fim de ${year} mantendo o ritmo atual.`,
    };
  }

  return {
    badge: { cls: 'warn', text: `${pct}% · em andamento` },
    note: p.honest_note || '',
  };
}

function yearOverviewBlock(allProjects, budgets) {
  const { year, daysLeft } = yearStats();
  const thisYear = allProjects.filter((p) => p.horizon !== 'next_year');

  const rows = state.categories.map((c) => {
    const items = thisYear.filter((p) => p.category_id === c.id);
    if (!items.length) return null;
    const avg = Math.round(items.reduce((acc, p) => acc + projectProgress(p).pct, 0) / items.length);
    return { label: c.name, pct: avg };
  }).filter(Boolean);

  if (budgets.length) {
    const totalTarget = budgets.reduce((a, b) => a + (b.target_cents || 0), 0);
    const totalBal = budgets.reduce((a, b) => a + (b.balance_cents || 0), 0);
    const finPct = totalTarget > 0 ? Math.min(100, Math.round((totalBal / totalTarget) * 100)) : 0;
    rows.push({ label: 'Metas R$', pct: finPct });
  }

  return h('section', { class: 'ano-resumo' },
    h('div', { class: 'ano-topo' },
      h('span', { class: 'rotulo' }, `Visão de ${year}`),
      h('span', { class: 'rotulo' }, `${daysLeft} dias restantes`)),
    rows.length
      ? rows.map((r) => h('div', { class: 'ano-linha' },
          h('span', { class: 'rotulo' }, r.label),
          bar(r.pct, 100),
          h('span', { class: 'ano-pct' }, `${r.pct}%`)))
      : h('p', { class: 'rotulo', style: { margin: 0 } }, 'Sem metas ativas para este ano.'));
}

// ---------- roteador ----------------------------------------------------
const routes = [
  [/^#\/?$/,                () => viewCategory(state.currentCat)],
  [/^#\/c\/(\d+)$/,         (id) => viewCategory(Number(id))],
  [/^#\/p\/(\d+)$/,         (id) => viewProject(Number(id))],
  [/^#\/ano$/,              () => viewYear()],
  [/^#\/orcamentos$/,       () => viewBudgets()],
  [/^#\/o\/(\d+)$/,         (id) => viewBudget(Number(id))],
  [/^#\/ajustes$/,          () => viewSettings()],
];

async function router() {
  const hash = location.hash || '#/';
  const route = routes.find(([re]) => re.test(hash));
  if (!route) { location.hash = '#/'; return; }
  const [re, view] = route;
  fab.hidden = false;
  try {
    await view(...hash.match(re).slice(1));
  } catch (err) {
    if (err.status === 401) return viewLogin();
    render(h('div', { class: 'vazio' }, `Algo deu errado: ${err.message}`));
  }
  window.scrollTo(0, 0);
}

const render = (...nodes) =>
  tela.replaceChildren(...nodes.flat(Infinity).filter((n) => n != null && n !== false && n !== ''));

const refresh = () => router();

// ---------- abas de categoria ------------------------------------------
async function loadCategories() {
  state.categories = await api.get('/categories');
  if (!state.categories.some((c) => c.id === state.currentCat)) {
    state.currentCat = state.categories[0]?.id ?? null;
  }
}

function drawTabs(activeId) {
  abas.replaceChildren(
    ...state.categories.map((c) =>
      h('a', { class: 'aba', href: `#/c/${c.id}`, 'aria-current': c.id === activeId ? 'true' : 'false',
               style: { display: 'inline-flex', alignItems: 'center', textDecoration: 'none' } },
        c.name)),
    h('a', { class: 'aba', href: '#/ano', 'aria-current': activeId === 'ano' ? 'true' : 'false',
             style: { display: 'inline-flex', alignItems: 'center', textDecoration: 'none' } }, 'Ano'),
    h('a', { class: 'aba', href: '#/ajustes', 'aria-label': 'Ajustes e categorias',
             'aria-current': activeId === 'ajustes' ? 'true' : 'false',
             style: { display: 'inline-flex', alignItems: 'center', textDecoration: 'none' } }, '⋯'));
}

// =======================================================================
// TELA 0 — senha
// =======================================================================
function viewLogin() {
  fab.hidden = true;
  abas.replaceChildren();
  const form = h('form', {
    onsubmit: (e) => {
      e.preventDefault();
      token.set(new FormData(form).get('t').trim());
      refresh();
    },
  },
    h('h1', {}, 'Entrar no Bunker'),
    h('p', {}, 'Digite a senha que você configurou como APP_TOKEN na Cloudflare. Ela fica salva só neste iPhone.'),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Senha'),
      h('input', { name: 't', type: 'password', required: true, autocomplete: 'current-password' })),
    h('button', { class: 'btn btn-forte', type: 'submit' }, 'Entrar'));
  render(form);
}

// =======================================================================
// TELA 1 — categoria: visão do ano + lista de cards
// =======================================================================
async function viewCategory(catId) {
  await loadCategories();
  if (catId && state.categories.some((c) => c.id === catId)) state.currentCat = catId;
  localStorage.setItem('bunker-cat', state.currentCat);
  drawTabs(state.currentCat);

  const cat = state.categories.find((c) => c.id === state.currentCat);
  const [allProjects, budgets] = await Promise.all([
    api.get('/projects'),
    api.get('/budgets'),
  ]);
  const projects = allProjects.filter((p) => p.category_id === state.currentCat);

  fab.onclick = () => newProject(state.currentCat);
  fab.setAttribute('aria-label', 'Novo projeto');

  render(
    yearOverviewBlock(allProjects, budgets),
    h('div', { class: 'cabecalho-secao' },
      h('h1', {}, cat?.name ?? 'Bunker'),
      h('span', { class: 'rotulo' }, `${projects.length} ${projects.length === 1 ? 'item' : 'itens'}`)),
    projects.length
      ? projects.map(projectCard)
      : h('div', { class: 'vazio' }, 'Nada aqui ainda. Toque em + para criar o primeiro item.'));
}

function projectCard(p) {
  const { pct, done, total, isHabit } = projectProgress(p);
  const honesty = evaluateHonesty(p);
  let loaded = false;

  const corpo = h('div', { class: 'card-corpo', hidden: true, id: `corpo-${p.id}` });

  const cabeca = h('button', {
    class: 'card-cabeca', 'aria-expanded': 'false', 'aria-controls': `corpo-${p.id}`,
    onclick: async () => {
      const open = cabeca.getAttribute('aria-expanded') !== 'true';
      cabeca.setAttribute('aria-expanded', String(open));
      corpo.hidden = !open;
      if (open && !loaded) { loaded = true; await fillCardBody(p, corpo); }
    },
  },
    h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' } },
      h('h3', {}, h('span', { class: 'seta', 'aria-hidden': 'true' }, '›'), ' ', p.title),
      h('span', { class: `alerta-tag ${honesty.badge.cls}` }, honesty.badge.text)),
    p.summary && h('p', { class: 'card-resumo' }, p.summary),
    h('div', { class: 'card-meta' },
      h('span', { class: 'rotulo' },
        isHabit ? `${done}/${total} ${p.count_unit} (${pct}%)` : `${done}/${total} steps (${pct}%)`),
      p.steps_blocked > 0 && h('span', { class: 'rotulo trava' }, `${p.steps_blocked} bloqueado${p.steps_blocked > 1 ? 's' : ''}`)),
    bar(done, total));

  return h('article', { class: 'card' }, cabeca, corpo);
}

async function fillCardBody(proj, corpo) {
  corpo.replaceChildren(h('p', { class: 'rotulo', style: { marginTop: '16px' } }, 'Carregando…'));
  const p = await api.get(`/projects/${proj.id}`);
  const honesty = evaluateHonesty(p);
  const next = p.steps.filter((s) => s.status !== 'concluido').slice(0, 3);

  corpo.replaceChildren(h('div', {},
    p.target_count > 0 && h('div', { style: { marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' } },
      h('button', {
        class: 'btn btn-forte',
        onclick: async () => {
          await api.post(`/projects/${p.id}/tick`, { delta: 1 });
          toast(`+1 ${p.count_unit} registrado`);
          refresh();
        },
      }, `+1 ${p.count_unit}`)),
    h('p', { class: 'rotulo', style: { marginTop: '16px' } }, 'Próximos passos'),
    next.length
      ? next.map((s) => h('div', { style: { display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' } },
          statusTag(s.status), h('span', {}, s.what)))
      : h('p', {}, 'Nenhum step aberto.'),
    p.budgets.map((b) => h('div', { style: { marginTop: '16px' } },
      h('span', { class: 'rotulo' }, b.title, ' · '),
      h('span', { class: 'dinheiro' }, `${money(b.balance_cents)} de ${money(b.target_cents)}`),
      bar(b.balance_cents, b.target_cents, 'mauve'))),
    honesty.note && h('div', { class: 'nota-honesta' },
      h('strong', {}, 'Nota honesta'),
      honesty.note),
    h('div', { class: 'card-acoes' },
      h('a', { class: 'btn', href: `#/p/${p.id}`, style: { textDecoration: 'none' } }, 'Abrir detalhes →'))));
}

const projectFields = (p = {}, defaultCatId = null) => {
  const { year } = yearStats();
  return [
    { name: 'title', label: 'Nome', required: true, value: p.title, placeholder: 'Aulas de teatro ou Treino' },
    { name: 'summary', label: 'Por que isso existe', type: 'textarea', value: p.summary,
      hint: 'Uma frase. Ela aparece no card.' },
    { name: 'category_id', label: 'Categoria', type: 'select', value: p.category_id ?? defaultCatId ?? state.categories[0]?.id,
      options: state.categories.map((c) => ({ value: c.id, label: c.name })) },
    { name: 'horizon', label: 'Quando', type: 'select', value: p.horizon || 'this_year',
      options: [
        { value: 'this_year', label: `Terminar em ${year}` },
        { value: 'next_year', label: `Levar para ${year + 1}` },
      ] },
    { name: 'target_count', label: 'Meta numérica no ano (opcional — para hábitos)', type: 'number', value: p.target_count || '',
      hint: 'Ex: 150 (deixe vazio se for projeto por steps).' },
    { name: 'current_count', label: 'Já concluído (se tiver meta numérica)', type: 'number', value: p.current_count || '' },
    { name: 'count_unit', label: 'Unidade da meta', value: p.count_unit || 'sessões', placeholder: 'sessões, aulas, ligações' },
    { name: 'honest_note', label: 'Nota honesta personalizada (opcional)', type: 'textarea', value: p.honest_note,
      hint: 'Se vazio, o app calcula automaticamente com base nos dias restantes do ano.' },
  ];
};

async function newProject(categoryId) {
  if (!state.categories.length) {
    toast('Crie uma categoria primeiro em Ajustes (⋯)');
    return;
  }
  const data = await sheet({
    title: 'Novo projeto / hábito',
    fields: projectFields({}, categoryId),
  });
  if (!data) return;
  try {
    const p = await api.post('/projects', data);
    location.hash = `#/p/${p.id}`;
  } catch (err) {
    toast(err.message);
  }
}

// =======================================================================
// TELA 1B — VISÃO DO ANO (Este ano vs. Próximo ano)
// =======================================================================
async function viewYear() {
  if (!state.categories.length) await loadCategories();
  drawTabs('ano');
  const [allProjects, budgets] = await Promise.all([
    api.get('/projects'),
    api.get('/budgets'),
  ]);
  const { year } = yearStats();
  const thisYear = allProjects.filter((p) => p.horizon !== 'next_year');
  const nextYear = allProjects.filter((p) => p.horizon === 'next_year');

  fab.onclick = () => newProject(state.currentCat);
  fab.setAttribute('aria-label', 'Novo item');

  render(
    yearOverviewBlock(allProjects, budgets),
    h('div', { class: 'cabecalho-secao' },
      h('h1', {}, `${year} vs. ${year + 1}`)),

    h('section', { class: 'bloco', style: { marginTop: '16px' } },
      h('div', { class: 'cabecalho-secao' },
        h('h2', {}, `Terminar em ${year}`),
        h('span', { class: 'rotulo' }, `${thisYear.length} itens`)),
      thisYear.length
        ? thisYear.map(projectCard)
        : h('div', { class: 'vazio' }, `Nenhum item marcado para ${year}.`)),

    h('section', { class: 'bloco' },
      h('div', { class: 'cabecalho-secao' },
        h('h2', {}, `Levar para ${year + 1}`),
        h('span', { class: 'rotulo' }, 'guardado, não abandonado')),
      nextYear.length
        ? nextYear.map(projectCard)
        : h('div', { class: 'vazio' }, `Nada adiado para ${year + 1} ainda.`)));
}

// =======================================================================
// TELA 2 — projeto / hábito em tela cheia
// =======================================================================
async function viewProject(id) {
  if (!state.categories.length) await loadCategories();
  const p = await api.get(`/projects/${id}`);
  drawTabs(p.category_id);

  fab.onclick = () => newStep(id);
  fab.setAttribute('aria-label', 'Novo step');

  const { pct, done, total, isHabit } = projectProgress(p);
  const honesty = evaluateHonesty(p);

  render(
    h('a', { class: 'btn btn-leve voltar', href: `#/c/${p.category_id}` }, '← Voltar'),
    h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', flexWrap: 'wrap' } },
      h('h1', {}, p.title),
      h('span', { class: `alerta-tag ${honesty.badge.cls}` }, honesty.badge.text)),
    p.summary && h('p', { style: { marginTop: '12px' } }, p.summary),
    h('span', { class: 'rotulo' },
      isHabit
        ? `${done} de ${total} ${p.count_unit} concluídas (${pct}%)`
        : `${done} de ${total} steps concluídos (${pct}%)`),
    bar(done, total),

    honesty.note && h('div', { class: 'nota-honesta' },
      h('strong', {}, 'Nota honesta'),
      honesty.note),

    h('div', { class: 'linha-botoes', style: { justifyContent: 'flex-start' } },
      isHabit && h('button', {
        class: 'btn btn-forte',
        onclick: async () => {
          await api.post(`/projects/${p.id}/tick`, { delta: 1 });
          toast(`+1 ${p.count_unit}`);
          refresh();
        },
      }, `+1 ${p.count_unit}`),
      h('button', { class: 'btn', onclick: () => editProject(p) }, 'Editar'),
      h('button', { class: 'btn', onclick: () => archiveProject(p) }, 'Arquivar')),

    h('section', { class: 'bloco' },
      h('div', { class: 'cabecalho-secao' }, h('h2', {}, 'Steps'),
        h('button', { class: 'btn', onclick: () => newStep(id) }, '+ Step')),
      p.steps.length
        ? p.steps.map(stepItem)
        : h('div', { class: 'vazio' }, 'Quebre em passos pequenos e concretos.')),

    h('section', { class: 'bloco' },
      h('div', { class: 'cabecalho-secao' }, h('h2', {}, 'Dinheiro'),
        h('button', { class: 'btn', onclick: () => newBudget(id) }, '+ Meta')),
      p.budgets.length
        ? p.budgets.map(budgetCard)
        : h('p', { class: 'rotulo' }, 'Nenhuma meta financeira vinculada.')));
}

function stepItem(s) {
  const detalhe = h('div', { class: 'step-detalhe', hidden: true },
    h('dl', {},
      h('div', {}, h('dt', {}, 'Onde'), h('dd', {}, s.place || '—')),
      h('div', {}, h('dt', {}, 'Por quê'), h('dd', {}, s.why || '—')),
      s.status === 'bloqueado' && h('div', {}, h('dt', {}, 'Travado por'), h('dd', { class: 'trava' }, s.blocked_by || '—')),
      s.due_date && h('div', {}, h('dt', {}, 'Prazo'), h('dd', { class: 'mono' }, s.due_date.split('-').reverse().join('/')))),
    h('div', { class: 'seletor-status', role: 'group', 'aria-label': 'Mudar status' },
      Object.keys(STATUS).map((key) =>
        h('button', { type: 'button', class: 'status', 'data-s': key, 'aria-pressed': String(key === s.status),
                      onclick: () => changeStatus(s, key) },
          h('span', { 'aria-hidden': 'true' }, STATUS[key].icon), STATUS[key].label))),
    h('div', { class: 'linha-botoes' },
      h('button', { class: 'btn btn-leve', onclick: () => deleteStep(s) }, 'Apagar'),
      h('button', { class: 'btn', onclick: () => remindStep(s) }, 'Lembrar'),
      h('button', { class: 'btn', onclick: () => editStep(s) }, 'Editar')));

  const linha = h('button', {
    class: 'step-linha', 'aria-expanded': 'false',
    onclick: () => {
      const open = linha.getAttribute('aria-expanded') !== 'true';
      linha.setAttribute('aria-expanded', String(open));
      detalhe.hidden = !open;
    },
  }, h('span', { class: 'step-o-que' }, s.what), statusTag(s.status));

  return h('div', { class: 'step', 'data-s': s.status }, linha, detalhe);
}

const stepFields = (s = {}) => [
  { name: 'what',  label: 'O que fazer', required: true, value: s.what,
    hint: 'Um verbo + algo concreto. Ex: "Ligar para a escola e perguntar horários".' },
  { name: 'place', label: 'Onde', value: s.place, hint: 'Lugar, site ou app. Ex: "Site do Teatro Escola, aba Cursos".' },
  { name: 'why',   label: 'Por quê', type: 'textarea', value: s.why,
    hint: 'Uma frase que você vai ler quando der preguiça.' },
  { name: 'due_date', label: 'Prazo (opcional)', type: 'date', value: s.due_date },
];

async function newStep(projectId) {
  const data = await sheet({ title: 'Novo step', fields: stepFields() });
  if (!data) return;
  await api.post(`/projects/${projectId}/steps`, data);
  toast('Step criado');
  refresh();
}

async function editStep(s) {
  const fields = stepFields(s);
  if (s.status === 'bloqueado') {
    fields.push({ name: 'blocked_by', label: 'O que está travando', value: s.blocked_by });
  }
  const data = await sheet({ title: 'Editar step', fields });
  if (!data) return;
  await api.patch(`/steps/${s.id}`, data);
  refresh();
}

async function changeStatus(s, status) {
  const patch = { status };
  if (status === 'bloqueado') {
    const data = await sheet({
      title: 'O que está travando?',
      fields: [{ name: 'blocked_by', label: 'Bloqueio', value: s.blocked_by,
                 hint: 'Ex: "Esperando resposta do e-mail da escola".' }],
    });
    if (!data) return;
    patch.blocked_by = data.blocked_by;
  }
  await api.patch(`/steps/${s.id}`, patch);
  toast(`${STATUS[status].label}`);
  refresh();
}

async function remindStep(s) {
  const data = await sheet({
    title: 'Lembrar deste step',
    fields: [{ name: 'when', label: 'Quando', type: 'datetime-local', required: true }],
    submitLabel: 'Agendar',
  });
  if (!data) return;
  const utc = new Date(data.when).toISOString().slice(0, 19).replace('T', ' ');
  await api.post('/reminders', { step_id: s.id, title: s.what, body: s.place || s.why, send_at: utc });
  toast('Lembrete agendado');
}

async function deleteStep(s) {
  if (!confirm(`Apagar o step "${s.what}"?`)) return;
  await api.delete(`/steps/${s.id}`);
  refresh();
}

async function editProject(p) {
  const data = await sheet({
    title: 'Editar projeto / hábito',
    fields: projectFields(p),
  });
  if (!data) return;
  await api.patch(`/projects/${p.id}`, data);
  refresh();
}

async function archiveProject(p) {
  if (!confirm(`Arquivar "${p.title}"? Ele sai da lista mas nada é apagado.`)) return;
  await api.patch(`/projects/${p.id}`, { archived: 1 });
  location.hash = `#/c/${p.category_id}`;
}

// =======================================================================
// TELA 3 — metas financeiras
// =======================================================================
function budgetCard(b) {
  const falta = b.target_cents - b.balance_cents;
  return h('a', { class: 'card', href: `#/o/${b.id}`,
                  style: { display: 'block', padding: '16px', color: 'inherit', textDecoration: 'none' } },
    h('h3', {}, b.title),
    b.project_title && h('p', { class: 'rotulo' }, `Projeto: ${b.project_title}`),
    h('p', { class: 'dinheiro', style: { margin: '8px 0 0' } },
      `${money(b.balance_cents)} / ${money(b.target_cents)}`),
    bar(b.balance_cents, b.target_cents, 'mauve'),
    h('p', { class: 'rotulo', style: { marginTop: '8px' } },
      falta > 0 ? `Faltam ${money(falta)}` : 'Meta atingida'));
}

async function viewBudgets() {
  if (!state.categories.length) await loadCategories();
  drawTabs(null);
  const budgets = await api.get('/budgets');
  fab.onclick = () => newBudget(null);
  fab.setAttribute('aria-label', 'Nova meta financeira');
  render(
    h('div', { class: 'cabecalho-secao' }, h('h1', {}, 'Orçamentos')),
    budgets.length ? budgets.map(budgetCard)
      : h('div', { class: 'vazio' }, 'Nenhuma meta ainda. Toque em + ou crie a partir de um projeto.'));
}

async function newBudget(projectId) {
  const data = await sheet({
    title: 'Nova meta financeira',
    fields: [
      { name: 'title', label: 'Nome', required: true, placeholder: 'Mensalidade do teatro' },
      { name: 'target', label: 'Valor da meta (R$)', required: true, inputmode: 'decimal', placeholder: '450,00' },
      { name: 'period', label: 'Tipo', type: 'select', value: 'total',
        options: [{ value: 'total', label: 'Juntar um valor total' }, { value: 'mensal', label: 'Orçamento por mês' }] },
    ],
  });
  if (!data) return;
  await api.post('/budgets', {
    title: data.title, period: data.period, project_id: projectId,
    target_cents: toCents(data.target),
  });
  toast('Meta criada');
  refresh();
}

async function viewBudget(id) {
  if (!state.categories.length) await loadCategories();
  drawTabs(null);
  const b = await api.get(`/budgets/${id}`);
  fab.onclick = () => newEntry(id);
  fab.setAttribute('aria-label', 'Novo movimento');

  render(
    h('a', { class: 'btn btn-leve voltar', href: b.project_id ? `#/p/${b.project_id}` : '#/orcamentos' }, '← Voltar'),
    h('h1', {}, b.title),
    h('p', { class: 'dinheiro', style: { fontSize: '26px', margin: '16px 0 0' } }, money(b.balance_cents)),
    h('span', { class: 'rotulo' }, `de ${money(b.target_cents)} ${b.period === 'mensal' ? 'por mês' : 'no total'}`),
    bar(b.balance_cents, b.target_cents, 'mauve'),
    h('div', { class: 'linha-botoes', style: { justifyContent: 'flex-start' } },
      h('button', { class: 'btn btn-forte', onclick: () => newEntry(id) }, '+ Movimento'),
      h('button', { class: 'btn', onclick: () => editBudget(b) }, 'Editar')),
    h('section', { class: 'bloco' },
      h('h2', {}, 'Histórico'),
      b.entries.length
        ? b.entries.map((e) => h('div', { class: 'entrada' },
            h('div', {},
              h('div', {}, e.note || (e.amount_cents > 0 ? 'Guardei' : 'Gastei')),
              h('span', { class: 'rotulo' }, e.date.split('-').reverse().join('/'))),
            h('div', { style: { textAlign: 'right' } },
              h('div', { class: `dinheiro ${e.amount_cents > 0 ? 'positivo' : 'negativo'}` },
                `${e.amount_cents > 0 ? '+' : '−'} ${money(Math.abs(e.amount_cents))}`),
              h('button', { class: 'btn btn-leve', style: { minHeight: '36px', padding: 0 },
                onclick: async () => { if (confirm('Apagar este movimento?')) { await api.delete(`/entries/${e.id}`); refresh(); } } },
                'apagar'))))
        : h('p', { class: 'rotulo' }, 'Nenhum movimento ainda.')));
}

async function newEntry(budgetId) {
  const data = await sheet({
    title: 'Novo movimento',
    fields: [
      { name: 'kind', label: 'Tipo', type: 'select', value: 'in',
        options: [{ value: 'in', label: '+ Guardei / recebi' }, { value: 'out', label: '− Gastei' }] },
      { name: 'amount', label: 'Valor (R$)', required: true, inputmode: 'decimal', placeholder: '50,00' },
      { name: 'note', label: 'Nota (opcional)', placeholder: 'Mensalidade de março' },
      { name: 'date', label: 'Data', type: 'date', value: new Date().toISOString().slice(0, 10) },
    ],
  });
  if (!data) return;
  const cents = toCents(data.amount);
  await api.post(`/budgets/${budgetId}/entries`, {
    amount_cents: data.kind === 'out' ? -cents : cents, note: data.note, date: data.date,
  });
  refresh();
}

async function editBudget(b) {
  const data = await sheet({
    title: 'Editar meta',
    fields: [
      { name: 'title', label: 'Nome', required: true, value: b.title },
      { name: 'target', label: 'Valor da meta (R$)', inputmode: 'decimal',
        value: (b.target_cents / 100).toFixed(2).replace('.', ',') },
    ],
  });
  if (!data) return;
  await api.patch(`/budgets/${b.id}`, { title: data.title, target_cents: toCents(data.target) });
  refresh();
}

// =======================================================================
// TELA 4 — ajustes
// =======================================================================
async function viewSettings() {
  await loadCategories();
  drawTabs('ajustes');
  fab.hidden = true;
  const all = await api.get('/categories?all=1');

  const toggle = async (c) => {
    await api.patch(`/categories/${c.id}`, { archived: c.archived ? 0 : 1 });
    toast(c.archived ? `${c.name} reativada` : `${c.name} arquivada`);
    refresh();
  };

  render(
    h('h1', {}, 'Ajustes'),
    h('section', { class: 'bloco' },
      h('div', { class: 'cabecalho-secao' }, h('h2', {}, 'Categorias'),
        h('button', { class: 'btn', onclick: async () => {
          const d = await sheet({ title: 'Nova categoria', fields: [{ name: 'name', label: 'Nome', required: true }] });
          if (d) { await api.post('/categories', d); refresh(); }
        } }, '+ Nova')),
      h('p', {}, 'Categorias são arquivadas, nunca apagadas. Arquivar só esconde a aba.'),
      all.map((c) => h('div', { class: 'entrada', style: { alignItems: 'center' } },
        h('span', { style: c.archived ? { color: 'var(--tinta-suave)' } : {} },
          c.name, c.archived ? ' (arquivada)' : ''),
        h('button', { class: 'btn', onclick: () => toggle(c) }, c.archived ? 'Reativar' : 'Arquivar')))),
    h('section', { class: 'bloco' },
      h('h2', {}, 'Notificações'),
      h('p', {}, 'No iPhone, só funciona com o Bunker instalado na Tela de Início (Compartilhar → Adicionar à Tela de Início).'),
      h('button', { class: 'btn btn-forte', onclick: async () => {
        try { await enablePush(); toast('Notificações ativadas'); }
        catch (err) { toast(err.message); }
      } }, 'Ativar notificações')),
    h('section', { class: 'bloco' },
      h('button', { class: 'btn btn-leve', onclick: () => { token.clear(); viewLogin(); } }, 'Sair deste aparelho')));
}

// ---------- partida -----------------------------------------------------
window.addEventListener('hashchange', router);
router();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
