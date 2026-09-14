import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const DIR = path.join(ROOT, 'redacao-pronta');

function fail(msg) {
  console.error(`[redacao-pronta] ERRO: ${msg}`);
  process.exitCode = 1;
}

function texto(p) {
  return fs.readFileSync(path.join(ROOT, p), 'utf8');
}

function normaliza(s='') {
  return String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
}

function extraiObjetosJS(codigo, arquivo) {
  const sandbox = { window: {}, console: { log(){}, warn(){}, error(){} } };
  vm.createContext(sandbox);
  try {
    vm.runInContext(codigo, sandbox, { filename: arquivo, timeout: 1500 });
  } catch (e) {
    throw new Error(`${arquivo}: JS inválido ou não executável: ${e.message}`);
  }
  const candidatos = [];
  for (const [k,v] of Object.entries(sandbox)) if (Array.isArray(v)) candidatos.push(v);
  for (const [k,v] of Object.entries(sandbox.window || {})) if (Array.isArray(v)) candidatos.push(v);
  return candidatos.sort((a,b)=>b.length-a.length)[0] || [];
}

function imagensInvalidas(url='') {
  const u = String(url).toLowerCase();
  return !/^https?:\/\//.test(u) || u.includes('placeholder') || u.includes('fallback') || u.includes('/logo') || u.includes('logo.') || u.includes('auto-') && u.endsWith('.svg') || u.endsWith('.svg');
}

const manifest = fs.existsSync(path.join(ROOT,'auto-manifest.js')) ? texto('auto-manifest.js') : '';
const shards = [...manifest.matchAll(/["']([^"']+\.js)["']/g)].map(m=>m[1]).filter(x=>x.includes('auto-redacao-') || x.includes('editorial'));
const publicados = [];
for (const p of ['noticias.js', ...shards]) {
  if (!fs.existsSync(path.join(ROOT,p))) continue;
  const src = texto(p);
  for (const m of src.matchAll(/slug\s*:\s*["']([^"']+)["']/g)) publicados.push(m[1]);
}
const slugsPublicados = new Set(publicados);

if (!fs.existsSync(DIR)) {
  console.log('[redacao-pronta] Diretório ainda não existe. Nada para validar.');
  process.exit(0);
}

const arquivos = fs.readdirSync(DIR).filter(f=>/^rodada-.*\.js$/.test(f)).sort();
if (!arquivos.length) {
  console.log('[redacao-pronta] Nenhuma rodada preparada.');
  process.exit(0);
}

for (const arquivo of arquivos) {
  const codigo = fs.readFileSync(path.join(DIR,arquivo),'utf8');
  let materias = [];
  try { materias = extraiObjetosJS(codigo, arquivo); } catch(e) { fail(e.message); continue; }
  if (!materias.length) { fail(`${arquivo}: nenhuma matéria encontrada`); continue; }
  if (materias.length > 10) fail(`${arquivo}: contém ${materias.length} matérias; máximo é 10`);

  const vistos = new Set();
  for (const [i,m] of materias.entries()) {
    const pref = `${arquivo} #${i+1}`;
    for (const campo of ['pautaId','slug','titulo','categoria','imagem','resumo','conteudo','autor','fonteNome','fonteUrl','fontesAdicionais','preparadoEm']) {
      if (m[campo] === undefined || m[campo] === null || m[campo] === '') fail(`${pref}: falta ${campo}`);
    }
    if (m.autor !== 'Redação Notícia ES') fail(`${pref}: autor inválido`);
    if (m.status !== 'pronta') fail(`${pref}: status deve ser 'pronta'`);
    if (m.publicadoEm != null) fail(`${pref}: publicadoEm deve permanecer null antes da ordem de publicação`);
    if (imagensInvalidas(m.imagem)) fail(`${pref}: imagem rejeitada pela política editorial`);
    if (String(m.conteudo||'').replace(/<[^>]+>/g,' ').trim().length < 2500) fail(`${pref}: reportagem curta demais`);
    if (!Array.isArray(m.fontesAdicionais) || m.fontesAdicionais.length < 1) fail(`${pref}: fontesAdicionais insuficientes`);
    if (slugsPublicados.has(m.slug)) fail(`${pref}: slug já publicado: ${m.slug}`);
    if (vistos.has(m.slug)) fail(`${pref}: slug duplicado na própria rodada`);
    vistos.add(m.slug);
  }
  console.log(`[redacao-pronta] OK: ${arquivo} com ${materias.length} matéria(s) prontas e NÃO publicadas.`);
}

if (process.exitCode) process.exit(process.exitCode);
