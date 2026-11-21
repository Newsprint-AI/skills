#!/usr/bin/env node
// help-desk: post, search and list entries in the team's help desk. Node 18 or later, no packages.
//
//   node scripts/help-desk.mjs post <entry.json> [--approved]
//   node scripts/help-desk.mjs search <words...>
//   node scripts/help-desk.mjs list --since YYYY-MM-DD
//
// The config is the file HELP_DESK_CONFIG names, else ~/.config/help-desk/config.json (or $XDG_CONFIG_HOME/help-desk/),
// else help-desk.config.json in this skill's folder (the old place). It lives outside the skill folder because
// agents protect their own skills folder from writes.
// search and list print a JSON list of entries; post prints {"posted": true, "ref": ...}. Notes go to stderr.
// Every failure is one line on stderr starting "help-desk:", with exit code 1 (2 for a usage error).
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, isAbsolute, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { checkEntry, EntryError } from './entry.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const STORES = ['folder', 'webhook', 'github', 'custom'];
const USAGE = 'usage: help-desk.mjs post <entry.json> [--approved] | search <words...> | list --since YYYY-MM-DD';

class Usage extends Error {}
const warn = (msg) => process.stderr.write(`help-desk: ${msg}\n`);

// The user config file: $XDG_CONFIG_HOME/help-desk/config.json when XDG_CONFIG_HOME is absolute, else ~/.config/help-desk/config.json.
const userConfig = () => {
  const xdg = process.env.XDG_CONFIG_HOME;
  return join(xdg && isAbsolute(xdg) ? xdg : join(homedir(), '.config'), 'help-desk', 'config.json');
};

function configPath() {
  const named = process.env.HELP_DESK_CONFIG;
  if (named) {
    if (!existsSync(named)) throw new Error(`no config at ${named}, the file HELP_DESK_CONFIG names; create it, or unset HELP_DESK_CONFIG and follow "Setup" in SKILL.md`);
    return named;
  }
  const user = userConfig();
  if (existsSync(user)) return user;
  const legacy = join(HERE, '..', 'help-desk.config.json');
  if (existsSync(legacy)) return legacy;
  throw new Error(`no config yet. Create ${user}; follow "Setup" in SKILL.md`);
}

function loadConfig() {
  const file = configPath();
  let cfg;
  try {
    cfg = JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    throw new Error(`${file} is not valid JSON`);
  }
  if (!STORES.includes(cfg.store)) throw new Error(`"store" must be one of ${STORES.join(', ')}`);
  const at = (p) => resolve(dirname(file), p.replace(/^~(?=$|\/)/, homedir()));
  if (cfg.store === 'folder') {
    if (typeof cfg.folder !== 'string' || !cfg.folder) throw new Error('the folder store needs "folder" in the config');
    cfg.folder = at(cfg.folder);
  }
  if (cfg.store === 'custom') {
    if (typeof cfg.module !== 'string' || !cfg.module) throw new Error('the custom store needs "module" in the config');
    cfg.module = isAbsolute(cfg.module) ? cfg.module : at(cfg.module);
  }
  return { cfg, file };
}

async function storeOf(cfg) {
  const mod = cfg.store === 'custom' ? await import(pathToFileURL(cfg.module).href) : await import(`./stores/${cfg.store}.mjs`);
  for (const fn of ['post', 'search', 'list']) if (typeof mod[fn] !== 'function') throw new Error(`the ${cfg.store} store has no ${fn}()`);
  return mod;
}

async function main(argv) {
  const [cmd, ...rest] = argv;
  if (!cmd || cmd === '--help' || cmd === '-h') {
    console.log(USAGE);
    return;
  }
  if (cmd === 'post') {
    const approved = rest.includes('--approved');
    const files = rest.filter((a) => a !== '--approved');
    if (files.length !== 1) throw new Usage('post takes one entry file');
    const { cfg, file } = loadConfig();
    if (cfg.posting === 'off') {
      warn('posting is off in the config; nothing was posted');
      console.log(JSON.stringify({ posted: false }));
      return;
    }
    let raw;
    try {
      raw = JSON.parse(readFileSync(files[0], 'utf8'));
    } catch {
      throw new Error(`${files[0]} is not a readable JSON file`);
    }
    const entry = checkEntry(raw, cfg);
    if (cfg.first_post_done !== true && !approved) {
      throw new Error('this is the first post: show the entry to the person, and post it again with --approved after their yes');
    }
    const ref = await (await storeOf(cfg)).post(entry, cfg, warn);
    if (cfg.first_post_done !== true) {
      try {
        const saved = JSON.parse(readFileSync(file, 'utf8'));
        writeFileSync(file, `${JSON.stringify({ ...saved, first_post_done: true }, null, 2)}\n`);
      } catch {
        warn('could not record the first post in the config; the next post will ask for --approved again');
      }
    }
    console.log(JSON.stringify({ posted: true, ref }));
    return;
  }
  if (cmd === 'search') {
    const query = rest.join(' ').trim();
    if (!query) throw new Usage('search takes a few words');
    const { cfg } = loadConfig();
    console.log(JSON.stringify(await (await storeOf(cfg)).search(query, cfg, warn), null, 2));
    return;
  }
  if (cmd === 'list') {
    const i = rest.indexOf('--since');
    const since = i >= 0 ? rest[i + 1] : undefined;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(since || '')) throw new Usage('list takes --since YYYY-MM-DD');
    const { cfg } = loadConfig();
    console.log(JSON.stringify(await (await storeOf(cfg)).list(since, cfg, warn), null, 2));
    return;
  }
  throw new Usage(`unknown command "${cmd}"`);
}

main(process.argv.slice(2)).catch((err) => {
  if (err instanceof Usage) {
    warn(`${err.message}. ${USAGE}`);
    process.exit(2);
  }
  warn(err instanceof EntryError ? `entry refused: ${err.message}` : err.message);
  process.exit(1);
});
