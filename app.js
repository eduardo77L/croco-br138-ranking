function ordenarJogadores(lista) {
  return [...lista].sort((a, b) => {
    if (b.derrotados !== a.derrotados) return b.derrotados - a.derrotados;
    return a.nome.localeCompare(b.nome, 'pt-BR');
  });
}

function renderLista(tbody, lista) {
  tbody.replaceChildren();
  if (!lista.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.className = 'empty';
    td.textContent = 'Nenhum jogador nesta lista';
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }
  ordenarJogadores(lista).forEach((j, i) => {
    const tr = document.createElement('tr');
    const cells = [
      String(i + 1),
      j.nome,
      Number(j.aldeias).toLocaleString('pt-BR'),
      Number(j.derrotados).toLocaleString('pt-BR'),
    ];
    cells.forEach((text) => {
      const td = document.createElement('td');
      td.textContent = text;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

async function main() {
  const res = await fetch('data.json');
  if (!res.ok) throw new Error('Falha ao carregar data.json');
  const data = await res.json();
  const el = document.getElementById('atualizadoEm');
  if (el) el.textContent = `Atualizado em ${data.atualizadoEm}`;
  renderLista(document.getElementById('tbody-classificados'), data.classificados || []);
  renderLista(document.getElementById('tbody-em-disputa'), data.emDisputa || []);
  renderLista(document.getElementById('tbody-aceitar-convite'), data.aceitarConvite || []);
}

main().catch((err) => {
  console.error(err);
  document.body.insertAdjacentHTML(
    'afterbegin',
    '<p class="error">Não foi possível carregar a lista. Tente de novo em instantes.</p>'
  );
});
