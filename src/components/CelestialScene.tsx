import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { constellations, planets } from '@/lib/constellationData';
import { Star, ConstellationLines, Planet, Scene } from './ThreeComponents';

const LoadingFallback = () => (
  <div className="w-full h-full bg-gradient-to-br from-[#FFFAF0] via-[#FFF5E6] to-[#FFF0DB]">
    <div className="absolute inset-0 bg-black/40" />
  </div>
);

export function CelestialScene() {
  return (
    <div className="w-full h-full">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 15], fov: 60 }}>
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
} 