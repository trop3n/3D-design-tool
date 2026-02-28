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
}

export interface AppState {
  objects: SceneObject[];
  lights: SceneLight[];
  cameraBookmarks: CameraBookmark[];
  selectedId: string | null;
  selectedLightId: string | null;
  transformMode: 'translate' | 'rotate' | 'scale';
  isExporting: boolean;
  addObject: (type: ShapeType) => void;
  selectObject: (id: string | null) => void;
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
  setIsExporting: (isExporting: boolean) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  deleteObject: (id: string) => void;
  addLight: (type: LightType) => void;
  selectLight: (id: string | null) => void;
  updateLight: (id: string, updates: Partial<SceneLight>) => void;
  deleteLight: (id: string) => void;
  addCameraBookmark: (name: string, position: [number, number, number], target: [number, number, number]) => void;
  deleteCameraBookmark: (id: string) => void;
}
