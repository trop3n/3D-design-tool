import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import { v4 as uuidv4 } from 'uuid';
import type { AppState, SceneObject, SceneLight, CameraBookmark, ShapeType, LightType } from '../types/store';
import {
  DEFAULT_COLOR,
  DEFAULT_ROUGHNESS,
  DEFAULT_METALNESS,
  DEFAULT_POSITION,
  DEFAULT_ROTATION,
  DEFAULT_SCALE,
  DEFAULT_LIGHT_POSITION,
  NEW_LIGHT_POSITION,
  DEFAULT_AMBIENT_INTENSITY,
  DEFAULT_DIRECTIONAL_INTENSITY,
  PASTE_OFFSET,
  STORAGE_KEY,
  UNDO_HISTORY_LIMIT,
  DEFAULT_SNAP_SIZE,
} from '../constants/scene';

const createObjectCopy = (obj: SceneObject, offset: number): SceneObject => ({
  ...obj,
  id: uuidv4(),
  name: `${obj.name} (copy)`,
  position: [obj.position[0] + offset, obj.position[1], obj.position[2] + offset] as [number, number, number],
});

const createDefaultObject = (type: ShapeType): SceneObject => ({
  id: uuidv4(),
  type,
  name: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
  position: DEFAULT_POSITION,
  rotation: DEFAULT_ROTATION,
  scale: DEFAULT_SCALE,
  color: DEFAULT_COLOR,
  roughness: DEFAULT_ROUGHNESS,
  metalness: DEFAULT_METALNESS,
  textureUrl: '',
});

const createDefaultLight = (type: LightType): SceneLight => ({
  id: uuidv4(),
  type,
  name: `${type.charAt(0).toUpperCase() + type.slice(1)}`,
  color: DEFAULT_COLOR,
  intensity: type === 'ambient' ? DEFAULT_AMBIENT_INTENSITY : DEFAULT_DIRECTIONAL_INTENSITY,
  position: NEW_LIGHT_POSITION,
  castShadow: type !== 'ambient',
});

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
            color: DEFAULT_COLOR,
            intensity: DEFAULT_AMBIENT_INTENSITY,
            position: DEFAULT_POSITION,
            castShadow: false,
          },
          {
            id: 'directional-default',
            type: 'directional' as LightType,
            name: 'Sun',
            color: DEFAULT_COLOR,
            intensity: DEFAULT_DIRECTIONAL_INTENSITY,
            position: DEFAULT_LIGHT_POSITION,
            castShadow: true,
          },
        ],
        cameraBookmarks: [],
        selectedIds: [],
        selectedLightId: null,
        transformMode: 'translate',
        snapEnabled: false,
        snapSize: DEFAULT_SNAP_SIZE,
        isExporting: false,
        clipboard: [],
        addObject: (type: ShapeType) =>
          set((state) => {
            const newObject = createDefaultObject(type);
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
            const newObjects = state.clipboard.map((obj) => createObjectCopy(obj, PASTE_OFFSET));
            return {
              objects: [...state.objects, ...newObjects],
              selectedIds: newObjects.map((obj) => obj.id),
            };
          }),
        duplicateSelectedObjects: () =>
          set((state) => {
            const selectedObjects = state.objects.filter((obj) => state.selectedIds.includes(obj.id));
            if (selectedObjects.length === 0) return state;
            const newObjects = selectedObjects.map((obj) => createObjectCopy(obj, PASTE_OFFSET));
            return {
              objects: [...state.objects, ...newObjects],
              selectedIds: newObjects.map((obj) => obj.id),
            };
          }),
        addLight: (type: LightType) =>
          set((state) => {
            const newLight = createDefaultLight(type);
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
        name: STORAGE_KEY,
        partialize: (state) => ({ objects: state.objects }),
      }
    ),
    {
      limit: UNDO_HISTORY_LIMIT,
      partialize: (state) => ({ objects: state.objects }),
    }
  )
);
