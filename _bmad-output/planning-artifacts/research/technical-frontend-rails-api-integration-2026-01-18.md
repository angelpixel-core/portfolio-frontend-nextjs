---
stepsCompleted: [1, 2, 3]
inputDocuments: [docs/index.md, _bmad-output/analysis/brainstorming-session-2026-01-15.md]
workflowType: 'research'
lastStep: 3
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

## Step 3: Integration Patterns

### 3.1 Error Handling Strategies

#### Arquitectura de Error Handling

```
┌─────────────────────────────────────────────────────────┐
│                    Next.js Error Layers                 │
├─────────────────────────────────────────────────────────┤
│  global-error.tsx  │  Errores catastróficos (root)     │
│  error.tsx         │  Errores por segmento de ruta     │
│  not-found.tsx     │  Recursos no encontrados (404)    │
│  try/catch         │  Errores en Server Components     │
│  Error Boundary    │  Errores en Client Components     │
└─────────────────────────────────────────────────────────┘
```

#### error.tsx para Segmentos de Ruta

```typescript
// app/projects/error.tsx
'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to monitoring service
    console.error('Projects error:', error);
  }, [error]);

  return (
    <div className="error-container">
      <h2>Something went wrong loading projects</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Try again</button>
    </div>
  );
}
```

#### API Fetch con Retry Logic

```typescript
// lib/api-client.ts
interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

export async function fetchWithRetry<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const { retries = 3, retryDelay = 1000, ...fetchOptions } = options;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        // No retry para errores 4xx (client errors)
        if (response.status >= 400 && response.status < 500) {
          const error = await response.json();
          throw new ApiError(error.message, response.status);
        }
        throw new Error(`HTTP ${response.status}`);
      }

      return response.json();
    } catch (error) {
      if (attempt === retries) throw error;

      // Exponential backoff
      await new Promise(resolve =>
        setTimeout(resolve, retryDelay * Math.pow(2, attempt))
      );
    }
  }

  throw new Error('Max retries exceeded');
}

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }
}
```

#### TanStack Query: Error Handling Global

```typescript
// app/providers.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // No retry para 4xx errors
        if (error instanceof ApiError && error.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      onError: (error) => {
        // Global error notification
        toast.error(error.message);
      },
    },
  },
});
```

**Fuentes:**
- [Next.js Error Handling Guide](https://nextjs.org/docs/app/getting-started/error-handling)
- [Next.js Error Handling Patterns](https://betterstack.com/community/guides/scaling-nodejs/error-handling-nextjs/)
- [Error Boundaries Deep Dive](https://dev.to/rajeshkumaryadavdotcom/understanding-error-boundaries-in-nextjs-a-deep-dive-with-examples-fk0)

---

### 3.2 Caching Patterns: ISR + Stale-While-Revalidate

#### Estrategia de Cache por Tipo de Datos

| Tipo de Dato | Estrategia | Revalidación |
|--------------|------------|--------------|
| **Proyectos** | ISR + tags | 1 hora + on-demand |
| **Artículos** | ISR | 5 minutos |
| **Perfil** | Static | Build time |
| **Analytics** | No cache | Siempre fresh |

#### ISR con Time-Based Revalidation

```typescript
// app/projects/page.tsx
async function getProjects() {
  const res = await fetch(`${process.env.RAILS_API_URL}/api/v1/projects`, {
    next: {
      revalidate: 3600,  // Revalidar cada hora
      tags: ['projects'], // Tag para invalidación manual
    },
  });

  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}
```

#### On-Demand Revalidation (Webhook desde Rails)

```typescript
// app/api/revalidate/route.ts
import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidate-secret');

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { tag } = await request.json();

  try {
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, tag });
  } catch (error) {
    return NextResponse.json({ error: 'Revalidation failed' }, { status: 500 });
  }
}
```

#### Rails: Trigger Revalidation

```ruby
# app/models/concerns/revalidatable.rb
module Revalidatable
  extend ActiveSupport::Concern

  included do
    after_commit :trigger_revalidation, on: [:create, :update, :destroy]
  end

  private

  def trigger_revalidation
    return unless Rails.env.production?

    HTTParty.post(
      "#{ENV['FRONTEND_URL']}/api/revalidate",
      headers: {
        'Content-Type' => 'application/json',
        'x-revalidate-secret' => ENV['REVALIDATE_SECRET']
      },
      body: { tag: self.class.name.downcase.pluralize }.to_json
    )
  rescue => e
    Rails.logger.error("Revalidation failed: #{e.message}")
  end
end

# app/models/project.rb
class Project < ApplicationRecord
  include Revalidatable
end
```

#### Cache Tags para Granularidad

```typescript
// Fetch con múltiples tags
const project = await fetch(`/api/v1/projects/${id}`, {
  next: {
    tags: ['projects', `project-${id}`],
  },
});

// Invalidar solo un proyecto específico
revalidateTag(`project-${id}`);

// Invalidar todos los proyectos
revalidateTag('projects');
```

**Fuentes:**
- [Next.js Caching and Revalidating](https://nextjs.org/docs/app/getting-started/caching-and-revalidating)
- [ISR Guide](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
- [Stale-While-Revalidate in Next.js](https://dev.to/omaiboroda/stale-while-revalidate-and-its-usage-with-nextjs-55c7)

---

### 3.3 Real-Time Updates

#### Comparativa de Opciones

| Método | Dirección | Complejidad | Caso de Uso |
|--------|-----------|-------------|-------------|
| **Polling** | Client→Server | Baja | Updates poco frecuentes |
| **SSE** | Server→Client | Media | Notificaciones, live feeds |
| **WebSocket** | Bidireccional | Alta | Chat, colaboración real-time |
| **ActionCable** | Bidireccional | Media-Alta | Full Rails integration |

#### Recomendación para Portfolio

> 💡 Para un portfolio, **SSE** o **Polling con React Query** es suficiente. WebSockets/ActionCable son overkill a menos que se implemente chat o colaboración en tiempo real.

#### SSE: Server-Sent Events en Next.js

```typescript
// app/api/notifications/stream/route.ts
export async function GET() {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: object) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
        );
      };

      // Enviar heartbeat cada 30s
      const heartbeat = setInterval(() => {
        sendEvent({ type: 'heartbeat', timestamp: Date.now() });
      }, 30000);

      // Cleanup on close
      return () => clearInterval(heartbeat);
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

```typescript
// hooks/useNotifications.ts
'use client';

import { useEffect, useState } from 'react';

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const eventSource = new EventSource('/api/notifications/stream');

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type !== 'heartbeat') {
        setNotifications(prev => [...prev, data]);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      // Reconectar después de 5s
      setTimeout(() => {
        // Reiniciar conexión
      }, 5000);
    };

    return () => eventSource.close();
  }, []);

  return notifications;
}
```

#### Polling con React Query (Más Simple)

```typescript
// Para updates menos frecuentes, polling es más simple
const { data } = useQuery({
  queryKey: ['notifications'],
  queryFn: fetchNotifications,
  refetchInterval: 30000, // Polling cada 30 segundos
  refetchIntervalInBackground: false, // Solo cuando tab activo
});
```

#### ActionCable (Si se necesita WebSocket con Rails)

```typescript
// lib/actioncable.ts
import { createConsumer } from '@rails/actioncable';

const consumer = createConsumer(process.env.NEXT_PUBLIC_CABLE_URL);

export function subscribeToChannel(
  channelName: string,
  params: object,
  callbacks: {
    received: (data: any) => void;
    connected?: () => void;
    disconnected?: () => void;
  }
) {
  return consumer.subscriptions.create(
    { channel: channelName, ...params },
    callbacks
  );
}
```

**Fuentes:**
- [Real-Time in Next.js: SSE vs WebSockets](https://hackernoon.com/streaming-in-nextjs-15-websockets-vs-server-sent-events)
- [SSE in Next.js](https://www.pedroalonso.net/blog/sse-nextjs-real-time-notifications/)
- [ActionCable Overview](https://guides.rubyonrails.org/action_cable_overview.html)

---

### 3.4 API Versioning Strategies

#### Estrategia Recomendada: URL Path Versioning

```
/api/v1/projects     ← Versión actual
/api/v2/projects     ← Nueva versión con breaking changes
```

#### Rails: Configuración con Namespaces

```ruby
# config/routes.rb
Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :projects
      resources :articles
    end

    namespace :v2 do
      resources :projects  # Nueva estructura de respuesta
    end
  end
end

# app/controllers/api/v1/projects_controller.rb
module Api
  module V1
    class ProjectsController < ApplicationController
      def index
        @projects = Project.all
        render json: ProjectSerializer.new(@projects)
      end
    end
  end
end
```

#### Frontend: Configuración de API Version

```typescript
// lib/api-config.ts
const API_VERSION = 'v1';

export const apiConfig = {
  baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/${API_VERSION}`,
  version: API_VERSION,
};

// lib/api-client.ts
import { apiConfig } from './api-config';

export async function apiGet<T>(endpoint: string): Promise<T> {
  const url = `${apiConfig.baseUrl}${endpoint}`;
  const response = await fetch(url);
  return response.json();
}

// Uso
const projects = await apiGet<Project[]>('/projects');
```

#### Deprecation Headers

```ruby
# app/controllers/api/v1/application_controller.rb
module Api
  module V1
    class ApplicationController < ActionController::API
      before_action :add_deprecation_warning

      private

      def add_deprecation_warning
        response.headers['X-API-Deprecation'] = 'This version will be deprecated on 2026-06-01'
        response.headers['X-API-Sunset'] = '2026-06-01'
      end
    end
  end
end
```

```typescript
// Frontend: Detectar deprecation
const response = await fetch('/api/v1/projects');
const deprecation = response.headers.get('X-API-Deprecation');

if (deprecation) {
  console.warn(`API Deprecation Warning: ${deprecation}`);
}
```

**Fuentes:**
- [Rails API Versioning | Honeybadger](https://www.honeybadger.io/blog/rails-api-versioning/)
- [Building APIs with Rails 2025](https://codescaptain.medium.com/building-apis-with-rails-best-practices-for-2025-295e0809115d)
- [Flexible API Versioning](https://petr.codes/blog/rails/flexible-api-versioning-with-rails/)

---

