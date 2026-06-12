'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingGeometry() {
  const torusRef = useRef<THREE.Mesh>(null);
  const icosaRef = useRef<THREE.Mesh>(null);
  const coneRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (torusRef.current) {
      torusRef.current.rotation.x = t * 0.15;
      torusRef.current.rotation.y = t * 0.2;
    }
    if (icosaRef.current) {
      icosaRef.current.rotation.x = t * 0.12;
      icosaRef.current.rotation.z = t * 0.18;
    }
    if (coneRef.current) {
      coneRef.current.rotation.y = t * 0.25;
      coneRef.current.rotation.x = Math.sin(t * 0.1) * 0.2;
    }
  }, 1); // 1 = use Timer instead of Clock

  return (
    <group>
      {/* Main torus — glass-like */}
      <Float speed={1.5} rotationIntensity={0.4} floatIntensity={1.2}>
        <mesh ref={torusRef} position={[-2.2, 0.8, 0]}>
          <torusKnotGeometry args={[0.8, 0.3, 128, 16]} />
          <MeshTransmissionMaterial
            backside
            backsideThickness={0.2}
            thickness={0.5}
            chromaticAberration={0.6}
            roughness={0.1}
            metalness={0.1}
            ior={1.5}
            color="#4f8cff"
          />
        </mesh>
      </Float>

      {/* Icosahedron — metallic */}
      <Float speed={2} rotationIntensity={0.6} floatIntensity={0.8}>
        <mesh ref={icosaRef} position={[2.5, -0.3, -0.5]}>
          <icosahedronGeometry args={[0.7, 0]} />
          <MeshDistortMaterial
            color="#10b981"
            roughness={0.2}
            metalness={0.8}
            distort={0.3}
            speed={1.5}
          />
        </mesh>
      </Float>

      {/* Cone — gradient */}
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={1}>
        <mesh ref={coneRef} position={[0, -0.5, -1.2]}>
          <coneGeometry args={[0.5, 0.9, 32]} />
          <meshStandardMaterial
            color="#f59e0b"
            roughness={0.3}
            metalness={0.4}
            emissive="#f59e0b"
            emissiveIntensity={0.1}
          />
        </mesh>
      </Float>

      {/* Small orbiting particles */}
      {Array.from({ length: 30 }).map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin((i / 30) * Math.PI * 2) * 3.5,
            Math.cos((i / 30) * Math.PI * 2) * 1.5,
            (Math.random() - 0.5) * 2,
          ]}
        >
          <sphereGeometry args={[0.03, 8, 8]} />
          <meshBasicMaterial color={i % 2 === 0 ? '#4f8cff' : '#10b981'} />
        </mesh>
      ))}
    </group>
  );
}

export default function Hero3D() {
  return (
    <div
      data-testid="hero-3d"
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <directionalLight position={[-5, -3, 2]} intensity={0.3} color="#4f8cff" />
        <pointLight position={[0, 2, 3]} intensity={0.4} color="#10b981" />
        <FloatingGeometry />
      </Canvas>
    </div>
  );
}
