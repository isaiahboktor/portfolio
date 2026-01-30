import { Link, useParams } from "react-router-dom";
import { projects } from "../data/projects";

import ThreeModel from "../components/ThreeModel";
import QuantumViewer from "../components/QuantumViewer";
import PdfEmbed from "../components/PdfEmbed";
import ImageGallery from "../components/ImageGallery";

export default function ProjectDetail() {
  const { id } = useParams();
  const p = projects.find((x) => x.id === id);

  if (!p) {
    return (
      <div className="max-w-6xl mx-auto px-5 py-10">
        <div className="text-zinc-300">Project not found.</div>
        <Link to="/projects" className="text-teal-300">
          Back to Projects →
        </Link>
      </div>
    );
  }

  const hasModel = Boolean(p.modelGlb);
  const hasImages = Boolean(p.images && p.images.length > 0);
  const hasVideo = Boolean(p.video);
  const hasIframe = Boolean(p.iframe);
  const hasInteractive = hasModel || hasIframe;

  const GalleryCard = hasImages ? <ImageGallery images={p.images!} /> : null;

  const VideoCard = hasVideo ? (
    <div className="rounded-2xl border border-white/5 bg-white/5 shadow-glow p-4">
      <div className="font-display text-lg tracking-tight">Video</div>
      <div className="mt-3 rounded-2xl overflow-hidden border border-white/5 bg-black/20">
        {p.video!.type === "file" ? (
          <video controls className="w-full h-auto bg-black">
            <source src={p.video!.src} />
          </video>
        ) : (
          <iframe
            className="w-full aspect-video"
            src={p.video!.src}
            title="Project video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </div>
  ) : null;

  const HighlightsCard = (
    <div className="rounded-2xl border border-white/5 bg-white/5 shadow-glow p-5 h-full">
      <div className="font-display text-lg tracking-tight">Highlights</div>
      <ul className="mt-3 space-y-2 text-zinc-300 list-disc pl-5">
        {p.highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </div>
  );



const InteractiveHero = hasInteractive ? (
  <div className="mt-8 rounded-2xl border border-white/5 bg-white/5 shadow-glow p-4">
    <div className="font-display text-lg tracking-tight">
      {hasIframe ? "Interactive Model" : "3D Model"}
    </div>

    <div className="mt-3 overflow-hidden rounded-2xl border border-white/5 bg-black/30">
      {hasIframe ? (
        <QuantumViewer src={p.iframe!.src} height={p.iframe!.height ?? 800} />
      ) : hasModel ? (
        <ThreeModel url={p.modelGlb!} />
      ) : null}
    </div>
  </div>
) : null;


  // --- Smart two-column fill logic ---
  // If there's an interactive hero, below it:
  // - Left: Video if exists else Gallery
  // - Right: Gallery (if left is video) + Highlights
  //
  // If there's NO interactive hero:
  // - Left: Gallery if exists else Video
  // - Right: Highlights + (Video if left was gallery and video exists) OR (Gallery if left was video and images exist)
  const leftPrimary = (() => {
    if (hasInteractive) return hasVideo ? "video" : "gallery";
    return hasImages ? "gallery" : "video";
  })();

  const LeftColumn = (
    <div className="space-y-5">
      {leftPrimary === "gallery" ? GalleryCard : VideoCard}
    </div>
  );

  const RightColumn = (
    <div className="space-y-5 h-full flex flex-col">
      {/* If left is video and gallery exists, put gallery on right above highlights */}
      {leftPrimary === "video" && hasImages ? <div>{GalleryCard}</div> : null}

      {/* If left is gallery and video exists (and no interactive), put video on right above highlights */}
      {!hasInteractive && leftPrimary === "gallery" && hasVideo ? (
        <div>{VideoCard}</div>
      ) : null}

      <div className="flex-1">{HighlightsCard}</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      {/* Header (button pinned top-right on desktop) */}
  <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start">
    <div>
      <div className="text-teal-300/90 text-xs tracking-[0.25em] uppercase font-semibold">
        {p.year} • {p.category}
      </div>

      <h1 className="mt-2 font-display text-3xl md:text-4xl tracking-tight">
        {p.title}
      </h1>

      <p className="mt-3 text-zinc-300 max-w-3xl">{p.tagline}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {p.tags.map((t) => (
          <span
            key={t}
            className="text-xs px-2 py-1 rounded-full border border-white/10 bg-white/5 text-zinc-300"
          >
            {t}
          </span>
        ))}
      </div>
    </div>

    <div className="lg:justify-self-end lg:sticky lg:top-6">
      <Link
        to="/projects"
        className="inline-flex px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm"
      >
        ← All Projects
      </Link>
    </div>
  </div>


      {/* HERO interactive if exists (prevents empty left space) */}
      {InteractiveHero}

      {/* Always render a 2-column section for the remaining content */}
      <div className={`${hasInteractive ? "mt-5" : "mt-8"} grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch`}>
        {LeftColumn}
        {RightColumn}
      </div>

      {/* FULL-WIDTH PDF */}
      {p.pdf ? (
        <div className="mt-8 rounded-2xl border border-white/5 bg-white/5 shadow-glow p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="font-display text-lg tracking-tight">Project PDF</div>
            <a
              href={p.pdf}
              target="_blank"
              rel="noreferrer"
              className="text-sm px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10"
            >
              Open in new tab →
            </a>
          </div>

          <PdfEmbed src={p.pdf} title={`${p.title} PDF`} />
        </div>
      ) : null}
    </div>
  );
}
