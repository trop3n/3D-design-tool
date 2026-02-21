import React from 'react';
import { useStore } from '../../store/useStore';
import { Box, Circle, Square, Move, RotateCw, Scaling, Download, Undo2, Redo2 } from 'lucide-react';

export const Toolbar: React.FC = () => {
  const addObject = useStore((state) => state.addObject);
  const transformMode = useStore((state) => state.transformMode);
  const setTransformMode = useStore((state) => state.setTransformMode);
  const setIsExporting = useStore((state) => state.setIsExporting);

  const handleUndo = () => {
    (useStore as any).temporal.getState().undo();
  };

  const handleRedo = () => {
    (useStore as any).temporal.getState().redo();
  };

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex gap-4 p-2 bg-gray-800 rounded-lg shadow-lg z-10">
      <div className="flex gap-2 border-r border-gray-600 pr-4">
        <button 
          onClick={handleUndo}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={20} color="white" />
        </button>
        <button 
          onClick={handleRedo}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 size={20} color="white" />
        </button>
      </div>
      <div className="flex gap-2 border-r border-gray-600 pr-4">
        <button 
          onClick={() => setTransformMode('translate')}
          className={`p-2 rounded transition-colors ${transformMode === 'translate' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          title="Translate"
        >
          <Move size={20} color="white" />
        </button>
        <button 
          onClick={() => setTransformMode('rotate')}
          className={`p-2 rounded transition-colors ${transformMode === 'rotate' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          title="Rotate"
        >
          <RotateCw size={20} color="white" />
        </button>
        <button 
          onClick={() => setTransformMode('scale')}
          className={`p-2 rounded transition-colors ${transformMode === 'scale' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          title="Scale"
        >
          <Scaling size={20} color="white" />
        </button>
      </div>
      <div className="flex gap-2 pl-2 border-r border-gray-600 pr-4">
        <button 
          onClick={() => addObject('box')}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="Add Box"
        >
          <Box size={24} color="white" />
        </button>
        <button 
          onClick={() => addObject('sphere')}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="Add Sphere"
        >
          <Circle size={24} color="white" />
        </button>
        <button 
          onClick={() => addObject('plane')}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="Add Plane"
        >
          <Square size={24} color="white" />
        </button>
      </div>
      <div className="flex gap-2 pl-2">
        <button 
          onClick={() => setIsExporting(true)}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="Export GLTF"
        >
          <Download size={24} color="white" />
        </button>
      </div>
    </div>
  );
};
