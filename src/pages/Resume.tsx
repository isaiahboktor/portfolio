import PdfEmbed from "../components/PdfEmbed";

export default function Resume() {
  const resumeUrl = "/pdfs/Resume.pdf";

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-teal-300/90 text-xs tracking-[0.25em] uppercase font-semibold">
            Resume
          </div>
          <h1 className="mt-2 font-display text-3xl md:text-4xl tracking-tight">
            Isaiah Boktor
          </h1>
          <p className="mt-3 text-zinc-300 max-w-2xl">
            Download or view my resume inline below.
          </p>
        </div>

        <a
          href={resumeUrl}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm"
        >
          Open in new tab →
        </a>
      </div>

      <div className="mt-8 rounded-2xl border border-white/5 bg-white/5 shadow-glow p-4">
        <PdfEmbed src={resumeUrl} title="Resume PDF" />
      </div>
    </div>
  );
}
