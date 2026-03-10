# Design: Footer Layout 03 Refresh

## Technical Approach

Implement an incremental refactor of the existing footer organism to match `03-footer` information architecture and responsive behavior, while preserving current integration contracts (`data-testid` hooks, layout placement in root layout, and no-overlap behavior in short viewports).

This design maps directly to `openspec/changes/adjust-footer-layout-03/specs/footer/spec.md` by:

- restructuring footer groups into `Contact` and `Links`,
- introducing a dedicated lower technology-summary section,
- retaining route-consistent rendering and testability across Home/About/Projects/Articles.

## Architecture Decisions

### Decision: Keep Footer as a Single Organism Refactor

**Choice**: Modify `src/ui/organisms/Footer/index.tsx` and `src/ui/organisms/Footer/styles.css` instead of replacing footer with new components.
**Alternatives considered**: Full rewrite with new organism/subcomponents; moving footer content to config/domain data first.
**Rationale**: Existing E2E and CSS-contract tests already target current footer hooks and placement. Incremental refactor minimizes regression risk and preserves integration with `src/app/layout.tsx` and Home-specific footer visibility behavior.

### Decision: Preserve Existing Link Molecules for Contact Actions

**Choice**: Continue using `Telegram` and `CopyEmail` molecules inside the new `Contact` block.
**Alternatives considered**: New bespoke footer link primitives; direct raw anchors in footer markup.
**Rationale**: Current molecules encapsulate async/skeleton/loading and environment-driven URL behavior. Reuse keeps behavior stable and avoids duplicating contact logic.

### Decision: Add Explicit Social Links Section in Footer Markup

**Choice**: Implement explicit `Links` group containing GitHub and LinkedIn actions using existing social/link patterns.
**Alternatives considered**: Reusing `Author` as implicit LinkedIn link only; omitting icons and rendering text-only links.
**Rationale**: `03-footer` explicitly requires GitHub + LinkedIn list entries. Explicit section aligns with spec requirement for clear information architecture and predictable test assertions.

### Decision: Keep Global Test IDs, Add Section-Level Hooks Only if Needed

**Choice**: Retain `data-testid="footer"` and `data-testid="footer-content"`; add additional section hooks only when required for reliable assertions.
**Alternatives considered**: Renaming test IDs to new naming schema; relying solely on CSS selectors.
**Rationale**: Existing E2E contracts depend on current IDs across multiple suites. Preserving them reduces migration cost while still enabling richer assertions where necessary.

## Data Flow

Footer is presentational but consumes data through existing molecules and profile-backed links.

```text
RootLayout
   |
   v
Footer organism (static structure + section headings)
   |                      |
   |                      +--> Tech summary lines (static copy in footer)
   |
   +--> Contact group
   |      +--> Telegram molecule -> profile/query-backed URL
   |      +--> CopyEmail molecule -> email env/profile source
   |
   +--> Links group
          +--> GitHub link (profile/env-backed)
          +--> LinkedIn link (profile/env-backed)
```

Behavior constraints maintained:

- Footer remains below `#main-content` via existing layout flex contract.
- Home page visibility rules (global footer hidden / blade footer visible) remain unchanged.

## File Changes

| File                                                  | Action             | Description                                                                                                                                                    |
| ----------------------------------------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/ui/organisms/Footer/index.tsx`                   | Modify             | Replace current 3-column (copyright/chat/contact) structure with `copyright + Contact + Links + lower stack summary` semantics                                 |
| `src/ui/organisms/Footer/styles.css`                  | Modify             | Implement responsive 1/2/3-column behavior, uppercase section titles, spacing rules, and lower-summary separation (without internal separators under sections) |
| `e2e/footer-consistency.spec.ts`                      | Modify             | Update structure assertions to match new DOM grouping while preserving cross-route consistency checks                                                          |
| `e2e/vertical-viewport.spec.ts`                       | Verify/Modify      | Keep no-overlap assertions; adjust selectors only if required by markup changes                                                                                |
| `src/styles/__tests__/layout-migration-wave3.test.ts` | Modify             | Sync CSS primitive expectations for updated footer blocks/classes                                                                                              |
| `src/app/layout.tsx`                                  | No change expected | Footer mount point remains stable; included for integration verification only                                                                                  |

## Interfaces / Contracts

No backend/API contract changes.

Footer internal rendering contract (proposed shape):

```ts
type FooterSectionId = "contact" | "links";

interface FooterSectionItem {
  id: string;
  label: string;
  icon?: "telegram" | "email" | "github" | "linkedin";
  href?: string;
}

interface FooterSection {
  id: FooterSectionId;
  title: string; // rendered uppercase via CSS
  items: FooterSectionItem[];
}
```

Testing contract to preserve:

- `data-testid="footer"` remains on `<footer>` root.
- `data-testid="footer-content"` remains on main content wrapper.
- Footer must stay queryable on all primary routes.

## Testing Strategy

| Layer                   | What to Test                                                                                                | Approach                                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Unit/CSS contract       | Footer layout primitives and breakpoint-safe class behavior                                                 | Update `src/styles/__tests__/layout-migration-wave3.test.ts` expectations for new footer CSS blocks                |
| Integration/UI behavior | Footer section rendering and required links visibility                                                      | Add/adjust component-level assertions (if existing footer unit tests are introduced, keep minimal and semantic)    |
| E2E                     | Cross-route consistency, footer visibility, Home-specific single visible footer, short-viewport non-overlap | Update `e2e/footer-consistency.spec.ts`; re-run `e2e/vertical-viewport.spec.ts` with selector compatibility checks |

## Migration / Rollout

No migration required.

Rollout is code-only and can ship in one PR with atomic commits:

1. Footer markup + styles
2. Test synchronization
3. Optional polish/fixes from QA

## Open Questions

- [ ] Should `FooterChatColumn` remain in the redesigned footer, or be removed to align strictly with `03-footer` sections?
- [ ] Should LinkedIn be represented by existing `Author` link behavior or a dedicated explicit `LinkedIn` footer item?
- [ ] Are technology-summary lines fixed copy, or should they become configurable content in a later follow-up?
