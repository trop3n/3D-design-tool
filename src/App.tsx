import { Scene } from './components/viewport/Scene';
import { Toolbar } from './components/ui/Toolbar';
import { PropertiesPanel } from './components/ui/PropertiesPanel';
import { Outliner } from './components/ui/Outliner';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

function App() {
  useKeyboardShortcuts();

  return (
    <div className="w-full h-screen flex bg-gray-900 overflow-hidden text-white">
      {/* Left Sidebar - Outliner */}
      <div className="w-64 flex-shrink-0 z-20">
        <Outliner />
      </div>

      {/* Main Content - Scene & Toolbar */}
      <div className="flex-1 relative">
        <Toolbar />
        <Scene />
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-64 flex-shrink-0 border-l border-gray-700 z-20 bg-gray-900">
         <PropertiesPanel />
      </div>
    </div>
  );
}

export default App;
