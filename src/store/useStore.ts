import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import { v4 as uuidv4 } from 'uuid';
import type { AppState, SceneObject, ShapeType } from '../types/store';

export const useStore = create<AppState>()(
  temporal(
    persist(
      (set) => ({
        objects: [],
        selectedId: null,
        transformMode: 'translate',
        isExporting: false,
        addObject: (type: ShapeType) =>
          set((state) => {
            const newObject: SceneObject = {
              id: uuidv4(),
              type,
              name: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
              position: [0, 0, 0],
              rotation: [0, 0, 0],
              scale: [1, 1, 1],
                      color: '#ffffff', // Default white
                      roughness: 0.5,
                      metalness: 0.5,
                      textureUrl: '',
                    };            return { objects: [...state.objects, newObject], selectedId: newObject.id };
          }),
        selectObject: (id) => set({ selectedId: id }),
        setTransformMode: (mode) => set({ transformMode: mode }),
        setIsExporting: (isExporting) => set({ isExporting }),
        updateObject: (id, updates) =>
          set((state) => ({
            objects: state.objects.map((obj) =>
              obj.id === id ? { ...obj, ...updates } : obj
            ),
          })),
        deleteObject: (id) =>
          set((state) => ({
            objects: state.objects.filter((obj) => obj.id !== id),
            selectedId: state.selectedId === id ? null : state.selectedId,
          })),
      }),
      {
        name: '3d-design-tool-storage', // unique name
        partialize: (state) => ({ objects: state.objects }), // persist only objects
      }
    ),
    {
      limit: 100,
      partialize: (state) => ({ objects: state.objects }), // Only undo/redo object changes
    }
  )
);
