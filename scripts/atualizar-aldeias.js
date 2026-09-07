/**
 * Atualiza SÓ a quantidade de aldeias a partir do player.txt do br138.
 * OD (derrotados) fica congelado — nunca é sobrescrito.
 *
 * Uso:
 *   node scripts/atualizar-aldeias.js
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.join(__dirname, '..');
const DATA = path.join(ROOT, 'data.json');
const PLAYER_URL = 'https://br138.tribalwars.com.br/map/player.txt';

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode} em ${url}`));
          res.resume();
          return;
        }
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
      })
      .on('error', reject);
  });
}

function loadPlayers(text) {
  const byName = new Map();
  for (const line of text.trim().split(/\n/)) {
    if (!line) continue;
    const [id, nameEnc, , villages] = line.split(',');
    const nome = decodeURIComponent(nameEnc.replace(/\+/g, ' '));
    byName.set(nome.toLowerCase(), { id, nome, aldeias: Number(villages) });
  }
  return byName;
}

function hoje() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

async function main() {
  const data = JSON.parse(fs.readFileSync(DATA, 'utf8'));
  const players = loadPlayers(await fetchText(PLAYER_URL));
  const listas = ['classificados', 'emDisputa', 'aceitarConvite'];
  let updated = 0;
  const missing = [];

  for (const key of listas) {
    for (const row of data[key] || []) {
      const hit = players.get(String(row.nome).toLowerCase());
      if (!hit) {
        missing.push(`${key}: ${row.nome}`);
        continue;
      }
      if (row.aldeias !== hit.aldeias) {
        row.aldeias = hit.aldeias;
        updated += 1;
      }
      // derrotados intocado de propósito
    }
  }

  data.atualizadoEm = hoje();
  fs.writeFileSync(DATA, JSON.stringify(data, null, 2) + '\n');
  console.log(`Aldeias atualizadas: ${updated}`);
  console.log(`OD congelado (não alterado).`);
  if (missing.length) {
    console.log(`Não encontrados no mundo (${missing.length}):`);
    for (const m of missing) console.log(`  - ${m}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
