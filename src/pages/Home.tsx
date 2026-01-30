import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import CursorGlow from "../components/CursorGlow";
import ScrollProgress from "../components/ScrollProgress";
import HeroScene from "../components/HeroScene";
import PopPortrait from "../components/PopPortrait";



const fadeUp = {
  hidden: { opacity: 0, y: 16, filter: "blur(8px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: 0.08 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  })
};


export default function Home() {

  // You can tune these numbers to match your story (or keep them aspirational but reasonable)
  const stats = [
  { k: "6+", v: "Engineering projects shipped", d: "Across simulation, CAD/DFM, robotics, experiments, and research" },
  { k: "3", v: "Interactive formats", d: "Web demos, 3D model viewers, and embedded media" },
  { k: "2", v: "Physical prototypes built", d: "Designed, fabricated, and tested with documented failure modes" },
  { k: "100+ hrs", v: "Design + build time", d: "Modeling, iteration, validation, and packaging into portfolio-ready deliverables" },
    ];


  return (
    <div className="relative overflow-hidden">
      <ScrollProgress />
      <CursorGlow />
      {/* Background: aurora + vignette + subtle grid */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[680px] w-[980px] -translate-x-1/2 rounded-full bg-teal-500/20 blur-[120px]" />
        <div className="absolute top-40 left-1/4 h-[520px] w-[720px] rounded-full bg-indigo-500/15 blur-[120px]" />
        <div className="absolute top-52 right-1/4 h-[520px] w-[720px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_55%)]" />
        <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black" />
      </div>

      <div className="absolute inset-0 -z-10">
        <HeroScene />
      </div>

      {/* Hero */}
<section className="relative max-w-6xl mx-auto px-5 pt-16 pb-10">
  <motion.div
    initial="hidden"
    animate="visible"
    className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
  >
    {/* LEFT: copy */}
    <div className="relative z-10">
      <motion.div
        custom={0}
        variants={fadeUp}
        className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-200"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-teal-300 shadow-[0_0_18px_rgba(94,234,212,0.6)]" />
        Mechanical Engineering • Simulation • CAD • Robotics • Research
      </motion.div>

      <motion.h1
        custom={1}
        variants={fadeUp}
        className="mt-5 font-display text-4xl md:text-6xl tracking-tight leading-[1.05]"
      >
        Building engineering systems that look{" "}
        <span className="text-white/90">beautiful</span>{" "}
        and{" "}
        <span className="text-teal-200">work under constraints</span>.
      </motion.h1>

      <motion.p
        custom={2}
        variants={fadeUp}
        className="mt-5 text-zinc-300 text-base md:text-lg leading-relaxed max-w-2xl"
      >
        I start with first principles and end with something you can touch—an interactive demo,
        a build-ready model, a robot that runs, or a paper that holds up—measured and clearly defended.
      </motion.p>

      <motion.div custom={3} variants={fadeUp} className="mt-7 flex flex-wrap gap-3">
        <Link
          to="/projects"
          className="px-5 py-3 rounded-2xl bg-white text-black font-medium hover:opacity-90 transition"
        >
          View Projects
        </Link>
        <Link
          to="/resume"
          className="px-5 py-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition"
        >
          Resume
        </Link>
        <a
          href="#featured"
          className="px-5 py-3 rounded-2xl border border-white/10 bg-transparent hover:bg-white/5 transition text-zinc-200"
        >
          Explore Highlights ↓
        </a>
      </motion.div>
    </div>

    {/* RIGHT: portrait */}
    <motion.div
      custom={2}
      variants={fadeUp}
      className="relative z-10 flex justify-center lg:justify-end"
    >
      <PopPortrait src="/portraits/isaiah.png" alt="Isaiah portrait" />
    </motion.div>
  </motion.div>

  {/* Below-hero panels */}
  <motion.div
    initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
    transition={{ delay: 0.25, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch"
  >
    {/* Signature panel */}
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow">
      <div className="text-xs tracking-[0.25em] uppercase text-teal-200/90 font-semibold">
        Signature Stack
      </div>
      <div className="mt-3 space-y-2 text-zinc-200">
        <div className="flex items-center justify-between gap-3">
          <span className="text-zinc-300">Numerics + simulation</span>
          <span className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5">
            MATLAB • WebGL
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-zinc-300">CAD + DFM</span>
          <span className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5">
            SolidWorks • SLS
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-zinc-300">Robotics + mechanisms</span>
          <span className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5">
            Integration • Iteration
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-zinc-300">Experimental design</span>
          <span className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5">
            Parameter sweeps
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-zinc-300">Research synthesis</span>
          <span className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5">
            CNT/Graphene
          </span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="text-sm text-zinc-200 font-medium">Approach</div>
        <div className="mt-2 text-sm text-zinc-300 leading-relaxed">
          Define constraints → prototype early → measure honestly → iterate → ship clean.
        </div>
      </div>
    </div>

    {/* Metrics strip */}
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-glow">
      <div className="text-xs tracking-[0.25em] uppercase text-teal-200/90 font-semibold">
        Portfolio Snapshot
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {stats.map((s, i) => (
          <div key={i} className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="text-2xl font-display tracking-tight">{s.k}</div>
            <div className="mt-1 text-sm text-zinc-200 font-medium">{s.v}</div>
            <div className="mt-1 text-xs text-zinc-400 leading-relaxed">{s.d}</div>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
</section>


      {/* Closing CTA */}
      <section className="relative max-w-6xl mx-auto px-5 pb-20">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-7 md:p-10 shadow-glow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="text-teal-300/90 text-xs tracking-[0.25em] uppercase font-semibold">
                Let’s build something serious
              </div>
              <h3 className="mt-2 font-display text-2xl md:text-3xl tracking-tight">
                I’m ready for teams that move fast and validate harder.
              </h3>
              <p className="mt-3 text-zinc-300">
                If your team cares about proof, polish, and engineering judgment under constraints—this portfolio is built for you.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Link
                to="/resume"
                className="px-5 py-3 rounded-2xl bg-white text-black font-medium hover:opacity-90 transition"
              >
                Resume
              </Link>
              <Link
                to="/projects"
                className="px-5 py-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition"
              >
                Projects
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
