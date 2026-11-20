// The webhook store: POST each entry as JSON to a URL (Slack, a Google Apps Script web app, Zapier, your own
// system). Write-only unless the config also gives a search URL. Never prints a URL or a token.
import { checkEntry, toMarkdown, toText } from '../entry.mjs';

const TIMEOUT_MS = 15000;

function secret(cfg, key) {
  const env = cfg[`${key}_env`];
  if (env) {
    if (!process.env[env]) throw new Error(`the environment variable ${env} (${key}_env in the config) is not set`);
    return process.env[env];
  }
  return cfg[key];
}

function headers(cfg) {
  const h = { 'content-type': 'application/json' };
  const token = cfg.token_env ? secret(cfg, 'token') : undefined;
  if (token) h.authorization = `Bearer ${token}`;
  return h;
}

async function call(url, init, what) {
  let res;
  try {
    res = await fetch(url, { ...init, redirect: 'follow', signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (err) {
    throw new Error(`could not reach the ${what} (${err.name === 'TimeoutError' ? 'timed out' : 'network error'})`);
  }
  if (!res.ok) throw new Error(`the ${what} answered HTTP ${res.status}`);
  return res;
}

/** The body sent for an entry: the entry's fields, flat, or a Slack message. */
export function payload(entry, cfg) {
  if (cfg.format === 'slack') return { text: toText(entry) };
  return { ...entry, markdown: toMarkdown(entry) };
}

export async function post(entry, cfg) {
  const url = secret(cfg, 'url');
  if (!url) throw new Error('the config has no "url" or "url_env" for the webhook');
  await call(url, { method: 'POST', headers: headers(cfg), body: JSON.stringify(payload(entry, cfg)) }, 'webhook');
  return 'webhook';
}

async function get(cfg, params, warn) {
  const base = secret(cfg, 'search_url');
  if (!base) return null;
  const url = new URL(base);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await call(url, { headers: headers(cfg) }, 'search URL');
  let body;
  try {
    body = await res.json();
  } catch {
    throw new Error('the search URL did not answer with JSON');
  }
  const rows = Array.isArray(body) ? body : Array.isArray(body?.entries) ? body.entries : null;
  if (!rows) throw new Error('the search URL answered JSON that is not a list of entries');
  const out = [];
  for (const row of rows) {
    const { ref, markdown, ...fields } = row ?? {};
    try {
      out.push({ ...checkEntry(fields), ...(ref ? { ref: String(ref) } : {}) });
    } catch {
      warn('skipped one row from the search URL that is not a valid entry');
    }
  }
  return out;
}

export async function search(query, cfg, warn = () => {}) {
  const rows = await get(cfg, { q: query }, warn);
  if (rows === null) {
    warn('this help desk is write-only (no search_url in the config), so there is nothing to search; carry on with the task');
    return [];
  }
  return rows;
}

export async function list(since, cfg, warn = () => {}) {
  const rows = await get(cfg, { since }, warn);
  if (rows === null) throw new Error('this help desk is write-only (no search_url in the config); read the entries where the webhook delivers them');
  return rows.filter((e) => e.date >= since).sort((a, b) => a.date.localeCompare(b.date));
}
