import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// ─── Clickable Objects Data ────────────────────────────────────────────────────
const HIDDEN_OBJECTS = [
  {
    id: 'basketball',
    emoji: '🏀',
    label: 'Basketball',
    message: 'Keep chasing what makes your heart feel alive.',
    x: '12%', y: '62%',
    size: '3.2rem',
    color: '#ff8c42',
  },
  {
    id: 'lemonrice',
    emoji: '🍋',
    label: 'Lemon Rice',
    message: 'Sometimes happiness is simpler than we think.',
    x: '78%', y: '70%',
    size: '2.8rem',
    color: '#ffd700',
  },
  {
    id: 'blueflower',
    emoji: '💙',
    label: 'Blue Flower',
    message: 'Peace.',
    x: '22%', y: '45%',
    size: '2.6rem',
    color: '#4fc3f7',
  },
  {
    id: 'purpleflower',
    emoji: '💜',
    label: 'Purple Flower',
    message: 'Hope.',
    x: '68%', y: '48%',
    size: '2.6rem',
    color: '#b784f0',
  },
  {
    id: 'movieticket',
    emoji: '🎬',
    label: 'Viswasam',
    message: 'Stories stay with us because they remind us who we are.',
    x: '48%', y: '55%',
    size: '2.8rem',
    color: '#ff6b8a',
  },
];

const FINAL_LANTERN_LETTER = [
  'Dear Shresta,',
  '',
  'This forest was filled with stars,',
  'but they were never the brightest thing here.',
  '',
  'It was filled with butterflies,',
  'but they were never the most beautiful thing here.',
  '',
  'It was filled with flowers,',
  'but they were never the reason it felt alive.',
  '',
  'The reason this forest mattered',
  'was because someone walked through it.',
  '',
  'Someone kind.',
  'Someone strong.',
  'Someone who kept moving forward,',
  'even when life became difficult.',
  '',
  'Someone who carried dreams,',
  'responsibilities,',
  'hope,',
  'and courage all at once.',
  '',
  'Thank you for walking through this story.',
  '',
  'Keep dreaming.',
  'Keep creating.',
  'Keep smiling.',
  '',
  'And if life ever becomes heavy,',
  'remember:',
  '',
  'you have already survived every difficult day',
  'that brought you here.',
  '',
  'The best chapters of your story',
  'have not been written yet.',
  '',
  '💜',
];

// ─── Firefly Component ──────────────────────────────────────────────────────────
const Firefly: React.FC<{ index: number }> = ({ index }) => {
  const x = useRef(Math.random() * 100);
  const y = useRef(20 + Math.random() * 55);
  const duration = 6 + Math.random() * 8;
  const delay = Math.random() * 6;
  const size = 3 + Math.random() * 4;

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: `${x.current}%`,
        top: `${y.current}%`,
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#aaff88',
        boxShadow: '0 0 6px #aaff88, 0 0 14px #aaff8866',
        pointerEvents: 'none',
        zIndex: 8,
      }}
      animate={{
        x: [(Math.random() - 0.5) * 80, (Math.random() - 0.5) * 80, 0],
        y: [(Math.random() - 0.5) * 40, (Math.random() - 0.5) * 40, 0],
        opacity: [0, 1, 0.6, 1, 0],
        scale: [0.5, 1.2, 0.8, 1, 0.5],
      }}
      transition={{
        duration,
        delay: delay + index * 0.3,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
};

// ─── Bird Component ─────────────────────────────────────────────────────────────
const FlyingBird: React.FC<{ index: number }> = ({ index }) => (
  <motion.div
    style={{
      position: 'absolute',
      top: `${8 + index * 7}%`,
      fontSize: '1.1rem',
      zIndex: 9,
      pointerEvents: 'none',
    }}
    initial={{ x: '-8vw' }}
    animate={{ x: '108vw' }}
    transition={{
      duration: 18 + index * 2,
      delay: 3 + index * 1.5,
      repeat: Infinity,
      repeatDelay: 12 + index * 3,
      ease: 'linear',
    }}
  >
    🕊️
  </motion.div>
);

// ─── Water Ripple ───────────────────────────────────────────────────────────────
const WaterRipple: React.FC<{ x: number; delay: number }> = ({ x, delay }) => (
  <motion.div
    style={{
      position: 'absolute',
      left: `${x}%`,
      bottom: '13%',
      width: 40, height: 12,
      borderRadius: '50%',
      border: '1px solid rgba(100,180,255,0.3)',
      pointerEvents: 'none',
      zIndex: 7,
    }}
    animate={{ scaleX: [0.3, 2.5], scaleY: [1, 0.3], opacity: [0.7, 0] }}
    transition={{ duration: 3, delay, repeat: Infinity, repeatDelay: 4 + Math.random() * 3 }}
  />
);

// ─── Popup Message ──────────────────────────────────────────────────────────────
const ObjectPopup: React.FC<{ obj: typeof HIDDEN_OBJECTS[0]; onClose: () => void }> = ({ obj, onClose }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5, y: 40 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.8, y: -20 }}
    transition={{ type: 'spring', damping: 15 }}
    style={{
      position: 'fixed', inset: 0, zIndex: 300,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(5, 8, 20, 0.75)',
      backdropFilter: 'blur(8px)',
    }}
    onClick={onClose}
  >
    <motion.div
      onClick={e => e.stopPropagation()}
      style={{
        background: 'linear-gradient(135deg, rgba(15,20,50,0.95), rgba(25,10,60,0.95))',
        border: `1px solid ${obj.color}44`,
        borderRadius: '1.5rem',
        padding: '2.5rem 2rem',
        maxWidth: 380, width: '88vw',
        textAlign: 'center',
        boxShadow: `0 0 40px ${obj.color}22, 0 20px 60px rgba(0,0,0,0.6)`,
      }}
    >
      <motion.div
        animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ fontSize: '3.5rem', marginBottom: '1.2rem', filter: `drop-shadow(0 0 15px ${obj.color})` }}
      >
        {obj.emoji}
      </motion.div>
      <p style={{
        fontFamily: 'var(--font-script)',
        fontSize: 'clamp(1.1rem, 3vw, 1.5rem)',
        color: '#f0e8ff',
        lineHeight: 1.8,
        textShadow: `0 0 20px ${obj.color}66`,
        marginBottom: '1.5rem',
      }}>
        "{obj.message}"
      </p>
      <button
        onClick={onClose}
        style={{
          background: `${obj.color}22`,
          border: `1px solid ${obj.color}66`,
          borderRadius: '2rem',
          padding: '0.6rem 1.8rem',
          color: obj.color,
          fontFamily: 'var(--font-serif)',
          fontSize: '0.95rem',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
      >
        💜 Close
      </button>
    </motion.div>
  </motion.div>
);

// ─── Lantern Letter Overlay ────────────────────────────────────────────────────
const LanternLetter: React.FC<{ onFinish: () => void }> = ({ onFinish }) => {
  const [visibleLines, setVisibleLines] = useState(0);
  const [showFinish, setShowFinish] = useState(false);

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    FINAL_LANTERN_LETTER.forEach((_, i) => {
      timers.push(setTimeout(() => setVisibleLines(i + 1), 800 + i * 600));
    });
    timers.push(setTimeout(() => setShowFinish(true), 800 + FINAL_LANTERN_LETTER.length * 600 + 1500));
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 400,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(40,20,80,0.98), rgba(5,5,15,0.99))',
        overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-start',
        padding: '3rem 1.5rem 6rem',
      }}
    >
      {/* Lantern floating at top */}
      <motion.div
        animate={{ y: [-4, 4, -4], rotate: [-3, 3, -3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        style={{ fontSize: '3.5rem', marginBottom: '2rem', filter: 'drop-shadow(0 0 20px #ffd700)' }}
      >
        🏮
      </motion.div>

      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
        {FINAL_LANTERN_LETTER.slice(0, visibleLines).map((line, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              fontFamily: line === 'Dear Shresta,' ? 'var(--font-serif)' : 'var(--font-script)',
              fontSize: line === 'Dear Shresta,' ? 'clamp(1.4rem, 3.5vw, 2rem)' : 'clamp(1rem, 2.5vw, 1.35rem)',
              color: line === '💜' ? '#c8a8f0' : line === 'Dear Shresta,' ? '#ffd700' : '#f0e8ff',
              lineHeight: line === '' ? 0 : 2.0,
              minHeight: line === '' ? '1rem' : undefined,
              textShadow: line === 'Dear Shresta,' ? '0 0 20px #ffd70066' : '0 0 10px rgba(200,168,240,0.2)',
              fontWeight: line === 'Dear Shresta,' ? 700 : 400,
              marginBottom: '0.1rem',
            }}
          >
            {line}
          </motion.p>
        ))}
      </div>

      <AnimatePresence>
        {showFinish && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            onClick={onFinish}
            style={{
              marginTop: '3rem',
              background: 'rgba(200,168,240,0.15)',
              border: '1px solid rgba(200,168,240,0.5)',
              borderRadius: '2rem',
              padding: '0.9rem 2.5rem',
              color: '#c8a8f0',
              fontFamily: 'var(--font-serif)',
              fontSize: '1.05rem',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(200,168,240,0.2)',
              fontStyle: 'italic',
            }}
          >
            Release the Lantern 🏮
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Star Finale ───────────────────────────────────────────────────────────────
const StarFinale: React.FC = () => {
  const [phase, setPhase] = useState(0); // 0 = lantern float, 1 = stars form, 2 = name, 3 = final line
  const navigate = useNavigate();

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 2500);
    const t2 = setTimeout(() => setPhase(2), 5000);
    const t3 = setTimeout(() => setPhase(3), 8000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const letters = '✨ SHRESTA ✨'.split('');

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 500,
        background: 'radial-gradient(ellipse at 50% 50%, #050820 0%, #010308 100%)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Background stars */}
      {[...Array(120)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: Math.random() * 0.8 + 0.1 }}
          transition={{ delay: Math.random() * 2, duration: 0.5 }}
          style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: Math.random() * 2 + 1,
            height: Math.random() * 2 + 1,
            borderRadius: '50%',
            background: '#fff8dc',
            boxShadow: '0 0 3px #fff8dc',
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Lantern flying up */}
      <motion.div
        initial={{ y: 100, opacity: 1, scale: 1 }}
        animate={{ y: phase >= 1 ? -400 : 100, opacity: phase >= 1 ? 0 : 1 }}
        transition={{ duration: 3, ease: 'easeIn' }}
        style={{ fontSize: '4rem', position: 'absolute', filter: 'drop-shadow(0 0 30px #ffd700)', zIndex: 10 }}
      >
        🏮
      </motion.div>

      {/* SHRESTA name forming */}
      <AnimatePresence>
        {phase >= 2 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.3rem', marginBottom: '2.5rem' }}
          >
            {letters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0, y: -30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.15, type: 'spring', damping: 10 }}
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(2rem, 7vw, 5rem)',
                  color: '#ffd700',
                  textShadow: '0 0 20px #ffd700, 0 0 50px #ffd70066, 0 0 80px #ffd70033',
                  fontWeight: 700,
                  display: 'inline-block',
                }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final line */}
      <AnimatePresence>
        {phase >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
            style={{ textAlign: 'center', maxWidth: 440, padding: '0 2rem' }}
          >
            <p style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
              color: '#c8a8f0',
              lineHeight: 2,
              textShadow: '0 0 20px rgba(200,168,240,0.5)',
            }}>
              "Some people leave footprints.
            </p>
            <p style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
              color: '#c8a8f0',
              lineHeight: 2,
              textShadow: '0 0 20px rgba(200,168,240,0.5)',
            }}>
              You leave hope."
            </p>

            {/* Fade to black */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 5, duration: 3 }}
              style={{
                position: 'fixed', inset: 0,
                background: '#000',
                zIndex: 600,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 6, duration: 2 }}
                style={{
                  fontFamily: 'var(--font-script)',
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  color: '#c8a8f0',
                  textShadow: '0 0 30px #c8a8f0',
                  textAlign: 'center',
                  padding: '0 2rem',
                }}
              >
                💜
              </motion.p>
              
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 9, duration: 1.5 }}
                onClick={() => navigate('/healing')}
                style={{
                  marginTop: '3rem',
                  background: 'none', border: '1px solid rgba(200,168,240,0.2)',
                  borderRadius: '2rem', padding: '0.6rem 2rem',
                  color: 'rgba(200,168,240,0.5)', fontFamily: 'var(--font-serif)',
                  fontSize: '0.9rem', cursor: 'pointer',
                  letterSpacing: '0.05em', fontStyle: 'italic'
                }}
                whileHover={{
                  color: '#c8a8f0',
                  borderColor: 'rgba(200,168,240,0.6)',
                  boxShadow: '0 0 15px rgba(200,168,240,0.3)',
                  scale: 1.05
                }}
              >
                Return to Forest 🌙
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const KabiniWorldPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeObj, setActiveObj] = useState<string | null>(null);
  const [foundObjects, setFoundObjects] = useState<Set<string>>(new Set());
  const [showLanternLetter, setShowLanternLetter] = useState(false);
  const [showFinale, setShowFinale] = useState(false);
  const [lanternFound, setLanternFound] = useState(false);

  const handleObjectClick = useCallback((id: string) => {
    setActiveObj(id);
  }, []);

  const handlePopupClose = useCallback((id: string) => {
    setFoundObjects(prev => new Set([...prev, id]));
    setActiveObj(null);
  }, []);

  const handleLanternClick = useCallback(() => {
    setLanternFound(true);
    setShowLanternLetter(true);
  }, []);

  const handleLetterFinish = useCallback(() => {
    setShowLanternLetter(false);
    setShowFinale(true);
  }, []);

  const activeObjData = HIDDEN_OBJECTS.find(o => o.id === activeObj);

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      minHeight: '100vh',
      overflow: 'hidden',
      background: 'linear-gradient(180deg, #0d0828 0%, #1a0e3f 18%, #2b1060 32%, #3d1a7a 45%, #2d1460 60%, #1a0a38 80%, #0a0520 100%)',
    }}>

      {/* ── Sky with stars ── */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
        {[...Array(160)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 65}%`,
            width: Math.random() * 2.5 + 0.5,
            height: Math.random() * 2.5 + 0.5,
            borderRadius: '50%',
            background: ['#fff8dc', '#c8a8f0', '#a8d8f0', '#ffffff'][Math.floor(Math.random() * 4)],
            opacity: Math.random() * 0.8 + 0.1,
            animation: `twinkle ${1.5 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite`,
          }} />
        ))}
      </div>

      {/* ── Moon ── */}
      <motion.div
        animate={{ boxShadow: ['0 0 30px rgba(200,168,240,0.3)', '0 0 60px rgba(200,168,240,0.6)', '0 0 30px rgba(200,168,240,0.3)'] }}
        transition={{ duration: 4, repeat: Infinity }}
        style={{
          position: 'absolute',
          top: '6%', right: '10%',
          width: 70, height: 70,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #fff8dc, #c8a8f0)',
          boxShadow: '0 0 30px rgba(200,168,240,0.4)',
          zIndex: 2,
          pointerEvents: 'none',
        }}
      />

      {/* ── Purple-blue sky gradient accent ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 0%, rgba(100,50,200,0.25) 0%, transparent 60%)',
      }} />

      {/* ── Flying birds ── */}
      {[0, 1, 2, 3, 4].map(i => <FlyingBird key={i} index={i} />)}

      {/* ── Fireflies ── */}
      {[...Array(28)].map((_, i) => <Firefly key={i} index={i} />)}

      {/* ── River / water at bottom ── */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        height: '20%',
        background: 'linear-gradient(180deg, rgba(30,60,120,0.4) 0%, rgba(20,40,90,0.8) 40%, rgba(10,20,60,0.95) 100%)',
        zIndex: 5,
        pointerEvents: 'none',
      }}>
        {/* Water shimmer */}
        <motion.div
          animate={{ x: ['-50%', '0%', '-50%'] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '200%', height: '100%',
            background: 'repeating-linear-gradient(90deg, transparent 0%, rgba(100,160,255,0.07) 50%, transparent 100%)',
          }}
        />
        {/* Water ripples */}
        {[15, 35, 55, 72, 88].map((x, i) => (
          <WaterRipple key={i} x={x} delay={i * 1.5} />
        ))}
        {/* Reflection of moon */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            position: 'absolute',
            top: '20%', right: '10%',
            width: 20, height: 60,
            background: 'linear-gradient(180deg, rgba(200,168,240,0.5), transparent)',
            borderRadius: '50%',
            filter: 'blur(4px)',
          }}
        />
      </div>

      {/* ── Wooden bridge ── */}
      <div style={{
        position: 'absolute',
        bottom: '17%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(320px, 55vw)',
        height: 50,
        zIndex: 6,
        pointerEvents: 'none',
      }}>
        <svg viewBox="0 0 300 50" style={{ width: '100%', height: '100%' }}>
          {/* Planks */}
          {[...Array(8)].map((_, i) => (
            <rect key={i} x={i * 37} y={10} width={32} height={12}
              rx={2} fill={`hsl(25, ${40 + i * 2}%, ${18 + i}%)`}
              stroke="rgba(0,0,0,0.3)" strokeWidth="0.5"
            />
          ))}
          {/* Rails */}
          <line x1="0" y1="8" x2="296" y2="8" stroke="#3a2010" strokeWidth="3" />
          <line x1="0" y1="24" x2="296" y2="24" stroke="#3a2010" strokeWidth="2" />
          {/* Posts */}
          {[0, 1, 2, 3, 4].map(i => (
            <line key={i} x1={i * 74} y1="0" x2={i * 74} y2="8" stroke="#3a2010" strokeWidth="2" />
          ))}
        </svg>
      </div>

      {/* ── Trees silhouette ── */}
      <div style={{
        position: 'absolute',
        bottom: '18%', left: 0, right: 0,
        height: '45%',
        zIndex: 4, pointerEvents: 'none',
      }}>
        <svg viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax meet"
          style={{ width: '100%', height: '100%', position: 'absolute', bottom: 0 }}>
          {/* Left trees */}
          <path d="M0,400 L0,200 Q20,180 40,200 Q60,140 80,160 Q90,120 110,140 Q120,100 140,120 Q160,80 180,100 Q200,60 220,80 L220,400Z"
            fill="#0a1f0a" opacity="0.95" />
          <path d="M150,400 L150,240 Q165,220 180,240 Q190,200 205,220 Q215,180 230,200 Q240,160 260,180 L260,400Z"
            fill="#0d250d" opacity="0.9" />
          {/* Right trees */}
          <path d="M1200,400 L1200,200 Q1180,180 1160,200 Q1140,140 1120,160 Q1110,120 1090,140 Q1080,100 1060,120 Q1040,80 1020,100 Q1000,60 980,80 L980,400Z"
            fill="#0a1f0a" opacity="0.95" />
          <path d="M1050,400 L1050,240 Q1035,220 1020,240 Q1010,200 995,220 Q985,180 970,200 Q960,160 940,180 L940,400Z"
            fill="#0d250d" opacity="0.9" />
          {/* Mid trees */}
          <path d="M350,400 L350,300 Q365,280 380,300 Q395,260 410,280 L410,400Z" fill="#0b220b" opacity="0.85" />
          <path d="M820,400 L820,290 Q838,268 856,290 Q868,248 882,270 L882,400Z" fill="#0b220b" opacity="0.85" />
          {/* Ground */}
          <rect x="0" y="380" width="1200" height="20" fill="#061306" />
        </svg>
      </div>

      {/* ── Basketball near a tree ── */}
      <motion.div
        className="clickable-obj"
        style={{
          position: 'absolute',
          left: HIDDEN_OBJECTS[0].x, top: HIDDEN_OBJECTS[0].y,
          fontSize: HIDDEN_OBJECTS[0].size,
          zIndex: 15,
          opacity: foundObjects.has('basketball') ? 0.4 : 1,
        }}
        animate={foundObjects.has('basketball') ? {} : {
          y: [0, -6, 0],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        onClick={() => !foundObjects.has('basketball') && handleObjectClick('basketball')}
        whileHover={{ scale: 1.2, filter: 'drop-shadow(0 0 18px #ff8c42)' }}
      >
        🏀
      </motion.div>

      {/* ── Lemon Rice basket ── */}
      <motion.div
        className="clickable-obj"
        style={{
          position: 'absolute',
          left: HIDDEN_OBJECTS[1].x, top: HIDDEN_OBJECTS[1].y,
          zIndex: 15,
          opacity: foundObjects.has('lemonrice') ? 0.4 : 1,
        }}
        animate={foundObjects.has('lemonrice') ? {} : { y: [0, -5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        onClick={() => !foundObjects.has('lemonrice') && handleObjectClick('lemonrice')}
        whileHover={{ scale: 1.2, filter: 'drop-shadow(0 0 18px #ffd700)' }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: HIDDEN_OBJECTS[1].size }}>🧺</div>
          <div style={{ fontSize: '1.4rem', marginTop: '-0.5rem' }}>🍋</div>
        </div>
      </motion.div>

      {/* ── Blue flower ── */}
      <motion.div
        className="clickable-obj"
        style={{
          position: 'absolute',
          left: HIDDEN_OBJECTS[2].x, top: HIDDEN_OBJECTS[2].y,
          fontSize: HIDDEN_OBJECTS[2].size,
          zIndex: 15,
          opacity: foundObjects.has('blueflower') ? 0.4 : 1,
        }}
        animate={foundObjects.has('blueflower') ? {} : { rotate: [-5, 5, -5], y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        onClick={() => !foundObjects.has('blueflower') && handleObjectClick('blueflower')}
        whileHover={{ scale: 1.2, filter: 'drop-shadow(0 0 18px #4fc3f7)' }}
      >
        💙
      </motion.div>

      {/* ── Purple flower ── */}
      <motion.div
        className="clickable-obj"
        style={{
          position: 'absolute',
          left: HIDDEN_OBJECTS[3].x, top: HIDDEN_OBJECTS[3].y,
          fontSize: HIDDEN_OBJECTS[3].size,
          zIndex: 15,
          opacity: foundObjects.has('purpleflower') ? 0.4 : 1,
        }}
        animate={foundObjects.has('purpleflower') ? {} : { rotate: [5, -5, 5], y: [0, -4, 0] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        onClick={() => !foundObjects.has('purpleflower') && handleObjectClick('purpleflower')}
        whileHover={{ scale: 1.2, filter: 'drop-shadow(0 0 18px #b784f0)' }}
      >
        💜
      </motion.div>

      {/* ── Movie ticket (Viswasam) ── */}
      <motion.div
        className="clickable-obj"
        style={{
          position: 'absolute',
          left: HIDDEN_OBJECTS[4].x, top: HIDDEN_OBJECTS[4].y,
          zIndex: 15,
          opacity: foundObjects.has('movieticket') ? 0.4 : 1,
        }}
        animate={foundObjects.has('movieticket') ? {} : { y: [0, -6, 0], rotate: [-3, 3, -3] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        onClick={() => !foundObjects.has('movieticket') && handleObjectClick('movieticket')}
        whileHover={{ scale: 1.2, filter: 'drop-shadow(0 0 18px #ff6b8a)' }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: HIDDEN_OBJECTS[4].size }}>🎬</div>
          <div style={{
            fontSize: '0.6rem',
            color: '#ff6b8a',
            fontFamily: 'var(--font-serif)',
            fontStyle: 'italic',
            marginTop: '-0.2rem',
            textShadow: '0 0 8px #ff6b8a',
            letterSpacing: '0.05em',
          }}>Viswasam</div>
        </div>
      </motion.div>

      {/* ── Final Lantern near river ── */}
      <motion.div
        style={{
          position: 'absolute',
          left: '50%', top: '25%',
          transform: 'translateX(-50%)',
          zIndex: 16, cursor: lanternFound ? 'default' : 'pointer',
          textAlign: 'center',
        }}
        animate={lanternFound ? { y: -300, opacity: 0 } : { y: [0, -12, 0], rotate: [-4, 4, -4] }}
        transition={lanternFound
          ? { duration: 3, ease: 'easeIn' }
          : { duration: 4, repeat: Infinity, ease: 'easeInOut' }
        }
        onClick={!lanternFound ? handleLanternClick : undefined}
        whileHover={!lanternFound ? { scale: 1.15, filter: 'drop-shadow(0 0 25px #ffd700)' } : {}}
      >
        <motion.div
          animate={{ filter: ['drop-shadow(0 0 15px #ffd700)', 'drop-shadow(0 0 35px #ffd700)', 'drop-shadow(0 0 15px #ffd700)'] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ fontSize: '3.5rem' }}
        >
          🏮
        </motion.div>
        {!lanternFound && (
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: '0.85rem',
              color: '#ffd700',
              marginTop: '0.3rem',
              textShadow: '0 0 10px #ffd70066',
              pointerEvents: 'none',
            }}
          >
            click me ✦
          </motion.p>
        )}
      </motion.div>

      {/* ── Scene description text ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 1.5 }}
        style={{
          position: 'absolute',
          top: '5%', left: '50%',
          transform: 'translateX(-50%)',
          textAlign: 'center',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-script)',
          fontSize: 'clamp(1rem, 2.5vw, 1.5rem)',
          color: 'rgba(200,168,240,0.7)',
          textShadow: '0 0 15px rgba(200,168,240,0.3)',
          letterSpacing: '0.05em',
        }}>
          🌿 Kabini Memory World 🌿
        </p>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
          color: 'rgba(200,168,240,0.4)',
          marginTop: '0.3rem',
        }}>
          A place made from memories
        </p>
      </motion.div>

      {/* ── Hint: found count ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        style={{
          position: 'fixed', bottom: '1.5rem', left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 20,
          display: 'flex', gap: '0.5rem', alignItems: 'center',
          background: 'rgba(10,5,30,0.7)',
          border: '1px solid rgba(200,168,240,0.2)',
          borderRadius: '2rem',
          padding: '0.5rem 1.2rem',
          backdropFilter: 'blur(8px)',
        }}
      >
        {HIDDEN_OBJECTS.map(o => (
          <motion.div
            key={o.id}
            animate={foundObjects.has(o.id) ? { scale: [1.3, 1], opacity: 1 } : { opacity: 0.3 }}
            style={{
              fontSize: '1rem',
              filter: foundObjects.has(o.id) ? `drop-shadow(0 0 6px ${o.color})` : 'grayscale(1)',
            }}
          >
            {o.emoji}
          </motion.div>
        ))}
        <div style={{
          fontSize: '0.75rem',
          color: 'rgba(200,168,240,0.6)',
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          marginLeft: '0.3rem',
        }}>
          {foundObjects.size}/{HIDDEN_OBJECTS.length}
        </div>
      </motion.div>

      {/* ── Object popup ── */}
      <AnimatePresence>
        {activeObjData && (
          <ObjectPopup
            key={activeObjData.id}
            obj={activeObjData}
            onClose={() => handlePopupClose(activeObjData.id)}
          />
        )}
      </AnimatePresence>

      {/* ── Lantern letter ── */}
      <AnimatePresence>
        {showLanternLetter && (
          <LanternLetter onFinish={handleLetterFinish} />
        )}
      </AnimatePresence>

      {/* ── Star finale ── */}
      <AnimatePresence>
        {showFinale && <StarFinale />}
      </AnimatePresence>

      {/* ── Back button (subtle) ── */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        whileHover={{ opacity: 1 }}
        onClick={() => navigate('/healing')}
        style={{
          position: 'fixed', top: '1.2rem', left: '1.2rem',
          zIndex: 20,
          background: 'rgba(10,5,30,0.6)',
          border: '1px solid rgba(200,168,240,0.2)',
          borderRadius: '2rem',
          padding: '0.4rem 1rem',
          color: 'rgba(200,168,240,0.7)',
          fontFamily: 'var(--font-serif)',
          fontStyle: 'italic',
          fontSize: '0.8rem',
          cursor: 'pointer',
          backdropFilter: 'blur(6px)',
        }}
      >
        ← Back
      </motion.button>
    </div>
  );
};

export default KabiniWorldPage;
