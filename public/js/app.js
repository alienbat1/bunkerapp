// =====================================================================
// app.js — Dados estáticos + telas (Gallery, Dashboard, Calendar, Tasks)
// =====================================================================

// ---------------------------------------------------------------------
// 1. DADOS FIXOS (edite manualmente aqui)
// ---------------------------------------------------------------------
// Cria placeholders visuais leves sem depender de arquivos externos
const placeholderImg = (label, bg = '#DDD5C7', fg = '#5C514B') =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
      <rect width="600" height="800" fill="${bg}"/>
      <rect x="24" y="24" width="552" height="752" rx="18" fill="none" stroke="${fg}" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="8 8"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="22" fill="${fg}" opacity="0.7">${label}</text>
    </svg>`
  );

export const DATA = {
  year: 2026,
  daysLeft: 42,

  // Visão geral do topo do Dashboard (e da tela de Projetos)
  yearOverview: [
    { label: 'PROJETOS', pct: 8 },
    { label: 'HÁBITOS',  pct: 0 },
  ],

  // Fotos da aba GALLERY
  // size: 'normal' | 'tall' (ocupa 2 linhas) | 'wide' (ocupa 2 colunas e 2 linhas)
  gallery: [
    { id: 1, tag: 'DECORAÇÃO', size: 'normal', image: placeholderImg('DECORAÇÃO', '#6E3538', '#FAF8F5'), categoryId: 'hobbies' },
    { id: 2, tag: 'LEITURA',   size: 'tall',   image: placeholderImg('LEITURA',   '#C9B9A3', '#1A1514'), categoryId: 'estudo' },
    { id: 3, tag: 'DATE',      size: 'normal', image: placeholderImg('DATE',      '#D6CFC7', '#1A1514'), categoryId: 'hobbies' },
    { id: 4, tag: 'TRABALHO',  size: 'normal', image: placeholderImg('TRABALHO',  '#C7BDB3', '#1A1514'), categoryId: 'carreira' },
    { id: 5, tag: 'ESTUDO',    size: 'normal', image: placeholderImg('ESTUDO',    '#B8B0A6', '#1A1514'), categoryId: 'estudo' },
    { id: 6, tag: 'DATE',      size: 'wide',   image: placeholderImg('DATE',      '#E3DDD5', '#1A1514'), categoryId: 'hobbies' },
    { id: 7, tag: 'TRABALHO',  size: 'normal', image: placeholderImg('TRABALHO',  '#CFC8BE', '#1A1514'), categoryId: 'carreira' },
    { id: 8, tag: 'ROTINA',    size: 'tall',   image: placeholderImg('ROTINA',    '#4A4642', '#FAF8F5'), categoryId: 'habitos' },
  ],

  // Categorias e projetos
  categories: [
    {
      id: 'projetos',
      name: 'Projetos',
      projects: [
        {
          id: 'site-do-tio',
          title: 'Site do Tio',
          summary: 'Construir o site do meu tio — professor de inglês e guia turístico.',
          steps: [
            { what: 'Enviar documento de planejamento pro tio', status: 'concluido', dueDate: '2026-11-10' },
            { what: 'Tio preencher o formulário', status: 'concluido', dueDate: '2026-11-14' },
            { what: 'Construir a página no Cloudflare Pages', status: 'andamento', dueDate: '2026-11-28' },
            { what: 'Revisar o site com o tio', status: 'pausado', dueDate: '2026-12-05' },
            { what: 'Configurar domínio personalizado', status: 'pausado', dueDate: '2026-12-10' },
            { what: 'Testar versão mobile no iPhone', status: 'pausado', dueDate: '2026-12-12' },
            { what: 'Ajustar textos finais', status: 'pausado', dueDate: '2026-12-15' },
            { what: 'Publicar versão oficial', status: 'pausado', dueDate: '2026-12-20' },
          ],
        },
      ],
    },
    {
      id: 'financeiro',
      name: 'Financeiro',
      projects: [],
    },
    {
      id: 'habitos',
      name: 'Hábitos',
      projects: [],
    },
    {
      id: 'carreira',
      name: 'Carreira',
      projects: [],
    },
    {
      id: 'estudo',
      name: 'Estudo',
      projects: [],
    },
    {
      id: 'hobbies',
      name: 'Hobbies',
      projects: [],
    },
  ],
};

// ---------------------------------------------------------------------
// 2. HELPERS DE DOM E CÁLCULO
// ---------------------------------------------------------------------
const tela = document.getElementById('tela');
const abas = document.getElementById('abas');

function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat(Infinity)) {
    if (c == null || c === false || c === '') continue;
    el.append(c instanceof Node ? c : String(c));
  }
  return el;
}

const render = (...nodes) =>
  tela.replaceChildren(...nodes.flat(Infinity).filter((n) => n != null && n !== false && n !== ''));

function bar(pct) {
  const safe = Math.max(0, Math.min(100, Math.round(pct || 0)));
  return h('div', { class: 'barra', role: 'progressbar', 'aria-valuenow': safe, 'aria-valuemin': 0, 'aria-valuemax': 100 },
    h('span', { style: { width: `${safe}%` } }));
}

function projectStats(p) {
  const total = p.steps.length;
  const done = p.steps.filter((s) => s.status === 'concluido').length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, pct };
}

function categoryStats(cat) {
  const count = cat.projects.length;
  if (!count) return { count: 0, pct: 0, statusLabel: 'NÃO INICIADO' };
  const sumPct = cat.projects.reduce((acc, p) => acc + projectStats(p).pct, 0);
  const pct = Math.round(sumPct / count);
  const statusLabel = pct >= 100 ? 'CONCLUÍDO' : pct > 0 ? 'INICIADO' : 'NÃO INICIADO';
  return { count, pct, statusLabel };
}

// ---------------------------------------------------------------------
// 3. NAVEGAÇÃO PRINCIPAL (GALLERY, DASHBOARD, CALENDAR, TASKS)
// ---------------------------------------------------------------------
const NAV_TABS = [
  { id: 'gallery',   label: 'GALLERY',   href: '#/gallery' },
  { id: 'dashboard', label: 'DASHBOARD', href: '#/dashboard' },
  { id: 'calendar',  label: 'CALENDAR',  href: '#/calendar' },
  { id: 'tasks',     label: 'TASKS',     href: '#/tasks' },
];

function drawTopNav(activeTab) {
  abas.replaceChildren(
    ...NAV_TABS.map((t) =>
      h('a', {
        class: 'aba',
        href: t.href,
        'aria-current': t.id === activeTab ? 'true' : 'false',
      }, t.label)
    )
  );
}

// ---------------------------------------------------------------------
// 4. BLOCOS REUTILIZÁVEIS (VISÃO DO ANO + CARD DE CATEGORIA)
// ---------------------------------------------------------------------
function renderYearOverviewBox() {
  return h('section', { class: 'bunkr-box' },
    h('div', { class: 'box-topo' },
      h('span', { class: 'rotulo' }, `VISÃO DE ${DATA.year}`),
      h('span', { class: 'rotulo' }, `${DATA.daysLeft} DIAS RESTANTES`)),
    DATA.yearOverview.map((row) =>
      h('div', { class: 'visao-linha' },
        h('span', { class: 'rotulo' }, row.label),
        bar(row.pct),
        h('span', { class: 'pct-rust' }, `${row.pct}%`))));
}

function renderCategorySummaryCard(cat, clickable = true) {
  const { count, pct, statusLabel } = categoryStats(cat);
  return h('article', {
    class: 'bunkr-box',
    style: clickable ? { cursor: 'pointer' } : {},
    onclick: clickable ? () => { location.hash = `#/c/${cat.id}`; } : null,
  },
    h('div', { class: 'box-topo' },
      h('h2', { class: 'cat-titulo' }, cat.name),
      h('span', { class: 'pill-status' }, statusLabel)),
    h('div', { class: 'cat-progresso-linha' },
      h('span', { class: 'rotulo' }, `${count} ${count === 1 ? 'ITEM' : 'ITENS'}`),
      bar(pct),
      h('span', { class: 'pct-rust' }, `${pct}%`)));
}

// ---------------------------------------------------------------------
// 5. TELAS
// ---------------------------------------------------------------------

// TELA 1 — GALLERY (Página 1 do PDF)
function viewGallery() {
  drawTopNav('gallery');
  render(
    h('section', { class: 'gallery-grid' },
      DATA.gallery.map((item) =>
        h('a', {
          class: `gallery-item ${item.size !== 'normal' ? item.size : ''}`,
          href: `#/c/${item.categoryId || 'projetos'}`,
        },
          h('img', { src: item.image, alt: item.tag, loading: 'lazy' }),
          h('span', { class: 'gallery-pill' }, item.tag)))));
}

// TELA 2 — DASHBOARD (Página 2 do PDF)
function viewDashboard() {
  drawTopNav('dashboard');
  render(
    h('div', { class: 'dash-wrap' },
      renderYearOverviewBox(),
      DATA.categories.map((cat) => renderCategorySummaryCard(cat, true))));
}

// TELA 3 — PROJETOS POR CATEGORIA (Página 3 do PDF)
function viewCategory(catId) {
  drawTopNav('dashboard');
  const cat = DATA.categories.find((c) => c.id === catId) || DATA.categories[0];
  const { count, pct, statusLabel } = categoryStats(cat);

  const subTabs = h('div', { class: 'sub-abas' },
    DATA.categories.map((c) =>
      h('a', {
        class: 'sub-aba',
        href: `#/c/${c.id}`,
        'aria-current': c.id === cat.id ? 'true' : 'false',
      }, c.name)));

  const projectCards = cat.projects.length
    ? cat.projects.map((p) => {
        const st = projectStats(p);
        const stepsBox = h('div', { class: 'proj-steps', hidden: true },
          p.steps.map((s) =>
            h('div', { class: `step-row ${s.status}` },
              h('span', { class: 'step-texto' }, s.what),
              h('span', { class: `step-badge ${s.status}` },
                s.status === 'concluido' ? '✓ Concluído' : s.status === 'andamento' ? '▶ Andamento' : '‖ Pendente'))));

        const head = h('button', {
          class: 'proj-cabeca',
          'aria-expanded': 'false',
          onclick: () => {
            const open = head.getAttribute('aria-expanded') !== 'true';
            head.setAttribute('aria-expanded', String(open));
            stepsBox.hidden = !open;
          },
        },
          h('div', { class: 'proj-cabeca-topo' },
            h('h3', { class: 'proj-titulo' }, p.title),
            h('span', { class: 'rotulo' }, `${st.done}/${st.total} Steps (${st.pct}%)`)),
          p.summary && h('p', { class: 'proj-resumo' }, p.summary),
          bar(st.pct));

        return h('div', { class: 'proj-card' }, head, stepsBox);
      })
    : [h('div', { class: 'vazio' }, 'Nenhum projeto cadastrado nesta categoria.')];

  render(
    h('div', { class: 'dash-wrap' },
      subTabs,
      renderYearOverviewBox(),
      h('section', { class: 'bunkr-box' },
        h('div', { class: 'box-topo' },
          h('h2', { class: 'cat-titulo' }, cat.name),
          h('span', { class: 'pill-status' }, statusLabel)),
        h('div', { class: 'cat-progresso-linha' },
          h('span', { class: 'rotulo' }, `${count} ${count === 1 ? 'ITEM' : 'ITENS'}`),
          bar(pct),
          h('span', { class: 'pct-rust' }, `${pct}%`)),
        projectCards)));
}

// TELA 4 — CALENDAR (lista cronológica dos steps com data)
function viewCalendar() {
  drawTopNav('calendar');
  const items = [];
  for (const cat of DATA.categories) {
    for (const p of cat.projects) {
      for (const s of p.steps) {
        if (s.dueDate) items.push({ ...s, project: p.title, category: cat.name });
      }
    }
  }
  items.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  render(
    h('div', { class: 'dash-wrap' },
      h('section', { class: 'bunkr-box' },
        h('div', { class: 'box-topo' },
          h('h2', { class: 'cat-titulo' }, 'Calendar'),
          h('span', { class: 'pill-status' }, `${items.length} DATAS`)),
        items.length
          ? h('div', { class: 'lista-simples' },
              items.map((it) =>
                h('div', { class: 'item-linha' },
                  h('div', {},
                    h('strong', {}, it.what),
                    h('div', { class: 'rotulo-suave', style: { marginTop: '4px' } }, `${it.category} · ${it.project}`)),
                  h('span', { class: 'pill-status' }, it.dueDate.split('-').reverse().join('/')))))
          : h('div', { class: 'vazio' }, 'Nenhuma data cadastrada.'))));
}

// TELA 5 — TASKS (todos os steps reunidos)
function viewTasks() {
  drawTopNav('tasks');
  const allSteps = [];
  for (const cat of DATA.categories) {
    for (const p of cat.projects) {
      for (const s of p.steps) {
        allSteps.push({ ...s, project: p.title, category: cat.name });
      }
    }
  }

  render(
    h('div', { class: 'dash-wrap' },
      h('section', { class: 'bunkr-box' },
        h('div', { class: 'box-topo' },
          h('h2', { class: 'cat-titulo' }, 'Tasks'),
          h('span', { class: 'pill-status' }, `${allSteps.length} STEPS`)),
        allSteps.length
          ? h('div', { class: 'lista-simples' },
              allSteps.map((s) =>
                h('div', { class: `step-row ${s.status}` },
                  h('div', {},
                    h('div', { class: 'step-texto' }, s.what),
                    h('span', { class: 'rotulo-suave' }, `${s.category} · ${s.project}`)),
                  h('span', { class: `step-badge ${s.status}` },
                    s.status === 'concluido' ? '✓ Concluído' : s.status === 'andamento' ? '▶ Andamento' : '‖ Pendente'))))
          : h('div', { class: 'vazio' }, 'Nenhuma tarefa cadastrada.'))));
}

// ---------------------------------------------------------------------
// 6. ROTEADOR
// ---------------------------------------------------------------------
const routes = [
  [/^#\/?$/,           () => viewGallery()],
  [/^#\/gallery$/,     () => viewGallery()],
  [/^#\/dashboard$/,   () => viewDashboard()],
  [/^#\/c\/([\w-]+)$/, (id) => viewCategory(id)],
  [/^#\/calendar$/,    () => viewCalendar()],
  [/^#\/tasks$/,       () => viewTasks()],
];

function router() {
  const hash = location.hash || '#/gallery';
  const route = routes.find(([re]) => re.test(hash));
  if (!route) { location.hash = '#/gallery'; return; }
  const [re, view] = route;
  view(...hash.match(re).slice(1));
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', router);
router();
