---
id: epic-6-retro-2026-01-26-angel
aliases: []
tags: []
---

Buenísimo cierre para preguntar esto, porque la retro de Epic 6 ya está madura.
Acá no aportamos “más cosas”, aportamos lecturas de segundo nivel: decisiones, trade-offs y aprendizaje sistémico.

Te propongo qué sumar (concreto) y qué NO sumar (para no diluirla).

⸻

🎯 Qué aportamos a la retro de Epic 6

1️⃣ Insight clave: Infra-first revela problemas reales

Esto es nuevo respecto a Epic 5 y vale oro.

Aporte:

Al estabilizar la infraestructura (CI, E2E, Lighthouse), comenzaron a emerger issues reales de calidad (tests frágiles, documentación engañosa, contratos implícitos). Esto confirma que la inversión en infra no acelera features, pero acelera aprendizaje y confiabilidad.

📌 Esto explica por qué aparecieron “oportunidades de mejora” al final.

⸻

2️⃣ Aprendizaje sobre validación manual

Acá hubo un salto claro de criterio.

Aporte:

Validar manualmente no significa “revisar UI”, sino confirmar el comportamiento esperado del sistema (pipelines, gates, artefactos, contratos). En Epic 6 se consolidó esta distinción, evitando over-validation y trabajo innecesario.

Esto conecta perfecto con 6.4, 6.5 y 6.6.

⸻

3️⃣ Scope discipline aplicada a infraestructura (no solo features)

Esto es un upgrade conceptual respecto a Epic 5.

Aporte:

La disciplina de alcance se aplicó también a historias de infraestructura: se fijaron solo HIGH y MEDIUM acoplados, mientras que optimizaciones y refinamientos se movieron explícitamente a backlog, evitando “infra creep”.

Eso justifica por qué no se “arregló todo”.

⸻

4️⃣ E2E y Lighthouse como feedback, no como castigo

Muy importante dejar esto explícito.

Aporte:

E2E y Lighthouse se diseñaron como herramientas de feedback temprano, no como mecanismos punitivos. Los gates informan, pero no bloquean, permitiendo mejorar calidad sin frenar entrega.

Esto explica:
• Lighthouse non-blocking
• E2E perfectible
• Thresholds explícitos

⸻

5️⃣ Cierre de proyecto: criterio de “done”

Esto es clave porque Epic 6 cierra el roadmap.

Aporte:

Epic 6 permitió definir un criterio claro de “proyecto completo”: no ausencia de deuda, sino deuda visible, documentada y priorizada, con un sistema estable y reproducible.

Esto es mentalidad senior/lead.

⸻

🧾 Cómo lo pondría textual en la retro (copiable)

### Additional Learnings – Epic 6

- Infrastructure-first work surfaced real quality issues earlier, validating the investment in CI, E2E and Lighthouse.
- Manual validation was refined to focus on system behavior and contracts, not UI inspection.
- Scope discipline was successfully applied to infrastructure stories, not only product features.
- E2E and Lighthouse were treated as feedback mechanisms, not blocking gates.
- The epic helped define a clear “done” criteria for the project: stable system + visible, documented debt.

⸻

❌ Qué NO agregaría

Para cuidar la calidad de la retro:
• ❌ Más métricas
• ❌ Más listas de issues
• ❌ Detalles por test
• ❌ Nuevas acciones técnicas

Eso va a backlog, no a la retro.

⸻

🧠 Resumen corto (si te lo preguntan oral)

“Epic 6 cerró el proyecto desde lo sistémico: consolidamos CI, E2E y Lighthouse, aprendimos a validar infraestructura manualmente y aplicamos scope discipline también a infra. El sistema quedó estable, con deuda visible y consciente.”
