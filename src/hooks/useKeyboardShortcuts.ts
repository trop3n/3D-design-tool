import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const useKeyboardShortcuts = () => {
  const setTransformMode = useStore((state) => state.setTransformMode);
  const deleteObject = useStore((state) => state.deleteObject);
  const selectedId = useStore((state) => state.selectedId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Undo/Redo separately to respect focus or global shortcuts
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          (useStore as any).temporal.getState().redo();
        } else {
          (useStore as any).temporal.getState().undo();
        }
        return; // Prevent other actions
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        (useStore as any).temporal.getState().redo();
        return;
      }

      // Ignore if typing in an input (except for undo/redo which might be desired globally, 
      // but usually browser handles text input undo. Let's keep the exclusion for now.)
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
