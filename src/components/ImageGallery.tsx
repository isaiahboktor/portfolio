import { useState } from "react";

type Img = { src: string; alt: string };

export default function ImageGallery({ images }: { images: Img[] }) {
  const [active, setActive] = useState(0);
  const main = images[active];

  if (!images || images.length === 0) return null;

  return (
    <div className="rounded-2xl border border-white/5 bg-white/5 shadow-glow p-4">
      <div className="font-display text-lg tracking-tight">Gallery</div>

      {/* Main image */}
      <div className="mt-3 overflow-hidden rounded-2xl border border-white/5 bg-black/30">
        <img
          src={main.src}
          alt={main.alt}
          className="w-full h-[420px] md:h-[520px] object-cover"
          loading="lazy"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {images.map((img, i) => (
            <button
              key={img.src}
              onClick={() => setActive(i)}
              className={`overflow-hidden rounded-xl border transition ${
                i === active
                  ? "border-teal-300/60 bg-white/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
              aria-label={`View image ${i + 1}`}
              type="button"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-20 object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
