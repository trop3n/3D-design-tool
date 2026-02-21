import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { Group } from 'three';
import { useStore } from '../../store/useStore';
import { ObjectWrapper } from './ObjectWrapper';
import { SceneExporter } from './SceneExporter';

export const Scene: React.FC = () => {
  const objects = useStore((state) => state.objects);
  const selectObject = useStore((state) => state.selectObject);
  const sceneGroupRef = useRef<Group>(null);

  return (
    <Canvas
      camera={{ position: [5, 5, 5], fov: 50 }}
      shadows
      onPointerMissed={() => selectObject(null)}
      style={{ background: '#1e1e1e' }}
    >
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} castShadow />
      <Environment preset="city" />
      <gridHelper args={[20, 20, 0x444444, 0x222222]} />
      <OrbitControls makeDefault />
      
      <group ref={sceneGroupRef}>
        {objects.map((obj) => (
          <ObjectWrapper key={obj.id} obj={obj} />
        ))}
      </group>
      <SceneExporter sceneGroupRef={sceneGroupRef} />
    </Canvas>
  );
};
