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

        // TIER 3: Cascade reveal with child element animation
        const children = element.querySelectorAll('[data-cascade]');
        const hasChildren = children.length > 0;

        const mainAnimation = gsap.from(element, {
          ...fromVars,
          delay,
          duration: 0.95, // OPSI 3: Fine-tuned from 0.9
          ease: 'cubic.inOut', // OPSI 3: Changed to cubic.inOut for smoother feel
          clearProps: 'transform,opacity,filter',
          scrollTrigger: {
            trigger: element,
            start: 'top 82%', // OPSI 3: Fine-tuned from 84%
            once: true,
          },
          stagger: index * 0.008, // OPSI 3: Fine-tuned from 0.01
          // Add perspective for cinematic 3D depth effect
          transformOrigin: 'center center',
          perspective: 1200,
          overwrite: 'auto',
          // TIER 3: Add blur and filter effects for premium feel
          filter: 'blur(10px)', // OPSI 3: Fine-tuned blur from 12px
          onComplete: () => {
            // TIER 3: Cascade animation for child elements after parent completes
            if (hasChildren) {
              children.forEach((child: Element, childIndex: number) => {
                const childEl = child as HTMLElement;
                gsap.from(childEl, {
                  opacity: 0,
                  y: 18, // OPSI 3: Fine-tuned from 20
                  duration: 0.4, // OPSI 3: Fine-tuned from 0.5
                  ease: 'power2.out',
                  delay: childIndex * 0.06, // OPSI 3: Fine-tuned from 0.05
                  clearProps: 'transform,opacity',
                });
              });
            }
          },
        });
      });

      const parallaxElements = gsap.utils.toArray<HTMLElement>('[data-parallax]');

      parallaxElements.forEach((element) => {
        const speed = Number(element.dataset.parallax ?? 0.18);

        // TIER 3: Enhanced parallax with blur effect on fast scroll
        gsap.to(element, {
          yPercent: speed * -100,
          ease: 'none',
          scrollTrigger: {
            trigger: element,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.75, // OPSI 3: Fine-tuned from 0.8
            onUpdate: (self) => {
              // TIER 3: Dynamic blur based on scroll velocity
              const velocity = Math.abs(self.getVelocity());
              const blur = Math.min(1.5, velocity / 350); // OPSI 3: Reduced max blur from 2
              element.style.filter = blur > 0.05 ? `blur(${blur}px)` : 'blur(0px)';
            },
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
