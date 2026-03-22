# Playwright E2E Test Suite

Playwright end-to-end test suite powered by AI agents for automated test planning, generation, and healing.

## Stack

- [Playwright](https://playwright.dev/) — E2E testing framework
- [Claude Code](https://claude.ai/code) — AI agents for test lifecycle automation

## AI Agents

| Agent | Role |
|---|---|
| `playwright-test-planner` | Explores the app and writes `specs/test.plan.md` |
| `playwright-test-generator` | Reads the plan, replays steps in a real browser, writes `.spec.ts` files |
| `playwright-test-healer` | Runs failing tests, debugs and fixes selectors/assertions |

## Setup

```bash
npm install
npx playwright install
```

Copy and fill in the config files:

```bash
cp .env.example .env
cp specs/fixtures/test-data.example.json specs/fixtures/test-data.json
```

## Commands

```bash
npm test              # run all tests
npm run test:headed   # run with visible browser
npm run test:ui       # open Playwright UI
npm run test:debug    # debug mode
npm run report        # open HTML report
```

## Structure

```
specs/
├── fixtures/         # test data (test-data.json is git-ignored)
├── helpers/          # shared helpers (navigateToApp)
├── pages/            # Page Objects extending BasePage
└── *.spec.ts         # test files
```
