export type ShapeType = 'box' | 'sphere' | 'plane';

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
}

export interface AppState {
  objects: SceneObject[];
  selectedId: string | null;
  transformMode: 'translate' | 'rotate' | 'scale';
  isExporting: boolean;
  addObject: (type: ShapeType) => void;
  selectObject: (id: string | null) => void;
  setTransformMode: (mode: 'translate' | 'rotate' | 'scale') => void;
  setIsExporting: (isExporting: boolean) => void;
  updateObject: (id: string, updates: Partial<SceneObject>) => void;
  deleteObject: (id: string) => void;
}
