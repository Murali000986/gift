import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const EntrancePage = lazy(() => import('./pages/Entrance/EntrancePage'));
const TreePage = lazy(() => import('./pages/TreeOfMemories/TreePage'));
const GardenPage = lazy(() => import('./pages/GardenOfDreams/GardenPage'));
const IslandPage = lazy(() => import('./pages/SkyIsland/IslandPage'));
const LakePage = lazy(() => import('./pages/ButterflyLake/LakePage'));
const ConstellationPage = lazy(() => import('./pages/ConstellationSky/ConstellationPage'));
const SunrisePage = lazy(() => import('./pages/Sunrise/SunrisePage'));
const HealingGlassPage = lazy(() => import('./pages/HealingGlass/HealingGlassPage'));
const KabiniWorldPage = lazy(() => import('./pages/KabiniWorld/KabiniWorldPage'));

// Page transition wrapper
const pageVariants = {
  initial: { opacity: 0, scale: 0.97, rotateY: -5 },
  animate: { opacity: 1, scale: 1, rotateY: 0 },
  exit: { opacity: 0, scale: 1.03, rotateY: 5 },
};

const PageLoader: React.FC = () => (
  <div style={{
    position: 'fixed', inset: 0,
    background: 'radial-gradient(ellipse at 50% 50%, #0a1628, #050d1a)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 9999,
  }}>
    <motion.div
      animate={{
        scale: [1, 1.2, 1],
        rotate: [0, 180, 360],
        opacity: [0.5, 1, 0.5],
      }}
      transition={{ repeat: Infinity, duration: 2 }}
      style={{ fontSize: '4rem', filter: 'drop-shadow(0 0 20px #c8a8f0)' }}
    >
      🦋
    </motion.div>
  </div>
);

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        style={{ position: 'relative', minHeight: '100vh' }}
      >
        <Suspense fallback={<PageLoader />}>
          <Routes location={location}>
            <Route path="/" element={<EntrancePage />} />
            <Route path="/tree" element={<TreePage />} />
            <Route path="/garden" element={<GardenPage />} />
            <Route path="/island" element={<IslandPage />} />
            <Route path="/lake" element={<LakePage />} />
            <Route path="/constellation" element={<ConstellationPage />} />
            <Route path="/sunrise" element={<SunrisePage />} />
            <Route path="/healing" element={<HealingGlassPage />} />
            <Route path="/kabini" element={<KabiniWorldPage />} />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  );
};

export default App;
