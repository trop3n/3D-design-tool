import React from 'react';
import { useStore } from '../../store/useStore';
import { Box, Circle, Square, Triangle, Cylinder, CircleDot, Pill, Trash2 } from 'lucide-react';

export const Outliner: React.FC = () => {
  const objects = useStore((state) => state.objects);
  const selectedIds = useStore((state) => state.selectedIds);
  const selectObject = useStore((state) => state.selectObject);
  const deleteObject = useStore((state) => state.deleteObject);

  const getIcon = (type: string) => {
    switch (type) {
      case 'box': return <Box size={16} />;
      case 'sphere': return <Circle size={16} />;
      case 'plane': return <Square size={16} />;
      case 'cylinder': return <Cylinder size={16} />;
      case 'cone': return <Triangle size={16} />;
      case 'torus': return <CircleDot size={16} />;
      case 'capsule': return <Pill size={16} />;
      default: return <Box size={16} />;
    }
  };

  const handleClick = (e: React.MouseEvent, id: string) => {
    const isMultiSelect = e.shiftKey || e.ctrlKey || e.metaKey;
    selectObject(id, isMultiSelect);
  };

  return (
    <div className="h-full w-full bg-gray-900 text-white p-2 border-r border-gray-700 overflow-y-auto">
      <h2 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Scene</h2>
      <div className="space-y-1">
        {objects.map((obj) => (
          <div
            key={obj.id}
            onClick={(e) => handleClick(e, obj.id)}
            className={`group flex items-center justify-between p-2 rounded cursor-pointer text-sm ${
              selectedIds.includes(obj.id) ? 'bg-blue-600' : 'hover:bg-gray-800'
            }`}
          >
            <div className="flex items-center gap-2">
              {getIcon(obj.type)}
              <span>{obj.name}</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteObject(obj.id);
              }}
              className="text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
        {objects.length === 0 && (
          <p className="text-gray-500 text-xs italic text-center mt-4">No objects in scene</p>
        )}
      </div>
    </div>
  );
};
