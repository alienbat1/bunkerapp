// =====================================================================
// app.js — Dados + Gallery, Dashboard, Projetos, Calendar, Tasks, Financeiro
// =====================================================================

const STORAGE_KEY = 'bunkr-data-v3';

const placeholderImg = (label, bg = '#DDD5C7', fg = '#5C514B') =>
  'data:image/svg+xml;utf8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
      <rect width="600" height="800" fill="${bg}"/>
      <rect x="24" y="24" width="552" height="752" rx="18" fill="none" stroke="${fg}" stroke-opacity="0.25" stroke-width="2" stroke-dasharray="8 8"/>
      <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="monospace" font-size="22" fill="${fg}" opacity="0.7">${label}</text>
    </svg>`
  );

const DEFAULT_DATA = {
  year: 2026,
  daysLeft: 42,

  gallery: [
    { id: 1, tag: 'LEGENDA 1', size: 'normal', image: placeholderImg('FOTO 1', '#6E3538', '#FAF8F5'), categoryId: 'projetos' },
    { id: 2, tag: 'LEGENDA 2', size: 'tall',   image: placeholderImg('FOTO 2', '#C9B9A3', '#1A1514'), categoryId: 'estudo' },
    { id: 3, tag: 'LEGENDA 3', size: 'normal', image: placeholderImg('FOTO 3', '#D6CFC7', '#1A1514'), categoryId: 'hobbies' },
    { id: 4, tag: 'LEGENDA 4', size: 'normal', image: placeholderImg('FOTO 4', '#C7BDB3', '#1A1514'), categoryId: 'carreira' },
    { id: 5, tag: 'LEGENDA 5', size: 'normal', image: placeholderImg('FOTO 5', '#B8B0A6', '#1A1514'), categoryId: 'estudo' },
    { id: 6, tag: 'LEGENDA 6', size: 'wide',   image: placeholderImg('FOTO 6', '#E3DDD5', '#1A1514'), categoryId: 'hobbies' },
    { id: 7, tag: 'LEGENDA 7', size: 'normal', image: placeholderImg('FOTO 7', '#CFC8BE', '#1A1514'), categoryId: 'carreira' },
    { id: 8, tag: 'LEGENDA 8', size: 'tall',   image: placeholderImg('FOTO 8', '#4A4642', '#FAF8F5'), categoryId: 'habitos' },
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
      ],
    },
    { id: 'habitos',  name: 'Hábitos',  archived: false, projects: [] },
    { id: 'carreira', name: 'Carreira', archived: false, projects: [] },
    { id: 'estudo',   name: 'Estudo',   archived: false, projects: [] },
    { id: 'hobbies',  name: 'Hobbies',  archived: false, projects: [] },
  ],

  // -------------------------------------------------------------------
  // DADOS DA ABA FINANCEIRO (editáveis manualmente aqui ou pela interface)
  // -------------------------------------------------------------------
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
        status: 'pending', // 'pending' | 'accepted' | 'ignored'
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
let finSubTab = 'mes'; // 'mes' | 'goals' | 'cortes' | 'historico'

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA));
  } catch {
    toast('Erro ao salvar no navegador');
  }
}

// ---------------------------------------------------------------------
// HELPERS DE DOM E FORMATAÇÃO
// ---------------------------------------------------------------------
const tela = document.getElementById('tela');
const abas = document.getElementById('abas');
const fab  = document.getElementById('fab');

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

function toast(msg) {
  const el = h('div', { class: 'aviso' }, msg);
  document.body.append(el);
  setTimeout(() => el.remove(), 2600);
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
  if (!count) return { count: 0, pct: 0, statusLabel: 'NÃO INICIADO' };
  const sumPct = list.reduce((acc, p) => acc + projectStats(p).pct, 0);
  const pct = Math.round(sumPct / count);
  const statusLabel = pct >= 100 ? 'CONCLUÍDO' : pct > 0 ? 'INICIADO' : 'NÃO INICIADO';
  return { count, pct, statusLabel };
}

function compressImage(file, maxWidth = 900) {
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
        resolve(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

// ---------------------------------------------------------------------
// NAVEGAÇÃO PRINCIPAL
// ---------------------------------------------------------------------
const NAV_TABS = [
  { id: 'gallery',    label: 'GALLERY',    href: '#/gallery' },
  { id: 'dashboard',  label: 'DASHBOARD',  href: '#/dashboard' },
  { id: 'calendar',   label: 'CALENDAR',   href: '#/calendar' },
  { id: 'tasks',      label: 'TASKS',      href: '#/tasks' },
  { id: 'financeiro', label: 'FINANCEIRO', href: '#/financeiro' },
  { id: 'categorias', label: 'CATEGORIAS', href: '#/categorias' },
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
// BLOCOS REUTILIZÁVEIS
// ---------------------------------------------------------------------
function renderYearOverviewBox() {
  const visibleCats = activeCategories();
  const habCat = visibleCats.find((c) => c.id === 'habitos');
  const otherCats = visibleCats.filter((c) => c.id !== 'habitos');

  const projPct = otherCats.length
    ? Math.round(otherCats.reduce((a, c) => a + categoryStats(c).pct, 0) / otherCats.length)
    : 0;
  const habPct = habCat ? categoryStats(habCat).pct : 0;

  return h('section', { class: 'bunkr-box' },
    h('div', { class: 'box-topo' },
      h('span', { class: 'rotulo' }, `VISÃO DE ${DATA.year}`),
      h('span', { class: 'rotulo' }, `${DATA.daysLeft} DIAS RESTANTES`)),
    h('div', { class: 'visao-linha' },
      h('span', { class: 'rotulo' }, 'PROJETOS'),
      bar(projPct),
      h('span', { class: 'pct-rust' }, `${projPct}%`)),
    h('div', { class: 'visao-linha' },
      h('span', { class: 'rotulo' }, 'HÁBITOS'),
      bar(habPct),
      h('span', { class: 'pct-rust' }, `${habPct}%`)));
}

function renderCategorySummaryCard(cat) {
  const { count, pct, statusLabel } = categoryStats(cat);
  return h('article', {
    class: 'bunkr-box',
    style: { cursor: 'pointer' },
    onclick: () => { location.hash = `#/c/${cat.id}`; },
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
// FORMULÁRIOS DE CRIAÇÃO (BOTÃO +)
// ---------------------------------------------------------------------
function openCreateSheet(defaultCategoryId = 'projetos') {
  const visibleCats = activeCategories();
  if (!visibleCats.length) {
    toast('Crie ou reative uma categoria primeiro');
    location.hash = '#/categorias';
    return;
  }

  let uploadedImageData = null;
  const preview = h('img', { class: 'preview-upload', alt: 'Prévia da foto' });
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
      const gallerySize = fd.get('gallerySize') || 'normal';

      const steps = rawSteps.length
        ? rawSteps.map((what, idx) => ({
            what,
            status: idx === 0 ? 'andamento' : 'pausado',
            dueDate: idx === 0 ? dueDate : '',
          }))
        : [{ what: `Iniciar: ${title}`, status: 'andamento', dueDate }];

      const cat = DATA.categories.find((c) => c.id === categoryId) || visibleCats[0];
      const projectId = `proj-${Date.now()}`;

      cat.projects.push({
        id: projectId,
        title,
        summary,
        archived: false,
        steps,
      });

      if (uploadedImageData) {
        const hasPlaceholders = DATA.gallery.some((g) => String(g.image).startsWith('data:image/svg+xml'));
        if (hasPlaceholders) DATA.gallery = [];
        DATA.gallery.unshift({
          id: Date.now(),
          projectId,
          tag: title.toUpperCase(),
          size: gallerySize,
          image: uploadedImageData,
          categoryId: cat.id,
        });
      }

      saveData();
      backdrop.remove();
      toast('Objetivo criado');
      location.hash = `#/c/${cat.id}`;
      router();
    },
  },
    h('h2', {}, 'Novo objetivo / projeto'),

    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Título (aparece no card e na foto)'),
      h('input', { type: 'text', name: 'title', required: true, placeholder: 'Ex: Aulas de Teatro' })),

    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Categoria'),
      h('select', { name: 'categoryId' },
        visibleCats.map((c) =>
          h('option', { value: c.id, selected: c.id === defaultCategoryId }, c.name)))),

    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Resumo (uma frase)'),
      h('input', { type: 'text', name: 'summary', placeholder: 'Por que esse projeto existe' })),

    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Steps (um passo por linha)'),
      h('textarea', { name: 'steps', placeholder: 'Pesquisar escolas\nComparar horários\nFazer matrícula' })),

    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Prazo do primeiro passo (opcional)'),
      h('input', { type: 'date', name: 'dueDate' })),

    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Foto para a Gallery (opcional)'),
      fileInput,
      preview),

    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Tamanho da foto na Gallery'),
      h('select', { name: 'gallerySize' },
        h('option', { value: 'normal' }, 'Padrão (1x1)'),
        h('option', { value: 'tall' }, 'Vertical (1x2)'),
        h('option', { value: 'wide' }, 'Destaque grande (2x2)'))),

    h('div', { class: 'linha-botoes' },
      h('button', { type: 'button', class: 'btn btn-leve', onclick: () => backdrop.remove() }, 'Cancelar'),
      h('button', { type: 'submit', class: 'btn btn-forte' }, 'Salvar')));

  const backdrop = h('div', {
    class: 'folha-fundo',
    onclick: (e) => { if (e.target === backdrop) backdrop.remove(); },
  }, h('div', { class: 'folha' }, form));

  document.body.append(backdrop);
}

function openNewCategorySheet() {
  const form = h('form', {
    onsubmit: (e) => {
      e.preventDefault();
      const name = new FormData(form).get('name').trim();
      if (!name) return;
      const slug = name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || `cat-${Date.now()}`;
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

  const backdrop = h('div', {
    class: 'folha-fundo',
    onclick: (e) => { if (e.target === backdrop) backdrop.remove(); },
  }, h('div', { class: 'folha' }, form));

  document.body.append(backdrop);
}

function openAddStepSheet(project) {
  const form = h('form', {
    onsubmit: (e) => {
      e.preventDefault();
      const fd = new FormData(form);
      const what = fd.get('what').trim();
      if (!what) return;
      project.steps.push({
        what,
        status: 'andamento',
        dueDate: fd.get('dueDate') || '',
      });
      saveData();
      backdrop.remove();
      toast('Step adicionado');
      router();
    },
  },
    h('h2', {}, `Novo step — ${project.title}`),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'O que fazer'),
      h('input', { type: 'text', name: 'what', required: true, placeholder: 'Ex: Ligar para a escola' })),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Prazo (opcional)'),
      h('input', { type: 'date', name: 'dueDate' })),
    h('div', { class: 'linha-botoes' },
      h('button', { type: 'button', class: 'btn btn-leve', onclick: () => backdrop.remove() }, 'Cancelar'),
      h('button', { type: 'submit', class: 'btn btn-forte' }, 'Adicionar')));

  const backdrop = h('div', {
    class: 'folha-fundo',
    onclick: (e) => { if (e.target === backdrop) backdrop.remove(); },
  }, h('div', { class: 'folha' }, form));

  document.body.append(backdrop);
}

// ---------------------------------------------------------------------
// MODAIS DA ABA FINANCEIRO (+ Entrada rápida & + Colar análise)
// ---------------------------------------------------------------------
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

      // Sugestões ignoradas voltam no próximo lançamento mensal
      DATA.financeiro.cuts.forEach((c) => {
        if (c.status === 'ignored') c.status = 'pending';
      });

      saveData();
      backdrop.remove();
      toast('Dados do mês atualizados');
      router();
    },
  },
    h('h2', {}, 'Entrada rápida do mês'),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Mês / Período'),
      h('input', { type: 'text', name: 'label', value: cm.label, required: true })),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Receita total do mês ($)'),
      h('input', { type: 'number', name: 'income', step: 'any', value: cm.income, required: true })),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Gastos fixos ($)'),
      h('input', { type: 'number', name: 'fixed', step: 'any', value: cm.fixed, required: true })),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Gastos variáveis ($)'),
      h('input', { type: 'number', name: 'variable', step: 'any', value: cm.variable, required: true })),
    h('div', { class: 'linha-botoes' },
      h('button', { type: 'button', class: 'btn btn-leve', onclick: () => backdrop.remove() }, 'Cancelar'),
      h('button', { type: 'submit', class: 'btn btn-forte' }, 'Salvar e recalcular')));

  const backdrop = h('div', {
    class: 'folha-fundo',
    onclick: (e) => { if (e.target === backdrop) backdrop.remove(); },
  }, h('div', { class: 'folha' }, form));

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
      h('span', { class: 'rotulo' }, 'Cole aqui o texto gerado pelo Claude'),
      h('textarea', {
        name: 'analysisText',
        style: { minHeight: '180px' },
        placeholder: 'Cole o resumo ou análise mensal aqui...',
      }, cm.analysisText || '')),
    h('div', { class: 'linha-botoes' },
      h('button', { type: 'button', class: 'btn btn-leve', onclick: () => backdrop.remove() }, 'Cancelar'),
      h('button', { type: 'submit', class: 'btn btn-forte' }, 'Salvar texto')));

  const backdrop = h('div', {
    class: 'folha-fundo',
    onclick: (e) => { if (e.target === backdrop) backdrop.remove(); },
  }, h('div', { class: 'folha' }, form));

  document.body.append(backdrop);
}

// ---------------------------------------------------------------------
// TELA FINANCEIRO (4 SUB-ABAS: Este Mês · Goals · Cortes · Histórico)
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

  render(
    h('div', { class: 'dash-wrap' },
      subNav,
      panel));
}

// ABA 1 — ESTE MÊS
function renderFinanceiroMes() {
  const cm = DATA.financeiro.currentMonth;
  const saldo = cm.income - (cm.fixed + cm.variable);
  const isPos = saldo >= 0;
  const maxCat = Math.max(...cm.breakdown.map((b) => b.amount), 1);

  return [
    // Alerta de status no topo
    h('div', { class: `fin-alerta ${isPos ? 'pos' : 'neg'}` },
      h('span', {}, isPos ? '✓' : '⚠️'),
      h('span', {}, isPos
        ? `Você economizou ${fmtUSD(saldo)} em ${cm.label}`
        : `Você gastou ${fmtUSD(Math.abs(saldo))} a mais do que ganhou em ${cm.label}`)),

    // Dois botões de entrada de dados
    h('div', { class: 'fin-botoes' },
      h('button', { type: 'button', class: 'btn btn-forte', onclick: openQuickFinanceModal }, '+ Entrada rápida'),
      h('button', { type: 'button', class: 'btn', onclick: openPasteAnalysisModal }, '+ Colar análise')),

    // Análise colada (se existir)
    cm.analysisText && h('section', { class: 'bunkr-box' },
      h('div', { class: 'box-topo' },
        h('span', { class: 'rotulo' }, `ANÁLISE — ${cm.label}`),
        h('button', {
          type: 'button',
          class: 'btn btn-leve',
          onclick: () => { cm.analysisText = ''; saveData(); router(); },
        }, 'Limpar')),
      h('div', { class: 'analise-box' }, cm.analysisText)),

    // Card do mês atual com 4 linhas
    h('section', { class: 'bunkr-box' },
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

    // Breakdown de gastos
    h('section', { class: 'bunkr-box' },
      h('div', { class: 'box-topo' },
        h('h2', { class: 'cat-titulo', style: { fontSize: '26px' } }, 'Breakdown de gastos'),
        h('span', { class: 'rotulo-suave' }, 'PROPORÇÃO')),
      cm.breakdown.map((b) => {
        const pct = Math.round((b.amount / maxCat) * 100);
        return h('div', { class: 'breakdown-row' },
          h('span', { class: 'rotulo' }, b.name),
          bar(pct),
          h('span', { class: 'pct-rust' }, fmtUSD(b.amount)));
      })),
  ];
}

// ABA 2 — GOALS
function renderFinanceiroGoals() {
  const g = DATA.financeiro.goals;
  const actingPct  = Math.min(100, Math.round((g.actingCurrent / g.actingTarget) * 100));
  const reservaPct = Math.min(100, Math.round((g.reservaCurrent / g.reservaTarget) * 100));
  const investUnlocked = g.reservaCurrent >= g.reservaTarget;

  return [
    h('section', { class: 'bunkr-box' },
      h('div', { class: 'box-topo' },
        h('h2', { class: 'cat-titulo' }, 'Goals financeiros'),
        h('span', { class: 'pill-status' }, '3 METAS')),

      h('div', { class: 'lista-simples' },
        // 1. Acting Classes
        h('div', { class: 'goal-card' },
          h('div', { class: 'box-topo', style: { marginBottom: '10px' } },
            h('h3', { class: 'proj-titulo' }, 'Acting Classes'),
            h('span', { class: `pill-status ${actingPct >= 100 ? 'pos' : ''}` }, `${actingPct}%`)),
          bar(actingPct),
          h('div', { class: 'box-topo', style: { marginTop: '10px', marginBottom: '0' } },
            h('span', { class: 'rotulo-suave' }, `${fmtUSD(g.actingCurrent)} / ${fmtUSD(g.actingTarget)}`),
            h('span', { class: 'rotulo-suave' }, `Meta: ${fmtUSD(g.actingTarget)}`)),
          h('div', { class: 'goal-edit-row' },
            h('span', { class: 'rotulo-suave' }, 'Valor atual ($):'),
            h('input', {
              type: 'number',
              step: 'any',
              value: g.actingCurrent,
              onchange: (e) => {
                g.actingCurrent = Math.max(0, Number(e.target.value) || 0);
                saveData();
                toast('Acting Classes atualizado');
                router();
              },
            }))),

        // 2. Reserva de Emergência
        h('div', { class: 'goal-card' },
          h('div', { class: 'box-topo', style: { marginBottom: '10px' } },
            h('h3', { class: 'proj-titulo' }, 'Reserva de Emergência'),
            h('span', { class: `pill-status ${reservaPct >= 100 ? 'pos' : ''}` }, `${reservaPct}%`)),
          bar(reservaPct),
          h('div', { class: 'box-topo', style: { marginTop: '10px', marginBottom: '0' } },
            h('span', { class: 'rotulo-suave' }, `${fmtUSD(g.reservaCurrent)} / ${fmtUSD(g.reservaTarget)} (saldo inicial da conta)`),
            h('span', { class: 'rotulo-suave' }, `Meta: ${fmtUSD(g.reservaTarget)}`)),
          h('div', { class: 'goal-edit-row' },
            h('span', { class: 'rotulo-suave' }, 'Valor atual ($):'),
            h('input', {
              type: 'number',
              step: 'any',
              value: g.reservaCurrent,
              onchange: (e) => {
                g.reservaCurrent = Math.max(0, Number(e.target.value) || 0);
                saveData();
                toast('Reserva atualizada');
                router();
              },
            }))),

        // 3. Investimento (bloqueado até Reserva atingir $3.000)
        h('div', { class: `goal-card ${investUnlocked ? '' : 'bloqueado'}` },
          h('div', { class: 'box-topo', style: { marginBottom: '10px' } },
            h('h3', { class: 'proj-titulo' }, `${investUnlocked ? '📈' : '🔒'} Investimento`),
            h('span', { class: 'pill-status' }, investUnlocked ? 'DESBLOQUEADO' : 'BLOQUEADO')),
          bar(0),
          h('p', { class: 'rotulo-suave', style: { marginTop: '10px', marginBottom: '0' } },
            investUnlocked
              ? 'Reserva atingiu $3.000! Você já pode começar a investir.'
              : 'Disponível quando a Reserva atingir $3.000')))),
  ];
}

// ABA 3 — CORTES
function renderFinanceiroCortes() {
  const cuts = DATA.financeiro.cuts;
  const committed = cuts.filter((c) => c.status === 'accepted');
  const pending   = cuts.filter((c) => c.status === 'pending');

  return [
    // Seção Comprometidos (topo)
    h('section', { class: 'bunkr-box' },
      h('div', { class: 'box-topo' },
        h('h2', { class: 'cat-titulo', style: { fontSize: '28px' } }, 'Comprometidos'),
        h('span', { class: 'pill-status pos' }, `${committed.length}`)),
      committed.length
        ? h('div', { class: 'lista-simples' },
            committed.map((c) =>
              h('div', { class: 'corte-card comprometido' },
                h('div', { class: 'box-topo', style: { marginBottom: '6px' } },
                  h('h3', { class: 'proj-titulo', style: { fontSize: '22px' } }, `${c.icon} ${c.title}`),
                  h('span', { class: 'pill-status pos' }, c.saving)),
                h('div', { class: 'corte-destino' }, c.destination),
                h('div', { class: 'corte-rodape' }, '✓ Comprometido — verificado no próximo extrato'))))
        : h('p', { class: 'rotulo-suave', style: { margin: 0 } }, 'Nenhum corte comprometido ainda')),

    // Seção Sugestões
    h('section', { class: 'bunkr-box' },
      h('div', { class: 'box-topo' },
        h('h2', { class: 'cat-titulo', style: { fontSize: '28px' } }, 'Sugestões'),
        h('span', { class: 'rotulo-suave' }, 'mais fácil primeiro')),
      pending.length
        ? h('div', { class: 'lista-simples' },
            pending.map((c) =>
              h('div', { class: 'corte-card' },
                h('div', { class: 'box-topo', style: { marginBottom: '8px' } },
                  h('h3', { class: 'proj-titulo', style: { fontSize: '22px' } }, `${c.icon} ${c.title}`),
                  h('span', { class: 'pill-status' }, c.saving)),
                h('p', { class: 'proj-resumo', style: { marginBottom: '8px' } }, c.text),
                h('div', { class: 'corte-destino' }, c.destination),
                h('div', { class: 'grupo-acoes-esq' },
                  h('button', {
                    type: 'button',
                    class: 'btn btn-verde',
                    onclick: () => {
                      c.status = 'accepted';
                      saveData();
                      toast('Corte comprometido!');
                      router();
                    },
                  }, '✓ Aceitar'),
                  h('button', {
                    type: 'button',
                    class: 'btn btn-leve',
                    onclick: () => {
                      c.status = 'ignored';
                      saveData();
                      toast('Ignorado por agora');
                      router();
                    },
                  }, 'Ignorar por agora')))))
        : h('div', { class: 'vazio' }, 'Nenhuma sugestão pendente no momento.'),
      h('p', { class: 'rotulo-suave', style: { textAlign: 'center', marginTop: '16px', marginBottom: 0 } },
        'Sugestões ignoradas voltam no próximo lançamento mensal.')),
  ];
}

// ABA 4 — HISTÓRICO
function renderFinanceiroHistorico() {
  const list = DATA.financeiro.history;
  return [
    h('section', { class: 'bunkr-box' },
      h('div', { class: 'box-topo' },
        h('h2', { class: 'cat-titulo' }, 'Histórico'),
        h('span', { class: 'pill-status' }, `ÚLTIMOS ${list.length} PERÍODOS`)),
      h('div', { class: 'lista-simples' },
        list.map((item) => {
          const isPos = item.balance >= 0;
          return h('div', { class: 'hist-card' },
            h('div', {},
              h('strong', { style: { fontFamily: 'var(--f-titulo)', fontSize: '22px' } }, item.period),
              h('div', { class: 'hist-dados', style: { marginTop: '4px' } },
                `Receita ${fmtUSD(item.income)} · Gastos ${fmtUSD(item.expenses)} · Saldo ${fmtSignedUSD(item.balance)}`)),
            h('span', { class: `pill-status ${isPos ? 'pos' : 'neg'}` },
              isPos ? '✓ Positivo' : '✗ Negativo'));
        }))),
  ];
}

// ---------------------------------------------------------------------
// OUTRAS TELAS (GALLERY, DASHBOARD, PROJETOS, CALENDAR, TASKS, CATEGORIAS)
// ---------------------------------------------------------------------
function viewGallery() {
  drawTopNav('gallery');
  fab.hidden = false;
  fab.onclick = () => openCreateSheet('projetos');

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

function viewDashboard() {
  drawTopNav('dashboard');
  fab.hidden = false;
  fab.onclick = () => openCreateSheet('projetos');

  render(
    h('div', { class: 'dash-wrap' },
      renderYearOverviewBox(),
      activeCategories().map((cat) => renderCategorySummaryCard(cat))));
}

function viewCategory(catId) {
  drawTopNav('dashboard');
  fab.hidden = false;
  const visibleCats = activeCategories();
  const cat = DATA.categories.find((c) => c.id === catId) || visibleCats[0];
  if (!cat) { location.hash = '#/categorias'; return; }

  const { count, pct, statusLabel } = categoryStats(cat);
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
    s.status = order[(order.indexOf(s.status) + 1) % order.length];
    saveData();
    router();
  };

  const renderProjectCard = (p, isArchived = false) => {
    const st = projectStats(p);

    const stepsBox = h('div', { class: 'proj-steps' },
      p.steps.map((s) =>
        h('div', {
          class: `step-row ${s.status}`,
          style: { cursor: 'pointer' },
          onclick: () => cycleStatus(s),
        },
          h('span', { class: 'step-texto' }, s.what),
          h('span', { class: `step-badge ${s.status}` },
            s.status === 'concluido' ? '✓ Concluído' : s.status === 'andamento' ? '▶ Andamento' : '‖ Pendente'))),
      h('div', { class: 'proj-acoes' },
        h('div', { class: 'grupo-acoes-esq' },
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
          class: 'btn',
          onclick: () => openAddStepSheet(p),
        }, '+ Step')));

    const head = h('button', {
      type: 'button',
      class: 'proj-cabeca',
      'aria-expanded': 'true',
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

    return h('div', { class: `proj-card ${isArchived ? 'arquivado' : ''}` }, head, stepsBox);
  };

  const activeList = activeProjects(cat);
  const archivedList = (cat.projects || []).filter((p) => p.archived);

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
        activeList.length
          ? activeList.map((p) => renderProjectCard(p, false))
          : h('div', { class: 'vazio' }, 'Nenhum objetivo ativo nesta categoria. Toque em + para criar.')),
      archivedList.length > 0 && h('section', { class: 'bunkr-box' },
        h('div', { class: 'box-topo' },
          h('h3', { class: 'cat-titulo', style: { fontSize: '26px' } }, 'Arquivados'),
          h('span', { class: 'pill-status' }, `${archivedList.length}`)),
        archivedList.map((p) => renderProjectCard(p, true)))));
}

function viewCalendar() {
  drawTopNav('calendar');
  fab.hidden = false;
  fab.onclick = () => openCreateSheet('projetos');

  const items = [];
  for (const cat of activeCategories()) {
    for (const p of activeProjects(cat)) {
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

function viewTasks() {
  drawTopNav('tasks');
  fab.hidden = false;
  fab.onclick = () => openCreateSheet('projetos');

  const allSteps = [];
  for (const cat of activeCategories()) {
    for (const p of activeProjects(cat)) {
      for (const s of p.steps) {
        allSteps.push({ step: s, project: p.title, category: cat.name });
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
              allSteps.map(({ step, project, category }) =>
                h('div', {
                  class: `step-row ${step.status}`,
                  style: { cursor: 'pointer' },
                  onclick: () => {
                    const order = ['pausado', 'andamento', 'concluido'];
                    step.status = order[(order.indexOf(step.status) + 1) % order.length];
                    saveData();
                    router();
                  },
                },
                  h('div', {},
                    h('div', { class: 'step-texto' }, step.what),
                    h('span', { class: 'rotulo-suave' }, `${category} · ${project}`)),
                  h('span', { class: `step-badge ${step.status}` },
                    step.status === 'concluido' ? '✓ Concluído' : step.status === 'andamento' ? '▶ Andamento' : '‖ Pendente'))))
          : h('div', { class: 'vazio' }, 'Nenhuma tarefa cadastrada.'))));
}

function viewCategories() {
  drawTopNav('categorias');
  fab.hidden = false;
  fab.onclick = () => openNewCategorySheet();

  render(
    h('div', { class: 'dash-wrap' },
      h('section', { class: 'bunkr-box' },
        h('div', { class: 'box-topo' },
          h('h2', { class: 'cat-titulo' }, 'Categorias'),
          h('button', { type: 'button', class: 'btn btn-forte', onclick: () => openNewCategorySheet() }, '+ Nova')),
        h('div', { class: 'lista-simples' },
          DATA.categories.map((cat) =>
            h('div', { class: 'item-linha', style: cat.archived ? { opacity: '0.68' } : {} },
              h('div', {},
                h('strong', {}, cat.name, cat.archived ? ' (arquivada)' : ''),
                h('div', { class: 'rotulo-suave', style: { marginTop: '4px' } },
                  `${(cat.projects || []).length} ${(cat.projects || []).length === 1 ? 'objetivo' : 'objetivos'}`)),
              h('div', { class: 'grupo-acoes-esq' },
                h('button', {
                  type: 'button',
                  class: 'btn',
                  onclick: () => {
                    cat.archived = !cat.archived;
                    saveData();
                    toast(cat.archived ? 'Categoria arquivada' : 'Categoria reativada');
                    router();
                  },
                }, cat.archived ? 'Reativar' : 'Arquivar'),
                h('button', {
                  type: 'button',
                  class: 'btn btn-perigo',
                  onclick: () => {
                    if (confirm(`Deletar a categoria "${cat.name}" e todos os objetivos dentro dela?`)) {
                      DATA.categories = DATA.categories.filter((c) => c.id !== cat.id);
                      DATA.gallery = DATA.gallery.filter((g) => g.categoryId !== cat.id);
                      saveData();
                      toast('Categoria deletada');
                      router();
                    }
                  },
                }, 'Deletar'))))))));
}

// ---------------------------------------------------------------------
// ROTEADOR
// ---------------------------------------------------------------------
const routes = [
  [/^#\/?$/,           () => viewGallery()],
  [/^#\/gallery$/,     () => viewGallery()],
  [/^#\/dashboard$/,   () => viewDashboard()],
  [/^#\/c\/([\w-]+)$/, (id) => viewCategory(id)],
  [/^#\/calendar$/,    () => viewCalendar()],
  [/^#\/tasks$/,       () => viewTasks()],
  [/^#\/financeiro$/,  () => viewFinanceiro()],
  [/^#\/categorias$/,  () => viewCategories()],
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
