import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BannerSlide } from "../../data/mock";

export function Carousel({
  slides, onCta,
}: {
  slides: BannerSlide[];
  onCta: (idx: number) => void;
}) {
  const [cur, setCur] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCur(c => (c + 1) % slides.length), [slides.length]);
  const prev = () => setCur(c => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, [paused, next]);

  return (
    <div
      className="relative rounded-2xl overflow-hidden group"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${cur * 100}%)` }}
      >
        {slides.map((s, i) => (
          <div key={i} className="min-w-full relative h-48 sm:h-64 md:h-80 lg:h-96">
            <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent flex flex-col justify-center px-6 sm:px-12">
              <h2 className="text-white text-xl sm:text-3xl font-bold mb-2 max-w-xl">{s.title}</h2>
              <p className="text-white/80 text-sm sm:text-base mb-4 max-w-lg">{s.subtitle}</p>
              <button
                onClick={() => onCta(s.ctaIdx)}
                className="self-start bg-[#1890ff] hover:bg-[#40a9ff] text-white px-5 py-2 rounded-full text-sm font-medium transition-colors"
              >
                {s.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 左右箭头 */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* 指示器 */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCur(i)}
            className={`h-1.5 rounded-full transition-all ${i === cur ? "bg-white w-6" : "bg-white/50 w-1.5"}`}
          />
        ))}
      </div>
    </div>
  );
}
