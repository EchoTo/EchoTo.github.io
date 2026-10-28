---
title: AI Reads the Code, Not the Site
---

While tidying up this blog today, I dug out my records of working with AI agents over the past half year: Codex from March to August, 257 sessions; Claude Code from September until now, 156 sessions. A little over 400 in total.

Before looking, I had a picture of how I use AI. Afterwards, some of it held up and some of it didn't.

## A service that has run for seven years

For most of this half year I've been doing one thing: rewriting, in Go, a Python service my company has been running since 2019. It handles the data going back and forth between autonomous vehicles at several ports and the cloud.

The old service is a little over 60,000 lines, built up by the team over more than 6,800 commits. I started the Go version on May 11 this year. Five and a half months later it has over 1,500 commits, 1,135 of them mine, and 120,000 lines of production code.

About 95% of that was written by AI.

One number surprised even me: in the old service, test code was a tenth the size of the production code. In the new one there are over 90,000 lines of tests, three quarters of the production code. Writing tests used to be a chore you put off as long as you could. Now the AI mostly writes them along the way.

## Where it helped most wasn't writing code

In a rewrite like this, I know the main data paths well. The hard part is the details: a field that needs special handling in one case, a branch that only runs under certain conditions. They're scattered across every corner of the old code, and when a person traces them, something always gets missed.

Having the AI trace them is very fast, and it rarely gets them wrong.

So if you ask me where AI added the most value in this rewrite, my answer isn't "it writes code fast". It's "it can read the system".

## But it doesn't know the site

The service has to support three ports, and each one runs its operations differently.

Once, the AI wrote port A's logic into port B. The code itself looked fine. The problem was that this logic had no business being at that port at all.

That kind of mistake is easy to catch. I knew it was wrong the moment I read what it had just written. But only because I know how those two ports actually operate on site.

The AI may read the code correctly, but it doesn't know how data actually moves on site, or what the business logic and the day-to-day operations are. None of that is in the code. It's in the heads of the people who run the business. If you don't spell it out, the AI can only guess.

Some of it is even harder to see. At one port, the Python code running on the production machine wasn't the same as the code in the repository: there were commits that had never been pushed, and a feature freshly merged in the repository had been reverted on the spot. The Go version, matched against the repository, ended up sending one more step than the site actually did.

After that, a new rule went into the instructions I give the AI: before comparing against the old code, take a snapshot of what's actually running on the production machine. Don't treat the repository as the truth about the site.

## Writing down what isn't in the code

If the AI doesn't know the site, someone has to tell it. My way is to write it down.

At the root of the project there's a file for the agent, 167 lines, which it reads at the start of every session. Most of it isn't about code style; it's about things outside the code: this repository is really two systems merged into one, so when you change one of them, you don't touch the other's modules. Which protocols are live in production and can't change by a single byte, down to preserving the spelling mistakes in the old code exactly as they are.

There's also a log of design decisions, started on the first day of the rewrite, now at 428 entries. Before any significant change, I write down the problem, the decision, the implementation and the caveats, and only then write the code. Those notes are for my future self, and they're for the AI too.

There's one line in those instructions, written by me, that I still think matters most:

> AI can speed up a one-to-one translation. It can't speed up judging whether the translation is right.

So we split "done" into two levels. Code plus unit tests only counts as behaviour frozen. A module only counts as verified once real production data has been replayed through it, the old and new outputs compared byte by byte, and the diff for core modules reviewed by a person. All green tests don't mean it's ready to ship.

## Two surprises in the data

The first surprise: I'd always assumed the AI was mostly writing code for me.

But over these two months Claude Code performed more than 15,000 actions, and 88% of them were commands run in the terminal: searching code, reading logs, running scripts, looking at git history, connecting to servers. Actions dedicated to editing files came to only a few hundred.

Compared with the Codex months:

| What the terminal commands were for | Codex (Mar–Aug) | Claude Code (Sep–Oct) |
|---|---|---|
| Reading and editing files | 44% | 13% |
| Running scripts | 2% | 11% |
| Connecting to servers | 0.1% | 3.8% |

With Codex, it mostly went round in circles inside the code. With Claude Code, it stepped outside the code more and more and touched the real environment. That's the same point as above: reading the code isn't enough to get things right.

(This is just a correlation I see in the numbers. My own work changed over these months too, so not all of it is down to the tools.)

The second surprise: one of my impressions of Codex turned out to be wrong.

I'd always thought Codex was long-winded: a change that only needed a few lines in an existing file, and it would create a whole new file for it. But when I counted, new files were only 10% of its code changes. The vast majority were edits to existing files.

Maybe those few times just stuck with me. Or maybe it really was long-winded, just not in the form of new files. Either way, how it felt and what the data says aren't quite the same thing.

## From "say it precisely" to "say it clearly"

At first the company only gave us Codex. Honestly, it was painful to use, as if it had got dumber: say the same thing, and it often couldn't work out what I actually wanted.

In September we got Claude Code, and my usage jumped. With Codex I averaged about ten sessions a week; after the switch, at the busiest, thirty or forty.

But I think the bigger change isn't which tool I switched to. It's the models themselves. Two months ago you had to write a very precise prompt before it knew what you wanted. Now you can be far less precise and it still does the right thing.

The bar for writing prompts is getting lower. But there's one thing it still can't guess: what's outside the code. What the business is, what the site looks like.

I used to think an engineer's value was in writing code. Now that AI writes 95% of my code, I think what's valuable is knowing what's outside the code, and being able to explain it clearly.
