
import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Experience from './components/Experience';
import { TreeState } from './types';
import { COLORS } from './constants';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.CHAOS);

  const toggleState = () => {
    setTreeState((prev) => (prev === TreeState.CHAOS ? TreeState.FORMED : TreeState.CHAOS));
  };

  return (
    <div className="relative w-full h-screen bg-[#020f0a] overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10 flex flex-col justify-between p-8 md:p-16">
        
        {/* Header */}
        <header className="flex flex-col items-center">
          <h1 
            className="text-3xl md:text-7xl font-black tracking-tight text-center leading-tight uppercase flex flex-col md:flex-row items-center justify-center"
            style={{ 
              color: COLORS.GOLD_LUXE, 
              textShadow: `0 0 30px ${COLORS.GOLD_LUXE}44`,
              fontFamily: '"STKaiti", "KaiTi", "Inter", serif'
            }}
          >
            <span className="md:mr-6 text-[0.7em] md:text-[0.8em] opacity-90 normal-case mb-2 md:mb-0">To: 小婷</span>
            <span>Merry Christmas</span>
          </h1>
        </header>

        {/* Controls */}
        <div className="flex flex-col items-center space-y-10">
          <div className="flex flex-col items-center">
             <button
              onClick={toggleState}
              className="pointer-events-auto px-14 py-5 rounded-full font-bold text-xs md:text-sm tracking-[0.3em] uppercase transition-all duration-1000 active:scale-95 group overflow-hidden relative border border-[#D4AF37]/20"
              style={{ 
                backgroundColor: treeState === TreeState.FORMED ? COLORS.EMERALD_DEEP : COLORS.GOLD_LUXE,
                color: treeState === TreeState.FORMED ? COLORS.GOLD_LUXE : COLORS.EMERALD_DEEP,
                boxShadow: `0 0 40px -5px ${treeState === TreeState.FORMED ? COLORS.EMERALD_DEEP : COLORS.GOLD_LUXE}66`
              }}
            >
              <span className="relative z-10">
                {treeState === TreeState.FORMED ? 'DISSOLVE' : 'FORM TREE'}
              </span>
              <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex justify-center items-end text-[10px] tracking-[0.6em] text-gold-500/10 uppercase py-4">
          <div style={{ color: COLORS.GOLD_LUXE, opacity: 0.3 }}>Merry Christmas</div>
        </footer>
      </div>

      {/* 3D Canvas */}
      <Canvas shadows dpr={[1, 2]}>
        <Suspense fallback={null}>
          <Experience treeState={treeState} />
        </Suspense>
      </Canvas>

      {/* Loading Fallback UI */}
      <Suspense fallback={
        <div className="absolute inset-0 flex items-center justify-center bg-[#020f0a] z-50">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-2 border-t-gold-500 border-gold-900/20 rounded-full animate-spin" style={{ borderColor: `${COLORS.GOLD_LUXE}22`, borderTopColor: COLORS.GOLD_LUXE }} />
            <span className="text-gold-500 font-bold uppercase tracking-[0.3em] animate-pulse" style={{ color: COLORS.GOLD_LUXE }}>
              Luxe
            </span>
          </div>
        </div>
      }>
        <div />
      </Suspense>
    </div>
  );
};

export default App;
