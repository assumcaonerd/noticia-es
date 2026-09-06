#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.cwd();
const LOTE_PATH = path.join(RAIZ, 'lote-redacao.json');
const MAX_PUBLICAVEIS = 1;
const MAX_CANDIDATAS_IA = 2;
const MIN_PALAVRAS = 650;
const MODELO = process.env.OLLAMA_MODEL || 'qwen2.5:3b';
const OLLAMA_HOST = process.env.OLLAMA_HOST || 'http://127.0.0.1:11434';

function textoPuro(html = '') {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function contarPalavras(html = '') {
  const t = textoPuro(html);
  return t ? t.split(/\s+/).filter(Boolean).length : 0;
}

function decodificarXml(s = '') {
  return String(s)
    .replace(/^<!\[CDATA\[/, '')
    .replace(/\]\]>$/, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

function extrairTag(bloco, tag) {
  const m = String(bloco).match(new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${tag}>`, 'i'));
  return m ? decodificarXml(m[1]) : '';
}

function normalizarAeo(aeo = {}) {
  if (Array.isArray(aeo)) {
    return aeo
      .filter(x => x?.pergunta && x?.resposta)
      .map(x => ({ pergunta: String(x.pergunta).trim(), resposta: String(x.resposta).trim() }));
  }
  const campos = [
    ['oQueAconteceu', 'O que aconteceu?'],
    ['quemEstaEnvolvido', 'Quem está envolvido?'],
    ['ondeAconteceu', 'Onde aconteceu?'],
    ['quandoAconteceu', 'Quando aconteceu?'],
    ['porQueImporta', 'Por que isso importa?'],
    ['oQueAconteceAgora', 'O que acontece agora?']
  ];
  return campos
    .map(([chave, pergunta]) => ({ pergunta, resposta: String(aeo?.[chave] || '').trim() }))
    .filter(x => x.resposta);
}

function extrairJson(texto) {
  let t = String(texto || '').trim();
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const ini = t.indexOf('{');
  const fim = t.lastIndexOf('}');
  if (ini < 0 || fim <= ini) throw new Error('modelo local não retornou JSON válido');
  return JSON.parse(t.slice(ini, fim + 1));
}

function validarReportagem(r, pauta, fontesAdicionais) {
  if (!r || r.publicar === false) return r?.motivo || 'modelo marcou a pauta como não publicável';
  const titulo = String(r.titulo || '').trim();
  const resumo = String(r.resumo || '').trim();
  const conteudo = String(r.conteudo || '').trim();
  const palavras = contarPalavras(conteudo);
  const paragrafos = (conteudo.match(/<p\b/gi) || []).length;
  const h2 = (conteudo.match(/<h2\b/gi) || []).length;
  const aeo = normalizarAeo(r.aeo);

  if (titulo.length < 20) return 'título insuficiente';
  if (resumo.length < 80) return 'resumo insuficiente';
  if (palavras < MIN_PALAVRAS) return `texto curto: ${palavras} palavras`;
  if (paragrafos < 7) return `estrutura curta: ${paragrafos} parágrafos`;
  if (h2 < 2) return `faltam subtítulos: ${h2}`;
  if (!Array.isArray(fontesAdicionais) || fontesAdicionais.length < 2) return 'menos de duas fontes adicionais encontradas';
  if (aeo.length < 5) return `AEO incompleto: ${aeo.length} respostas`;
  if (/capit[aã]o\s+assum[cç][aã]o/i.test(JSON.stringify(r.aeo || {}))) return 'Capitão Assumção apareceu no AEO, o que está proibido nesta fase';
  if (!/^https:\/\//i.test(String(pauta.urlFonte || ''))) return 'fonte principal inválida';
  return null;
}

async function carregarFontePrincipal(pauta) {
  const url = String(pauta.urlFonte || '');
  if (!/^https:\/\//i.test(url)) return '';
  try {
    const resp = await fetch(url, {
      redirect: 'follow',
      headers: {
        'user-agent': 'Mozilla/5.0 (compatible; NoticiaESBot/1.0; +https://noticiaes.com.br)',
        'accept-language': 'pt-BR,pt;q=0.9,en;q=0.5'
      },
      signal: AbortSignal.timeout(20000)
    });
    if (!resp.ok) return '';
    const html = await resp.text();
    return textoPuro(html).slice(0, 5500);
  } catch {
    return '';
  }
}

async function buscarFontesGoogleNews(titulo) {
  const consulta = String(titulo || '')
    .replace(/\s*[|–—-]\s*(G1|CNN Brasil|Folha|Estadão|UOL|O Globo|Revista Oeste).*$/i, '')
    .trim();
  if (!consulta) return [];

  const url = `https://news.google.com/rss/search?q=${encodeURIComponent(consulta)}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
  try {
    const resp = await fetch(url, {
      headers: { 'user-agent': 'Mozilla/5.0 (compatible; NoticiaESBot/1.0)' },
      signal: AbortSignal.timeout(20000)
    });
    if (!resp.ok) return [];
    const xml = await resp.text();
    const itens = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map(m => m[1]);
    const fontes = [];
    const vistas = new Set();
    for (const item of itens) {
      const tituloItem = textoPuro(extrairTag(item, 'title'));
      const link = extrairTag(item, 'link');
      const fonteNome = textoPuro(extrairTag(item, 'source')) || 'Google News';
      const descricao = textoPuro(extrairTag(item, 'description')).slice(0, 350);
      if (!tituloItem || !/^https:\/\//i.test(link) || vistas.has(link)) continue;
      vistas.add(link);
      fontes.push({ nome: fonteNome, url: link, titulo: tituloItem, resumo: descricao });
      if (fontes.length >= 5) break;
    }
    return fontes;
  } catch {
    return [];
  }
}

let geracoesModelo = 0;
async function chamarOllama(prompt, numPredict = 1150) {
  let ultimoErro = null;
  for (let tentativa = 1; tentativa <= 2; tentativa++) {
    try {
      geracoesModelo++;
      const resp = await fetch(`${OLLAMA_HOST}/api/generate`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          model: MODELO,
          prompt,
          stream: false,
          format: 'json',
          keep_alive: '10m',
          options: {
            temperature: 0.15,
            num_ctx: 4096,
            num_predict: numPredict
          }
        }),
        signal: AbortSignal.timeout(420000)
      });
      const data = await resp.json().catch(() => ({}));
      if (!resp.ok) throw new Error(`Ollama ${resp.status}: ${data?.error || 'erro desconhecido'}`);
      if (!data?.response) throw new Error('Ollama retornou resposta vazia');
      return extrairJson(data.response);
    } catch (erro) {
      ultimoErro = erro;
      if (tentativa < 2) {
        console.warn(`[reapuracao-local] Ollama falhou na tentativa ${tentativa}; repetindo uma vez: ${erro.message}`);
        await new Promise(r => setTimeout(r, 2500));
      }
    }
  }
  throw ultimoErro || new Error('falha desconhecida no Ollama');
}

function dossieBase(pauta, textoPrincipal, adicionais) {
  const dossieFontes = adicionais.map((f, i) =>
    `FONTE ADICIONAL ${i + 1}\nVeículo: ${f.nome}\nTítulo: ${f.titulo}\nURL: ${f.url}\nResumo disponível: ${f.resumo || 'sem resumo'}`
  ).join('\n\n');

  return `PAUTA\nTítulo coletado: ${pauta.titulo || ''}\nCategoria: ${pauta.categoria || ''}\nFonte principal: ${pauta.fonteNome || ''}\nURL principal: ${pauta.urlFonte || ''}\nResumo coletado: ${pauta.resumoFonte || ''}\nData da fonte: ${pauta.dataFonte || ''}\n\nTEXTO EXTRAÍDO DA FONTE PRINCIPAL\n${textoPrincipal || '[A página principal não pôde ser extraída. Use somente o resumo e as confirmações adicionais.]'}\n\nFONTES ADICIONAIS\n${dossieFontes}`;
}

async function reapurarLocal(pauta) {
  const [textoPrincipal, fontesBusca] = await Promise.all([
    carregarFontePrincipal(pauta),
    buscarFontesGoogleNews(pauta.titulo)
  ]);

  const adicionais = fontesBusca
    .filter(f => f.url !== pauta.urlFonte)
    .slice(0, 4);

  if (adicionais.length < 2) {
    throw new Error(`reapuração local encontrou apenas ${adicionais.length} fonte(s) adicional(is)`);
  }

  const base = dossieBase(pauta, textoPrincipal, adicionais);
  const regras = `Use SOMENTE fatos sustentados pelo dossiê. Não invente nomes, números, datas, cargos, falas, causas, antecedentes ou consequências. Não crie citações entre aspas. Não copie trechos extensos. Trate alegação como alegação e investigação como investigação. Se não houver base factual suficiente para o bloco pedido, retorne publicar:false.`;

  const parte1 = await chamarOllama(`Você é redator factual do portal Notícia ES.\n${regras}\n\n${base}\n\nProduza a ABERTURA da reportagem com 230 a 300 palavras. Faça lead 5W+1H e desenvolva os fatos confirmados em pelo menos 3 parágrafos HTML <p>. Não use <h2> nesta parte. Crie também título, resumo de pelo menos 80 caracteres, entidades e AEO factual.\n\nRetorne SOMENTE JSON válido:\n{"publicar":true,"titulo":"...","resumo":"...","bloco":"<p>...</p><p>...</p><p>...</p>","entidades":[{"nome":"...","tipo":"Person|Organization|Place|Event|PoliticalParty|GovernmentOrganization"}],"aeo":{"oQueAconteceu":"...","quemEstaEnvolvido":"...","ondeAconteceu":"...","quandoAconteceu":"...","porQueImporta":"...","oQueAconteceAgora":"..."}}\nSe insuficiente: {"publicar":false,"motivo":"..."}`);

  if (parte1?.publicar === false) return { obj: parte1, adicionais, textoPrincipalDisponivel: Boolean(textoPrincipal) };

  const parte2 = await chamarOllama(`Você é redator factual do portal Notícia ES.\n${regras}\n\n${base}\n\nTítulo já definido: ${parte1.titulo || pauta.titulo}\nAbertura já escrita, não repita seu conteúdo: ${textoPuro(parte1.bloco || '').slice(0, 1400)}\n\nProduza SOMENTE o bloco de CONTEXTO E ANTECEDENTES, com 230 a 300 palavras. Comece com um <h2> informativo e escreva pelo menos 3 parágrafos <p>. Acrescente apenas contexto sustentado pelo dossiê. Evite repetir a abertura.\n\nRetorne SOMENTE JSON válido: {"publicar":true,"bloco":"<h2>...</h2><p>...</p><p>...</p><p>...</p>"}\nSe insuficiente: {"publicar":false,"motivo":"..."}`);

  if (parte2?.publicar === false) return { obj: parte2, adicionais, textoPrincipalDisponivel: Boolean(textoPrincipal) };

  const parte3 = await chamarOllama(`Você é redator factual do portal Notícia ES.\n${regras}\n\n${base}\n\nTítulo: ${parte1.titulo || pauta.titulo}\nO texto já cobriu a abertura e o contexto. Não repita esses trechos.\n\nProduza SOMENTE o bloco final, com 230 a 300 palavras, tratando desdobramentos, providências, situação atual e próximos passos APENAS quando sustentados pelas fontes. Comece com outro <h2> informativo e escreva pelo menos 3 parágrafos <p>. Se não houver próximos passos confirmados, aprofunde apenas implicações factuais já presentes no dossiê, sem especular.\n\nRetorne SOMENTE JSON válido: {"publicar":true,"bloco":"<h2>...</h2><p>...</p><p>...</p><p>...</p>"}\nSe insuficiente: {"publicar":false,"motivo":"..."}`);

  if (parte3?.publicar === false) return { obj: parte3, adicionais, textoPrincipalDisponivel: Boolean(textoPrincipal) };

  let conteudo = `${String(parte1.bloco || '').trim()}${String(parte2.bloco || '').trim()}${String(parte3.bloco || '').trim()}`;
  let palavras = contarPalavras(conteudo);

  if (palavras < MIN_PALAVRAS) {
    const complemento = await chamarOllama(`Você é redator factual do portal Notícia ES.\n${regras}\n\n${base}\n\nA reportagem já tem ${palavras} palavras e precisa ultrapassar 650 sem repetição nem invenção. Produza um complemento factual de 160 a 220 palavras com 2 ou 3 parágrafos <p>, usando apenas informações do dossiê que ainda possam ser explicadas ou contextualizadas. Não use novo <h2>.\n\nRetorne SOMENTE JSON válido: {"publicar":true,"bloco":"<p>...</p><p>...</p>"}\nSe não houver material factual suficiente: {"publicar":false,"motivo":"..."}`, 900);
    if (complemento?.publicar !== false) conteudo += String(complemento.bloco || '').trim();
    palavras = contarPalavras(conteudo);
  }

  console.log(`[reapuracao-local] montagem em blocos: ${palavras} palavras`);
  const obj = {
    publicar: true,
    titulo: String(parte1.titulo || '').trim(),
    resumo: String(parte1.resumo || '').trim(),
    conteudo,
    entidades: Array.isArray(parte1.entidades) ? parte1.entidades : [],
    aeo: parte1.aeo || {}
  };

  return { obj, adicionais: adicionais.slice(0, 3), textoPrincipalDisponivel: Boolean(textoPrincipal) };
}

const lote = JSON.parse(await fs.readFile(LOTE_PATH, 'utf8'));
const candidatas = Array.isArray(lote?.candidatas) ? lote.candidatas : [];
if (!candidatas.length) {
  console.log('[reapuracao-local] Nenhuma candidata no lote.');
  process.exit(0);
}

let produzidas = 0;
let rejeitadas = 0;
let errosTecnicos = 0;
let chamadasIa = 0;
const processadas = [];

for (const pauta of candidatas) {
  if (produzidas >= MAX_PUBLICAVEIS || chamadasIa >= MAX_CANDIDATAS_IA) {
    processadas.push(pauta);
    continue;
  }

  try {
    console.log(`[reapuracao-local] processando ${pauta.id}: ${pauta.titulo}`);
    chamadasIa++;
    const { obj: r, adicionais, textoPrincipalDisponivel } = await reapurarLocal(pauta);
    const motivo = validarReportagem(r, pauta, adicionais);
    if (motivo) {
      rejeitadas++;
      console.warn(`[reapuracao-local] rejeita ${pauta.id}: ${motivo}`);
      processadas.push({ ...pauta, reportagem: undefined, rejeicaoEditorial: motivo });
      continue;
    }

    const reportagem = {
      titulo: String(r.titulo).trim(),
      resumo: String(r.resumo).trim(),
      conteudo: String(r.conteudo).trim(),
      categoria: pauta.categoria,
      imagem: pauta.imagem,
      fonteNome: String(pauta.fonteNome || 'Fonte principal').trim(),
      fonteUrl: String(pauta.urlFonte || '').trim(),
      fontesAdicionais: adicionais.map(f => ({ nome: f.nome, url: f.url })),
      entidades: Array.isArray(r.entidades) ? r.entidades.slice(0, 20) : [],
      aeo: normalizarAeo(r.aeo),
      reapuração: {
        provedor: 'Ollama local',
        modelo: MODELO,
        estratégia: 'redação em blocos',
        busca: 'Google News RSS',
        fontesAdicionais: adicionais.length,
        fontePrincipalExtraida: textoPrincipalDisponivel
      }
    };

    processadas.push({ ...pauta, reportagem });
    produzidas++;
    console.log(`[reapuracao-local] pronta ${pauta.id}: ${contarPalavras(reportagem.conteudo)} palavras; ${adicionais.length} fontes adicionais`);
  } catch (erro) {
    errosTecnicos++;
    console.error(`[reapuracao-local] erro técnico ${pauta.id}: ${erro.message}`);
    processadas.push({ ...pauta, reportagem: undefined, erroReapuracao: erro.message });
  }
}

const saida = {
  ...lote,
  reapuradoEm: new Date().toISOString(),
  diagnosticoReapuracao: {
    candidatas: candidatas.length,
    produzidas,
    rejeitadas,
    errosTecnicos,
    chamadasIa,
    geracoesModelo,
    modelo: MODELO,
    provedor: 'Ollama local',
    estrategia: 'redação em blocos'
  },
  candidatas: processadas
};

await fs.writeFile(LOTE_PATH, JSON.stringify(saida, null, 2) + '\n', 'utf8');
console.log(`[reapuracao-local] ${produzidas} reportagem(ns) completas; ${rejeitadas} rejeitada(s); ${errosTecnicos} erro(s) técnico(s); ${geracoesModelo} geração(ões) local(is).`);

if (produzidas === 0 && chamadasIa > 0 && errosTecnicos >= chamadasIa) {
  console.error('[reapuracao-local] FALHA EDITORIAL: nenhuma reportagem foi produzida por falha técnica.');
  process.exit(3);
}
