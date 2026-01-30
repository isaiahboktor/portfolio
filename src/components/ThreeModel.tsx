import { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html, useGLTF, Bounds } from "@react-three/drei";

function Loader() {
  return (
    <Html center>
      <div className="px-3 py-2 rounded-xl border border-white/10 bg-black/60 text-zinc-200 text-sm">
        Loading 3D model…
      </div>
    </Html>
  );
}

function CenteredModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const group = useRef<THREE.Group>(null);

  const cloned = useMemo(() => scene.clone(true), [scene]);

  useLayoutEffect(() => {
    if (!group.current) return;

    // Compute bounds
    const box = new THREE.Box3().setFromObject(group.current);
    const center = box.getCenter(new THREE.Vector3());

    // Center the model at origin
    group.current.position.x += -center.x;
    group.current.position.y += -center.y;
    group.current.position.z += -center.z;

    // Optional: sit on "ground"
    const box2 = new THREE.Box3().setFromObject(group.current);
    const minY = box2.min.y;
    group.current.position.y += -minY;
  }, [cloned]);

  return (
    <group ref={group}>
      <primitive object={cloned} />
    </group>
  );
}


export default function ThreeModel({ url }: { url: string }) {
  return (
    // IMPORTANT: give it a REAL height; h-full won’t work unless parents have height
    <div className="w-full h-[55vh] min-h-[420px]">
      <Canvas
        className="w-full h-full"
        dpr={[1, 2]}
        camera={{ fov: 42, near: 0.01, far: 5000 }}
      >
        <color attach="background" args={["#000000"]} />

        <ambientLight intensity={0.65} />
        <directionalLight position={[6, 6, 6]} intensity={1.2} />
        <directionalLight position={[-6, 2, -4]} intensity={0.35} />

        <Suspense fallback={<Loader />}>
          <Environment preset="city" />

          <Bounds fit clip observe margin={1.25}>
            <CenteredModel url={url} />
          </Bounds>
        </Suspense>

        <OrbitControls
          makeDefault
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.7}
        />
      </Canvas>
    </div>
  );
}

// Optional: helps Drei cache GLTFs efficiently
useGLTF.preload("/models/f35.glb");
useGLTF.preload("/models/me2110.glb");
