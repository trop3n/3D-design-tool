import React from 'react';
import { useStore } from '../../store/useStore';
import type { SceneObject } from '../../types/store';
import { ScrubberInput } from './ScrubberInput';

export const PropertiesPanel: React.FC = () => {
  const selectedId = useStore((state) => state.selectedId);
  const objects = useStore((state) => state.objects);
  const updateObject = useStore((state) => state.updateObject);
  const deleteObject = useStore((state) => state.deleteObject);

  const selectedObject = objects.find((obj) => obj.id === selectedId);

  if (!selectedObject) {
    return (
      <div className="h-full w-full bg-gray-900 text-white p-4 overflow-y-auto">
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
          <ScrubberInput label="X" value={selectedObject.position[0]} onChange={(v) => handleChange('position', 0, v)} />
          <ScrubberInput label="Y" value={selectedObject.position[1]} onChange={(v) => handleChange('position', 1, v)} />
          <ScrubberInput label="Z" value={selectedObject.position[2]} onChange={(v) => handleChange('position', 2, v)} />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 mb-1">Rotation</label>
        <div className="flex gap-2">
          <ScrubberInput label="X" value={selectedObject.rotation[0]} onChange={(v) => handleChange('rotation', 0, v)} />
          <ScrubberInput label="Y" value={selectedObject.rotation[1]} onChange={(v) => handleChange('rotation', 1, v)} />
          <ScrubberInput label="Z" value={selectedObject.rotation[2]} onChange={(v) => handleChange('rotation', 2, v)} />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 mb-1">Scale</label>
        <div className="flex gap-2">
          <ScrubberInput label="X" value={selectedObject.scale[0]} onChange={(v) => handleChange('scale', 0, v)} />
          <ScrubberInput label="Y" value={selectedObject.scale[1]} onChange={(v) => handleChange('scale', 1, v)} />
          <ScrubberInput label="Z" value={selectedObject.scale[2]} onChange={(v) => handleChange('scale', 2, v)} />
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

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 mb-1">Texture</label>
        <div className="space-y-2">
          <input
            type="text"
            value={selectedObject.textureUrl || ''}
            onChange={(e) => updateObject(selectedObject.id, { textureUrl: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="w-full bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <div className="flex gap-2">
            <label className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-center py-1 px-2 rounded cursor-pointer text-sm transition-colors">
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      const dataUrl = event.target?.result as string;
                      updateObject(selectedObject.id, { textureUrl: dataUrl });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className="hidden"
              />
            </label>
            {selectedObject.textureUrl && (
              <button
                onClick={() => updateObject(selectedObject.id, { textureUrl: '' })}
                className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded text-sm transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          {selectedObject.textureUrl && (
            <div className="mt-2">
              <img 
                src={selectedObject.textureUrl} 
                alt="Texture preview" 
                className="w-full h-20 object-cover rounded border border-gray-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}
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
