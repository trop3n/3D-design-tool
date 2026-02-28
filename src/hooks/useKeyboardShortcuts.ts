import { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { undo, redo } from './useTemporalStore';

export const useKeyboardShortcuts = () => {
  const setTransformMode = useStore((state) => state.setTransformMode);
  const deleteSelectedObjects = useStore((state) => state.deleteSelectedObjects);
  const selectedIds = useStore((state) => state.selectedIds);
  const copySelectedObjects = useStore((state) => state.copySelectedObjects);
  const pasteObjects = useStore((state) => state.pasteObjects);
  const duplicateSelectedObjects = useStore((state) => state.duplicateSelectedObjects);
  const selectAll = useStore((state) => state.selectAll);
  const deselectAll = useStore((state) => state.deselectAll);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        redo();
        return;
      }

      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault();
        selectAll();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'c') {
        e.preventDefault();
        copySelectedObjects();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault();
        pasteObjects();
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'd') {
        e.preventDefault();
        duplicateSelectedObjects();
        return;
      }

      if (e.key === 'Escape') {
        deselectAll();
        return;
      }

      switch (e.key.toLowerCase()) {
        case 't':
          setTransformMode('translate');
          break;
        case 'r':
          setTransformMode('rotate');
          break;
        case 's':
          setTransformMode('scale');
          break;
        case 'delete':
        case 'backspace':
          if (selectedIds.length > 0) {
            deleteSelectedObjects();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setTransformMode, deleteSelectedObjects, selectedIds, copySelectedObjects, pasteObjects, duplicateSelectedObjects, selectAll, deselectAll]);
};
