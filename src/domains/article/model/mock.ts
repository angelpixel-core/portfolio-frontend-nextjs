import type { Articles } from "./schema";

const articlesMock: Articles = [
  {
    id: 14,
    title: "Los datos financieros no mienten... hasta que los procesás mal",
    url: "/articles/datos-financieros-no-mienten",
    slug: "datos-financieros-no-mienten",
    lang: "ES",
    reading_time: "12 min read",
    published_at: "2026-03-27",
    summary:
      "Cómo errores en el procesamiento de datos financieros pueden costar millones, y cómo diseñar sistemas deterministas evita resultados incorrectos y decisiones equivocadas.",
    content: `# Los datos financieros no mienten... hasta que los procesás mal

## Un error simple puede romper todo

En 2020, durante la pandemia, un error en Excel provocó que miles de casos de COVID no fueran reportados en el Reino Unido.

El problema no era el virus.
Era cómo se estaban procesando los datos.

Ese incidente -- COVID-19 Excel data loss incident -- no fue causado por un sistema complejo ni por inteligencia artificial.

Fue un problema básico:

> el sistema no estaba diseñado para garantizar consistencia.

Y aunque suene extremo, este tipo de errores ocurre todos los días en sistemas financieros.

---

## El problema real no es el cálculo, es el procesamiento

En teoría, calcular PnL (profit & loss) es sencillo.

En la práctica, los datos nunca llegan en condiciones ideales:
- trades fuera de orden
- timestamps inconsistentes
- duplicados
- fees mal formateados
- precios faltantes
- conversiones FX incompletas

---

## Resultado

\`\`\`txt
input incorrecto -> procesamiento ambiguo -> output incorrectos
\`\`\`

Y lo más peligroso:

> el sistema igual devuelve un resultado.

---

## Cuando los datos parecen correctos... pero no lo son

El mayor riesgo no es un sistema que falla.

Es un sistema que:
- no valida correctamente
- no es determinista
- no es reproducible

y aún así:

\`\`\`txt
te devuelve números que parecen correctos
\`\`\`

---

Ejemplo típico
- mismo input
- dos ejecuciones
- resultados distintos

---

Eso en fintech es inaceptable.

---

## Qué debería garantizar un sistema financiero serio

Un sistema confiable no empieza por la UI.
Empieza por las propiedades del procesamiento.

---

### 1. Determinismo

\`\`\`txt
mismo input -> mismo output -> siempre
\`\`\`

---

### 2. Validación estricta
- no permitir datos inconsistentes
- fallar temprano
- errores explícitos (no silenciosos)

---

### 3. Reproducibilidad
- poder ejecutar el mismo run en cualquier momento
- obtener exactamente el mismo resultado

---

### 4. Evidencia verificable
- artifacts claros (result.json, pnl.csv, etc.)
- trazabilidad completa

---

## Cómo lo resolví: Financial Core Simulator

Para abordar este problema diseñé un sistema enfocado en:

\`\`\`txt
confianza operativa + evidencia técnica
\`\`\`

---

### Qué hace
- procesa trades financieros (long-only, deterministic)
- calcula PnL (realized/unrealized)
- valida consistencia de datos
- genera artifacts reproducibles
- permite inspección operativa vía CLI + admin UI

---

### Ejecución real (CLI)

\`\`\`sh
fcs run input.json
\`\`\`

---

Output:
- result.json
- positions.csv
- pnl.csv

---

### Lo importante NO es el output

Es que:

podés confiar en ese output

---

> [SCREENSHOT_PLACEHOLDER_1]

Overview del sistema (KPIs + latest run)
(mostrar estado general + selección del run confiable)

---

### Validación antes de confiar

El sistema no asume que los datos son correctos.

Los valida.

---

### Ejemplos de validación
- posiciones negativas -> error
- missing snapshot -> error
- FX inconsistente -> error
- referencias inválidas -> error

---

> [SCREENSHOT_PLACEHOLDER_2]

Panel de validación (errores y diagnóstico)
(mostrar errores detectados + contexto)

---

### Inspección de resultados

Una vez validado el run:
- PnL por cuenta/mercado
- métricas agregadas
- consistencia de resultados

---

> [SCREENSHOT_PLACEHOLDER_3]

Detalle del run (PnL + métricas)

---

### Evidencia: artifacts reproducibles

Cada ejecución genera evidencia concreta:
- JSON canónico
- CSVs reconciliables
- metadata (hash, timestamps, versionado)

---

> [SCREENSHOT_PLACEHOLDER_4]

Artifacts del run (evidencia técnica)

---

### Reproducibilidad real

Podés:
- correr el mismo input
- en otro entorno
- en otro momento

y obtener:
\`\`\`txt
exactamente el mismo resultado
\`\`\`

---

Esto no es un nice-to-have.

Es la base de cualquier sistema financiero serio.

---

### Lo importante es que el sistema garantice:
- consistencia
- validación
- trazabilidad
- confianza

---

## Conclusión

El problema nunca fue Excel.

El problema es confiar en sistemas que:
- no validan correctamente
- no son deterministas
- no pueden explicar sus resultados

---

En sistemas financieros:
\`\`\`txt
si no podés confiar en los datos,
no podés confiar en ninguna decisión que tomes.
\`\`\`
`,
    img: "/images/articles/smooth scrolling in reactjs.png",
    img_alt: "Placeholder image. No visual available yet.",
    featured: true,
    visible: false,
    priority: 1,
    category: "Architecture",
    badges: ["Fintech", "Data", "Engineering", "Ruby", "Systems", "PnL"],
    status: "published",
  },
  {
    id: 15,
    title: "Financial data doesn't lie... until you process it incorrectly",
    url: "/articles/financial-data-doesnt-lie",
    slug: "financial-data-doesnt-lie",
    lang: "EN",
    reading_time: "12 min read",
    published_at: "2026-03-27",
    summary:
      "How mistakes in financial data processing can cost millions, and how deterministic systems prevent incorrect results and poor decisions.",
    content: `# Financial data doesn't lie... until you process it incorrectly

## A simple error can break everything

In 2020, during the pandemic, an Excel error caused thousands of COVID cases to go unreported in the UK.

The problem wasn't the virus.
It was how the data was being processed.

That incident -- COVID-19 Excel data loss incident -- was not caused by a complex system or artificial intelligence.

It was a basic problem:

> the system wasn't designed to guarantee consistency.

And although it sounds extreme, this kind of error happens every day in financial systems.

---

## The real problem isn't the calculation, it's the processing

In theory, calculating PnL (profit & loss) is simple.

In practice, the data never arrives in ideal conditions:
- trades out of order
- inconsistent timestamps
- duplicates
- badly formatted fees
- missing prices
- incomplete FX conversions

---

## Result

\`\`\`txt
bad input -> ambiguous processing -> incorrect output
\`\`\`

And the most dangerous part:

> the system still returns a result.

---

## When the data looks correct... but isn't

The biggest risk isn't a system that fails.

It's a system that:
- doesn't validate correctly
- isn't deterministic
- isn't reproducible

and still:

\`\`\`txt
returns numbers that look correct
\`\`\`

---

Typical example
- same input
- two runs
- different results

---

In fintech, that's unacceptable.

---

## What a serious financial system should guarantee

A reliable system doesn't start with the UI.
It starts with the properties of the processing.

---

### 1. Determinism

\`\`\`txt
same input -> same output -> always
\`\`\`

---

### 2. Strict validation
- don't allow inconsistent data
- fail early
- explicit errors (not silent)

---

### 3. Reproducibility
- run the same data at any time
- get exactly the same result

---

### 4. Verifiable evidence
- clear artifacts (result.json, pnl.csv, etc.)
- full traceability

---

## How I solved it: Financial Core Simulator

To address this problem, I designed a system focused on:

\`\`\`txt
operational trust + technical evidence
\`\`\`

---

### What it does
- processes financial trades (long-only, deterministic)
- calculates PnL (realized/unrealized)
- validates data consistency
- generates reproducible artifacts
- enables operational inspection via CLI + admin UI

---

### Real execution (CLI)

\`\`\`sh
fcs run input.json
\`\`\`

---

Output:
- result.json
- positions.csv
- pnl.csv

---

### The output is NOT the important part

It's that:

you can trust that output

---

> [SCREENSHOT_PLACEHOLDER_1]

System overview (KPIs + latest run)
(show overall status + trusted run selection)

---

### Validate before trusting

The system doesn't assume the data is correct.

It validates it.

---

### Validation examples
- negative positions -> error
- missing snapshot -> error
- inconsistent FX -> error
- invalid references -> error

---

> [SCREENSHOT_PLACEHOLDER_2]

Validation panel (errors and diagnostics)
(show detected errors + context)

---

### Inspecting results

Once the run is validated:
- PnL by account/market
- aggregated metrics
- result consistency

---

> [SCREENSHOT_PLACEHOLDER_3]

Run details (PnL + metrics)

---

### Evidence: reproducible artifacts

Each run generates concrete evidence:
- canonical JSON
- reconcilable CSVs
- metadata (hash, timestamps, versioning)

---

> [SCREENSHOT_PLACEHOLDER_4]

Run artifacts (technical evidence)

---

### Real reproducibility

You can:
- run the same input
- in another environment
- at another time

and get:
\`\`\`txt
exactly the same result
\`\`\`

---

This isn't a nice-to-have.

It's the foundation of any serious financial system.

---

### What matters is that the system guarantees:
- consistency
- validation
- traceability
- trust

---

## Conclusion

The problem was never Excel.

The problem is trusting systems that:
- don't validate correctly
- aren't deterministic
- can't explain their results

---

In financial systems:
\`\`\`txt
if you can't trust the data,
you can't trust any decision you make.
\`\`\`
`,
    img: "/images/articles/smooth scrolling in reactjs.png",
    img_alt: "Placeholder image. No visual available yet.",
    featured: false,
    visible: false,
    priority: 1,
    category: "Architecture",
    badges: ["Fintech", "Data", "Engineering", "Ruby", "Systems", "PnL"],
    status: "published",
  },
  {
    id: 16,
    title:
      "Why Most Developer Portfolios Don't Convert (And What I Did Instead)",
    url: "/articles/why-portfolio-not-convert",
    slug: "why-portfolio-not-convert",
    lang: "EN",
    reading_time: "7 min read",
    published_at: "2026-04-20",
    summary:
      "Most portfolios are built to impress peers, not convert visitors into real conversations. This article explains the shift from showcase to system.",
    content: `# Part 1 - Why Most Developer Portfolios Don't Convert (And What I Did Instead)

## Most developer portfolios are built to impress other developers.

Not to get clients.

For years I did what everyone does: clean site, modern stack, nice motion, and almost no results.

The issue was not code quality. The issue was intent.

## The uncomfortable truth

A traditional portfolio usually says:

"Look what I can build."

But a client is asking:

"Can this help me solve my problem?"

That gap kills conversion.

## I wasn't building a portfolio. I was building a museum.

Everything looked polished.
Almost nobody acted.

No conversation.
No contact.
No business outcome.

## The shift

I stopped asking:

"How do I showcase my skills?"

I started asking:

"How do I convert visitors into conversations?"

## A portfolio is not a page. It's a system.

A useful portfolio system:
- captures intent
- reduces friction
- guides decisions
- ends in real contact

That changes how you design every section.

## The most important element is not the hero

It's the entry point.

The moment someone moves from browsing to action.

In my case, that entry point is the "Hire Me" trigger.

## The difference between a button and a system

Basic button:

\`click -> open link -> end\`

System trigger:

\`click -> evaluate state -> choose flow -> open guided experience\`

Minimal logic:

\`\`\`js
const handleHireClick = () => {
  if (!isAuthenticated) {
    openAuthModal();
  } else {
    openHireFlow();
  }
};
\`\`\`

Simple decision, big impact.

## Why this matters

Because you:
- keep anonymous users in the funnel
- avoid unnecessary friction
- prepare context before contact

That directly improves conversion quality.

## What failed before

Most portfolios do not fail because design is bad.
They fail because there is no system intent.

I did not rebuild my whole portfolio.
I rebuilt the entry point.

## What's next

In the next part, I'll break down the architecture behind this flow:
- domains, UI, and data boundaries
- fullstack decisions with Next.js
- why the conversion layer lives in product logic, not just visuals

Final thought:

A portfolio should not only prove what you know.
It should prove how you think.`,
    img: "/images/articles/portfolio funnel.png",
    img_alt: "Portfolio conversion funnel concept illustration.",
    featured: true,
    visible: true,
    priority: 1,
    category: "Architecture",
    badges: ["Portfolio", "Conversion", "Product Thinking", "Next.js"],
    status: "published",
  },
  {
    id: 1,
    title: "Build A Custom Pagination Component In ReactJS From Scratch",
    url: "/articles/react-pagination",
    slug: "react-pagination",
    lang: "EN",
    reading_time: "9 min read",
    published_at: "2023-03-22",
    summary:
      "Learn how to build a fully functional custom pagination component in React without any external dependencies.",
    content: `# Build A Custom Pagination Component In ReactJS From Scratch

Pagination is a crucial UI pattern for handling large datasets. In this article, we'll build a fully functional pagination component from scratch.

## Why Build Your Own?

While there are many pagination libraries available, building your own gives you:
- Complete control over styling and behavior
- No external dependencies
- Deep understanding of the underlying logic

## The Component Structure

\`\`\`tsx
interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ totalPages, currentPage, onPageChange }: PaginationProps) => {
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, last page, and pages around current
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <nav aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      {getPageNumbers().map((page, index) => (
        typeof page === 'number' ? (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ) : (
          <span key={\`ellipsis-\${index}\`}>{page}</span>
        )
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </nav>
  );
};
\`\`\`

## Usage Example

\`\`\`tsx
const [currentPage, setCurrentPage] = useState(1);

<Pagination
  totalPages={10}
  currentPage={currentPage}
  onPageChange={setCurrentPage}
/>
\`\`\`

## Conclusion

Building a custom pagination component is straightforward and gives you full control over your UI. You can extend this base implementation with features like:
- Jump to page input
- Items per page selector
- Keyboard navigation
`,
    img: "/images/articles/pagination component in reactjs.jpg",
    featured: true,
    visible: false,
    category: "React",
    badges: ["Pagination", "Components", "TypeScript"],
    status: "published",
  },
  {
    id: 2,
    title: "Creating Stunning Loading Screens In React",
    url: "/articles/loading-screens",
    slug: "loading-screens",
    lang: "EN",
    reading_time: "10 min read",
    published_at: "2023-03-22",
    summary:
      "Discover techniques to create beautiful and engaging loading screens that enhance user experience.",
    content: `# Creating Stunning Loading Screens In React

Loading screens are often the first impression users have of your application. Let's make them count!

## The Psychology of Loading

Users perceive animated loading screens as faster than static ones. A well-designed loading experience can:
- Reduce perceived wait time
- Keep users engaged
- Reinforce your brand identity

## Basic Skeleton Loading

\`\`\`tsx
const SkeletonCard = () => (
  <div className="skeleton-card animate-pulse">
    <div className="skeleton-image bg-gray-200 h-48 rounded" />
    <div className="skeleton-content p-4">
      <div className="skeleton-title bg-gray-200 h-6 w-3/4 rounded mb-2" />
      <div className="skeleton-text bg-gray-200 h-4 w-full rounded" />
    </div>
  </div>
);
\`\`\`

## Progress Indicators

For operations with known duration, progress bars work great:

\`\`\`tsx
const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="progress-container">
    <div
      className="progress-bar"
      style={{ width: \`\${progress}%\` }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    />
  </div>
);
\`\`\`

## Conclusion

Great loading screens improve perceived performance and user satisfaction. Invest time in these transitions - they matter more than you might think!
`,
    img: "/images/articles/create loading screen in react js.jpg",
    featured: true,
    visible: false,
    category: "Performance",
    badges: ["Skeleton", "UX", "Perceived Speed"],
    status: "published",
  },
  {
    id: 3,
    title: "Form Validation In ReactJS Using Custom React Hook",
    url: "/articles/form-validation-hook",
    slug: "form-validation-hook",
    lang: "EN",
    reading_time: "8 min read",
    published_at: "2023-03-15",
    summary:
      "Build a reusable custom hook for form validation that simplifies form handling in React applications.",
    content: `# Form Validation In ReactJS Using Custom React Hook

Forms are a critical part of web applications. Let's build a reusable validation hook that makes form handling a breeze.

## The useForm Hook

\`\`\`tsx
import { useState, useCallback } from 'react';

interface ValidationRules {
  required?: boolean;
  minLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => string | null;
}

interface FormConfig {
  [key: string]: ValidationRules;
}

export function useForm<T extends Record<string, string>>(
  initialValues: T,
  validationConfig: FormConfig
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validate = useCallback((name: keyof T, value: string): string | null => {
    const rules = validationConfig[name as string];
    if (!rules) return null;

    if (rules.required && !value.trim()) {
      return 'This field is required';
    }

    if (rules.minLength && value.length < rules.minLength) {
      return \`Minimum \${rules.minLength} characters required\`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return 'Invalid format';
    }

    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }, [validationConfig]);

  const handleChange = (name: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValues(prev => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validate(name, value);
      setErrors(prev => ({ ...prev, [name]: error || undefined }));
    }
  };

  return { values, errors, touched, handleChange, validate };
}
\`\`\`

## Usage

\`\`\`tsx
const { values, errors, handleChange } = useForm(
  { email: '', password: '' },
  {
    email: { required: true, pattern: /^[^@]+@[^@]+\\.[^@]+$/ },
    password: { required: true, minLength: 8 }
  }
);
\`\`\`

## Conclusion

Custom hooks make form validation clean and reusable. Extend this pattern with features like async validation and form submission handling.
`,
    img: "/images/articles/form validation in reactjs using custom react hook.png",
    featured: false,
    visible: false,
    category: "React",
    badges: ["Hooks", "Forms", "Validation"],
    status: "published",
  },
  {
    id: 4,
    title: "What is Redux with Easy Explanation",
    url: "/articles/what-is-redux",
    slug: "what-is-redux",
    lang: "EN",
    reading_time: "12 min read",
    published_at: "2023-03-10",
    summary:
      "A beginner-friendly guide to understanding Redux and state management in React applications.",
    content: `# What is Redux with Easy Explanation

Redux can seem intimidating at first, but the core concepts are simpler than you might think. Let's break it down.

## The Problem Redux Solves

In complex applications, managing state becomes challenging:
- Props drilling through many component levels
- State synchronization across distant components
- Debugging state changes

## Core Concepts

### 1. Store
The single source of truth for your application state.

\`\`\`tsx
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    counter: counterReducer,
    user: userReducer,
  },
});
\`\`\`

### 2. Actions
Plain objects describing what happened.

\`\`\`tsx
const increment = () => ({ type: 'counter/increment' });
const setUser = (user) => ({ type: 'user/set', payload: user });
\`\`\`

### 3. Reducers
Pure functions that calculate new state.

\`\`\`tsx
const counterReducer = (state = 0, action) => {
  switch (action.type) {
    case 'counter/increment':
      return state + 1;
    case 'counter/decrement':
      return state - 1;
    default:
      return state;
  }
};
\`\`\`

## Modern Redux with Redux Toolkit

Redux Toolkit simplifies everything:

\`\`\`tsx
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: (state) => state + 1,
    decrement: (state) => state - 1,
  },
});

export const { increment, decrement } = counterSlice.actions;
export default counterSlice.reducer;
\`\`\`

## Conclusion

Redux provides predictable state management through a unidirectional data flow. With Redux Toolkit, the boilerplate is minimal and the developer experience is excellent.
`,
    img: "/images/articles/What is Redux with easy explanation.png",
    featured: false,
    visible: false,
    category: "Architecture",
    badges: ["Redux", "State", "Patterns"],
    status: "published",
  },
  {
    id: 5,
    title: "Create Modal Component In React Using React Portals",
    url: "/articles/react-portals-modal",
    slug: "react-portals-modal",
    lang: "EN",
    reading_time: "7 min read",
    published_at: "2023-03-05",
    summary:
      "Learn how to create accessible and reusable modal components using React Portals.",
    content: `# Create Modal Component In React Using React Portals

Modals need to escape their parent's DOM hierarchy to avoid z-index and overflow issues. React Portals make this possible.

## Why Portals?

Without portals, modals rendered inside deeply nested components can be:
- Clipped by parent overflow
- Behind other elements due to stacking context
- Affected by parent transforms

## The Modal Component

\`\`\`tsx
import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="modal-header">
          <h2 id="modal-title">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </header>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};
\`\`\`

## Accessibility Features

Our modal includes:
- Focus trap and restoration
- Escape key to close
- Click outside to close
- Proper ARIA attributes
- Scroll lock on body

## Conclusion

React Portals solve the DOM hierarchy problem elegantly. Combined with proper accessibility, you get modals that work great for all users.
`,
    img: "/images/articles/create modal component in react using react portals.png",
    featured: false,
    visible: false,
    category: "Architecture",
    badges: ["Portals", "UI", "Accessibility"],
    status: "published",
  },
  {
    id: 6,
    title: "Understanding React Server Components",
    url: "/articles/react-server-components",
    slug: "react-server-components",
    lang: "EN",
    reading_time: "11 min read",
    published_at: "2023-02-28",
    summary:
      "Deep dive into React Server Components and how they change the way we build React applications.",
    content: `# Understanding React Server Components\n\nReact Server Components represent a paradigm shift in how we think about React rendering.`,
    img: "/images/articles/pagination component in reactjs.jpg",
    featured: false,
    visible: false,
    category: "Architecture",
    badges: ["RSC", "SSR", "Rendering"],
    status: "published",
  },
  {
    id: 7,
    title: "Building Accessible React Applications",
    url: "/articles/accessible-react",
    slug: "accessible-react",
    lang: "EN",
    reading_time: "9 min read",
    published_at: "2023-02-20",
    summary:
      "Learn essential accessibility practices for creating inclusive React applications that work for everyone.",
    content: `# Building Accessible React Applications\n\nAccessibility is not optional - it's a fundamental aspect of good web development.`,
    img: "/images/articles/form validation in reactjs using custom react hook.png",
    featured: false,
    visible: false,
    category: "Testing",
    badges: ["a11y", "Inclusive", "Semantics"],
    status: "published",
  },
  {
    id: 8,
    title: "State Management Patterns in Modern React",
    url: "/articles/state-management-patterns",
    slug: "state-management-patterns",
    lang: "EN",
    reading_time: "14 min read",
    published_at: "2023-02-15",
    summary:
      "Compare different state management approaches in React: Context, Redux, Zustand, and Jotai.",
    content: `# State Management Patterns in Modern React\n\nChoosing the right state management solution depends on your application's needs.`,
    img: "/images/articles/What is Redux with easy explanation.png",
    featured: false,
    visible: false,
    category: "Architecture",
    badges: ["Context", "Redux", "Zustand"],
    status: "published",
  },
  {
    id: 9,
    title: "Optimizing React Performance with useMemo and useCallback",
    url: "/articles/react-performance-optimization",
    slug: "react-performance-optimization",
    lang: "EN",
    reading_time: "8 min read",
    published_at: "2023-02-10",
    summary:
      "Master the art of React performance optimization using memoization techniques.",
    content: `# Optimizing React Performance\n\nLearn when and how to use useMemo and useCallback effectively.`,
    img: "/images/articles/create loading screen in react js.jpg",
    featured: false,
    visible: false,
    category: "Performance",
    badges: ["Memoization", "useMemo", "useCallback"],
    status: "published",
  },
  {
    id: 10,
    title: "Testing React Components with Jest and React Testing Library",
    url: "/articles/react-testing",
    slug: "react-testing",
    lang: "EN",
    reading_time: "13 min read",
    published_at: "2023-02-05",
    summary:
      "A comprehensive guide to writing effective tests for your React components.",
    content: `# Testing React Components\n\nGood tests give you confidence to refactor and add features without breaking existing functionality.`,
    img: "/images/articles/create modal component in react using react portals.png",
    featured: false,
    visible: false,
    category: "Testing",
    badges: ["Jest", "RTL", "Coverage"],
    status: "published",
  },
  {
    id: 11,
    title: "Mastering TypeScript Generics for React Components",
    url: "/articles/typescript-generics-react",
    slug: "typescript-generics-react",
    lang: "EN",
    reading_time: "11 min read",
    published_at: "2023-03-25",
    summary:
      "Learn how to leverage TypeScript generics to create flexible, type-safe React components that scale with your application.",
    content: `# Mastering TypeScript Generics for React Components\n\nGenerics are one of TypeScript's most powerful features for building reusable, type-safe components.`,
    img: "/images/articles/pagination component in reactjs.jpg",
    featured: true,
    visible: false,
    category: "React",
    badges: ["TypeScript", "Generics", "Components"],
    status: "published",
  },
  {
    id: 12,
    title: "Building Real-Time Features with WebSockets in React",
    url: "/articles/websockets-react",
    slug: "websockets-react",
    lang: "EN",
    reading_time: "14 min read",
    published_at: "2023-03-28",
    summary:
      "Implement real-time functionality in your React apps using WebSockets for live updates, chat features, and collaborative editing.",
    content: `# Building Real-Time Features with WebSockets in React\n\nWebSockets enable bidirectional communication between client and server for truly real-time experiences.`,
    img: "/images/articles/create loading screen in react js.jpg",
    featured: true,
    visible: false,
    category: "Architecture",
    badges: ["WebSockets", "Realtime", "Scalability"],
    status: "published",
  },
  {
    id: 13,
    title: "Advanced CSS Grid Layouts for Modern Web Apps",
    url: "/articles/css-grid-layouts",
    slug: "css-grid-layouts",
    lang: "EN",
    reading_time: "10 min read",
    published_at: "2023-03-30",
    summary:
      "Master CSS Grid to create complex, responsive layouts with minimal code and maximum flexibility.",
    content: `# Advanced CSS Grid Layouts for Modern Web Apps\n\nCSS Grid revolutionizes how we approach layout design, offering unprecedented control over two-dimensional layouts.`,
    img: "/images/articles/form validation in reactjs using custom react hook.png",
    featured: true,
    visible: false,
    category: "Architecture",
    badges: ["CSS Grid", "Layouts", "Responsive"],
    status: "published",
  },
];

export default articlesMock;
