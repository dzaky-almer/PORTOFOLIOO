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
      className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 md:px-16 py-5 border-b border-white/8 backdrop-blur-md bg-black/40"
    >
      <div className="nav-item text-xs tracking-[0.3em] uppercase text-white font-medium">
        Dev.Portfolio
      </div>

      <div className="flex gap-8">
        {['about', 'skills', 'projects', 'contact'].map((item) => (
          <button
            key={item}
            onClick={() => scrollTo(item)}
            className="nav-item text-[11px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-300"
          >
            {item}
          </button>
        ))}
      </div>
    </nav>
  );
}