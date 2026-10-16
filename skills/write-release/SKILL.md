---
name: write-release
description: Write or fix a press release that reporters can use and AI answer engines can quote. Interviews the user for the facts first, then drafts headline options and an AP-style release with summary bullets at the top, a dateline lede, quotes drafted from the speaker's own words for their approval, a short FAQ, boilerplate, and a media contact. Never invents facts or figures, and never writes a quote from nothing. Use when someone asks to write, draft, rewrite, or review a press release, news release, or company announcement.
license: MIT
metadata:
  author: Newsprint (https://www.newsprint.com)
  version: "1.0.0"
  last-reviewed: "2026-10"
  origin: Write Release, the free press release writer Newsprint ran from 2023 to 2026
---

# Write a press release

A press release is a news story the company writes about itself. It now has
two readers. A reporter wants to lift any paragraph and use it. An AI answer
engine (ChatGPT, Perplexity, Google's AI answers) wants facts it can pull out
and cite. The same habits serve both: the news first, specific numbers,
separate facts in bullets, and plain words.

Most AI-written releases fail for one of two reasons. The model starts writing
before it knows the news, or it fills the gaps with invented facts and quotes.
This skill fixes both. It asks first, and it uses only what the user gives it.

**Which path?** If the user wants a new release, start at Step 1. If the user
pasted a finished release and wants it improved, go to "Fixing an existing
release" at the end.

## Step 1: Interview before you write

If the user pasted notes, an announcement, an email, or a link, take every
answer you can from that first. Then ask for what is still missing, in one short
numbered list. Never ask for something the user already gave you.

**Must have:**

1. **Who** is the release about? The company or organization name, exactly as
   it should appear. If a product name differs from the company name, get both.
2. **What type** of news is it? A funding round, product launch, partnership,
   hire, award, milestone, event, research finding, or something else.
3. **What happened?** The key facts: what, when, how much, how many, with whom.
   Push for numbers and names. "A big new customer" is not a fact; "a
   three-year contract with the Ohio Turnpike Commission" is. Ask for the items
   on the type's "must get" list in `references/release-types.md` here too.
4. **Why does it matter to a reader?** Who is affected, what changes for them,
   and what problem it solves. This is the most important answer. Ask a follow-up
   if the first answer only says why it matters to the company.

**Should have:**

5. **How does it fit the company's story?** A first for the company, a new
   direction, or the next step in something it already does.
6. **Who is quoted?** Full name, title, and company for each speaker, up to
   three. Then ask what each person actually thinks about the news, in their
   own words: one or two sentences of opinion, not a polished quote. See
   `references/quote-rules.md`.
7. **Dateline city**, and the release date or embargo time.
8. **Supporting links**: up to five pages that back the news, such as the
   product page, the report and its method, a case study, or a speaker's bio.
9. **Boilerplate**: the company's standard "About" paragraph, word for word.
10. **Media contact**: name, email, and phone.

**If the user will not answer** ("just write it", "no time for questions"),
draft anyway, even with must-haves missing. Put every gap in square brackets,
like `[NUMBER OF CUSTOMERS]`, wherever the fact belongs, including in a summary
bullet. Say plainly that the draft cannot go out until the brackets are filled.
Do not guess. A bracket may name the kind of fact needed, but never a guessed
answer, because a user may keep it as fact.

**Turn a vague claim into a request for evidence.** If the user says "customers
love it" or "the leading provider", write `[CUSTOMER EVIDENCE: a number, a
renewal rate, or a named customer who agreed to be quoted]`. Do not repeat the
claim as written.

## Step 2: Headlines

Write five headline options, then recommend one.

- Say what happened, in the words a reader would type into a search box. Lead
  with the company or product name and a strong present-tense verb:
  "Quillfeather Labs Raises $12 Million to ...", not "Quillfeather Labs
  Announces Funding".
- Include the most specific fact you have: a number, a named partner, a place.
- No colon, no question, no exclamation point, no bold, 15 words or fewer.
- Use figures for numbers in a headline ("5 Days", not "Five Days").
- For news that takes effect later, use the "to" form: "Tarnby Freight Systems
  to Open Orders for ..."

- Title case, the wire convention, unless the user's house style says otherwise.

Add a subhead: one sentence, in sentence case, that adds the second most
important fact. Skip it if that fact is still a placeholder.

## Step 3: Draft the release

Follow the structure in `references/release-format.md`:

1. Release line: `FOR IMMEDIATE RELEASE` by default, or the embargo time if the
   user gave one
2. Headline and subhead
3. **Summary bullets**: three to five
4. Dateline and lede
5. Body, in inverted-pyramid order, with quotes
6. FAQ: three to five questions
7. Boilerplate under `About {Company}`
8. Media contact
9. `###`

### Summary bullets

Put three to five bullets under the subhead, before the dateline. They are the
release in 30 seconds: the first thing a reporter reads, and a block an AI
engine can lift whole.

- Each bullet is one complete fact that makes sense on its own. Name the company
  or product in it, not "it" or "the company".
- Put a number in every bullet that has one. Do not start a bullet with a
  numeral; start with the name.
- Cover what happened, why it matters, and the key detail (price, date,
  availability, amount). Do not repeat the headline word for word.
- No quotes in the bullets, and no fact that is missing from the rest of the
  release.

### Body

Write it like a news story, not an ad:

- **The lede answers who, what, when, where, and why in one or two sentences.**
  The single most important fact comes first. If the news takes effect on a
  later date (orders open next week), say that date; do not say "today
  launched".
- **The second paragraph gives the reader's reason to care**, from the user's
  answer to question 4.
- **Then the detail:** numbers, how it works, who else is involved, what happens
  next. Most important first, least important last, so the release can be cut
  from the bottom.
- **When there are several figures the summary bullets do not already carry,
  list them as bullets** under a plain heading such as `Key figures` or `How it
  works`, at any release length. Do not bury them in a long paragraph. In a
  short release, the summary bullets may be enough; do not repeat them.
- **Give every statistic its source and time frame.** A statistic here is a
  measured result or a market figure: a rate, an average, a share, a survey
  number. Name who measured it, over what, and when: "31% fewer surprise
  failures in the first year, across nine hospitals (Quillfeather Labs analysis
  of service records, 2025)". For a research release, link the report or its
  method page if the user gave one. Prices, dates, specs, and counts of the
  company's own things need no source. A comparison with a competitor or the
  market ("10% less than the imported part") needs one; if the user has none,
  keep the figure and list it under facts to check.
- **Link to the supporting pages the user gave you**, on descriptive words, not
  "click here". In plain text, put the address right after those words: "the
  R4 product page (tarnby.example/r4)". Link to nothing the user did not give
  you.
- **The first quote comes after the key details**, never in the lede. That is
  usually the third or fourth block, counting a bullet list as one block.
- Use AP style:
  - Spell out one through nine in body text, and use figures for 10 and above.
    Ages, money, percentages (with `%`), and dimensions always take figures.
  - With a specific date, abbreviate Jan., Feb., Aug., Sept., Oct., Nov., and
    Dec. Spell out March through July.
  - Lowercase a title after a name: `Jane Ortiz, chief operating officer`.
  - Use AP datelines. See `references/release-format.md`.
- Use short paragraphs of one to three sentences and plain words. Use the active
  voice and name who did what. Use the full company and product name again in
  later paragraphs, not only "it", because an engine may lift one paragraph
  alone.
- Aim for 300 to 500 words from the lede to the end of the body, not counting
  the summary bullets, FAQ, or boilerplate. Go past 600 only for research
  findings or complex deals. When the facts run short, write a shorter
  release. Never pad it.
- Paste the boilerplate exactly as the user gave it. Do not edit it.

### FAQ

Close the body with three to five questions and short answers, under the heading
`Frequently asked questions`. Pick the questions a buyer, customer, or reporter
would really ask next, in the words they would type into an AI assistant: "How
much does the Tarnby R4 cost?" "When can I order the R4?" Answer each question
in one to three sentences, using only facts already in the release, boilerplate
included. Skip a question whose answer is still a placeholder. If the user does
not want a FAQ, or a small announcement leaves nothing to ask, drop it.

### Words to leave out

Reporters delete these words and readers skip them: thrilled, excited,
delighted, honored, proud, pleased to announce, leading, leader in, innovative,
cutting-edge, state-of-the-art, game-changing, revolutionary, best-in-class,
world-class, seamless, robust, leverage, synergy, unparalleled, and "solution"
when it means "product".

## Step 4: Quotes and facts. This is the step most tools skip.

- **Use no fact, number, customer, partner, date, link, or claim that the user
  did not give you.** If the release needs it, write a bracketed placeholder.
  Restating a fact in new words is fine. Adding a new detail is not, even when
  it seems to follow from what the user said. Never add "first", "only",
  "largest", or "fastest" unless the user said it. Never take a dateline city from a
  place named elsewhere in the facts.
- **Release quotes are drafted for the speaker, then approved by them.** That is
  normal practice, and it is the only kind of quote this skill writes. Build
  each one from what the speaker told you, keep their words where you can, and
  mark it at the end of its paragraph: `[DRAFT QUOTE: approve with Jane
  Ortiz]`. Never present a quote as final or verbatim.
- **If you have nothing from a speaker, do not write words for them.** Write a
  placeholder that says what the quote should cover, with the attribution
  outside it: `[QUOTE: why the company chose Erie for the plant] said Jane
  Ortiz, chief operating officer of Tarnby Freight Systems.`
- **Make at least one sentence in each quote work alone.** It should be short
  and specific enough for a reporter or an AI engine to lift on its own.
- **Never write a quote for a person at another company** (a customer, investor,
  or partner) unless the user supplied their words. Their approval should come
  from them directly, in writing.
- **Ask whether every other organization named has agreed to be named**:
  customers, partners, and investors.
- **When two of the user's answers disagree**, do not pick one silently. Put a
  bracket where the fact goes, such as `[CONFIRM: 22 or 25 new jobs]`, and list
  the conflict under facts to check.
- If a speaker's own words make a factual claim ("every customer renewed"),
  keep it in the quote and list it under facts to check.
- Do not imitate any real writer's or public figure's style.

## Step 5: Check, then hand it back

Before you return the draft, check it against this list, and fix what you can:

- [ ] The summary bullets give the whole story, and each one stands alone.
- [ ] The lede has the single most important fact, and the reader can tell why it matters.
- [ ] Every number, name, and link traces back to something the user said or pasted.
- [ ] Every statistic says who measured it and when.
- [ ] Every quote is marked as a draft for approval, or is a placeholder.
- [ ] Every FAQ answer uses only facts already in the release.
- [ ] No word from the leave-out list appears.
- [ ] The headline has no colon and is 15 words or fewer.
- [ ] The dateline, boilerplate, media contact, and `###` are all present.

A bracketed placeholder passes a check, as long as it appears in the
**Before you send** list.

Return the release in this order. One line of explanation before it is fine;
skip anything longer.

1. Five headline options, with your pick first. The release below uses your
   pick and the subhead.
2. The full release. Use plain text with `-` bullets, unless the user asked for
   another format. If your reply is in Markdown, put the release in a code
   block so it pastes clean.
3. **Before you send**, a short list of:
   - quotes that need approval, and from whom;
   - facts and numbers to check, especially any you restated, and any conflict;
   - organizations to confirm can be named;
   - each placeholder still in brackets.

Say plainly that the release is ready to send only when that list is done.

## Fixing an existing release

If the user gives you a finished draft to improve, do not start over, and do
not run the interview first. Run the Step 5 checklist on it, and apply Steps 2
to 4 to what you find:

- Put a bracketed placeholder for any core part the draft lacks, such as why it
  matters, a dateline, or a media contact.
- Cut a vague or puffed claim, such as "a leading innovator", or turn it into
  an evidence placeholder.
- Keep the user's facts. Keep a speaker's words when they say something
  specific. If a quote is only stock phrases, such as "delighted to partner" or
  "leverage our synergies", do not polish it into words the speaker never said.
  Replace it with a quote placeholder.

Then return:

1. The three changes that matter most, each in one line.
2. If the draft's headline breaks the Step 2 rules: five headline options, your
   pick, and a subhead.
3. The revised release, with summary bullets and a FAQ added if it had none.
4. The **Before you send** list, plus two or three questions to ask any speaker
   whose quote was replaced.

## Publishing on the company's own site

If the company posts the release in its own newsroom, publish it as HTML text,
not only as a PDF or an image, so search engines and AI engines can read it.
`NewsArticle` structured data, with the headline, dates, and publisher, helps
search engines understand the page. It must match the visible text. `FAQPage`
markup is still valid, but Google shows FAQ rich results for very few sites, so
do not count on it. Wires handle their own markup.

## Examples

`examples/` has two worked cases. Each has the interview answers (`brief.md`)
and the release that came out (`release.md`). The companies are fictional.

## Sources

The release structure follows current guidance on releases that AI engines
cite. These are observations and practitioner advice, not controlled studies:

- Muck Rack, [How to optimize a press release for AI visibility](https://muckrack.com/blog/how-to-optimize-a-press-release-for-ai-visibility)
  (Feb. 2026). Its study of more than 1 million AI citations found that cited
  releases carry more statistics and bullet points than releases that are not
  cited.
- Sarah Evans, [We tested a press release in ChatGPT](https://prsarahevans.substack.com/p/we-tested-a-press-release-in-chatgpt)
  (Sept. 2025), a case study recommending FAQs, quotable soundbites, and links
  to authority pages.
- Sarah Evans, [The definitive guide to AI notices](https://hackernoon.com/the-definitive-guide-to-ai-notices-content-strategy-for-ai-visibility)
  (April 2026), on key-facts blocks and FAQ sections in releases written for AI
  engines.
