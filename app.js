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
  if (a.derrotados !== b.derrotados) return mul * (a.derrotados - b.derrotados);
  if (a.aldeias !== b.aldeias) return mul * (a.aldeias - b.aldeias);
  return a.nome.localeCompare(b.nome, 'pt-BR');
}

function ordenar(rows, sortBy, dir, defaultSort) {
  const campo = sortBy === 'ranking' ? defaultSort : sortBy;
  return [...rows].sort((a, b) => comparar(a, b, campo, dir));
}

function ranksPorCampo(rows, campo) {
  const ordenados = [...rows].sort((a, b) => {
    if (b[campo] !== a[campo]) return b[campo] - a[campo];
    return a.nome.localeCompare(b.nome, 'pt-BR');
  });
  const mapa = new Map();
  ordenados.forEach((j, i) => mapa.set(j.nome, i + 1));
  return mapa;
}

function formatPontos(n) {
  return Number.isInteger(n) ? String(n) : n.toLocaleString('pt-BR', { maximumFractionDigits: 1 });
}

function listaPonderada(rows) {
  const rkAldeias = ranksPorCampo(rows, 'aldeias');
  const rkOd = ranksPorCampo(rows, 'derrotados');
  return rows
    .map((j) => {
      const rankAldeias = rkAldeias.get(j.nome);
      const rankOd = rkOd.get(j.nome);
      const pontos = (rankAldeias + rankOd) / 2;
      return { ...j, rankAldeias, rankOd, pontos };
    })
    .sort((a, b) => {
      if (b.pontos !== a.pontos) return b.pontos - a.pontos;
      return a.nome.localeCompare(b.nome, 'pt-BR');
    });
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
    const posicao = dir === 'asc' ? rows.length - i : i + 1;
    const tr = document.createElement('tr');
    [
      String(posicao),
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

function renderPonderado(rows) {
  const tbody = document.getElementById('tbody-em-disputa-ponderado');
  tbody.replaceChildren();
  const lista = listaPonderada(rows);

  if (!lista.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 5;
    td.className = 'empty';
    td.textContent = 'Nenhum jogador nesta lista';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  lista.forEach((j, i) => {
    const tr = document.createElement('tr');
    [
      String(i + 1),
      j.nome,
      String(j.rankAldeias),
      String(j.rankOd),
      formatPontos(j.pontos),
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

function ligarPonderado(rows) {
  const btn = document.getElementById('btn-ponderado');
  const viewPadrao = document.getElementById('view-disputa-padrao');
  const viewPonderado = document.getElementById('view-disputa-ponderado');
  if (!btn || !viewPadrao || !viewPonderado) return;

  renderPonderado(rows);

  btn.addEventListener('click', () => {
    const ativo = btn.getAttribute('aria-pressed') === 'true';
    const proximo = !ativo;
    btn.setAttribute('aria-pressed', String(proximo));
    btn.textContent = proximo ? 'Lista padrão' : 'Ponderado por OD';
    viewPadrao.hidden = proximo;
    viewPonderado.hidden = !proximo;
    viewPadrao.classList.toggle('is-hidden', proximo);
    viewPonderado.classList.toggle('is-hidden', !proximo);
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

  ligarPonderado(data.emDisputa || []);
}

main().catch((err) => {
  console.error(err);
  document.body.insertAdjacentHTML(
    'afterbegin',
    '<p class="error">Não foi possível carregar a lista. Tente de novo em instantes.</p>'
  );
});
