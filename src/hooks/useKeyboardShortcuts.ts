import { useEffect } from 'react';
import { useStore } from '../store/useStore';

export const useKeyboardShortcuts = () => {
  const setTransformMode = useStore((state) => state.setTransformMode);
  const deleteObject = useStore((state) => state.deleteObject);
  const selectedId = useStore((state) => state.selectedId);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input
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
