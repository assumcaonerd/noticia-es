import { spawn } from 'node:child_process';

export const LARGURA = 1200;
export const ALTURA = 630;

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let err = '';
    child.stderr.on('data', (b) => { err += b.toString(); });
    child.on('error', reject);
    child.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${cmd} saiu ${code}: ${err.slice(0, 400)}`));
    });
  });
}

// Grafite fiel à foto. O filtro -sketch 0x32 do ImageMagick desenhava
// hachura solta e apagava rosto, cenário e enquadramento. Color dodge
// com desfoque curto preserva o retrato e padroniza todas as capas.
export async function desenharLapis(entrada, saida) {
  await run('convert', [
    entrada, '-auto-orient',
    '-gravity', 'center', '-crop', '92%x90%+0+0', '+repage',
    '-resize', `${LARGURA}x${ALTURA}^`,
    '-gravity', 'center', '-extent', `${LARGURA}x${ALTURA}`,
    '-colorspace', 'Gray',
    '-contrast-stretch', '0.6%x0.6%',
    '(', '+clone', '-negate', '-blur', '0x4.2', ')',
    '-compose', 'colordodge', '-composite',
    '-contrast-stretch', '1%x1%',
    '-brightness-contrast', '2x16',
    '-quality', '90',
    saida
  ]);
}
