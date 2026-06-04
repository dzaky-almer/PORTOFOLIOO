type FrameCallback = (time: number) => void;

const callbacks = new Set<FrameCallback>();
let frameId: number | null = null;
let scrollY = 0;
let lastScrollY = 0;
let scrollVelocity = 0;
let lastVelocityTime = 0;

function tick(time: number) {
  // Track scroll position and velocity for subscribers
  const currentScrollY = document.scrollingElement?.scrollTop ?? window.scrollY ?? 0;
  const deltaTime = (time - lastVelocityTime) / 1000 || 0.016;
  
  if (Math.abs(currentScrollY - lastScrollY) > 0.1) {
    scrollVelocity = (currentScrollY - lastScrollY) / Math.max(deltaTime, 0.001);
    lastScrollY = currentScrollY;
    scrollY = currentScrollY;
  } else {
    // Damping effect - velocity decreases when not scrolling
    scrollVelocity *= Math.pow(0.95, deltaTime * 60);
  }
  
  lastVelocityTime = time;
  callbacks.forEach((callback) => callback(time));

  frameId = callbacks.size > 0 ? window.requestAnimationFrame(tick) : null;
}

export function subscribeAnimationFrame(callback: FrameCallback) {
  callbacks.add(callback);

  if (frameId === null) {
    frameId = window.requestAnimationFrame(tick);
  }

  return () => {
    callbacks.delete(callback);

    if (callbacks.size === 0 && frameId !== null) {
      window.cancelAnimationFrame(frameId);
      frameId = null;
    }
  };
}

export function getScrollY(): number {
  return scrollY;
}

export function getScrollVelocity(): number {
  return scrollVelocity;
}
