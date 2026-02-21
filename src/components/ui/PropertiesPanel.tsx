import React from 'react';
import { useStore } from '../../store/useStore';
import type { SceneObject } from '../../types/store';

export const PropertiesPanel: React.FC = () => {
  const selectedId = useStore((state) => state.selectedId);
  const objects = useStore((state) => state.objects);
  const updateObject = useStore((state) => state.updateObject);
  const deleteObject = useStore((state) => state.deleteObject);

  const selectedObject = objects.find((obj) => obj.id === selectedId);

  if (!selectedObject) {
    return (
      <div className="absolute right-0 top-0 h-full w-64 bg-gray-900 text-white p-4 border-l border-gray-700">
        <p className="text-gray-400 text-sm">Select an object to edit properties.</p>
      </div>
    );
  }

  const handleChange = (prop: keyof SceneObject, axis: number, value: number) => {
    const currentVector = selectedObject[prop] as [number, number, number];
    const newVector = [...currentVector];
    newVector[axis] = value;
    updateObject(selectedObject.id, { [prop]: newVector });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateObject(selectedObject.id, { color: e.target.value });
  };

  return (
    <div className="h-full w-full bg-gray-900 text-white p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Properties</h2>
      
      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 mb-1">Name</label>
        <input
          type="text"
          value={selectedObject.name}
          onChange={(e) => updateObject(selectedObject.id, { name: e.target.value })}
          className="w-full bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 mb-1">Position</label>
        <div className="flex gap-2">
          <input 
            type="number" 
            value={selectedObject.position[0]} 
            onChange={(e) => handleChange('position', 0, parseFloat(e.target.value))}
            className="w-full bg-gray-800 rounded px-2 py-1 text-sm text-center"
          />
          <input 
            type="number" 
            value={selectedObject.position[1]} 
            onChange={(e) => handleChange('position', 1, parseFloat(e.target.value))}
            className="w-full bg-gray-800 rounded px-2 py-1 text-sm text-center"
          />
          <input 
            type="number" 
            value={selectedObject.position[2]} 
            onChange={(e) => handleChange('position', 2, parseFloat(e.target.value))}
            className="w-full bg-gray-800 rounded px-2 py-1 text-sm text-center"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 mb-1">Rotation</label>
        <div className="flex gap-2">
          <input 
            type="number" 
            step="0.1"
            value={selectedObject.rotation[0]} 
            onChange={(e) => handleChange('rotation', 0, parseFloat(e.target.value))}
            className="w-full bg-gray-800 rounded px-2 py-1 text-sm text-center"
          />
          <input 
            type="number" 
            step="0.1"
            value={selectedObject.rotation[1]} 
            onChange={(e) => handleChange('rotation', 1, parseFloat(e.target.value))}
            className="w-full bg-gray-800 rounded px-2 py-1 text-sm text-center"
          />
          <input 
            type="number" 
            step="0.1"
            value={selectedObject.rotation[2]} 
            onChange={(e) => handleChange('rotation', 2, parseFloat(e.target.value))}
            className="w-full bg-gray-800 rounded px-2 py-1 text-sm text-center"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 mb-1">Scale</label>
        <div className="flex gap-2">
          <input 
            type="number" 
            step="0.1"
            value={selectedObject.scale[0]} 
            onChange={(e) => handleChange('scale', 0, parseFloat(e.target.value))}
            className="w-full bg-gray-800 rounded px-2 py-1 text-sm text-center"
          />
          <input 
            type="number" 
            step="0.1"
            value={selectedObject.scale[1]} 
            onChange={(e) => handleChange('scale', 1, parseFloat(e.target.value))}
            className="w-full bg-gray-800 rounded px-2 py-1 text-sm text-center"
          />
          <input 
            type="number" 
            step="0.1"
            value={selectedObject.scale[2]} 
            onChange={(e) => handleChange('scale', 2, parseFloat(e.target.value))}
            className="w-full bg-gray-800 rounded px-2 py-1 text-sm text-center"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 mb-1">Color</label>
        <input 
          type="color" 
          value={selectedObject.color} 
          onChange={handleColorChange}
          className="w-full h-8 cursor-pointer rounded border border-gray-700"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 mb-1">Material</label>
        <div className="space-y-2">
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Roughness</span>
              <span>{selectedObject.roughness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedObject.roughness}
              onChange={(e) => updateObject(selectedObject.id, { roughness: parseFloat(e.target.value) })}
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Metalness</span>
              <span>{selectedObject.metalness.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedObject.metalness}
              onChange={(e) => updateObject(selectedObject.id, { metalness: parseFloat(e.target.value) })}
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-gray-700">
        <button 
          onClick={() => deleteObject(selectedObject.id)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
        >
          Delete Object
        </button>
      </div>
    </div>
  );
};
