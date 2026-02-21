import React, { useEffect } from 'react';
import { GLTFExporter } from 'three-stdlib';
import { Group } from 'three';
import { useStore } from '../../store/useStore';

interface SceneExporterProps {
  sceneGroupRef: React.RefObject<Group | null>;
}

export const SceneExporter: React.FC<SceneExporterProps> = ({ sceneGroupRef }) => {
  const isExporting = useStore((state) => state.isExporting);
  const setIsExporting = useStore((state) => state.setIsExporting);

  useEffect(() => {
    if (isExporting && sceneGroupRef.current) {
      const exporter = new GLTFExporter();
      exporter.parse(
        sceneGroupRef.current,
        (gltf) => {
          const output = JSON.stringify(gltf, null, 2);
          const blob = new Blob([output], { type: 'text/plain' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'scene.gltf';
          link.click();
          URL.revokeObjectURL(url);
          setIsExporting(false);
        },
        (error) => {
          console.error('An error happened during export:', error);
          setIsExporting(false);
        },
        { binary: false }
      );
    }
  }, [isExporting, sceneGroupRef, setIsExporting]);

  return null;
};
