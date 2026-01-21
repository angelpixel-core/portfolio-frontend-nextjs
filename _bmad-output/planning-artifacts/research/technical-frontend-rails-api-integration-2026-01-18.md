---
stepsCompleted: [1, 2]
inputDocuments: [docs/index.md, _bmad-output/analysis/brainstorming-session-2026-01-15.md]
workflowType: 'research'
lastStep: 2
research_type: 'technical'
research_topic: 'Patrones de integración Frontend-Backend con Rails API'
research_goals: 'Next.js + Rails API, autenticación, data fetching patterns, type safety, error handling'
user_name: 'Angel DevStack'
date: '2026-01-18'
web_research_enabled: true
source_verification: true
---

# Research Report: Frontend-Backend Integration with Rails API

**Date:** 2026-01-18
**Author:** Angel DevStack
**Research Type:** Technical

---

## Research Overview

Investigación técnica sobre patrones de integración entre Next.js frontend y Rails API backend, cubriendo:

1. Arquitectura de comunicación Next.js ↔ Rails
2. Autenticación y manejo de sesiones
3. Data fetching patterns (RSC, React Query, SWR)
4. Type safety entre frontend y backend
5. Error handling y retry strategies

Metodología: Datos web actuales con verificación rigurosa de fuentes.

---

## Technical Research Scope Confirmation

**Research Topic:** Patrones de integración Frontend-Backend con Rails API
**Research Goals:** Next.js + Rails API, autenticación, data fetching patterns, type safety, error handling

**Technical Research Scope:**

- API Architecture - REST vs GraphQL, endpoint design
- Authentication - JWT, sessions, OAuth integration
- Data Fetching - Server Components, React Query, SWR
- Type Safety - OpenAPI, TypeScript generation
- Error Handling - Retry strategies, error boundaries

**Scope Confirmed:** 2026-01-18

---

## Step 2: Technology Stack Analysis

### 2.1 Arquitectura Next.js + Rails API

#### Patrón Backend-for-Frontend (BFF)

Next.js soporta el patrón "Backend for Frontend", permitiendo crear endpoints públicos que manejan requests HTTP y retornan cualquier tipo de contenido.

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js Frontend                     │
├─────────────────────────────────────────────────────────┤
│  Server Components  │  Client Components  │  API Routes │
│    (RSC + fetch)    │   (React Query)     │    (BFF)    │
└──────────┬──────────┴─────────┬───────────┴──────┬──────┘
           │                    │                   │
           └────────────────────┼───────────────────┘
                                │
                    ┌───────────▼───────────┐
                    │    Rails API Backend   │
                    │  (REST / JSON:API)     │
                    └───────────────────────┘
```

#### Opciones de Arquitectura

| Enfoque | Descripción | Cuándo Usar |
|---------|-------------|-------------|
| **Direct Fetch** | RSC llama directamente a Rails API | Datos públicos, SSR/SSG |
| **BFF Pattern** | Next.js API routes como proxy | Autenticación, agregación |
| **Client-side** | React Query desde Client Components | Datos dinámicos, real-time |
| **Hybrid** | Combinar RSC + React Query | Mayoría de apps modernas |

#### Configuración CORS en Rails

```ruby
# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins ENV['FRONTEND_URL'] || 'http://localhost:3000'

    resource '*',
      headers: :any,
      methods: [:get, :post, :put, :patch, :delete, :options, :head],
      expose: ['Authorization'],  # Crítico para JWT
      credentials: true
  end
end
```

**Fuentes:**
- [Next.js Backend for Frontend Guide](https://nextjs.org/docs/app/guides/backend-for-frontend)
- [Rails + Next.js Web Application](https://clouddevs.com/ruby-on-rails/web-application-with-next-js-frontend/)
- [nextjs-on-rails GitHub](https://github.com/akhil-gautam/nextjs-on-rails)

---

### 2.2 Autenticación JWT con Rails + Next.js

#### Stack de Autenticación

| Componente | Rails | Next.js |
|------------|-------|---------|
| **Gems** | Rodauth + rodauth-rails | NextAuth.js / Auth.js |
| **Storage** | JWT en response header | HttpOnly Cookie |
| **Estrategia** | Stateless tokens + refresh | `strategy: "jwt"` |

#### ¿Por qué Rodauth sobre Devise?

| Aspecto | Rodauth | Devise |
|---------|---------|--------|
| **Arquitectura** | Modular, plugin-based | Monolítico |
| **JWT nativo** | Plugin oficial `rodauth-jwt` | Requiere gem adicional |
| **Seguridad** | Diseñado security-first | Requiere configuración extra |
| **API-only** | Soporte nativo | Workarounds necesarios |
| **Mantenimiento** | Activo, Jeremy Evans | Legacy, menos actualizaciones |

#### Rails API: Configuración Rodauth

```ruby
# Gemfile
gem 'rodauth-rails'
gem 'jwt'
gem 'rack-cors'

# app/misc/rodauth_main.rb
class RodauthMain < Rodauth::Rails::Auth
  configure do
    # Habilitar features necesarias
    enable :login, :logout, :create_account, :jwt, :jwt_refresh

    # Configuración JWT
    jwt_secret { ENV['RODAUTH_JWT_SECRET'] }
    hmac_secret { ENV['RODAUTH_HMAC_SECRET'] }

    # Tokens
    jwt_access_token_key 'access_token'
    jwt_refresh_token_key 'refresh_token'
    jwt_access_token_period 3600        # 1 hora
    jwt_refresh_token_deadline_interval 86400 * 30  # 30 días

    # API-only mode
    only_json? true
    json_response_success_key 'success'

    # Después de login exitoso
    after_login do
      json_response['user'] = {
        id: account[:id],
        email: account[:email]
      }
    end
  end
end
```

#### Rutas Rodauth API

```ruby
# config/routes.rb
Rails.application.routes.draw do
  # Rodauth monta automáticamente:
  # POST /login        - Login con JWT
  # POST /logout       - Logout (revoca refresh token)
  # POST /create-account - Registro
  # POST /jwt-refresh  - Refresh token

  namespace :api do
    namespace :v1 do
      resources :projects
    end
  end
end
```

#### Next.js: Middleware de Autenticación

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/protected/:path*'],
};
```

#### Best Practices de Seguridad (2025)

| Práctica | Implementación |
|----------|----------------|
| **Token Storage** | HttpOnly Cookies (no localStorage) |
| **Token Claims** | Solo datos necesarios (roles, team_ids) |
| **Expiration** | Tokens cortos + refresh rotation |
| **CSRF Protection** | Tokens firmados en cada request |
| **Rate Limiting** | Prevenir brute force en login |

> ⚠️ **Importante:** "Authentication isn't authorization; confirm the user is allowed to perform the action, not merely logged in."

**Fuentes:**
- [Rodauth Documentation](https://rodauth.jeremyevans.net/)
- [rodauth-rails GitHub](https://github.com/janko/rodauth-rails)
- [JWT Middleware in Next.js](https://dev.to/leapcell/implementing-jwt-middleware-in-nextjs-a-complete-guide-to-auth-1b2d)
- [Complete Next.js Security Guide 2025](https://www.turbostarter.dev/blog/complete-nextjs-security-guide-2025-authentication-api-protection-and-best-practices)

---

### 2.3 Data Fetching: RSC + TanStack Query

#### Estrategia Híbrida (Recomendada 2025)

> 💡 **"RSC + TanStack Query is the hybrid architecture powering the fastest, most maintainable React apps today."**

```
┌─────────────────────────────────────────────────────────┐
│                    Data Fetching Strategy               │
├─────────────────────────────────────────────────────────┤
│  Initial Load (SSR)    │  Client Interactivity         │
│  ─────────────────────  │  ────────────────────────────  │
│  React Server          │  TanStack Query               │
│  Components            │  - Caching                    │
│  - Fast initial load   │  - Background refetch         │
│  - SEO optimized       │  - Optimistic updates         │
│  - No client JS        │  - Mutations                  │
└─────────────────────────┴───────────────────────────────┘
```

#### Server Component: Fetch Directo

```typescript
// app/projects/page.tsx (Server Component)
async function getProjects() {
  const res = await fetch(`${process.env.RAILS_API_URL}/api/v1/projects`, {
    headers: {
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 }, // ISR: revalidar cada 60s
  });

  if (!res.ok) throw new Error('Failed to fetch projects');
  return res.json();
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

#### Client Component: TanStack Query

```typescript
// components/ProjectList.tsx
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const fetchProjects = async () => {
  const res = await fetch('/api/projects');
  if (!res.ok) throw new Error('Network response was not ok');
  return res.json();
};

export function ProjectList() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/projects/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  if (isLoading) return <ProjectSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <ul>
      {data.map(project => (
        <li key={project.id}>
          {project.title}
          <button onClick={() => deleteMutation.mutate(project.id)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}
```

#### Prefetching con SSR + Hydration

```typescript
// app/providers.tsx
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

**Fuentes:**
- [TanStack Query Overview](https://tanstack.com/query/latest/docs/framework/react/overview)
- [RSC + TanStack Query 2026](https://dev.to/krish_kakadiya_5f0eaf6342/react-server-components-tanstack-query-the-2026-data-fetching-power-duo-you-cant-ignore-21fj)
- [Advanced Server Rendering](https://tanstack.com/query/latest/docs/framework/react/guides/advanced-ssr)

---

### 2.4 Type Safety: OpenAPI → TypeScript

#### Pipeline de Generación de Tipos

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Rails API   │───▶│ OpenAPI     │───▶│ TypeScript  │
│ (rswag)     │    │ Schema      │    │ Types       │
└─────────────┘    └─────────────┘    └─────────────┘
        │                                    │
        │          ┌─────────────┐           │
        └─────────▶│ Typelizer   │◀──────────┘
                   │ (Ruby→TS)   │
                   └─────────────┘
```

#### Rails: Generación de OpenAPI con rswag

```ruby
# Gemfile
gem 'rswag-api'
gem 'rswag-ui'
gem 'rswag-specs'

# spec/requests/api/v1/projects_spec.rb
require 'swagger_helper'

RSpec.describe 'Projects API', type: :request do
  path '/api/v1/projects' do
    get 'List all projects' do
      tags 'Projects'
      produces 'application/json'

      response '200', 'projects found' do
        schema type: :array,
          items: {
            type: :object,
            properties: {
              id: { type: :integer },
              title: { type: :string },
              description: { type: :string },
              technologies: { type: :array, items: { type: :string } },
              featured: { type: :boolean }
            },
            required: ['id', 'title']
          }

        run_test!
      end
    end
  end
end
```

#### Next.js: Generación de Tipos

```bash
# Instalar openapi-typescript
npm install -D openapi-typescript

# Generar tipos desde OpenAPI spec
npx openapi-typescript http://localhost:3001/api-docs/v1/swagger.yaml -o src/types/api.d.ts
```

```typescript
// src/types/api.d.ts (generado automáticamente)
export interface paths {
  "/api/v1/projects": {
    get: operations["getProjects"];
    post: operations["createProject"];
  };
  "/api/v1/projects/{id}": {
    get: operations["getProject"];
    put: operations["updateProject"];
    delete: operations["deleteProject"];
  };
}

export interface components {
  schemas: {
    Project: {
      id: number;
      title: string;
      description?: string;
      technologies?: string[];
      featured?: boolean;
    };
  };
}
```

#### Uso de Tipos Generados

```typescript
// src/lib/api.ts
import type { components } from '@/types/api';

type Project = components['schemas']['Project'];

export async function getProjects(): Promise<Project[]> {
  const res = await fetch('/api/v1/projects');
  return res.json();
}

export async function createProject(data: Omit<Project, 'id'>): Promise<Project> {
  const res = await fetch('/api/v1/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}
```

#### Typelizer: Ruby → TypeScript Directo

```ruby
# Gemfile
gem 'typelizer'

# app/serializers/project_serializer.rb
class ProjectSerializer < ApplicationSerializer
  # Typelizer genera tipos TS automáticamente
  attributes :id, :title, :description, :featured
  attribute :technologies, type: :array, items: :string

  has_many :tags
end
```

**Fuentes:**
- [OpenAPI TypeScript Generation | HackerOne](https://www.hackerone.com/blog/generating-typescript-types-openapi-rest-api-consumption)
- [Generating OpenAPI in Rails | Evil Martians](https://evilmartians.com/chronicles/let-there-be-docs-generating-openapi-schema-across-rails-stack)
- [openapi-codegen GitHub](https://github.com/fabien0102/openapi-codegen)

---

