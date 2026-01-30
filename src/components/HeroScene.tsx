import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function Orb() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.18;
    ref.current.rotation.x += delta * 0.08;
  });

  return (
    <mesh ref={ref} position={[0.7, 0.05, 0]}>
      <icosahedronGeometry args={[1.2, 2]} />
      <meshStandardMaterial
        color="#9ca3af"
        metalness={0.65}
        roughness={0.25}
        emissive="#0f172a"
        emissiveIntensity={0.25}
        transparent
        opacity={0.18}
      />
    </mesh>
  );
}

export default function HeroScene() {
  return (
    <div className="pointer-events-none absolute inset-0 z-[0]">
      <Canvas
        camera={{ position: [0, 0, 4], fov: 45 }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 2, 2]} intensity={1.2} />
        <Orb />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
