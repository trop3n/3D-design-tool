import React, { Suspense, useState } from 'react';
import { TransformControls, useTexture } from '@react-three/drei';
import { Mesh } from 'three';
import { useStore } from '../../store/useStore';
import type { SceneObject } from '../../types/store';

interface TexturedMaterialProps {
  url: string;
  color: string;
  roughness: number;
  metalness: number;
}

const TexturedMaterial: React.FC<TexturedMaterialProps> = ({ url, color, roughness, metalness }) => {
  const texture = useTexture(url);
  return <meshStandardMaterial map={texture} color={color} roughness={roughness} metalness={metalness} />;
};

interface TransformControlsWrapperProps {
  mesh: Mesh;
  transformMode: 'translate' | 'rotate' | 'scale';
  snapEnabled: boolean;
  snapSize: number;
  onTransformEnd: () => void;
}

const TransformControlsWrapper: React.FC<TransformControlsWrapperProps> = ({ 
  mesh, 
  transformMode, 
  snapEnabled,
  snapSize,
  onTransformEnd 
}) => {
  const snap = snapEnabled ? snapSize : undefined;
  return (
    <TransformControls
      object={mesh}
      mode={transformMode}
      translationSnap={snap}
      rotationSnap={snap ? snap * (Math.PI / 180) * 15 : undefined}
      scaleSnap={snap}
      onMouseUp={onTransformEnd}
    />
  );
};

interface ObjectWrapperProps {
  obj: SceneObject;
}

export const ObjectWrapper: React.FC<ObjectWrapperProps> = ({ obj }) => {
  const [mesh, setMesh] = useState<Mesh | null>(null);
  const selectedIds = useStore((state) => state.selectedIds);
  const selectObject = useStore((state) => state.selectObject);
  const updateObject = useStore((state) => state.updateObject);
  const transformMode = useStore((state) => state.transformMode);
  const snapEnabled = useStore((state) => state.snapEnabled);
  const snapSize = useStore((state) => state.snapSize);

  const isSelected = selectedIds.includes(obj.id);

  const handleClick = (e: { stopPropagation: () => void; shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }) => {
    e.stopPropagation();
    const isMultiSelect = e.shiftKey || e.ctrlKey || e.metaKey;
    selectObject(obj.id, isMultiSelect);
  };

  const handleTransformEnd = () => {
    if (mesh) {
      updateObject(obj.id, {
        position: [mesh.position.x, mesh.position.y, mesh.position.z],
        rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z],
        scale: [mesh.scale.x, mesh.scale.y, mesh.scale.z],
      });
    }
  };

  return (
    <>
      <mesh
        ref={setMesh}
        position={obj.position}
        rotation={obj.rotation}
        scale={obj.scale}
        onClick={handleClick}
      >
        {obj.type === 'box' && <boxGeometry args={[1, 1, 1]} />}
        {obj.type === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
        {obj.type === 'plane' && <planeGeometry args={[2, 2]} />}
        {obj.type === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1, 32]} />}
        {obj.type === 'cone' && <coneGeometry args={[0.5, 1, 32]} />}
        {obj.type === 'torus' && <torusGeometry args={[0.4, 0.15, 16, 48]} />}
        {obj.type === 'capsule' && <capsuleGeometry args={[0.25, 0.5, 8, 16]} />}
        
        <Suspense fallback={<meshStandardMaterial color={isSelected ? '#ff0055' : obj.color} roughness={obj.roughness} metalness={obj.metalness} />}>
            {obj.textureUrl ? (
                <TexturedMaterial 
                    url={obj.textureUrl} 
                    color={isSelected ? '#ff0055' : obj.color} 
                    roughness={obj.roughness} 
                    metalness={obj.metalness} 
                />
            ) : (
                <meshStandardMaterial
                    color={isSelected ? '#ff0055' : obj.color}
                    roughness={obj.roughness}
                    metalness={obj.metalness}
                />
            )}
        </Suspense>
      </mesh>
      {isSelected && mesh && selectedIds.length === 1 && (
        <TransformControlsWrapper
          mesh={mesh}
          transformMode={transformMode}
          snapEnabled={snapEnabled}
          snapSize={snapSize}
          onTransformEnd={handleTransformEnd}
        />
      )}
    </>
  );
};
