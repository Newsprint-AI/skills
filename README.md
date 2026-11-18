# Newsprint skills

Free [Agent Skills](https://agentskills.io/specification) from [Newsprint](https://www.newsprint.com), under the MIT license.

| Skill | What it does |
|---|---|
| [write-release](skills/write-release/) | Interviews you for the facts, matches your past releases' tone, then writes a press release that reporters can use and AI answer engines can quote. It never invents facts or figures, and it drafts quote options for each speaker to approve. [About this skill](https://www.newsprint.com/skills/write-release/) |
| [improvement-loop](skills/improvement-loop/) | Puts your agent in a loop of getting better at your work. The first run audits where your time goes and how you use AI, reading only the sources you allow, and offers up to five things it could take over. Then, once a week, it checks its own work and what changed in the software you use, and suggests up to five improvements with the evidence for each. It changes nothing without your yes, and it sends nothing about your work to Newsprint or anyone else. [About this skill](https://www.newsprint.com/skills/improvement-loop/) |

## Install

With the [skills CLI](https://skills.sh), name the skill you want:

```
npx skills add Newsprint-AI/skills --skill write-release
npx skills add Newsprint-AI/skills --skill improvement-loop
```

Or paste this into your agent, with the skill's name in place of `<skill>`:

> Install the `<skill>` skill by running `npx skills add Newsprint-AI/skills --skill <skill>`. If you can't run commands, read https://www.newsprint.com/skills/<skill>/SKILL.md and each file it names, from https://www.newsprint.com/skills/<skill>/ plus that path, and follow it for the rest of this conversation.

Each skill's page on newsprint.com has this text with the name filled in.

## License

MIT. See [LICENSE](LICENSE). Keep the notice with every copy.
