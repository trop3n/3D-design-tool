import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Camera, Bookmark, Trash2 } from 'lucide-react';

interface CameraBookmarksPanelProps {
  onSaveCamera: (name: string) => void;
  onRestoreCamera: (position: [number, number, number], target: [number, number, number]) => void;
}

export const CameraBookmarksPanel: React.FC<CameraBookmarksPanelProps> = ({
  onSaveCamera,
  onRestoreCamera,
}) => {
  const cameraBookmarks = useStore((state) => state.cameraBookmarks);
  const deleteCameraBookmark = useStore((state) => state.deleteCameraBookmark);
  const [isSaving, setIsSaving] = useState(false);
  const [bookmarkName, setBookmarkName] = useState('');

  const handleSave = () => {
    if (bookmarkName.trim()) {
      onSaveCamera(bookmarkName.trim());
      setBookmarkName('');
      setIsSaving(false);
    }
  };

  return (
    <div className="p-2">
      <div className="flex items-center gap-2 mb-2">
        <Camera size={16} />
        <span className="text-xs font-bold text-gray-400">Camera Views</span>
      </div>
      
      {isSaving ? (
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={bookmarkName}
            onChange={(e) => setBookmarkName(e.target.value)}
            placeholder="Bookmark name..."
            className="flex-1 bg-gray-800 text-white rounded px-2 py-1 text-xs border border-gray-700 focus:outline-none focus:border-blue-500"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
              if (e.key === 'Escape') setIsSaving(false);
            }}
          />
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-xs"
          >
            Save
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsSaving(true)}
          className="w-full flex items-center justify-center gap-1 p-1.5 bg-gray-800 hover:bg-gray-700 rounded text-xs transition-colors mb-2"
        >
          <Bookmark size={14} />
          <span>Save Current View</span>
        </button>
      )}

      <div className="space-y-1 max-h-32 overflow-y-auto">
        {cameraBookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex items-center gap-2 p-1.5 bg-gray-800 hover:bg-gray-700 rounded cursor-pointer group"
            onClick={() => onRestoreCamera(bookmark.position, bookmark.target)}
          >
            <Camera size={12} className="text-gray-400" />
            <span className="flex-1 text-xs truncate">{bookmark.name}</span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteCameraBookmark(bookmark.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-gray-600 rounded transition-opacity"
            >
              <Trash2 size={12} className="text-red-400" />
            </button>
          </div>
        ))}
        {cameraBookmarks.length === 0 && (
          <p className="text-xs text-gray-500 text-center py-2">No bookmarks saved</p>
        )}
      </div>
    </div>
  );
};
