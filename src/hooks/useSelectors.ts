import { useStore } from '../store/useStore';

export const useSelectedIds = () => useStore((state) => state.selectedIds);

export const useSelectedObjects = () => {
  const objects = useStore((state) => state.objects);
  const selectedIds = useStore((state) => state.selectedIds);
  return objects.filter((obj) => selectedIds.includes(obj.id));
};

export const useTransformSettings = () => {
  const transformMode = useStore((state) => state.transformMode);
  const snapEnabled = useStore((state) => state.snapEnabled);
  const snapSize = useStore((state) => state.snapSize);
  return { transformMode, snapEnabled, snapSize };
};

export const useSceneObjects = () => useStore((state) => state.objects);

export const useObjectActions = () => {
  const addObject = useStore((state) => state.addObject);
  const updateObject = useStore((state) => state.updateObject);
  const updateSelectedObjects = useStore((state) => state.updateSelectedObjects);
  const deleteObject = useStore((state) => state.deleteObject);
  const deleteSelectedObjects = useStore((state) => state.deleteSelectedObjects);
  const selectObject = useStore((state) => state.selectObject);
  return { addObject, updateObject, updateSelectedObjects, deleteObject, deleteSelectedObjects, selectObject };
};

export const useClipboardActions = () => {
  const copySelectedObjects = useStore((state) => state.copySelectedObjects);
  const pasteObjects = useStore((state) => state.pasteObjects);
  const duplicateSelectedObjects = useStore((state) => state.duplicateSelectedObjects);
  return { copySelectedObjects, pasteObjects, duplicateSelectedObjects };
};

export const useSelectionActions = () => {
  const selectAll = useStore((state) => state.selectAll);
  const deselectAll = useStore((state) => state.deselectAll);
  return { selectAll, deselectAll };
};

export const useIsSelected = (id: string) => 
  useStore((state) => state.selectedIds.includes(id));
