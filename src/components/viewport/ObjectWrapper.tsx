import React, { Suspense, useState, memo, useCallback } from 'react';
import { TransformControls, useTexture } from '@react-three/drei';
import { Mesh } from 'three';
import { useStore } from '../../store/useStore';
import type { SceneObject, EventType } from '../../types/store';
import { SELECTION_COLOR } from '../../constants/scene';

interface TexturedMaterialProps {
  url: string;
  color: string;
  roughness: number;
  metalness: number;
}

const TexturedMaterial: React.FC<TexturedMaterialProps> = memo(({ url, color, roughness, metalness }) => {
  const texture = useTexture(url);
  return <meshStandardMaterial map={texture} color={color} roughness={roughness} metalness={metalness} />;
});

TexturedMaterial.displayName = 'TexturedMaterial';

interface TransformControlsWrapperProps {
  mesh: Mesh;
  transformMode: 'translate' | 'rotate' | 'scale';
  snapEnabled: boolean;
  snapSize: number;
  onTransformEnd: () => void;
}

const TransformControlsWrapper: React.FC<TransformControlsWrapperProps> = memo(({ 
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
});

TransformControlsWrapper.displayName = 'TransformControlsWrapper';

interface ObjectWrapperProps {
  obj: SceneObject;
}

const ObjectWrapperInner: React.FC<ObjectWrapperProps> = ({ obj }) => {
  const [mesh, setMesh] = useState<Mesh | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const isSelected = useStore(
    useCallback((state) => state.selectedIds.includes(obj.id), [obj.id])
  );
  const selectObject = useStore((state) => state.selectObject);
  const updateObject = useStore((state) => state.updateObject);
  const transformMode = useStore((state) => state.transformMode);
  const snapEnabled = useStore((state) => state.snapEnabled);
  const snapSize = useStore((state) => state.snapSize);
  const selectedCount = useStore(
    useCallback((state) => state.selectedIds.length, [])
  );
  const isPlayMode = useStore((state) => state.isPlayMode);
  const triggerObjectEvent = useStore((state) => state.triggerObjectEvent);

  const handleClick = useCallback((e: { stopPropagation: () => void; shiftKey: boolean; ctrlKey: boolean; metaKey: boolean }) => {
    e.stopPropagation();
    
    if (isPlayMode) {
      triggerObjectEvent(obj.id, 'click' as EventType);
    } else {
      const isMultiSelect = e.shiftKey || e.ctrlKey || e.metaKey;
      selectObject(obj.id, isMultiSelect);
    }
  }, [obj.id, selectObject, isPlayMode, triggerObjectEvent]);

  const handlePointerEnter = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setIsHovered(true);
    if (isPlayMode) {
      triggerObjectEvent(obj.id, 'mouseEnter' as EventType);
    }
  }, [obj.id, isPlayMode, triggerObjectEvent]);

  const handlePointerLeave = useCallback((e: { stopPropagation: () => void }) => {
    e.stopPropagation();
    setIsHovered(false);
    if (isPlayMode) {
      triggerObjectEvent(obj.id, 'mouseLeave' as EventType);
    }
  }, [obj.id, isPlayMode, triggerObjectEvent]);

  const handleTransformEnd = useCallback(() => {
    if (mesh) {
      updateObject(obj.id, {
        position: [mesh.position.x, mesh.position.y, mesh.position.z],
        rotation: [mesh.rotation.x, mesh.rotation.y, mesh.rotation.z],
        scale: [mesh.scale.x, mesh.scale.y, mesh.scale.z],
      });
    }
  }, [mesh, obj.id, updateObject]);

  const getDisplayColor = () => {
    if (isPlayMode) return obj.color;
    if (isSelected) return SELECTION_COLOR;
    if (isHovered) return '#ff6b9d';
    return obj.color;
  };

  const showTransformControls = !isPlayMode && isSelected && mesh && selectedCount === 1;

  return (
    <>
      <mesh
        ref={setMesh}
        position={obj.position}
        rotation={obj.rotation}
        scale={obj.scale}
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {obj.type === 'box' && <boxGeometry args={[1, 1, 1]} />}
        {obj.type === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
        {obj.type === 'plane' && <planeGeometry args={[2, 2]} />}
        {obj.type === 'cylinder' && <cylinderGeometry args={[0.5, 0.5, 1, 32]} />}
        {obj.type === 'cone' && <coneGeometry args={[0.5, 1, 32]} />}
        {obj.type === 'torus' && <torusGeometry args={[0.4, 0.15, 16, 48]} />}
        {obj.type === 'capsule' && <capsuleGeometry args={[0.25, 0.5, 8, 16]} />}
        
        <Suspense fallback={<meshStandardMaterial color={getDisplayColor()} roughness={obj.roughness} metalness={obj.metalness} />}>
          {obj.textureUrl ? (
            <TexturedMaterial 
              url={obj.textureUrl} 
              color={getDisplayColor()} 
              roughness={obj.roughness} 
              metalness={obj.metalness} 
            />
          ) : (
            <meshStandardMaterial
              color={getDisplayColor()}
              roughness={obj.roughness}
              metalness={obj.metalness}
            />
          )}
        </Suspense>
      </mesh>
      {showTransformControls && (
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

export const ObjectWrapper = memo(ObjectWrapperInner);
