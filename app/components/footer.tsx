'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/usernamekamu' },
  { label: 'Instagram', href: 'https://instagram.com/usernamekamu' },
  { label: 'LinkedIn', href: '#' },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-item', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      id="contact"
      className="relative z-10 border-t border-white/10 px-8 py-12 md:px-16"
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 md:flex-row md:items-center">
        <div className="flex flex-col gap-3">
          <p className="footer-item heading-md text-white">
            Let&apos;s Build
            <br />
            Together.
          </p>

          <a
            href="mailto:youremail@gmail.com"
            className="footer-item text-xs uppercase tracking-[0.2em] text-white/40 transition-colors duration-300 hover:text-white"
          >
            youremail@gmail.com &rarr;
          </a>
        </div>

        <div className="flex flex-col gap-4">
          <p className="footer-item text-[10px] uppercase tracking-[0.3em] text-white/25">
            Find me on
          </p>
          <div className="flex gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-item text-xs uppercase tracking-[0.2em] text-white/40 transition-colors duration-300 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-6xl items-center justify-between border-t border-white/10 pt-6">
        <p className="footer-item text-[10px] uppercase tracking-[0.2em] text-white/20">
          SMKN 1 Kota Bekasi &mdash; Student Developer
        </p>
        <p className="footer-item text-[10px] uppercase tracking-[0.2em] text-white/20">
          &copy; 2026
        </p>
      </div>
    </footer>
  );
}
