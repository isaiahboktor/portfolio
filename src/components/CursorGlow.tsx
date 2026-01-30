import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      el.style.setProperty("--x", `${e.clientX}px`);
      el.style.setProperty("--y", `${e.clientY}px`);
    };

    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[1]"
      style={{
        // subtle “aurora spotlight” + softer outer glow
        background:
          "radial-gradient(600px circle at var(--x) var(--y), rgba(94,234,212,0.14), transparent 55%), radial-gradient(900px circle at var(--x) var(--y), rgba(99,102,241,0.08), transparent 60%)"
      }}
    />
  );
}
