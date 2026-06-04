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
      lerp: 0.08,
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: 1.2,
      touchMultiplier: 1.5,
      autoRaf: false,
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
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
