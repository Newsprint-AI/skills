# The Newsprint step: what it covers and how to read it

Checked live on 17 November 2026. Every URL below is public, needs no login or
key, and is free to read (CC BY 4.0). Make plain GET requests only.

## What Newsprint covers

Newsprint records software companies by **segment**. It covers two kinds:

**The launch record, added to each week.** Every confirmed launch is dated
and sourced. Most appear one to two weeks after they ship; some take a month
or more.

- PR software: suites, media monitoring, media databases and outreach, press
  release distribution, journalist requests, podcast booking, measurement,
  AI PR assistants.
- AI visibility: tools that track or change how brands appear in AI answers.
- Sales compensation and commissions (a small set of launches).

**Read once, then again from time to time.** Each segment's companies carry a
handful of dated AI launches and events since May 2025. They are not checked
every week, so the newest item can be weeks or months old.

- AI hiring software, workforce planning, compensation, procurement, supply
  chain planning, internal communications, revenue operations (CRM, call
  recording, sales engagement), manufacturing operations, social monitoring.

Some large business suites appear only as one product line in one segment. For
example, HubSpot appears as HubSpot Sales Hub (revenue operations) and Semrush
as the Semrush AI PR Toolkit (PR software). Check the page title before you
match it to a tool.

## What Newsprint does not cover

Newsprint has no pages for general business and office software, AI chat
assistants or agent runtimes. As of this check that includes OpenAI and
ChatGPT, Anthropic and Claude, Google Gemini, Google Workspace, Microsoft
365, Slack, Notion, Asana, QuickBooks, Xero, Mailchimp, Zendesk, DocuSign and
Dropbox. Microsoft appears only as Dynamics 365, Viva and Bing Webmaster
Tools; Google only as Search Console; Zoom only as Zoom Revenue Accelerator;
Shopify only as Shopify Collabs. For these, use the vendor's own release notes
(Step 4b).

## The pages to fetch

| What | URL | Size | Notes |
|---|---|---|---|
| Newest 100 launches | `https://www.newsprint.com/launches.md` | about 20 KB | Weekly segments only. Covers about the last four weeks. |
| One company | `https://www.newsprint.com/companies/<slug>.md` | 1 to about 85 KB | Every dated item for that company, newest first. |
| Company list | `https://www.newsprint.com/companies.md` | about 250 KB | The companies with the most sourced facts, each linked to its `.md` page. Not every company: use `data/companies.json` (below) for the rest. |
| Weekly issue | `https://www.newsprint.com/updates/pr-software.md` | about 3 KB | "PR software this week", with a link to each issue. |

### `launches.md` line format

```
- [Muck Rack: Byline Notifications and Review Articles for journalists](https://www.newsprint.com/launches/LJ5Y8SBHR/): Available Nov. 9, 2026. Feature.
```

Read only the lines under `## Newest launches`. The company name is the text
before the first colon inside the brackets. The date follows "Available" (it
shipped) or "Announced" (not yet out).

### `companies/<slug>.md` format

The top lines:

```
# Muck Rack: new features and launches
URL: https://www.newsprint.com/companies/muck-rack/
Covers: 2009 to Nov. 9, 2026
Updated: 2026-11-17
```

Then a summary, then one or both of these sections, each newest first:

- `## Every dated launch, newest first`: the weekly launch record.
- `## Launches and dated events, newest first` or
  `## Dated events on the maps, newest first`: segment reads, not weekly.

Each item is a `###` heading (what shipped), then a date line, then a summary
and a `Source:` link to the vendor's own page. Date lines look like:

```
Available Nov. 10, 2026.
Announced November 2026.
Launch, Sept. 16, 2026.
Partnership, Sept. 16, 2026.
```

A slug that does not exist answers 404. That means Newsprint has no page by
that name; search `companies.md` before you write "none".

## The same data as JSON

For agents that prefer JSON. Same content, larger files.

- `https://www.newsprint.com/companies/<slug>.json`: one company. `launches`
  holds the launch record; `timeline` holds segment events;
  `company.update_channels` lists the vendor's own changelog and blog pages,
  for the few companies where Newsprint knows them.
- `https://www.newsprint.com/data/launches.json`: every confirmed launch
  (about 3.4 MB). Each launch has `company`, `title`, `announced_on`,
  `available_on`, `recorded_on` and `sources`.
- `https://www.newsprint.com/data/companies.json`: every company tracked
  (about 3.1 MB), with `name`, `slug` and `aliases`. Every company here has a
  page at `/companies/<slug>.md`, including those `companies.md` leaves out.
- `https://www.newsprint.com/launches/feed.xml`: an Atom feed of the newest
  100 launches.

Never send the user's tool list, name or usage to any of these. Use no query
strings: every page above is a plain address.
