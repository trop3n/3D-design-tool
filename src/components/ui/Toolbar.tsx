import React from 'react';
import { useStore } from '../../store/useStore';
import { undo, redo } from '../../hooks/useTemporalStore';
import { Box, Circle, Square, Move, RotateCw, Scaling, Download, Undo2, Redo2, Triangle, CircleDot, Pill, Cylinder, Magnet, Copy, Clipboard, CopyPlus, Play, Pause } from 'lucide-react';

export const Toolbar: React.FC = () => {
  const addObject = useStore((state) => state.addObject);
  const transformMode = useStore((state) => state.transformMode);
  const setTransformMode = useStore((state) => state.setTransformMode);
  const setIsExporting = useStore((state) => state.setIsExporting);
  const snapEnabled = useStore((state) => state.snapEnabled);
  const setSnapEnabled = useStore((state) => state.setSnapEnabled);
  const selectedIds = useStore((state) => state.selectedIds);
  const copySelectedObjects = useStore((state) => state.copySelectedObjects);
  const pasteObjects = useStore((state) => state.pasteObjects);
  const duplicateSelectedObjects = useStore((state) => state.duplicateSelectedObjects);
  const isPlayMode = useStore((state) => state.isPlayMode);
  const setIsPlayMode = useStore((state) => state.setIsPlayMode);

  const handleUndo = () => undo();
  const handleRedo = () => redo();

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
          title="Translate (T)"
        >
          <Move size={20} color="white" />
        </button>
        <button 
          onClick={() => setTransformMode('rotate')}
          className={`p-2 rounded transition-colors ${transformMode === 'rotate' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          title="Rotate (R)"
        >
          <RotateCw size={20} color="white" />
        </button>
        <button 
          onClick={() => setTransformMode('scale')}
          className={`p-2 rounded transition-colors ${transformMode === 'scale' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          title="Scale (S)"
        >
          <Scaling size={20} color="white" />
        </button>
        <button 
          onClick={() => setSnapEnabled(!snapEnabled)}
          className={`p-2 rounded transition-colors ${snapEnabled ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
          title="Snap to Grid"
        >
          <Magnet size={20} color="white" />
        </button>
      </div>
      <div className="flex gap-2 border-r border-gray-600 pr-4">
        <button 
          onClick={copySelectedObjects}
          className={`p-2 rounded transition-colors ${selectedIds.length === 0 ? 'opacity-50' : 'hover:bg-gray-700'}`}
          title="Copy (Ctrl+C)"
          disabled={selectedIds.length === 0}
        >
          <Copy size={20} color="white" />
        </button>
        <button 
          onClick={pasteObjects}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="Paste (Ctrl+V)"
        >
          <Clipboard size={20} color="white" />
        </button>
        <button 
          onClick={duplicateSelectedObjects}
          className={`p-2 rounded transition-colors ${selectedIds.length === 0 ? 'opacity-50' : 'hover:bg-gray-700'}`}
          title="Duplicate (Ctrl+D)"
          disabled={selectedIds.length === 0}
        >
          <CopyPlus size={20} color="white" />
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
        <button 
          onClick={() => addObject('cylinder')}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="Add Cylinder"
        >
          <Cylinder size={24} color="white" />
        </button>
        <button 
          onClick={() => addObject('cone')}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="Add Cone"
        >
          <Triangle size={24} color="white" />
        </button>
        <button 
          onClick={() => addObject('torus')}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="Add Torus"
        >
          <CircleDot size={24} color="white" />
        </button>
        <button 
          onClick={() => addObject('capsule')}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="Add Capsule"
        >
          <Pill size={24} color="white" />
        </button>
      </div>
      <div className="flex gap-2 pl-2">
        <button 
          onClick={() => setIsPlayMode(!isPlayMode)}
          className={`p-2 rounded transition-colors ${isPlayMode ? 'bg-green-600' : 'hover:bg-gray-700'}`}
          title={isPlayMode ? 'Exit Play Mode' : 'Play Mode'}
        >
          {isPlayMode ? <Pause size={20} color="white" /> : <Play size={20} color="white" />}
        </button>
        <button 
          onClick={() => setIsExporting(true)}
          className="p-2 hover:bg-gray-700 rounded transition-colors"
          title="Export GLTF"
        >
          <Download size={20} color="white" />
        </button>
      </div>
    </div>
  );
};
