/* EBD da Igreja Cristã Maranata, 6 de setembro de 2026. */
(function(){
if(typeof noticias==='undefined'||!Array.isArray(noticias)) return;
const materia={
id:202609060001,
slug:'ebd-maranata-porta-estreita-casa-sobre-a-rocha-6-setembro-2026',
titulo:'Escola Bíblica Dominical da Maranata destaca a porta estreita e a casa sobre a Rocha',
categoria:'Fé e Sociedade',
data:'2026-09-06',
publicadoEm:'2026-09-06T22:23:00-03:00',
imagem:'https://i.ibb.co/HTbSMRdm/image.png',
legendaImagem:'Pastores Wallace Rozetti, Douglas Panghero, Alexandre Gueiros, Gilson Sousa e Gerson Belutti ao término da Escola Bíblica Dominical de 06/09/26',
resumo:'Aula transmitida neste domingo (6) reuniu os pastores Douglas Spanghero, Gerson Beluci e Alexandre Gueiros em um estudo do final do Sermão da Montanha, com ênfase em salvação, discernimento, santificação e obediência à Palavra.',
conteudo:'<p>A Escola Bíblica Dominical de 6 de setembro de 2026 estudou o final do Sermão da Montanha, em Mateus 7, com ensinamentos sobre a porta estreita, os frutos espirituais e a casa edificada sobre a Rocha.</p>',
autor:'Redação Notícia ES',
manual:true,
secaoEspecial:true
};
const i=noticias.findIndex(n=>n.slug===materia.slug); if(i>=0) noticias[i]=materia; else noticias.unshift(materia);
})();