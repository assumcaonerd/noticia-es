#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.cwd();
const DESTINO = path.join(RAIZ, 'imagens', 'lapis');

const ITENS = [
  { slug: 'historico-de-escandalos-e-noticias-a-conta-gotas-levam-eleitor-a-associar-esquerda-ao-mast', fonte: 'https://f.i.uol.com.br/fotografia/2026/03/11/177325580269b1bc7a23521_1773255802_3x2_rt.jpg' },
  { slug: 'opiniao-gabriel-casalecchi-e-victor-coelho-evangelicos-votam-a-direita-mesmo-sem-indicacao', fonte: 'https://f.i.uol.com.br/fotografia/2026/09/29/17907189616abc33f1b6b3b_1790718961_3x2_rt.jpg' },
  { slug: 'lula-liga-ao-vivo-para-dino-do-stf-e-e-questionado-por-flavio-bolsonaro', fonte: 'https://f.i.uol.com.br/fotografia/2026/09/30/17907427316abc90cb7b647_1790742731_3x2_rt.jpg' },
  { slug: 'opiniao-marcos-augusto-goncalves-anarquia-que-corroi-stf-nao-vai-acabar-antes-da-eleicao', fonte: 'https://f.i.uol.com.br/fotografia/2026/08/14/17867290446a7f52548820c_1786729044_3x2_rt.jpg' },
  { slug: 'candidatos-ao-governo-do-es-sobem-o-tom-em-ultimo-debate-antes-das-eleicoes', fonte: 'https://netdeal.com.br/api/images/proxy?quality=100&width=1200&src=https://www.netdeal.com.br/api/images/producao.spayce.com.br/1790735873182_dsc08292.jpg' },
  { slug: 'quem-esta-de-verdade-na-disputa-pela-camara-dos-deputados-no-es-atualizado', fonte: 'https://netdeal.com.br/api/images/proxy?quality=100&width=1200&src=https://www.netdeal.com.br/api/images/producao.spayce.com.br/1790607374382_2019_11_01_3rhbhhitd42.png' }
];

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let err = '';
    p.stderr.on('data', b => { err += b.toString(); });
    p.on('error', reject);
    p.on('close', code => code === 0 ? resolve() : reject(new Error(`${cmd} saiu ${code}: ${err.slice(0,500)}`)));
  });
}

await fs.mkdir(DESTINO, { recursive: true });
const tmp = path.join(RAIZ, '.tmp-capas-lapis-6');
await fs.mkdir(tmp, { recursive: true });

for (const item of ITENS) {
  const entrada = path.join(tmp, item.slug + '.orig');
  const saida = path.join(DESTINO, item.slug + '.jpg');
  const res = await fetch(item.fonte, {
    redirect: 'follow',
    headers: { 'user-agent': 'Mozilla/5.0 NoticiaESBot/2.6 (+https://noticiaes.com.br)' },
    signal: AbortSignal.timeout(30000)
  });
  if (!res.ok) throw new Error(`${item.slug}: HTTP ${res.status}`);
  await fs.writeFile(entrada, Buffer.from(await res.arrayBuffer()));
  await run('convert', [
    entrada,
    '-auto-orient',
    '-resize', '1200x630^',
    '-gravity', 'center',
    '-extent', '1200x630',
    '-colorspace', 'Gray',
    '-sketch', '0x20+120',
    '-contrast-stretch', '1%x1%',
    '-brightness-contrast', '6x10',
    '-unsharp', '0x0.8+0.7+0',
    '-quality', '88',
    saida
  ]);
  console.log('[capas-6] ' + item.slug + '.jpg');
}
await fs.rm(tmp, { recursive: true, force: true });
