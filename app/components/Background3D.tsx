'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { subscribeAnimationFrame } from '../lib/animationFrame';

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
    const count = isMobile ? 800 : 1600;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 100;
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const wireGeo = new THREE.IcosahedronGeometry(8, 1);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      opacity: 0.06,
      transparent: true,
    });
    const wire = new THREE.Mesh(wireGeo, wireMat);
    scene.add(wire);

    const wire2Geo = new THREE.OctahedronGeometry(5, 0);
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

    const handleMouse = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouse);

    let lastRender = 0;
    const frameInterval = 1000 / 45;
    const timer = new THREE.Timer();
    timer.connect(document);

    const render = (time: number) => {
      timer.update(time);

      const timerDelta = timer.getDelta();
      if (document.hidden || timerDelta === 0 || time - lastRender < frameInterval) {
        return;
      }

      const renderDelta = lastRender === 0 ? timerDelta : Math.min((time - lastRender) / 1000, 1 / 30);
      lastRender = time;
      const t = timer.getElapsed();
      const cameraLerp = 1 - Math.exp(-6 * renderDelta);

      points.rotation.y = t * 0.03;
      points.rotation.x = t * 0.01;
      wire.rotation.x = t * 0.15;
      wire.rotation.y = t * 0.2;
      wire2.rotation.x = t * 0.1;
      wire2.rotation.z = t * 0.15;
      camera.position.x += (mouseX * 5 - camera.position.x) * cameraLerp;
      camera.position.y += (mouseY * 3 - camera.position.y) * cameraLerp;
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
