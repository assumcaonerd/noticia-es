#!/usr/bin/env node
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.cwd();
const DESTINO = path.join(RAIZ, 'imagens', 'lapis');
const ITENS = [
  { slug: 'a-parabola-politica-de-paulo-hartung', fonte: 'https://netdeal.com.br/api/images/proxy?quality=100&width=1200&src=https://www.netdeal.com.br/api/images/producao.spayce.com.br/1790715482537_paulo_hartung_e_evair.png' },
  { slug: 'governo-vai-cobrar-bancos-para-rastrear-operacoes-ilegais-e-apertar-cerco-contra-divulgaca', fonte: 'https://s2-oglobo.glbimg.com/A30CISCjHaE9HUH6s5UQ_VeRUO8=/1920x0/filters:format(jpeg)/https://i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2026/C/g/IQHy78TtGfVGCjXbwPPg/whatsapp-image-2026-09-25-at-18.15.02.jpeg' },
  { slug: 'tse-barra-forum-ligado-ao-vox-e-outros-14-como-observadores-eleitorais', fonte: 'https://admin.cnnbrasil.com.br/wp-content/uploads/sites/12/2026/08/55351371746_6789c8ae78_o-e1786707334110.jpg?w=1200&h=630&crop=1' },
  { slug: 'antigo-iapi-sera-convertido-em-100-moradias-no-centro-de-vitoria', fonte: 'https://files.ndeal.app/api/images/proxy?quality=100&src=https%3A%2F%2Fwww.netdeal.com.br%2Fapi%2Fimages%2Fproducao.spayce.com.br%2F1781796565920_dsc_6031.jpg' }
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
const tmp = path.join(RAIZ, '.tmp-capas-lapis-4');
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
    entrada, '-auto-orient',
    '-resize', '1200x630^',
    '-gravity', 'center', '-extent', '1200x630',
    '-colorspace', 'Gray',
    '-sketch', '0x20+120',
    '-contrast-stretch', '1%x1%',
    '-brightness-contrast', '6x10',
    '-unsharp', '0x0.8+0.7+0',
    '-quality', '88',
    saida
  ]);
  console.log('[capas-4] ' + item.slug + '.jpg');
}
await fs.rm(tmp, { recursive: true, force: true });
