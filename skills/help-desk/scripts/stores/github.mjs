// The github store: one issue per entry in one repo, through the gh CLI (its own login; this script holds no token).
import { execFileSync } from 'node:child_process';
import { localDay, toMarkdown } from '../entry.mjs';

const MARK = 'help-desk-entry:';
const FIELDS = 'number,title,body,url,createdAt';

function need(cfg) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(cfg.repo || '')) throw new Error('the config needs "repo" as owner/name for the github store');
  return { repo: cfg.repo, label: cfg.label || 'help-desk' };
}

/** The issue body: the readable entry, then the fields as JSON in a comment, so search and list read it back. */
export function issueBody(entry) {
  const { did, stuck, ...head } = entry;
  const md = toMarkdown(entry).replace(/^---\n[\s\S]*?\n---\n\n/, '');
  const meta = [`Date: ${entry.date}`, `Agent: ${[entry.agent, entry.person, entry.team].filter(Boolean).join(', ')}`];
  if (entry.skills.length) meta.push(`Skills: ${entry.skills.join(', ')}`);
  if (entry.tools.length) meta.push(`Tools: ${entry.tools.join(', ')}`);
  if (entry.links.length) meta.push(`Links: ${entry.links.join(' ')}`);
  return `${meta.join('  \n')}\n\n${md}\n<!-- ${MARK} ${JSON.stringify({ ...head, did, stuck }).replace(/--/g, '\\u002d\\u002d')} -->\n`;
}

export const postArgs = (entry, cfg) => {
  const { repo, label } = need(cfg);
  return ['issue', 'create', '--repo', repo, '--label', label, '--title', entry.task, '--body', issueBody(entry)];
};

export const searchArgs = (query, cfg) => {
  const { repo, label } = need(cfg);
  return ['issue', 'list', '--repo', repo, '--label', label, '--state', 'all', '--search', query, '--limit', '30', '--json', FIELDS];
};

export const listArgs = (since, cfg) => {
  const { repo, label } = need(cfg);
  return ['issue', 'list', '--repo', repo, '--label', label, '--state', 'all', '--search', `created:>=${since}`, '--limit', '1000', '--json', FIELDS];
};

export function fromIssue(issue) {
  const at = issue.body?.lastIndexOf(`<!-- ${MARK}`) ?? -1;
  if (at >= 0) {
    try {
      const json = issue.body.slice(at + MARK.length + 5, issue.body.indexOf('-->', at)).trim();
      return { ...JSON.parse(json), ref: issue.url };
    } catch {
      // fall through to the plain issue
    }
  }
  const created = new Date(issue.createdAt);
  const date = Number.isNaN(created.getTime()) ? String(issue.createdAt).slice(0, 10) : localDay(created);
  return { date, task: issue.title, did: issue.body || '', ref: issue.url };
}

function gh(args) {
  try {
    return execFileSync('gh', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  } catch (err) {
    if (err.code === 'ENOENT') throw new Error('the gh CLI is not installed; install it and run "gh auth login", or pick another store');
    const line = String(err.stderr || '').trim().split('\n')[0] || 'no message';
    throw new Error(`gh failed: ${line}`);
  }
}

export async function post(entry, cfg) {
  return gh(postArgs(entry, cfg)).trim();
}

export async function search(query, cfg) {
  return JSON.parse(gh(searchArgs(query, cfg))).map(fromIssue);
}

export async function list(since, cfg) {
  return JSON.parse(gh(listArgs(since, cfg)))
    .map(fromIssue)
    .filter((e) => e.date >= since)
    .sort((a, b) => a.date.localeCompare(b.date));
}
