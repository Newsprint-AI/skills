// One help desk entry: check it, and turn it into markdown and back. No dependencies.

export const FIELDS = ['date', 'agent', 'person', 'team', 'task', 'did', 'skills', 'tools', 'stuck', 'links'];
const LISTS = new Set(['skills', 'tools', 'links']);
const MAX = { task: 160, did: 1200, stuck: 800, agent: 80, person: 80, team: 80, item: 300, items: 20, total: 6000 };

// Common secret and personal-data shapes. A backstop, not a guarantee: the agent must still leave them out.
const SECRET = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bAKIA[0-9A-Z]{16}\b/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}/,
  /\bgithub_pat_[A-Za-z0-9_]{30,}/,
  /\bxox[abprs]-[A-Za-z0-9-]{10,}/,
  /\bsk-[A-Za-z0-9_-]{20,}/,
  /hooks\.slack\.com\/services\//i,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
  /\b(password|passwd|secret|token|api[_-]?key)\s*[:=]\s*\S+/i,
];
const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/;

export class EntryError extends Error {}

/** The day of `d` on this computer's clock, as YYYY-MM-DD: an entry posted in the afternoon is dated that day, not by UTC. */
export function localDay(d = new Date()) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
const today = () => localDay();

/** The entry with defaults filled in, or an EntryError naming the first problem. Never echoes a matched secret. */
export function checkEntry(raw, defaults = {}) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new EntryError('the entry is not a JSON object');
  for (const key of Object.keys(raw)) {
    if (!FIELDS.includes(key)) throw new EntryError(`unknown field "${key}"; the fields are ${FIELDS.join(', ')}`);
  }
  const e = { date: today(), skills: [], tools: [], links: [], stuck: '' };
  for (const key of ['agent', 'person', 'team']) if (defaults[key]) e[key] = defaults[key];
  Object.assign(e, raw);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(e.date)) throw new EntryError('date must be YYYY-MM-DD');
  for (const key of ['agent', 'task', 'did']) {
    if (typeof e[key] !== 'string' || !e[key].trim()) throw new EntryError(`"${key}" is missing`);
  }
  if (/[\r\n]/.test(e.task)) throw new EntryError('"task" must be one line');
  for (const key of FIELDS) {
    const v = e[key];
    if (v === undefined) continue;
    if (LISTS.has(key)) {
      if (!Array.isArray(v) || !v.every((x) => typeof x === 'string')) throw new EntryError(`"${key}" must be a list of strings`);
      if (v.length > MAX.items) throw new EntryError(`"${key}" has more than ${MAX.items} items`);
      if (v.some((x) => x.length > MAX.item)) throw new EntryError(`an item in "${key}" is longer than ${MAX.item} characters`);
    } else {
      if (typeof v !== 'string') throw new EntryError(`"${key}" must be a string`);
      if (MAX[key] && v.length > MAX[key]) throw new EntryError(`"${key}" is longer than ${MAX[key]} characters; keep entries short, with no file contents`);
    }
    const text = LISTS.has(key) ? v.join('\n') : v;
    if (SECRET.some((re) => re.test(text))) throw new EntryError(`"${key}" looks like it holds a secret or credential; remove it`);
    if (key !== 'links' && EMAIL.test(text)) throw new EntryError(`"${key}" holds an email address; leave personal data out`);
    if (key === 'links' && v.some((x) => EMAIL.test(x) && !/^https?:\/\//.test(x))) throw new EntryError('"links" holds an email address; leave personal data out');
  }
  if (JSON.stringify(e).length > MAX.total) throw new EntryError(`the entry is over ${MAX.total} characters; keep it short`);
  return e;
}

const HEAD = ['date', 'agent', 'person', 'team', 'task', 'skills', 'tools', 'links'];

/** Frontmatter (one JSON value per line, which is also valid YAML) and two sections. */
export function toMarkdown(e) {
  const fm = HEAD.filter((k) => e[k] !== undefined && e[k] !== '').map((k) => `${k}: ${JSON.stringify(e[k])}`);
  return `---\n${fm.join('\n')}\n---\n\n## What it did\n\n${e.did.trim()}\n\n## Where it got stuck\n\n${(e.stuck || '').trim() || 'Nothing.'}\n`;
}

/** An entry back from toMarkdown's text, or null when the text has no entry frontmatter. Tolerates hand edits. */
export function fromMarkdown(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/.exec(text);
  if (!m) return null;
  const e = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = /^([a-z]+):\s*(.*)$/.exec(line);
    if (!kv || !FIELDS.includes(kv[1])) continue;
    let v = kv[2].trim();
    try {
      v = JSON.parse(v);
    } catch {
      v = v.replace(/^['"]|['"]$/g, '');
    }
    e[kv[1]] = v;
  }
  if (!e.task) return null;
  if (e.date !== undefined) e.date = String(e.date);
  const section = (name) => {
    const s = new RegExp(`^## ${name}\\s*$([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, 'm').exec(m[2]);
    return s ? s[1].trim() : '';
  };
  e.did = section('What it did');
  const stuck = section('Where it got stuck');
  e.stuck = stuck === 'Nothing.' ? '' : stuck;
  return e;
}

/** One line for a chat channel such as Slack. */
export function toText(e) {
  const who = [e.agent, e.person, e.team].filter(Boolean).join(', ');
  const lines = [`*${e.task}* (${e.date}, ${who})`, `Did: ${e.did}`];
  if (e.skills?.length || e.tools?.length) lines.push(`Used: ${[...(e.skills || []), ...(e.tools || [])].join(', ')}`);
  lines.push(`Stuck: ${e.stuck || 'nothing'}`);
  if (e.links?.length) lines.push(`Links: ${e.links.join(' ')}`);
  return lines.join('\n');
}

/** Query words: lowercase, three letters or more. */
export const words = (q) => [...new Set(String(q).toLowerCase().split(/[^\p{L}\p{N}]+/u).filter((w) => w.length >= 3))];

/** Entries that match the most query words first, then newest first; at most `limit`. */
export function rank(items, query, textOf, limit = 10) {
  const ws = words(query);
  if (!ws.length) return [];
  return items
    .map((it) => {
      const t = textOf(it).toLowerCase();
      return { it, score: ws.filter((w) => t.includes(w)).length };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score || String(b.it.date).localeCompare(String(a.it.date)))
    .slice(0, limit)
    .map((x) => x.it);
}
