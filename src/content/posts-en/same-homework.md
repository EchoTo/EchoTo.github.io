---
title: "I Gave Claude Code and Codex the Same Homework"
---

In my last post I wrote that the months I spent with Codex didn't go smoothly: a lot of the time it couldn't work out what I wanted. But that was March to August. I've been using Claude Code since, and haven't done anything with Codex. I wasn't sure that impression still held.

So I wrote a small tool, [agent-race](https://github.com/TonkyShan/agent-race). It gives the same task to both agents, each working in its own git worktree, and afterwards puts their changes, timings and test results side by side.

## How I compared them

I started with one small feature each on my blog and on my news radar: a reading time on post pages, and a flag on the radar's top command to filter by source.

Requests like that are too simple to tell you much. So I picked 5 small changes that had already been merged in my Go rewrite project:

1. When sending a batch of Kafka messages, failures were attributed to the wrong message
2. A missing cache key was treated as an error, so every idle vehicle logged a WARN once a second
3. The simulator sends the lane number as a number, and it was written to the database as empty
4. The Loki server we push logs to turned on authentication, so we needed a configurable tenant
5. The tide direction never changed, but its timestamp kept being refreshed, so the vehicles thought the tide had changed

For each one I reset the code to just before the change, then handed it over in a sentence or two, the way I'd normally describe a request. Number 2, for example, was: "A missing key is normal, don't log it; a real Redis error should still be logged." Every task ended with: only change things locally, don't commit, don't connect to any server.

When both were done, I ran the tests from the original commit. Neither agent could see them beforehand.

The models were Opus 5.5 for Claude Code and gpt-6-astra for Codex.

## Results

| | Claude Code | Codex |
|---|---|---|
| 1. Failure on the wrong message | 58s, correct | 412s, correct |
| 2. WARN on a missing key | 73s, pass | 533s, pass |
| 3. Lane number empty | 77s, missed one spot | model at capacity, no changes |
| 4. Loki tenant | 71s, pass | 561s, different parameter order, didn't compile |
| 5. Tide timestamp | 107s, pass | 1129s, pass |

On number 1 the tests actually failed for both, because the original test calls a function named `errsByRecord`, a name neither of them could have known. Compared against the original change, both found the right cause and fixed it the right way.

Codex goes through my company's gateway, and I can't tell how much of the slowness is down to that. On the earlier radar task, Codex's first run also exited because the model was at capacity, and only finished on a rerun. Claude Code cost about $3 for the 5 tasks.

One more caveat: I made all 5 of these changes with Claude at the time, so the function names and parameter order in the tests follow Claude's habits. That's exactly why Codex didn't compile on number 4. With that, and only 7 tasks, I'm not going to use this to say which one is better.

As far as the results go, neither misunderstood a request. For number 5, which depends more on the business logic, I spelled out which message it was, what was happening, and that both the old and new protocols had to be handled, and both got it right.

What's more worth looking at than who got what right is where the two differed.

## One request, two ways

For the radar task, what I wrote was: "Add a flag to the top command so I can see just one source."

Claude Code filtered: it only shows items seen on that source, with their scores unchanged, so items seen on several sites keep their bonus. Codex re-scored and re-ranked the items using only that source's data.

Both passed the test, and both make sense. When I wrote that sentence, it never occurred to me that it could be read a second way. If I'd given it to just one agent, I'd most likely have used whatever it gave me without realising there was a choice.

## What I didn't mention, neither did

The lane number task is the one neither got fully right.

When I fixed it originally, following the same endpoint further turned up another numeric field that was being written in scientific notation: 1717171717 went into the database as `1.717171717e+09`. We fixed that too.

This time the task only mentioned the lane number. Claude Code fixed the lane number and left the other field alone; Codex happened to hit the capacity error and changed nothing.

They generally don't go looking for things the task doesn't mention. Back then we checked one step further because we'd already been bitten once in production and knew the data types there couldn't be trusted.

## How they reported back

Their final messages were different too.

Codex usually lists the files it changed, the tests it ran, and that they passed.

Claude Code writes down what it hasn't confirmed. On number 1 it said it hadn't run the new test against the old code, and that its conclusion came from reading the code. On number 4 it added the tenant setting but didn't fill in a value for any environment, saying it didn't know the actual tenant ID and leaving that to me.

The size of the changes was mostly similar, with two exceptions: on the radar task Claude Code changed 9 lines and Codex 35; on number 5 Claude Code added 97 lines and Codex 176.

## Update: bigger requests and business requests

The tasks above were all too small. Most of them touched one or two files, and the task text more or less pointed at the spot. So I picked 7 bigger requests from the commit history and ran another round.

### First, a trap

On the first run, Codex changed exactly the same files as the original commit on one task. Looking at the commands it ran, it had used `git log --all` to find the original commit in the repository history, then simply ran `git diff | git apply` and applied the answer.

Claude Code didn't apply it wholesale, but it also went through the history and read the original commit and design docs that were written later.

The problem was mine: the worktree had been reset to before the change, but the repository still held every later commit. I switched to cloning a separate repository for each task containing only the history up to the change, and after each run I checked every command each agent had executed. Any run that went out of bounds was thrown away and rerun.

Nobody told them to dig through the history. To get the job right, they go looking for anything they can use as a reference. If you evaluate agents on historical commits, guard against this first.

### Three general-purpose requests

First, three that have little to do with the business: model fallback for a code review tool, moving a scheduling service from a single instance to active–standby, and a general feature-flag mechanism. Each one changed seven or eight hundred lines originally.

Bigger requests can't be judged by the original tests directly, because the new function names don't match. From the original commit messages I wrote a scoring rubric of 9 to 10 points per task and gave it to a separately launched agent, which didn't know whose work was whose.

| | Claude Code | Codex |
|---|---|---|
| Model fallback (out of 9) | 6.5 | 7 |
| Active–standby (out of 10) | 9.5 | 6 |
| Feature flags (out of 10) | 10 | 6 |
| Average time | 10 min | 22 min |

On model fallback Codex scored slightly higher, but it added a startup check that makes the whole review exit when the check fails, which brings back exactly the problem this request was meant to fix: the review disappearing. On active–standby, Codex imported a package the repository's rules forbid; it released the lock during handover without waiting for in-flight work to finish; and it left a component that depends on in-process state untouched, so in normal operation that component only gets part of its data.

### Four business requests

Finally I picked 4 that are directly about the port business:

1. After the crane releases the lock, the vehicle doesn't respond to a new lock request
2. A production issue: a vehicle loaded in the yard and went straight to the quay crane, and arrived facing the wrong way
3. Add a field for route planning: which way the vehicle faces the moment it reaches its destination
4. During the locking stage the crane sends another signal asking for alignment, and the instruction has to be reset so the vehicle re-aligns

For the first two I used my original words from when I raised the request. For the other two I couldn't find them, so I wrote them from the commit messages, describing only the requirement, not the approach.

| | Claude Code | Codex |
|---|---|---|
| 1. No response after unlock | 5 / 7 | 3.5 / 7 |
| 2. Facing the wrong way | Fixed | Right at first, wrong again after re-parsing once the vehicle turns, and it broke the path through the lock station |
| 3. Arrival heading | 4 / 10 | 2.5 / 10 |
| 4. Reset while locking | 10 / 10 | 8.5 / 10 |

On task 2, Codex changed the expected value of an existing regression test in the repository so that its own change would pass. If you only look at green tests and not at the diff, you'd never notice.

Task 4 has a trap that our own first version fell into: the crane's signal is a held value in a cache, not a one-off, and handled carelessly it loops through reset, align, lock, reset again. This time Claude Code avoided it on the first try.

### Tests can be wrong too

Tasks 1 and 2 have the original tests, so they can be run directly. But twice, the version that failed the test turned out to be correct when the grading agent ran it scenario by scenario along the real call path. One only cancels instructions when the database is configured, and the original test fixture had no database configured. The other moved the decision into the caller, while the original test only exercised that one function.

Going by the tests alone, the conclusion would have been the other way round.

### Domain material doubles the score

Task 3 was the hardest. The rules for arrival heading, such as when to turn around and how many times, aren't in the code. They're in a PDF we put together later.

On the first run I accidentally let them read that PDF, even though it was written after this request, so I removed it and reran. The same Claude Code scored 8 with the PDF and 4 without it.

It's the same point as my last post: it can read the code, but the rules of the site live in our heads and our documents. Without them, it can only guess.

### Code graphs, while I was at it

Code graphs are popular at the moment: parse the repository into a call graph, and supposedly the agent can see what a change will affect. I added a group to these rounds: the same Claude Code, but told to query the graph before making changes.

Across three rounds, the results with and without the graph were about the same. Grepping and reading the code on its own already finds the full scope of a change, and on our Go project the graph also misses some cross-package calls.

### Caveats

The rubrics follow the original implementations, which I wrote with Claude, and the grader is Claude too. All of this leans towards Claude Code, so take the scores as a rough guide. What I trust more are the specific problems the grading agent listed, because those can be checked against the code.

Codex goes through my company's gateway and was interrupted by capacity errors several times; a bigger task meant waiting twenty or thirty minutes. And each group ran each task only once.

## Finally

After the small tasks, my conclusion was that both could get them right and the gap was mostly speed and reliability. With bigger and business requests, the gap isn't only speed. Codex's changes are generally smaller, sometimes small enough to miss places that needed changing.

The tool is still most useful when the request itself isn't fully thought through. Where two agents do things differently is often where my description was unclear. And give them the domain material they need, and read the diff even when the tests are green.

agent-race is open source on [GitHub](https://github.com/TonkyShan/agent-race). Try it on your own repository.
