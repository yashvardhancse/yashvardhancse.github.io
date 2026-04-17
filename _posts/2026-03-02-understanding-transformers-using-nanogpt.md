---
title: Understanding Transformers using nanoGPT
date: 2026-03-02 10:00:00 +0530
categories: [Technical]
tags: [transformers, nanogpt, llm]
excerpt: A practical walkthrough of the core transformer blocks by reproducing them in nanoGPT.
---

Transformers look complex at first, but the core idea is surprisingly clean: learn contextual token representations through attention.

## What I focused on

- Token and positional embeddings
- Multi-head self-attention
- Feed-forward block
- Residual connections and layer normalization

## Practical takeaway

Reproducing attention in nanoGPT made one concept clear for me: each token creates a weighted read over all previous tokens, and those weights are data-dependent.

## What I am revising next

- Why scaling by $\sqrt{d_k}$ stabilizes gradients
- Causal masking and generation behavior
- KV-cache intuition for inference
