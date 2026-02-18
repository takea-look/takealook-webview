# Issue Tracker Guard (Placeholder automation)

This repository sometimes uses an automation/bot that opens a placeholder issue when it detects **0 open issues**.

## Why it exists
- Prevents the tracker from looking “dead”
- Nudges us to maintain a small, concrete backlog

## Current policy
- The placeholder issue is **not** a real work item.
- If the repo recently completed/closed a batch of real issues, it is OK to **comment + close** the placeholder.

## Recommended improvements (if the bot keeps spamming)
Choose one:
1) Update the automation condition to consider **recently closed issues** (e.g., last 24–72h) instead of only `open == 0`.
2) Disable the automation and keep only real issues.

## How to respond
- Comment with links to the latest completed backlog/PRs.
- Close the placeholder.
