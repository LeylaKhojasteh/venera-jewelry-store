'use client';

import { Suspense, useRef, useState, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { useReducedMotion } from 'motion/react';
import * as THREE from 'three';
import { Bracelet, Chain, Earring, Ring } from '@/components/v3/JewelryStage';

function Showcase({ kind, reduce }: { kind: string; reduce: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current || reduce) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.2;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5) * 0.04;
  });

  let model: ReactNode;
  switch (kind) {
    case 'bracelet':
      model = (
        <group scale={1.9}>
          <group position={[2.05, 0.95, 0]}>
            <Bracelet />
          </group>
        </group>
      );
      break;
    case 'earrings':
      model = (
        <group scale={1.7}>
          <group position={[-2.165, -0.95, 0]}>
            <Earring x={1.95} rotation={0.08} />
            <Earring x={2.38} rotation={-0.06} />
          </group>
        </group>
      );
      break;
    case 'ring':
      model = (
        <group scale={1.7}>
          <group position={[-1.15, 1.55, 0]}>
            <Ring />
          </group>
          <pointLight position={[1.6, 2.2, 3.4]} intensity={0.7} distance={5} color="#ffffff" />
        </group>
      );
      break;
    default:
      model = (
        <group scale={1.05} position={[0, 0.1, 0]}>
          <Chain />
        </group>
      );
  }

  return <group ref={group}>{model}</group>;
}

export function CategoryStage({ kind, fallback }: { kind: string; fallback: ReactNode }) {
  const reduce = useReducedMotion() ?? false;
  const [supported] = useState(() => {
    if (typeof document === 'undefined') return true;
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  });

  if (!supported) return <>{fallback}</>;

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 34 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[3, 4, 5]}
        intensity={2.2}
        color="#fff5ea"
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-camera-left={-3}
        shadow-camera-right={3}
        shadow-camera-top={3}
        shadow-camera-bottom={-3}
        shadow-camera-near={0.5}
        shadow-camera-far={16}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
      />
      <directionalLight position={[-4, 2, -2]} intensity={1.2} color="#e6ad8b" />
      <pointLight position={[0, 2, 6]} intensity={0.35} color="#ffffff" />

      <Suspense fallback={null}>
        <Environment resolution={48} frames={1}>
          <Lightformer intensity={2.2} position={[0, 4, 4]} scale={[6, 3, 1]} color="#ffffff" />
          <Lightformer intensity={1.4} position={[-3, 1, 3]} scale={[3, 5, 1]} color="#ffd9c4" />
          <Lightformer intensity={1.1} position={[3, 0, 2]} scale={[3, 5, 1]} color="#cfd9ff" />
        </Environment>
      </Suspense>

      <Showcase kind={kind} reduce={reduce} />
      <ContactShadows position={[0, -2.2, 0]} opacity={0.18} scale={4} blur={2.4} far={4} color="#3a1b24" />
    </Canvas>
  );
}
