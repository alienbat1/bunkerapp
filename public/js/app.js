// =====================================================================
// app.js — Vision Board Fit-to-Screen + Gamificação Duolingo Solo + Financeiro
// =====================================================================

const STORAGE_KEY = 'bunkr-data-v4';

const placeholderImg = (label, bg = '#DDD5C7', fg = '#5C514B') =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
      <rect width="400" height="500" fill="${bg}"/>
      <rect x="18" y="18" width="364" height="464" rx="14" fill="none" stroke="${fg}" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="6 6"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="18" fill="${fg}" opacity="0.75">${label}</text>
    </svg>`
  );

const DEFAULT_DATA = {
  year: 2026,
  daysLeft: 42,
  bonusXp: 0,
  streak: 3,

  // Gallery como Vision Board: cada foto aponta para um projeto/categoria específico
  gallery: [
    { id: 1, tag: 'SITE DO TIO',    projectId: 'site-do-tio',    categoryId: 'projetos', image: placeholderImg('SITE DO TIO', '#6E3538', '#FAF8F5') },
    { id: 2, tag: 'ACTING CLASSES', projectId: 'acting-classes', categoryId: 'projetos', image: placeholderImg('ACTING', '#C9B9A3', '#1A1514') },
    { id: 3, tag: 'CARREIRA',       projectId: null,             categoryId: 'carreira', image: placeholderImg('CARREIRA', '#C7BDB3', '#1A1514') },
    { id: 4, tag: 'ESTUDO',         projectId: null,             categoryId: 'estudo',   image: placeholderImg('ESTUDO', '#B8B0A6', '#1A1514') },
    { id: 5, tag: 'HÁBITOS',        projectId: null,             categoryId: 'habitos',  image: placeholderImg('HÁBITOS', '#4A4642', '#FAF8F5') },
    { id: 6, tag: 'HOBBIES',        projectId: null,             categoryId: 'hobbies',  image: placeholderImg('HOBBIES', '#D6CFC7', '#1A1514') },
  ],

  categories: [
    {
      id: 'projetos',
      name: 'Projetos',
      archived: false,
      projects: [
        {
          id: 'site-do-tio',
          title: 'Site do Tio',
          summary: 'Construir o site do meu tio — professor de inglês e guia turístico.',
          archived: false,
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
        {
          id: 'acting-classes',
          title: 'Acting Classes',
          summary: 'Pesquisar e me matricular em aulas de atuação em Los Angeles.',
          archived: false,
          financialGoalKey: 'acting',
          steps: [
            { what: 'Pesquisar escolas de teatro em Los Angeles', status: 'andamento', dueDate: '2026-11-25' },
            { what: 'Comparar preços e horários das opções', status: 'pausado', dueDate: '2026-12-02' },
            { what: 'Reservar orçamento mensal para as aulas', status: 'pausado', dueDate: '2026-12-10' },
          ],
        },
      ],
    },
    { id: 'habitos',  name: 'Hábitos',  archived: false, projects: [] },
    { id: 'carreira', name: 'Carreira', archived: false, projects: [] },
    { id: 'estudo',   name: 'Estudo',   archived: false, projects: [] },
    { id: 'hobbies',  name: 'Hobbies',  archived: false, projects: [] },
  ],

  calendarEvents: [
    { id: 'ev-1', date: '2026-11-01', title: 'Spa: 10am to 7pm', type: 'work' },
    { id: 'ev-2', date: '2026-11-02', title: 'Spa: 10am to 7pm', type: 'work' },
    { id: 'ev-3', date: '2026-11-03', title: 'Spa: 10am to 7pm', type: 'work' },
    { id: 'ev-4', date: '2026-11-08', title: 'Spa: 10am to 7pm', type: 'work' },
    { id: 'ev-5', date: '2026-11-09', title: 'Spa: 10am to 7pm', type: 'work' },
    { id: 'ev-6', date: '2026-11-10', title: 'Spa: 10am to 7pm', type: 'work' },
    { id: 'ev-7', date: '2026-11-14', title: 'Spa: 10am to 7pm', type: 'work' },
    { id: 'ev-8', date: '2026-11-15', title: 'Spa: 10am to 7pm', type: 'work' },
    { id: 'ev-9', date: '2026-11-16', title: 'Spa: 10am to 7pm', type: 'work' },
    { id: 'ev-10', date: '2026-11-17', title: 'Spa: 10am to 7pm', type: 'work' },
    { id: 'ev-11', date: '2026-11-22', title: 'Spa: 10am to 7pm', type: 'work' },
    { id: 'ev-12', date: '2026-11-23', title: 'Spa: 10am to 7pm', type: 'work' },
    { id: 'ev-13', date: '2026-11-24', title: 'Spa: 10am to 7pm', type: 'work' },
    { id: 'ev-14', date: '2026-11-29', title: 'Spa: 10am to 7pm', type: 'work' },
    { id: 'ev-15', date: '2026-11-30', title: 'Spa: 10am to 7pm', type: 'work' },
  ],

  recurringBills: [
    { id: 'bill-aluguel', day: 1,  title: 'aluguel',  amount: 1300 },
    { id: 'bill-amazon',  day: 4,  title: 'amazon',   amount: 8 },
    { id: 'bill-hulu',    day: 20, title: 'hulu',     amount: 8 },
    { id: 'bill-bofa',    day: 25, title: 'bofa fee', amount: 5 },
  ],

  financeiro: {
    currentMonth: {
      label: 'Nov 2026',
      income: 3366,
      fixed: 1392,
      variable: 1594,
      analysisText: '',
      breakdown: [
        { name: 'Moradia',      amount: 1300 },
        { name: 'Bramex',       amount: 52 },
        { name: 'Delivery',     amount: 280 },
        { name: 'Amazon',       amount: 400 },
        { name: 'Transporte',   amount: 180 },
        { name: 'Restaurantes', amount: 160 },
        { name: 'Lazer',        amount: 80 },
        { name: 'Streaming',    amount: 35 },
        { name: 'Outros',       amount: 499 },
      ],
    },
    goals: {
      actingCurrent: 0,
      actingTarget: 1500,
      actingProjectId: 'acting-classes',
      reservaCurrent: 1329,
      reservaTarget: 3000,
    },
    cuts: [
      {
        id: 'bramex',
        icon: '❓',
        title: 'Cancelar Bramex',
        saving: '+$52/mês',
        text: 'Cobrança diária de ~$1.75 que você não reconhece. Pode ser um app de transporte ou assinatura esquecida. Vale investigar e cancelar — é o corte mais fácil e mais imediato.',
        destination: '→ $52 → Reserva de Emergência',
        status: 'pending',
      },
      {
        id: 'delivery',
        icon: '🍕',
        title: 'Delivery -30%',
        saving: '+$85/mês',
        text: 'Você gasta ~$280/mês em DoorDash + Uber Eats. Reduzir 30% (3 pedidos a menos por semana) economiza $85 sem eliminar o hábito completamente.',
        destination: '→ $50 → Acting Classes · $35 → Reserva',
        status: 'pending',
      },
      {
        id: 'amazon',
        icon: '🛒',
        title: 'Amazon com lista',
        saving: '+$200/mês',
        text: 'Você compra em rajadas (5–8 pedidos em 1–2 dias), o que indica compras por impulso. Criar uma lista e esperar 48h antes de comprar pode cortar esse gasto pela metade.',
        destination: '→ $100 → Reserva · $100 → Acting Classes',
        status: 'pending',
      },
    ],
    history: [
      { period: 'Mai 2026', income: 3169, expenses: 3011, balance: 158 },
      { period: 'Jun 2026', income: 3030, expenses: 3218, balance: -188 },
      { period: 'Jul 2026', income: 3001, expenses: 3142, balance: -141 },
      { period: 'Ago 2026', income: 2942, expenses: 3267, balance: -325 },
      { period: 'Set 2026', income: 3148, expenses: 2983, balance: 165 },
      { period: 'Out 2026', income: 3350, expenses: 3079, balance: 271 },
    ],
  },
};

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        ...structuredClone(DEFAULT_DATA),
        ...parsed,
        financeiro: {
          ...structuredClone(DEFAULT_DATA.financeiro),
          ...(parsed.financeiro || {}),
        },
      };
    }
  } catch {}
  return structuredClone(DEFAULT_DATA);
}

let DATA = loadData();
let finSubTab = 'mes';
let calYear = 2026;
let calMonth = 10;
let showBreakdown = false;

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA));
  } catch {
    toast('Erro ao salvar no navegador');
  }
}

// ---------------------------------------------------------------------
// GAMIFICAÇÃO (XP, NÍVEL, STREAK & GRAND CHALLENGE 2026)
// ---------------------------------------------------------------------
function computeGamification() {
  let doneSteps = 0;
  let totalGoals = 0;
  let completedGoals = 0;

  for (const cat of activeCategories()) {
    for (const p of activeProjects(cat)) {
      totalGoals++;
      const st = projectStats(p);
      doneSteps += st.done;
      if (st.total > 0 && st.done === st.total) completedGoals++;
    }
  }

  const acceptedCuts = (DATA.financeiro?.cuts || []).filter((c) => c.status === 'accepted').length;
  const xp = (doneSteps * 25) + (completedGoals * 100) + (acceptedCuts * 50) + (Number(DATA.bonusXp) || 0);
  const level = Math.floor(xp / 200) + 1;
  const xpInLevel = xp % 200;
  const xpPct = Math.round((xpInLevel / 200) * 100);
  const yearPct = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return {
    xp,
    level,
    xpInLevel,
    xpPct,
    doneSteps,
    totalGoals,
    completedGoals,
    yearPct,
    streak: DATA.streak || 3,
  };
}

// ---------------------------------------------------------------------
// HELPERS DE DOM E FORMATAÇÃO
// ---------------------------------------------------------------------
const tela = document.getElementById('tela');
const abas = document.getElementById('abas');
const fab  = document.getElementById('fab');
const topoMarca = document.querySelector('.topo-marca');

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

const render = (...nodes) => {
  tela.classList.remove('gallery-mode');
  tela.replaceChildren(...nodes.flat(Infinity).filter((n) => n != null && n !== false && n !== ''));
};

function toast(msg) {
  const el = h('div', { class: 'aviso' }, msg);
  document.body.append(el);
  setTimeout(() => el.remove(), 2500);
}

function fmtUSD(val) {
  const num = Math.round(Number(val) || 0);
  return `$${Math.abs(num).toLocaleString('en-US')}`;
}

function fmtSignedUSD(val) {
  const num = Math.round(Number(val) || 0);
  if (num > 0) return `+$${num.toLocaleString('en-US')}`;
  if (num < 0) return `-$${Math.abs(num).toLocaleString('en-US')}`;
  return '$0';
}

function bar(pct) {
  const safe = Math.max(0, Math.min(100, Math.round(pct || 0)));
  return h('div', { class: 'barra', role: 'progressbar', 'aria-valuenow': safe, 'aria-valuemin': 0, 'aria-valuemax': 100 },
    h('span', { style: { width: `${safe}%` } }));
}

function activeCategories() {
  return DATA.categories.filter((c) => !c.archived);
}

function activeProjects(cat) {
  return (cat.projects || []).filter((p) => !p.archived);
}

function projectStats(p) {
  const total = p.steps.length;
  const done = p.steps.filter((s) => s.status === 'concluido').length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return { total, done, pct };
}

function categoryStats(cat) {
  const list = activeProjects(cat);
  const count = list.length;
  if (!count) return { count: 0, pct: 0, statusLabel: 'FASE 1 · INÍCIO', nextMission: null };
  const sumPct = list.reduce((acc, p) => acc + projectStats(p).pct, 0);
  const pct = Math.round(sumPct / count);
  const statusLabel = pct >= 100 ? '★ CONCLUÍDO' : pct >= 50 ? 'FASE 3 · RETA FINAL' : pct > 0 ? 'FASE 2 · ATIVO' : 'FASE 1 · INÍCIO';

  let nextMission = null;
  for (const p of list) {
    const activeStep = p.steps.find((s) => s.status === 'andamento') || p.steps.find((s) => s.status !== 'concluido');
    if (activeStep) {
      nextMission = `${p.title}: ${activeStep.what}`;
      break;
    }
  }
  return { count, pct, statusLabel, nextMission };
}

function compressImage(file, maxWidth = 800) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ---------------------------------------------------------------------
// TOPO E NAVEGAÇÃO PRINCIPAL (4 ABAS FIXAS)
// ---------------------------------------------------------------------
const NAV_TABS = [
  { id: 'gallery',    label: 'GALLERY',    href: '#/gallery' },
  { id: 'dashboard',  label: 'DASHBOARD',  href: '#/dashboard' },
  { id: 'calendar',   label: 'CALENDAR',   href: '#/calendar' },
  { id: 'financeiro', label: 'FINANCEIRO', href: '#/financeiro' },
];

function drawTopNav(activeTab) {
  const g = computeGamification();
  if (topoMarca) {
    topoMarca.replaceChildren(
      h('a', { class: 'marca', href: '#/gallery' }, 'bunkr'),
      h('span', { class: 'xp-badge-topo' }, `LVL ${g.level} · ${g.xp} XP · 🔥 ${g.streak}d`)
    );
  }

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
// TELA 1 — GALLERY (VISION BOARD FIT-TO-SCREEN SEM ROLAR)
// ---------------------------------------------------------------------
function viewGallery() {
  drawTopNav('gallery');
  fab.hidden = false;
  fab.onclick = () => openCreateSheet('projetos');

  const items = DATA.gallery;
  const count = Math.max(1, items.length);

  // Calcula automaticamente colunas x linhas para caber 100% na tela sem rolar
  const cols = count <= 2 ? 1 : count <= 6 ? 2 : 3;
  const rows = Math.ceil(count / cols);

  const grid = h('section', {
    class: 'gallery-fit-grid',
    style: {
      gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
    },
  },
    items.map((item) => {
      // Ao clicar na foto, vai direto para o projeto vinculado (ou categoria)
      const targetHash = item.projectId
        ? `#/p/${item.categoryId || 'projetos'}/${item.projectId}`
        : `#/c/${item.categoryId || 'projetos'}`;

      return h('a', {
        class: 'gallery-item',
        href: targetHash,
      },
        h('img', { src: item.image, alt: item.tag }),
        h('span', { class: 'gallery-pill' }, item.tag));
    })
  );

  tela.classList.add('gallery-mode');
  tela.replaceChildren(grid);
}

// ---------------------------------------------------------------------
// TELA 2 — DASHBOARD (CHALLENGE DO ANO + MISSÃO DO DIA + 2 COLUNAS)
// ---------------------------------------------------------------------
function viewDashboard() {
  drawTopNav('dashboard');
  fab.hidden = false;
  fab.onclick = () => openCreateSheet('projetos');

  const g = computeGamification();

  // Encontra 1 missão ativa para o foco do dia (ADHD-friendly)
  let dailyMission = null;
  for (const cat of activeCategories()) {
    for (const p of activeProjects(cat)) {
      const step = p.steps.find((s) => s.status === 'andamento') || p.steps.find((s) => s.status !== 'concluido');
      if (step) {
        dailyMission = { cat, project: p, step };
        break;
      }
    }
    if (dailyMission) break;
  }

  // Card 1: Grand Challenge 2026
  const grandChallengeCard = h('section', { class: 'bunkr-hero' },
    h('div', { class: 'box-topo' },
      h('span', { class: 'rotulo', style: { fontWeight: '700' } }, `2026 GRAND CHALLENGE`),
      h('span', { class: 'pill-status' }, `${DATA.daysLeft} DIAS RESTANTES`)),
    h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' } },
      h('span', { class: 'cat-titulo', style: { fontSize: '23px' } }, `Nível ${g.level}`),
      h('span', { class: 'pct-rust' }, `${g.xpInLevel} / 200 XP`)),
    bar(g.xpPct),
    h('div', { style: { display: 'flex', justifyContent: 'space-between', marginTop: '10px' } },
      h('span', { class: 'rotulo-suave' }, `OBJETIVOS DO ANO: ${g.completedGoals}/${g.totalGoals}`),
      h('span', { class: 'rotulo-suave' }, `${g.yearPct}% COMPLETO`)));

  // Card 2: Missão de Hoje (+25 XP imediato)
  const dailyCard = dailyMission
    ? h('section', { class: 'daily-quest-card' },
        h('div', { style: { minWidth: '0' } },
          h('span', { class: 'rotulo', style: { color: 'var(--rust-texto)', fontWeight: '700' } }, '⚡ MISSÃO DE HOJE (+25 XP)'),
          h('div', { style: { fontWeight: '700', fontSize: '14.5px', marginTop: '2px' } }, dailyMission.step.what),
          h('span', { class: 'rotulo-suave', style: { fontSize: '10px' } }, `${dailyMission.cat.name} · ${dailyMission.project.title}`)),
        h('button', {
          type: 'button',
          class: 'btn btn-forte',
          style: { flexShrink: '0' },
          onclick: () => {
            dailyMission.step.status = 'concluido';
            saveData();
            toast('+25 XP! Missão concluída ✨');
            router();
          },
        }, '✓ Feito'))
    : null;

  // Grade 2 colunas: Mini-Challenges por Categoria
  const catsGrid = h('div', { class: 'dash-cats-grid' },
    activeCategories().map((cat) => {
      const st = categoryStats(cat);
      const isDone = st.count > 0 && st.pct >= 100;
      return h('a', {
        class: `cat-challenge-card ${isDone ? 'done' : ''}`,
        href: `#/c/${cat.id}`,
      },
        h('div', {},
          h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '4px', marginBottom: '6px' } },
            h('span', { class: `pill-status ${isDone ? 'pos' : ''}`, style: { fontSize: '8.5px', padding: '2px 8px' } }, st.statusLabel),
            h('span', { class: 'pct-rust', style: { fontSize: '11px' } }, `${st.pct}%`)),
          h('h2', { class: 'cat-challenge-title' }, cat.name)),
        st.nextMission
          ? h('div', { class: 'cat-mission-hint' }, `▶ ${st.nextMission}`)
          : h('div', { class: 'rotulo-suave', style: { fontSize: '10px' } }, `${st.count} ${st.count === 1 ? 'objetivo' : 'objetivos'}`),
        bar(st.pct));
    }));

  render(
    h('div', { class: 'dash-wrap' },
      grandChallengeCard,
      dailyCard,
      catsGrid,
      h('a', { class: 'link-discreto', href: '#/categorias' }, 'Gerenciar categorias →')));
}

// ---------------------------------------------------------------------
// TELA 3 — CATEGORIA & OBJETIVOS (ABRE DIRETO NO PROJETO DA GALLERY)
// ---------------------------------------------------------------------
function viewCategory(catId, focusProjectId = null) {
  drawTopNav('dashboard');
  fab.hidden = false;
  const visibleCats = activeCategories();
  const cat = DATA.categories.find((c) => c.id === catId) || visibleCats[0];
  if (!cat) { location.hash = '#/categorias'; return; }

  const stCat = categoryStats(cat);
  fab.onclick = () => openCreateSheet(cat.id);

  const subTabs = h('div', { class: 'sub-abas' },
    visibleCats.map((c) =>
      h('a', {
        class: 'sub-aba',
        href: `#/c/${c.id}`,
        'aria-current': c.id === cat.id ? 'true' : 'false',
      }, c.name)));

  const cycleStatus = (s) => {
    const order = ['pausado', 'andamento', 'concluido'];
    const next = order[(order.indexOf(s.status) + 1) % order.length];
    s.status = next;
    saveData();
    if (next === 'concluido') toast('+25 XP! Step concluído ✨');
    router();
  };

  const renderProjectCard = (p, isArchived = false) => {
    const st = projectStats(p);
    const finGoals = DATA.financeiro.goals;
    const isLinkedActing = p.financialGoalKey === 'acting' || p.id === 'acting-classes';
    const nextStep = p.steps.find((s) => s.status === 'andamento') || p.steps.find((s) => s.status !== 'concluido');

    // Se veio clicado da Gallery para este projeto, já abre expandido
    const startsOpen = focusProjectId ? p.id === focusProjectId : true;

    const stepsBox = h('div', { class: 'proj-steps', hidden: !startsOpen },
      p.steps.map((s) =>
        h('div', {
          class: `step-row ${s.status}`,
          style: { cursor: 'pointer' },
          onclick: () => cycleStatus(s),
        },
          h('span', { class: 'step-texto' }, s.what),
          h('span', { class: `step-badge ${s.status}` },
            s.status === 'concluido' ? '✓ +25 XP' : s.status === 'andamento' ? '▶ Ativo' : '‖ Fila'))),
      h('div', { class: 'proj-acoes' },
        h('div', { class: 'grupo-acoes-esq' },
          !isArchived && h('button', {
            type: 'button',
            class: 'btn',
            onclick: () => openEditProjectSheet(cat, p),
          }, 'Editar'),
          h('button', {
            type: 'button',
            class: 'btn btn-leve',
            onclick: () => {
              p.archived = !isArchived;
              if (!isArchived) {
                DATA.gallery = DATA.gallery.filter((g) => g.projectId !== p.id);
              }
              saveData();
              toast(isArchived ? 'Objetivo restaurado' : 'Objetivo arquivado');
              router();
            },
          }, isArchived ? 'Restaurar' : 'Arquivar'),
          h('button', {
            type: 'button',
            class: 'btn btn-perigo',
            onclick: () => {
              if (confirm(`Deletar "${p.title}" permanentemente?`)) {
                cat.projects = cat.projects.filter((item) => item.id !== p.id);
                DATA.gallery = DATA.gallery.filter((g) => g.projectId !== p.id);
                saveData();
                toast('Objetivo deletado');
                router();
              }
            },
          }, 'Deletar')),
        !isArchived && h('button', {
          type: 'button',
          class: 'btn btn-forte',
          onclick: () => openAddStepSheet(p),
        }, '+ Step')));

    const head = h('button', {
      type: 'button',
      class: 'proj-cabeca',
      'aria-expanded': String(startsOpen),
      onclick: () => {
        const open = head.getAttribute('aria-expanded') !== 'true';
        head.setAttribute('aria-expanded', String(open));
        stepsBox.hidden = !open;
      },
    },
      h('div', { class: 'proj-cabeca-topo' },
        h('h3', { class: 'proj-titulo' }, p.title),
        h('span', { class: 'pct-rust' }, `${st.done}/${st.total} (${st.pct}%)`)),
      p.summary && h('p', { class: 'proj-resumo' }, p.summary),
      !startsOpen && nextStep && h('div', { class: 'proj-next-step' }, `▶ Próximo: ${nextStep.what}`),
      isLinkedActing && h('a', {
        class: 'proj-fin-tag',
        href: '#/financeiro',
        onclick: (e) => { e.stopPropagation(); finSubTab = 'goals'; },
      }, `Goal Financeiro: ${fmtUSD(finGoals.actingCurrent)} / ${fmtUSD(finGoals.actingTarget)} →`),
      bar(st.pct));

    return h('div', { class: `proj-card ${isArchived ? 'arquivado' : ''}` }, head, stepsBox);
  };

  const activeList = activeProjects(cat);
  const archivedList = (cat.projects || []).filter((p) => p.archived);

  render(
    h('div', { class: 'dash-wrap' },
      subTabs,
      h('section', { class: 'bunkr-hero' },
        h('div', { class: 'box-topo' },
          h('h2', { class: 'cat-titulo' }, cat.name),
          h('span', { class: 'pill-status' }, stCat.statusLabel)),
        h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } },
          h('span', { class: 'rotulo-suave' }, `CHALLENGE DA CATEGORIA`),
          h('span', { class: 'pct-rust' }, `${stCat.pct}%`)),
        bar(stCat.pct)),

      activeList.length
        ? activeList.map((p) => renderProjectCard(p, false))
        : h('div', { class: 'vazio' }, 'Nenhum objetivo aqui ainda. Toque em + para criar.'),

      archivedList.length > 0 && h('section', { class: 'bunkr-box' },
        h('div', { class: 'box-topo' },
          h('h3', { class: 'cat-titulo', style: { fontSize: '22px' } }, 'Arquivados'),
          h('span', { class: 'pill-status' }, `${archivedList.length}`)),
        archivedList.map((p) => renderProjectCard(p, true)))));
}

// ---------------------------------------------------------------------
// TELA 4 — CALENDÁRIO MENSAL + PÁGINA DO DIA
// ---------------------------------------------------------------------
const MONTH_NAMES_EN = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];
const WEEKDAYS_EN = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const pad2 = (n) => String(n).padStart(2, '0');

function getItemsForDate(dateStr) {
  const [, , ddStr] = dateStr.split('-');
  const dayNum = Number(ddStr);

  const events = (DATA.calendarEvents || []).filter((e) => e.date === dateStr);
  const bills  = (DATA.recurringBills || []).filter((b) => Number(b.day) === dayNum);

  const steps = [];
  for (const cat of activeCategories()) {
    for (const p of activeProjects(cat)) {
      for (const s of p.steps) {
        if (s.dueDate === dateStr) steps.push({ step: s, project: p, category: cat });
      }
    }
  }
  return { events, bills, steps };
}

function viewCalendar() {
  drawTopNav('calendar');
  fab.hidden = false;
  fab.onclick = () => { location.hash = `#/day/${calYear}-${pad2(calMonth + 1)}-01`; };

  const firstDayWeekday = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDayWeekday; i++) cells.push(h('div', { class: 'cal-cell vazio' }));

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${calYear}-${pad2(calMonth + 1)}-${pad2(day)}`;
    const weekday = (firstDayWeekday + day - 1) % 7;
    const { events, bills, steps } = getItemsForDate(dateStr);

    const hasBill = bills.length > 0;
    const hasWork = events.some((e) => e.type === 'work');
    const cls = ['cal-cell', weekday === 0 ? 'is-sun' : '', hasBill ? 'has-bill' : hasWork ? 'has-work' : ''].filter(Boolean).join(' ');

    cells.push(
      h('button', {
        type: 'button',
        class: cls,
        onclick: () => { location.hash = `#/day/${dateStr}`; },
      },
        h('span', { class: 'cal-num' }, String(day)),
        bills.slice(0, 1).map((b) => h('div', { class: 'cal-ev bill' }, `${b.title} $${b.amount}`)),
        events.slice(0, 1).map((ev) => h('div', { class: 'cal-ev' }, ev.title.split(':')[0])),
        steps.slice(0, 1).map((st) => h('div', { class: 'cal-ev task' }, `• ${st.step.what}`)))
    );
  }

  render(
    h('div', {},
      h('div', { class: 'cal-header' },
        h('button', {
          type: 'button',
          class: 'cal-nav-btn',
          onclick: () => { calMonth--; if (calMonth < 0) { calMonth = 11; calYear--; } router(); },
        }, '‹'),
        h('h1', { class: 'cal-mes-titulo' }, `${MONTH_NAMES_EN[calMonth]} ${calYear === 2026 ? '' : calYear}`),
        h('button', {
          type: 'button',
          class: 'cal-nav-btn',
          onclick: () => { calMonth++; if (calMonth > 11) { calMonth = 0; calYear++; } router(); },
        }, '›')),
      h('div', { class: 'cal-weekdays' }, WEEKDAYS_EN.map((w) => h('div', {}, w))),
      h('div', { class: 'cal-grid' }, cells)));
}

function viewCalendarDay(dateStr) {
  drawTopNav('calendar');
  fab.hidden = true;

  const [yyyy, mm, dd] = dateStr.split('-').map(Number);
  const dateObj = new Date(yyyy, mm - 1, dd);
  const weekdayName = WEEKDAYS_EN[dateObj.getDay()];
  const monthName = MONTH_NAMES_EN[mm - 1];
  const { events, bills, steps } = getItemsForDate(dateStr);

  const addForm = h('form', {
    class: 'bunkr-box',
    onsubmit: (e) => {
      e.preventDefault();
      const fd = new FormData(addForm);
      const kind = fd.get('kind');
      const title = fd.get('title').trim();
      const amount = Number(fd.get('amount')) || 0;
      if (!title) return;

      if (kind === 'bill') {
        DATA.recurringBills.push({ id: `bill-${Date.now()}`, day: dd, title, amount });
        toast('Pagamento automático salvo');
      } else {
        DATA.calendarEvents.push({ id: `ev-${Date.now()}`, date: dateStr, title, type: kind });
        toast('Adicionado ao dia');
      }
      saveData();
      router();
    },
  },
    h('h3', { class: 'proj-titulo', style: { marginBottom: '12px' } }, 'Adicionar neste dia'),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Tipo'),
      h('select', { name: 'kind' },
        h('option', { value: 'work' }, 'Trabalho / Compromisso (verde)'),
        h('option', { value: 'note' }, 'Nota / Lembrete'),
        h('option', { value: 'bill' }, `Pagamento automático — todo dia ${dd} (rosa)`))),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Descrição'),
      h('input', { type: 'text', name: 'title', required: true, placeholder: 'Ex: Spa: 10am to 7pm' })),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Valor em $ (se for pagamento automático)'),
      h('input', { type: 'number', name: 'amount', step: 'any', placeholder: 'Ex: 12' })),
    h('div', { class: 'linha-botoes' },
      h('button', { type: 'submit', class: 'btn btn-forte' }, '+ Adicionar')));

  render(
    h('div', { class: 'dash-wrap' },
      h('div', { class: 'box-topo' },
        h('a', { class: 'btn', href: '#/calendar' }, '← Calendário'),
        h('span', { class: 'pill-status' }, `${dd}/${pad2(mm)}/${yyyy}`)),
      h('section', { class: 'bunkr-hero' },
        h('h1', { class: 'cat-titulo', style: { marginBottom: '12px' } }, `${weekdayName}, ${monthName} ${dd}`),
        bills.map((b) =>
          h('div', { class: 'item-linha', style: { background: 'var(--mauve-cal)', marginBottom: '8px' } },
            h('div', {},
              h('strong', {}, `${b.title} — ${fmtUSD(b.amount)}`),
              h('div', { class: 'rotulo-suave' }, `Automático todo dia ${b.day}`)),
            h('button', {
              type: 'button',
              class: 'btn btn-perigo',
              onclick: () => {
                DATA.recurringBills = DATA.recurringBills.filter((item) => item.id !== b.id);
                saveData();
                router();
              },
            }, 'Apagar'))),
        events.map((ev) =>
          h('div', { class: 'item-linha', style: { marginBottom: '8px' } },
            h('strong', {}, ev.title),
            h('button', {
              type: 'button',
              class: 'btn btn-perigo',
              onclick: () => {
                DATA.calendarEvents = DATA.calendarEvents.filter((item) => item.id !== ev.id);
                saveData();
                router();
              },
            }, 'Apagar'))),
        steps.map(({ step, project }) =>
          h('div', {
            class: `step-row ${step.status}`,
            style: { cursor: 'pointer', marginBottom: '8px' },
            onclick: () => {
              const order = ['pausado', 'andamento', 'concluido'];
              step.status = order[(order.indexOf(step.status) + 1) % order.length];
              saveData();
              if (step.status === 'concluido') toast('+25 XP! ✨');
              router();
            },
          },
            h('div', {},
              h('div', { class: 'step-texto' }, step.what),
              h('span', { class: 'rotulo-suave' }, `Projeto: ${project.title}`)),
            h('span', { class: `step-badge ${step.status}` }, step.status === 'concluido' ? '✓ +25 XP' : '▶ Ativo'))),
        (events.length + bills.length + steps.length === 0) &&
          h('div', { class: 'vazio' }, 'Dia livre. Nenhum item agendado.')),
      addForm));
}

// ---------------------------------------------------------------------
// TELA 5 — FINANCEIRO (MINIMALISTA + SIDE QUESTS)
// ---------------------------------------------------------------------
function viewFinanceiro() {
  drawTopNav('financeiro');
  fab.hidden = true;

  const subTabs = [
    { id: 'mes',       label: 'Este Mês' },
    { id: 'goals',     label: 'Goals' },
    { id: 'cortes',    label: 'Cortes' },
    { id: 'historico', label: 'Histórico' },
  ];

  const subNav = h('div', { class: 'sub-abas' },
    subTabs.map((t) =>
      h('button', {
        type: 'button',
        class: 'sub-aba',
        'aria-current': finSubTab === t.id ? 'true' : 'false',
        onclick: () => { finSubTab = t.id; router(); },
      }, t.label)));

  let panel;
  if (finSubTab === 'mes') panel = renderFinanceiroMes();
  else if (finSubTab === 'goals') panel = renderFinanceiroGoals();
  else if (finSubTab === 'cortes') panel = renderFinanceiroCortes();
  else panel = renderFinanceiroHistorico();

  render(h('div', { class: 'dash-wrap' }, subNav, panel));
}

function renderFinanceiroMes() {
  const cm = DATA.financeiro.currentMonth;
  const saldo = cm.income - (cm.fixed + cm.variable);
  const isPos = saldo >= 0;
  const maxCat = Math.max(...cm.breakdown.map((b) => b.amount), 1);

  return [
    h('div', { class: `fin-alerta ${isPos ? 'pos' : 'neg'}` },
      h('span', {}, isPos ? '✓' : '⚠️'),
      h('span', {}, isPos
        ? `Você economizou ${fmtUSD(saldo)} em ${cm.label}`
        : `Você gastou ${fmtUSD(Math.abs(saldo))} a mais do que ganhou em ${cm.label}`)),

    h('div', { class: 'fin-botoes' },
      h('button', { type: 'button', class: 'btn btn-forte', onclick: openQuickFinanceModal }, '+ Entrada rápida'),
      h('button', { type: 'button', class: 'btn', onclick: openPasteAnalysisModal }, '+ Colar análise')),

    cm.analysisText && h('section', { class: 'bunkr-box' },
      h('div', { class: 'box-topo' },
        h('span', { class: 'rotulo' }, `ANÁLISE — ${cm.label}`),
        h('button', { type: 'button', class: 'btn btn-leve', onclick: () => { cm.analysisText = ''; saveData(); router(); } }, 'Limpar')),
      h('div', { class: 'analise-box' }, cm.analysisText)),

    h('section', { class: 'bunkr-hero' },
      h('div', { class: 'box-topo' },
        h('h2', { class: 'cat-titulo' }, cm.label),
        h('span', { class: `pill-status ${isPos ? 'pos' : 'neg'}` }, fmtSignedUSD(saldo))),
      h('div', { class: 'fin-linha' },
        h('span', { class: 'rotulo-suave' }, 'Receita'),
        h('span', { class: 'fin-valor pos' }, fmtUSD(cm.income))),
      h('div', { class: 'fin-linha' },
        h('span', { class: 'rotulo-suave' }, 'Fixos'),
        h('span', { class: 'fin-valor neg' }, fmtUSD(cm.fixed))),
      h('div', { class: 'fin-linha' },
        h('span', { class: 'rotulo-suave' }, 'Variáveis'),
        h('span', { class: 'fin-valor neg' }, fmtUSD(cm.variable))),
      h('div', { class: 'fin-linha saldo' },
        h('span', { class: 'rotulo' }, 'Saldo'),
        h('span', { class: `fin-valor ${isPos ? 'pos' : 'neg'}` }, fmtSignedUSD(saldo)))),

    h('button', {
      type: 'button',
      class: 'btn',
      style: { width: '100%' },
      onclick: () => { showBreakdown = !showBreakdown; router(); },
    }, showBreakdown ? 'Ocultar onde foi o dinheiro ▴' : 'Ver onde foi o dinheiro ▾'),

    showBreakdown && h('section', { class: 'bunkr-box' },
      cm.breakdown.map((b) => {
        const pct = Math.round((b.amount / maxCat) * 100);
        return h('div', { class: 'breakdown-row' },
          h('span', { class: 'rotulo' }, b.name),
          bar(pct),
          h('span', { class: 'pct-rust' }, fmtUSD(b.amount)));
      })),
  ];
}

function renderFinanceiroGoals() {
  const g = DATA.financeiro.goals;
  const actingPct  = Math.min(100, Math.round((g.actingCurrent / g.actingTarget) * 100));
  const reservaPct = Math.min(100, Math.round((g.reservaCurrent / g.reservaTarget) * 100));
  const investUnlocked = g.reservaCurrent >= g.reservaTarget;

  return [
    h('section', { class: 'bunkr-box' },
      h('div', { class: 'box-topo' },
        h('h2', { class: 'cat-titulo' }, 'Goals'),
        h('span', { class: 'pill-status' }, '3 METAS')),
      h('div', { class: 'compact-grid-2' },
        h('div', { class: 'goal-card' },
          h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } },
            h('strong', { style: { fontFamily: 'var(--f-titulo)', fontSize: '19px' } }, 'Acting Classes'),
            h('span', { class: `pill-status ${actingPct >= 100 ? 'pos' : ''}` }, `${actingPct}%`)),
          bar(actingPct),
          h('div', { class: 'rotulo-suave', style: { marginTop: '8px', fontSize: '10px' } }, `${fmtUSD(g.actingCurrent)} / ${fmtUSD(g.actingTarget)}`),
          h('div', { class: 'goal-edit-row' },
            h('input', {
              type: 'number',
              step: 'any',
              value: g.actingCurrent,
              onchange: (e) => { g.actingCurrent = Math.max(0, Number(e.target.value) || 0); saveData(); toast('Salvo'); router(); },
            }),
            h('a', { class: 'btn', style: { width: '100%', minHeight: '28px', fontSize: '9.5px' }, href: '#/p/projetos/acting-classes' }, 'Projeto →'))),

        h('div', { class: 'goal-card' },
          h('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } },
            h('strong', { style: { fontFamily: 'var(--f-titulo)', fontSize: '19px' } }, 'Reserva'),
            h('span', { class: `pill-status ${reservaPct >= 100 ? 'pos' : ''}` }, `${reservaPct}%`)),
          bar(reservaPct),
          h('div', { class: 'rotulo-suave', style: { marginTop: '8px', fontSize: '10px' } }, `${fmtUSD(g.reservaCurrent)} / ${fmtUSD(g.reservaTarget)}`),
          h('div', { class: 'goal-edit-row' },
            h('input', {
              type: 'number',
              step: 'any',
              value: g.reservaCurrent,
              onchange: (e) => { g.reservaCurrent = Math.max(0, Number(e.target.value) || 0); saveData(); toast('Salvo'); router(); },
            }))),

        h('div', { class: `goal-card ${investUnlocked ? '' : 'bloqueado'}`, style: { gridColumn: 'span 2' } },
          h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
            h('strong', { style: { fontFamily: 'var(--f-titulo)', fontSize: '20px' } }, `${investUnlocked ? '📈' : '🔒'} Investimento`),
            h('span', { class: 'pill-status' }, investUnlocked ? 'DESBLOQUEADO' : 'BLOQUEADO')),
          bar(0),
          h('p', { class: 'rotulo-suave', style: { marginTop: '8px', marginBottom: '0', fontSize: '10px' } },
            investUnlocked ? 'Reserva atingiu $3.000!' : 'Disponível quando a Reserva atingir $3.000')))),
  ];
}

function renderFinanceiroCortes() {
  const cuts = DATA.financeiro.cuts;
  const committed = cuts.filter((c) => c.status === 'accepted');
  const pending   = cuts.filter((c) => c.status === 'pending');

  return [
    h('section', { class: 'bunkr-box' },
      h('div', { class: 'box-topo' },
        h('h2', { class: 'cat-titulo', style: { fontSize: '23px' } }, 'Comprometidos'),
        h('span', { class: 'pill-status pos' }, `${committed.length}`)),
      committed.length
        ? h('div', { class: 'lista-simples' },
            committed.map((c) =>
              h('div', { class: 'corte-card comprometido' },
                h('div', { class: 'box-topo', style: { marginBottom: '4px' } },
                  h('strong', { style: { fontFamily: 'var(--f-titulo)', fontSize: '20px' } }, `${c.icon} ${c.title}`),
                  h('span', { class: 'pill-status pos' }, c.saving)),
                h('div', { class: 'corte-destino' }, c.destination),
                h('div', { class: 'corte-rodape' }, '✓ Comprometido — verificado no próximo extrato'))))
        : h('p', { class: 'rotulo-suave', style: { margin: 0 } }, 'Nenhum corte comprometido ainda')),

    h('section', { class: 'bunkr-box' },
      h('div', { class: 'box-topo' },
        h('h2', { class: 'cat-titulo', style: { fontSize: '23px' } }, 'Sugestões'),
        h('span', { class: 'rotulo-suave' }, 'mais fácil primeiro')),
      pending.length
        ? h('div', { class: 'lista-simples' },
            pending.map((c) =>
              h('div', { class: 'corte-card' },
                h('div', { class: 'box-topo', style: { marginBottom: '6px' } },
                  h('strong', { style: { fontFamily: 'var(--f-titulo)', fontSize: '20px' } }, `${c.icon} ${c.title}`),
                  h('span', { class: 'pill-status' }, `${c.saving} · +50 XP`)),
                h('p', { class: 'proj-resumo', style: { marginBottom: '6px' } }, c.text),
                h('div', { class: 'corte-destino' }, c.destination),
                h('div', { class: 'grupo-acoes-esq' },
                  h('button', {
                    type: 'button',
                    class: 'btn btn-verde',
                    onclick: () => { c.status = 'accepted'; saveData(); toast('+50 XP! Corte comprometido ✨'); router(); },
                  }, '✓ Aceitar'),
                  h('button', {
                    type: 'button',
                    class: 'btn btn-leve',
                    onclick: () => { c.status = 'ignored'; saveData(); toast('Ignorado por agora'); router(); },
                  }, 'Ignorar por agora')))))
        : h('div', { class: 'vazio' }, 'Nenhuma sugestão pendente.'),
      h('p', { class: 'rotulo-suave', style: { textAlign: 'center', marginTop: '14px', marginBottom: 0, fontSize: '10px' } },
        'Sugestões ignoradas voltam no próximo lançamento mensal.')),
  ];
}

function renderFinanceiroHistorico() {
  const list = DATA.financeiro.history;
  return [
    h('section', { class: 'bunkr-box' },
      h('div', { class: 'box-topo' },
        h('h2', { class: 'cat-titulo' }, 'Histórico'),
        h('span', { class: 'pill-status' }, `${list.length} PERÍODOS`)),
      h('div', { class: 'compact-grid-2' },
        list.map((item) => {
          const isPos = item.balance >= 0;
          return h('div', { class: 'hist-card' },
            h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
              h('strong', { style: { fontFamily: 'var(--f-titulo)', fontSize: '19px' } }, item.period),
              h('span', { class: `pill-status ${isPos ? 'pos' : 'neg'}`, style: { fontSize: '8.5px', padding: '2px 7px' } }, isPos ? '✓' : '✗')),
            h('div', { class: 'hist-dados' },
              `Rec: ${fmtUSD(item.income)} · Gas: ${fmtUSD(item.expenses)}\nSaldo: ${fmtSignedUSD(item.balance)}`));
        }))),
  ];
}

// ---------------------------------------------------------------------
// GERENCIAR CATEGORIAS (ACESSÍVEL PELO LINK DISCRETO NO DASHBOARD)
// ---------------------------------------------------------------------
function viewCategories() {
  drawTopNav('dashboard');
  fab.hidden = false;
  fab.onclick = () => openNewCategorySheet();

  render(
    h('div', { class: 'dash-wrap' },
      h('a', { class: 'btn', style: { alignSelf: 'flex-start' }, href: '#/dashboard' }, '← Dashboard'),
      h('section', { class: 'bunkr-box' },
        h('div', { class: 'box-topo' },
          h('h2', { class: 'cat-titulo' }, 'Categorias'),
          h('button', { type: 'button', class: 'btn btn-forte', onclick: () => openNewCategorySheet() }, '+ Nova')),
        h('div', { class: 'compact-grid-2' },
          DATA.categories.map((cat) =>
            h('div', { class: 'item-linha', style: cat.archived ? { opacity: '0.65' } : {} },
              h('div', {},
                h('strong', { style: { fontFamily: 'var(--f-titulo)', fontSize: '20px' } }, cat.name, cat.archived ? ' (arq.)' : ''),
                h('div', { class: 'rotulo-suave', style: { marginTop: '2px', fontSize: '10px' } },
                  `${(cat.projects || []).length} ${(cat.projects || []).length === 1 ? 'objetivo' : 'objetivos'}`)),
              h('div', { class: 'grupo-acoes-esq' },
                h('button', {
                  type: 'button',
                  class: 'btn',
                  style: { minHeight: '28px', padding: '0 10px', fontSize: '9.5px' },
                  onclick: () => { cat.archived = !cat.archived; saveData(); router(); },
                }, cat.archived ? 'Reativar' : 'Arquivar'),
                h('button', {
                  type: 'button',
                  class: 'btn btn-perigo',
                  style: { fontSize: '10px' },
                  onclick: () => {
                    if (confirm(`Deletar "${cat.name}" e seus objetivos?`)) {
                      DATA.categories = DATA.categories.filter((c) => c.id !== cat.id);
                      DATA.gallery = DATA.gallery.filter((g) => g.categoryId !== cat.id);
                      saveData();
                      router();
                    }
                  },
                }, 'Deletar'))))))));
}

// ---------------------------------------------------------------------
// MODAIS (CRIAR, EDITAR PROJETO, STEP, CATEGORIA, FINANCEIRO)
// ---------------------------------------------------------------------
function openCreateSheet(defaultCategoryId = 'projetos') {
  const visibleCats = activeCategories();
  if (!visibleCats.length) { location.hash = '#/categorias'; return; }

  let uploadedImageData = null;
  const preview = h('img', { class: 'preview-upload', alt: 'Prévia' });
  const fileInput = h('input', {
    type: 'file',
    accept: 'image/*',
    onchange: async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      uploadedImageData = await compressImage(file);
      preview.src = uploadedImageData;
      preview.style.display = 'block';
    },
  });

  const form = h('form', {
    onsubmit: (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const title = fd.get('title').trim();
      if (!title) return;

      const categoryId = fd.get('categoryId');
      const summary = fd.get('summary').trim();
      const dueDate = fd.get('dueDate') || '';
      const rawSteps = fd.get('steps').split('\n').map((s) => s.trim()).filter(Boolean);

      const steps = rawSteps.length
        ? rawSteps.map((what, idx) => ({ what, status: idx === 0 ? 'andamento' : 'pausado', dueDate: idx === 0 ? dueDate : '' }))
        : [{ what: `Iniciar: ${title}`, status: 'andamento', dueDate }];

      const cat = DATA.categories.find((c) => c.id === categoryId) || visibleCats[0];
      const projectId = `proj-${Date.now()}`;

      cat.projects.push({ id: projectId, title, summary, archived: false, steps });

      if (uploadedImageData) {
        const hasPlaceholders = DATA.gallery.some((g) => String(g.image).startsWith('data:image/svg+xml'));
        if (hasPlaceholders) DATA.gallery = [];
        DATA.gallery.push({
          id: Date.now(),
          projectId,
          tag: title.toUpperCase(),
          image: uploadedImageData,
          categoryId: cat.id,
        });
      }

      saveData();
      backdrop.remove();
      toast('Objetivo criado');
      location.hash = `#/p/${cat.id}/${projectId}`;
      router();
    },
  },
    h('h2', {}, 'Novo objetivo'),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Título'),
      h('input', { type: 'text', name: 'title', required: true, placeholder: 'Ex: Aulas de Teatro' })),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Categoria'),
      h('select', { name: 'categoryId' },
        visibleCats.map((c) => h('option', { value: c.id, selected: c.id === defaultCategoryId }, c.name)))),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Resumo'),
      h('input', { type: 'text', name: 'summary', placeholder: 'Por que esse objetivo existe' })),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Steps (um por linha)'),
      h('textarea', { name: 'steps', placeholder: 'Passo 1\nPasso 2\nPasso 3' })),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Prazo do primeiro passo (opcional)'),
      h('input', { type: 'date', name: 'dueDate' })),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Foto para o Vision Board (Gallery)'),
      fileInput,
      preview),
    h('div', { class: 'linha-botoes' },
      h('button', { type: 'button', class: 'btn btn-leve', onclick: () => backdrop.remove() }, 'Cancelar'),
      h('button', { type: 'submit', class: 'btn btn-forte' }, 'Salvar')));

  const backdrop = h('div', { class: 'folha-fundo', onclick: (e) => { if (e.target === backdrop) backdrop.remove(); } }, h('div', { class: 'folha' }, form));
  document.body.append(backdrop);
}

function openEditProjectSheet(currentCat, project) {
  let newUploadedImage = null;
  const existingPhoto = DATA.gallery.find((g) => g.projectId === project.id);

  const preview = h('img', {
    class: 'preview-upload',
    src: existingPhoto ? existingPhoto.image : '',
    style: existingPhoto ? { display: 'block' } : {},
  });

  const fileInput = h('input', {
    type: 'file',
    accept: 'image/*',
    onchange: async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      newUploadedImage = await compressImage(file);
      preview.src = newUploadedImage;
      preview.style.display = 'block';
    },
  });

  const editableSteps = project.steps.map((s) => ({ ...s }));
  const stepsContainer = h('div', {});

  const renderEditableSteps = () => {
    stepsContainer.replaceChildren(
      ...editableSteps.map((st, idx) =>
        h('div', { class: 'edit-step-item' },
          h('input', { type: 'text', value: st.what, oninput: (e) => { st.what = e.target.value; } }),
          h('input', { type: 'date', value: st.dueDate || '', style: { maxWidth: '135px' }, onchange: (e) => { st.dueDate = e.target.value; } }),
          h('button', { type: 'button', class: 'btn btn-perigo', onclick: () => { editableSteps.splice(idx, 1); renderEditableSteps(); } }, '✕')))
    );
  };
  renderEditableSteps();

  const form = h('form', {
    onsubmit: (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const newTitle = fd.get('title').trim();
      if (!newTitle) return;

      const targetCatId = fd.get('categoryId');
      project.title = newTitle;
      project.summary = fd.get('summary').trim();
      project.steps = editableSteps.filter((s) => s.what.trim());

      if (targetCatId !== currentCat.id) {
        currentCat.projects = currentCat.projects.filter((p) => p.id !== project.id);
        const destCat = DATA.categories.find((c) => c.id === targetCatId);
        if (destCat) destCat.projects.push(project);
      }

      if (existingPhoto) {
        existingPhoto.tag = newTitle.toUpperCase();
        existingPhoto.categoryId = targetCatId;
        if (newUploadedImage) existingPhoto.image = newUploadedImage;
      } else if (newUploadedImage) {
        const hasPlaceholders = DATA.gallery.some((g) => String(g.image).startsWith('data:image/svg+xml'));
        if (hasPlaceholders) DATA.gallery = [];
        DATA.gallery.push({
          id: Date.now(),
          projectId: project.id,
          tag: newTitle.toUpperCase(),
          image: newUploadedImage,
          categoryId: targetCatId,
        });
      }

      saveData();
      backdrop.remove();
      toast('Objetivo atualizado');
      location.hash = `#/p/${targetCatId}/${project.id}`;
      router();
    },
  },
    h('h2', {}, 'Editar objetivo'),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Título'),
      h('input', { type: 'text', name: 'title', value: project.title, required: true })),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Categoria'),
      h('select', { name: 'categoryId' },
        activeCategories().map((c) => h('option', { value: c.id, selected: c.id === currentCat.id }, c.name)))),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Resumo'),
      h('input', { type: 'text', name: 'summary', value: project.summary || '' })),
    h('div', { class: 'campo' },
      h('div', { class: 'box-topo', style: { marginBottom: '8px' } },
        h('span', { class: 'rotulo' }, 'Steps & Prazos'),
        h('button', { type: 'button', class: 'btn', onclick: () => { editableSteps.push({ what: '', status: 'pausado', dueDate: '' }); renderEditableSteps(); } }, '+ Linha')),
      stepsContainer),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Foto no Vision Board (Gallery)'),
      fileInput,
      preview),
    h('div', { class: 'linha-botoes' },
      h('button', { type: 'button', class: 'btn btn-leve', onclick: () => backdrop.remove() }, 'Cancelar'),
      h('button', { type: 'submit', class: 'btn btn-forte' }, 'Salvar')));

  const backdrop = h('div', { class: 'folha-fundo', onclick: (e) => { if (e.target === backdrop) backdrop.remove(); } }, h('div', { class: 'folha' }, form));
  document.body.append(backdrop);
}

function openNewCategorySheet() {
  const form = h('form', {
    onsubmit: (e) => {
      e.preventDefault();
      const name = new FormData(form).get('name').trim();
      if (!name) return;
      const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `cat-${Date.now()}`;
      const id = DATA.categories.some((c) => c.id === slug) ? `${slug}-${Date.now()}` : slug;
      DATA.categories.push({ id, name, archived: false, projects: [] });
      saveData();
      backdrop.remove();
      toast('Categoria criada');
      router();
    },
  },
    h('h2', {}, 'Nova categoria'),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Nome'),
      h('input', { type: 'text', name: 'name', required: true, placeholder: 'Ex: Relacionamentos' })),
    h('div', { class: 'linha-botoes' },
      h('button', { type: 'button', class: 'btn btn-leve', onclick: () => backdrop.remove() }, 'Cancelar'),
      h('button', { type: 'submit', class: 'btn btn-forte' }, 'Criar')));

  const backdrop = h('div', { class: 'folha-fundo', onclick: (e) => { if (e.target === backdrop) backdrop.remove(); } }, h('div', { class: 'folha' }, form));
  document.body.append(backdrop);
}

function openAddStepSheet(project) {
  const form = h('form', {
    onsubmit: (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const what = fd.get('what').trim();
      if (!what) return;
      project.steps.push({ what, status: 'andamento', dueDate: fd.get('dueDate') || '' });
      saveData();
      backdrop.remove();
      toast('Step adicionado');
      router();
    },
  },
    h('h2', {}, `Novo step — ${project.title}`),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'O que fazer'),
      h('input', { type: 'text', name: 'what', required: true })),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Prazo (opcional)'),
      h('input', { type: 'date', name: 'dueDate' })),
    h('div', { class: 'linha-botoes' },
      h('button', { type: 'button', class: 'btn btn-leve', onclick: () => backdrop.remove() }, 'Cancelar'),
      h('button', { type: 'submit', class: 'btn btn-forte' }, 'Adicionar')));

  const backdrop = h('div', { class: 'folha-fundo', onclick: (e) => { if (e.target === backdrop) backdrop.remove(); } }, h('div', { class: 'folha' }, form));
  document.body.append(backdrop);
}

function openQuickFinanceModal() {
  const cm = DATA.financeiro.currentMonth;
  const form = h('form', {
    onsubmit: (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      cm.income   = Number(fd.get('income')) || 0;
      cm.fixed    = Number(fd.get('fixed')) || 0;
      cm.variable = Number(fd.get('variable')) || 0;
      if (fd.get('label')?.trim()) cm.label = fd.get('label').trim();
      DATA.financeiro.cuts.forEach((c) => { if (c.status === 'ignored') c.status = 'pending'; });
      saveData();
      backdrop.remove();
      toast('Mês atualizado');
      router();
    },
  },
    h('h2', {}, 'Entrada rápida'),
    h('label', { class: 'campo' }, h('span', { class: 'rotulo' }, 'Mês'), h('input', { type: 'text', name: 'label', value: cm.label, required: true })),
    h('label', { class: 'campo' }, h('span', { class: 'rotulo' }, 'Receita ($)'), h('input', { type: 'number', name: 'income', step: 'any', value: cm.income, required: true })),
    h('label', { class: 'campo' }, h('span', { class: 'rotulo' }, 'Fixos ($)'), h('input', { type: 'number', name: 'fixed', step: 'any', value: cm.fixed, required: true })),
    h('label', { class: 'campo' }, h('span', { class: 'rotulo' }, 'Variáveis ($)'), h('input', { type: 'number', name: 'variable', step: 'any', value: cm.variable, required: true })),
    h('div', { class: 'linha-botoes' },
      h('button', { type: 'button', class: 'btn btn-leve', onclick: () => backdrop.remove() }, 'Cancelar'),
      h('button', { type: 'submit', class: 'btn btn-forte' }, 'Salvar')));

  const backdrop = h('div', { class: 'folha-fundo', onclick: (e) => { if (e.target === backdrop) backdrop.remove(); } }, h('div', { class: 'folha' }, form));
  document.body.append(backdrop);
}

function openPasteAnalysisModal() {
  const cm = DATA.financeiro.currentMonth;
  const form = h('form', {
    onsubmit: (e) => {
      e.preventDefault();
      cm.analysisText = new FormData(form).get('analysisText').trim();
      saveData();
      backdrop.remove();
      toast('Análise salva');
      router();
    },
  },
    h('h2', {}, 'Colar análise mensal'),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Texto da análise'),
      h('textarea', { name: 'analysisText', style: { minHeight: '160px' } }, cm.analysisText || '')),
    h('div', { class: 'linha-botoes' },
      h('button', { type: 'button', class: 'btn btn-leve', onclick: () => backdrop.remove() }, 'Cancelar'),
      h('button', { type: 'submit', class: 'btn btn-forte' }, 'Salvar')));

  const backdrop = h('div', { class: 'folha-fundo', onclick: (e) => { if (e.target === backdrop) backdrop.remove(); } }, h('div', { class: 'folha' }, form));
  document.body.append(backdrop);
}

// ---------------------------------------------------------------------
// ROTEADOR
// ---------------------------------------------------------------------
const routes = [
  [/^#\/?$/,                         () => viewGallery()],
  [/^#\/gallery$/,                   () => viewGallery()],
  [/^#\/dashboard$/,                 () => viewDashboard()],
  [/^#\/c\/([\w-]+)$/,               (catId) => viewCategory(catId, null)],
  [/^#\/p\/([\w-]+)\/([\w-]+)$/,     (catId, projId) => viewCategory(catId, projId)],
  [/^#\/calendar$/,                  () => viewCalendar()],
  [/^#\/day\/(\d{4}-\d{2}-\d{2})$/,  (date) => viewCalendarDay(date)],
  [/^#\/financeiro$/,                () => viewFinanceiro()],
  [/^#\/categorias$/,                () => viewCategories()],
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
