import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { Project } from "../data/projects";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
      className="rounded-2xl border border-white/5 bg-white/5 shadow-glow overflow-hidden"
    >
      <Link to={`/projects/${project.id}`} className="block p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-teal-300/90 font-semibold">
            {project.category}
          </div>
          <div className="text-xs text-zinc-400">{project.year}</div>
        </div>

        <div className="mt-2 font-display text-xl tracking-tight">
          {project.title}
        </div>

        <p className="mt-2 text-sm text-zinc-300">{project.tagline}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 5).map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300"
            >
              {t}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
