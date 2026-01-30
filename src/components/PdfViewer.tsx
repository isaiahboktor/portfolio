import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PdfViewer({ url }: { url: string }) {
  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 shadow-glow p-3">
      <Document
        file={url}
        loading={<div className="text-zinc-300 p-4">Loading PDF…</div>}
        error={<div className="text-red-300 p-4">Failed to load PDF.</div>}
      >
        <Page pageNumber={1} renderTextLayer={false} />
      </Document>

      <div className="mt-3 flex gap-2">
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm"
        >
          Open PDF
        </a>
        <a
          href={url}
          download
          className="px-3 py-2 rounded-xl bg-gradient-to-br from-indigo-500 to-teal-400 text-zinc-950 font-semibold text-sm"
        >
          Download
        </a>
      </div>
    </div>
  );
}
