type Props = {
  src: string;           // e.g. "/pdfs/Quantum.pdf"
  title: string;
};

export default function PdfEmbed({ src, title }: Props) {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-black/40 overflow-hidden">
      {/* IMPORTANT: give it a real height */}
      <iframe
        title={title}
        src={src}
        className="w-full h-[85vh] block"
        style={{ border: 0 }}
      />
    </div>
  );
}
