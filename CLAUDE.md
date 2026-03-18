# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Dev Commands

```bash
npm run dev          # Start Vite dev server with hot reload
npm run build        # Type-check (tsc -b) then bundle with Vite
npm run lint         # ESLint on entire project
npm run test         # Vitest in watch mode
npm run test:run     # Run all tests once
npm run test:coverage # Tests with coverage report
npm run preview      # Preview production build
```

Run a single test file: `npx vitest run src/store/useStore.test.ts`

Before committing: `npm run lint && npm run build && npm run test:run`

## Architecture

A browser-based 3D design tool with a React Three Fiber viewport, Zustand state management, and Tailwind CSS UI.

**Layout:** Top toolbar + left outliner panel + center 3D viewport + right properties panel (tabbed: properties, lights, interactions).

**Key data flow:** All scene state lives in a single Zustand store (`src/store/useStore.ts`) wrapped with two middleware layers — `persist` (localStorage) and `temporal` (Zundo, for undo/redo with 100-item limit). Components read state via selector pattern (`useStore((s) => s.field)`) and mutate via store actions.

**3D rendering pipeline:** `App.tsx` → `Scene.tsx` (R3F Canvas with camera, lights, grid) → `ObjectWrapper.tsx` (per-object mesh + TransformControls). ObjectWrapper is wrapped in `React.memo()` for render optimization.

**Interaction system:** Objects can have state machines defined via `ObjectInteraction` — events (click, hover, keyboard) trigger rules that transition object states with animated property changes (position, rotation, scale, color, opacity) with configurable easing/duration/delay.

## Code Style

- 2-space indent, semicolons, single quotes
- Import order: React → third-party → Three.js → local (relative paths)
- Use `import type { }` for type-only imports
- Components: PascalCase, arrow functions, `React.FC<Props>` typing
- Hooks: `useXxx` naming convention
- Constants file: `src/constants/scene.ts` (SCREAMING_SNAKE_CASE)
- Functional components only, no class components
- Tailwind utility classes exclusively for styling
- TypeScript strict mode — all code must pass strict type checking

## State Management Patterns

```typescript
// Reading state — always use selectors
const selectedIds = useStore((state) => state.selectedIds);

// Undo/redo — use the temporal store hook
import { undo, redo } from '../hooks/useTemporalStore';
```

Store holds: `objects` (SceneObject[]), `lights` (SceneLight[]), `objectInteractions` (ObjectInteraction[]), `selectedIds`, `transformMode`, `snapEnabled`, `clipboard`.

## Testing

Vitest with node environment (jsdom via setup). Test files use `.test.ts`/`.test.tsx` suffix. Tests use `@testing-library/react` and reset store state in `beforeEach` via `useStore.setState()`.

## Key Types

All type definitions are in `src/types/store.ts`:
- `ShapeType`: box, sphere, plane, cylinder, cone, torus, capsule
- `SceneObject`: position/rotation/scale as `[number, number, number]` tuples, material properties (color, roughness, metalness, textureUrl, opacity)
- `SceneLight`: ambient, directional, point, spot
- `ObjectInteraction`: state machine with events → rules → actions (setState, toggleState, playAnimation, stopAnimation, resetScene)
