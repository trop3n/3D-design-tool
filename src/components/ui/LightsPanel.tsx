import React from 'react';
import { useStore } from '../../store/useStore';
import { Sun, Lightbulb, Flashlight, Circle } from 'lucide-react';

const lightIcons: Record<string, React.ReactNode> = {
  ambient: <Circle size={16} />,
  directional: <Sun size={16} />,
  point: <Lightbulb size={16} />,
  spot: <Flashlight size={16} />,
};

export const LightsPanel: React.FC = () => {
  const lights = useStore((state) => state.lights);
  const selectedLightId = useStore((state) => state.selectedLightId);
  const selectLight = useStore((state) => state.selectLight);
  const addLight = useStore((state) => state.addLight);
  const updateLight = useStore((state) => state.updateLight);
  const deleteLight = useStore((state) => state.deleteLight);

  const selectedLight = lights.find((light) => light.id === selectedLightId);

  const handlePositionChange = (axis: number, value: number) => {
    if (!selectedLight) return;
    const newPosition = [...selectedLight.position] as [number, number, number];
    newPosition[axis] = value;
    updateLight(selectedLight.id, { position: newPosition });
  };

  return (
    <div className="h-full w-full bg-gray-900 text-white p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Lighting</h2>
      
      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 mb-2">Add Light</label>
        <div className="flex gap-2">
          <button
            onClick={() => addLight('ambient')}
            className="flex-1 flex items-center justify-center gap-1 p-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
            title="Add Ambient Light"
          >
            <Circle size={16} />
            <span>Ambient</span>
          </button>
          <button
            onClick={() => addLight('directional')}
            className="flex-1 flex items-center justify-center gap-1 p-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
            title="Add Directional Light"
          >
            <Sun size={16} />
            <span>Sun</span>
          </button>
          <button
            onClick={() => addLight('point')}
            className="flex-1 flex items-center justify-center gap-1 p-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
            title="Add Point Light"
          >
            <Lightbulb size={16} />
            <span>Point</span>
          </button>
          <button
            onClick={() => addLight('spot')}
            className="flex-1 flex items-center justify-center gap-1 p-2 bg-gray-800 hover:bg-gray-700 rounded text-sm transition-colors"
            title="Add Spot Light"
          >
            <Flashlight size={16} />
            <span>Spot</span>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-bold text-gray-400 mb-2">Lights</label>
        <div className="space-y-1">
          {lights.map((light) => (
            <div
              key={light.id}
              onClick={() => selectLight(light.id)}
              className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                selectedLightId === light.id ? 'bg-blue-600' : 'bg-gray-800 hover:bg-gray-700'
              }`}
            >
              {lightIcons[light.type]}
              <span className="flex-1 truncate">{light.name}</span>
              <span className="text-xs text-gray-400">{light.type}</span>
            </div>
          ))}
        </div>
      </div>

      {selectedLight && (
        <div className="border-t border-gray-700 pt-4">
          <h3 className="text-sm font-bold mb-3">Light Properties</h3>
          
          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-400 mb-1">Name</label>
            <input
              type="text"
              value={selectedLight.name}
              onChange={(e) => updateLight(selectedLight.id, { name: e.target.value })}
              className="w-full bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-400 mb-1">Color</label>
            <input
              type="color"
              value={selectedLight.color}
              onChange={(e) => updateLight(selectedLight.id, { color: e.target.value })}
              className="w-full h-8 cursor-pointer rounded border border-gray-700"
            />
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-gray-400 mb-1">Intensity</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={selectedLight.intensity}
                onChange={(e) => updateLight(selectedLight.id, { intensity: parseFloat(e.target.value) })}
                className="flex-1 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-gray-400 w-10 text-right">{selectedLight.intensity.toFixed(1)}</span>
            </div>
          </div>

          {selectedLight.type !== 'ambient' && (
            <>
              <div className="mb-4">
                <label className="block text-xs font-bold text-gray-400 mb-1">Position</label>
                <div className="flex gap-2">
                  {['X', 'Y', 'Z'].map((axis, i) => (
                    <div key={axis} className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">{axis}</label>
                      <input
                        type="number"
                        step="0.5"
                        value={selectedLight.position[i]}
                        onChange={(e) => handlePositionChange(i, parseFloat(e.target.value) || 0)}
                        className="w-full bg-gray-800 text-white rounded px-2 py-1 text-sm border border-gray-700 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedLight.castShadow}
                    onChange={(e) => updateLight(selectedLight.id, { castShadow: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800"
                  />
                  <span className="text-sm">Cast Shadow</span>
                </label>
              </div>
            </>
          )}

          <div className="mt-4">
            <button
              onClick={() => deleteLight(selectedLight.id)}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors text-sm"
            >
              Delete Light
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
