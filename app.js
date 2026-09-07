const LISTAS = [
  {
    key: 'classificados',
    tbody: 'tbody-classificados',
    defaultSort: 'derrotados',
  },
  {
    key: 'emDisputa',
    tbody: 'tbody-em-disputa',
    defaultSort: 'aldeias',
  },
  {
    key: 'aceitarConvite',
    tbody: 'tbody-aceitar-convite',
    defaultSort: 'aldeias',
  },
];

/** @type {Record<string, { rows: Array<{nome:string,aldeias:number,derrotados:number}>, sortBy: string, dir: 'asc'|'desc', defaultSort: string, tbody: HTMLElement, table: HTMLTableElement }>} */
const state = {};

function comparar(a, b, sortBy, dir) {
  const mul = dir === 'asc' ? 1 : -1;
  if (sortBy === 'nome') {
    return mul * a.nome.localeCompare(b.nome, 'pt-BR');
  }
  if (sortBy === 'aldeias') {
    if (a.aldeias !== b.aldeias) return mul * (a.aldeias - b.aldeias);
    return a.nome.localeCompare(b.nome, 'pt-BR');
  }
  // derrotados (OD) — also used when sortBy === 'ranking' via defaultSort mapping
  if (a.derrotados !== b.derrotados) return mul * (a.derrotados - b.derrotados);
  if (a.aldeias !== b.aldeias) return mul * (a.aldeias - b.aldeias);
  return a.nome.localeCompare(b.nome, 'pt-BR');
}

function ordenar(rows, sortBy, dir, defaultSort) {
  const campo = sortBy === 'ranking' ? defaultSort : sortBy;
  return [...rows].sort((a, b) => comparar(a, b, campo, dir));
}

function renderLista(id) {
  const s = state[id];
  const { tbody, rows, sortBy, dir, defaultSort, table } = s;
  tbody.replaceChildren();

  table.querySelectorAll('th[data-sort]').forEach((th) => {
    const active = th.dataset.sort === sortBy;
    th.classList.toggle('is-active', active);
    th.dataset.dir = active ? dir : '';
    th.setAttribute('aria-sort', active ? (dir === 'asc' ? 'ascending' : 'descending') : 'none');
  });

  if (!rows.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.className = 'empty';
    td.textContent = 'Nenhum jogador nesta lista';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  ordenar(rows, sortBy, dir, defaultSort).forEach((j, i) => {
    const tr = document.createElement('tr');
    [
      String(i + 1),
      j.nome,
      Number(j.aldeias).toLocaleString('pt-BR'),
      Number(j.derrotados).toLocaleString('pt-BR'),
    ].forEach((text) => {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

function ligarSort(id) {
  const s = state[id];
  s.table.querySelectorAll('th[data-sort]').forEach((th) => {
    th.addEventListener('click', () => {
      const next = th.dataset.sort;
      if (s.sortBy === next) {
        s.dir = s.dir === 'desc' ? 'asc' : 'desc';
      } else {
        s.sortBy = next;
        s.dir = 'desc';
      }
      renderLista(id);
    });
  });
}

async function main() {
  const res = await fetch('data.json');
  if (!res.ok) throw new Error('Falha ao carregar data.json');
  const data = await res.json();
  const el = document.getElementById('atualizadoEm');
  if (el) el.textContent = `Atualizado em ${data.atualizadoEm}`;

  for (const cfg of LISTAS) {
    const tbody = document.getElementById(cfg.tbody);
    const table = tbody.closest('table');
    state[cfg.key] = {
      rows: data[cfg.key] || [],
      sortBy: 'ranking',
      dir: 'desc',
      defaultSort: cfg.defaultSort,
      tbody,
      table,
    };
    ligarSort(cfg.key);
    renderLista(cfg.key);
  }
}

main().catch((err) => {
  console.error(err);
  document.body.insertAdjacentHTML(
    'afterbegin',
    '<p class="error">Não foi possível carregar a lista. Tente de novo em instantes.</p>'
  );
});
