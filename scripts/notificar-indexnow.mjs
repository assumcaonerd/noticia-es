#!/usr/bin/env node
import { execFileSync } from 'node:child_process';

const HOST = 'noticiaes.com.br';
const SITE = `https://${HOST}`;
const KEY = 'f937dcb0bf596de1195ff350b7527281';
const KEY_LOCATION = `${SITE}/${KEY}.txt`;

function arquivosAlterados() {
  try {
    return execFileSync('git', ['diff', '--name-only', 'HEAD^', 'HEAD'], { encoding: 'utf8' })
      .split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  } catch {
    return [];
  }
}

function urlDeArquivo(arquivo) {
  if (/^m\/[^/]+\.html$/.test(arquivo)) return `${SITE}/${arquivo}`;
  if (arquivo === 'index.html') return `${SITE}/`;
  if (['sitemap.xml', 'sitemap-news.xml', 'rss.xml', 'llms.txt', 'robots.txt'].includes(arquivo)) return `${SITE}/${arquivo}`;
  return null;
}

const urls = [...new Set(arquivosAlterados().map(urlDeArquivo).filter(Boolean))].slice(0, 10000);
if (!urls.length) {
  console.log('[indexnow] nenhuma URL pública relevante mudou neste commit.');
  process.exit(0);
}

const resposta = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls })
});

console.log(`[indexnow] ${urls.length} URL(s) enviadas; HTTP ${resposta.status}.`);
if (![200, 202].includes(resposta.status)) {
  const corpo = await resposta.text().catch(() => '');
  console.error(corpo.slice(0, 1000));
  process.exit(1);
}
