#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const RAIZ = process.cwd();
const LOTE_PATH = path.join(RAIZ, 'lote-redacao.json');
const MAX_PUBLICAVEIS = 10;
const MIN_PALAVRAS = 650;
const MODELO = process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-6';
const API_KEY = process.env.ANTHROPIC_API_KEY || '';

function textoPuro(html = '') {
  return String(html)
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function contarPalavras(html = '') {
  const t = textoPuro(html);
  return t ? t.split(/\s+/).filter(Boolean).length : 0;
}

function extrairTextoResposta(data) {
  return (Array.isArray(data?.content) ? data.content : [])
    .filter((bloco) => bloco?.type === 'text' && typeof bloco.text === 'string')
    .map((bloco) => bloco.text)
    .join('\n')
    .trim();
}

function extrairJson(texto) {
  let t = String(texto || '').trim();
  t = t.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  const ini = t.indexOf('{');
  const fim = t.lastIndexOf('}');
  if (ini < 0 || fim <= ini) throw new Error('resposta da IA não contém objeto JSON');
  return JSON.parse(t.slice(ini, fim + 1));
}

function fontesValidas(fontes = []) {
  if (!Array.isArray(fontes)) return [];
  const vistas = new Set();
  const out = [];
  for (const f of fontes) {
    const url = typeof f === 'string' ? f : String(f?.url || '');
    if (!/^https:\/\//i.test(url) || vistas.has(url)) continue;
    vistas.add(url);
    out.push(typeof f === 'string' ? { nome: 'Fonte adicional', url } : { nome: String(f?.nome || 'Fonte adicional'), url });
  }
  return out;
}

function normalizarAeo(aeo = {}) {
  const campos = [
    ['oQueAconteceu', 'O que aconteceu?'],
    ['quemEstaEnvolvido', 'Quem está envolvido?'],
    ['ondeAconteceu', 'Onde aconteceu?'],
    ['quandoAconteceu', 'Quando aconteceu?'],
    ['porQueImporta', 'Por que isso importa?'],
    ['oQueAconteceAgora', 'O que acontece agora?']
  ];
  const respostas = [];
  for (const [chave, pergunta] of campos) {
    const resposta = String(aeo?.[chave] || '').trim();
    if (resposta) respostas.push({ pergunta, resposta });
  }
  return respostas;
}

function validarReportagem(r, pauta) {
  if (!r || r.publicar === false) return r?.motivo || 'IA marcou a pauta como não publicável';
  const titulo = String(r.titulo || '').trim();
  const resumo = String(r.resumo || '').trim();
  const conteudo = String(r.conteudo || '').trim();
  const adicionais = fontesValidas(r.fontesAdicionais);
  const palavras = contarPalavras(conteudo);
  const paragrafos = (conteudo.match(/<p\b/gi) || []).length;
  const h2 = (conteudo.match(/<h2\b/gi) || []).length;
  const aeo = normalizarAeo(r.aeo);

  if (titulo.length < 20) return 'título insuficiente';
  if (resumo.length < 80) return 'resumo insuficiente';
  if (palavras < MIN_PALAVRAS) return `texto curto: ${palavras} palavras`;
  if (paragrafos < 7) return `estrutura curta: ${paragrafos} parágrafos`;
  if (h2 < 2) return `faltam subtítulos: ${h2}`;
  if (adicionais.length < 2) return `fontes adicionais insuficientes: ${adicionais.length}`;
  if (aeo.length < 5) return `AEO incompleto: ${aeo.length} respostas`;
  if (/capit[aã]o\s+assum[cç][aã]o/i.test(JSON.stringify(r.aeo || {}))) return 'Capitão Assumção apareceu no AEO, o que está proibido nesta fase';
  if (!/^https:\/\//i.test(String(r.fonteUrl || pauta.urlFonte || ''))) return 'fonte principal inválida';
  return null;
}

async function chamarAnthropic(pauta) {
  const prompt = `Você é o núcleo de reapuração e redação do portal Notícia ES, especializado em Política ES, Política Nacional e Segurança Pública.\n\nSua missão é reapurar a pauta abaixo usando busca na web, consultar a fonte principal indicada, localizar fontes públicas adicionais e somente então produzir uma reportagem original, factual e completa.\n\nPAUTA\nTítulo coletado: ${pauta.titulo || ''}\nCategoria: ${pauta.categoria || ''}\nFonte principal: ${pauta.fonteNome || ''}\nURL principal: ${pauta.urlFonte || ''}\nResumo coletado: ${pauta.resumoFonte || ''}\nData da fonte: ${pauta.dataFonte || ''}\n\nREGRAS EDITORIAIS OBRIGATÓRIAS\n1. Consulte efetivamente a URL principal e busque confirmação/contexto em fontes adicionais. Priorize fontes primárias, órgãos oficiais, documentos, entrevistas integrais e veículos reconhecidos.\n2. Não invente fatos, números, datas, cargos ou citações. Não transforme acusação em fato provado, investigação em condenação, pedido em decisão ou opinião em notícia factual.\n3. Escreva em português do Brasil, com lead 5W+1H, pirâmide invertida, contexto, antecedentes, contraponto quando aplicável e próximos passos.\n4. O conteúdo deve ter no mínimo 650 palavras, pelo menos 7 parágrafos <p> e pelo menos 2 subtítulos <h2>. Use normalmente de 650 a 1.200 palavras quando a pauta comportar, sem enchimento artificial.\n5. Não copie trechos extensos das fontes e não reproduza texto protegido. Faça redação original.\n6. AEO obrigatório: a reportagem deve responder naturalmente o que aconteceu, quem está envolvido, onde, quando, por que importa e o que acontece agora. Além disso, preencha o objeto aeo com respostas curtas e factuais.\n7. POR ENQUANTO, NÃO inclua “Capitão Assumção” no objeto AEO. Não introduza o nome artificialmente no texto. Se ele não fizer parte real da pauta, não o mencione em lugar algum.\n8. fontesAdicionais deve conter pelo menos duas fontes efetivamente consultadas, diferentes entre si e, quando possível, diferentes da fonte principal. Não invente URLs.\n9. Se não houver base factual suficiente para uma reportagem completa e verificável, retorne publicar:false e explique o motivo, em vez de preencher lacunas.\n10. Use a imagem fornecida pela pauta; não tente inventar outra URL de imagem.\n\nRETORNE SOMENTE JSON VÁLIDO, SEM MARKDOWN, no formato:\n{\n  "publicar": true,\n  "titulo": "...",\n  "resumo": "subtítulo/resumo com pelo menos 80 caracteres",\n  "conteudo": "<p>...</p><p>...</p><h2>...</h2>...",\n  "fonteNome": "nome da fonte principal",\n  "fonteUrl": "${pauta.urlFonte || ''}",\n  "fontesAdicionais": [{"nome":"...","url":"https://..."},{"nome":"...","url":"https://..."}],\n  "entidades": [{"nome":"...","tipo":"Person|Organization|Place|Event|PoliticalParty|GovernmentOrganization"}],\n  "aeo": {\n    "oQueAconteceu": "...",\n    "quemEstaEnvolvido": "...",\n    "ondeAconteceu": "...",\n    "quandoAconteceu": "...",\n    "porQueImporta": "...",\n    "oQueAconteceAgora": "..."\n  }\n}\n\nSe não for publicável:\n{"publicar":false,"motivo":"..."}`;

  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      model: MODELO,
      max_tokens: 9000,
      temperature: 0.2,
      tools: [{
        type: 'web_search_20250305',
        name: 'web_search',
        max_uses: 6,
        user_location: {
          type: 'approximate',
          country: 'BR',
          timezone: 'America/Sao_Paulo'
        }
      }],
      messages: [{ role: 'user', content: prompt }]
    })
  });

  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(`Anthropic ${resp.status}: ${data?.error?.message || 'erro desconhecido'}`);
  const texto = extrairTextoResposta(data);
  return extrairJson(texto);
}

if (!API_KEY) {
  console.error('[reapuracao] FALHA TÉCNICA: ANTHROPIC_API_KEY não está configurada nos Secrets do GitHub Actions.');
  process.exit(2);
}

const lote = JSON.parse(await fs.readFile(LOTE_PATH, 'utf8'));
const candidatas = Array.isArray(lote?.candidatas) ? lote.candidatas : [];
if (!candidatas.length) {
  console.log('[reapuracao] Nenhuma candidata no lote.');
  process.exit(0);
}

let produzidas = 0;
let errosTecnicos = 0;
let rejeitadas = 0;
const processadas = [];

for (const pauta of candidatas) {
  if (produzidas >= MAX_PUBLICAVEIS) {
    processadas.push(pauta);
    continue;
  }

  if (pauta?.reportagem && !validarReportagem(pauta.reportagem, pauta)) {
    produzidas++;
    processadas.push(pauta);
    continue;
  }

  try {
    console.log(`[reapuracao] processando ${pauta.id}: ${pauta.titulo}`);
    const r = await chamarAnthropic(pauta);
    const motivo = validarReportagem(r, pauta);
    if (motivo) {
      rejeitadas++;
      console.warn(`[reapuracao] rejeita ${pauta.id}: ${motivo}`);
      processadas.push({ ...pauta, reportagem: undefined, rejeicaoEditorial: motivo });
      continue;
    }

    const reportagem = {
      titulo: String(r.titulo).trim(),
      resumo: String(r.resumo).trim(),
      conteudo: String(r.conteudo).trim(),
      categoria: pauta.categoria,
      imagem: pauta.imagem,
      fonteNome: String(r.fonteNome || pauta.fonteNome || 'Fonte principal').trim(),
      fonteUrl: String(r.fonteUrl || pauta.urlFonte || '').trim(),
      fontesAdicionais: fontesValidas(r.fontesAdicionais),
      entidades: Array.isArray(r.entidades) ? r.entidades.slice(0, 20) : [],
      aeo: normalizarAeo(r.aeo)
    };

    processadas.push({ ...pauta, reportagem });
    produzidas++;
    console.log(`[reapuracao] pronta ${pauta.id}: ${contarPalavras(reportagem.conteudo)} palavras`);
  } catch (erro) {
    errosTecnicos++;
    console.error(`[reapuracao] erro técnico ${pauta.id}: ${erro.message}`);
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
    modelo: MODELO,
    provedor: 'Anthropic'
  },
  candidatas: processadas
};

await fs.writeFile(LOTE_PATH, JSON.stringify(saida, null, 2) + '\n', 'utf8');
console.log(`[reapuracao] ${produzidas} reportagem(ns) completas; ${rejeitadas} rejeitada(s); ${errosTecnicos} erro(s) técnico(s).`);

if (produzidas === 0 && candidatas.length > 0 && errosTecnicos > 0) {
  console.error(`[reapuracao] FALHA EDITORIAL: ${candidatas.length} candidatas, 0 reportagens produzidas por falha técnica.`);
  process.exit(3);
}
