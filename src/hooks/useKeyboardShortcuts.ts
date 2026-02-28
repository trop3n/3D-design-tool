import { useEffect } from 'react';
import { useStore } from '../store/useStore';

interface TemporalStore {
  temporal: {
    getState: () => { undo: () => void; redo: () => void };
  };
}

export const useKeyboardShortcuts = () => {
  const setTransformMode = useStore((state) => state.setTransformMode);
  const deleteObject = useStore((state) => state.deleteObject);
  const selectedId = useStore((state) => state.selectedId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          (useStore as unknown as TemporalStore).temporal.getState().redo();
        } else {
          (useStore as unknown as TemporalStore).temporal.getState().undo();
        }
        return;
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        (useStore as unknown as TemporalStore).temporal.getState().redo();
        return;
      }

      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
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
          if (selectedId) {
            deleteObject(selectedId);
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setTransformMode, deleteObject, selectedId]);
};
