---
stepsCompleted: [step-01-init, step-02-discovery, step-03-success]
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

