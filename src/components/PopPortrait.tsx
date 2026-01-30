import { useRef } from "react";
import { motion } from "framer-motion";

type Props = {
  src: string;
  alt: string;
};

export default function PopPortrait({ src, alt }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);

  function onMove(e: React.MouseEvent) {
    const el = wrapRef.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height; // 0..1

    const rotY = (px - 0.5) * 14;
    const rotX = (0.5 - py) * 10;

    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.setProperty("--rx", `${rotX}deg`);
    el.style.setProperty("--ry", `${rotY}deg`);
  }

  function onLeave() {
    const el = wrapRef.current;
    if (!el) return;
    el.style.setProperty("--rx", `0deg`);
    el.style.setProperty("--ry", `0deg`);
    el.style.setProperty("--mx", `50%`);
    el.style.setProperty("--my", `35%`);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full max-w-[520px] ml-auto"
    >
      {/* Floating “object” wrapper (no box) */}
      <div
        ref={wrapRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative"
        style={{
          // @ts-ignore
          ["--rx"]: "0deg",
          // @ts-ignore
          ["--ry"]: "0deg",
          // @ts-ignore
          ["--mx"]: "50%",
          // @ts-ignore
          ["--my"]: "35%",
          transformStyle: "preserve-3d",
          transform: "perspective(1100px) rotateX(var(--rx)) rotateY(var(--ry))",
          willChange: "transform",
        }}
      >
        {/* Ambient glow behind the cutout */}
        <div className="pointer-events-none absolute -inset-10 -z-10">
          <div className="absolute inset-0 rounded-full bg-teal-500/15 blur-3xl" />
          <div className="absolute -inset-10 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>

        {/* Moving highlight/glare (subtle) */}
        <div
          className="pointer-events-none absolute -inset-6 -z-10 opacity-70"
          style={{
            background:
              "radial-gradient(520px circle at var(--mx) var(--my), rgba(255,255,255,0.10), transparent 55%)",
            filter: "blur(6px)",
          }}
        />

        {/* The portrait itself (frameless) */}
        <img
          src={src}
          alt={alt}
          className="block w-full h-auto select-none"
          draggable={false}
          style={{
            transformStyle: "preserve-3d",
            transform: "translateZ(70px) scale(1.02)",
            filter:
              "drop-shadow(0 44px 70px rgba(0,0,0,0.70)) drop-shadow(0 0 50px rgba(94,234,212,0.14))",
          }}
        />

        {/* Optional tiny nameplate (not a box) */}
        <div
          className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-2 text-xs text-zinc-200"
          style={{ transform: "translateZ(40px)" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_18px_rgba(94,234,212,0.6)]" />
          Isaiah Boktor <span className="text-zinc-400">• ME • Simulation • CAD</span>
        </div>
      </div>
    </motion.div>
  );
}
