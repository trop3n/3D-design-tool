import { describe, it, expect, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useStore } from '../store/useStore';

describe('useStore', () => {
  beforeEach(() => {
    act(() => {
      useStore.setState({
        objects: [],
        selectedIds: [],
        clipboard: [],
      });
    });
  });

  describe('addObject', () => {
    it('should add a new object to the scene', () => {
      act(() => {
        useStore.getState().addObject('box');
      });

      const objects = useStore.getState().objects;
      expect(objects).toHaveLength(1);
      expect(objects[0].type).toBe('box');
      expect(objects[0].name).toBe('Box');
    });

    it('should select the newly added object', () => {
      act(() => {
        useStore.getState().addObject('sphere');
      });

      const selectedIds = useStore.getState().selectedIds;
      expect(selectedIds).toHaveLength(1);
    });
  });

  describe('selectObject', () => {
    it('should select a single object', () => {
      act(() => {
        useStore.getState().addObject('box');
        const objectId = useStore.getState().objects[0].id;
        useStore.getState().selectObject(objectId);
      });

      expect(useStore.getState().selectedIds).toHaveLength(1);
    });

    it('should add to selection with multi flag', () => {
      act(() => {
        useStore.getState().addObject('box');
        useStore.getState().addObject('sphere');
        const ids = useStore.getState().objects.map((o) => o.id);
        useStore.getState().selectObject(ids[0], false);
        useStore.getState().selectObject(ids[1], true);
      });

      expect(useStore.getState().selectedIds).toHaveLength(2);
    });

    it('should toggle selection when multi-selecting already selected object', () => {
      act(() => {
        useStore.getState().addObject('box');
        const objectId = useStore.getState().objects[0].id;
        useStore.getState().selectObject(objectId, false);
        useStore.getState().selectObject(objectId, true);
      });

      expect(useStore.getState().selectedIds).toHaveLength(0);
    });
  });

  describe('deleteSelectedObjects', () => {
    it('should delete all selected objects', () => {
      act(() => {
        useStore.getState().addObject('box');
        useStore.getState().addObject('sphere');
        useStore.getState().selectAll();
        useStore.getState().deleteSelectedObjects();
      });

      expect(useStore.getState().objects).toHaveLength(0);
      expect(useStore.getState().selectedIds).toHaveLength(0);
    });
  });

  describe('copy/paste', () => {
    it('should copy and paste objects', () => {
      act(() => {
        useStore.getState().addObject('box');
        useStore.getState().copySelectedObjects();
        useStore.getState().pasteObjects();
      });

      expect(useStore.getState().objects).toHaveLength(2);
      expect(useStore.getState().objects[1].name).toBe('Box (copy)');
    });
  });

  describe('duplicateSelectedObjects', () => {
    it('should duplicate selected objects', () => {
      act(() => {
        useStore.getState().addObject('sphere');
        useStore.getState().duplicateSelectedObjects();
      });

      expect(useStore.getState().objects).toHaveLength(2);
      expect(useStore.getState().objects[1].name).toBe('Sphere (copy)');
    });
  });

  describe('selectAll', () => {
    it('should select all objects', () => {
      act(() => {
        useStore.getState().addObject('box');
        useStore.getState().addObject('sphere');
        useStore.getState().addObject('cylinder');
        useStore.getState().deselectAll();
        useStore.getState().selectAll();
      });

      expect(useStore.getState().selectedIds).toHaveLength(3);
    });
  });

  describe('snap settings', () => {
    it('should toggle snap enabled', () => {
      expect(useStore.getState().snapEnabled).toBe(false);

      act(() => {
        useStore.getState().setSnapEnabled(true);
      });

      expect(useStore.getState().snapEnabled).toBe(true);
    });

    it('should set snap size', () => {
      act(() => {
        useStore.getState().setSnapSize(1.0);
      });

      expect(useStore.getState().snapSize).toBe(1.0);
    });
  });
});
