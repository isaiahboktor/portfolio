import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

type Props = {
  framesPath: string;   // points to tdse_default_f32.bin
  frameCount: number;   // e.g., 600
  height?: number;      // px
};

const N = 50; // Nx=Ny=Nz=50 in your MATLAB export
const PER_SLICE = N * N; // 2500
const SLICES_PER_FRAME = 6;
const FLOATS_PER_FRAME = PER_SLICE * SLICES_PER_FRAME;

function linspace(a: number, b: number, n: number) {
  const out = new Float32Array(n);
  const step = (b - a) / (n - 1);
  for (let i = 0; i < n; i++) out[i] = a + i * step;
  return out;
}

// quick "hot-ish" colormap approximation
function hotColor(t: number) {
  const x = Math.max(0, Math.min(1, t));
  const r = Math.min(1, 3 * x);
  const g = Math.min(1, Math.max(0, 3 * x - 1));
  const b = Math.min(1, Math.max(0, 3 * x - 2));
  return [r, g, b];
}

/**
 * Builds a grid geometry where vertices are ordered in MATLAB column-major:
 * for c in [0..cols-1], for r in [0..rows-1].
 */
function buildGridGeometry(
  rows: number,
  cols: number,
  xyAt: (r: number, c: number) => [number, number]
) {
  const verts = rows * cols;
  const positions = new Float32Array(verts * 3);
  const colors = new Float32Array(verts * 3);

  let k = 0;
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const [x, y] = xyAt(r, c);
      positions[k * 3 + 0] = x;
      positions[k * 3 + 1] = y;
      positions[k * 3 + 2] = 0;

      colors[k * 3 + 0] = 0;
      colors[k * 3 + 1] = 0;
      colors[k * 3 + 2] = 0;

      k++;
    }
  }

  // indices (two triangles per cell), matching same (r,c) layout
  const indices: number[] = [];
  const idx = (r: number, c: number) => c * rows + r;

  for (let c = 0; c < cols - 1; c++) {
    for (let r = 0; r < rows - 1; r++) {
      const a = idx(r, c);
      const b = idx(r + 1, c);
      const d = idx(r, c + 1);
      const e = idx(r + 1, c + 1);

      indices.push(a, b, d);
      indices.push(b, e, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

function SliceSurfaces({
  data,
  frame,
  threshold,
  heightScale
}: {
  data: Float32Array;
  frame: number;
  threshold: number;
  heightScale: number;
}) {
  const x = useMemo(() => linspace(-5, 5, N), []);
  const y = useMemo(() => linspace(-5, 5, N), []);
  const z = useMemo(() => linspace(-5, 5, N), []);

  // three slice grids, same sizes in this dataset (50x50)
  const geoX = useMemo(
    () => buildGridGeometry(N, N, (r, c) => [y[c], z[r]]), // (Y,Z) -> (x,y)
    [y, z]
  );
  const geoY = useMemo(
    () => buildGridGeometry(N, N, (r, c) => [x[c], z[r]]), // (X,Z)
    [x, z]
  );
  const geoZ = useMemo(
    () => buildGridGeometry(N, N, (r, c) => [x[c], y[r]]), // (X,Y)
    [x, y]
  );

  const refX = useRef<THREE.BufferGeometry>(null);
  const refY = useRef<THREE.BufferGeometry>(null);
  const refZ = useRef<THREE.BufferGeometry>(null);
  const refGX = useRef<THREE.BufferGeometry>(null);
  const refGY = useRef<THREE.BufferGeometry>(null);
  const refGZ = useRef<THREE.BufferGeometry>(null);

  const frameOffset = frame * FLOATS_PER_FRAME;

  // Update function: write Z (height) + colors
  function applyToGeometry(
    geo: THREE.BufferGeometry,
    sliceOffsetFloats: number,
    useHot: boolean,
    zEps: number
  ) {
    const pos = geo.getAttribute("position") as THREE.BufferAttribute;
    const col = geo.getAttribute("color") as THREE.BufferAttribute;

    // compute max for colormap normalization (per slice, per frame)
    let maxV = 1e-12;
    for (let i = 0; i < PER_SLICE; i++) {
      const v = data[frameOffset + sliceOffsetFloats + i];
      if (v > maxV) maxV = v;
    }

    for (let i = 0; i < PER_SLICE; i++) {
      const v = data[frameOffset + sliceOffsetFloats + i];
      const vv = v >= threshold ? v : 0;

      pos.setZ(i, vv * heightScale + zEps);

      if (useHot) {
        const t = vv / maxV;
        const [r, g, b] = hotColor(t);
        col.setXYZ(i, r, g, b);
      }
    }

    pos.needsUpdate = true;
    col.needsUpdate = true;
    geo.computeVertexNormals();
  }

  useEffect(() => {
    if (!refX.current || !refY.current || !refZ.current) return;
    if (!refGX.current || !refGY.current || !refGZ.current) return;

    // main slices: hot colormap
    applyToGeometry(refX.current, 0 * PER_SLICE, true, 0.0);
    applyToGeometry(refY.current, 1 * PER_SLICE, true, 0.0);
    applyToGeometry(refZ.current, 2 * PER_SLICE, true, 0.0);

    // ghost: cyan overlay, no hot colormap (just height)
    applyToGeometry(refGX.current, 3 * PER_SLICE, false, 0.0005);
    applyToGeometry(refGY.current, 4 * PER_SLICE, false, 0.0005);
    applyToGeometry(refGZ.current, 5 * PER_SLICE, false, 0.0005);
  }, [data, frame, threshold, heightScale]);

  return (
    <group>
      {/* Ground plane (cyan like MATLAB screenshot) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -0.001]}>
        <planeGeometry args={[12, 12, 1, 1]} />
        <meshStandardMaterial color="#00ffff" transparent opacity={0.25} />
      </mesh>

      {/* Main slices */}
      <mesh geometry={geoX}>
        <primitive object={geoX} ref={refX as any} />
        <meshStandardMaterial vertexColors transparent opacity={0.85} />
      </mesh>

      <mesh geometry={geoY}>
        <primitive object={geoY} ref={refY as any} />
        <meshStandardMaterial vertexColors transparent opacity={0.85} />
      </mesh>

      <mesh geometry={geoZ}>
        <primitive object={geoZ} ref={refZ as any} />
        <meshStandardMaterial vertexColors transparent opacity={0.85} />
      </mesh>

      {/* Ghost overlays */}
      <mesh geometry={geoX}>
        <primitive object={geoX.clone()} ref={refGX as any} />
        <meshStandardMaterial color="#00ffff" transparent opacity={0.35} />
      </mesh>

      <mesh geometry={geoY}>
        <primitive object={geoY.clone()} ref={refGY as any} />
        <meshStandardMaterial color="#00ffff" transparent opacity={0.35} />
      </mesh>

      <mesh geometry={geoZ}>
        <primitive object={geoZ.clone()} ref={refGZ as any} />
        <meshStandardMaterial color="#00ffff" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

export default function QuantumViewer({ framesPath, frameCount, height = 800 }: Props) {
  const [buf, setBuf] = useState<Float32Array | null>(null);
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [threshold, setThreshold] = useState(0);
  const [heightScale, setHeightScale] = useState(900); // tune to match your MATLAB visual scale

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(framesPath, { cache: "force-cache" });
      if (!res.ok) throw new Error(`Failed to fetch dataset: ${res.status}`);
      const ab = await res.arrayBuffer();
      if (cancelled) return;

      const f32 = new Float32Array(ab);

      // sanity: dataset should contain frameCount frames
      const expected = frameCount * FLOATS_PER_FRAME;
      if (f32.length < expected) {
        console.warn("Dataset shorter than expected.", { got: f32.length, expected });
      }

      setBuf(f32);
    })().catch((e) => {
      console.error(e);
      setBuf(null);
    });

    return () => {
      cancelled = true;
    };
  }, [framesPath, frameCount]);

  // simple play loop
  useEffect(() => {
    if (!playing) return;
    const id = window.setInterval(() => {
      setFrame((f) => (f + 1) % frameCount);
    }, 60);
    return () => window.clearInterval(id);
  }, [playing, frameCount]);

  return (
    <div className="w-full">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 p-3">
        <button
          onClick={() => setPlaying((p) => !p)}
          className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/10"
        >
          {playing ? "Pause" : "Play"}
        </button>

        <div className="text-sm text-zinc-300">
          Frame {frame + 1} / {frameCount}
        </div>

        <input
          type="range"
          min={0}
          max={frameCount - 1}
          value={frame}
          onChange={(e) => setFrame(Number(e.target.value))}
          className="flex-1 min-w-[240px]"
        />

        <div className="flex items-center gap-2 text-sm text-zinc-300">
          Threshold
          <input
            type="range"
            min={0}
            max={0.003}
            step={0.00001}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-300">
          Height
          <input
            type="range"
            min={200}
            max={2000}
            step={10}
            value={heightScale}
            onChange={(e) => setHeightScale(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="w-full rounded-2xl overflow-hidden border border-white/5 bg-black/30" style={{ height }}>
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [8, 6, 8], fov: 42, near: 0.01, far: 500 }}
        >
          <color attach="background" args={["#000000"]} />
          <ambientLight intensity={0.75} />
          <directionalLight position={[8, 10, 8]} intensity={1.2} />

          {buf ? (
            <SliceSurfaces data={buf} frame={frame} threshold={threshold} heightScale={heightScale} />
          ) : null}

          <OrbitControls enableDamping dampingFactor={0.08} rotateSpeed={0.7} />
        </Canvas>
      </div>
    </div>
  );
}
