const fs=require('fs'), path=require('path'), vm=require('vm');
const root=path.resolve(__dirname,'..'), dir=path.join(root,'m');
fs.mkdirSync(dir,{recursive:true});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const manifest=fs.readFileSync(path.join(root,'auto-manifest.js'),'utf8');
let made=0,errors=0;
for(const match of manifest.matchAll(/["'](auto-redacao-[a-zA-Z0-9-]+\.js)["']/g)){
 const file=match[1],source=path.join(root,file);if(!fs.existsSync(source))continue;
 const js=fs.readFileSync(source,'utf8'),variable=js.match(/\bconst\s+(noticiasAuto\w+)\s*=/)?.[1];if(!variable)continue;
 let articles;
 try{const box={noticias:[],window:{noticiasAuto:[]},document:{write(){},querySelector(){return null;},querySelectorAll(){return [];},getElementById(){return null;}}};box.window.window=box.window;box.window.document=box.document;vm.runInNewContext(js+';globalThis.exported='+variable+';',box,{timeout:5000,filename:file});articles=box.exported;}catch(e){console.warn('[miniaturas] arquivo ignorado:',file,e.message);errors++;continue;}
 for(const n of articles||[]){
  const slug=String(n.slug||'');if(!/^[a-z0-9][a-z0-9-]*$/.test(slug))continue;
  const dest=path.join(dir,slug+'.html');
  // Recria a pagina afetada para corrigir metadados antigos ja publicados.
  if(fs.existsSync(dest) && slug!=='amp-quot-foi-o-vento-bolsonarista-amp-quot-diz-casagrande-sobre-vit-amp-oacute-ria-de-pazo')continue;
  const title=esc(n.titulo||'Notícia ES'),desc=esc(n.resumo||''),url='https://noticiaes.com.br/m/'+slug+'.html';
  let img='';try{img=new URL(n.imagem||'/assets/og/noticia-es-miniatura.png.png','https://noticiaes.com.br/').href;}catch{}
  if(!img.startsWith('https://'))img='';
  img=esc(img);
  const pub=esc(n.publicadoEm||n.data||''),cat=esc(n.categoria||'Notícias'),author=esc(n.autor||'Redação Notícia ES');
  const meta=(property,value)=>'<meta property="'+property+'" content="'+value+'">';
  const tw=(name,value)=>'<meta name="'+name+'" content="'+value+'">';
  const html=['<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">',
   '<title>'+title+' | Notícia ES</title>',tw('description',desc),tw('robots','index,follow,max-image-preview:large'),
   '<link rel="canonical" href="'+url+'">',
   meta('og:type','article'),meta('og:locale','pt_BR'),meta('og:site_name','Notícia ES'),
   meta('og:title',title),meta('og:description',desc),meta('og:url',url),
   meta('og:image',img),meta('og:image:secure_url',img),meta('og:image:alt',title),
   meta('article:published_time',pub),tw('twitter:card','summary_large_image'),
   tw('twitter:title',title),tw('twitter:description',desc),tw('twitter:image',img),
   '<link rel="stylesheet" href="../estilo.css"></head><body data-pagina="materia">',
   '<header class="site-header"><div class="container header-inner"><a class="logo" href="../index.html">Notícia <span>ES</span></a></div></header>',
   '<main class="materia"><article class="materia-wrap" style="max-width:900px;margin:32px auto;padding:0 18px">',
   '<header class="materia-header"><span class="chapeu">'+cat+'</span><h1>'+title+'</h1><p>'+desc+'</p><div class="meta">'+pub+' · '+author+'</div></header>',
   img?'<figure><img src="'+img+'" alt="'+title+'" style="max-width:100%;height:auto"></figure>':'',
   '<div class="conteudo-materia">'+(n.conteudo||'')+'</div></article></main>',
   '<footer class="site-footer"><div class="container"><a href="../index.html">Notícia ES</a></div></footer>',
   '<script src="../share-bar.js?v=20261022"></script></body></html>'].join('\n');
  fs.writeFileSync(dest,html);made++;
 }
}
console.log('Paginas geradas: '+made+'; erros: '+errors);
if(errors)console.warn('[miniaturas] '+errors+' arquivo(s) antigos invalidos foram ignorados.');
if(errors && made===0 && !fs.readdirSync(dir).some(f=>f.endsWith('.html')))process.exitCode=1;

// Atualizacao para disparar a primeira geracao.
