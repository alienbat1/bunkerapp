// =====================================================================
// app.js — Dados + Gallery, Dashboard, Projetos, Calendar, Tasks + Arquivar/Deletar
// =====================================================================

const STORAGE_KEY = 'bunkr-data-v2';

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
    { id: 'financeiro', name: 'Financeiro', archived: false, projects: [] },
    { id: 'habitos',    name: 'Hábitos',    archived: false, projects: [] },
    { id: 'carreira',   name: 'Carreira',   archived: false, projects: [] },
    { id: 'estudo',     name: 'Estudo',     archived: false, projects: [] },
    { id: 'hobbies',    name: 'Hobbies',    archived: false, projects: [] },
  ],
};

function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return structuredClone(DEFAULT_DATA);
}

let DATA = loadData();

function saveData() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA));
  } catch {
    toast('Imagem muito grande para salvar localmente');
  }
}

// ---------------------------------------------------------------------
// HELPERS DE DOM E CÁLCULO
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
// TELAS
// ---------------------------------------------------------------------

// TELA 1 — GALLERY
function viewGallery() {
  drawTopNav('gallery');
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

// TELA 2 — DASHBOARD
function viewDashboard() {
  drawTopNav('dashboard');
  fab.onclick = () => openCreateSheet('projetos');

  render(
    h('div', { class: 'dash-wrap' },
      renderYearOverviewBox(),
      activeCategories().map((cat) => renderCategorySummaryCard(cat))));
}

// TELA 3 — PROJETOS POR CATEGORIA (com Arquivar e Deletar objetivos)
function viewCategory(catId) {
  drawTopNav('dashboard');
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

// TELA 4 — CALENDAR
function viewCalendar() {
  drawTopNav('calendar');
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

// TELA 5 — TASKS
function viewTasks() {
  drawTopNav('tasks');
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

// TELA 6 — GERENCIAR CATEGORIAS (Arquivar, Reativar, Deletar e Criar)
function viewCategories() {
  drawTopNav('categorias');
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
