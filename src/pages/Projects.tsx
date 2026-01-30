import { useMemo, useState } from "react";
import { projects } from "../data/projects";
import ProjectCard from "../components/ProjectCard";

export default function Projects() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const categories = useMemo(() => {
    const s = new Set(projects.map((p) => p.category));
    return ["All", ...Array.from(s).sort()];
  }, []);

  const filtered = useMemo(() => {
    const query = q.toLowerCase().trim();
    return projects.filter((p) => {
      const inCat = cat === "All" || p.category === cat;
      const hay = (p.title + " " + p.tagline + " " + p.tags.join(" ")).toLowerCase();
      const inQ = !query || hay.includes(query);
      return inCat && inQ;
    });
  }, [q, cat]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Projects</h1>
        </div>

        <div className="flex flex-wrap gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search (MATLAB, DFM, pneumatics...)"
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 outline-none"
          />
          
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
