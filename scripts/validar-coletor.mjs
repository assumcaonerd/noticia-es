import fs from 'node:fs/promises';

function exigir(condicao, mensagem) {
  if (!condicao) throw new Error(mensagem);
}

async function ler(caminho) {
  return fs.readFile(caminho, 'utf8');
}

const [coletor, resolvedor, pautasTexto, workflow] = await Promise.all([
  ler('scripts/coletar-pautas.mjs'),
  ler('scripts/resolver-imagem.mjs'),
  ler('pautas.json'),
  ler('.github/workflows/atualizar-noticias.yml')
]);

let pautas;
try {
  pautas = JSON.parse(pautasTexto);
} catch (erro) {
  throw new Error(`pautas.json inválido: ${erro.message}`);
}

exigir(Array.isArray(pautas.pautas), 'pautas.json precisa conter um array em "pautas".');
exigir(!/eshoje\.com\.br|ES Hoje - Capa/i.test(coletor), 'ES Hoje reapareceu no coletor principal.');
exigir(/const\s+saida\s*=\s*\{/.test(coletor), 'Objeto "saida" não foi encontrado no coletor.');
exigir(/writeFile\(\s*ARQUIVO_PAUTAS/.test(coletor), 'Gravação de pautas.json não foi encontrada.');
exigir(/writeFile\(\s*ARQUIVO_STATUS/.test(coletor), 'Gravação de motor-status.json não foi encontrada.');
exigir(/principal\(\)\.catch/.test(coletor), 'Tratamento de erro da função principal não foi encontrado.');
exigir(/resolverImagem/.test(coletor), 'Integração com resolverImagem não foi encontrada no coletor.');
exigir(/export\s+async\s+function\s+resolverImagem/.test(resolvedor), 'Export de resolverImagem não foi encontrado.');
exigir(!/node\s+scripts\/reparar-coletor\.mjs/.test(workflow), 'O autorreparo destrutivo voltou ao workflow.');
exigir(!/scripts\/coletar-pautas\.mjs\s+scripts\/resolver-imagem\.mjs/.test(workflow), 'O workflow voltou a preparar scripts de produção para commit automático.');

console.log(`Validação concluída: ${pautas.pautas.length} pauta(s) no arquivo; estrutura do coletor íntegra; autorreparo desativado.`);
