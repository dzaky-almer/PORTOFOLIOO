'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-left', {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-left',
          start: 'top 80%',
        },
      });
      gsap.from('.about-right', {
        x: 60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.about-right',
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative z-10 min-h-screen flex items-center px-8 md:px-16 py-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 w-full max-w-6xl mx-auto">
        <div className="about-left flex flex-col gap-6">
          <p className="text-[10px] tracking-[0.4em] uppercase text-white/30">
            — About
          </p>
          <h2 className="heading-lg text-white">
            Curious<br />Mind,<br />Clean<br />Code.
          </h2>
          <p className="text-sm leading-relaxed text-white/50">
            A dedicated student developer passionate about crafting digital experiences.
            Currently learning and building at SMKN 1 Kota Bekasi, focused on web
            technologies and software engineering.
          </p>
          <p className="text-sm leading-relaxed text-white/50">
            Every project is an opportunity to grow, learn, and push the boundaries
            of what I know.
          </p>
        </div>

        <div className="about-right flex flex-col gap-4">
          {[
            { num: '3+', label: 'Years learning to code' },
            { num: '10+', label: 'Projects completed' },
            { num: '∞', label: 'Lines of code written' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="border border-white/10 p-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-[3px] h-0 bg-white group-hover:h-full transition-all duration-500" />
              <p className="heading-md text-white">{stat.num}</p>
              <p className="text-[11px] tracking-[0.2em] uppercase text-white/40 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}