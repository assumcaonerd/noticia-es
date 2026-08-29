import fs from 'node:fs/promises';

const arquivo = new URL('../pautas.json', import.meta.url);
const dados = JSON.parse(await fs.readFile(arquivo, 'utf8'));
const agora = new Date().toISOString();
const publicadas = new Map([
  ['51970d7c56b30607', 'flavio-lidera-lula-no-es-quaest-34-a-29-empate-tecnico'],
  ['d553cd035abffead', 'ricardo-ferraco-lidera-e-venceria-segundo-turno-no-es-quaest'],
  ['2980f76f6b342905', 'golpe-audios-voz-amigas-serra-invade-celulares-pix'],
  ['f53bb40a057dbc99', 'tre-rj-rejeita-denuncia-crivella-qg-propina-senado-2026'],
  ['61cad3b13e5d93a8', 'pec-fim-escala-6x1-relatorio-favoravel-ccj-senado'],
  ['8e8ca6451691d7b6', 'dupla-presa-furto-cabos-alta-tensao-bento-ferreira-vitoria'],
  ['f7e86b04c221f172', 'professor-fabian-senado-es-educacao-seguranca-psol-2026'],
  ['031c4f772d1247af', 'tse-forcas-federais-cinco-estados-eleicoes-2026'],
  ['11effe998561c3b8', 'mapa-estadual-pl-psd-mdb-governos-eleicoes-2026'],
  ['ceb3868fbeb99d30', 'condenado-desacato-desobediencia-preso-dez-anos-depois-castelo'],
  ['f16c9ccbc83be345', 'mulher-ferida-garrafas-briga-cruzeiro-do-sul-cariacica'],
  ['d52ab59096910dc0', 'augusto-cury-cresce-nas-redes-apos-debate-avante-busca-espaco-fora-polarizacao'],
  ['a4437bb8bc7d2d57', 'manifesto-mulheres-negras-eleicoes-2026-representacao-orcamento-violencia'],
  ['26e847d31bf136d1', 'sabatina-lula-divida-publica-investigacoes-campanha-2026'],
  ['542a5a1cfee9ac73', 'antonio-gobbi-morte-canal-vitoria-investigacao-tentativas-bancarias'],
  ['b3f8a8fd23e14397', 'flavio-estreia-tv-voto-feminino-lula-ataques-eleicoes-2026']
]);

let alterou = false;
for (const pauta of dados.pautas || []) {
  const slug = publicadas.get(pauta.id);
  if (!slug) continue;
  if (pauta.status === 'publicada' && pauta.slugPublicado === slug && pauta.publicadaEm) continue;
  pauta.status = 'publicada';
  pauta.slugPublicado = slug;
  pauta.publicadaEm = pauta.publicadaEm || agora;
  alterou = true;
}

if (alterou) {
  dados.atualizadoEm = agora;
  await fs.writeFile(arquivo, JSON.stringify(dados, null, 2) + '\n', 'utf8');
}
