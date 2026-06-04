'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.nav-item', {
        y: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
      });
    }, navRef);

    return () => ctx.revert();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      ref={navRef}
      className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-white/8 bg-black/40 px-8 py-5 backdrop-blur-md md:px-16"
    >
      <div className="nav-item text-[13px] font-semibold uppercase tracking-[0.22em] text-white">
        Dev.Portfolio
      </div>

      <div className="flex gap-8">
        {['about', 'skills', 'projects', 'contact'].map((item) => (
          <button
            key={item}
            onClick={() => scrollTo(item)}
            className="nav-item text-xs font-medium uppercase tracking-[0.16em] text-white/45 transition-colors duration-300 hover:text-white"
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
}
