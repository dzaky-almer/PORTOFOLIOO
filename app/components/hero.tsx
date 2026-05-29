'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-line', {
        y: 120,
        opacity: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power4.out',
      });
      gsap.from('.hero-sub', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.6,
        ease: 'power3.out',
      });
      gsap.from('.hero-cta', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        delay: 0.9,
        ease: 'power3.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative z-10 min-h-screen flex flex-col justify-end pb-16 px-8 md:px-16"
    >
      <div className="overflow-hidden">
        <p className="hero-line text-xs tracking-[0.4em] uppercase text-white/40 mb-4">
          Student Developer — SMKN 1 Kota Bekasi
        </p>
      </div>

      <div className="overflow-hidden">
        <h1 className="hero-line heading-xl text-white">
          Your
        </h1>
      </div>
      <div className="overflow-hidden">
        <h1 className="hero-line heading-xl text-white">
          Name.
        </h1>
      </div>

      <div className="overflow-hidden mt-2">
        <p className="hero-line heading-md text-white/25">
          Aspiring Software Developer
        </p>
      </div>

      <div className="hero-sub flex items-center gap-6 mt-10">
        <button className="hero-cta flex items-center gap-3 bg-white text-black px-6 py-3 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-white/85 transition-all">
          View Projects ↗
        </button>
        <button className="hero-cta text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-all border border-white/20 px-6 py-3 hover:border-white/60">
          Contact Me
        </button>
      </div>

      <div className="absolute bottom-8 right-8 md:right-16 flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/25 rotate-90 origin-center translate-x-8">
          Scroll
        </span>
      </div>
    </section>
  );
}