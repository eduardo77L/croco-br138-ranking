# Croco br138 — Ranking de classificados + disputa

**Data:** 2026-09-07  
**Status:** aguardando revisão  
**Repo:** https://github.com/eduardo77L/croco-br138-ranking  
**Público previsto:** https://eduardo77L.github.io/croco-br138-ranking/

## Objetivo

Publicar uma página web estática, acessível por qualquer pessoa com o link, com três listas de seleção da tribo Croco no mundo br138 (Tribal Wars). Os dados são editados no projeto (arquivo JSON) e publicados via GitHub Pages — sem planilha, sem backend e sem painel de admin.

## Escopo

### Inclui

- Página única com título: **Croco br138 - Ranking de classificados + disputa**
- Três seções: **Classificados**, **Em disputa**, **Aceitar convite**
- Por jogador: **nome**, **quantidade de aldeias**, **oponentes derrotados**
- Fonte de dados: `data.json` (editado no Cursor / no repo)
- Hospedagem: GitHub Pages (repo público já criado)
- README com instruções de edição e publicação

### Fora de escopo

- Sincronização com Google Sheets
- Login / painel de edição no site
- Links automáticos para perfil no jogo
- API, banco de dados ou build tool (Vite, etc.)
- Cópia automática dos dados da planilha atual

## Arquitetura

Site estático na raiz do repositório:

| Arquivo | Responsabilidade |
|---------|------------------|
| `index.html` | Estrutura da página (título + 3 seções) |
| `styles.css` | Layout e estilo |
| `app.js` | Carrega `data.json` e renderiza as tabelas |
| `data.json` | Única fonte de verdade dos jogadores |
| `README.md` | Como editar e publicar |

Fluxo de atualização:

1. Editar `data.json`
2. Commit + push para `main`
3. GitHub Pages atualiza o site (~1 minuto)

Não há servidor próprio. Quem tem o link **vê**; quem tem acesso de escrita no GitHub **edita**.

## Modelo de dados

```json
{
  "atualizadoEm": "2026-09-07",
  "classificados": [
    { "nome": "Jogador", "aldeias": 12, "derrotados": 1087 }
  ],
  "emDisputa": [],
  "aceitarConvite": []
}
```

Regras:

- Chaves das listas: `classificados`, `emDisputa`, `aceitarConvite`
- Campos obrigatórios por entrada: `nome` (string), `aldeias` (número inteiro ≥ 0), `derrotados` (número ≥ 0)
- `atualizadoEm`: data exibida no topo (string `YYYY-MM-DD`)
- Ordenação na tela: por `derrotados` decrescente; empate por `nome` A–Z
- Lista vazia: mensagem “Nenhum jogador nesta lista”
- Entrega inicial: JSON com 2–3 entradas de exemplo; dados reais entram depois por edição manual

## Interface

- Uma composição clara: título da tribo/mundo + data + três tabelas empilhadas
- Colunas: `#` · `Nome` · `Aldeias` · `Oponentes derrotados`
- Numeração `#` = posição após ordenação (1-based)
- Responsivo: tabelas legíveis no desktop e no celular (scroll horizontal se necessário)
- Visual: tipografia expressiva, fundo com atmosfera (não flat branco genérico), identidade de ranking de tribo — sem cards decorativos no hero, sem painel tipo dashboard
- Idioma da UI: português

## Publicação (GitHub Pages)

1. Conteúdo na branch `main`, na raiz `/`
2. Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`
3. URL: `https://eduardo77L.github.io/croco-br138-ranking/`
4. Repo remoto já existente: `https://github.com/eduardo77L/croco-br138-ranking.git`

## Critérios de sucesso

- Qualquer pessoa abre o link e vê as três listas sem login
- Alterar um jogador em `data.json` e dar push atualiza o site
- Página legível em celular
- Não depende do Google Sheets nem do AcidTW

## Riscos / notas

- Dados desatualizados se ninguém der push após editar
- Repo é público: o JSON fica visível no GitHub (aceitável para ranking de tribo)
- `file://` no navegador pode bloquear `fetch` do JSON; validar via Pages ou servidor local simples
