// =====================================================================
// app.js — Gallery, Dashboard, Projetos (com Editar), Calendar Grid + Dia, Tasks, Financeiro
// =====================================================================

const STORAGE_KEY = 'bunkr-data-v4';

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
        {
          id: 'acting-classes',
          title: 'Acting Classes',
          summary: 'Pesquisar e me matricular em aulas de atuação em Los Angeles.',
          archived: false,
          financialGoalKey: 'acting', // conectado ao goal financeiro Acting Classes
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

  // -------------------------------------------------------------------
  // CALENDÁRIO: eventos pontuais + pagamentos automáticos recorrentes
  // -------------------------------------------------------------------
  calendarEvents: [
    // Exemplo de dias de trabalho / compromissos
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

  // Pagamentos automáticos que vão direto para o Calendário todo mês
  recurringBills: [
    { id: 'bill-aluguel', day: 1,  title: 'aluguel', amount: 1300 },
    { id: 'bill-amazon',  day: 4,  title: 'amazon',  amount: 8 },
    { id: 'bill-hulu',    day: 20, title: 'hulu',    amount: 8 },
    { id: 'bill-bofa',    day: 25, title: 'bofa fee', amount: 5 },
  ],

  // -------------------------------------------------------------------
  // FINANCEIRO
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
        text: 'Você compra na Amazon em rajadas (5–8 pedidos em 1–2 dias), o que indica compras por impulso. Criar uma lista e esperar 48h antes de comprar pode cortar esse gasto pela metade.',
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
let calMonth = 10; // 0 = Jan, 10 = Novembro

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
// NAVEGAÇÃO PRINCIPAL (FIXA — SÓ PALAVRAS SEM BORDA BRANCA)
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
// FORMULÁRIOS DE CRIAÇÃO E EDIÇÃO DE PROJETOS
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

// Modal de EDIÇÃO DE PROJETO (título, resumo, categoria, steps e foto)
function openEditProjectSheet(currentCat, project) {
  let newUploadedImage = null;
  const existingPhoto = DATA.gallery.find((g) => g.projectId === project.id);

  const preview = h('img', {
    class: 'preview-upload',
    alt: 'Prévia da foto',
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

  // Lista editável dos steps do projeto
  const editableSteps = project.steps.map((s) => ({ ...s }));
  const stepsContainer = h('div', {});

  const renderEditableSteps = () => {
    stepsContainer.replaceChildren(
      ...editableSteps.map((st, idx) =>
        h('div', { class: 'edit-step-item' },
          h('input', {
            type: 'text',
            value: st.what,
            placeholder: 'Descrição do passo',
            oninput: (e) => { st.what = e.target.value; },
          }),
          h('input', {
            type: 'date',
            value: st.dueDate || '',
            style: { maxWidth: '150px' },
            onchange: (e) => { st.dueDate = e.target.value; },
          }),
          h('button', {
            type: 'button',
            class: 'btn btn-perigo',
            onclick: () => {
              editableSteps.splice(idx, 1);
              renderEditableSteps();
            },
          }, '✕')))
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

      // Move de categoria se mudou
      if (targetCatId !== currentCat.id) {
        currentCat.projects = currentCat.projects.filter((p) => p.id !== project.id);
        const destCat = DATA.categories.find((c) => c.id === targetCatId);
        if (destCat) destCat.projects.push(project);
      }

      // Atualiza foto e legenda na Gallery
      if (existingPhoto) {
        existingPhoto.tag = newTitle.toUpperCase();
        existingPhoto.categoryId = targetCatId;
        if (newUploadedImage) existingPhoto.image = newUploadedImage;
      } else if (newUploadedImage) {
        const hasPlaceholders = DATA.gallery.some((g) => String(g.image).startsWith('data:image/svg+xml'));
        if (hasPlaceholders) DATA.gallery = [];
        DATA.gallery.unshift({
          id: Date.now(),
          projectId: project.id,
          tag: newTitle.toUpperCase(),
          size: 'normal',
          image: newUploadedImage,
          categoryId: targetCatId,
        });
      }

      saveData();
      backdrop.remove();
      toast('Projeto atualizado');
      location.hash = `#/c/${targetCatId}`;
      router();
    },
  },
    h('h2', {}, 'Editar projeto'),

    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Título'),
      h('input', { type: 'text', name: 'title', value: project.title, required: true })),

    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Categoria'),
      h('select', { name: 'categoryId' },
        activeCategories().map((c) =>
          h('option', { value: c.id, selected: c.id === currentCat.id }, c.name)))),

    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Resumo'),
      h('input', { type: 'text', name: 'summary', value: project.summary || '' })),

    h('div', { class: 'campo' },
      h('div', { class: 'box-topo', style: { marginBottom: '8px' } },
        h('span', { class: 'rotulo' }, 'Steps & Prazos'),
        h('button', {
          type: 'button',
          class: 'btn',
          onclick: () => {
            editableSteps.push({ what: '', status: 'pausado', dueDate: '' });
            renderEditableSteps();
          },
        }, '+ Linha')),
      stepsContainer),

    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Trocar / adicionar foto na Gallery'),
      fileInput,
      preview),

    h('div', { class: 'linha-botoes' },
      h('button', { type: 'button', class: 'btn btn-leve', onclick: () => backdrop.remove() }, 'Cancelar'),
      h('button', { type: 'submit', class: 'btn btn-forte' }, 'Salvar alterações')));

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
// CALENDÁRIO (IMAGEM 1: GRID MENSAL + PÁGINA DO DIA AO CLICAR)
// ---------------------------------------------------------------------
const MONTH_NAMES_EN = [
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER',
];
const WEEKDAYS_EN = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

function pad2(n) {
  return String(n).padStart(2, '0');
}

// Reúne tudo que cai na data YYYY-MM-DD: eventos, pagamentos automáticos e steps com prazo
function getItemsForDate(dateStr) {
  const [, , ddStr] = dateStr.split('-');
  const dayNum = Number(ddStr);

  const events = (DATA.calendarEvents || []).filter((e) => e.date === dateStr);
  const bills  = (DATA.recurringBills || []).filter((b) => Number(b.day) === dayNum);

  const steps = [];
  for (const cat of activeCategories()) {
    for (const p of activeProjects(cat)) {
      for (const s of p.steps) {
        if (s.dueDate === dateStr) {
          steps.push({ step: s, project: p, category: cat });
        }
      }
    }
  }

  return { events, bills, steps };
}

function viewCalendar() {
  drawTopNav('calendar');
  fab.hidden = false;
  fab.onclick = () => {
    const todayStr = `${calYear}-${pad2(calMonth + 1)}-01`;
    location.hash = `#/day/${todayStr}`;
  };

  const firstDayWeekday = new Date(calYear, calMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDayWeekday; i++) {
    cells.push(h('div', { class: 'cal-cell vazio' }));
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${calYear}-${pad2(calMonth + 1)}-${pad2(day)}`;
    const weekday = (firstDayWeekday + day - 1) % 7;
    const { events, bills, steps } = getItemsForDate(dateStr);

    const hasBill = bills.length > 0;
    const hasWork = events.some((e) => e.type === 'work');

    const cls = [
      'cal-cell',
      weekday === 0 ? 'is-sun' : '',
      hasBill ? 'has-bill' : hasWork ? 'has-work' : '',
    ].filter(Boolean).join(' ');

    cells.push(
      h('button', {
        type: 'button',
        class: cls,
        onclick: () => { location.hash = `#/day/${dateStr}`; },
      },
        h('span', { class: 'cal-num' }, String(day)),
        bills.map((b) => h('div', { class: 'cal-ev bill' }, `${b.title} $${b.amount}`)),
        events.map((ev) => h('div', { class: 'cal-ev' }, ev.title)),
        steps.map((st) => h('div', { class: 'cal-ev task' }, `• ${st.step.what}`)))
    );
  }

  render(
    h('div', { class: 'cal-wrap' },
      h('div', { class: 'cal-header' },
        h('button', {
          type: 'button',
          class: 'cal-nav-btn',
          'aria-label': 'Mês anterior',
          onclick: () => {
            calMonth--;
            if (calMonth < 0) { calMonth = 11; calYear--; }
            router();
          },
        }, '‹'),
        h('h1', { class: 'cal-mes-titulo' }, `${MONTH_NAMES_EN[calMonth]} ${calYear === 2026 ? '' : calYear}`),
        h('button', {
          type: 'button',
          class: 'cal-nav-btn',
          'aria-label': 'Próximo mês',
          onclick: () => {
            calMonth++;
            if (calMonth > 11) { calMonth = 0; calYear++; }
            router();
          },
        }, '›')),

      h('div', { class: 'cal-weekdays' },
        WEEKDAYS_EN.map((w) => h('div', {}, w))),

      h('div', { class: 'cal-grid' }, cells)));
}

// PÁGINA DO DIA AO CLICAR NUMA DATA DO CALENDÁRIO
function viewCalendarDay(dateStr) {
  drawTopNav('calendar');
  fab.hidden = true;

  const [yyyy, mm, dd] = dateStr.split('-').map(Number);
  const dateObj = new Date(yyyy, mm - 1, dd);
  const weekdayName = WEEKDAYS_EN[dateObj.getDay()];
  const monthName = MONTH_NAMES_EN[mm - 1];

  const { events, bills, steps } = getItemsForDate(dateStr);

  // Formulário rápido inline para adicionar compromisso ou pagamento nesse dia
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
        DATA.recurringBills.push({
          id: `bill-${Date.now()}`,
          day: dd,
          title,
          amount,
        });
        toast('Pagamento automático adicionado');
      } else {
        DATA.calendarEvents.push({
          id: `ev-${Date.now()}`,
          date: dateStr,
          title,
          type: kind, // 'work' | 'note'
        });
        toast('Adicionado ao dia');
      }

      saveData();
      router();
    },
  },
    h('div', { class: 'box-topo' },
      h('h3', { class: 'proj-titulo' }, 'Adicionar neste dia')),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Tipo'),
      h('select', { name: 'kind' },
        h('option', { value: 'work' }, 'Trabalho / Compromisso (card verde)'),
        h('option', { value: 'note' }, 'Nota / Lembrete do dia'),
        h('option', { value: 'bill' }, `Pagamento automático mensal — todo dia ${dd} (card rosa)`))),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Descrição'),
      h('input', { type: 'text', name: 'title', required: true, placeholder: 'Ex: Spa: 10am to 7pm ou spotify' })),
    h('label', { class: 'campo' },
      h('span', { class: 'rotulo' }, 'Valor em $ (se for pagamento automático)'),
      h('input', { type: 'number', name: 'amount', step: 'any', placeholder: 'Ex: 12' })),
    h('div', { class: 'linha-botoes' },
      h('button', { type: 'submit', class: 'btn btn-forte' }, '+ Adicionar ao dia')));

  render(
    h('div', { class: 'dash-wrap' },
      h('div', { class: 'box-topo' },
        h('a', { class: 'btn', href: '#/calendar' }, '← Voltar ao calendário'),
        h('span', { class: 'pill-status' }, `${dd}/${pad2(mm)}/${yyyy}`)),

      h('section', { class: 'bunkr-box' },
        h('div', { class: 'box-topo' },
          h('h1', { class: 'cat-titulo' }, `${weekdayName}, ${monthName} ${dd}`),
          h('span', { class: 'rotulo-suave' }, `${events.length + bills.length + steps.length} itens`)),

        // 1. Pagamentos automáticos (a pagar)
        bills.length > 0 && h('div', { style: { marginBottom: '18px' } },
          h('p', { class: 'rotulo', style: { color: 'var(--rust-texto)', marginBottom: '8px' } }, 'Pagamentos automáticos (todo mês)'),
          h('div', { class: 'lista-simples' },
            bills.map((b) =>
              h('div', { class: 'item-linha', style: { background: 'var(--mauve-cal)' } },
                h('div', {},
                  h('strong', {}, `${b.title} — ${fmtUSD(b.amount)}`),
                  h('div', { class: 'rotulo-suave' }, `Débito automático todo dia ${b.day}`)),
                h('button', {
                  type: 'button',
                  class: 'btn btn-perigo',
                  onclick: () => {
                    DATA.recurringBills = DATA.recurringBills.filter((item) => item.id !== b.id);
                    saveData();
                    toast('Pagamento automático removido');
                    router();
                  },
                }, 'Apagar'))))),

        // 2. Compromissos e turnos do dia
        events.length > 0 && h('div', { style: { marginBottom: '18px' } },
          h('p', { class: 'rotulo', style: { marginBottom: '8px' } }, 'Agenda do dia'),
          h('div', { class: 'lista-simples' },
            events.map((ev) =>
              h('div', { class: 'item-linha' },
                h('strong', {}, ev.title),
                h('button', {
                  type: 'button',
                  class: 'btn btn-perigo',
                  onclick: () => {
                    DATA.calendarEvents = DATA.calendarEvents.filter((item) => item.id !== ev.id);
                    saveData();
                    toast('Item apagado');
                    router();
                  },
                }, 'Apagar'))))),

        // 3. Tasks / Steps com prazo neste dia
        steps.length > 0 && h('div', { style: { marginBottom: '18px' } },
          h('p', { class: 'rotulo', style: { marginBottom: '8px' } }, 'Tasks com prazo hoje'),
          h('div', { class: 'lista-simples' },
            steps.map(({ step, project }) =>
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
                  h('span', { class: 'rotulo-suave' }, `Projeto: ${project.title}`)),
                h('span', { class: `step-badge ${step.status}` },
                  step.status === 'concluido' ? '✓ Concluído' : step.status === 'andamento' ? '▶ Andamento' : '‖ Pendente'))))),

        (events.length + bills.length + steps.length === 0) &&
          h('div', { class: 'vazio' }, 'Nada agendado para este dia ainda.')),

      addForm));
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
        h('button', {
          type: 'button',
          class: 'btn btn-leve',
          onclick: () => { cm.analysisText = ''; saveData(); router(); },
        }, 'Limpar')),
      h('div', { class: 'analise-box' }, cm.analysisText)),

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

function renderFinanceiroGoals() {
  const g = DATA.financeiro.goals;
  const actingPct  = Math.min(100, Math.round((g.actingCurrent / g.actingTarget) * 100));
  const reservaPct = Math.min(100, Math.round((g.reservaCurrent / g.reservaTarget) * 100));
  const investUnlocked = g.reservaCurrent >= g.reservaTarget;

  return [
    h('section', { class: 'bunkr-box compact-box' },
      h('div', { class: 'box-topo' },
        h('h2', { class: 'cat-titulo' }, 'Goals'),
        h('span', { class: 'pill-status' }, '3 METAS')),

      h('div', { class: 'compact-grid-2' },
        // 1. Acting Classes
        h('div', { class: 'goal-card' },
          h('div', { class: 'box-topo', style: { marginBottom: '8px' } },
            h('h3', { class: 'proj-titulo' }, 'Acting Classes'),
            h('span', { class: `pill-status ${actingPct >= 100 ? 'pos' : ''}` }, `${actingPct}%`)),
          bar(actingPct),
          h('div', { class: 'rotulo-suave', style: { marginTop: '8px', fontSize: '10px' } },
            `${fmtUSD(g.actingCurrent)} / ${fmtUSD(g.actingTarget)}`),
          h('div', { class: 'goal-edit-row' },
            h('input', {
              type: 'number',
              step: 'any',
              value: g.actingCurrent,
              'aria-label': 'Valor atual Acting Classes',
              onchange: (e) => {
                g.actingCurrent = Math.max(0, Number(e.target.value) || 0);
                saveData();
                toast('Acting Classes atualizado');
                router();
              },
            }),
            h('a', { class: 'btn', style: { minHeight: '30px', padding: '0 10px', fontSize: '10px' }, href: '#/c/projetos' }, 'Projeto →'))),

        // 2. Reserva de Emergência
        h('div', { class: 'goal-card' },
          h('div', { class: 'box-topo', style: { marginBottom: '8px' } },
            h('h3', { class: 'proj-titulo' }, 'Reserva'),
            h('span', { class: `pill-status ${reservaPct >= 100 ? 'pos' : ''}` }, `${reservaPct}%`)),
          bar(reservaPct),
          h('div', { class: 'rotulo-suave', style: { marginTop: '8px', fontSize: '10px' } },
            `${fmtUSD(g.reservaCurrent)} / ${fmtUSD(g.reservaTarget)}`),
          h('div', { class: 'goal-edit-row' },
            h('input', {
              type: 'number',
              step: 'any',
              value: g.reservaCurrent,
              'aria-label': 'Valor atual Reserva',
              onchange: (e) => {
                g.reservaCurrent = Math.max(0, Number(e.target.value) || 0);
                saveData();
                toast('Reserva atualizada');
                router();
              },
            }))),

        // 3. Investimento (bloqueado)
        h('div', { class: `goal-card ${investUnlocked ? '' : 'bloqueado'}`, style: { gridColumn: 'span 2' } },
          h('div', { class: 'box-topo', style: { marginBottom: '8px', flexDirection: 'row', alignItems: 'center' } },
            h('h3', { class: 'proj-titulo' }, `${investUnlocked ? '📈' : '🔒'} Investimento`),
            h('span', { class: 'pill-status' }, investUnlocked ? 'DESBLOQUEADO' : 'BLOQUEADO')),
          bar(0),
          h('p', { class: 'rotulo-suave', style: { marginTop: '8px', marginBottom: '0', fontSize: '10px' } },
            investUnlocked
              ? 'Reserva atingiu $3.000! Você já pode começar a investir.'
              : 'Disponível quando a Reserva atingir $3.000')))),
  ];
}

function renderFinanceiroCortes() {
  const cuts = DATA.financeiro.cuts;
  const committed = cuts.filter((c) => c.status === 'accepted');
  const pending   = cuts.filter((c) => c.status === 'pending');

  return [
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

function renderFinanceiroHistorico() {
  const list = DATA.financeiro.history;
  return [
    h('section', { class: 'bunkr-box compact-box' },
      h('div', { class: 'box-topo' },
        h('h2', { class: 'cat-titulo' }, 'Histórico'),
        h('span', { class: 'pill-status' }, `${list.length} PERÍODOS`)),
      h('div', { class: 'compact-grid-2' },
        list.map((item) => {
          const isPos = item.balance >= 0;
          return h('div', { class: 'hist-card' },
            h('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' } },
              h('strong', { style: { fontFamily: 'var(--f-titulo)', fontSize: '20px' } }, item.period),
              h('span', { class: `pill-status ${isPos ? 'pos' : 'neg'}`, style: { fontSize: '9px', padding: '2px 8px' } },
                isPos ? '✓ +' : '✗ -')),
            h('div', { class: 'hist-dados' },
              `Rec: ${fmtUSD(item.income)}\nGas: ${fmtUSD(item.expenses)}\nSal: ${fmtSignedUSD(item.balance)}`));
        }))),
  ];
}

// ---------------------------------------------------------------------
// OUTRAS TELAS (GALLERY, DASHBOARD, PROJETOS COM EDITAR, TASKS, CATEGORIAS)
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
      h('div', { class: 'dash-cats-grid' },
        activeCategories().map((cat) => renderCategorySummaryCard(cat)))));
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
    const finGoals = DATA.financeiro.goals;
    const isLinkedActing = p.financialGoalKey === 'acting' || p.id === 'acting-classes';

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
      h('section', { class: 'bunkr-box compact-box' },
        h('div', { class: 'box-topo' },
          h('h2', { class: 'cat-titulo' }, 'Tasks'),
          h('span', { class: 'pill-status' }, `${allSteps.length} STEPS`)),
        allSteps.length
          ? h('div', { class: 'compact-grid-2' },
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
                    h('span', { class: 'rotulo-suave', style: { fontSize: '9.5px', display: 'block', marginTop: '4px' } }, `${category} · ${project}`)),
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
      h('section', { class: 'bunkr-box compact-box' },
        h('div', { class: 'box-topo' },
          h('h2', { class: 'cat-titulo' }, 'Categorias'),
          h('button', { type: 'button', class: 'btn btn-forte', onclick: () => openNewCategorySheet() }, '+ Nova')),
        h('div', { class: 'compact-grid-2' },
          DATA.categories.map((cat) =>
            h('div', { class: 'item-linha', style: cat.archived ? { opacity: '0.68' } : {} },
              h('div', {},
                h('strong', { style: { fontFamily: 'var(--f-titulo)', fontSize: '20px' } }, cat.name, cat.archived ? ' (arq.)' : ''),
                h('div', { class: 'rotulo-suave', style: { marginTop: '4px', fontSize: '10px' } },
                  `${(cat.projects || []).length} ${(cat.projects || []).length === 1 ? 'objetivo' : 'objetivos'}`)),
              h('div', { class: 'grupo-acoes-esq' },
                h('button', {
                  type: 'button',
                  class: 'btn',
                  style: { minHeight: '30px', padding: '0 10px', fontSize: '10px' },
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
                  style: { fontSize: '10px' },
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
  [/^#\/?$/,                    () => viewGallery()],
  [/^#\/gallery$/,              () => viewGallery()],
  [/^#\/dashboard$/,            () => viewDashboard()],
  [/^#\/c\/([\w-]+)$/,          (id) => viewCategory(id)],
  [/^#\/calendar$/,             () => viewCalendar()],
  [/^#\/day\/(\d{4}-\d{2}-\d{2})$/, (date) => viewCalendarDay(date)],
  [/^#\/tasks$/,                () => viewTasks()],
  [/^#\/financeiro$/,           () => viewFinanceiro()],
  [/^#\/categorias$/,           () => viewCategories()],
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
