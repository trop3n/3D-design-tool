import React from 'react';
import { useStore } from '../../store/useStore';
import type { SceneObject } from '../../types/store';
import { ScrubberInput } from './ScrubberInput';

export const PropertiesPanel: React.FC = () => {
  const selectedIds = useStore((state) => state.selectedIds);
  const objects = useStore((state) => state.objects);
  const updateObject = useStore((state) => state.updateObject);
  const updateSelectedObjects = useStore((state) => state.updateSelectedObjects);
  const deleteSelectedObjects = useStore((state) => state.deleteSelectedObjects);

  const selectedObjects = objects.filter((obj) => selectedIds.includes(obj.id));
  const selectedObject = selectedObjects.length === 1 ? selectedObjects[0] : null;
  const multiSelectCount = selectedObjects.length;

  if (selectedIds.length === 0) {
    return (
      <div className="h-full w-full bg-gray-900 text-white p-4 overflow-y-auto">
        <p className="text-gray-400 text-sm">Select an object to edit properties.</p>
      </div>
    );
  }

  if (multiSelectCount > 1) {
    const handleChange = (prop: keyof SceneObject, axis: number, value: number) => {
      updateSelectedObjects({ [prop]: getUpdatedVector(prop, axis, value) });
    };

    const getUpdatedVector = (prop: keyof SceneObject, axis: number, value: number): [number, number, number] => {
      const firstObj = selectedObjects[0];
      const currentVector = firstObj[prop] as [number, number, number];
      const newVector = [...currentVector] as [number, number, number];
      newVector[axis] = value;
      return newVector;
    };

    return (
      <div className="h-full w-full bg-gray-900 text-white p-4 overflow-y-auto">
        <h2 className="text-lg font-bold mb-2">Properties</h2>
        <p className="text-sm text-blue-400 mb-4">{multiSelectCount} objects selected</p>
        
        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-400 mb-1">Position</label>
          <div className="flex gap-2">
            <ScrubberInput label="X" value={selectedObjects[0].position[0]} onChange={(v) => handleChange('position', 0, v)} />
            <ScrubberInput label="Y" value={selectedObjects[0].position[1]} onChange={(v) => handleChange('position', 1, v)} />
            <ScrubberInput label="Z" value={selectedObjects[0].position[2]} onChange={(v) => handleChange('position', 2, v)} />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-400 mb-1">Scale</label>
          <div className="flex gap-2">
            <ScrubberInput label="X" value={selectedObjects[0].scale[0]} onChange={(v) => handleChange('scale', 0, v)} />
            <ScrubberInput label="Y" value={selectedObjects[0].scale[1]} onChange={(v) => handleChange('scale', 1, v)} />
            <ScrubberInput label="Z" value={selectedObjects[0].scale[2]} onChange={(v) => handleChange('scale', 2, v)} />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs font-bold text-gray-400 mb-1">Color</label>
          <input 
            type="color" 
            value={selectedObjects[0].color} 
            onChange={(e) => updateSelectedObjects({ color: e.target.value })}
            className="w-full h-8 cursor-pointer rounded border border-gray-700"
          />
        </div>

        <div className="mt-8 pt-4 border-t border-gray-700">
          <button 
            onClick={deleteSelectedObjects}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
          >
            Delete {multiSelectCount} Objects
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (prop: keyof SceneObject, axis: number, value: number) => {
    if (!selectedObject) return;
    const currentVector = selectedObject[prop] as [number, number, number];
    const newVector = [...currentVector] as [number, number, number];
    newVector[axis] = value;
    updateObject(selectedObject.id, { [prop]: newVector });
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!selectedObject) return;
    updateObject(selectedObject.id, { color: e.target.value });
  };

  return (
    <div className="h-full w-full bg-gray-900 text-white p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Properties</h2>
      
      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 mb-1">Name</label>
        <input
          type="text"
          value={selectedObject?.name || ''}
          onChange={(e) => selectedObject && updateObject(selectedObject.id, { name: e.target.value })}
          className="w-full bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 mb-1">Position</label>
        <div className="flex gap-2">
          <ScrubberInput label="X" value={selectedObject?.position[0] || 0} onChange={(v) => handleChange('position', 0, v)} />
          <ScrubberInput label="Y" value={selectedObject?.position[1] || 0} onChange={(v) => handleChange('position', 1, v)} />
          <ScrubberInput label="Z" value={selectedObject?.position[2] || 0} onChange={(v) => handleChange('position', 2, v)} />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 mb-1">Rotation</label>
        <div className="flex gap-2">
          <ScrubberInput label="X" value={selectedObject?.rotation[0] || 0} onChange={(v) => handleChange('rotation', 0, v)} />
          <ScrubberInput label="Y" value={selectedObject?.rotation[1] || 0} onChange={(v) => handleChange('rotation', 1, v)} />
          <ScrubberInput label="Z" value={selectedObject?.rotation[2] || 0} onChange={(v) => handleChange('rotation', 2, v)} />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 mb-1">Scale</label>
        <div className="flex gap-2">
          <ScrubberInput label="X" value={selectedObject?.scale[0] || 1} onChange={(v) => handleChange('scale', 0, v)} />
          <ScrubberInput label="Y" value={selectedObject?.scale[1] || 1} onChange={(v) => handleChange('scale', 1, v)} />
          <ScrubberInput label="Z" value={selectedObject?.scale[2] || 1} onChange={(v) => handleChange('scale', 2, v)} />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 mb-1">Color</label>
        <input 
          type="color" 
          value={selectedObject?.color || '#ffffff'} 
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
              <span>{(selectedObject?.roughness || 0.5).toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedObject?.roughness || 0.5}
              onChange={(e) => selectedObject && updateObject(selectedObject.id, { roughness: parseFloat(e.target.value) })}
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Metalness</span>
              <span>{(selectedObject?.metalness || 0.5).toFixed(2)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={selectedObject?.metalness || 0.5}
              onChange={(e) => selectedObject && updateObject(selectedObject.id, { metalness: parseFloat(e.target.value) })}
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
            value={selectedObject?.textureUrl || ''}
            onChange={(e) => selectedObject && updateObject(selectedObject.id, { textureUrl: e.target.value })}
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
                  if (file && selectedObject) {
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
            {selectedObject?.textureUrl && (
              <button
                onClick={() => selectedObject && updateObject(selectedObject.id, { textureUrl: '' })}
                className="bg-gray-700 hover:bg-gray-600 text-white py-1 px-2 rounded text-sm transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          {selectedObject?.textureUrl && (
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
          onClick={() => selectedObject && deleteSelectedObjects()}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
        >
          Delete Object
        </button>
      </div>
    </div>
  );
};
