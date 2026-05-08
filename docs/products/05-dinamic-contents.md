---
id: 05-dinamic-contents
aliases: []
tags: []
---

Sí.
Acá acabás de entrar en un problema MUY real de:

CMS + content modeling + presentation modeling

y honestamente tu intuición de:

- JSON
- bloques
- secciones
- imágenes asociadas
- render dinámico

va exactamente hacia donde evolucionan los CMS modernos.

Lo importante es entender algo clave:

⸻

🔥 Error conceptual común

Muchos arrancan pensando:

“un proyecto tiene texto”

pero en realidad lo que tenés es:

un proyecto tiene bloques de contenido

y cada bloque:

- puede tener texto
- imagen
- layout
- alineación
- metadata
- CTA
- charts
- code
- architecture diagrams
- etc.

⸻

Entonces:

❌ NO modeles:

project.content = "texto gigante markdown"

⸻

✅ Modelá:

```
project.sections = [...]
```

⸻

Y ahí se destraba TODO

Porque ahora:

cada sección es renderizable

⸻

Lo que vos necesitás realmente

Un “Block Content System”

Muy parecido a:

- Notion
- Sanity
- PayloadCMS
- Contentful
- Ghost editor
- MDX blocks

⸻

Arquitectura correcta

Tabla projects

```
{
  id,
  slug,
  title,
  subtitle,
  heroImageUrl,
  createdAt,
}
```

⸻

Tabla project_sections

```
{
  id,
  projectId,
  type,
  order,
  payload
}
```

⸻

¿Qué sería payload?

JSON flexible.

⸻

Ejemplo REAL

type:

```
"text-image"
```

⸻

payload:

```
{
  "title": "Pipeline Health & Data Quality",
  "text": "Health checks determine...",
  "imageUrl": "https://...",
  "imageSide": "right"
}
```

⸻

Otra sección

type:

"architecture-diagram"

payload:

```
{
  "title": "Architecture",
  "diagramUrl": "https://...",
  "caption": "Event-driven pipeline"
}
```

⸻

Otra

type:

"metrics-grid"

payload:

```
{
  "items": [
    {
      "label": "Latency",
      "value": "35ms"
    }
  ]
}
```

⸻

Y ahora tu frontend hace:

```
sections.map(section => {
  switch(section.type) {
    case 'text-image':
      return <TextImageBlock />
    case 'architecture-diagram':
      return <ArchitectureBlock />
  }
})
```

⸻

🔥 Esto es MUY importante

Ahora:

- NO necesitás redeploy
- NO necesitás hardcodear layouts
- NO necesitás cambiar React

porque:

- el layout viene desde la DB.

⸻

Y esto responde exactamente a:

“la imagen alterna izquierda/derecha”

Porque eso es metadata del bloque.

⸻

Ejemplo

```
{
  "imageSide": "left"
}
```

⸻

O incluso:

```
{
  "variant": "image-left"
}
```

⸻

Entonces el frontend:

```
className={variant === 'image-left'
 ? 'flex-row'
 : 'flex-row-reverse'}
```

⸻

Esto es exactamente lo que usan:

- Stripe docs
- Linear docs
- CMS modernos
- landing builders
- Notion
- Sanity
- Payload

⸻

Ahora hablemos de las imágenes

NO las guardes dentro del JSON.

Guardá URLs.

⸻

Entonces:

payload

```
{
  "imageUrl": "https://assets..."
}
```

⸻

O mejor todavía

Tabla assets

```
assets
  id
  url
  mimeType
  width
  height
  alt
```

⸻

Y el payload:

```
{
  "imageAssetId": "uuid"
}
```

⸻

Pero honestamente:

Al principio:

guardá URL directo.

Más simple.

⸻

Y ahora viene LO MÁS importante

No modeles “artículos” y “proyectos” tan distinto.

Porque en realidad ambos son:

content entries

⸻

La diferencia es:

el schema de bloques

Proyecto:

- hero
- architecture
- walkthrough
- screenshots

Artículo:

- markdown
- quotes
- embeds
- code

⸻

Entonces eventualmente terminás con:

content_entries
content_blocks
assets

⸻

Y ahí nace tu CMS.

Literalmente.

⸻

🔥 Mi recomendación REAL para vos

No uses:

- markdown gigante
- HTML gigante
- texto plano gigante

Porque después:

- no podés insertar imágenes bien
- no podés reordenar
- no podés hacer layouts
- no podés alternar
- no podés hacer responsive elegante

⸻

En tu caso PARTICULAR

Por cómo diseñás:

- architecture sections
- screenshots
- walkthroughs
- observability
- diagrams

vos necesitás:

block-based rendering

100%.

⸻

Entonces tu modelo ideal HOY

projects

```
{
  id,
  slug,
  title,
  heroImageUrl,
}
```

⸻

project_sections

```
{
  id,
  projectId,
  type,
  order,
  payload
}
```

⸻

payload flexible

```
{
  "title": "...",
  "text": "...",
  "imageUrl": "...",
  "imageSide": "left"
}
```

⸻

Y el frontend

Dynamic Renderer

```
<BlockRenderer section={section} />
```

⸻

Beneficio enorme

Ahora:

- podés crear proyectos desde admin panel
- sin deploy
- sin tocar código
- completamente dinámico

y eso ya empieza a convertirse en:

portfolio platform

más que un simple portfolio estático.
