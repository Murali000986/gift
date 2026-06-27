import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ButterflyCanvas from '../../components/canvas/ButterflyCanvas';
import PetalCanvas from '../../components/canvas/PetalCanvas';
import AudioToggle from '../../components/ui/AudioToggle';
import { useDiscoveryStore } from '../../store/discoveryStore';
import { useSynthAudio } from '../../hooks/useAudio';

const LETTER_LINES = [
  { text: 'Dear Shresta,', delay: 0.5, style: { fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: '#ffd700' } },
  { text: '', delay: 1.0 },
  { text: 'Life won\'t always be easy.', delay: 1.5 },
  { text: 'There will be nights that feel endless,', delay: 2.2 },
  { text: 'storms that feel unfair,', delay: 2.9 },
  { text: 'and battles that are invisible to everyone but you.', delay: 3.6 },
  { text: '', delay: 4.2 },
  { text: 'But just like this forest —', delay: 4.7 },
  { text: 'even after the darkest night,', delay: 5.4 },
  { text: 'flowers bloom again.', delay: 6.1, style: { color: '#ffb6c1' } },
  { text: '', delay: 6.8 },
  { text: 'You are not alone.', delay: 7.2, style: { color: '#87ceeb' } },
  { text: 'You are seen.', delay: 7.9 },
  { text: 'You are enough.', delay: 8.6 },
  { text: 'You are loved.', delay: 9.3, style: { color: '#ff69b4' } },
  { text: '', delay: 9.9 },
  { text: 'Keep going, beautiful soul.', delay: 10.4 },
  { text: 'Your story is still being written —', delay: 11.1 },
  { text: 'and it is magnificent.', delay: 11.8, style: { color: '#ffd700' } },
  { text: '', delay: 12.5 },
  { text: '— With all the love in the universe 💜', delay: 13.0, style: { fontStyle: 'italic', color: '#c8a8f0' } },
];

const SunrisePage: React.FC = () => {
  const navigate = useNavigate();
  const { specialEndingUnlocked } = useDiscoveryStore();
  const [phase, setPhase] = useState(0); // 0=night, 1=dawn, 2=sunrise, 3=morning, 4=letter
  const [showSpecial, setShowSpecial] = useState(false);
  const [treeBlossomed, setTreeBlossomed] = useState(false);

  useSynthAudio('sunrise');

  useEffect(() => {
    // Orchestrated sequence
    const timers = [
      setTimeout(() => setPhase(1), 2000),    // Dawn glow
      setTimeout(() => setPhase(2), 5000),    // Sunrise colors
      setTimeout(() => { setPhase(3); setTreeBlossomed(true); }, 9000),  // Full morning
      setTimeout(() => setPhase(4), 12000),   // Show letter
      setTimeout(() => setShowSpecial(specialEndingUnlocked), 26000), // Special ending
    ];
    return () => timers.forEach(clearTimeout);
  }, [specialEndingUnlocked]);

  const skyGradients = [
    'linear-gradient(180deg, #050d1a 0%, #0a1628 50%, #0f2040 100%)',      // 0 - night
    'linear-gradient(180deg, #1a0a2e 0%, #2d1b69 40%, #4a1a6e 100%)',      // 1 - dawn
    'linear-gradient(180deg, #4a1a2e 0%, #8b2252 40%, #e8620a 100%)',      // 2 - sunrise
    'linear-gradient(180deg, #87ceeb 0%, #ffe0b2 60%, #fff8dc 100%)',      // 3 - morning
    'linear-gradient(180deg, #87ceeb 0%, #b0d8f0 40%, #ffeedd 100%)',      // 4 - golden morning
  ];

  return (
    <div
      className="page"
      style={{
        background: skyGradients[Math.min(phase, skyGradients.length - 1)],
        transition: 'background 4s ease',
        minHeight: '100vh',
        overflow: 'hidden',
        alignItems: 'flex-start',
      }}
    >
      {/* Stars fading out */}
      <AnimatePresence>
        {phase < 2 && (
          <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 3 }}
            style={{ position: 'absolute', inset: 0, zIndex: 1 }}
          >
            {[...Array(100)].map((_, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 60}%`,
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                borderRadius: '50%',
                background: '#fff8dc',
                opacity: Math.random() * 0.8,
                animation: `twinkle ${1 + Math.random() * 2}s ease-in-out ${Math.random() * 2}s infinite`,
              }} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sun rising */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            initial={{ y: 200, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 4, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              bottom: '35%',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 5,
            }}
          >
            <motion.div
              style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'radial-gradient(circle at 40% 40%, #fff8dc, #ffb347)',
                boxShadow: '0 0 40px #ffb34788, 0 0 80px #ff830044',
              }}
              animate={{
                boxShadow: [
                  '0 0 40px #ffb34788, 0 0 80px #ff830044',
                  '0 0 60px #ffd700aa, 0 0 120px #ffb34766',
                  '0 0 40px #ffb34788, 0 0 80px #ff830044',
                ],
              }}
              transition={{ repeat: Infinity, duration: 3 }}
            />
            {/* Sun rays */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  width: 2, height: 30,
                  background: 'rgba(255, 200, 80, 0.6)',
                  transformOrigin: '50% 100%',
                  transform: `translate(-50%, -100%) rotate(${i * 30}deg)`,
                  borderRadius: 2,
                  marginTop: -40,
                }}
                animate={{ opacity: [0.3, 0.8, 0.3], scaleY: [0.8, 1.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.17 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Horizon glow */}
      <motion.div
        animate={{ opacity: phase >= 1 ? 1 : 0 }}
        transition={{ duration: 3 }}
        style={{
          position: 'absolute',
          bottom: '30%', left: 0, right: 0, height: 100,
          background: `radial-gradient(ellipse at 50% 100%, rgba(255,${phase >= 2 ? 150 : 100},50,0.4) 0%, transparent 70%)`,
          zIndex: 4, pointerEvents: 'none',
        }}
      />

      {/* Magical tree */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(400px, 60vw)', height: '50vh',
        zIndex: 6,
      }}>
        <svg viewBox="0 0 300 400" style={{ width: '100%', height: '100%' }} overflow="visible">
          <defs>
            <filter id="tree-glow-sunrise">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Trunk */}
          <path d="M135,400 Q130,320 140,240 Q150,170 150,100" stroke="#4a2e10" strokeWidth="28" fill="none" strokeLinecap="round" />
          <path d="M165,400 Q170,320 160,240 Q150,170 150,100" stroke="#5a3a18" strokeWidth="22" fill="none" strokeLinecap="round" />

          {/* Branches */}
          <path d="M145,220 Q110,180 75,150" stroke="#4a2e10" strokeWidth="14" fill="none" strokeLinecap="round" />
          <path d="M152,190 Q195,155 230,130" stroke="#4a2e10" strokeWidth="12" fill="none" strokeLinecap="round" />
          <path d="M150,150 Q150,100 152,60" stroke="#4a2e10" strokeWidth="10" fill="none" strokeLinecap="round" />

          {/* Foliage - morning green */}
          {treeBlossomed ? (
            <>
              {[
                { cx: 150, cy: 60, rx: 70, ry: 55 },
                { cx: 75, cy: 130, rx: 55, ry: 42 },
                { cx: 225, cy: 115, rx: 50, ry: 38 },
                { cx: 110, cy: 100, rx: 40, ry: 32 },
                { cx: 195, cy: 90, rx: 38, ry: 30 },
              ].map((c, i) => (
                <motion.ellipse key={i} cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry}
                  fill={`hsl(${120 + i * 8}, 55%, ${25 + i * 3}%)`}
                  filter="url(#tree-glow-sunrise)"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.2, type: 'spring' }}
                  style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
                />
              ))}
              {/* Blossoms */}
              {[...Array(30)].map((_, i) => {
                const angle = (i / 30) * Math.PI * 2;
                const dist = 40 + Math.random() * 60;
                const cx = 150 + Math.cos(angle) * dist;
                const cy = 80 + Math.sin(angle) * dist * 0.6;
                return (
                  <motion.ellipse key={`bl-${i}`}
                    cx={cx} cy={cy} rx={5} ry={4}
                    fill={['#ffb6c1', '#ff69b4', '#ffe4e1', '#ffc6d3'][i % 4]}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.9 }}
                    transition={{ delay: 0.5 + Math.random() * 1.5, type: 'spring' }}
                  />
                );
              })}
            </>
          ) : (
            /* Night foliage */
            <>
              {[
                { cx: 150, cy: 60, rx: 70, ry: 55 },
                { cx: 75, cy: 130, rx: 55, ry: 42 },
                { cx: 225, cy: 115, rx: 50, ry: 38 },
              ].map((c, i) => (
                <ellipse key={i} cx={c.cx} cy={c.cy} rx={c.rx} ry={c.ry}
                  fill={`hsl(130, 50%, ${12 + i * 3}%)`}
                />
              ))}
            </>
          )}
        </svg>
      </div>

      {/* Butterflies gathering */}
      {phase >= 3 && <ButterflyCanvas count={12} />}

      {/* Petals */}
      {phase >= 3 && <PetalCanvas count={40} />}

      {/* Ground */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '32%',
        background: phase >= 3
          ? 'linear-gradient(180deg, rgba(20,100,20,0.5) 0%, rgba(10,60,10,0.9) 100%)'
          : 'linear-gradient(180deg, rgba(5,20,5,0.6) 0%, rgba(2,10,2,0.95) 100%)',
        transition: 'background 4s ease',
        zIndex: 5,
        pointerEvents: 'none',
      }} />

      {/* Letter */}
      <AnimatePresence>
        {phase >= 4 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              position: 'absolute',
              top: '5%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 'min(600px, 90vw)',
              background: 'rgba(255, 248, 220, 0.08)',
              border: '1px solid rgba(255, 215, 0, 0.2)',
              borderRadius: '1.5rem',
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 0 40px rgba(255,215,0,0.1), 0 20px 60px rgba(0,0,0,0.4)',
              zIndex: 20,
              textAlign: 'center',
            }}
            transition={{ duration: 1 }}
          >
            {LETTER_LINES.map((line, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: line.delay, duration: 0.8 }}
                className="letter-text"
                style={{
                  minHeight: line.text ? 'auto' : '0.8rem',
                  ...line.style,
                }}
              >
                {line.text}
              </motion.p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Special ending */}
      <AnimatePresence>
        {showSpecial && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'radial-gradient(ellipse at 50% 50%, rgba(200,168,240,0.15), rgba(5,13,26,0.97))',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Hearts spelling Shresta */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {'Shresta'.split('').map((letter, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: -50, rotate: -20 }}
                  animate={{ opacity: 1, y: 0, rotate: 0 }}
                  transition={{ delay: i * 0.2, type: 'spring', damping: 10 }}
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(2rem, 6vw, 5rem)',
                    color: '#ff69b4',
                    textShadow: '0 0 20px #ff69b4, 0 0 50px #ff69b488',
                    fontWeight: 700,
                  }}
                >
                  {letter}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              style={{ textAlign: 'center', maxWidth: 500, padding: '0 2rem' }}
            >
              <p className="letter-text" style={{ color: '#ffd700', fontSize: '1.5rem' }}>
                ✨ You found every secret in the forest. ✨
              </p>
              <p className="letter-text" style={{ marginTop: '1rem', color: '#c8a8f0' }}>
                That is exactly who you are — someone who looks closely, feels deeply, and never gives up searching.
              </p>
              <p className="letter-text" style={{ marginTop: '1rem', color: '#ffb6c1' }}>
                The magic was always you. 💜
              </p>
            </motion.div>

            {/* Floating hearts */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ y: '100vh', x: `${Math.random() * 100 - 50}vw`, opacity: 0 }}
                animate={{ y: '-10vh', opacity: [0, 1, 0] }}
                transition={{ delay: i * 0.3, duration: 4, repeat: Infinity }}
                style={{
                  position: 'absolute',
                  fontSize: `${Math.random() * 20 + 12}px`,
                  left: `${Math.random() * 100}%`,
                  bottom: 0,
                  pointerEvents: 'none',
                }}
              >
                {['💜', '💕', '✨', '🌸', '🦋', '⭐'][Math.floor(Math.random() * 6)]}
              </motion.div>
            ))}

            <motion.button
              className="btn-magic"
              onClick={() => setShowSpecial(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3 }}
              style={{ marginTop: '3rem', borderColor: '#ff69b488', color: '#ff69b4' }}
            >
              Return to the Forest 🌙
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Birds flying formation */}
      {phase >= 3 && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 8, pointerEvents: 'none' }}>
          {[...Array(5)].map((_, i) => (
            <motion.div key={i}
              initial={{ x: '-15vw', y: `${25 + i * 6}%` }}
              animate={{ x: '115vw' }}
              transition={{ duration: 12, delay: 2 + i * 0.5, ease: 'linear' }}
              style={{ position: 'absolute', fontSize: '1.4rem', opacity: 0.8 }}
            >
              🦅
            </motion.div>
          ))}
        </div>
      )}

      {/* Navigation buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 4 ? 1 : 0 }}
        transition={{ delay: 14 }}
        style={{
          position: 'fixed', bottom: '2rem', left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30, display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center',
        }}
      >

        <motion.button
          className="btn-magic"
          onClick={() => navigate('/healing')}
          style={{ borderColor: 'rgba(200,168,240,0.6)', color: '#c8a8f0', background: 'rgba(200,168,240,0.08)' }}
          whileHover={{ scale: 1.05 }}
          animate={{ boxShadow: ['0 0 10px rgba(200,168,240,0.2)', '0 0 25px rgba(200,168,240,0.5)', '0 0 10px rgba(200,168,240,0.2)'] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          💎 The Healing Glass →
        </motion.button>
      </motion.div>

      <AudioToggle />
    </div>
  );
};

export default SunrisePage;
