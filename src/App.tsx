import { useState, useRef } from 'react';
import { Scene } from './components/viewport/Scene';
import type { CameraControls } from './components/viewport/Scene';
import { Toolbar } from './components/ui/Toolbar';
import { PropertiesPanel } from './components/ui/PropertiesPanel';
import { LightsPanel } from './components/ui/LightsPanel';
import { Outliner } from './components/ui/Outliner';
import { CameraBookmarksPanel } from './components/ui/CameraBookmarksPanel';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useStore } from './store/useStore';

function App() {
  useKeyboardShortcuts();
  const [activeTab, setActiveTab] = useState<'properties' | 'lights'>('properties');
  const cameraControlsRef = useRef<CameraControls | null>(null);
  const [cameraTarget, setCameraTarget] = useState<{ position: [number, number, number]; target: [number, number, number] } | null>(null);
  const addCameraBookmark = useStore((state) => state.addCameraBookmark);

  const handleCameraReady = (controls: CameraControls) => {
    cameraControlsRef.current = controls;
  };

  const handleSaveCamera = (name: string) => {
    if (cameraControlsRef.current) {
      const state = cameraControlsRef.current.getCameraState();
      addCameraBookmark(name, state.position, state.target);
    }
  };

  const handleRestoreCamera = (position: [number, number, number], target: [number, number, number]) => {
    setCameraTarget({ position, target });
  };

  return (
    <div className="w-full h-screen flex bg-gray-900 overflow-hidden text-white">
      <div className="w-64 flex-shrink-0 z-20 flex flex-col">
        <Outliner />
        <div className="border-t border-gray-700">
          <CameraBookmarksPanel
            onSaveCamera={handleSaveCamera}
            onRestoreCamera={handleRestoreCamera}
          />
        </div>
      </div>

      <div className="flex-1 relative">
        <Toolbar />
        <Scene onCameraReady={handleCameraReady} cameraTarget={cameraTarget} />
      </div>

      <div className="w-64 flex-shrink-0 border-l border-gray-700 z-20 bg-gray-900 flex flex-col">
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab('properties')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              activeTab === 'properties' 
                ? 'bg-gray-800 text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveTab('lights')}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              activeTab === 'lights' 
                ? 'bg-gray-800 text-white border-b-2 border-blue-500' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Lighting
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          {activeTab === 'properties' ? <PropertiesPanel /> : <LightsPanel />}
        </div>
      </div>
    </div>
  );
}

export default App;
