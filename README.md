# Mainstack Revenue Dashboard

A responsive revenue dashboard built with React, TypeScript, and Vite. It connects to the Mainstack FE task API to surface wallet metrics, render cumulative revenue trends, and list recent transactions with contextual status indicators.

## Features

- Revenue summary cards with ledger, payout, and revenue totals sourced from the remote wallet API.
- Available balance panel with a Recharts area visualization that aggregates transactions by day.
- Transaction feed that highlights deposits, withdrawals, pending, and failed payments with tailored visuals.
- Filter drawer skeleton for narrowing transaction data (UI in place and ready for future wiring).
- Robust empty, loading, and error states to keep the experience clear across edge cases.

## Tech Stack

- React 19 + TypeScript, bundled with Vite.
- Tailwind CSS (via the official Vite plugin) for styling.
- React Query for data fetching and caching.
- Recharts for lightweight data visualization.
- Vitest for unit testing utilities.

## Getting Started

### Prerequisites

- Node.js 18 or newer.
- npm 9+ (ships with modern Node releases).

### Installation

```bash
npm install
```

### Running the app

```bash
npm run dev
```

The dev server starts on http://localhost:5173 by default. The app reads data from `https://fe-task-api.mainstack.io`.

### Production build

```bash
npm run build
npm run preview
```

## Testing

Minimal unit coverage lives under `src/utils`. Run the suite with:

```bash
npm run test
```

Vitest executes tests once in run mode; append `--watch` locally for rapid feedback.

## Project Structure

```
src/
  components/        // Reusable UI elements and feature components
  pages/             // Top-level route screens
  services/          // API client and React Query hooks
  utils/             // Formatting helpers and testable utilities
```

## Linting

```bash
npm run lint
```

The ESLint configuration ships with the project and enforces TypeScript best practices.

## Environment Notes

- All API calls are read-only and use browser `fetch`. No extra configuration is required.
- Tailwind CSS utilities are available globally via `@tailwindcss/vite`.

Feel free to adapt the dashboard, extend the filtering panel, or wire additional tests around UI components as you iterate.
