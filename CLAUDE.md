# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use scripts in package.json

## Architecture

This repo is a **Playwright end-to-end test suite** for a healthcare web app.

### Key files

- `specs/seed.spec.ts` — Setup project: validates the app loads before running specs.
- `specs/test.plan.md` — The test plan with all scenarios, steps, and expected outcomes.
- `specs/*.spec.ts` — Generated test files, one per scenario.
- `specs/helpers/navigateToApp.ts` — Shared helper: registers the dialog handler and navigates to the app.
- `specs/pages/BasePage.ts` — Base class for all Page Objects.
- `playwright.config.ts` — Exports `envConfig` (read from `.env` / `.env.example` fallback).

### Agent workflow

Three Claude subagents power the test lifecycle (defined in `.claude/agents/`):

1. **playwright-test-planner** — Explores the app via browser and writes `specs/test.plan.md`
2. **playwright-test-generator** — Reads the plan, replays each step in a real browser, and writes the `.spec.ts` files
3. **playwright-test-healer** — Runs failing tests, debugs them, and fixes selectors/assertions

The MCP server is `npx playwright run-test-mcp-server` (configured in `.mcp.json`).

### App under test

The app is a patient pre-appointment questionnaire app with:

- A home page with a 5-step carousel (EN/FR language toggle)
- A `/search` page with a Leaflet map and clinic text search
- An `/onboarding/1-3` flow (provider confirmation → how it works → consent checkboxes)
- An `/appointment-scheduling` flow (waiting room → appointment date)
- A `/templates` page for selecting consultation reasons
- A `/summary` page that detects unfinished sessions and prompts to resume or start new
- `/terms` and `/privacy` static pages

### Playwright config

`playwright.config.ts`

### Best practices

#### Page Objects (`specs/pages/`)

- All Page Objects live in `specs/pages/` and extend `BasePage` (`specs/pages/BasePage.ts`)
- `BasePage` holds `readonly page: Page` and the constructor — never redeclare these in subclasses
- Use **getters** instead of `readonly` properties for locators — no constructor, no `super()` needed in subclasses:
  ```ts
  export class SearchPage extends BasePage {
    get searchInput() {
      return this.page.getByRole("textbox", { name: "Search..." })
    }
  }
  ```
- Never put app-specific logic (e.g. dialog handler) in `BasePage` — keep it in the spec's `beforeAll`

#### Spec structure

- Use `test.describe.serial` + a shared `page` created in `test.beforeAll({ browser })` so steps share browser state
- Call `await navigateToApp(page, envConfig.baseUrl, envConfig.appPassword)` in `beforeAll` — handles dialog + goto + expect
- Wrap each `test()` body with `test.step()` to separate actions from assertions — improves HTML report readability
- Use `test.afterAll` to close the shared page

#### Environment

- `.env` — local values (git-ignored)
- `.env.example` — committed template, used as fallback if `.env` is absent
- `envConfig` exported from `playwright.config.ts` — import it in specs instead of using `process.env` directly

#### Test data

- `specs/fixtures/test-data.json` — real test data matching the app (git-ignored)
- `specs/fixtures/test-data.example.json` — committed template with placeholder values
- Each scenario has its own key in the JSON — import and destructure in the spec:
  ```ts
  import testData from "./fixtures/test-data.json"
  const { clinicName, providerName } = testData.healthcareProviderSelection
  ```
- To get started: copy `test-data.example.json` → `test-data.json` and fill in real values
