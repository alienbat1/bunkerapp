// =====================================================================
// ui.js — peças pequenas reaproveitadas em todas as telas
// =====================================================================

// h() cria elementos HTML sem montar texto na mão.
//   h('p', { class: 'rotulo' }, 'Olá')  →  <p class="rotulo">Olá</p>
// Texto passado aqui é sempre tratado como TEXTO, nunca como HTML:
// isso impede que algo digitado num campo "quebre" a página.
export function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k.startsWith('on')) el.addEventListener(k.slice(2), v);   // onclick → click
    else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat(Infinity)) {   // aceita listas dentro de listas
    if (c == null || c === false || c === '') continue;
    el.append(c instanceof Node ? c : String(c));
  }
  return el;
}

// ---------- status --------------------------------------------------
// Fonte única dos 4 status: rótulo e símbolo. Quer mudar o texto
// "Em andamento" para "Fazendo"? É só aqui.
export const STATUS = {
  andamento: { label: 'Em andamento', icon: '▶' },
  pausado:   { label: 'Pausado',      icon: '‖' },
  bloqueado: { label: 'Bloqueado',    icon: '✕' },
  concluido: { label: 'Concluído',    icon: '✓' },
};

export const statusTag = (s, attrs = {}) =>
  h('span', { class: 'status', 'data-s': s, ...attrs },
    h('span', { 'aria-hidden': 'true' }, STATUS[s].icon), STATUS[s].label);

// ---------- dinheiro ------------------------------------------------
// O banco guarda centavos (inteiro). Aqui vira "R$ 1.234,56".
const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
export const money = (cents) => brl.format((cents || 0) / 100);

// "150,90" ou "150.90" digitado → 15090 centavos
export function toCents(text) {
  const clean = String(text).trim().replace(/\s|R\$/g, '');
  // se tem vírgula, ela é o decimal (padrão brasileiro): tira os pontos de milhar
  const normalized = clean.includes(',') ? clean.replace(/\./g, '').replace(',', '.') : clean;
  return Math.round(parseFloat(normalized) * 100) || 0;
}

// Barra de progresso de 0 a 100%
export function bar(value, total, variant = '') {
  const pct = total > 0 ? Math.min(100, Math.round((value / total) * 100)) : 0;
  return h('div', {
    class: `barra ${variant}`, role: 'progressbar',
    'aria-valuenow': pct, 'aria-valuemin': 0, 'aria-valuemax': 100,
  }, h('span', { style: { width: `${pct}%` } }));
}

// ---------- aviso rápido (toast) -------------------------------------
export function toast(msg) {
  const el = h('div', { class: 'aviso', role: 'status' }, msg);
  document.body.append(el);
  setTimeout(() => el.remove(), 2600);
}

// ---------- folha (bottom sheet) com formulário ----------------------
// fields: [{ name, label, hint, type, value, options, required }]
// Devolve uma Promise: resolve com os dados preenchidos, ou null se cancelar.
export function sheet({ title, fields, submitLabel = 'Salvar', extra }) {
  return new Promise((resolve) => {
    const close = (result) => { back.remove(); resolve(result); };

    const inputs = fields.map((f) => {
      let input;
      if (f.type === 'textarea') {
        input = h('textarea', { name: f.name, required: f.required, rows: 3 }, f.value ?? '');
      } else if (f.type === 'select') {
        input = h('select', { name: f.name },
          f.options.map((o) => h('option', { value: o.value, selected: String(o.value) === String(f.value) }, o.label)));
      } else {
        input = h('input', {
          name: f.name, type: f.type || 'text', value: f.value ?? '',
          required: f.required, inputmode: f.inputmode, placeholder: f.placeholder,
        });
      }
      return h('label', { class: 'campo' },
        h('span', { class: 'rotulo' }, f.label),
        input,
        f.hint && h('small', {}, f.hint));
    });

    const form = h('form', {
      onsubmit: (e) => {
        e.preventDefault();
        close(Object.fromEntries(new FormData(form)));
      },
    },
      h('h2', {}, title),
      inputs,
      extra,
      h('div', { class: 'linha-botoes' },
        h('button', { type: 'button', class: 'btn btn-leve', onclick: () => close(null) }, 'Cancelar'),
        h('button', { type: 'submit', class: 'btn btn-forte' }, submitLabel)));

    const back = h('div', {
      class: 'folha-fundo',
      onclick: (e) => { if (e.target === back) close(null); },   // tocar fora fecha
    }, h('div', { class: 'folha', role: 'dialog', 'aria-modal': 'true' }, form));

    document.body.append(back);
    form.querySelector('input, textarea')?.focus();
  });
}
