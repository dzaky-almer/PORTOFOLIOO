type FrameCallback = (time: number) => void;

const callbacks = new Set<FrameCallback>();
let frameId: number | null = null;

function tick(time: number) {
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
