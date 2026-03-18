import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import type { SceneObject } from '../../types/store';
import { Box, Circle, Square, Triangle, Cylinder, CircleDot, Pill, Trash2, Eye, EyeOff, ChevronRight, ChevronDown, FolderClosed } from 'lucide-react';

const getIcon = (type: string) => {
  switch (type) {
    case 'box': return <Box size={16} />;
    case 'sphere': return <Circle size={16} />;
    case 'plane': return <Square size={16} />;
    case 'cylinder': return <Cylinder size={16} />;
    case 'cone': return <Triangle size={16} />;
    case 'torus': return <CircleDot size={16} />;
    case 'capsule': return <Pill size={16} />;
    case 'group': return <FolderClosed size={16} />;
    default: return <Box size={16} />;
  }
};

interface OutlinerItemProps {
  obj: SceneObject;
  depth: number;
  objects: SceneObject[];
  selectedIds: string[];
  expandedIds: Set<string>;
  onSelect: (e: React.MouseEvent, id: string) => void;
  onToggleExpand: (id: string) => void;
  onToggleVisibility: (obj: SceneObject) => void;
  onDelete: (id: string) => void;
}

const OutlinerItem: React.FC<OutlinerItemProps> = ({
  obj, depth, objects, selectedIds, expandedIds,
  onSelect, onToggleExpand, onToggleVisibility, onDelete,
}) => {
  const isGroup = obj.type === 'group';
  const isExpanded = expandedIds.has(obj.id);
  const children = isGroup ? objects.filter((o) => o.parentId === obj.id) : [];

  return (
    <>
      <div
        onClick={(e) => onSelect(e, obj.id)}
        className={`group/item flex items-center justify-between p-2 rounded cursor-pointer text-sm ${
          selectedIds.includes(obj.id) ? 'bg-blue-600' : 'hover:bg-gray-800'
        }`}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        <div className={`flex items-center gap-1.5 min-w-0 ${obj.visible === false ? 'opacity-40' : ''}`}>
          {isGroup ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(obj.id);
              }}
              className="text-gray-400 hover:text-white flex-shrink-0"
            >
              {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </button>
          ) : (
            <span className="w-3.5 flex-shrink-0" />
          )}
          {getIcon(obj.type)}
          <span className="truncate">{obj.name}</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisibility(obj);
            }}
            className={`text-gray-400 hover:text-white transition-opacity ${
              obj.visible === false ? 'opacity-100' : 'opacity-0 group-hover/item:opacity-100'
            }`}
          >
            {obj.visible === false ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(obj.id);
            }}
            className="text-gray-400 hover:text-red-400 opacity-0 group-hover/item:opacity-100 transition-opacity"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      {isGroup && isExpanded && children.map((child) => (
        <OutlinerItem
          key={child.id}
          obj={child}
          depth={depth + 1}
          objects={objects}
          selectedIds={selectedIds}
          expandedIds={expandedIds}
          onSelect={onSelect}
          onToggleExpand={onToggleExpand}
          onToggleVisibility={onToggleVisibility}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};

export const Outliner: React.FC = () => {
  const objects = useStore((state) => state.objects);
  const selectedIds = useStore((state) => state.selectedIds);
  const selectObject = useStore((state) => state.selectObject);
  const deleteObject = useStore((state) => state.deleteObject);
  const updateObject = useStore((state) => state.updateObject);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const rootObjects = objects.filter((obj) => !obj.parentId);

  const handleClick = (e: React.MouseEvent, id: string) => {
    const isMultiSelect = e.shiftKey || e.ctrlKey || e.metaKey;
    selectObject(id, isMultiSelect);
  };

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleVisibility = (obj: SceneObject) => {
    updateObject(obj.id, { visible: obj.visible === false });
  };

  return (
    <div className="h-full w-full bg-gray-900 text-white p-2 border-r border-gray-700 overflow-y-auto">
      <h2 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Scene</h2>
      <div className="space-y-0.5">
        {rootObjects.map((obj) => (
          <OutlinerItem
            key={obj.id}
            obj={obj}
            depth={0}
            objects={objects}
            selectedIds={selectedIds}
            expandedIds={expandedIds}
            onSelect={handleClick}
            onToggleExpand={handleToggleExpand}
            onToggleVisibility={handleToggleVisibility}
            onDelete={deleteObject}
          />
        ))}
        {objects.length === 0 && (
          <p className="text-gray-500 text-xs italic text-center mt-4">No objects in scene</p>
        )}
      </div>
    </div>
  );
};
