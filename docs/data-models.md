# Data Models Documentation

> Generated: 2026-01-15 | Project: portfolio-frontend-nextjs

## Overview

This project uses **Domain-Driven Design (DDD)** with **11 domain modules**. Each domain follows a consistent pattern with:
- `model/` - Data access layer with fetchAll/fetchById
- `model/schema.js` - Zod validation schemas
- `model/mock.js` - Mock data for development
- `queries/` - React Query hooks

## Domain Schemas

### Profile Domain

**File:** `src/domains/profile/model/schema.js`

```javascript
ProfileSchema = z.object({
  id: z.number(),
  nickname: z.string(),
  biography: z.array(z.string()),
  avatar: z.string(),
  location: z.string(),
  email: z.string().email(),
  calendly: z.string().url().optional(),
  telegram: z.string().url().optional(),
});
```

**Hook:** `useProfile()`

---

### Project Domain

**File:** `src/domains/project/model/schema.js`

```javascript
ProjectSchema = z.object({
  id: z.number(),
  title: z.string(),
  summary: z.string(),
  demo: z.string().url(),
  repository: z.string().url(),
  img: z.string(),
  tags: z.string(),
  featured: z.boolean(),
});
```

**Hooks:** `useProjects()`, `useProject(id)`

---

### Article Domain

**File:** `src/domains/article/model/schema.js`

**Hooks:** `useArticles()`, `useArticle(id)`

---

### Job Experience Domain

**File:** `src/domains/job-experience/model/schema.js`

**Hook:** `useJobExperiences()`

---

### Academic Domain

**File:** `src/domains/academic/model/schema.ts`

**Hook:** `useAcademics()`

---

### Experience Stat Domain

**File:** `src/domains/experience-stat/model/schema.js`

**Hook:** `useExperienceStats()`

---

### Technology Domain

**File:** `src/domains/technology/model/schema.js`

**Hook:** `useTechnologies()`

---

### Contact Point Domain

**File:** `src/domains/contact-point/model/schema.js`

**Hook:** `useContactPoints()`

---

### Navigation Item Domain

**File:** `src/domains/navigation-item/model/schema.js`

**Hook:** `useNavigationItems()`

---

### Content Domain

**File:** `src/domains/content/model/schema.js`

**Hook:** `useContents()`

---

### Customer Domain

**File:** `src/domains/customer/model/schema.js`

**Hook:** `useCustomers()`

---

## Data Access Pattern

All domains follow this pattern:

```javascript
// model/index.js
import { mock } from "./mock";
import httpRequest from "@/lib/httpRequest";

const ENDPOINT = "domain-name";

export const fetchAll = async (useMockFallback = true) => {
  if (useMockFallback) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mock), 500);
    });
  }
  return httpRequest(ENDPOINT);
};

export const fetchById = async (id, useMockFallback = true) => {
  if (useMockFallback) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(mock.find(item => item.id === id)), 300);
    });
  }
  return httpRequest(`${ENDPOINT}/${id}`);
};
```

## API Configuration

**File:** `src/lib/httpRequest/config.js`

```javascript
BASE_HOST = IS_PRODUCTION ? NEXT_PUBLIC_API_HOST : "http://localhost"
BACKEND_PORT = 8000
API_VERSION = "v1"
PATH_URL = "site"

API_URL = `${BASE_HOST}:${BACKEND_PORT}/api/v1/site`
```

**Endpoints Pattern:** `GET /api/v1/site/{domain}` or `GET /api/v1/site/{domain}/{id}`

## Mock vs Real API

The system supports both modes:

| Mode | Flag | Behavior |
|------|------|----------|
| Mock | `useMockFallback = true` | Returns data from `mock.js` with simulated delay |
| Real | `useMockFallback = false` | Calls backend Rails API via `httpRequest` |

## Domain Hooks Aggregator

**File:** `src/hooks/domains/index.js`

All domain hooks are exported from this file for easy imports:

```javascript
import { useProfile, useProjects, useArticles, ... } from "@/hooks";
```
