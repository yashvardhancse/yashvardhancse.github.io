---
title: How Redis works internally
date: 2026-03-09 19:30:00 +0530
categories: [Technical]
tags: [redis, systems, databases]
excerpt: Internal model of Redis data structures, persistence modes, and command execution flow.
---

Redis is fast not because of magic, but because of specific design choices.

## Mental model

- Single-threaded command execution for predictable latency
- In-memory data structures (hash tables, skip lists, ziplists/listpacks)
- Optional persistence through RDB snapshots and AOF logs

## Why it performs well

- No heavy lock contention in the main execution path
- Efficient memory layout for common operations
- Event loop architecture for network I/O

## What I am still exploring

- Replication lag behavior under burst writes
- Trade-offs between `appendfsync always` vs `everysec`
