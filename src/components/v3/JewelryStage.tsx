'use client';

import { Suspense, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { useReducedMotion } from 'motion/react';
import * as THREE from 'three';
import { StageSkeleton } from '@/components/v3/StageSkeleton';

const STEEL = {
  color: '#d7d7dc',
  metalness: 1,
  roughness: 0.24,
  envMapIntensity: 1.6,
};

function Steel({ roughness }: { roughness?: number }) {
  return <meshStandardMaterial {...STEEL} roughness={roughness ?? STEEL.roughness} />;
}

function Pearl() {
  return (
    <meshPhysicalMaterial
      color="#fffaf4"
      roughness={0.24}
      metalness={0.02}
      clearcoat={0.9}
      clearcoatRoughness={0.25}
      envMapIntensity={1.2}
      sheen={1}
      sheenColor="#fff6e8"
      sheenRoughness={0.4}
    />
  );
}

function EarringPearl() {
  return (
    <meshPhysicalMaterial
      color="#fffaf4"
      roughness={0.4}
      metalness={0.02}
      clearcoat={0.35}
      clearcoatRoughness={0.4}
      envMapIntensity={0.65}
      sheen={0.8}
      sheenColor="#fff1e2"
      sheenRoughness={0.5}
    />
  );
}

const CRESCENT_SHAPE = (() => {
  const outerRadius = 0.36;
  const innerRadius = 0.3;
  const offset = 0.14;
  const tipX = (outerRadius * outerRadius + offset * offset - innerRadius * innerRadius) / (2 * offset);
  const tipY = Math.sqrt(Math.max(0, outerRadius * outerRadius - tipX * tipX));
  const outerAngle = Math.atan2(tipY, tipX);
  const innerAngle = Math.atan2(tipY, tipX - offset);

  const shape = new THREE.Shape();
  shape.moveTo(tipX, tipY);
  shape.absarc(0, 0, outerRadius, outerAngle, -outerAngle, false);
  shape.absarc(offset, 0, innerRadius, -innerAngle, innerAngle, true);
  shape.closePath();
  return shape;
})();

const CRESCENT_EXTRUDE = {
  depth: 0.055,
  bevelEnabled: true,
  bevelSize: 0.01,
  bevelThickness: 0.01,
  bevelSegments: 4,
  curveSegments: 40,
};

export function Chain({ count = 88 }: { count?: number }) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-1.55, 1.5, 0),
        new THREE.Vector3(-1.46, 0.55, 0.02),
        new THREE.Vector3(-1.02, -0.42, 0.04),
        new THREE.Vector3(0, -1.02, 0.06),
        new THREE.Vector3(1.02, -0.42, 0.04),
        new THREE.Vector3(1.46, 0.55, 0.02),
        new THREE.Vector3(1.55, 1.5, 0),
      ]),
    [],
  );

  const links = useMemo(() => {
    const zAxis = new THREE.Vector3(0, 0, 1);
    const result: { position: THREE.Vector3; quaternion: THREE.Quaternion }[] = [];
    for (let i = 0; i < count; i += 1) {
      const t = (i + 0.5) / count;
      const position = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const side = new THREE.Vector3().crossVectors(tangent, zAxis).normalize();
      const quaternion = new THREE.Quaternion().setFromUnitVectors(zAxis, side);
      if (i % 2 === 1) {
        quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(tangent, Math.PI / 2));
      }
      result.push({ position, quaternion });
    }
    return result;
  }, [count, curve]);

  return (
    <group>
      {links.map((link, index) => (
        <mesh key={index} position={link.position} quaternion={link.quaternion} castShadow receiveShadow>
          <torusGeometry args={[0.044, 0.009, 6, 16]} />
          <Steel />
        </mesh>
      ))}

      <mesh position={[0, -1.02, 0.06]} castShadow receiveShadow>
        <torusGeometry args={[0.05, 0.011, 6, 18]} />
        <Steel />
      </mesh>
      <mesh position={[0.06, -1.42, 0.08]} castShadow receiveShadow>
        <extrudeGeometry args={[CRESCENT_SHAPE, CRESCENT_EXTRUDE]} />
        <meshStandardMaterial
          color="#d7d7dc"
          metalness={0.9}
          roughness={0.22}
          envMapIntensity={2.2}
          emissive="#26262c"
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
        />
      </mesh>
      <pointLight position={[0.1, -1.3, 1.1]} intensity={0.7} distance={1.8} color="#ffffff" />
    </group>
  );
}

export function Bracelet() {
  return (
    <group position={[-2.05, -0.95, 0.25]} rotation={[0.55, 0.35, 0.2]} scale={0.92}>
      <mesh rotation={[0.06, 0.28, 0.12]} castShadow receiveShadow>
        <torusGeometry args={[0.79, 0.03, 10, 64]} />
        <Steel roughness={0.18} />
      </mesh>
      <mesh position={[0.02, 0.015, 0.02]} rotation={[-0.08, -0.18, -0.18]} castShadow receiveShadow>
        <torusGeometry args={[0.77, 0.028, 10, 64]} />
        <Steel roughness={0.18} />
      </mesh>
    </group>
  );
}

export function Earring({ x, rotation = 0 }: { x: number; rotation?: number }) {
  return (
    <group position={[x, 0.95, 0.2]} rotation={[0.1, 0.2, rotation]}>
      <mesh castShadow receiveShadow>
        <torusGeometry args={[0.15, 0.017, 8, 28, Math.PI * 1.55]} />
        <Steel />
      </mesh>
      <mesh position={[0.012, -0.2, 0]} rotation={[0, 0, -0.08]} castShadow receiveShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.14, 8]} />
        <Steel />
      </mesh>
      <mesh position={[0, -0.26, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.04, 14, 14]} />
        <Steel />
      </mesh>
      <mesh position={[0, -0.275, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <torusGeometry args={[0.045, 0.01, 8, 18]} />
        <meshStandardMaterial color="#7a7a82" metalness={0.2} roughness={0.7} />
      </mesh>
      <mesh position={[0, -0.44, 0]} scale={[1, 1.25, 1]} castShadow receiveShadow>
        <sphereGeometry args={[0.15, 24, 24]} />
        <EarringPearl />
      </mesh>
    </group>
  );
}

export function Ring() {
  return (
    <group position={[1.15, -1.55, 0.7]} rotation={[1.12, 0.1, 0.18]} scale={0.92}>
      <mesh castShadow>
        <torusGeometry args={[0.32, 0.04, 12, 56]} />
        <meshStandardMaterial
          color="#dedee3"
          metalness={0.9}
          roughness={0.28}
          envMapIntensity={1.8}
          emissive="#1c1c20"
          emissiveIntensity={0.08}
        />
      </mesh>
      <mesh position={[0, 0.335, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.035, 0.05, 0.035, 16]} />
        <Steel roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.325, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <torusGeometry args={[0.048, 0.007, 8, 20]} />
        <Steel roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.44, 0]} scale={[1, 1.35, 1]} castShadow receiveShadow>
        <sphereGeometry args={[0.08, 32, 32]} />
        <Pearl />
      </mesh>
      <pointLight position={[0, 0.7, 0.6]} intensity={0.35} distance={1.1} color="#fff4e6" />
    </group>
  );
}

function Scene({ reduce, ready }: { reduce: boolean; ready: boolean }) {
  const group = useRef<THREE.Group>(null);
  const intro = useRef(0);
  const { size } = useThree();
  const scale = size.width < 480 ? 0.78 : 1;

  useFrame((state, delta) => {
    if (!group.current) return;

    if (reduce) {
      intro.current = 1;
    } else if (ready) {
      intro.current = Math.min(1, intro.current + delta / 0.9);
    }

    const ease = 1 - Math.pow(1 - intro.current, 3);
    const targetY = reduce ? 0 : state.pointer.x * 0.26;
    const targetX = reduce ? 0 : -state.pointer.y * 0.13;

    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, delta);
    group.current.rotation.z = reduce ? 0 : Math.sin(state.clock.elapsedTime * 0.25) * 0.018;
    group.current.scale.setScalar(scale * (0.94 + 0.06 * ease));
    group.current.position.y =
      (reduce ? 0 : Math.sin(state.clock.elapsedTime * 0.6) * 0.035) + (1 - ease) * -0.1;
  });

  return (
    <group ref={group} scale={scale * 0.94}>
      <Chain />
      <Bracelet />
      <Earring x={1.95} rotation={0.08} />
      <Earring x={2.38} rotation={-0.06} />
      <Ring />
    </group>
  );
}

export function JewelryStage() {
  const reduce = useReducedMotion() ?? false;
  const [ready, setReady] = useState(false);

  return (
    <div className="v3-hero-art v3-hero-3d" data-hero="true">
      <Canvas
        shadows
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 12], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
        onCreated={() => setReady(true)}
      >
        <ambientLight intensity={0.36} />
        <directionalLight
          position={[3, 4, 5]}
          intensity={2.2}
          color="#fff5ea"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-camera-left={-4}
          shadow-camera-right={4}
          shadow-camera-top={4}
          shadow-camera-bottom={-4}
          shadow-camera-near={0.5}
          shadow-camera-far={20}
          shadow-bias={-0.0004}
          shadow-normalBias={0.02}
        />
        <directionalLight position={[-4, 2, -2]} intensity={1.3} color="#e6ad8b" />
        <directionalLight position={[0, 2, 8]} intensity={0.32} color="#ffffff" />
        <pointLight position={[2.2, 1.9, 1.5]} intensity={0.55} distance={2.5} color="#fff6e6" />
        <pointLight position={[0, -3, 3]} intensity={0.5} color="#ffffff" />

        <Suspense fallback={null}>
          <Environment resolution={64} frames={1}>
            <Lightformer intensity={2.4} position={[0, 4, 4]} scale={[8, 4, 1]} color="#ffffff" />
            <Lightformer intensity={1.6} position={[-4, 1, 3]} scale={[3, 6, 1]} color="#ffd9c4" />
            <Lightformer intensity={1.3} position={[4, 0, 2]} scale={[3, 6, 1]} color="#cfd9ff" />
            <Lightformer intensity={1.1} position={[0, -3, 2]} scale={[6, 3, 1]} color="#fff2e3" />
          </Environment>
        </Suspense>

        <Scene reduce={reduce} ready={ready} />

        <ContactShadows position={[0, -2.05, 0]} opacity={0.18} scale={3.2} blur={2.4} far={4} color="#3a1b24" />
      </Canvas>
      <StageSkeleton ready={ready} />
    </div>
  );
}
