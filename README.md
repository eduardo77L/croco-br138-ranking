# Croco br138 — Ranking

Site estático com as listas **Classificados**, **Em disputa** e **Aceitar convite** da tribo Croco no mundo br138.

**Link público:** https://eduardo77L.github.io/croco-br138-ranking/

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
| `aldeias` | Quantidade de aldeias |
| `derrotados` | Oponentes derrotados (OD) |
| `atualizadoEm` | Data exibida no topo (`YYYY-MM-DD`) |

A página ordena cada lista por oponentes derrotados (maior primeiro).

## Como publicar

1. Salve as alterações em `data.json`
2. Commit e push na branch `main`
3. Em ~1 minuto o GitHub Pages atualiza o link

## Ligar o GitHub Pages (primeira vez)

1. Abra https://github.com/eduardo77L/croco-br138-ranking/settings/pages
2. **Source:** Deploy from a branch
3. Branch: `main` · pasta: `/ (root)` → **Save**
