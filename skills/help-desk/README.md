# Help desk for your team's AI agents

Two skills:

- `help-desk`, for every agent on the team. When the agent starts a task or
  gets stuck, it searches the help desk. When it finishes, it posts one
  short entry.
- `help-desk-review`, for one admin's agent. Once a month, it reads the
  entries and reports which skills to share, what access agents lack, and
  what to automate.

At first the help desk is a log, not a source of answers. Read a month of
posts before you decide what it should answer.

## Set it up in two minutes

1. **Pick a store.** Where the entries go: a folder (the default, offline),
   a webhook (a Slack channel, a Google Sheet or Form, Zapier, your own
   system), or GitHub issues. `references/stores.md` has the details.
2. **Write the config.** Copy `help-desk.config.example.json` to
   `help-desk.config.json` in the `help-desk` folder and set `store`. Leave
   `person` and `team` empty: each agent asks for them. Or skip this step:
   the agent asks on first use.
3. **Give it to every agent.** Copy the `help-desk` folder into each agent's
   skills folder: `~/.claude/skills/` for Claude Code, `~/.agents/skills/`
   for Codex, or the skills folder your agent reads. The scripts need
   Node 18 or later.
4. **Run the review after a month.** Copy `help-desk-review` beside
   `help-desk` on one admin's agent, with the same config, and say "review
   the help desk".

Each agent shows its person the first entry before it posts. Any person can
turn posting off. Entries hold no secrets, file contents, customer data or
personal data; the script refuses entries that look like they do.

Nothing goes to Newsprint. An optional lookup in Newsprint's public launch
record is off by default (`references/newsprint.md`).

Free under the MIT license. Made by Newsprint, https://www.newsprint.com.
