
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { TREE_CONFIG, COLORS } from '../constants';
import { FoliageShader } from '../shaders/foliageMaterial';

interface FoliageProps {
  progress: number;
}

const Foliage: React.FC<FoliageProps> = ({ progress }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const { chaosPositions, targetPositions, randoms } = useMemo(() => {
    const chaos = new Float32Array(TREE_CONFIG.FOLIAGE_COUNT * 3);
    const target = new Float32Array(TREE_CONFIG.FOLIAGE_COUNT * 3);
    const rnd = new Float32Array(TREE_CONFIG.FOLIAGE_COUNT);

    for (let i = 0; i < TREE_CONFIG.FOLIAGE_COUNT; i++) {
      // Chaos: Random Sphere
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.pow(Math.random(), 0.5) * TREE_CONFIG.CHAOS_RADIUS;
      
      chaos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      chaos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      chaos[i * 3 + 2] = r * Math.cos(phi);

      // Target: Conical Tree
      const y = Math.random() * TREE_CONFIG.HEIGHT;
      const t = Math.random() * Math.PI * 2;
      const currentRadius = (1 - y / TREE_CONFIG.HEIGHT) * TREE_CONFIG.RADIUS;
      // Add fuzzy noise to the needles
      const noise = (Math.random() - 0.5) * 1.5;
      const rad = Math.pow(Math.random(), 0.8) * currentRadius + noise;

      target[i * 3] = rad * Math.cos(t);
      target[i * 3 + 1] = y - TREE_CONFIG.HEIGHT / 2; // Center it vertically
      target[i * 3 + 2] = rad * Math.sin(t);

      rnd[i] = Math.random();
    }
    return { chaosPositions: chaos, targetPositions: target, randoms: rnd };
  }, []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
      // Smoothly lerp the uniform progress toward the prop progress
      materialRef.current.uniforms.uProgress.value = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uProgress.value,
        progress,
        0.05
      );
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={TREE_CONFIG.FOLIAGE_COUNT}
          array={chaosPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aChaos"
          count={TREE_CONFIG.FOLIAGE_COUNT}
          array={chaosPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aTarget"
          count={TREE_CONFIG.FOLIAGE_COUNT}
          array={targetPositions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aRandom"
          count={TREE_CONFIG.FOLIAGE_COUNT}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={FoliageShader.vertexShader}
        fragmentShader={FoliageShader.fragmentShader}
        uniforms={FoliageShader.uniforms}
      />
    </points>
  );
};

export default Foliage;
