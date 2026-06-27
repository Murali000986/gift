import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import StarCanvas from '../../components/canvas/StarCanvas';
import FireflyCanvas from '../../components/canvas/FireflyCanvas';
import CloudCanvas from '../../components/canvas/CloudCanvas';
import MessageCrystal from '../../components/ui/MessageCrystal';
import AudioToggle from '../../components/ui/AudioToggle';
import HintCaption from '../../components/ui/HintCaption';
import { useSynthAudio } from '../../hooks/useAudio';
import { useDiscoveryStore } from '../../store/discoveryStore';

const EntrancePage: React.FC = () => {
  const navigate = useNavigate();
  const [butterflyVisible, setButterflyVisible] = useState(false);
  const [crystalOpen, setCrystalOpen] = useState(false);
  const [butterflyClicked, setButterflyClicked] = useState(false);
  const [showEnterBtn, setShowEnterBtn] = useState(false);
  const [showText, setShowText] = useState(false);

  const { resetAll } = useDiscoveryStore();

  useSynthAudio('entrance');

  useEffect(() => {
    // Reset all progress when starting from the entrance
    resetAll();

    const t1 = setTimeout(() => setShowText(true), 800);
    const t2 = setTimeout(() => setButterflyVisible(true), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [resetAll]);

  const handleButterflyClick = useCallback(() => {
    setCrystalOpen(true);
    setButterflyClicked(true);
    setTimeout(() => setShowEnterBtn(true), 1500);
  }, []);

  return (
    <div
      className="page"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #1a0a3e 0%, #050d1a 40%, #020810 100%)',
        minHeight: '100vh',
      }}
    >
      {/* Canvas layers */}
      <StarCanvas count={250} />
      <CloudCanvas />
      <FireflyCanvas count={45} />

      {/* Moon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
        style={{
          position: 'absolute', top: '8%', right: '15%',
          width: 80, height: 80, zIndex: 5,
        }}
      >
        <div style={{
          width: 80, height: 80, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #fff8dc, #f0d080)',
          boxShadow: '0 0 20px #fff8dc88, 0 0 60px #fff8dc44, 0 0 100px #fff8dc22',
        }} />
        {/* Moon glow ring */}
        <div style={{
          position: 'absolute', inset: -15,
          borderRadius: '50%',
          background: 'radial-gradient(circle, transparent 50%, rgba(255,248,220,0.05) 70%)',
          animation: 'pulse-glow 3s ease-in-out infinite',
        }} />
      </motion.div>

      {/* Forest silhouette */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: '35%', zIndex: 6, pointerEvents: 'none',
      }}>
        <svg viewBox="0 0 1440 300" preserveAspectRatio="none"
          style={{ width: '100%', height: '100%' }}>
          {/* Background trees */}
          {[...Array(12)].map((_, i) => {
            const x = (i / 11) * 1400 + (i % 3) * 20;
            const h = 150 + (i % 4) * 40;
            return (
              <g key={i} style={{ animation: `sway ${2.5 + (i % 3) * 0.7}s ease-in-out infinite`, transformOrigin: `${x + 20}px 300px` }}>
                <polygon points={`${x},300 ${x + 40},${300 - h} ${x + 80},300`} fill="#051505" />
                <polygon points={`${x + 10},${300 - h + 30} ${x + 40},${300 - h - 20} ${x + 70},${300 - h + 30}`} fill="#071507" />
              </g>
            );
          })}
          {/* Glowing entrance arch */}
          <ellipse cx="720" cy="300" rx="120" ry="80" fill="#0a2a0a" />
          <path d="M600,300 Q600,150 720,140 Q840,150 840,300" fill="none" stroke="#1a5a1a" strokeWidth="3" />
          {/* Glow effect on arch */}
          <path d="M610,300 Q610,160 720,150 Q830,160 830,300" fill="none" stroke="#2d8a2d" strokeWidth="1" opacity="0.5" />
        </svg>

        {/* Glowing forest entrance orbs */}
        <div style={{
          position: 'absolute', bottom: '45%', left: '50%',
          transform: 'translateX(-50%)',
          width: 200, height: 60,
          background: 'radial-gradient(ellipse, rgba(45,180,45,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          animation: 'glow-pulse 3s ease-in-out infinite',
        }} />
      </div>

      {/* Main content */}
      <div className="page-content" style={{ zIndex: 10 }}>
        <AnimatePresence>
          {showText && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              style={{ textAlign: 'center', marginBottom: '3rem' }}
            >
              <motion.p
                style={{
                  fontFamily: 'var(--font-script)',
                  fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                  color: '#a0b8c8',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '1rem',
                }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 4 }}
              >
                ✦ Welcome, traveler ✦
              </motion.p>
              <h1 className="title-magical" style={{ marginBottom: '1.5rem' }}>
                The Enchanted Forest
              </h1>
              <p className="body-text" style={{
                fontFamily: 'var(--font-script)',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
                color: '#c8d8e8',
                lineHeight: 2,
              }}>
                "This forest has a story to tell."
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enter button */}
        <AnimatePresence>
          {showEnterBtn && (
            <motion.button
              className="btn-magic"
              onClick={() => navigate('/tree')}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Enter Forest →
            </motion.button>
          )}
        </AnimatePresence>

        {/* Hint text if butterfly not clicked */}
        <AnimatePresence>
          {butterflyVisible && !butterflyClicked && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.7, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              style={{
                position: 'absolute', bottom: '38%',
                fontFamily: 'var(--font-script)',
                fontSize: '1rem',
                color: '#ff69b488',
                pointerEvents: 'none',
              }}
            >
              ✨ a visitor has arrived...
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Butterfly */}
      <AnimatePresence>
        {butterflyVisible && !butterflyClicked && (
          <motion.div
            style={{
              position: 'absolute', zIndex: 20,
              cursor: 'pointer',
              fontSize: '3rem',
              filter: 'drop-shadow(0 0 15px #ff69b4)',
            }}
            initial={{ x: '110vw', y: '40vh', opacity: 0 }}
            animate={{
              x: '46vw', y: '42vh', opacity: 1,
              transition: { duration: 2.5, ease: [0.34, 1.56, 0.64, 1] }
            }}
            onClick={handleButterflyClick}
            whileHover={{ scale: 1.3 }}
            title="Click the butterfly!"
          >
            <motion.span
              animate={{
                scaleX: [1, 0.15, 1],
                y: [0, -5, 0],
              }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              style={{ display: 'inline-block' }}
            >
              🦋
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      <MessageCrystal
        icon="🦋"
        message='"Every journey begins with a single step."'
        isOpen={crystalOpen}
        onClose={() => setCrystalOpen(false)}
        color="#ff69b4"
      />

      {butterflyVisible && !butterflyClicked && <HintCaption text="Click the butterfly" />}

      <AudioToggle />
    </div>
  );
};

export default EntrancePage;
