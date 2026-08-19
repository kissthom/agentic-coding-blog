---
title: 'Context is everything #3 — Context hygiene'
description: "Practical habits for keeping an agent's working set small, fresh, and relevant."
publishDate: 2026-09-02
tags:
  - coding-agents
  - context
  - practices
series: 'Context is everything'
seriesOrder: 3
draft: false
---

If [context rot](../context-is-everything-2-context-rot/) is the disease,
hygiene is the routine that prevents it. None of this is clever; all of it is
easy to skip.

## Start narrow

Give the agent the smallest set of files that could possibly be enough, then let
it ask for more. A broad initial dump feels helpful and mostly adds noise.

## Write things down outside the session

Anything that must survive a restart belongs in the repository, not in the
conversation:

- conventions → `CLAUDE.md` or a docs page
- decisions → an ADR or a commit message
- repeated commands → a script

## Reset deliberately

- End a session when the task ends, not when you run out of patience.
- Start a fresh one for an unrelated task, even if the old one still works.
- Summarise, then restart, for anything long-running.

## A short checklist

```md
- [ ] Does the agent still have the current version of every file it will edit?
- [ ] Is anything in context now irrelevant to the remaining work?
- [ ] Would a new session with three files be faster than continuing this one?
```

That's the whole series. The habits are dull, and they are most of the benefit.
