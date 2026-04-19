import { useState, useEffect, useRef } from "react";
import { slides } from "./slides.js";

export default function ImageSlider() {
  const [curSlide, setCurSlide] = useState(0);
  const [taglineVisible, setTaglineVisible] = useState(true);
  const timerRef = useRef(null);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTaglineVisible(false);
      setTimeout(() => {
        setCurSlide((p) => (p + 1) % slides.length);
        setTaglineVisible(true);
      }, 500);
    }, 3800);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const goSlide = (idx) => {
    clearInterval(timerRef.current);
    setTaglineVisible(false);
    setTimeout(() => {
      setCurSlide(idx);
      setTaglineVisible(true);
      startTimer();
    }, 400);
  };

  return (
    <div className="hidden md:block w-1/2 relative overflow-hidden flex-shrink-0">
      {/* Slides */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-700"
          style={{
            backgroundImage: `url(${s.url})`,
            opacity: i === curSlide ? 1 : 0,
          }}
        />
      ))}

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />

      {/* Brand copy */}
      <div className="absolute bottom-10 left-10 right-10">
        <p className="text-[11px] font-bold tracking-[5px] text-[#FFD700] uppercase opacity-70 mb-3">
          Est. 2020
        </p>
        <h1 className="text-5xl font-extrabold text-white tracking-[8px] uppercase leading-none mb-4">
          Snitch
        </h1>
        <p
          className="text-[15px] font-light text-white/75 leading-relaxed max-w-[300px] mb-6 transition-all duration-500"
          style={{
            opacity: taglineVisible ? 1 : 0,
            transform: taglineVisible ? "translateY(0)" : "translateY(8px)",
          }}
        >
          {slides[curSlide].tagline}
        </p>

        {/* Dots */}
        <div className="flex gap-2 items-center">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goSlide(i)}
              className="h-[6px] rounded-[3px] transition-all duration-300 border-none cursor-pointer"
              style={{
                width: i === curSlide ? "24px" : "6px",
                background:
                  i === curSlide ? "#FFD700" : "rgba(255,255,255,0.28)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
