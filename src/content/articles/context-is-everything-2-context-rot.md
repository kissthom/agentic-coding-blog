---
title: 'Context is everything #2 — Context rot'
description: 'Long sessions accumulate stale facts, and the agent keeps trusting them.'
publishDate: 2026-08-26
tags:
  - coding-agents
  - context
  - anti-patterns
series: 'Context is everything'
seriesOrder: 2
draft: false
---

**Context rot** is what happens when the working set keeps growing but stops
being true. The file the agent read an hour ago has been edited three times
since. The error it is still trying to fix was resolved two commits back.

## How it shows up

| Symptom                                | Likely cause                           |
| -------------------------------------- | -------------------------------------- |
| Re-fixes something already fixed       | Stale file contents in context         |
| Cites a function that no longer exists | Read before a refactor                 |
| Contradicts its own earlier plan       | Two incompatible versions of the truth |

## A worked example

Consider a helper the agent read early in the session:

```ts
// The agent's context still holds this version…
export function parse(input: string): Config {
  return JSON.parse(input);
}
```

…while the file on disk has moved on:

```ts
// …but this is what's actually there now.
export function parse(input: string): Config {
  return ConfigSchema.parse(JSON.parse(input));
}
```

Any suggestion built on the first version is confidently wrong.

## Rules of thumb

1. Re-read before you edit, rather than trusting an earlier read.
2. Treat long sessions as suspect — age is a decent proxy for staleness.
3. Prefer a short, fresh session over a long, rich, rotten one.

See the [Astro docs](https://docs.astro.build/) for an unrelated but pleasant
example of documentation that stays current.
