---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: [docs/index.md, _bmad-output/analysis/brainstorming-session-2026-01-15.md]
workflowType: 'research'
lastStep: 5
status: 'completed'
research_type: 'technical'
research_topic: 'Estrategias de Testing para aplicaciones Next.js'
research_goals: 'Coverage 0%→progresivo, unit/integration/E2E, testing con TypeScript, CI/CD integration'
user_name: 'Angel DevStack'
date: '2026-01-18'
web_research_enabled: true
source_verification: true
---

# Research Report: Testing Strategies for Next.js

**Date:** 2026-01-18
**Author:** Angel DevStack
**Research Type:** Technical

---

## Research Overview

Investigación técnica exhaustiva sobre estrategias de testing para aplicaciones Next.js, cubriendo:

1. Unit testing de componentes React
2. Integration testing de hooks y estado
3. E2E testing (Playwright/Cypress)
4. Testing de API routes Next.js
5. Integración con CI/CD

Metodología: Datos web actuales con verificación rigurosa de fuentes.

---

## Technical Research Scope Confirmation

**Research Topic:** Estrategias de Testing para aplicaciones Next.js
**Research Goals:** Coverage 0%→progresivo, unit/integration/E2E, testing con TypeScript, CI/CD integration

**Technical Research Scope:**

- Unit Testing - Jest, React Testing Library, component testing
- Integration Testing - hooks, state management, data fetching
- E2E Testing - Playwright, Cypress, user flows
- API Testing - Next.js API routes, mocking strategies
- CI/CD Integration - pipeline optimization, coverage reporting

**Scope Confirmed:** 2026-01-18

---

## Step 2: Technology Stack Analysis

### 2.1 Unit Testing - Jest + React Testing Library

#### Configuración Base para Next.js 14 App Router

**Instalación de dependencias:**
```bash
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom ts-node @types/jest
```

**Configuración jest.config.js con `nextJest`:**
```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};

module.exports = createJestConfig(customJestConfig);
```

#### Limitaciones con App Router y Server Components

> ⚠️ **Importante:** Dado que los async Server Components son nuevos en el ecosistema React, Jest actualmente **no los soporta**. Mientras que puedes ejecutar unit tests para Server y Client Components síncronos, Next.js recomienda usar **E2E tests para componentes async**.

**Estrategia recomendada por Next.js:**
- Unit tests → Componentes síncronos (Client Components, Server Components sin await)
- E2E tests → Componentes async, flujos completos

#### Mocking de next/navigation

```javascript
// jest.setup.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));
```

#### Testing de Páginas Async

```javascript
// Para unit testing de páginas async, mockear fetch global
beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: 'mocked' }),
    })
  );
});
```

**Fuentes:**
- [Testing: Jest | Next.js Official Docs](https://nextjs.org/docs/pages/guides/testing/jest)
- [NextJs 14 — App Router and Unit Testing](https://dev.to/albertocubeddu/nextjs-14-app-router-and-unit-testing-w-async-pages-3mml)
- [Mastering Jest in Next.js - DEV Community](https://dev.to/alaa-samy/mastering-jest-in-nextjs-a-complete-guide-for-app-router-and-typescript-o28)

---

### 2.2 Integration Testing - Hooks y State Management

#### Filosofía: NO Mockear Selectores ni Hooks de Redux

> ⚠️ **Anti-patrón:** No intentes mockear funciones de selectores o hooks de React-Redux. Mockear imports de librerías es frágil y no da confianza de que el código real funciona.

**Recomendación oficial de Redux:**
- Preferir **integration tests** que incluyan todo trabajando junto
- Assertions orientadas a verificar comportamiento desde perspectiva del usuario

#### Custom Render con Providers

```typescript
// test-utils.tsx
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { setupStore, RootState } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof setupStore>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState = {},
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </Provider>
    );
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}
```

#### Testing de RTK Query Hooks

```typescript
// Para RTK Query, necesitas setupListeners
import { setupListeners } from '@reduxjs/toolkit/query';

export function renderWithProviders(ui, options) {
  const store = setupStore(options?.preloadedState);
  setupListeners(store.dispatch);
  // ... resto del wrapper
}
```

**Fuentes:**
- [Writing Tests | Redux Official](https://redux.js.org/usage/writing-tests)
- [How to test RTK Query with Jest and RTL](https://remarkablemark.org/blog/2023/03/28/how-to-test-redux-toolkit-query/)
- [RTK Query & Mock Service Worker | adjoe](https://adjoe.io/company/engineer-blog/meet-paridokht-rtk-query-mock-service-worker/)

---

### 2.3 E2E Testing - Playwright vs Cypress

#### Comparativa de Performance (2025-2026)

| Aspecto | Playwright | Cypress |
|---------|------------|---------|
| **Tiempo ejecución** | ~4.5 segundos | ~9.4 segundos |
| **Paralelización** | Nativa (sharding) | Requiere CI config o Dashboard |
| **Caso real** | 14 min (15 parallels) | 90 min (5 paid parallels) |

> 📊 **Benchmark:** Con el mismo presupuesto de CI, Playwright redujo el tiempo de suite de 90 minutos a 14 minutos.

#### Soporte de Navegadores

| Navegador | Playwright | Cypress |
|-----------|------------|---------|
| Chrome/Chromium | ✅ | ✅ |
| Firefox | ✅ | ✅ |
| Safari/WebKit | ✅ | ❌ |
| Edge | ✅ | ✅ |
| Mobile | ✅ (emulación) | ❌ |

#### Escenarios Complejos

- **Multi-tab:** Playwright usa `BrowserContext` para múltiples tabs. Cypress no soporta múltiples tabs.
- **Multi-lenguaje:** Playwright soporta Java, Python, C#, JS/TS. Cypress solo JS/TS.

#### Recomendación para Portfolio Next.js

| Criterio | Elección | Razón |
|----------|----------|-------|
| Cross-browser testing | **Playwright** | Safari/WebKit crítico para portfolio |
| CI/CD escalabilidad | **Playwright** | Paralelización nativa |
| Developer experience | Cypress | Time-travel debugger superior |
| **Recomendación final** | **Playwright** | Cross-browser + CI scalability |

**Fuentes:**
- [Playwright vs Cypress: The 2026 Enterprise Guide](https://devin-rosario.medium.com/playwright-vs-cypress-the-2026-enterprise-testing-guide-ade8b56d3478)
- [Cypress vs Playwright in 2026 | BugBug](https://bugbug.io/blog/test-automation-tools/cypress-vs-playwright/)
- [Playwright vs Cypress | BrowserStack](https://www.browserstack.com/guide/playwright-vs-cypress)

---

### 2.4 API Routes Testing - MSW + Vitest

#### Mock Service Worker (MSW)

MSW intercepta requests a nivel de red, funcionando con fetch, Axios, GraphQL, etc.

**Instalación:**
```bash
npm install -D msw
```

**Setup para Node.js (Vitest/Jest):**
```typescript
// src/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);
```

**Integración con Vitest:**
```typescript
// vitest.setup.ts
import { server } from './src/mocks/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

#### Handlers de API Mock

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/projects', () => {
    return HttpResponse.json([
      { id: 1, title: 'Portfolio Site', status: 'active' },
    ]);
  }),

  http.post('/api/contact', async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ success: true, id: 'msg-123' });
  }),
];
```

#### Testing de Next.js Route Handlers

**Opción 1: next-test-api-route-handler**
```typescript
import { testApiHandler } from 'next-test-api-route-handler';
import * as appHandler from '@/app/api/projects/route';

test('GET /api/projects returns projects', async () => {
  await testApiHandler({
    appHandler,
    test: async ({ fetch }) => {
      const res = await fetch({ method: 'GET' });
      const json = await res.json();
      expect(json).toHaveLength(1);
    },
  });
});
```

**Opción 2: Testing directo con node-mocks-http**
```typescript
import { createMocks } from 'node-mocks-http';
import { GET } from '@/app/api/projects/route';

test('GET handler', async () => {
  const { req, res } = createMocks({ method: 'GET' });
  const response = await GET(req);
  expect(response.status).toBe(200);
});
```

#### Next.js 15 Experimental Test Proxy

```javascript
// next.config.ts
export default {
  experimental: {
    testProxy: true,
  },
};
```

> 🔬 Con Next.js 15's experimental test proxy, MSW y Playwright trabajando juntos, puedes crear cobertura comprehensiva que incluye escenarios de client-side y server-side rendering.

**Fuentes:**
- [Mock Service Worker Quick Start](https://mswjs.io/docs/quick-start/)
- [MSW in Next.js - DEV Community](https://dev.to/mehakb7/mock-service-worker-msw-in-nextjs-a-guide-for-api-mocking-and-testing-e9m)
- [API Testing with Vitest in Next.js](https://medium.com/@sanduni.s/api-testing-with-vitest-in-next-js-a-practical-guide-to-mocking-vs-spying-5e5b37677533)

---

## Step 3: Integration Patterns

### 3.1 Estructura de Carpetas para Tests

#### Opción A: Tests Colocados (Recomendado para Atomic Design)

```
src/
├── ui/
│   ├── atoms/
│   │   ├── Button/
│   │   │   ├── index.jsx
│   │   │   ├── Button.test.jsx      # ← Test colocado
│   │   │   └── Button.module.css
│   │   └── Icon/
│   │       ├── index.jsx
│   │       └── Icon.test.jsx
│   ├── molecules/
│   │   └── SearchInput/
│   │       ├── index.jsx
│   │       └── SearchInput.test.jsx
│   └── organisms/
│       └── Navbar/
│           ├── index.jsx
│           └── Navbar.test.jsx
```

**Ventajas:**
- Contexto inmediato al editar componentes
- Fácil de mantener y escalar
- Claridad en la relación test ↔ componente

#### Opción B: Directorio `__tests__` Separado

```
src/
├── ui/
│   └── atoms/Button/index.jsx
└── __tests__/
    └── ui/
        └── atoms/
            └── Button.test.jsx
```

**Ventajas:**
- Tests no "contaminan" el código fuente
- Fácil de excluir en builds de producción

#### Next.js App Router: Private Folders

Para tests dentro de `app/`, usar prefijo `_` para excluir de routing:

```
app/
├── _tests/                    # ← Private folder, excluido de routing
│   └── page.test.tsx
├── page.tsx
└── layout.tsx
```

> 📁 **Private folders** se crean con prefijo `_folderName`. Next.js los ignora en el sistema de rutas.

**Fuentes:**
- [Next.js Project Structure](https://nextjs.org/docs/app/getting-started/project-structure)
- [Battle-Tested Next.js Structure 2025](https://medium.com/@burpdeepak96/the-battle-tested-nextjs-project-structure-i-use-in-2025-f84c4eb5f426)

---

### 3.2 Estrategia de Coverage Progresivo

#### Roadmap: 0% → 80% Coverage

| Sprint | Objetivo | Foco | Meta Coverage |
|--------|----------|------|---------------|
| **1** | Fundación | Setup Jest + RTL + MSW | 10% |
| **2** | Atoms | Button, Icon, Input, Typography | 25% |
| **3** | Molecules | Cards, Forms, Navigation items | 40% |
| **4** | Organisms | Navbar, Footer, Sidebars | 55% |
| **5** | Pages + E2E | Integration + Playwright setup | 70% |
| **6** | Consolidación | Edge cases, error states | 80% |

#### Incremento Realista por Sprint

> 📈 **Recomendación:** 8-10% de mejora de coverage por sprint. Permite progreso sin abrumar al equipo.

#### Quality Gates por Fase

```yaml
# jest.config.js - Coverage thresholds progresivos
coverageThreshold:
  global:
    branches: 60      # Fase inicial
    functions: 60
    lines: 70
    statements: 70
```

**Evolución de thresholds:**
- **Fase 1 (Sprint 1-2):** 30% mínimo (no fallar build)
- **Fase 2 (Sprint 3-4):** 50% mínimo
- **Fase 3 (Sprint 5-6):** 70% mínimo
- **Mantenimiento:** 80% mínimo, fail build si baja

**Fuentes:**
- [7 Methods to Improve Unit Test Coverage](https://www.startearly.ai/post/7-methods-to-improve-unit-test-coverage)
- [How Cursor AI Cut Legacy Code Coverage Time by 85%](https://engineering.salesforce.com/how-cursor-ai-cut-legacy-code-coverage-time-by-85/)

---

### 3.3 CI/CD Pipeline con GitHub Actions

#### Workflow Completo: Test + Coverage + E2E

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  # Job 1: Unit + Integration Tests
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run Jest tests with coverage
        run: npm run test:ci

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          fail_ci_if_error: true

      - name: Check coverage threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 70" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 70% threshold"
            exit 1
          fi

  # Job 2: E2E Tests con Playwright
  e2e-tests:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.40.0-jammy
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build Next.js
        run: npm run build

      - name: Run Playwright tests
        run: npx playwright test --shard=${{ matrix.shard }}
        strategy:
          matrix:
            shard: [1/3, 2/3, 3/3]  # Paralelización

      - name: Upload Playwright report
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report-${{ matrix.shard }}
          path: playwright-report/
```

#### Scripts de package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --coverageReporters=json-summary",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

#### Quality Gates

| Gate | Trigger | Acción si falla |
|------|---------|-----------------|
| **Lint** | Cada commit | Block PR merge |
| **Unit Tests** | Cada push | Block PR merge |
| **Coverage < 70%** | Cada push | Block PR merge |
| **E2E Smoke** | Cada PR | Block PR merge |
| **E2E Full** | Nightly build | Alert + no deploy |

**Fuentes:**
- [Playwright + GitHub Actions + Allure](https://kailash-pathak.medium.com/end-to-end-test-automation-with-playwright-github-actions-and-allure-reports-5f9817ae4648)
- [Setting Up CI/CD for Next.js](https://arnab-k.medium.com/setting-up-ci-cd-pipelines-for-next-js-projects-354d500f7461)
- [Playwright CI Integration | BrowserStack](https://www.browserstack.com/guide/playwright-ci)

---

### 3.4 Testing Pyramid para Atomic Design

#### Estrategia por Capa de Componente

| Capa | Tipo de Test | Herramienta | Cobertura |
|------|--------------|-------------|-----------|
| **Atoms** | Unit + Snapshot | Jest + RTL | Alta (90%+) |
| **Molecules** | Unit + Integration | Jest + RTL | Alta (85%+) |
| **Organisms** | Integration | Jest + RTL + MSW | Media (70%+) |
| **Templates** | Integration | Jest + RTL | Media (60%+) |
| **Pages** | E2E | Playwright | Crítica (flujos principales) |

#### Testing Trophy (Kent C. Dodds, 2025)

```
        ▲ E2E Tests (pocos, críticos)
       ╱ ╲
      ╱   ╲ Integration Tests (mayoría)
     ╱     ╲
    ╱       ╲ Unit Tests (base sólida)
   ╱─────────╲
  ╱  Static   ╲ ESLint + TypeScript
 ╱─────────────╲
```

> 💡 **Filosofía:** "Write tests, not too many, mostly integration." — Kent C. Dodds

#### Ejemplos por Capa

**Atoms (Unit + Snapshot):**
```typescript
// Button.test.tsx
describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('matches snapshot', () => {
    const { container } = render(<Button variant="primary">Save</Button>);
    expect(container).toMatchSnapshot();
  });
});
```

**Molecules (Unit + Props):**
```typescript
// SearchInput.test.tsx
describe('SearchInput', () => {
  it('calls onChange when typing', async () => {
    const handleChange = jest.fn();
    render(<SearchInput onChange={handleChange} />);

    await userEvent.type(screen.getByRole('searchbox'), 'test');
    expect(handleChange).toHaveBeenCalledWith('test');
  });
});
```

**Organisms (Integration + MSW):**
```typescript
// ProjectList.test.tsx
describe('ProjectList', () => {
  it('fetches and displays projects', async () => {
    // MSW intercepta la llamada real
    renderWithProviders(<ProjectList />);

    expect(await screen.findByText('Portfolio Site')).toBeInTheDocument();
    expect(screen.getAllByRole('article')).toHaveLength(3);
  });
});
```

**Pages (E2E):**
```typescript
// e2e/home.spec.ts
test('homepage loads and shows projects', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /Angel/i })).toBeVisible();
  await expect(page.getByTestId('project-grid')).toBeVisible();

  // Navegación
  await page.click('text=Projects');
  await expect(page).toHaveURL('/projects');
});
```

**Fuentes:**
- [Testing Pyramid for Frontend | Meticulous](https://www.meticulous.ai/blog/testing-pyramid-for-frontend)
- [Atomic Design in React: Best Practices](https://propelius.tech/blogs/atomic-design-in-react-best-practices)
- [The Testing Pyramid | Semaphore](https://semaphore.io/blog/testing-pyramid)

---

## Step 4: Architectural Patterns

### 4.1 Fixtures y Factories para Test Data

#### Factory Functions con TypeScript

```typescript
// src/testing/factories/project.factory.ts
import { Project } from '@/types/project';

type ProjectOverrides = Partial<Project>;

export function createProject(overrides: ProjectOverrides = {}): Project {
  return {
    id: Math.random().toString(36).substr(2, 9),
    title: 'Default Project',
    description: 'A sample project description',
    technologies: ['React', 'TypeScript'],
    imageUrl: '/images/placeholder.jpg',
    githubUrl: 'https://github.com/example/project',
    liveUrl: 'https://example.com',
    featured: false,
    createdAt: new Date().toISOString(),
    ...overrides,  // Deep merge con overrides
  };
}

// Uso en tests
const featuredProject = createProject({ featured: true, title: 'Portfolio' });
```

#### Factories con Rosie.js

```typescript
// src/testing/factories/index.ts
import { Factory } from 'rosie';
import { faker } from '@faker-js/faker';

Factory.define('Project')
  .attr('id', () => faker.string.uuid())
  .attr('title', () => faker.commerce.productName())
  .attr('description', () => faker.lorem.paragraph())
  .attr('technologies', () => ['React', 'Next.js'])
  .attr('featured', false);

Factory.define('FeaturedProject')
  .extend('Project')
  .attr('featured', true)
  .attr('imageUrl', () => faker.image.url());

// Uso
const project = Factory.build('Project');
const featured = Factory.build('FeaturedProject', { title: 'Custom Title' });
```

#### Fixtures con TypeScript Utility Types

```typescript
// Para objetos complejos, usar Partial<T>
type MockWindow = Partial<Window>;

const mockWindow: MockWindow = {
  innerWidth: 1024,
  innerHeight: 768,
  matchMedia: jest.fn(),
};

// Para APIs, usar Pick<T, K>
type MinimalResponse = Pick<Response, 'ok' | 'status' | 'json'>;

const mockResponse: MinimalResponse = {
  ok: true,
  status: 200,
  json: async () => ({ data: [] }),
};
```

**Fuentes:**
- [Rosie.js - Factory Library](https://github.com/rosiejs/rosie)
- [Fixtures: Managing Sample and Test Data](https://michalzalecki.com/fixtures-the-way-to-manage-sample-and-test-data/)
- [React: Utilizing Factories to Test Components](https://medium.com/@srph/react-js-utilizing-factories-to-test-components-b1b63165c399)

---

### 4.2 Page Object Model para Playwright

#### Estructura de Proyecto

```
e2e/
├── pages/
│   ├── base.page.ts        # Clase base con métodos comunes
│   ├── home.page.ts
│   ├── projects.page.ts
│   └── contact.page.ts
├── fixtures/
│   └── test.fixture.ts     # Fixtures personalizados
├── tests/
│   ├── home.spec.ts
│   ├── projects.spec.ts
│   └── navigation.spec.ts
└── playwright.config.ts
```

#### Base Page Class

```typescript
// e2e/pages/base.page.ts
import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Métodos comunes
  async navigate(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  // Locators comunes
  get navbar(): Locator {
    return this.page.getByRole('navigation');
  }

  get footer(): Locator {
    return this.page.getByRole('contentinfo');
  }
}
```

#### Page Object Específico

```typescript
// e2e/pages/home.page.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {
  readonly heroTitle: Locator;
  readonly projectsGrid: Locator;
  readonly contactButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heroTitle = page.getByRole('heading', { level: 1 });
    this.projectsGrid = page.getByTestId('projects-grid');
    this.contactButton = page.getByRole('link', { name: /contact/i });
  }

  async goto(): Promise<void> {
    await this.navigate('/');
    await this.waitForPageLoad();
  }

  async expectHeroVisible(): Promise<void> {
    await expect(this.heroTitle).toBeVisible();
  }

  async getProjectCount(): Promise<number> {
    return await this.projectsGrid.getByRole('article').count();
  }

  async clickContact(): Promise<void> {
    await this.contactButton.click();
  }
}
```

#### Custom Fixture con Page Objects

```typescript
// e2e/fixtures/test.fixture.ts
import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { ProjectsPage } from '../pages/projects.page';

type Pages = {
  homePage: HomePage;
  projectsPage: ProjectsPage;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  projectsPage: async ({ page }, use) => {
    await use(new ProjectsPage(page));
  },
});

export { expect } from '@playwright/test';
```

#### Uso en Tests

```typescript
// e2e/tests/home.spec.ts
import { test, expect } from '../fixtures/test.fixture';

test.describe('Homepage', () => {
  test('displays hero and projects', async ({ homePage }) => {
    await homePage.goto();
    await homePage.expectHeroVisible();

    const projectCount = await homePage.getProjectCount();
    expect(projectCount).toBeGreaterThan(0);
  });

  test('navigates to contact', async ({ homePage, page }) => {
    await homePage.goto();
    await homePage.clickContact();

    await expect(page).toHaveURL('/contact');
  });
});
```

**Fuentes:**
- [Playwright POM Official Docs](https://playwright.dev/docs/pom)
- [Page Object Model Guide 2025](https://www.skyvern.com/blog/page-object-model-guide/)
- [POM with Playwright | BrowserStack](https://www.browserstack.com/guide/page-object-model-with-playwright)

---

### 4.3 Testing de Custom Hooks

#### Importante: Migración a @testing-library/react

> ⚠️ **Deprecated:** `@testing-library/react-hooks` está deprecado. Usar `renderHook` de `@testing-library/react` v13+.

```typescript
// ❌ Antiguo (deprecated)
import { renderHook } from '@testing-library/react-hooks';

// ✅ Nuevo (2025)
import { renderHook, act, waitFor } from '@testing-library/react';
```

#### Patrón 1: State Updates con `act()`

```typescript
// hooks/useCounter.ts
export function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  return { count, increment, decrement };
}

// hooks/__tests__/useCounter.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCounter } from '../useCounter';

describe('useCounter', () => {
  it('increments counter', () => {
    const { result } = renderHook(() => useCounter(0));

    expect(result.current.count).toBe(0);

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it('accepts initial value', () => {
    const { result } = renderHook(() => useCounter(10));
    expect(result.current.count).toBe(10);
  });
});
```

#### Patrón 2: Async Hooks con `waitFor`

```typescript
// hooks/useFetch.ts
export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [url]);

  return { data, loading, error };
}

// hooks/__tests__/useFetch.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { useFetch } from '../useFetch';

// MSW handler mockea /api/projects
describe('useFetch', () => {
  it('fetches data successfully', async () => {
    const { result } = renderHook(() => useFetch('/api/projects'));

    // Estado inicial: loading
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();

    // Esperar a que termine el fetch
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual([{ id: 1, title: 'Project' }]);
    expect(result.current.error).toBeNull();
  });
});
```

#### Patrón 3: Hooks con Context (Wrapper)

```typescript
// hooks/__tests__/useTheme.test.ts
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';
import { ThemeProvider } from '@/context/ThemeContext';

describe('useTheme', () => {
  const wrapper = ({ children }) => (
    <ThemeProvider>{children}</ThemeProvider>
  );

  it('toggles theme', () => {
    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');
  });
});
```

**Fuentes:**
- [Test React Hooks the Practical Way (2025)](https://javascript.plainenglish.io/test-react-hooks-the-practical-way-three-patterns-that-always-hold-up-2025-3429319daef2)
- [How to Test Custom React Hooks | Builder.io](https://www.builder.io/blog/test-custom-hooks-react-testing-library)
- [How to Test Custom React Hooks | Kent C. Dodds](https://kentcdodds.com/blog/how-to-test-custom-react-hooks)

---

### 4.4 Patrones de Mocking Avanzado

#### MSW vs jest.mock() - Cuándo Usar Cada Uno

| Escenario | MSW | jest.mock() |
|-----------|-----|-------------|
| API calls (fetch/axios) | ✅ Preferido | ❌ Evitar |
| Módulos internos | ❌ No aplica | ✅ Usar |
| Context/Providers | ❌ No aplica | ⚠️ Con cuidado |
| window/document APIs | ❌ No aplica | ✅ Usar |

#### MSW: Handler Patterns

```typescript
// src/mocks/handlers.ts
import { http, HttpResponse, delay } from 'msw';

export const handlers = [
  // GET con datos
  http.get('/api/projects', () => {
    return HttpResponse.json([
      { id: 1, title: 'Project A' },
      { id: 2, title: 'Project B' },
    ]);
  }),

  // POST con validación
  http.post('/api/contact', async ({ request }) => {
    const body = await request.json();

    if (!body.email) {
      return HttpResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    return HttpResponse.json({ success: true }, { status: 201 });
  }),

  // Simular latencia
  http.get('/api/slow-endpoint', async () => {
    await delay(2000);
    return HttpResponse.json({ data: 'delayed' });
  }),

  // Simular error de red
  http.get('/api/error', () => {
    return HttpResponse.error();
  }),
];
```

#### Override Handlers en Tests Específicos

```typescript
// __tests__/ProjectList.error.test.tsx
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

describe('ProjectList error states', () => {
  it('shows error message on API failure', async () => {
    // Override handler para este test
    server.use(
      http.get('/api/projects', () => {
        return HttpResponse.json(
          { error: 'Server error' },
          { status: 500 }
        );
      })
    );

    renderWithProviders(<ProjectList />);

    await waitFor(() => {
      expect(screen.getByText(/error loading projects/i)).toBeInTheDocument();
    });
  });
});
```

#### jest.mock() para Módulos Internos

```typescript
// Mockear next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));

// Mockear módulo interno con implementación
jest.mock('@/lib/analytics', () => ({
  trackEvent: jest.fn(),
  trackPageView: jest.fn(),
}));

// En el test
import { trackEvent } from '@/lib/analytics';

it('tracks click event', async () => {
  render(<Button onClick={() => trackEvent('click')}>Click</Button>);

  await userEvent.click(screen.getByRole('button'));

  expect(trackEvent).toHaveBeenCalledWith('click');
});
```

#### Dependency Injection con React Context

```typescript
// Alternativa a jest.mock: inyectar dependencias via context
// context/AnalyticsContext.tsx
export const AnalyticsContext = createContext<AnalyticsClient>(realClient);

// En producción
<AnalyticsContext.Provider value={realAnalyticsClient}>
  <App />
</AnalyticsContext.Provider>

// En tests
const mockAnalytics = {
  trackEvent: jest.fn(),
  trackPageView: jest.fn(),
};

render(
  <AnalyticsContext.Provider value={mockAnalytics}>
    <ComponentUnderTest />
  </AnalyticsContext.Provider>
);
```

**Fuentes:**
- [Mock Service Worker - Node.js Integration](https://mswjs.io/docs/integrations/node/)
- [Comprehensive Guide to MSW | Callstack](https://www.callstack.com/blog/guide-to-mock-service-worker-msw)
- [Jest Module Mocking vs Dependency Injection](https://gist.github.com/ryyppy/e60376024aa9e4fe2962f3ab13e87bf0)

---

## Step 5: Implementation Recommendations

### 5.1 Resumen Ejecutivo de Decisiones

#### Stack de Testing Seleccionado

| Capa | Herramienta | Justificación |
|------|-------------|---------------|
| **Unit/Integration** | Jest + RTL | Ecosistema Next.js, `nextJest` config |
| **E2E** | Playwright | Cross-browser (Safari), CI parallelization |
| **API Mocking** | MSW v2 | Framework-agnostic, network-level |
| **Test Data** | Factory Functions | TypeScript-native, `Partial<T>` |
| **Coverage** | Jest built-in + Codecov | CI integration, quality gates |

#### Arquitectura de Testing

```
┌────────────────────────────────────────────────────────┐
│                    E2E (Playwright)                    │
│         Flujos críticos: Home, Projects, Contact       │
├────────────────────────────────────────────────────────┤
│              Integration (Jest + RTL + MSW)            │
│      Organisms, Pages con data fetching, Hooks         │
├────────────────────────────────────────────────────────┤
│                  Unit (Jest + RTL)                     │
│           Atoms, Molecules, Utils, Helpers             │
├────────────────────────────────────────────────────────┤
│                  Static (ESLint + TS)                  │
│            Type checking, linting rules                │
└────────────────────────────────────────────────────────┘
```

---

### 5.2 Checklist de Implementación

#### Fase 1: Setup Inicial (Sprint 1)

- [ ] Instalar dependencias de testing
  ```bash
  npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event msw @types/jest
  ```
- [ ] Configurar `jest.config.js` con `nextJest`
- [ ] Crear `jest.setup.js` con mocks de `next/navigation`
- [ ] Configurar MSW: `src/mocks/handlers.ts`, `src/mocks/server.ts`
- [ ] Crear `src/testing/test-utils.tsx` con `renderWithProviders`
- [ ] Agregar scripts a `package.json`
- [ ] Primer test smoke: `HomePage.test.tsx`

#### Fase 2: Atoms y Molecules (Sprint 2)

- [ ] Tests para componentes `atoms/`:
  - [ ] Button, Icon, Typography, Input, Badge
- [ ] Tests para componentes `molecules/`:
  - [ ] Card, SearchInput, NavItem, SocialLink
- [ ] Snapshot tests para variantes visuales
- [ ] Coverage target: 25%

#### Fase 3: Organisms (Sprint 3-4)

- [ ] Tests de integración para:
  - [ ] Navbar, Footer, Sidebar
  - [ ] ProjectGrid, ArticleList
  - [ ] ContactForm (con MSW)
- [ ] Factory functions para test data
- [ ] Coverage target: 55%

#### Fase 4: E2E Setup (Sprint 5)

- [ ] Instalar Playwright
  ```bash
  npm install -D @playwright/test
  npx playwright install
  ```
- [ ] Configurar `playwright.config.ts`
- [ ] Crear estructura POM: `e2e/pages/`, `e2e/fixtures/`
- [ ] Tests E2E críticos:
  - [ ] Homepage load + navigation
  - [ ] Projects gallery
  - [ ] Contact form submission
- [ ] Coverage target: 70%

#### Fase 5: CI/CD Integration (Sprint 5-6)

- [ ] Crear `.github/workflows/test.yml`
- [ ] Configurar Codecov
- [ ] Quality gates: coverage ≥70%
- [ ] Playwright sharding (3 jobs)
- [ ] Coverage target: 80%

---

### 5.3 Priorización de Tareas

#### Alta Prioridad (Semana 1-2)

| Tarea | Impacto | Esfuerzo |
|-------|---------|----------|
| Jest + RTL setup | Alto | Bajo |
| MSW configuration | Alto | Medio |
| `renderWithProviders` helper | Alto | Bajo |
| Smoke test HomePage | Medio | Bajo |

#### Media Prioridad (Semana 3-4)

| Tarea | Impacto | Esfuerzo |
|-------|---------|----------|
| Atoms tests (Button, Icon) | Medio | Bajo |
| Factory functions | Medio | Medio |
| Molecules tests | Medio | Medio |
| CI workflow básico | Alto | Medio |

#### Prioridad Normal (Semana 5-8)

| Tarea | Impacto | Esfuerzo |
|-------|---------|----------|
| Playwright setup | Alto | Alto |
| Page Object Model | Medio | Alto |
| Organisms tests | Medio | Alto |
| Coverage gates | Medio | Bajo |

---

### 5.4 Configuración Recomendada

#### jest.config.js

```javascript
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.{js,ts}',
    '!src/mocks/**',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 70,
      statements: 70,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

#### playwright.config.ts

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

### 5.5 Recursos Adicionales

#### Documentación Oficial

- [Next.js Testing Guide](https://nextjs.org/docs/pages/guides/testing)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [MSW Documentation](https://mswjs.io/docs/)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

#### Artículos Recomendados

- [Testing Trophy - Kent C. Dodds](https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications)
- [How to Test Custom React Hooks](https://kentcdodds.com/blog/how-to-test-custom-react-hooks)
- [Playwright Page Object Model](https://playwright.dev/docs/pom)

#### Herramientas Complementarias

| Herramienta | Propósito |
|-------------|-----------|
| **Codecov** | Coverage reporting + PR comments |
| **Chromatic** | Visual regression testing |
| **Storybook** | Component development + testing |
| **Allure** | Advanced test reporting |

---

## Research Summary

### Conclusiones Principales

1. **Jest + RTL** es el estándar para Next.js, con `nextJest` simplificando la configuración
2. **Playwright > Cypress** para cross-browser testing y CI scalability
3. **MSW** es preferido sobre `jest.mock()` para API mocking
4. **Testing Trophy**: Mayoría de tests de integración, menos unit, pocos E2E críticos
5. **Coverage progresivo**: 0% → 80% en 6 sprints, 8-10% por sprint
6. **Async Server Components**: Requieren E2E tests (Jest no los soporta aún)

### Próximos Pasos

1. Crear épica "Testing Infrastructure" en el PRD
2. Implementar Fase 1 (setup) como primer sprint de testing
3. Integrar coverage gates en CI/CD desde el inicio
4. Documentar patrones de testing en `docs/testing-guide.md`

---

**Research Status:** ✅ COMPLETADO
**Date:** 2026-01-18
**Author:** Angel DevStack
**Total Steps:** 5/5
**Sources Verified:** 25+

