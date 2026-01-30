import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const base = "px-3 py-2 rounded-xl text-sm font-medium transition";
const inactive = "text-zinc-300/80 hover:text-zinc-50 hover:bg-white/5";
const active = "text-zinc-50 bg-white/10 shadow-glow";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-zinc-950/60 border-b border-white/5">
      <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-400 to-teal-300" />
          <div className="leading-tight">
            <div className="font-display font-semibold tracking-tight">
              Isaiah Boktor
            </div>
            <div className="text-xs text-zinc-400">Engineering Portfolio</div>
          </div>
        </NavLink>

        <nav className="flex items-center gap-1">
          <NavLink
            to="/projects"
            className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
          >
            Projects
          </NavLink>
          <NavLink
            to="/resume"
            className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
          >
            Resume
          </NavLink>

          <motion.a
            whileHover={{ y: -1 }}
            whileTap={{ y: 0 }}
            href="mailto:isaiahboktor@gmail.com"
            className="ml-2 px-3 py-2 rounded-xl text-sm font-semibold bg-gradient-to-br from-indigo-500 to-teal-400 text-zinc-950"
          >
            Contact
          </motion.a>
        </nav>
      </div>
    </header>
  );
}
