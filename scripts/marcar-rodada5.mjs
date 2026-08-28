import fs from 'node:fs/promises';
const arquivo='pautas.json';
const dados=JSON.parse(await fs.readFile(arquivo,'utf8'));
const agora=new Date().toISOString();
const mapa={
'b3f8a8fd23e14397':'presidenciaveis-quinta-sabatinas-lula-flavio-globo-campanha-2026',
'ceb3868fbeb99d30':'prisao-castelo-dez-anos-desacato-desobediencia-pm'
};
let alteradas=0;
for(const p of dados.pautas||[]){if(mapa[p.id]&&p.status!=='publicada'){p.status='publicada';p.slugPublicado=mapa[p.id];p.publicadaEm=agora;alteradas++;}}
dados.atualizadoEm=agora;
await fs.writeFile(arquivo,JSON.stringify(dados,null,2)+'\n');
console.log(`Pautas marcadas: ${alteradas}`);
