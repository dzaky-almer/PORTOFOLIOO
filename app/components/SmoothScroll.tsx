'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { subscribeAnimationFrame } from '../lib/animationFrame';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.09, // OPSI 3: Fine-tuned from 0.08 for slightly more control
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: 1.25, // OPSI 3: Fine-tuned from 1.2
      touchMultiplier: 1.6, // OPSI 3: Fine-tuned from 1.5 for better mobile feel
      autoRaf: false,
      duration: 1.15, // OPSI 3: Fine-tuned from 1.2
      easing: (t) => 1 - Math.pow(1 - t, 2.8), // OPSI 3: Adjusted curve for better smoothness
    });
    lenis.on('scroll', ScrollTrigger.update);

    const unsubscribe = subscribeAnimationFrame((time) => {
      lenis.raf(time);
    });

    return () => {
      unsubscribe();
      lenis.destroy();
    };
  }, []);

  return null;
}
