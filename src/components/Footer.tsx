export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-10">
      <div className="max-w-6xl mx-auto px-5 py-8 text-sm text-zinc-400 flex flex-wrap gap-3 justify-between">
        <span>© {new Date().getFullYear()} Isaiah Boktor</span>
        <span className="text-zinc-500">Vite • React • Three.js</span>
      </div>
    </footer>
  );
}
