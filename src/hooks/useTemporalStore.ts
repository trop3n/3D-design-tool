import { useStore } from '../store/useStore';

interface TemporalState {
  undo: () => void;
  redo: () => void;
}

interface StoreWithTemporal {
  temporal: {
    getState: () => TemporalState;
  };
}

export const useTemporalStore = (): TemporalState => {
  const store = useStore as unknown as StoreWithTemporal;
  return store.temporal.getState();
};

export const undo = () => {
  const store = useStore as unknown as StoreWithTemporal;
  store.temporal.getState().undo();
};

export const redo = () => {
  const store = useStore as unknown as StoreWithTemporal;
  store.temporal.getState().redo();
};
