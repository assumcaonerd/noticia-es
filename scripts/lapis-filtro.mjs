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

// Padrão da capa do Garotinho: grafite fiel à foto, com meio-tom do rosto
// e traço fino. Não usar -sketch sozinho (vira rabisco) nem color dodge
// (estoura o branco e apaga o retrato). O traço entra multiplicado sobre
// o cinza da própria foto.
export async function desenharLapis(entrada, saida) {
  await run('convert', [
    entrada, '-auto-orient',
    '-gravity', 'center', '-crop', '92%x90%+0+0', '+repage',
    '-resize', `${LARGURA}x${ALTURA}^`,
    '-gravity', 'center', '-extent', `${LARGURA}x${ALTURA}`,
    '-colorspace', 'Gray',
    '-contrast-stretch', '0.4%x0.4%',
    '(', '+clone', '-sketch', '0x10+30', '-level', '6%,94%', ')',
    '-compose', 'multiply', '-composite',
    '-brightness-contrast', '8x3',
    '-quality', '90',
    saida
  ]);
}
