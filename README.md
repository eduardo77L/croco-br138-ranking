# Croco br138 — Ranking

Site estático com as listas **Classificados**, **Em disputa** e **Aceitar convite** da tribo Croco no mundo br138.

**Link público:** https://eduardo77L.github.io/croco-br138-ranking/

## Regra importante: OD congelado

O campo **`derrotados` (OD) não deve ser atualizado**. Ele ficou travado no valor da primeira coleta.

Nas atualizações seguintes, mudamos **somente `aldeias`**.

Para puxar aldeias novas do br138 sem mexer no OD:

```bash
node scripts/atualizar-aldeias.js
```

Depois: commit + push do `data.json`.

## Como editar a lista

Abra `data.json` e altere as três listas:

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

| Campo | Significado |
|-------|-------------|
| `nome` | Nome no jogo |
| `aldeias` | Quantidade de aldeias (**atualizável**) |
| `derrotados` | Oponentes derrotados / OD (**congelado**) |
| `atualizadoEm` | Data exibida no topo (`YYYY-MM-DD`) |

## Como publicar

1. Salve as alterações em `data.json` (ou rode o script de aldeias)
2. Commit e push na branch `main`
3. Em ~1 minuto o GitHub Pages atualiza o link

## Ligar o GitHub Pages (primeira vez)

1. Abra https://github.com/eduardo77L/croco-br138-ranking/settings/pages
2. **Source:** Deploy from a branch
3. Branch: `main` · pasta: `/ (root)` → **Save**
