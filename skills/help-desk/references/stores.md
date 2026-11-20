# Stores: where the help desk lives

Read this during setup. Set `store` in `help-desk.config.json` to one of
these, with its keys. Paths may start with `~`; a relative path is read from
the config file's folder.

## folder (the default)

```json
{ "store": "folder", "folder": "~/help-desk" }
```

One markdown file per entry. Search is a plain text search over the files.
Works offline and needs no account. For a team, point `folder` at a shared
folder (a synced drive) or a git repo every agent can reach.

In a git repo, add `"git": true`. Each post then commits its one file and
pushes. Each search and list pulls first. A failed pull or push is a warning,
not an error: the entry is saved in the folder either way.

## webhook

```json
{ "store": "webhook", "url_env": "HELP_DESK_WEBHOOK_URL", "format": "json" }
```

Each post is an HTTP POST of the entry as JSON. Prefer `url_env`, the name of
an environment variable that holds the URL, over `url` in the file: many
webhook URLs work as a password. `token_env` names a variable whose value is
sent as `Authorization: Bearer <token>`.

- **Slack:** make an incoming webhook for one channel and set
  `"format": "slack"`. Each post is one message.
- **Google Sheet or Form:** deploy a Google Apps Script web app (below) and
  use its URL.
- **Zapier, Make, or your own system:** use the URL it gives you, with
  `"format": "json"`. The body holds each field of the entry, plus
  `markdown`, the same entry as text.

**A webhook store is write-only** unless you also give `search_url` (or
`search_url_env`). Then search sends `GET <search_url>?q=<words>` and list
sends `GET <search_url>?since=YYYY-MM-DD`. Each must answer a JSON list of
entries. Without it, search prints `[]` and a note, and the agent carries on
with the task. The review then reads the entries where they land, such as a
sheet export.

A Google Apps Script web app for a Sheet, with search. Open the sheet, then
Extensions > Apps Script, paste this, and deploy it as a web app. With access
set to "Anyone", the URL works as a password: keep it in `url_env` and
`search_url_env` (the same URL for both), never in the file.

```js
const COLS = ['date', 'agent', 'person', 'team', 'task', 'did', 'skills', 'tools', 'stuck', 'links'];
const sheet = () => SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
function doPost(e) {
  const x = JSON.parse(e.postData.contents);
  sheet().appendRow(COLS.map((c) => (Array.isArray(x[c]) ? x[c].join(', ') : x[c] || '')));
  return ContentService.createTextOutput('ok');
}
function doGet(e) {
  const q = (e.parameter.q || '').toLowerCase(), since = e.parameter.since || '';
  const rows = sheet().getDataRange().getValues().map((r) => Object.fromEntries(COLS.map((c, i) => [c, String(r[i])])));
  const list = (s) => (s ? s.split(', ') : []);
  const out = rows
    .map((r) => ({ ...r, date: r.date.slice(0, 10), skills: list(r.skills), tools: list(r.tools), links: list(r.links) }))
    .filter((r) => (q ? JSON.stringify(r).toLowerCase().includes(q) : r.date >= since));
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
```

Set the sheet's date column to plain text, so dates stay `YYYY-MM-DD`.

## github

```json
{ "store": "github", "repo": "your-org/help-desk", "label": "help-desk" }
```

One issue per entry, with the label. It uses the `gh` CLI and its own login
(`gh auth login`); this skill holds no token. Create the label once:
`gh label create help-desk --repo your-org/help-desk`. Use a private repo:
entries describe your team's work.

## custom

```json
{ "store": "custom", "module": "./my-store.mjs" }
```

Your own store. See `references/custom-store.md`.
