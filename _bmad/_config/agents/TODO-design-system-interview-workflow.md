---
id: TODO-design-system-interview-workflow
aliases: []
tags: []
---

BMAD – Design Systems Interview Workflow

Purpose: This document defines a custom workflow / custom agent mental model built on top of the BMAD framework, specifically tailored for technical interviews focused on Design Systems, Frontend Architecture, and UI Infrastructure.

It is not a new official BMAD module, nor a replacement for BMAD Method. It is a contextual adaptation of BMAD for interviews, whiteboard sessions, and architecture discussions.

This document intentionally prioritizes thinking clarity, scope control, and communication over exhaustive delivery.

⸻

1. What This Document Is (and Is Not)

✅ What this is
• A custom workflow derived from BMAD principles
• A mental operating system for interviews
• A repeatable strategy to reason about Design Systems using FR/NFR
• A bridge between vague interview prompts and structured architectural answers

❌ What this is not
• Not a full Product Brief
• Not a full PRD
• Not a complete Architecture Document
• Not a prescriptive checklist

Key idea: In interviews, the goal is demonstrating judgment, not completeness.

⸻

2. Why BMAD Is a Good Fit for Design Systems Interviews

Design Systems interviews typically suffer from three problems: 1. Ambiguous scope (“design a system”) 2. Overcommitment risk (trying to solve everything) 3. Unclear evaluation criteria (what are they actually testing?)

BMAD solves this by providing:
• A shared vocabulary (FR / NFR / Architecture)
• A clear separation of concerns
• A scope discipline mechanism

BMAD is not used literally in interviews.
It is used as an internal compass.

⸻

3. Where Design Systems Live Inside BMAD

BMAD does not have a single “Design System” step. Instead, Design Systems appear transversally across three layers.

3.1 Product Brief (Contextual Justification)

Role in interviews:
• Establish why a design system exists
• Define product shape and constraints

Typical signals:
• Multi-surface product
• Long-lived UI
• Multiple contributors
• Accessibility requirements

In interviews:
• You do not design the system here
• You justify the need for one

⸻

3.2 PRD – Functional & Non-Functional Requirements

This is where Design Systems materialize.

Functional Requirements (FRs) relevant to Design Systems
• Reusable components
• Consistent states (loading, error, empty)
• Navigation patterns
• Interaction semantics

Non-Functional Requirements (NFRs)
• Accessibility (WCAG, keyboard, screen readers)
• Responsiveness
• Theming (dark/light, branding)
• Performance (perceived and actual)
• Consistency

Interview rule:
Select 1–2 FRs and 1–2 NFRs only.

This is not a limitation — it is a signal of seniority.

⸻

3.3 Architecture / System Design (Core of the Interview)

This is the natural home of Design Systems.

Topics typically covered:
• Component boundaries
• Tokens vs components
• Theming strategy
• State ownership
• Evolution and versioning
• Trade-offs

You architect a representative slice, not the entire system.

⸻

4. The Interview-Oriented BMAD Workflow

This workflow mirrors BMAD but is compressed and adaptive.

Step 1 – Receive the Problem (Usually Incomplete)

Interview prompts are intentionally underspecified.

Your task is not to solve immediately, but to:
• Identify ambiguity
• Ask clarifying questions

⸻

Step 2 – Classify Information (Engineering the Problem)

Internally map information into:
• Functional Requirements (FR)
• Non-Functional Requirements (NFR)

This demonstrates:
• Structured thinking
• Ability to reduce chaos

⸻

Step 3 – Choose a Deliberate Slice

Explicitly say something like:

“To avoid over-architecting, I’ll focus on one functional requirement (X) and one non-functional requirement (Y), and design a system that supports them.”

This is critical.

⸻

Step 4 – Architect the Slice

Here you apply Design System thinking:
• Tokens
• Components
• States
• Responsiveness
• Accessibility

You show:
• Decision-making
• Trade-offs
• Constraints awareness

⸻

Step 5 – Explicitly State What You Are Not Solving

This step prevents overcommitment:

“The rest of the system would follow the same patterns.”

This is not avoidance.
It is scope discipline.

⸻

5. Agents and BMAD Modules Relevant to This Workflow

5.1 create-architecture (Conceptual Use)

This is the most relevant BMAD concept.

In interviews:
• You do not generate a full architecture doc
• You simulate the thinking process behind it

⸻

5.2 create-prd / product-brief (Mental Templates)

These are used implicitly, not explicitly:
• To frame requirements
• To classify information

⸻

5.3 Creative Intelligence Suite (Optional)

Useful when:
• Exploring variations
• Demonstrating alternative approaches

Not required for most interviews.

⸻

6. Practical Template for Interviews (Reduced PRD)

Functional Requirement (Example)
• Component: Navigation
• States: default, hover, active, disabled
• Reuse: across pages

Non-Functional Requirement (Example)
• Accessibility: keyboard navigation
• Responsiveness: mobile-first

This is enough to architect meaningfully.

⸻

7. Key Interview Signals You Are Demonstrating

Using this workflow shows:
• Senior-level scope control
• Ability to structure ambiguity
• Architectural judgment
• Communication clarity

Interviewers evaluate how you think, not how much you build.

⸻

8. Why This Is Not Overkill

Many candidates fail interviews by:
• Overdesigning
• Going too broad
• Missing priorities

This workflow does the opposite:
• Focused
• Intentional
• Explainable

⸻

9. Where This Document Should Live (Provisional)

Recommended temporary locations:
• docs/architecture/
• docs/interviews/
• \_bmad-output/custom-workflows/

Final placement can be decided later by the BMAD process itself.

⸻

10. Final Principle

BMAD is not a process you execute in interviews.

It is a lens you think through.

This document captures that lens.

⸻

Status: Draft – Custom Workflow
Audience: Senior Frontend / Design Systems Interviews
Origin: BMAD Framework (Adapted)
