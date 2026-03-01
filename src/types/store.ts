export type ShapeType = 'box' | 'sphere' | 'plane' | 'cylinder' | 'cone' | 'torus' | 'capsule';

export type LightType = 'ambient' | 'directional' | 'point' | 'spot';

export interface CameraBookmark {
  id: string;
  name: string;
  position: [number, number, number];
  target: [number, number, number];
}

export interface SceneLight {
  id: string;
  type: LightType;
  name: string;
  color: string;
  intensity: number;
  position: [number, number, number];
  castShadow: boolean;
}

export interface SceneObject {
  id: string;
  type: ShapeType;
  name: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  roughness: number;
  metalness: number;
  textureUrl?: string;
  opacity?: number;
  visible?: boolean;
}

export type EventType = 
  | 'mouseEnter'
  | 'mouseLeave'
  | 'mouseDown'
  | 'mouseUp'
  | 'click'
  | 'keyDown'
  | 'keyUp'
  | 'keyPress'
  | 'start';

export type ActionType =
  | 'setState'
  | 'toggleState'
  | 'playAnimation'
  | 'stopAnimation'
  | 'resetScene';

export type EasingType = 
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut';

export interface ObjectState {
  id: string;
  name: string;
  properties: Partial<Omit<SceneObject, 'id' | 'type'>>;
  isDefault: boolean;
}

export interface EventConfig {
  id: string;
  type: EventType;
  enabled: boolean;
  key?: string;
}

export interface ActionConfig {
  id: string;
  type: ActionType;
  targetStateId?: string;
  targetObjectId?: string;
  delay: number;
  duration: number;
  easing: EasingType;
}

export interface InteractionRule {
  id: string;
  name: string;
  enabled: boolean;
  event: EventConfig;
  actions: ActionConfig[];
}

export interface ObjectInteraction {
  objectId: string;
  states: ObjectState[];
  currentStateId: string;
  interactions: InteractionRule[];
}

export interface AppState {
  objects: SceneObject[];
  lights: SceneLight[];
  cameraBookmarks: CameraBookmark[];
  objectInteractions: ObjectInteraction[];
  selectedIds: string[];
  selectedLightId: string | null;
  transformMode: 'translate' | 'rotate' | 'scale';
  snapEnabled: boolean;
  snapSize: number;
  isExporting: boolean;
  isPlayMode: boolean;
  clipboard: SceneObject[];
  addObject: (type: ShapeType) => void;
  selectObject: (id: string | null, multi?: boolean) => void;
  selectAll: () => void;
  deselectAll: () => void;
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
  setSnapEnabled: (enabled: boolean) => void;
  setSnapSize: (size: number) => void;
  setIsExporting: (isExporting: boolean) => void;
  setIsPlayMode: (isPlayMode: boolean) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  updateSelectedObjects: (updates: Partial<SceneObject>) => void;
  deleteObject: (id: string) => void;
  deleteSelectedObjects: () => void;
  copySelectedObjects: () => void;
  pasteObjects: () => void;
  duplicateSelectedObjects: () => void;
  addLight: (type: LightType) => void;
  selectLight: (id: string | null) => void;
  updateLight: (id: string, updates: Partial<SceneLight>) => void;
  deleteLight: (id: string) => void;
  addCameraBookmark: (name: string, position: [number, number, number], target: [number, number, number]) => void;
  deleteCameraBookmark: (id: string) => void;
  getObjectInteraction: (objectId: string) => ObjectInteraction | undefined;
  addObjectState: (objectId: string, state: Omit<ObjectState, 'id'>) => void;
  updateObjectState: (objectId: string, stateId: string, updates: Partial<ObjectState>) => void;
  deleteObjectState: (objectId: string, stateId: string) => void;
  setObjectCurrentState: (objectId: string, stateId: string) => void;
  addInteractionRule: (objectId: string, rule: Omit<InteractionRule, 'id'>) => void;
  updateInteractionRule: (objectId: string, ruleId: string, updates: Partial<InteractionRule>) => void;
  deleteInteractionRule: (objectId: string, ruleId: string) => void;
  triggerObjectEvent: (objectId: string, eventType: EventType) => void;
}
