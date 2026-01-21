---
stepsCompleted: [step-01-init, step-02-discovery, step-03-success, step-04-journeys]
classification:
  projectType: web_app
  domain: general
  complexity: low
  projectContext: brownfield
inputDocuments:
  - docs/index.md
  - docs/project-overview.md
  - docs/architecture.md
  - docs/component-inventory.md
  - docs/data-models.md
  - docs/development-guide.md
  - docs/source-tree-analysis.md
  - _bmad-output/analysis/brainstorming-session-2026-01-15.md
  - _bmad-output/planning-artifacts/research/technical-js-to-ts-migration-react-2026-01-18.md
  - _bmad-output/planning-artifacts/research/technical-nextjs-testing-strategies-2026-01-18.md
  - _bmad-output/planning-artifacts/research/technical-frontend-rails-api-integration-2026-01-18.md
  - _bmad-output/planning-artifacts/research/technical-mobile-first-css-2026-01-18.md
workflowType: 'prd'
documentCounts:
  briefs: 0
  research: 4
  brainstorming: 1
  projectDocs: 7
---

# Product Requirements Document - portfolio-frontend-nextjs

**Author:** Angel DevStack
**Date:** 2026-01-21

---

## Success Criteria

### User Success

**El momento "aha!" (primeros 10 segundos):**
> *"Esta persona no solo sabe escribir código: sabe diseñar, estructurar, escalar y mantener un sistema."*

| Aspecto | Criterio de Éxito |
|---------|-------------------|
| **Visual** | Claridad, foco, cero ruido |
| **Percepción técnica** | Fluidez, performance, consistencia |
| **Experiencia** | Ausencia de fricción, feedback inmediato |
| **Diferenciador** | "No es otro portfolio" → es un producto real |

### Business/Career Success

| Métrica | Definición |
|---------|------------|
| **Calidad de leads** | Contactos técnicos relevantes, entrevistas senior-level |
| **Demostrabilidad** | Cada decisión técnica explicable y justificable |
| **Caso real** | Portfolio utilizable como ejemplo en entrevistas técnicas |
| **Señal de seniority** | No volumen, sino profundidad y calidad |

### Technical Success

| Métrica | Target |
|---------|--------|
| **Lighthouse Performance** | ≥90 |
| **Lighthouse Accessibility** | ≥95 |
| **LCP (Largest Contentful Paint)** | <2.5s |
| **CLS (Cumulative Layout Shift)** | <0.1 |
| **Test Coverage** | 80% (progresivo) |
| **Test Suite Speed** | <30s completa |
| **TypeScript** | Strict mode, zero `any` |
| **CI/CD** | Un comando que valide todo |

### Measurable Outcomes

| Outcome | Indicador |
|---------|-----------|
| **Producción-ready** | Deploy sin intervención manual, zero downtime |
| **Mantenibilidad** | Tiempo para agregar nuevo dominio <2h |
| **Estabilidad** | Zero regresiones en deploys |
| **DX** | Onboarding de contributor <30min |

---

## Product Scope

### MVP - 3 Meses (Core Production-Ready)

- [ ] Arquitectura frontend estabilizada (TypeScript strict)
- [ ] Integración funcional con Rails API (Rodauth auth)
- [ ] Performance y accessibility en targets (Lighthouse 90+/95+)
- [ ] DX robusto (tests, linting, CI pipeline)
- [ ] Casos clave completamente terminados (no todo el contenido)
- [ ] Mobile-first responsive completo

### Growth - 6 Meses (Refinamiento)

- [ ] Microinteracciones y polish UX
- [ ] Edge cases y error handling exhaustivo
- [ ] Test coverage 80%+
- [ ] Performance optimization avanzada
- [ ] Storybook documentación completa

### Vision (Futuro)

- Portfolio como plataforma viva (iterable, extensible)
- Design system exportable como package
- Modo "Developer View" (mostrar código/arquitectura)
- Métricas visibles como prueba de calidad
- Multi-idioma (i18n)

---

## User Journeys

### Journey 1: Tech Recruiter - "La Evaluación Rápida"

**Persona:** Sarah Chen, 34 años
- Senior Technical Recruiter en empresa de software enterprise
- 8 años de experiencia, ojo entrenado para detectar talento real
- Maneja 40+ búsquedas activas, tiempo es su recurso más escaso

**Situación:** Busca Senior Fullstack Developer (React + Ruby/Rails). Tiene 15 CVs en su inbox y 2 minutos por candidato para decidir si pasa al siguiente filtro.

**🎬 Opening Scene:**
Sarah recibe el LinkedIn de Angel con link al portfolio. Abre en una tab más entre muchas. Espera ver "otro portfolio más" con template genérico.

**📈 Rising Action:**
- **0-3 seg:** La página carga instantáneamente. Sin spinners, sin jank. Diseño limpio, profesional. *"Ok, esto ya es diferente."*
- **3-10 seg:** Escanea rápidamente: bio clara, stack visible (React, Rails, TypeScript), proyectos destacados con demos funcionales.
- **10-30 seg:** Hace click en un proyecto. La demo funciona. El código en GitHub está organizado, documentado, con tests.
- **30-60 seg:** Navega a la sección de experiencia. Timeline claro, empresas reconocibles, progresión lógica.

**🎯 Climax:**
Sarah intenta "romper" el sitio: resize agresivo, navegación rápida entre páginas, scroll violento. Nada se rompe. Todo fluye. *"Este desarrollador sabe lo que hace."*

**✅ Resolution:**
Sarah mueve a Angel al folder "First Round Interview". En su nota interna escribe: "Portfolio impecable, demuestra seniority real. Prioridad alta."

**Capabilities reveladas:** Performance impecable, responsive bulletproof, navegación fluida, proyectos con demos funcionales, código visible y profesional.

---

### Journey 2: Potential Client - "El Proyecto Urgente"

**Persona:** Carlos Mendoza, 41 años
- CTO de fintech startup (Serie A, 25 empleados)
- Necesita refuerzo técnico urgente para feature crítico
- No tiene tiempo para procesos largos de contratación

**Situación:** Su lead developer renunció. Tiene deadline en 6 semanas. Necesita alguien que pueda integrarse al stack (React + Rails) sin hand-holding.

**🎬 Opening Scene:**
Carlos busca "senior react rails developer portfolio" a las 11pm después de un día caótico. Encuentra el portfolio de Angel referenciado en un foro técnico.

**📈 Rising Action:**
- **Primera impresión:** *"Se ve profesional, no amateur."* El diseño transmite seriedad.
- **Exploración técnica:** Ve que usa el mismo stack (React + Rails). Los proyectos muestran arquitectura real, no toy projects.
- **Validación de seniority:** Lee la bio, ve la experiencia. Las tecnologías listadas coinciden exactamente con su stack.
- **Búsqueda de contacto:** Encuentra múltiples opciones claras: email, WhatsApp, Calendly.

**🎯 Climax:**
Carlos hace click en el link de Calendly. Puede agendar una call para mañana a las 9am. Sin formularios largos, sin esperas. *"Perfecto, puedo hablar con él mañana."*

**✅ Resolution:**
A las 9:05am del día siguiente, Carlos está en call con Angel. En 30 minutos acuerdan un engagement de consultoría. Carlos duerme tranquilo por primera vez en semanas.

**Capabilities reveladas:** CTAs de contacto visibles y múltiples, Calendly integrado, stack técnico claramente comunicado, proyectos que demuestran capacidad real.

---

### Journey 3: Peer Developer - "La Inspiración Técnica"

**Persona:** Marina López, 28 años
- Mid-level Frontend Developer en consultora
- 3 años de experiencia, quiere subir a senior
- Busca referencias de cómo estructurar proyectos "de verdad"

**Situación:** Está refactorizando una app React legacy. Necesita inspiración de arquitecturas bien hechas, no tutoriales básicos.

**🎬 Opening Scene:**
Marina encuentra el repo de GitHub del portfolio mientras busca ejemplos de "atomic design react". Ve que tiene documentación y decide explorar.

**📈 Rising Action:**
- **Exploración del código:** Navega la estructura de carpetas. *"Ah, así se organiza un proyecto DDD + Atomic Design."*
- **Descubrimiento de patrones:** Ve los custom hooks, la separación de concerns, los schemas con Zod. Toma notas.
- **Visita al portfolio:** Abre el sitio para ver el resultado final. Inspecciona el network tab, ve los tiempos de carga.
- **Deep dive:** Lee la documentación en `/docs/`. Encuentra diagramas de arquitectura, guías de desarrollo.

**🎯 Climax:**
Marina entiende un patrón que llevaba semanas intentando implementar. *"¡Así es como se conecta React Query con los dominios!"* Screenshot al código.

**✅ Resolution:**
Marina aplica los patrones aprendidos en su proyecto. Meses después, cuando buscan senior en su empresa, recomienda revisar el portfolio de Angel como referencia de calidad.

**Capabilities reveladas:** Código público y bien documentado, arquitectura clara y replicable, documentación técnica accesible, patrones educativos.

---

### Journey 4: Owner - "La Actualización de Contenido"

**Persona:** Angel (Owner)
- Desarrollador del portfolio
- Actualiza contenido ocasionalmente (nuevo proyecto, artículo, experiencia)
- Quiere proceso simple, sin fricción

**Situación:** Completó un proyecto freelance importante. Quiere agregarlo al portfolio antes de olvidar los detalles.

**🎬 Opening Scene:**
Angel termina el proyecto un viernes. Tiene 30 minutos antes de desconectar para el fin de semana. Quiere agregar el proyecto ahora.

**📈 Rising Action:**
- **Acceso al sistema:** Abre el admin/CMS o el repo
- **Creación de contenido:** Agrega título, descripción, tags, imágenes del proyecto
- **Preview:** Ve cómo queda antes de publicar
- **Deploy:** Un comando o un botón despliega los cambios

**🎯 Climax:**
En menos de 15 minutos, el nuevo proyecto está live. Angel verifica en su teléfono que se ve bien. Todo funciona.

**✅ Resolution:**
Angel cierra la laptop satisfecho. El portfolio refleja su trabajo más reciente. El proceso fue tan simple que lo hará más seguido.

**Capabilities reveladas:** Flujo de actualización simple, preview antes de publicar, deploy automatizado, mobile preview funcional.

---

### Journey Requirements Summary

| Journey | Capabilities Clave |
|---------|-------------------|
| **Tech Recruiter** | Performance, responsive, demos funcionales, código visible |
| **Potential Client** | CTAs claros, Calendly, múltiples contactos, confianza visual |
| **Peer Developer** | Código documentado, arquitectura clara, patrones replicables |
| **Owner** | CMS/admin simple, preview, deploy rápido, mobile-friendly |

