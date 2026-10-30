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

## Finally

After this, I think the tool is most useful when the request itself isn't fully thought through. If two agents do the same thing, that doesn't tell you much; when they do it differently, it's often my description that's the problem.

agent-race is open source on [GitHub](https://github.com/TonkyShan/agent-race). Try it on your own repository.
