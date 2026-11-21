// The folder store: one markdown file per entry in a shared folder or git repo. Works offline.
import { execFileSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fromMarkdown, rank, toMarkdown } from '../entry.mjs';

const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'entry';

function git(cfg, args, warn) {
  try {
    execFileSync('git', ['-C', cfg.folder, ...args], { stdio: ['ignore', 'ignore', 'pipe'] });
    return true;
  } catch {
    warn(`git ${args[0]} failed in the help desk folder; carrying on`);
    return false;
  }
}

function read(cfg, warn) {
  if (!existsSync(cfg.folder)) {
    warn(`the help desk folder ${cfg.folder} does not exist yet; the first post makes it. If the folder should exist, check "folder" in the config`);
    return [];
  }
  if (cfg.git) git(cfg, ['pull', '--ff-only', '--quiet'], warn);
  const out = [];
  for (const name of readdirSync(cfg.folder).sort()) {
    if (!name.endsWith('.md')) continue;
    const e = fromMarkdown(readFileSync(join(cfg.folder, name), 'utf8'));
    if (e) out.push({ ...e, ref: join(cfg.folder, name) });
  }
  return out;
}

export async function post(entry, cfg, warn = () => {}) {
  mkdirSync(cfg.folder, { recursive: true });
  const name = `${entry.date}-${slug(entry.task)}-${randomBytes(3).toString('hex')}.md`;
  const file = join(cfg.folder, name);
  writeFileSync(file, toMarkdown(entry), { flag: 'wx' });
  if (cfg.git) {
    if (git(cfg, ['add', '--', name], warn) && git(cfg, ['commit', '--quiet', '-m', `help desk: ${entry.date} ${entry.task}`, '--', name], warn)) {
      git(cfg, ['push', '--quiet'], warn);
    }
  }
  return file;
}

export async function search(query, cfg, warn = () => {}) {
  return rank(read(cfg, warn), query, (e) => JSON.stringify(e));
}

export async function list(since, cfg, warn = () => {}) {
  return read(cfg, warn)
    .filter((e) => e.date >= since)
    .sort((a, b) => a.date.localeCompare(b.date));
}
