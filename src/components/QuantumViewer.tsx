export default function QuantumViewer({
  src,
  height = 800,
  title = "MATLAB Web App",
}: {
  src: string;
  height?: number;
  title?: string;
}) {
  if (!src) return null;

  return (
    <div className="w-full">
      <iframe
        src={src}
        title={title}
        className="w-full rounded-2xl border border-white/5 bg-black/20"
        style={{ height }}
        allow="fullscreen; clipboard-read; clipboard-write"
        allowFullScreen
      />
    </div>
  );
}
