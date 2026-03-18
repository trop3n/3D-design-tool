import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { temporal } from 'zundo';
import { v4 as uuidv4 } from 'uuid';
import type { 
  AppState, 
  SceneObject, 
  SceneLight, 
  CameraBookmark, 
  ShapeType, 
  LightType,
  ObjectInteraction,
  ObjectState,
  InteractionRule,
  EventType,
} from '../types/store';
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

const getDescendantIds = (objects: SceneObject[], id: string): string[] => {
  const obj = objects.find((o) => o.id === id);
  if (!obj?.children) return [];
  return obj.children.flatMap((childId) => [childId, ...getDescendantIds(objects, childId)]);
};

const copySubtree = (objects: SceneObject[], rootIds: string[], offset: number): SceneObject[] => {
  const idMap = new Map<string, string>();
  const allIds = new Set<string>();
  for (const id of rootIds) {
    allIds.add(id);
    for (const desc of getDescendantIds(objects, id)) {
      allIds.add(desc);
    }
  }
  for (const id of allIds) {
    idMap.set(id, uuidv4());
  }
  return objects
    .filter((obj) => allIds.has(obj.id))
    .map((obj) => {
      const isRoot = rootIds.includes(obj.id);
      return {
        ...obj,
        id: idMap.get(obj.id)!,
        name: isRoot ? `${obj.name} (copy)` : obj.name,
        position: isRoot
          ? [obj.position[0] + offset, obj.position[1], obj.position[2] + offset] as [number, number, number]
          : obj.position,
        parentId: obj.parentId && idMap.has(obj.parentId) ? idMap.get(obj.parentId) : obj.parentId,
        children: obj.children?.map((cid) => idMap.get(cid) || cid),
      };
    });
};

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
      (set, get) => ({
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
        objectInteractions: [],
        selectedIds: [],
        selectedLightId: null,
        transformMode: 'translate',
        snapEnabled: false,
        snapSize: DEFAULT_SNAP_SIZE,
        isExporting: false,
        isPlayMode: false,
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
            selectedIds: state.objects.filter((obj) => !obj.parentId).map((obj) => obj.id),
          })),
        deselectAll: () => set({ selectedIds: [] }),
        setTransformMode: (mode) => set({ transformMode: mode }),
        setSnapEnabled: (enabled) => set({ snapEnabled: enabled }),
        setSnapSize: (size) => set({ snapSize: size }),
        setIsExporting: (isExporting) => set({ isExporting }),
        setIsPlayMode: (isPlayMode) => set({ isPlayMode }),
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
          set((state) => {
            const idsToDelete = new Set([id, ...getDescendantIds(state.objects, id)]);
            const parentObj = state.objects.find((o) => o.children?.includes(id));
            return {
              objects: state.objects
                .filter((obj) => !idsToDelete.has(obj.id))
                .map((obj) => obj.id === parentObj?.id
                  ? { ...obj, children: obj.children?.filter((cid) => cid !== id) }
                  : obj
                ),
              selectedIds: state.selectedIds.filter((sid) => !idsToDelete.has(sid)),
              objectInteractions: state.objectInteractions.filter((oi) => !idsToDelete.has(oi.objectId)),
            };
          }),
        deleteSelectedObjects: () =>
          set((state) => {
            const idsToDelete = new Set<string>();
            for (const id of state.selectedIds) {
              idsToDelete.add(id);
              for (const desc of getDescendantIds(state.objects, id)) {
                idsToDelete.add(desc);
              }
            }
            return {
              objects: state.objects
                .filter((obj) => !idsToDelete.has(obj.id))
                .map((obj) => obj.children
                  ? { ...obj, children: obj.children.filter((cid) => !idsToDelete.has(cid)) }
                  : obj
                ),
              selectedIds: [],
              objectInteractions: state.objectInteractions.filter(
                (oi) => !idsToDelete.has(oi.objectId)
              ),
            };
          }),
        copySelectedObjects: () =>
          set((state) => {
            const allIds = new Set<string>();
            for (const id of state.selectedIds) {
              allIds.add(id);
              for (const desc of getDescendantIds(state.objects, id)) {
                allIds.add(desc);
              }
            }
            return {
              clipboard: state.objects
                .filter((obj) => allIds.has(obj.id))
                .map((obj) => ({ ...obj })),
            };
          }),
        pasteObjects: () =>
          set((state) => {
            if (state.clipboard.length === 0) return state;
            const rootIds = state.clipboard.filter((obj) => !obj.parentId || !state.clipboard.some((o) => o.id === obj.parentId)).map((o) => o.id);
            const newObjects = copySubtree(state.clipboard, rootIds, PASTE_OFFSET);
            const newRootIds = newObjects.filter((obj) => !obj.parentId || !newObjects.some((o) => o.id === obj.parentId)).map((o) => o.id);
            return {
              objects: [...state.objects, ...newObjects],
              selectedIds: newRootIds,
            };
          }),
        duplicateSelectedObjects: () =>
          set((state) => {
            if (state.selectedIds.length === 0) return state;
            const newObjects = copySubtree(state.objects, state.selectedIds, PASTE_OFFSET);
            const newRootIds = newObjects
              .filter((obj) => !obj.parentId || !newObjects.some((o) => o.id === obj.parentId))
              .map((o) => o.id);
            return {
              objects: [...state.objects, ...newObjects],
              selectedIds: newRootIds,
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
        getObjectInteraction: (objectId: string) => {
          return get().objectInteractions.find((oi) => oi.objectId === objectId);
        },
        addObjectState: (objectId: string, stateData: Omit<ObjectState, 'id'>) =>
          set((state) => {
            const existingInteraction = state.objectInteractions.find(
              (oi) => oi.objectId === objectId
            );
            if (existingInteraction) {
              return {
                objectInteractions: state.objectInteractions.map((oi) =>
                  oi.objectId === objectId
                    ? {
                        ...oi,
                        states: [...oi.states, { ...stateData, id: uuidv4() }],
                      }
                    : oi
                ),
              };
            }
            const newInteraction: ObjectInteraction = {
              objectId,
              states: [
                { id: 'default', name: 'Default', properties: {}, isDefault: true },
                { ...stateData, id: uuidv4() },
              ],
              currentStateId: 'default',
              interactions: [],
            };
            return {
              objectInteractions: [...state.objectInteractions, newInteraction],
            };
          }),
        updateObjectState: (objectId: string, stateId: string, updates: Partial<ObjectState>) =>
          set((state) => ({
            objectInteractions: state.objectInteractions.map((oi) =>
              oi.objectId === objectId
                ? {
                    ...oi,
                    states: oi.states.map((s) =>
                      s.id === stateId ? { ...s, ...updates } : s
                    ),
                  }
                : oi
            ),
          })),
        deleteObjectState: (objectId: string, stateId: string) =>
          set((state) => ({
            objectInteractions: state.objectInteractions.map((oi) =>
              oi.objectId === objectId
                ? {
                    ...oi,
                    states: oi.states.filter((s) => s.id !== stateId || s.isDefault),
                    currentStateId: oi.currentStateId === stateId ? 'default' : oi.currentStateId,
                  }
                : oi
            ),
          })),
        setObjectCurrentState: (objectId: string, stateId: string) =>
          set((state) => {
            const interaction = state.objectInteractions.find((oi) => oi.objectId === objectId);
            if (!interaction) return state;
            
            const targetState = interaction.states.find((s) => s.id === stateId);
            if (!targetState) return state;
            
            const obj = state.objects.find((o) => o.id === objectId);
            if (!obj) return state;
            
            const updatedObject = { ...obj, ...targetState.properties };
            
            return {
              objectInteractions: state.objectInteractions.map((oi) =>
                oi.objectId === objectId ? { ...oi, currentStateId: stateId } : oi
              ),
              objects: state.objects.map((o) =>
                o.id === objectId ? updatedObject : o
              ),
            };
          }),
        addInteractionRule: (objectId: string, rule: Omit<InteractionRule, 'id'>) =>
          set((state) => {
            const existingInteraction = state.objectInteractions.find(
              (oi) => oi.objectId === objectId
            );
            const newRule: InteractionRule = { ...rule, id: uuidv4() };
            
            if (existingInteraction) {
              return {
                objectInteractions: state.objectInteractions.map((oi) =>
                  oi.objectId === objectId
                    ? { ...oi, interactions: [...oi.interactions, newRule] }
                    : oi
                ),
              };
            }
            
            const newInteraction: ObjectInteraction = {
              objectId,
              states: [{ id: 'default', name: 'Default', properties: {}, isDefault: true }],
              currentStateId: 'default',
              interactions: [newRule],
            };
            return {
              objectInteractions: [...state.objectInteractions, newInteraction],
            };
          }),
        updateInteractionRule: (objectId: string, ruleId: string, updates: Partial<InteractionRule>) =>
          set((state) => ({
            objectInteractions: state.objectInteractions.map((oi) =>
              oi.objectId === objectId
                ? {
                    ...oi,
                    interactions: oi.interactions.map((r) =>
                      r.id === ruleId ? { ...r, ...updates } : r
                    ),
                  }
                : oi
            ),
          })),
        deleteInteractionRule: (objectId: string, ruleId: string) =>
          set((state) => ({
            objectInteractions: state.objectInteractions.map((oi) =>
              oi.objectId === objectId
                ? {
                    ...oi,
                    interactions: oi.interactions.filter((r) => r.id !== ruleId),
                  }
                : oi
            ),
          })),
        groupSelectedObjects: () =>
          set((state) => {
            const selected = state.objects.filter((obj) => state.selectedIds.includes(obj.id));
            if (selected.length < 2) return state;

            const cx = selected.reduce((sum, o) => sum + o.position[0], 0) / selected.length;
            const cy = selected.reduce((sum, o) => sum + o.position[1], 0) / selected.length;
            const cz = selected.reduce((sum, o) => sum + o.position[2], 0) / selected.length;

            const groupId = uuidv4();
            const childIds = selected.map((o) => o.id);

            const group: SceneObject = {
              id: groupId,
              type: 'group',
              name: 'Group',
              position: [cx, cy, cz],
              rotation: DEFAULT_ROTATION,
              scale: DEFAULT_SCALE,
              color: DEFAULT_COLOR,
              roughness: DEFAULT_ROUGHNESS,
              metalness: DEFAULT_METALNESS,
              children: childIds,
            };

            const updatedObjects = state.objects.map((obj) => {
              if (!childIds.includes(obj.id)) return obj;
              // Remove from old parent's children list if needed
              return {
                ...obj,
                parentId: groupId,
                position: [
                  obj.position[0] - cx,
                  obj.position[1] - cy,
                  obj.position[2] - cz,
                ] as [number, number, number],
              };
            }).map((obj) => {
              // Clean up old parent's children arrays
              if (obj.children && obj.id !== groupId) {
                const remaining = obj.children.filter((cid) => !childIds.includes(cid));
                return remaining.length !== obj.children.length
                  ? { ...obj, children: remaining.length > 0 ? remaining : undefined }
                  : obj;
              }
              return obj;
            });

            return {
              objects: [...updatedObjects, group],
              selectedIds: [groupId],
            };
          }),
        ungroupSelectedObjects: () =>
          set((state) => {
            const groupsToUngroup = state.objects.filter(
              (obj) => state.selectedIds.includes(obj.id) && obj.type === 'group' && obj.children?.length
            );
            if (groupsToUngroup.length === 0) return state;

            const groupIds = new Set(groupsToUngroup.map((g) => g.id));
            const freedChildIds: string[] = [];

            const updatedObjects = state.objects
              .filter((obj) => !groupIds.has(obj.id))
              .map((obj) => {
                const parentGroup = groupsToUngroup.find((g) => g.children?.includes(obj.id));
                if (!parentGroup) return obj;
                freedChildIds.push(obj.id);
                return {
                  ...obj,
                  parentId: parentGroup.parentId || undefined,
                  position: [
                    obj.position[0] + parentGroup.position[0],
                    obj.position[1] + parentGroup.position[1],
                    obj.position[2] + parentGroup.position[2],
                  ] as [number, number, number],
                };
              });

            return {
              objects: updatedObjects,
              selectedIds: freedChildIds,
            };
          }),
        triggerObjectEvent: (objectId: string, eventType: EventType) => {
          const state = get();
          const interaction = state.objectInteractions.find((oi) => oi.objectId === objectId);
          if (!interaction) return;
          
          const matchingRules = interaction.interactions.filter(
            (r) => r.enabled && r.event.type === eventType && r.event.enabled
          );
          
          for (const rule of matchingRules) {
            for (const action of rule.actions) {
              if (action.delay > 0) {
                setTimeout(() => {
                  executeAction(get, action, objectId);
                }, action.delay);
              } else {
                executeAction(get, action, objectId);
              }
            }
          }
        },
      }),
      {
        name: STORAGE_KEY,
        partialize: (state) => ({
          objects: state.objects,
          objectInteractions: state.objectInteractions,
          lights: state.lights,
          cameraBookmarks: state.cameraBookmarks,
        }),
      }
    ),
    {
      limit: UNDO_HISTORY_LIMIT,
      partialize: (state) => ({ objects: state.objects }),
    }
  )
);

const executeAction = (
  get: () => AppState,
  action: { 
    type: string;
    targetStateId?: string;
    targetObjectId?: string;
    duration: number;
    easing: string;
  },
  sourceObjectId: string
) => {
  const state = get();
  const targetId = action.targetObjectId || sourceObjectId;
  
  switch (action.type) {
    case 'setState':
      if (action.targetStateId) {
        get().setObjectCurrentState(targetId, action.targetStateId);
      }
      break;
    case 'toggleState': {
      const interaction = state.objectInteractions.find((oi) => oi.objectId === targetId);
      if (interaction && interaction.states.length > 1) {
        const currentIndex = interaction.states.findIndex((s) => s.id === interaction.currentStateId);
        const nextIndex = (currentIndex + 1) % interaction.states.length;
        get().setObjectCurrentState(targetId, interaction.states[nextIndex].id);
      }
      break;
    }
    case 'resetScene': {
      state.objects.forEach((obj) => {
        get().setObjectCurrentState(obj.id, 'default');
      });
      break;
    }
  }
};
