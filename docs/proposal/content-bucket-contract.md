---
id: content-bucket-contract
aliases: []
tags: []
---

# 📘 Content Bucket — OpenAPI Contract (Propuesta)

Objetivo: definir el contrato mínimo, estable y future-proof entre el frontend y un backend de contenido (read-only)
No implica que el backend exista hoy
Sí implica que el frontend deja de “inventar” la forma de los datos

---

1. Qué es el “Content Bucket”

Un Content Bucket es:
• Un backend read-only
• Sin autenticación (por ahora)
• Sin escritura desde frontend
• Fuente única de contenido “editorial / estructural”
• Sustituto futuro de:
• env vars
• mock.ts
• hardcoded fallbacks

Piensalo como:

“Un CMS headless minimalista, sin CMS”

---

2. Principios del contrato

2.1 Principios duros (no negociables)
• ✅ Read-only
• ✅ HTTP JSON
• ✅ Cacheable
• ✅ Idempotente
• ❌ No lógica de negocio
• ❌ No autenticación
• ❌ No mutaciones

---

2.2 Tipos de contenido que maneja

Tipo Ejemplo
Identidad nombre, roles
Texto largo bio, about
Config UI títulos, labels
Estructural nav items
Catálogos tecnologías, clientes
Assets URLs de imágenes

---

3. Base del OpenAPI

openapi: 3.1.0
info:
title: Portfolio Content API
version: 1.0.0
description: Read-only content bucket for frontend consumption

servers:

- url: https://content.example.com
  description: Production
- url: http://localhost:8000
  description: Local mock

---

4. Endpoints definidos

4.1 Profile

/profile:
get:
summary: Get profile information
responses:
'200':
description: Profile data
content:
application/json:
schema:
$ref: '#/components/schemas/Profile'

Profile:
type: object
required: [name, heroImage, contact]
properties:
name:
type: string
role:
type: string
heroImage:
type: string
format: uri
resumeUrl:
type: string
format: uri
contact:
$ref: '#/components/schemas/Contact'

---

4.2 Content Pages

/content/{page}:
get:
summary: Get page content
parameters: - name: page
in: path
required: true
schema:
type: string
enum: [home, about]
responses:
'200':
description: Page content
content:
application/json:
schema:
$ref: '#/components/schemas/PageContent'

PageContent:
type: object
required: [title, description]
properties:
title:
type: string
description:
type: string
body:
type: string

---

4.3 Navigation

/navigation:
get:
summary: Get navigation items
responses:
'200':
content:
application/json:
schema:
type: array
items:
$ref: '#/components/schemas/NavItem'

NavItem:
type: object
required: [label, href]
properties:
label:
type: string
href:
type: string
external:
type: boolean

---

4.4 Technologies (Skills / WordCloud)

/technologies:
get:
summary: Get technology catalog
responses:
'200':
content:
application/json:
schema:
type: array
items:
$ref: '#/components/schemas/Technology'

Technology:
type: object
required: [id, label, category]
properties:
id:
type: string
label:
type: string
category:
type: string
enum: [backend, frontend, infra, security, ux]
icon:
type: string
format: uri

---

4.5 Customers

/customers:
get:
summary: Get customer logos
responses:
'200':
content:
application/json:
schema:
type: array
items:
$ref: '#/components/schemas/Customer'

Customer:
type: object
required: [name, logo]
properties:
name:
type: string
logo:
type: string
format: uri

---

5. Relación con el frontend actual

Hoy
• React Query
• mocks
• env vars
• fallbacks

Mañana

useQuery({
queryKey: ['profile'],
queryFn: () => fetch('/profile').then(r => r.json()),
})

Y nada más cambia.

---

6. Qué NO entra en este contrato

🚫 Autenticación
🚫 Users
🚫 Tracking
🚫 Payments
🚫 Feature flags
🚫 Write endpoints

Eso viene después, con otro ADR.

---

7. Beneficios inmediatos
   • El frontend ya sabe cómo será el backend
   • El backend se puede desarrollar en paralelo
   • Los mocks pueden validarse contra schema
   • OpenAPI → SDKs → tests contractuales
   • Menos env vars
   • Menos deuda invisible

---

8. Decisión implícita que estamos proponiendo

“El contenido vive en un backend read-only, tipado y cacheable,
no en env vars ni en el frontend.”

---
