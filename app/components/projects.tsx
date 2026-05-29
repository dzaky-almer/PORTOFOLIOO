'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    num: '001',
    title: 'Project Alpha',
    desc: 'A full-stack web application built with Next.js and Tailwind CSS. Focused on clean UI and smooth user experience.',
    tags: ['Next.js', 'Tailwind', 'Vercel'],
    link: '#',
  },
  {
    num: '002',
    title: 'Project Beta',
    desc: 'Interactive dashboard with data visualization. Built to solve a real school problem using modern web technologies.',
    tags: ['React', 'JavaScript', 'CSS'],
    link: '#',
  },
  {
    num: '003',
    title: 'Project Gamma',
    desc: 'Landing page with modern animations and responsive design. Deployed on GitHub Pages for easy access.',
    tags: ['HTML', 'CSS', 'GSAP'],
    link: '#',
  },
  {
    num: '004',
    title: 'Coming Soon',
    desc: 'Next project in progress. Stay tuned for something new.',
    tags: ['TBA'],
    link: '#',
    disabled: true,
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.project-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.projects-grid',
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative z-10 min-h-screen flex items-center px-8 md:px-16 py-24"
    >
      <div className="w-full max-w-6xl mx-auto">
        <p className="text-[10px] tracking-[0.4em] uppercase text-white/30 mb-12">
          — Projects
        </p>

        <div className="projects-grid grid grid-cols-1 md:grid-cols-2 gap-[1px] bg-white/8">
          {projects.map((project) => (
            <div
              key={project.num}
              className={`project-card bg-black p-8 flex flex-col gap-4 relative group transition-colors duration-300 ${
                project.disabled ? 'opacity-40 cursor-default' : 'hover:bg-white/5 cursor-pointer'
              }`}
            >
              {!project.disabled && (
                <span className="absolute top-6 right-6 text-white/20 text-lg group-hover:text-white group-hover:-translate-y-1 group-hover:translate-x-1 transition-all duration-300">
                  ↗
                </span>
              )}
              <p className="text-[10px] tracking-[0.3em] uppercase text-white/25">
                {project.num}
              </p>
              <h3 className="heading-md text-white">{project.title}</h3>
              <p className="text-sm leading-relaxed text-white/45">
                {project.desc}
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] tracking-[0.15em] uppercase border border-white/15 px-3 py-1 text-white/40"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}