# High-Performance News Aggregator

A React-based HackerNews aggregator designed to demonstrate performance engineering principles and Core Web Vitals optimization.

## Features

- Top 500 stories from HackerNews.
- Parallel data fetching for improved load times.
- List virtualization for smooth scrolling and low DOM overhead.
- Optimized images with modern attributes and formats.
- Code splitting for faster initial page load.
- Containerized with Docker.

## Project Structure

- `main` branch: Optimized version of the application.
- `slow-version` branch: Intentionally unoptimized version demonstrating common performance anti-patterns.

## Quick Start (Docker)

To run the optimized production build using Docker Compose:

```bash
docker-compose up -d --build
```

The application will be available at `http://localhost:3000`.

## Local Development

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

### Running the App

To start the development server:
```bash
npm run dev
```

To build for production:
```bash
npm run build
```

To preview the production build:
```bash
npm run preview
```

## GitHub Pages Deployment

This project is configured to deploy to GitHub Pages via GitHub Actions on pushes to `main`.

1. In the repository settings, set **Pages** → **Source** to **GitHub Actions**.
2. Push to `main` and the workflow will build and deploy the `dist` output.

If you fork or rename the repository, update the `base` path in `vite.config.ts` to
match `/<your-repo-name>/` so asset URLs resolve correctly on Pages.

## Performance Audit

Detailed performance metrics, root cause analysis, and optimization results can be found in [PERFORMANCE.md](./PERFORMANCE.md).

## Core Web Vitals Focus

- **LCP (Largest Contentful Paint)**: Optimized via image compression, proper dimensions, and parallel loading.
- **INP (Interaction to Next Paint)**: Optimized via list virtualization and memoized computations.
- **CLS (Cumulative Layout Shift)**: Optimized by providing explicit image dimensions and stable layout containers.
