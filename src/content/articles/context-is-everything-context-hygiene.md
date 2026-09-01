---
title: 'Context is Everything #3 — Context Hygiene'
description: 'Two moves stand between you and a rotten session: clear and compact. What each one actually does, when to use which, and why writing things down beats both.'
publishDate: 2026-09-05
tags:
  - coding-agents
  - context
draft: true
---

So now we know what context is, why it has such a central role, and how to
recognise when a session is starting to drift — or is already
[properly rotten](../context-is-everything-context-rot/).

Time to actually do something about it.

The good news: you mostly have **two moves**.

`/clear` and `/compact`.

(There is at least a third option — handing work to subagents — but that one
deserves its own article.)

## 🧼 Clear — the hard reset

![Men in Black: Agent J raising the neuralyzer, saying "Don't even worry about it" — one flash and everything that just happened is gone](./images/context-hygiene-clear.gif)

`/clear` is the hard reset.

It throws away everything that piled up during the session: your messages,
Claude's responses, the files it read, the commands it ran, the test output, the
dead ends.

What stays is everything that was there **by default**: the system instructions,
your project and memory files, the tools, the model.

Claude basically forgets the conversation and starts fresh.

![/clear — start fresh: three buckets side by side. Before /clear the working context is crowded with recent conversation, files and code we read, tool results, test output, decisions and assumptions, earlier conversation, more files, more results, old attempts and dead ends. After /clear the middle bucket is completely empty — all history, messages, files, results and decisions gone. In the third, only the essentials are back: system instructions, memory and project instructions, and the new messages and responses you start adding from the current task](./images/context-hygiene-clear-buckets.png)

And here's the part that makes it much less scary than it sounds:

**Clearing doesn't delete your work.**

Your files are still on disk. Your commits are still in Git. Your `CLAUDE.md` is
still loaded. The only thing that disappears is the conversation.

Cheap, brutal, and very often exactly the right move.

## 🗜️ Compact — the summary

![A controlled demolition: an entire office block folding down into its own footprint, leaving the skyline behind it visible again](./images/context-hygiene-compact.gif)

`/compact` is the softer option.

Instead of throwing the session away, Claude **summarises it**: what we were
doing, what we decided, where we got to — and continues from that short summary
instead of the full history.

![/compact — keep the signal, lose the noise: three buckets side by side. Before /compact the working context is crowded with many conversation turns, many versions of files, tool results, test output, discussions, old attempts and dead ends. After /compact the same topic is condensed into a summary of key points, the current goal and plan, the important decisions, the relevant current files, the essential tool results, the latest test status and the open questions. The third bucket shows the room left over to keep working in the same topic with a cleaner context](./images/context-hygiene-compact-buckets.png)

Models are genuinely good at summarising. But — and you can probably guess where
this is going — **the same rules apply here as everywhere else**.

The longer and more polluted the context is, the harder it is for the model to
decide what actually matters. A rotten context doesn't produce a clean summary.
It produces a **rotten summary**, just a shorter one.

Which is exactly why the timing matters more than the move.

### You can tell it what to keep

`/compact` takes optional instructions:

```
/compact Focus on the migration plan we agreed on and the files we already changed.
```

I use this occasionally — usually when I don't want to lose something we've
already established for the next step, or when a long analysis or planning
session has grown too big.

Does it really work? It works well for me. Although I have to be honest: I can
never really compare it to the alternative universe where I just kept going
without compacting. :)

### Don't wait for auto-compact

Claude Code also compacts **automatically** when you're about to run out of
context.

That sounds convenient. But think about what it actually means, based on the
previous article:

The summary gets written at the exact moment when the context is at its
**fullest, noisiest and most contradictory**.

Do you really want the model to decide what's relevant right then?

So don't treat auto-compact as your context strategy. It's a safety net, not a
plan. If it fires regularly, you waited too long.

## So when do I use which?

There's no universal rule for when to clean up.

The honest answer is that it depends on the model, the window and the task. Your
context window might be 200k tokens, and with some newer models and setups it can
be a lot bigger — up to 1M in Claude Code. The advice I've seen most often is to
start thinking about it a couple of hundred thousand tokens in, and if you're
past half the window, definitely.

But those numbers keep changing with every model release, so don't cling to them.

My default is: **prefer clear.** Clean is clean. :)

When it's not that obvious, these usually help me decide:

**Use `/clear` when…**

- you finished a feature
- you're starting a new, unrelated task
- the session has gone in circles
- you hit two rot symptoms in a row

If you follow that list closely enough, it turns into a habit worth naming:

**One task, one session.**

The task is done, so the session is done. Clear, and let the next task start from
a clean bucket instead of inheriting the previous one's leftovers.

**Use `/compact` when…**

- you're mid-task and really need to continue
- the plan only lives in the chat, not in a file
- you're about to hit the context limit
- you can actually verify that the summary is right

That last one matters more than it looks. A summary you didn't read is just a
smaller pile of information you don't control.

## The better answer: write it down

Honestly though, both moves are damage control.

What works much better is not needing them in the first place:

**Plan with the agent, write the plan into a file, then clear the context.**

Now you can continue from the file — which is a summary you actually read,
reviewed and can correct. And you can do that as many times as you like, because
the file doesn't rot.

It also means the "expensive" part of the session — the thinking, the decisions,
the plan — survives, while the noisy part — the file dumps, the failed attempts,
the wall of test output — doesn't.

I'll show this workflow in action in a few articles, but we need to cover a
couple more basics before that.

## 🔎 A small tip: make your context visible

It's a lot easier to keep the context healthy if you can actually see it.

Claude Code has a `/context` command that shows you what's currently taking up
space in the window.

And you can keep an eye on it permanently with a status line. Add this to your
personal config in `~/.claude/settings.json` — this one shows the model name and
the current context usage:

```json
{
  "statusLine": {
    "type": "command",
    "command": "jq -r '\"[\\(.model.display_name)] \\(.context_window.used_percentage // 0)% context (\\(((((.context_window.current_usage.input_tokens // 0) + (.context_window.current_usage.cache_creation_input_tokens // 0) + (.context_window.current_usage.cache_read_input_tokens // 0)) / 100) | floor) / 10)k)\"'"
  }
}
```

If your settings file already has other keys in it, just merge the `statusLine`
block into it.

Watching that number climb changes how you work. You stop being surprised by
auto-compact, and you start clearing at natural boundaries instead of at the
worst possible moment.

## Next time

Clearing is cheap — but only if starting over is cheap.

Right now, every fresh session means Claude has to rediscover the same things
again: how the project is structured, which conventions we follow, how to run the
tests.

Wouldn't it be nice if it just... knew?

That's what we'll look at next: **memory files**.

Tamas
