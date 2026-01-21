---
stepsCompleted: [1, 2, 3]
inputDocuments: [docs/index.md, _bmad-output/analysis/brainstorming-session-2026-01-15.md]
workflowType: 'research'
lastStep: 3
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

