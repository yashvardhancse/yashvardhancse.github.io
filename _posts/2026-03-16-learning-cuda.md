---
title: Learning CUDA
date: 2026-03-16 08:45:00 +0530
categories: [Technical]
tags: [cuda, gpu, parallel-computing]
excerpt: Notes from moving image-processing workloads from CPU loops to CUDA kernels.
---

My goal with CUDA is to build intuition first, then optimize.

## Baseline path

1. Implement CPU version
2. Verify correctness with fixed test images
3. Port to CUDA kernel
4. Profile memory copies and kernel launch overhead

## Early lessons

- Memory transfer can dominate runtime for small workloads.
- Coalesced access patterns matter more than expected.
- Correctness checks must be automated before speed comparisons.

## Next milestone

Build a small benchmark suite around blur, edge detection, and color transform kernels.
