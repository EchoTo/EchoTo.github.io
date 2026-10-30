---
title: "I Gave Claude Code and Codex the Same Homework"
---

In my last post I wrote that the months I spent with Codex didn't go smoothly: a lot of the time it couldn't work out what I wanted. But that was March to August. I've been using Claude Code since, and haven't done anything with Codex. I wasn't sure that impression still held.

So I wrote a small tool, [agent-race](https://github.com/TonkyShan/agent-race). It gives the same task to both agents, each working in its own git worktree, and afterwards puts their changes, timings and test results side by side.

## How I compared them

The tasks all came from the commit history of my Go rewrite project, changes that had already been merged. There were three kinds:

- **Small fixes**, 5 of them: for example, every idle vehicle logging a WARN once a second when a cache key was missing, or a lane number from the simulator arriving as a number and being written to the database as empty;
- **General-purpose bigger requests**, 3 of them: model fallback for a code review tool, moving a scheduling service from a single instance to active–standby, and a general feature-flag mechanism. Each originally changed seven or eight hundred lines;
- **Business requests**, 4 of them: a vehicle under the quay crane not responding to a new lock request after unlocking, a production issue where a vehicle arrived facing the wrong way, adding an arrival-heading field for route planning, and resetting the instruction when the quay crane or gantry crane asks for alignment again during locking.

For each one I reset the code to just before the change, then handed it over in a sentence or two, the way I'd normally describe a request. Where I could find my original words, I used them as they were. Every task ended with: only change things locally, don't commit, don't connect to any server.

The small fixes were judged by the tests from the original commit, which neither agent could see beforehand. For the bigger and business requests, the original tests call newly written functions whose names wouldn't match, so I wrote a rubric from the original commit messages, 7 to 10 points per task, and gave it to a separately launched agent that didn't know whose work was whose.

The models were Opus 5.5 for Claude Code and gpt-6-astra for Codex.

### First, a trap

On the first run of the bigger requests, Codex changed exactly the same files as the original commit on one task. Looking at the commands it ran, it had used `git log --all` to find the original commit in the repository history, then simply ran `git diff | git apply` and applied the answer.

Claude Code didn't apply it wholesale, but it also went through the history and read the original commit and design docs that were written later.

The problem was mine: the worktree had been reset to before the change, but the repository still held every later commit. I switched to cloning a separate repository for each task containing only the history up to the change, and after each run I checked every command each agent had executed. Any run that went out of bounds was thrown away and rerun.

Nobody told them to dig through the history. To get the job right, they go looking for anything they can use as a reference. If you evaluate agents on historical commits, guard against this first.

## Results

Both got the small fixes right. Claude Code took 1 to 2 minutes per task, Codex 7 to 19 minutes, and on one task it hit a capacity error and changed nothing.

The bigger and business requests:

| | Claude Code | Codex |
|---|---|---|
| Model fallback (out of 9) | 6.5 | 7 |
| Active–standby (out of 10) | 9.5 | 6 |
| Feature flags (out of 10) | 10 | 6 |
| No response after unlock (out of 7) | 5 | 3.5 |
| Facing the wrong way | Fixed | Right at first, wrong again after re-parsing once the vehicle turns, and it broke the path through the lock station |
| Arrival heading (out of 10) | 4 | 2.5 |
| Reset while locking (out of 10) | 10 | 8.5 |

With the small fixes, I thought the gap was mostly speed and reliability. Once the requests got bigger, the gap wasn't only speed.

Codex's changes were generally smaller, sometimes small enough to miss places that needed changing. On model fallback it scored slightly higher, but it added a startup check that makes the whole review exit when the check fails, which brings back exactly the problem the request was meant to fix: the review disappearing. On active–standby, it imported a package the repository's rules forbid, and released the lock during handover without waiting for in-flight work to finish. On the wrong-way task, it changed the expected value of an existing regression test so that its own change would pass.

The reset-while-locking task has a trap that our own first version fell into: the quay and gantry cranes' alignment signal is a held value in a cache, not a one-off, and handled carelessly it loops through reset, align, lock, reset again. This time Claude Code avoided it on the first try.

## One request, two ways

More interesting than who scored higher is where the two differed.

Besides these tasks, I tried a small feature on my news radar. What I wrote was: "Add a flag to the top command so I can see just one source."

Claude Code filtered: it only shows items seen on that source, with their scores unchanged. Codex re-scored and re-ranked the items using only that source's data.

Both passed the test, and both make sense. When I wrote that sentence, it never occurred to me that it could be read a second way. If I'd given it to just one agent, I'd most likely have used whatever it gave me without realising there was a choice.

## What isn't said, they can't know

On the lane-number task, when I fixed it originally, following the same endpoint further turned up another numeric field being written in scientific notation: 1717171717 went into the database as `1.717171717e+09`. We fixed that too. This time the task only mentioned the lane number, and both only fixed the lane number. Back then we checked one step further because we'd already been bitten once in production and knew the data types there couldn't be trusted.

The arrival-heading task shows it most clearly. When to turn around and how many times aren't in the code; they're in a PDF we put together later. On the first run I accidentally let them read that PDF, even though it was written after this request, so I removed it and reran. The same Claude Code scored 8 with the PDF and 4 without it.

It can read the code, but the rules of the site live in our heads and our documents. What's spelled out, they get right. What isn't, they can only guess.

## Tests can be wrong too

On one small fix, neither passed the test, because the original test calls a function named `errsByRecord`, a name neither of them could have known. Compared against the original change, both found the right cause and fixed it the right way.

Twice in the business requests, the version that failed the test turned out to be correct when the grading agent ran it scenario by scenario along the real call path. One only cancels instructions when the database is configured, and the original test fixture had no database configured. The other moved the decision into the caller, while the original test only exercised that one function.

And the other way round: Codex changed a test's expected value, and the tests were green. Going by the tests alone, you'd get the conclusion backwards. You still have to read the diff.

## How they reported back

Their final messages were different too.

Codex usually lists the files it changed, the tests it ran, and that they passed.

Claude Code writes down what it hasn't confirmed. On one task it said it hadn't run the new test against the old code, and that its conclusion came from reading the code. On another it added a setting but didn't fill in a value for any environment, saying it didn't know the actual value and leaving that to me.

## Code graphs, while I was at it

Code graphs are popular at the moment: parse the repository into a call graph, and supposedly the agent can see what a change will affect. I added a group to these rounds: the same Claude Code, but told to query the graph before making changes.

Across all three kinds of task, the results with and without the graph were about the same. Grepping and reading the code on its own already finds the full scope of a change, and on our Go project the graph also misses some cross-package calls.

## Caveats

I made these changes with Claude originally, the rubrics follow those implementations, and the grader is Claude too. All of this leans towards Claude Code, so take the scores as a rough guide. What I trust more are the specific problems the grading agent listed, because those can be checked against the code.

Codex goes through my company's gateway and was interrupted by capacity errors several times; a bigger task meant waiting twenty or thirty minutes. And each group ran each task only once.

## Finally

The tool is most useful when the request itself isn't fully thought through. If two agents do the same thing, that doesn't tell you much; where they do it differently is often where my description was unclear.

And give them the domain material they need, and read the diff even when the tests are green.

agent-race is open source on [GitHub](https://github.com/TonkyShan/agent-race). Try it on your own repository.
