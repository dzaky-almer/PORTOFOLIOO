'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { subscribeAnimationFrame, getScrollY, getScrollVelocity } from '../lib/animationFrame';

export default function Background3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const isMobile = window.innerWidth < 768;
    const pixelRatio = Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5);
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobile,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight, false);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const geometry = new THREE.BufferGeometry();
    const count = isMobile ? 500 : 1600;
    const positions = new Float32Array(count * 3);
    const originalPositions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      const pos = (Math.random() - 0.5) * 100;
      positions[i] = pos;
      originalPositions[i] = pos;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const wireGeo = new THREE.IcosahedronGeometry(8, 1);
    const wireGeoOriginal = wireGeo.clone();
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      opacity: 0.06,
      transparent: true,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    const wire2Geo = new THREE.OctahedronGeometry(5, 0);
    const wire2GeoOriginal = wire2Geo.clone();
    const wire2Mat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      opacity: 0.08,
      transparent: true,
    });
    const wire2 = new THREE.Mesh(wire2Geo, wire2Mat);
    wire2.position.set(15, -5, -5);
    scene.add(wire2);

    let mouseX = 0;
    let mouseY = 0;
    let mouseWorldX = 0;
    let mouseWorldY = 0;
    let cachedParticleColor = new THREE.Color(0xffffff); // BUG FIX: Cache color object

    const handleMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
      // Calculate world position for magnetic effects
      mouseWorldX = (e.clientX / window.innerWidth) * 100 - 50;
      mouseWorldY = -(e.clientY / window.innerHeight) * 100 + 50;
    };
    window.addEventListener('mousemove', handleMouse);

    let lastRender = 0;
    let frameCount = 0;
    const timer = new THREE.Timer();
    timer.connect(document);

    const render = (time: number) => {
      timer.update(time);

      const timerDelta = timer.getDelta();
      // Remove frame throttling - render every frame for smooth scroll
      if (document.hidden || timerDelta === 0) {
        return;
      }

      const renderDelta = lastRender === 0 ? timerDelta : Math.min((time - lastRender) / 1000, 1 / 30);
      lastRender = time;
      frameCount++;
      const t = timer.getElapsed();
      const cameraLerp = 1 - Math.exp(-6 * renderDelta);

      // Calculate scroll progress and velocity
      const maxScroll = Math.max((document.scrollingElement?.scrollHeight ?? document.body.scrollHeight) - window.innerHeight, 1);
      const scrollProgress = Math.min(1, Math.max(0, getScrollY() / maxScroll));
      const scrollVelocity = Math.abs(getScrollVelocity());
      const normalizedVelocity = Math.min(1, scrollVelocity / 500); // Normalize velocity

      // BUG FIX: Simplified geometry morphing to reduce jitter
      const geometryScale = 1 + scrollProgress * 0.25;
      wire.scale.set(geometryScale, geometryScale, geometryScale);
      wire2.scale.set(1 + scrollProgress * 0.15, 1 + scrollProgress * 0.15, 1 + scrollProgress * 0.15);

      // PARTICLE ANIMATION: Disable individual position updates - animate via group only for smooth scrolling
      // This eliminates expensive per-frame geometry buffer updates that cause stuttering

      // Floating particle animation with velocity boost (group level)
      const verticalFloat = Math.sin(t * 0.3 + normalizedVelocity * 0.5) * 0.3;
      points.position.y = verticalFloat + normalizedVelocity * 1.5;

      // BUG FIX: Cache particle size to avoid frequent updates
      const particleSize = 0.08 + normalizedVelocity * 0.04;
      (material as THREE.PointsMaterial).size = particleSize;

      // OPSI 3: Fine-tuned particle opacity for better depth perception - INCREASED VISIBILITY
      const particleOpacity = 0.75 - scrollProgress * 0.15;
      (material as THREE.PointsMaterial).opacity = Math.max(0.55, particleOpacity);

      // Base rotations
      points.rotation.y = t * 0.03 + normalizedVelocity * 0.08;
      points.rotation.x = t * 0.01 + normalizedVelocity * 0.04;
      
      // BUG FIX: Simplified wireframe rotations to prevent stuttering
      wire.rotation.x = t * 0.15 + scrollProgress * 0.3;
      wire.rotation.y = t * 0.2 - scrollProgress * 0.2;
      wire2.rotation.x = t * 0.1 + scrollProgress * 0.15;
      wire2.rotation.z = t * 0.15 + scrollProgress * 0.25;
      
      // BUG FIX: Simplified camera choreography for smooth motion
      const velocityDamping = 1 - normalizedVelocity * 0.2; // Reduce mouse effect when scrolling
      camera.position.x += (mouseX * 4 * velocityDamping - camera.position.x) * cameraLerp * 0.5;
      camera.position.y += (mouseY * 2.5 * velocityDamping - camera.position.y) * cameraLerp * 0.5;
      
      // BUG FIX: Optimized depth calculation
      const targetCameraZ = 30 - scrollProgress * 8 - normalizedVelocity * 2.5;
      camera.position.z += (targetCameraZ - camera.position.z) * cameraLerp * 0.3;
      
      // BUG FIX: Simpler FOV transitions
      const baseFOV = 75;
      const targetFOV = baseFOV - scrollProgress * 5;
      camera.fov += (targetFOV - camera.fov) * cameraLerp * 0.15;
      camera.updateProjectionMatrix();
      
      // BUG FIX: Optimized lighting - update colors less frequently (every 3 frames)
      if (frameCount % 3 === 0) {
        const lightIntensity = 1 - scrollProgress * 0.15;
        cachedParticleColor.setHex(0xffffff);
        cachedParticleColor.multiplyScalar(Math.max(0.75, lightIntensity));
        (material as THREE.PointsMaterial).color.copy(cachedParticleColor);
      }
      
      // BUG FIX: Smooth parallax without sine/cosine oscillation
      const parallaxDepth1 = scrollProgress * 5;
      const parallaxDepth2 = scrollProgress * 3;
      wire.position.z = parallaxDepth1;
      wire2.position.z = -parallaxDepth2;
      
      // BUG FIX: Simplified wire opacity for smooth transitions (update every 3 frames)
      if (frameCount % 3 === 0) {
        const wire1Opacity = Math.max(0.03, 0.06 - scrollProgress * 0.03);
        const wire2Opacity = Math.max(0.04, 0.08 - scrollProgress * 0.04);
        (wireMat as THREE.MeshBasicMaterial).opacity = wire1Opacity;
        (wire2Mat as THREE.MeshBasicMaterial).opacity = wire2Opacity;
      }
      
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };

    const unsubscribe = subscribeAnimationFrame(render);

    const handleResize = () => {
      const nextIsMobile = window.innerWidth < 768;
      const nextPixelRatio = Math.min(window.devicePixelRatio, nextIsMobile ? 1 : 1.5);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(nextPixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight, false);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      unsubscribe();
      timer.dispose();
      window.removeEventListener('mousemove', handleMouse);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      wireGeo.dispose();
      wireMat.dispose();
      wire2Geo.dispose();
      wire2Mat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed top-0 left-0 z-0 h-full w-full pointer-events-none"
    />
  );
}
