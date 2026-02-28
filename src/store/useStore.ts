import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import { v4 as uuidv4 } from 'uuid';
import type { AppState, SceneObject, SceneLight, CameraBookmark, ShapeType, LightType } from '../types/store';

export const useStore = create<AppState>()(
  temporal(
    persist(
      (set) => ({
        objects: [],
        lights: [
          {
            id: 'ambient-default',
            type: 'ambient' as LightType,
            name: 'Ambient',
            color: '#ffffff',
            intensity: 0.5,
            position: [0, 0, 0],
            castShadow: false,
          },
          {
            id: 'directional-default',
            type: 'directional' as LightType,
            name: 'Sun',
            color: '#ffffff',
            intensity: 1,
            position: [5, 10, 5],
            castShadow: true,
          },
        ],
        cameraBookmarks: [],
        selectedIds: [],
        selectedLightId: null,
        transformMode: 'translate',
        snapEnabled: false,
        snapSize: 0.5,
        isExporting: false,
        clipboard: [],
        addObject: (type: ShapeType) =>
          set((state) => {
            const newObject: SceneObject = {
              id: uuidv4(),
              type,
              name: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
              position: [0, 0, 0],
              rotation: [0, 0, 0],
              scale: [1, 1, 1],
              color: '#ffffff',
              roughness: 0.5,
              metalness: 0.5,
              textureUrl: '',
            };
            return { objects: [...state.objects, newObject], selectedIds: [newObject.id] };
          }),
        selectObject: (id, multi = false) =>
          set((state) => {
            if (id === null) {
              return { selectedIds: [] };
            }
            if (multi) {
              const isSelected = state.selectedIds.includes(id);
              return {
                selectedIds: isSelected
                  ? state.selectedIds.filter((sid) => sid !== id)
                  : [...state.selectedIds, id],
              };
            }
            return { selectedIds: [id] };
          }),
        selectAll: () =>
          set((state) => ({
            selectedIds: state.objects.map((obj) => obj.id),
          })),
        deselectAll: () => set({ selectedIds: [] }),
        setTransformMode: (mode) => set({ transformMode: mode }),
        setSnapEnabled: (enabled) => set({ snapEnabled: enabled }),
        setSnapSize: (size) => set({ snapSize: size }),
        setIsExporting: (isExporting) => set({ isExporting }),
        updateObject: (id, updates) =>
          set((state) => ({
            objects: state.objects.map((obj) =>
              obj.id === id ? { ...obj, ...updates } : obj
            ),
          })),
        updateSelectedObjects: (updates) =>
          set((state) => ({
            objects: state.objects.map((obj) =>
              state.selectedIds.includes(obj.id) ? { ...obj, ...updates } : obj
            ),
          })),
        deleteObject: (id) =>
          set((state) => ({
            objects: state.objects.filter((obj) => obj.id !== id),
            selectedIds: state.selectedIds.filter((sid) => sid !== id),
          })),
        deleteSelectedObjects: () =>
          set((state) => ({
            objects: state.objects.filter((obj) => !state.selectedIds.includes(obj.id)),
            selectedIds: [],
          })),
        copySelectedObjects: () =>
          set((state) => ({
            clipboard: state.objects
              .filter((obj) => state.selectedIds.includes(obj.id))
              .map((obj) => ({ ...obj })),
          })),
        pasteObjects: () =>
          set((state) => {
            if (state.clipboard.length === 0) return state;
            const newObjects = state.clipboard.map((obj) => ({
              ...obj,
              id: uuidv4(),
              name: `${obj.name} (copy)`,
              position: [obj.position[0] + 1, obj.position[1], obj.position[2] + 1] as [number, number, number],
            }));
            return {
              objects: [...state.objects, ...newObjects],
              selectedIds: newObjects.map((obj) => obj.id),
            };
          }),
        duplicateSelectedObjects: () =>
          set((state) => {
            const selectedObjects = state.objects.filter((obj) => state.selectedIds.includes(obj.id));
            if (selectedObjects.length === 0) return state;
            const newObjects = selectedObjects.map((obj) => ({
              ...obj,
              id: uuidv4(),
              name: `${obj.name} (copy)`,
              position: [obj.position[0] + 1, obj.position[1], obj.position[2] + 1] as [number, number, number],
            }));
            return {
              objects: [...state.objects, ...newObjects],
              selectedIds: newObjects.map((obj) => obj.id),
            };
          }),
        addLight: (type: LightType) =>
          set((state) => {
            const newLight: SceneLight = {
              id: uuidv4(),
              type,
              name: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
              color: '#ffffff',
              intensity: type === 'ambient' ? 0.5 : 1,
              position: [5, 5, 5],
              castShadow: type !== 'ambient',
            };
            return { lights: [...state.lights, newLight], selectedLightId: newLight.id };
          }),
        selectLight: (id) => set({ selectedLightId: id, selectedIds: [] }),
        updateLight: (id, updates) =>
          set((state) => ({
            lights: state.lights.map((light) =>
              light.id === id ? { ...light, ...updates } : light
            ),
          })),
        deleteLight: (id) =>
          set((state) => ({
            lights: state.lights.filter((light) => light.id !== id),
            selectedLightId: state.selectedLightId === id ? null : state.selectedLightId,
          })),
        addCameraBookmark: (name, position, target) =>
          set((state) => {
            const newBookmark: CameraBookmark = {
              id: uuidv4(),
              name,
              position,
              target,
            };
            return { cameraBookmarks: [...state.cameraBookmarks, newBookmark] };
          }),
        deleteCameraBookmark: (id) =>
          set((state) => ({
            cameraBookmarks: state.cameraBookmarks.filter((bookmark) => bookmark.id !== id),
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
