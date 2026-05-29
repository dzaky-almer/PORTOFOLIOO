'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const skills = [
  { num: '01', name: 'HTML & CSS', level: 90 },
  { num: '02', name: 'JavaScript', level: 75 },
  { num: '03', name: 'React', level: 65 },
  { num: '04', name: 'Next.js', level: 55 },
  { num: '05', name: 'Git & GitHub', level: 70 },
  { num: '06', name: 'Tailwind CSS', level: 80 },
];

export default function Skills() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.skill-card', {
        y: 50,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 80%',
        },
      });

      gsap.from('.skill-fill', {
        width: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.skills-grid',
          start: 'top 70%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="skills"
      className="relative z-10 min-h-screen flex items-center px-8 md:px-16 py-24"
    >
      <div className="w-full max-w-6xl mx-auto">
        <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-12">
          — Skills
        </p>

        <div className="skills-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-white/8">
          {skills.map((skill) => (
            <div
              key={skill.num}
              className="skill-card bg-black p-8 flex flex-col gap-4 group hover:bg-white/5 transition-colors duration-300 relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/25">
                {skill.num}
              </p>
              <p className="heading-md text-white">{skill.name}</p>
              <div className="h-[1px] bg-white/10 relative">
                <div
                  className="skill-fill absolute top-0 left-0 h-full bg-white"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
              <p className="text-[11px] text-white/30 tracking-widest">
                {skill.level}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}