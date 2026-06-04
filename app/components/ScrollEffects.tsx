'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const effectConfig = {
  fade: { opacity: 0, y: 28 },
  'slide-up': { opacity: 0, y: 56, z: -20, rotationX: 0.5 },
  'slide-left': { opacity: 0, x: 72, z: -20, rotationY: -0.3 },
  'slide-right': { opacity: 0, x: -72, z: -20, rotationY: 0.3 },
  zoom: { opacity: 0, scale: 0.92, z: -50 },
  rotate: { opacity: 0, y: 44, rotate: -3, z: -15 },
};

type ScrollEffect = keyof typeof effectConfig;

export default function ScrollEffects() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const ctx = gsap.context(() => {
      const animatedElements = gsap.utils.toArray<HTMLElement>('[data-scroll-effect]');

      animatedElements.forEach((element, index) => {
        const effect = element.dataset.scrollEffect as ScrollEffect;
        const fromVars = effectConfig[effect] ?? effectConfig.fade;
        const delay = Number(element.dataset.scrollDelay ?? 0);

        gsap.from(element, {
          ...fromVars,
          delay,
          duration: 0.9,
          ease: 'cubic.out',
          clearProps: 'transform,opacity',
          scrollTrigger: {
            trigger: element,
            start: 'top 84%',
            once: true,
          },
          stagger: index * 0.01,
          // Add perspective for cinematic 3D depth effect
          transformOrigin: 'center center',
          perspective: 1200,
          overwrite: 'auto',
        });
      });

      const parallaxElements = gsap.utils.toArray<HTMLElement>('[data-parallax]');

      parallaxElements.forEach((element) => {
        const speed = Number(element.dataset.parallax ?? 0.18);

        gsap.to(element, {
          yPercent: speed * -100,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        });
      });

      const progressElements = gsap.utils.toArray<HTMLElement>('[data-progress]');

      progressElements.forEach((element) => {
        const value = Number(element.dataset.progress ?? 0);

        gsap.fromTo(
          element,
          { width: 0 },
          {
            width: `${value}%`,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true,
            },
          },
        );
      });
    });

    ScrollTrigger.refresh();

    return () => ctx.revert();
  }, []);

  return null;
}
