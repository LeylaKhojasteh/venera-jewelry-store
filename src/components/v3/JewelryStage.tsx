'use client';

import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import { useReducedMotion } from 'motion/react';
import * as THREE from 'three';

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

function Chain({ count = 88 }: { count?: number }) {
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
        <mesh key={index} position={link.position} quaternion={link.quaternion} castShadow>
          <torusGeometry args={[0.044, 0.009, 6, 16]} />
          <Steel />
        </mesh>
      ))}

      <mesh position={[0, -1.02, 0.06]} castShadow>
        <torusGeometry args={[0.05, 0.011, 6, 18]} />
        <Steel />
      </mesh>
      <mesh position={[0, -1.11, 0.07]} castShadow>
        <torusGeometry args={[0.028, 0.008, 6, 14]} />
        <Steel />
      </mesh>
      <mesh position={[-0.211, -1.45, 0.08]} castShadow>
        <extrudeGeometry args={[CRESCENT_SHAPE, CRESCENT_EXTRUDE]} />
        <Steel roughness={0.14} />
      </mesh>
      <mesh position={[0, -0.9, 0.06]} castShadow>
        <sphereGeometry args={[0.055, 18, 18]} />
        <meshStandardMaterial color="#c4714c" metalness={0.7} roughness={0.28} />
      </mesh>
    </group>
  );
}

function Bracelet() {
  return (
    <group position={[-2.05, -0.95, 0.25]} rotation={[0.55, 0.35, 0.2]} scale={0.92}>
      <mesh rotation={[0.08, 0.32, 0.14]} castShadow>
        <torusGeometry args={[0.8, 0.03, 10, 64]} />
        <Steel roughness={0.18} />
      </mesh>
      <mesh position={[0.05, 0.03, 0.05]} rotation={[-0.2, -0.28, -0.32]} castShadow>
        <torusGeometry args={[0.73, 0.028, 10, 64]} />
        <Steel roughness={0.18} />
      </mesh>
      <mesh position={[0.78, -0.02, 0]} castShadow>
        <sphereGeometry args={[0.06, 16, 16]} />
        <Steel />
      </mesh>
      <mesh position={[-0.74, 0.05, 0.05]} castShadow>
        <sphereGeometry args={[0.052, 16, 16]} />
        <Pearl />
      </mesh>
    </group>
  );
}

function Earring({ x, rotation = 0 }: { x: number; rotation?: number }) {
  return (
    <group position={[x, 0.95, 0.2]} rotation={[0.1, 0.2, rotation]}>
      <mesh castShadow>
        <torusGeometry args={[0.15, 0.017, 8, 28, Math.PI * 1.55]} />
        <Steel />
      </mesh>
      <mesh position={[0, -0.26, 0]} castShadow>
        <sphereGeometry args={[0.04, 14, 14]} />
        <Steel />
      </mesh>
      <mesh position={[0, -0.44, 0]} scale={[1, 1.25, 1]} castShadow>
        <sphereGeometry args={[0.15, 24, 24]} />
        <Pearl />
      </mesh>
    </group>
  );
}

function Ring() {
  return (
    <group position={[1.15, -1.55, 0.7]} rotation={[1.12, 0.1, 0.18]} scale={0.92}>
      <mesh castShadow>
        <torusGeometry args={[0.34, 0.05, 12, 56]} />
        <Steel roughness={0.16} />
      </mesh>
      <mesh position={[0, 0.32, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.1, 0.07, 18]} />
        <Steel roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.29, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.095, 0.014, 8, 22]} />
        <Steel roughness={0.18} />
      </mesh>
      <mesh position={[0, 0.52, 0]} scale={[1, 1.35, 1]} castShadow>
        <sphereGeometry args={[0.16, 32, 32]} />
        <Pearl />
      </mesh>
      <pointLight position={[0, 0.85, 0.7]} intensity={0.7} distance={1.4} color="#fff4e6" />
    </group>
  );
}

function Scene({ reduce }: { reduce: boolean }) {
  const group = useRef<THREE.Group>(null);
  const { size } = useThree();
  const scale = size.width < 480 ? 0.78 : 1;

  useFrame((state, delta) => {
    if (!group.current) return;
    const targetY = reduce ? 0 : state.pointer.x * 0.26;
    const targetX = reduce ? 0 : -state.pointer.y * 0.13;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, targetY, 4, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, targetX, 4, delta);
    group.current.rotation.z = reduce ? 0 : Math.sin(state.clock.elapsedTime * 0.25) * 0.018;
    group.current.position.y = reduce ? 0 : Math.sin(state.clock.elapsedTime * 0.6) * 0.035;
  });

  return (
    <group ref={group} scale={scale}>
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

  return (
    <div className="v3-hero-art v3-hero-3d" data-hero="true">
      <Canvas
        dpr={[1, 1.8]}
        camera={{ position: [0, 0, 12], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ width: '100%', height: '100%', touchAction: 'pan-y' }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={2.3} color="#fff5ea" />
        <directionalLight position={[-4, 2, -2]} intensity={1.5} color="#e6ad8b" />
        <pointLight position={[0, -3, 3]} intensity={0.7} color="#ffffff" />

        <Suspense fallback={null}>
          <Environment resolution={64} frames={1}>
            <Lightformer intensity={2.4} position={[0, 4, 4]} scale={[8, 4, 1]} color="#ffffff" />
            <Lightformer intensity={1.6} position={[-4, 1, 3]} scale={[3, 6, 1]} color="#ffd9c4" />
            <Lightformer intensity={1.3} position={[4, 0, 2]} scale={[3, 6, 1]} color="#cfd9ff" />
            <Lightformer intensity={1.1} position={[0, -3, 2]} scale={[6, 3, 1]} color="#fff2e3" />
          </Environment>
        </Suspense>

        <Scene reduce={reduce} />

        <ContactShadows position={[0, -2.05, 0]} opacity={0.24} scale={3.2} blur={2.4} far={4} color="#3a1b24" />
      </Canvas>
      <span className="v3-art-caption">استیل ۳۱۶ / طراحی تهران</span>
    </div>
  );
}
