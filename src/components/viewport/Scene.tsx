import React, { useRef, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Group, Vector3 } from 'three';
import { useStore } from '../../store/useStore';
import { ObjectWrapper } from './ObjectWrapper';
import { SceneExporter } from './SceneExporter';

export interface CameraControls {
  getCameraState: () => { position: [number, number, number]; target: [number, number, number] };
  setCameraState: (position: [number, number, number], target: [number, number, number]) => void;
}

interface CameraControllerProps {
  onCameraReady?: (controls: CameraControls) => void;
  cameraTarget?: { position: [number, number, number]; target: [number, number, number] } | null;
}

const CameraController: React.FC<CameraControllerProps> = ({ onCameraReady, cameraTarget }) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (onCameraReady) {
      onCameraReady({
        getCameraState: () => {
          const target = controlsRef.current?.target || new Vector3(0, 0, 0);
          return {
            position: [camera.position.x, camera.position.y, camera.position.z],
            target: [target.x, target.y, target.z],
          };
        },
        setCameraState: (position, target) => {
          camera.position.set(position[0], position[1], position[2]);
          if (controlsRef.current) {
            controlsRef.current.target.set(target[0], target[1], target[2]);
            controlsRef.current.update();
          }
        },
      });
    }
  }, [onCameraReady, camera]);

  useEffect(() => {
    if (cameraTarget && controlsRef.current) {
      camera.position.set(cameraTarget.position[0], cameraTarget.position[1], cameraTarget.position[2]);
      controlsRef.current.target.set(cameraTarget.target[0], cameraTarget.target[1], cameraTarget.target[2]);
      controlsRef.current.update();
    }
  }, [cameraTarget, camera]);

  return <OrbitControls ref={controlsRef} makeDefault />;
};

const LightRenderer: React.FC = () => {
  const lights = useStore((state) => state.lights);

  return (
    <>
      {lights.map((light) => {
        if (light.type === 'ambient') {
          return (
            <ambientLight
              key={light.id}
              intensity={light.intensity}
              color={light.color}
            />
          );
        }
        if (light.type === 'directional') {
          return (
            <directionalLight
              key={light.id}
              position={light.position}
              intensity={light.intensity}
              color={light.color}
              castShadow={light.castShadow}
              shadow-mapSize-width={2048}
              shadow-mapSize-height={2048}
            />
          );
        }
        if (light.type === 'point') {
          return (
            <pointLight
              key={light.id}
              position={light.position}
              intensity={light.intensity}
              color={light.color}
              castShadow={light.castShadow}
            />
          );
        }
        if (light.type === 'spot') {
          return (
            <spotLight
              key={light.id}
              position={light.position}
              intensity={light.intensity}
              color={light.color}
              castShadow={light.castShadow}
              angle={0.5}
              penumbra={0.5}
            />
          );
        }
        return null;
      })}
    </>
  );
};

interface SceneProps {
  onCameraReady?: (controls: CameraControls) => void;
  cameraTarget?: { position: [number, number, number]; target: [number, number, number] } | null;
}

export const Scene: React.FC<SceneProps> = ({ onCameraReady, cameraTarget }) => {
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
      <LightRenderer />
      <Environment preset="city" />
      <group position={[0, -0.01, 0]}>
        <gridHelper args={[20, 20, 0x444444, 0x222222]} />
        <ContactShadows 
          opacity={0.5} 
          scale={20} 
          blur={2} 
          far={4} 
          resolution={256} 
          color="#000000" 
        />
      </group>
      <CameraController onCameraReady={onCameraReady} cameraTarget={cameraTarget} />
      
      <group ref={sceneGroupRef}>
        {objects.map((obj) => (
          <ObjectWrapper key={obj.id} obj={obj} />
        ))}
      </group>
      <SceneExporter sceneGroupRef={sceneGroupRef} />
    </Canvas>
  );
};
