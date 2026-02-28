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
        selectedId: null,
        selectedLightId: null,
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
        selectLight: (id) => set({ selectedLightId: id, selectedId: null }),
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
