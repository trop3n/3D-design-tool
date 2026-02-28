# AGENTS.md

Coding guidelines for agentic coding agents working in this repository.

## Project Overview

This is a **3D design tool** built with React, TypeScript, and Three.js (React Three Fiber). It features a viewport for 3D object manipulation, state management with undo/redo, and Tailwind CSS styling.

## Build/Lint/Test Commands

```bash
npm run dev          # Start development server with hot reload
npm run build        # Type-check with tsc -b, then build with Vite
npm run lint         # Run ESLint on the entire project
npm run preview      # Preview production build locally
```

**Note:** No test framework is currently configured. If tests are added, prefer Vitest (Vite-native).

## Code Style Guidelines

### Indentation & Formatting

- **2 spaces** for indentation
- **Semicolons** at end of statements
- **Single quotes** for strings (double quotes only when necessary in JSX)
- No trailing commas in most cases
- Max line length: follow existing patterns (approximately 100 chars)

### Import Order

Organize imports in this order, separated by blank lines:

1. **React** - `import React, { useState, useEffect } from 'react';`
2. **Third-party libraries** - React Three Fiber, Drei, Zustand, Lucide icons
3. **Three.js** - `import { Group, Vector3 } from 'three';`
4. **Local imports** - store, types, components (use relative paths)

```typescript
import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Group } from 'three';

import { useStore } from '../../store/useStore';
import type { SceneObject } from '../../types/store';
```

### Type Imports

Use `import type` for type-only imports:

```typescript
import type { SceneObject } from '../../types/store';
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Components | PascalCase | `ObjectWrapper`, `PropertiesPanel` |
| Component files | PascalCase.tsx | `ObjectWrapper.tsx` |
| Hooks | camelCase with `use` prefix | `useKeyboardShortcuts` |
| Hook files | useXxx.ts | `useKeyboardShortcuts.ts` |
| Store files | camelCase with `use` prefix | `useStore.ts` |
| Types/Interfaces | PascalCase | `SceneObject`, `AppState` |
| Variables/Functions | camelCase | `selectedId`, `handleClick` |
| Constants | camelCase | `sceneGroupRef` |

### TypeScript

- **Strict mode** is enabled - all code must pass strict type checking
- Use **interfaces** for object shapes: `interface SceneObject { ... }`
- Use **type aliases** for unions: `type ShapeType = 'box' | 'sphere' | 'plane'`
- Use **tuple types** for vectors: `position: [number, number, number]`
- Explicit `React.FC<Props>` typing for components:

```typescript
interface ObjectWrapperProps {
  obj: SceneObject;
}

export const ObjectWrapper: React.FC<ObjectWrapperProps> = ({ obj }) => {
  // ...
};
```

- Run `npm run build` to verify types pass before committing

### React Patterns

- **Functional components only** - no class components
- Arrow functions for exported components: `export const Component = () => {}`
- Destructure props in function signature
- Use Zustand's selector pattern for state access:

```typescript
const selectedId = useStore((state) => state.selectedId);
const setSelectedId = useStore((state) => state.setSelectedId);
```

### State Management (Zustand)

The store uses two middleware layers:
- **persist** - saves state to localStorage
- **temporal** (Zundo) - enables undo/redo

```typescript
// Access temporal state for undo/redo
(useStore as any).temporal.getState().undo();
(useStore as any).temporal.getState().redo();
```

### Error Handling

- Use `console.error` for logging errors
- Check for null/undefined before operations:

```typescript
if (!selectedObject) {
  return null;
}
```

- Validate numeric inputs:

```typescript
if (!isNaN(val)) {
  onChange(val);
}
```

### Styling (Tailwind CSS v4)

- Use Tailwind utility classes exclusively
- Compose classes in `className` attribute:

```typescript
<div className="w-full h-screen flex bg-gray-900 overflow-hidden text-white">
```

- Global styles are in `src/index.css`
- Custom configuration in `tailwind.config.js`

### JSX Style

- Self-closing tags for childless elements: `<OrbitControls makeDefault />`
- Multi-line JSX with proper indentation
- Conditional rendering with ternary operators and `&&`:

```typescript
{isSelected && <mesh ... />}
{condition ? <ComponentA /> : <ComponentB />}
```

### Event Handlers

- Use arrow functions for handlers
- Stop propagation where needed:

```typescript
const handleClick = (e: any) => {
  e.stopPropagation();
  // handler logic
};
```

## Project Structure

```
src/
├── main.tsx              # App entry point
├── App.tsx               # Root component
├── index.css             # Global styles (Tailwind)
├── components/
│   ├── ui/               # UI panels and inputs
│   └── viewport/         # 3D scene components
├── hooks/                # Custom React hooks
├── store/                # Zustand state management
└── types/                # TypeScript type definitions
```

## Key Technologies

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Build Tool | Vite 7 |
| Language | TypeScript 5.9 |
| 3D Rendering | Three.js + React Three Fiber + Drei |
| State Management | Zustand + Zundo (undo/redo) |
| Styling | Tailwind CSS 4 |
| Linting | ESLint 9 with typescript-eslint |
| Icons | Lucide React |
| ID Generation | UUID |

## Before Committing

1. Run `npm run lint` and fix all errors
2. Run `npm run build` to verify type checking passes
3. Test the dev server with `npm run dev`
