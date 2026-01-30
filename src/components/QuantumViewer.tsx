import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

type Props = {
  framesPath: string;
  frameCount: number;
  height?: number; // px
};

const targetVec = useMemo(() => new THREE.Vector3(0, 0, 0), []);

// Must match export
const N = 50;
const PER_SLICE = N * N; // 2500
const FLOATS_PER_FRAME = PER_SLICE * 6;

function linspace(a: number, b: number, n: number) {
  const out = new Float32Array(n);
  const step = (b - a) / (n - 1);
  for (let i = 0; i < n; i++) out[i] = a + i * step;
  return out;
}

/**
 * MATLAB-like hot colormap, but we’ll apply gamma externally.
 */
function hotColor(t: number) {
  const x = Math.max(0, Math.min(1, t));
  const r = Math.min(1, 3 * x);
  const g = Math.min(1, Math.max(0, 3 * x - 1));
  const b = Math.min(1, Math.max(0, 3 * x - 2));
  return [r, g, b] as const;
}

function ZUp() {
  const { camera } = useThree();

  useEffect(() => {
    camera.up.set(0, 0, 1); // Z is up
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera]);

  return null;
}

/**
 * Builds a grid geometry where vertex order matches MATLAB column-major flattening:
 * for c: 0..cols-1, for r: 0..rows-1  => i = c*rows + r
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

type DisplayMode = "physical" | "enhanced";

function SliceSurfaces({
  data,
  frame,
  threshold,
  heightScale,
  gamma,
  mode,
  ghostOpacity,
}: {
  data: Float32Array;
  frame: number;
  threshold: number;
  heightScale: number; // scene units per density unit (linear)
  gamma: number; // color gamma
  mode: DisplayMode;
  ghostOpacity: number;
}) {
  // Must match export bounds (you used [-5..5] in TDSE.m)
  const x = useMemo(() => linspace(-5, 5, N), []);
  const y = useMemo(() => linspace(-5, 5, N), []);
  const z = useMemo(() => linspace(-5, 5, N), []);

  // Geometries match MATLAB surf domains:
  // Xslice: surf(Y,Z, dens(xSlice,:,:))  -> domain (Y,Z)
  // Yslice: surf(X,Z, dens(:,ySlice,:))  -> domain (X,Z)
  // Zslice: surf(X,Y, dens(:,:,zSlice))  -> domain (X,Y)
  const geoX = useMemo(() => buildGridGeometry(N, N, (r, c) => [y[c], z[r]]), [y, z]);
  const geoY = useMemo(() => buildGridGeometry(N, N, (r, c) => [x[c], z[r]]), [x, z]);
  const geoZ = useMemo(() => buildGridGeometry(N, N, (r, c) => [x[c], y[r]]), [x, y]);

  const refX = useRef<THREE.BufferGeometry>(null);
  const refY = useRef<THREE.BufferGeometry>(null);
  const refZ = useRef<THREE.BufferGeometry>(null);

  const refGX = useRef<THREE.BufferGeometry>(null);
  const refGY = useRef<THREE.BufferGeometry>(null);
  const refGZ = useRef<THREE.BufferGeometry>(null);

  const frameOffset = frame * FLOATS_PER_FRAME;

  /**
   * Stable normalization: normalize colors per-FRAME per-SLICE (like MATLAB autoscale),
   * but keep it smooth using a small epsilon and optional enhanced display mapping.
   * Physical mode: height = vv * heightScale
   * Enhanced mode: height = log10(vv/threshold+1) * heightScaleEnhanced
   */
  function applyToGeometry(
    geo: THREE.BufferGeometry,
    sliceOffsetFloats: number,
    paintHot: boolean,
    zEps: number,
    enhancedHeightBoost: number
  ) {
    const pos = geo.getAttribute("position") as THREE.BufferAttribute;
    const col = geo.getAttribute("color") as THREE.BufferAttribute;

    // Find max (for color normalization)
    let maxV = 1e-12;
    for (let i = 0; i < PER_SLICE; i++) {
      const v = data[frameOffset + sliceOffsetFloats + i];
      if (v > maxV) maxV = v;
    }

    const eps = 1e-12;
    for (let i = 0; i < PER_SLICE; i++) {
      const v = data[frameOffset + sliceOffsetFloats + i];
      const vv = v >= threshold ? v : 0;

      // Height mapping
      let h = 0;
      if (mode === "physical") {
        // physically faithful visualization: height ∝ |psi|^2
        h = vv * heightScale;
      } else {
        // enhanced visibility: log mapping relative to threshold (does not change the data, only display)
        // log10(1 + vv/threshold) gives nice shape without blowing up peaks
        const t = threshold > 0 ? vv / threshold : vv / (maxV + eps);
        h = Math.log10(1 + t) * enhancedHeightBoost;
      }

      pos.setZ(i, h + zEps);

      // Color mapping
      if (paintHot) {
        // Normalize + gamma to lift low-intensity structure
        const tRaw = vv / maxV;
        const t = Math.pow(tRaw, gamma);
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

    // Enhanced height boost is in "scene units" (since log is unitless)
    const enhancedBoost = Math.max(0.001, heightScale * 0.08);

    // Main slices (hot)
    applyToGeometry(refX.current, 0 * PER_SLICE, true, 0.0, enhancedBoost);
    applyToGeometry(refY.current, 1 * PER_SLICE, true, 0.0, enhancedBoost);
    applyToGeometry(refZ.current, 2 * PER_SLICE, true, 0.0, enhancedBoost);

    // Ghost overlays (cyan, height only)
    applyToGeometry(refGX.current, 3 * PER_SLICE, false, 0.0008, enhancedBoost);
    applyToGeometry(refGY.current, 4 * PER_SLICE, false, 0.0008, enhancedBoost);
    applyToGeometry(refGZ.current, 5 * PER_SLICE, false, 0.0008, enhancedBoost);
  }, [data, frame, threshold, heightScale, gamma, mode]);

  return (
    <group>
      {/* Ground plane (cyan slab like your MATLAB view) */}
      <mesh position={[0, 0, -0.002]}>
        <planeGeometry args={[12, 12, 1, 1]} />
        <meshStandardMaterial color="#00ffff" transparent opacity={0.18} />
      </mesh>

      {/* Main slices */}
      <mesh geometry={geoX}>
        <primitive object={geoX} ref={refX as any} />
        <meshStandardMaterial vertexColors transparent opacity={0.92} roughness={0.35} metalness={0.05} />
      </mesh>

      <mesh geometry={geoY}>
        <primitive object={geoY} ref={refY as any} />
        <meshStandardMaterial vertexColors transparent opacity={0.92} roughness={0.35} metalness={0.05} />
      </mesh>

      <mesh geometry={geoZ}>
        <primitive object={geoZ} ref={refZ as any} />
        <meshStandardMaterial vertexColors transparent opacity={0.92} roughness={0.35} metalness={0.05} />
      </mesh>

      {/* Ghost overlays: emissive cyan for “tunneling ghost” feel */}
      <mesh geometry={geoX}>
        <primitive object={geoX.clone()} ref={refGX as any} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1.0}
          transparent
          opacity={ghostOpacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh geometry={geoY}>
        <primitive object={geoY.clone()} ref={refGY as any} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1.0}
          transparent
          opacity={ghostOpacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <mesh geometry={geoZ}>
        <primitive object={geoZ.clone()} ref={refGZ as any} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1.0}
          transparent
          opacity={ghostOpacity}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default function QuantumViewer({ framesPath, frameCount, height = 800 }: Props) {
  const [buf, setBuf] = useState<Float32Array | null>(null);

  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(false);

  // Good defaults for your screenshot scale (~1e-3 peaks)
  const [threshold, setThreshold] = useState(3e-5);
  const [heightScale, setHeightScale] = useState(8000); // MUST allow >2000
  const [gamma, setGamma] = useState(0.35);

  const [ghostOpacity, setGhostOpacity] = useState(0.7);
  const [mode, setMode] = useState<DisplayMode>("physical");
  const [fps, setFps] = useState(30);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const res = await fetch(framesPath, { cache: "force-cache" });
      if (!res.ok) throw new Error(`Failed to fetch dataset: ${res.status}`);
      const ab = await res.arrayBuffer();
      if (cancelled) return;

      const f32 = new Float32Array(ab);

      // sanity
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

  useEffect(() => {
    if (!playing) return;
    const ms = Math.max(10, Math.round(1000 / fps));
    const id = window.setInterval(() => {
      setFrame((f) => (f + 1) % frameCount);
    }, ms);
    return () => window.clearInterval(id);
  }, [playing, frameCount, fps]);

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

        <button
          onClick={() => setFrame(0)}
          className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10"
        >
          Reset
        </button>

        <div className="text-sm text-zinc-300">
          Frame {frame + 1} / {frameCount}
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-300">
          Mode
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as DisplayMode)}
            className="px-2 py-1 rounded-lg bg-white/5 border border-white/10"
          >
            <option value="physical">Physical</option>
            <option value="enhanced">Enhanced</option>
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-300">
          FPS
          <input
            type="range"
            min={10}
            max={60}
            step={1}
            value={fps}
            onChange={(e) => setFps(Number(e.target.value))}
          />
          <span className="w-10 text-right">{fps}</span>
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
          Gamma
          <input
            type="range"
            min={0.15}
            max={1.2}
            step={0.01}
            value={gamma}
            onChange={(e) => setGamma(Number(e.target.value))}
          />
        </div>

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
            min={500}
            max={12000}
            step={50}
            value={heightScale}
            onChange={(e) => setHeightScale(Number(e.target.value))}
          />
        </div>

        <div className="flex items-center gap-2 text-sm text-zinc-300">
          Ghost
          <input
            type="range"
            min={0}
            max={0.9}
            step={0.01}
            value={ghostOpacity}
            onChange={(e) => setGhostOpacity(Number(e.target.value))}
          />
        </div>
      </div>

      <div className="w-full rounded-2xl overflow-hidden border border-white/5 bg-black/30" style={{ height }}>
        <Canvas
          dpr={[1, 2]}
          // for Z-up: give it a higher Z so you're clearly "above"
          camera={{ position: [8.5, -8.5, 8.5], fov: 42, near: 0.01, far: 500 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
          }}
          onCreated={({ gl, camera }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.15;
            gl.outputColorSpace = THREE.SRGBColorSpace;

            // also enforce Z-up here (safe even if ZUp runs)
            camera.up.set(0, 0, 1);
            camera.lookAt(0, 0, 0);
          }}
        >
          <ZUp />

          <color attach="background" args={["#05060a"]} />

          {/* Better depth & shape */}
          <hemisphereLight intensity={0.55} />
          <ambientLight intensity={0.22} />
          <directionalLight position={[10, 14, 10]} intensity={1.35} />
          <directionalLight position={[-8, 6, -10]} intensity={0.65} />

          {buf ? (
            <SliceSurfaces
              data={buf}
              frame={frame}
              threshold={threshold}
              heightScale={heightScale}
              gamma={gamma}
              mode={mode}
              ghostOpacity={ghostOpacity}
            />
          ) : null}

          <OrbitControls
            target={targetVec}
            enableDamping
            dampingFactor={0.08}
            rotateSpeed={0.7}
            minDistance={6}
            maxDistance={18}
            // prevent going "under" the plane (Z-up version)
            minPolarAngle={0.08}
            maxPolarAngle={Math.PI / 2 - 0.08}
          />
        </Canvas>
      </div>
    </div>
  );
}
