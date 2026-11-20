# Write your own store

A store is one JavaScript module with three functions. Set
`"store": "custom"` and `"module": "<path to it>"` in the config.

- `post(entry, config)`: save one entry. Return a short reference (a path,
  an id, a link). Never return or print a URL that holds a key.
- `search(query, config)`: return a list of entries that match the words,
  best match first, at most about 10.
- `list(since, config)`: return every entry dated on or after `since`
  (`YYYY-MM-DD`), oldest first.

An entry has `date`, `agent`, `person`, `team`, `task`, `did`, `skills`,
`tools`, `stuck` and `links`. The script checks it before `post` sees it.
Add `ref` to each entry you return, so a reader can find the original. Throw
an `Error` with a one-line message on failure. `config` is the whole config
file, so your store can read its own keys from it.

An example that keeps entries in one JSON lines file:

```js
import { appendFileSync, existsSync, readFileSync } from 'node:fs';

const read = (c) => (existsSync(c.file) ? readFileSync(c.file, 'utf8').split('\n').filter(Boolean).map(JSON.parse) : []);

export async function post(entry, c) {
  appendFileSync(c.file, JSON.stringify(entry) + '\n');
  return c.file;
}
export async function search(query, c) {
  const words = query.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
  return read(c).filter((e) => words.some((w) => JSON.stringify(e).toLowerCase().includes(w))).slice(-10).reverse();
}
export async function list(since, c) {
  return read(c).filter((e) => e.date >= since);
}
```
