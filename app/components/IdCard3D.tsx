'use client';

import { PointerEvent, useEffect, useRef } from 'react';
import { gsap } from 'gsap';

type DragState = {
  active: boolean;
  startX: number;
  startY: number;
  x: number;
  y: number;
  rotateZ: number;
  baseX: number;
  baseY: number;
};

const CARD_TOP = 168;
const LEFT_CLIP_X = -42;
const RIGHT_CLIP_X = 42;

export default function IdCard3D() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const leftRopeRef = useRef<SVGLineElement>(null);
  const rightRopeRef = useRef<SVGLineElement>(null);
  const drag = useRef<DragState>({
    active: false,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    rotateZ: 0,
    baseX: 0,
    baseY: 0,
  });

  const updateRopes = () => {
    const wrapper = wrapperRef.current;
    const leftRope = leftRopeRef.current;
    const rightRope = rightRopeRef.current;

    if (!wrapper || !leftRope || !rightRope) {
      return;
    }

    const centerX = wrapper.clientWidth / 2;
    const clipY = CARD_TOP + drag.current.y;

    leftRope.setAttribute('x1', `${centerX - 8}`);
    leftRope.setAttribute('y1', '2');
    leftRope.setAttribute('x2', `${centerX + drag.current.x + LEFT_CLIP_X}`);
    leftRope.setAttribute('y2', `${clipY}`);

    rightRope.setAttribute('x1', `${centerX + 8}`);
    rightRope.setAttribute('y1', '2');
    rightRope.setAttribute('x2', `${centerX + drag.current.x + RIGHT_CLIP_X}`);
    rightRope.setAttribute('y2', `${clipY}`);
  };

  const updateTransform = (rotateX = 0, rotateY = 0, glareX = 50, glareY = 50, glareOpacity = 0) => {
    if (!cardRef.current) {
      return;
    }

    cardRef.current.style.transform = `translate3d(${drag.current.x}px, ${drag.current.y}px, 0) rotateZ(${drag.current.rotateZ}deg) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    cardRef.current.style.setProperty('--glare-x', `${glareX}%`);
    cardRef.current.style.setProperty('--glare-y', `${glareY}%`);
    cardRef.current.style.setProperty('--glare-opacity', `${glareOpacity}`);
    updateRopes();
  };

  useEffect(() => {
    updateRopes();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const state = drag.current;

    gsap.fromTo(
      state,
      { y: -560, rotateZ: -10 },
      {
        y: 0,
        rotateZ: 0,
        duration: 1.25,
        delay: 0.25,
        ease: 'bounce.out',
        onUpdate: () => updateTransform(),
      },
    );
  }, []);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    gsap.killTweensOf(drag.current);
    drag.current.active = true;
    drag.current.startX = event.clientX;
    drag.current.startY = event.clientY;
    drag.current.baseX = drag.current.x;
    drag.current.baseY = drag.current.y;
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const pointerX = (event.clientX - rect.left) / rect.width - 0.5;
    const pointerY = (event.clientY - rect.top) / rect.height - 0.5;
    const rotateX = pointerY * -16;
    const rotateY = pointerX * 16;
    const glareX = (pointerX + 0.5) * 100;
    const glareY = (pointerY + 0.5) * 100;

    if (drag.current.active) {
      drag.current.x = drag.current.baseX + event.clientX - drag.current.startX;
      drag.current.y = Math.max(-56, drag.current.baseY + event.clientY - drag.current.startY);
      drag.current.rotateZ = Math.max(-18, Math.min(18, drag.current.x * 0.08));
    }

    updateTransform(rotateX, rotateY, glareX, glareY, 0.55);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    drag.current.active = false;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    gsap.to(drag.current, {
      x: 0,
      y: 0,
      rotateZ: 0,
      duration: 1.05,
      ease: 'elastic.out(1, 0.45)',
      onUpdate: () => updateTransform(),
    });
  };

  const handlePointerLeave = () => {
    if (!drag.current.active) {
      updateTransform();
    }
  };

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none absolute right-12 top-0 z-20 h-[40rem] w-60 [perspective:1200px] md:right-24 md:w-72 lg:right-32 lg:w-80"
    >
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full overflow-visible"
      >
        <line
          ref={leftRopeRef}
          className="stroke-white/35 drop-shadow-[0_0_10px_rgba(255,255,255,0.16)]"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          ref={rightRopeRef}
          className="stroke-white/35 drop-shadow-[0_0_10px_rgba(255,255,255,0.16)]"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute left-1/2 top-0 h-4 w-16 -translate-x-1/2 rounded-b-md border border-white/20 bg-white/10 backdrop-blur-sm" />
      <div className="absolute left-1/2 top-3 h-3 w-8 -translate-x-1/2 rounded-full bg-white/30" />

      <div
        ref={cardRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className="pointer-events-auto absolute left-1/2 top-[10.5rem] flex h-[24rem] w-52 -translate-x-1/2 cursor-grab touch-none select-none flex-col items-center transition-transform duration-75 ease-out [transform-style:preserve-3d] [--glare-opacity:0] [--glare-x:50%] [--glare-y:50%] active:cursor-grabbing active:duration-0 md:h-[28rem] md:w-64"
      >
        <div className="relative h-9 w-24 shrink-0 [transform:translateZ(36px)]">
          <div className="absolute left-1/2 top-0 h-8 w-16 -translate-x-1/2 rounded-t-md border border-white/20 bg-white/10 backdrop-blur-sm" />
          <div className="absolute left-1/2 top-2 h-2 w-10 -translate-x-1/2 rounded-full bg-white/35" />
        </div>

        <div className="relative flex min-h-0 w-full flex-1 flex-col justify-between overflow-hidden rounded-md border border-white/15 bg-white/10 p-3 shadow-2xl shadow-black/40 backdrop-blur-md [transform-style:preserve-3d]">
          <div className="pointer-events-none absolute inset-0 z-20 opacity-[var(--glare-opacity)] transition-opacity duration-200 [background:radial-gradient(circle_at_var(--glare-x)_var(--glare-y),rgba(255,255,255,0.42),transparent_34%)]" />

          <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.28em] text-white/45 [transform:translateZ(28px)]">
            <span>Student ID</span>
            <span>2026</span>
          </div>

          <div className="relative mt-3 min-h-0 flex-1 overflow-hidden rounded-sm bg-white/10 [transform:translateZ(20px)]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_20%,rgba(255,255,255,0.34),transparent_28%),linear-gradient(145deg,rgba(255,255,255,0.22),rgba(255,255,255,0.04))]" />
            <div className="absolute bottom-0 left-1/2 h-[58%] w-[58%] -translate-x-1/2 rounded-t-full bg-black/50 [transform:translateZ(24px)]" />
            <div className="absolute left-1/2 top-[24%] h-[24%] w-[34%] -translate-x-1/2 rounded-full bg-black/55 [transform:translateZ(34px)]" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/75 to-transparent" />
          </div>

          <div className="mt-4 space-y-2 [transform:translateZ(32px)]">
            <p className="heading-md text-white">Your Name</p>
            <div className="h-[1px] bg-white/15" />
            <p className="text-[10px] uppercase tracking-[0.24em] text-white/45">
              Software Developer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
