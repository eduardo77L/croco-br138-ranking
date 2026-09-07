# Croco br138 Ranking Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar um site estático com três listas (Classificados, Em disputa, Aceitar convite) alimentadas por `data.json`, no GitHub Pages do repo `eduardo77L/croco-br138-ranking`.

**Architecture:** HTML/CSS/JS sem build. `app.js` faz `fetch('data.json')`, ordena cada lista por `derrotados` desc e preenche três tabelas. Atualização = editar JSON + push em `main`.

**Tech Stack:** HTML5, CSS3, JavaScript vanilla, GitHub Pages

**Spec:** `docs/superpowers/specs/2026-09-07-croco-br138-ranking-design.md`

## Global Constraints

- Título da página: `Croco br138 - Ranking de classificados + disputa`
- Três listas com chaves JSON: `classificados`, `emDisputa`, `aceitarConvite`
- Campos por jogador: `nome` (string), `aldeias` (int ≥ 0), `derrotados` (number ≥ 0)
- Colunas na UI: `#` · `Nome` · `Aldeias` · `Oponentes derrotados`
- Ordenação: `derrotados` desc; empate por `nome` A–Z
- Lista vazia: texto `Nenhum jogador nesta lista`
- Sem backend, sem Vite, sem dependências npm
- Repo remoto: `https://github.com/eduardo77L/croco-br138-ranking.git`
- UI em português

## File Structure

| File | Responsibility |
|------|----------------|
| `data.json` | Fonte de verdade dos jogadores + `atualizadoEm` |
| `index.html` | Shell: título, data, três seções com `<tbody>` vazios |
| `styles.css` | Layout, tipografia, atmosfera visual, responsivo |
| `app.js` | Fetch, sort, render das três tabelas |
| `README.md` | Como editar JSON e publicar no Pages |
| `.gitignore` | Ignorar lixo de SO/editor |

---

### Task 1: Dados + página funcional

**Files:**
- Create: `data.json`
- Create: `index.html`
- Create: `app.js`
- Create: `.gitignore`

**Interfaces:**
- Consumes: nada
- Produces: shape de `data.json` abaixo; `app.js` exporta logicamente `ordenarJogadores(lista)` e `renderLista(tbody, lista)` (funções no mesmo arquivo, sem módulos)

`data.json` shape:

```json
{
  "atualizadoEm": "2026-09-07",
  "classificados": [
    { "nome": "Exemplo Alpha", "aldeias": 18, "derrotados": 1500 },
    { "nome": "Exemplo Beta", "aldeias": 9, "derrotados": 820 }
  ],
  "emDisputa": [
    { "nome": "Exemplo Gama", "aldeias": 7, "derrotados": 410 }
  ],
  "aceitarConvite": []
}
```

- [ ] **Step 1: Criar `.gitignore`**

```
.DS_Store
Thumbs.db
*.log
.vscode/
.idea/
```

- [ ] **Step 2: Criar `data.json`** com o shape acima (exemplos, não dados reais).

- [ ] **Step 3: Criar `index.html`**

Requisitos do markup:
- `<title>` e `<h1>`: `Croco br138 - Ranking de classificados + disputa`
- Elemento `#atualizadoEm` para a data
- Três `<section>` com headings: `Classificados`, `Em disputa`, `Aceitar convite`
- Cada seção: `<table>` com thead fixo e `<tbody id="tbody-classificados">` / `tbody-em-disputa` / `tbody-aceitar-convite`
- Links: `<link rel="stylesheet" href="styles.css">` e `<script src="app.js" defer></script>`
- Google Fonts: uma display + uma body (não Inter/Roboto/Arial/system-ui como stack principal)

- [ ] **Step 4: Criar `app.js`**

```js
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
    [String(i + 1), j.nome, String(j.aldeias), String(j.derrotados)].forEach((text) => {
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
```

- [ ] **Step 5: Verificar lógica de ordenação no Node (sem browser)**

Run (PowerShell, na pasta do projeto):

```powershell
node -e "function ordenarJogadores(lista){return [...lista].sort((a,b)=>b.derrotados!==a.derrotados?b.derrotados-a.derrotados:a.nome.localeCompare(b.nome,'pt-BR'))}; const r=ordenarJogadores([{nome:'B',aldeias:1,derrotados:10},{nome:'A',aldeias:1,derrotados:10},{nome:'C',aldeias:1,derrotados:50}]); if(r.map(x=>x.nome).join(',')!=='C,A,B') process.exit(1); console.log('ok')"
```

Expected: `ok`

- [ ] **Step 6: Commit**

```bash
git init -b main
git add .gitignore data.json index.html app.js docs
git commit -m "feat: add ranking data model and page shell"
```

---

### Task 2: Estilo + README

**Files:**
- Create: `styles.css`
- Create: `README.md`

**Interfaces:**
- Consumes: IDs/classes de `index.html` (`#atualizadoEm`, `.empty`, `.error`, sections/tables)
- Produces: página visualmente completa e legível no mobile

- [ ] **Step 1: Criar `styles.css`**

Direção visual (evitar purple-on-white, cream+terracotta, dark-mode glow genérico):
- Fundo com gradiente/textura sutil em tons terra/verde militar (tribo/croco), não flat
- Tipografia: display no `h1`, sans legível nas tabelas
- Tabelas limpas, zebra leve opcional; destaque só na hierarquia tipográfica
- Mobile: padding confortável; tabela com `overflow-x: auto` se necessário
- `.empty` e `.error` legíveis

- [ ] **Step 2: Criar `README.md`**

Conteúdo mínimo:
- O que é o site
- Link Pages: `https://eduardo77L.github.io/croco-br138-ranking/`
- Como editar `data.json` (campos e as três listas)
- Como publicar: commit + push `main`
- Como ligar Pages: Settings → Pages → `main` / root

- [ ] **Step 3: Smoke test local**

```powershell
npx --yes serve -l 4173
```

Abrir `http://localhost:4173` e conferir:
- Título correto
- Data visível
- Classificados com 2 linhas ordenadas por derrotados
- Em disputa com 1 linha
- Aceitar convite com mensagem vazia

- [ ] **Step 4: Commit**

```bash
git add styles.css README.md
git commit -m "feat: style ranking page and document publish flow"
```

---

### Task 3: Publicar no GitHub Pages

**Files:**
- Modify: remote only (sem arquivos novos obrigatórios)

**Interfaces:**
- Consumes: commits das Tasks 1–2
- Produces: site live em `https://eduardo77L.github.io/croco-br138-ranking/`

- [ ] **Step 1: Conectar remote e push**

```bash
git remote add origin https://github.com/eduardo77L/croco-br138-ranking.git
git push -u origin main
```

- [ ] **Step 2: Orientar ativação do Pages** (se ainda não estiver ativo)

Instruir o usuário (não dá para clicar no UI por ele de forma confiável):
1. Abrir `https://github.com/eduardo77L/croco-br138-ranking/settings/pages`
2. Source: Deploy from a branch
3. Branch: `main` / folder: `/ (root)` → Save

- [ ] **Step 3: Verificar URL**

Abrir `https://eduardo77L.github.io/croco-br138-ranking/` (pode levar 1–2 min).  
Expected: mesmas três listas do smoke test local.

---

## Spec coverage

| Spec requirement | Task |
|------------------|------|
| Três listas + campos | Task 1 |
| Ordenação e empty state | Task 1 |
| Título / UI PT | Task 1–2 |
| Visual legível mobile | Task 2 |
| README + fluxo edit/push | Task 2 |
| GitHub Pages no repo criado | Task 3 |
| Sem Sheets/backend/Vite | Global / todas |
