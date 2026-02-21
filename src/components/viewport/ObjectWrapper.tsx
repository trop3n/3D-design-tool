import React, { useRef, Suspense } from 'react';
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

interface ObjectWrapperProps {
  obj: SceneObject;
}

export const ObjectWrapper: React.FC<ObjectWrapperProps> = ({ obj }) => {
  const meshRef = useRef<Mesh>(null);
  const selectedId = useStore((state) => state.selectedId);
  const selectObject = useStore((state) => state.selectObject);
  const updateObject = useStore((state) => state.updateObject);
  const transformMode = useStore((state) => state.transformMode);

  const isSelected = selectedId === obj.id;

  const handleClick = (e: any) => {
    e.stopPropagation();
    selectObject(obj.id);
  };

  const handleTransformEnd = () => {
    if (meshRef.current) {
      updateObject(obj.id, {
        position: [meshRef.current.position.x, meshRef.current.position.y, meshRef.current.position.z],
        rotation: [meshRef.current.rotation.x, meshRef.current.rotation.y, meshRef.current.rotation.z],
        scale: [meshRef.current.scale.x, meshRef.current.scale.y, meshRef.current.scale.z],
      });
    }
  };

  return (
    <>
      <mesh
        ref={meshRef}
        position={obj.position}
        rotation={obj.rotation}
        scale={obj.scale}
        onClick={handleClick}
      >
        {obj.type === 'box' && <boxGeometry args={[1, 1, 1]} />}
        {obj.type === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
        {obj.type === 'plane' && <planeGeometry args={[2, 2]} />}
        
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
      {isSelected && meshRef.current && (
        <TransformControls
          object={meshRef.current}
          mode={transformMode}
          onMouseUp={handleTransformEnd}
        />
      )}
    </>
  );
};
