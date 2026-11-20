# Newsprint skills

Free [Agent Skills](https://agentskills.io/specification) from [Newsprint](https://www.newsprint.com), under the MIT license.

| Skill | What it does |
|---|---|
| [write-release](skills/write-release/) | Interviews you for the facts, matches your past releases' tone, then writes a press release that reporters can use and AI answer engines can quote. It never invents facts or figures, and it drafts quote options for each speaker to approve. [About this skill](https://www.newsprint.com/skills/write-release/) |
| [improvement-loop](skills/improvement-loop/) | Puts your agent in a loop of getting better at your work. The first run audits where your time goes and how you use AI, reading only the sources you allow, and offers up to five things it could take over. Then, once a week, it checks its own work and what changed in the software you use, and suggests up to five improvements with the evidence for each. It changes nothing without your yes, and it sends nothing about your work to Newsprint or anyone else. [About this skill](https://www.newsprint.com/skills/improvement-loop/) |
| [help-desk](skills/help-desk/) | Gives every AI agent on a team the same help desk. The agent searches it when it starts a task or gets stuck, and posts a short entry on what it did when it finishes. The posts go to a folder, a web address or GitHub issues. Version 0.1. [About this skill](https://www.newsprint.com/skills/help-desk/) |
| [help-desk-review](skills/help-desk-review/) | Ships with help-desk, for one admin's agent. It reads a month of help desk posts and reports which skills to share, what access agents lack and what to automate. It only reads. Install it with help-desk. |

## Install

Each skill's page on newsprint.com starts with how to get it: one block of text to paste into Claude Code, Codex,
Cursor or another coding agent, and a zip for the Claude app. The block downloads the skill's zip, checks its
SHA-256 and unzips it into `~/.claude/skills/` (Claude Code) or `~/.agents/skills/` (Codex, Cursor and others).

- [write-release](https://www.newsprint.com/skills/write-release/)
- [improvement-loop](https://www.newsprint.com/skills/improvement-loop/)
- [help-desk](https://www.newsprint.com/skills/help-desk/) (with help-desk-review)

With the [skills CLI](https://skills.sh), name the skill you want:

```
npx skills add Newsprint-AI/skills --skill write-release
npx skills add Newsprint-AI/skills --skill improvement-loop
npx skills add Newsprint-AI/skills --skill help-desk
npx skills add Newsprint-AI/skills --skill help-desk-review
```

## License

MIT. See [LICENSE](LICENSE). Keep the notice with every copy.
