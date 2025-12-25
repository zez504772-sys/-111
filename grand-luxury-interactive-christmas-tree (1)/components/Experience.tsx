
import React from 'react';
import { OrbitControls, Environment, PerspectiveCamera, Float, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import Foliage from './Foliage';
import Ornaments from './Ornaments';
import { TreeState } from '../types';
// Fix: Import TREE_CONFIG from constants
import { COLORS, TREE_CONFIG } from '../constants';

interface ExperienceProps {
  treeState: TreeState;
}

const Experience: React.FC<ExperienceProps> = ({ treeState }) => {
  const progress = treeState === TreeState.FORMED ? 1 : 0;

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={50} />
      <OrbitControls 
        enablePan={false} 
        minDistance={10} 
        maxDistance={40} 
        autoRotate={treeState === TreeState.FORMED}
        autoRotateSpeed={0.5}
      />

      <color attach="background" args={[COLORS.DARK_BG]} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color={COLORS.GOLD_LUXE} />
      <spotLight 
        position={[0, 15, 0]} 
        angle={0.3} 
        penumbra={1} 
        intensity={2} 
        color={COLORS.WHITE_GLOW} 
        castShadow 
      />

      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
        <group>
          <Foliage progress={progress} />
          <Ornaments progress={progress} />
          
          {/* Tree Topper - Golden Star */}
          {treeState === TreeState.FORMED && (
            <mesh position={[0, TREE_CONFIG.HEIGHT / 2 + 0.5, 0]} rotation={[0, 0, Math.PI / 5]}>
              <octahedronGeometry args={[0.8, 0]} />
              <meshStandardMaterial 
                color={COLORS.GOLD_BRIGHT} 
                emissive={COLORS.GOLD_LUXE} 
                emissiveIntensity={2} 
                metalness={1} 
                roughness={0} 
              />
            </mesh>
          )}
        </group>
      </Float>

      <Environment preset="night" />

      <EffectComposer multisampling={4}>
        <Bloom 
          intensity={1.2} 
          luminanceThreshold={0.8} 
          luminanceSmoothing={0.025} 
          mipmapBlur 
        />
        <Noise opacity={0.05} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
};

export default Experience;
