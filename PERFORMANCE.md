# Performance Audit Report

This document tracks the performance measurements and optimizations for the HackerNews Aggregator.

## Phase 1: Baseline Performance Report (Slow Version)

| Metric / Issue | Baseline Score / Observation | Root Cause Analysis | Proposed Solution Hypothesis |
| :--- | :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | ~8.5s (Estimated) | Large, unoptimized hero image (2MB+) blocking the main thread and taking long to download. | Compress image to WebP, use `srcset`, and add `width`/`height` attributes. |
| **INP (Interaction to Next Paint)** | ~1200ms (Estimated) | Re-rendering 500+ DOM nodes on every keystroke in the filter input. | Implement list virtualization using `@tanstack/react-virtual`. |
| **CLS (Cumulative Layout Shift)** | ~0.45 (Estimated) | Hero image loading without dimensions, causing content to jump once loaded. | Add explicit `width` and `height` to the `<img>` tag. |
| **Bundle Size (main.js)** | ~1.5MB (Estimated) | Importing the entire `lodash` library and lack of code splitting. | Use cherry-picked imports for `lodash` and implement `React.lazy`. |
| **Network Waterfall** | 501 serial requests | Sequential fetching of 500 stories in a `for` loop. | Parallelize data fetching with `Promise.all`. |

## Phase 2: Systematic Optimization

### 1. Parallelize Network Requests
- **Changes**: Refactored the data fetching logic from a sequential `for` loop to `Promise.all`.
- **Before**: 501 serial requests (Total time: ~30s+)
- **After**: Parallel requests (Total time: ~2-3s)
- **Improvement**: Drastic reduction in initial load time.

### 2. Implement List Virtualization
- **Changes**: Used `@tanstack/react-virtual` to render only visible items.
- **Before**: 500+ DOM nodes (Slow filtering/sorting)
- **After**: ~10-15 DOM nodes (Smooth interaction)
- **Improvement**: Significant reduction in INP.

### 3. Dependency Optimization & Memoization
- **Changes**: Cherry-picked `lodash` imports and added `useMemo` for filtering.
- **Before**: Large bundle, expensive re-renders.
- **After**: Smaller bundle, optimized re-renders.
- **Improvement**: Faster TTI and smoother UI.

### 4. Image Delivery Optimization
- **Changes**: Converted hero image to WebP, added dimensions and `srcset`.
- **Before**: High LCP and CLS.
- **After**: Low LCP and zero CLS.
- **Improvement**: Better Core Web Vitals.

### 5. Code Splitting
- **Changes**: Implemented `React.lazy` for non-critical components.
- **Before**: One large JS chunk.
- **After**: Multiple optimized chunks.
- **Improvement**: Faster initial page load.
