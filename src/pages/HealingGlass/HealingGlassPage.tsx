import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import HintCaption from '../../components/ui/HintCaption';
import AudioToggle from '../../components/ui/AudioToggle';

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase =
  | 'fade-in'
  | 'heart-appear'
  | 'cracking'
  | 'shatter'
  | 'collecting'
  | 'reassembling'
  | 'friendship'
  | 'questions'
  | 'final-question'
  | 'final-answer'
  | 'kabini-door'
  | 'ending';

// ─── Fragment Data ─────────────────────────────────────────────────────────────
const FRAGMENTS = [
  {
    id: 0, theme: 'First Meeting', emoji: '🌠',
    color: '#a8d8f0',
    animation: 'fireflies',
    text: 'Remember when two strangers accidentally met?',
    subtext: 'Out of all the people in all the places, somehow paths crossed.',
  },
  {
    id: 1, theme: 'Laughter', emoji: '⭐',
    color: '#ffd700',
    animation: 'stars',
    text: 'Some conversations lasted longer than expected.',
    subtext: 'Hours felt like minutes. Words kept finding more words.',
  },
  {
    id: 2, theme: 'Understanding', emoji: '🏮',
    color: '#ffb347',
    animation: 'lantern',
    text: 'Sometimes being understood feels like finding light in the dark.',
    subtext: 'Not everyone sees you. Some do. That is rare and worth remembering.',
  },
  {
    id: 3, theme: 'Difficult Days', emoji: '🌧️',
    color: '#87ceeb',
    animation: 'rain',
    text: 'Not every chapter was easy.',
    subtext: 'Some days were heavy. Some silences were loud. Still, you showed up.',
  },
  {
    id: 4, theme: 'Growth', emoji: '🌸',
    color: '#98fb98',
    animation: 'bloom',
    text: 'Both people changed.',
    subtext: 'That is what happens when someone truly enters your world.',
  },
  {
    id: 5, theme: 'Memories', emoji: '🦋',
    color: '#c8a8f0',
    animation: 'butterflies',
    text: 'Good memories remain even when time passes.',
    subtext: 'Some things leave fingerprints on your heart forever.',
  },
  {
    id: 6, theme: 'Healing', emoji: '✨',
    color: '#ffd700',
    animation: 'golden',
    text: 'Healing doesn\'t erase the past. It teaches us how to carry it.',
    subtext: 'And in carrying it, we become someone wiser, softer, and more whole.',
  },
];

// ─── Question Data ─────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    q: 'Who got confused more often?',
    options: ['Me 😅', 'You 😂', 'Both equally 🤷'],
    responses: [
      'Honestly? That tracks. The confusion was kind of adorable though. 🌸',
      'Ha! Not surprised. But somehow it always worked out. ✨',
      'A perfect pair of chaos. Somehow you both still managed to figure things out! 🦋',
    ],
  },
  {
    q: 'Who overthinks more?',
    options: ['Me 🧠', 'You 🤔', 'We\'re the same person 😭'],
    responses: [
      'At least your overthinking led to some great conversations. 💜',
      'Overthinking is just caring a lot in disguise. So... it\'s okay. 🌙',
      'Two overthinkers who somehow made it work. Impressive honestly. ⭐',
    ],
  },
  {
    q: 'Who would get lost first in this forest?',
    options: ['Me, obviously 😂', 'You, 100% 🌲', 'We\'d get lost together 🗺️'],
    responses: [
      'The forest would have found you eventually. It always does. 🦋',
      'Getting lost together would\'ve been the best adventure. 🌸',
      'Getting lost together sounds like the best kind of adventure. 🌙',
    ],
  },
  {
    q: 'Rate this enchanted forest ✨',
    options: ['10/10 🌟', '11/10 🔥', 'Off the charts 🚀'],
    responses: [
      'The forest smiles. It was made for someone worth it. 💜',
      'You deserve an 11/10 kind of life. Don\'t settle for less. ⭐',
      'You are off the charts too. Just so you know. 🦋',
    ],
  },
  {
    q: 'How many butterflies did you miss?',
    options: ['A few 🦋', 'Many 🦋🦋', 'I caught them all! 🏆'],
    responses: [
      'The ones you missed are still out there, flying for you. 🌸',
      'They\'ll come back. Butterflies always do. 💜',
      'Of course you did. You notice things others don\'t. ✨',
    ],
  },
];

const FINAL_OPTIONS = [
  { label: '🌸 Maybe We\'ll Make New Memories', response: 'Maybe is a beautiful word. It holds so much possibility. Whatever happens next, this chapter mattered. And so do you. 💜' },
  { label: '🦋 Let\'s See What The Future Brings', response: 'The future is unwritten. But you\'ve already proven you can walk through dark forests and still find the light. ✨' },
  { label: '🌙 Only Time Knows', response: 'And time is gentle with the things worth keeping. Whatever time brings, this was real. And real things don\'t fully disappear. 🌙' },
];

// ─── Floating Particle Component ──────────────────────────────────────────────
const FloatingParticles: React.FC<{ count?: number; color?: string }> = ({ count = 30, color = '#c8a8f0' }) => (
  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
    {[...Array(count)].map((_, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          width: Math.random() * 4 + 1,
          height: Math.random() * 4 + 1,
          borderRadius: '50%',
          background: color,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          boxShadow: `0 0 6px ${color}`,
          opacity: 0,
        }}
        animate={{
          y: [0, -(Math.random() * 150 + 50)],
          x: [0, (Math.random() - 0.5) * 80],
          opacity: [0, 0.8, 0],
          scale: [0.5, 1.2, 0],
        }}
        transition={{
          duration: Math.random() * 6 + 4,
          repeat: Infinity,
          delay: Math.random() * 6,
          ease: 'easeOut',
        }}
      />
    ))}
  </div>
);

// ─── Fog Layer ─────────────────────────────────────────────────────────────────
const FogLayer: React.FC = () => (
  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 1 }}>
    {[0, 1, 2].map((i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          width: '200%', height: '40%',
          bottom: `${i * 15}%`,
          background: `radial-gradient(ellipse at 50% 50%, rgba(150,120,200,${0.04 + i * 0.02}) 0%, transparent 70%)`,
          filter: 'blur(20px)',
        }}
        animate={{ x: ['-50%', '0%', '-50%'] }}
        transition={{ duration: 20 + i * 8, repeat: Infinity, ease: 'linear' }}
      />
    ))}
  </div>
);

// ─── Crystal Heart SVG ─────────────────────────────────────────────────────────
const CrystalHeart: React.FC<{ cracked?: boolean; shattered?: boolean; glowing?: boolean }> = ({ cracked, glowing }) => (
  <svg viewBox="0 0 200 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
    <defs>
      <filter id="crystal-glow">
        <feGaussianBlur stdDeviation={glowing ? '8' : '3'} result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <linearGradient id="crystal-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#e0f0ff" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#a8d8f0" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#c8a8f0" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id="gold-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#ffd700" />
        <stop offset="100%" stopColor="#ffb347" />
      </linearGradient>
    </defs>
    {/* Heart path */}
    <motion.path
      d="M100,160 C60,130 10,100 10,60 C10,30 35,10 60,10 C75,10 90,20 100,35 C110,20 125,10 140,10 C165,10 190,30 190,60 C190,100 140,130 100,160Z"
      fill="url(#crystal-grad)"
      stroke="rgba(200,168,240,0.6)"
      strokeWidth="1.5"
      filter="url(#crystal-glow)"
      animate={glowing ? { opacity: [0.8, 1, 0.8] } : {}}
      transition={{ repeat: Infinity, duration: 2 }}
    />
    {/* Shine */}
    <path d="M55,25 Q70,18 80,30 Q75,42 62,38Z" fill="rgba(255,255,255,0.5)" />
    <path d="M65,20 Q72,15 78,22" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Cracks */}
    {cracked && (
      <>
        <motion.path d="M100,80 L88,55 L95,40" stroke="rgba(255,255,255,0.8)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
        <motion.path d="M100,80 L115,60 L108,45" stroke="rgba(255,255,255,0.7)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.3 }} />
        <motion.path d="M100,80 L80,100 L90,120" stroke="rgba(255,255,255,0.6)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.6 }} />
        <motion.path d="M100,80 L120,95 L112,115" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4, delay: 0.9 }} />
      </>
    )}
  </svg>
);

// ─── Golden Heart (reassembled) ────────────────────────────────────────────────
const GoldenHeart: React.FC = () => (
  <svg viewBox="0 0 200 180" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
    <defs>
      <filter id="gold-glow-heart">
        <feGaussianBlur stdDeviation="10" result="blur" />
        <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <linearGradient id="gold-heart-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fff8dc" stopOpacity="0.95" />
        <stop offset="50%" stopColor="#ffd700" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#ffb347" stopOpacity="0.9" />
      </linearGradient>
    </defs>
    <motion.path
      d="M100,160 C60,130 10,100 10,60 C10,30 35,10 60,10 C75,10 90,20 100,35 C110,20 125,10 140,10 C165,10 190,30 190,60 C190,100 140,130 100,160Z"
      fill="url(#gold-heart-grad)"
      stroke="rgba(255,215,0,0.8)"
      strokeWidth="2"
      filter="url(#gold-glow-heart)"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', damping: 12, stiffness: 80 }}
    />
    {/* Golden crack lines */}
    {['M100,80 L88,55 L95,40', 'M100,80 L115,60 L108,45', 'M100,80 L80,100 L90,120', 'M100,80 L120,95 L112,115'].map((d, i) => (
      <motion.path key={i} d={d} stroke="#ffd700" strokeWidth="1.5" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.9 }}
        transition={{ duration: 0.6, delay: 0.3 + i * 0.15 }}
      />
    ))}
    <path d="M55,25 Q70,18 80,30 Q75,42 62,38Z" fill="rgba(255,255,255,0.6)" />
  </svg>
);

// ─── Fragment Component ────────────────────────────────────────────────────────
const FragmentShape: React.FC<{ index: number; color: string; collected: boolean }> = ({ index, color, collected }) => {
  const shapes = [
    'M0,0 L30,5 L25,30 L-5,28Z',
    'M0,15 L20,0 L35,20 L15,35Z',
    'M5,0 L30,10 L28,35 L0,25Z',
    'M0,5 L25,0 L30,25 L5,30Z',
    'M10,0 L35,15 L25,35 L0,20Z',
    'M0,0 L28,8 L22,32 L-2,20Z',
    'M5,5 L30,0 L32,28 L3,30Z',
  ][index % 7];

  return (
    <svg viewBox="-5 -5 45 45" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
      <defs>
        <filter id={`frag-glow-${index}`}>
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <linearGradient id={`frag-grad-${index}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <path d={shapes} fill={`url(#frag-grad-${index})`}
        stroke={collected ? '#ffd700' : color}
        strokeWidth="1"
        filter={`url(#frag-glow-${index})`}
      />
      {/* Shine */}
      <path d="M5,5 L12,3 L10,10Z" fill="rgba(255,255,255,0.7)" />
    </svg>
  );
};

// ─── Memory Sequence Overlay ───────────────────────────────────────────────────
const MemoryOverlay: React.FC<{ fragment: typeof FRAGMENTS[0]; onClose: () => void }> = ({ fragment, onClose }) => {
  const [textStep, setTextStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setTextStep(1), 1000);
    const t2 = setTimeout(() => setTextStep(2), 2500);
    const t3 = setTimeout(() => setTextStep(3), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const renderAnimation = () => {
    switch (fragment.animation) {
      case 'fireflies':
        return (
          <div style={{ position: 'relative', height: 120 }}>
            {[0, 1].map((i) => (
              <motion.div key={i}
                style={{ position: 'absolute', top: '50%', fontSize: '2rem' }}
                initial={{ x: i === 0 ? -80 : 80, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.3 }}
              >🌟</motion.div>
            ))}
            <motion.div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)' }}
              initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.5, 1], opacity: 1 }}
              transition={{ delay: 1.5, duration: 0.8 }}
            >
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#ffd700', boxShadow: '0 0 20px #ffd700, 0 0 40px #ffd70088' }} />
            </motion.div>
          </div>
        );
      case 'stars':
        return (
          <div style={{ position: 'relative', height: 120 }}>
            {[...Array(6)].map((_, i) => (
              <motion.div key={i}
                style={{ position: 'absolute', left: `${15 + i * 14}%`, top: '50%', fontSize: '1.4rem' }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, y: [-20, 0, -10] }}
                transition={{ delay: i * 0.2, duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
              >⭐</motion.div>
            ))}
          </div>
        );
      case 'lantern':
        return (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 120 }}>
            <motion.div
              initial={{ opacity: 0.2, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, filter: ['brightness(0.5)', 'brightness(1.5)', 'brightness(1)'] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: '4rem' }}
            >🏮</motion.div>
            <motion.div
              style={{ position: 'absolute', width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,150,50,0.3), transparent)' }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </div>
        );
      case 'rain':
        return (
          <div style={{ position: 'relative', height: 120, overflow: 'hidden' }}>
            {[...Array(15)].map((_, i) => (
              <motion.div key={i}
                style={{
                  position: 'absolute',
                  left: `${Math.random() * 100}%`,
                  top: -10,
                  width: 1.5,
                  height: 12,
                  background: 'rgba(135,206,235,0.7)',
                  borderRadius: 2,
                }}
                animate={{ y: [0, 130], opacity: [0.8, 0] }}
                transition={{ duration: 0.8 + Math.random() * 0.4, delay: Math.random() * 1.5, repeat: Infinity }}
              />
            ))}
            <motion.div style={{ position: 'absolute', bottom: 5, right: '20%', fontSize: '1.5rem' }}
              animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 1 }}
            >⚡</motion.div>
          </div>
        );
      case 'bloom':
        return (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', height: 120, alignItems: 'flex-end' }}>
            {['🌸', '🌺', '🌷', '🌸', '🌺'].map((f, i) => (
              <motion.div key={i}
                initial={{ scale: 0, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                transition={{ delay: i * 0.25, type: 'spring', damping: 10 }}
                style={{ fontSize: '2rem' }}
              >{f}</motion.div>
            ))}
          </div>
        );
      case 'butterflies':
        return (
          <div style={{ position: 'relative', height: 120 }}>
            {['🦋', '🦋', '🦋'].map((b, i) => (
              <motion.div key={i}
                style={{ position: 'absolute', fontSize: '1.8rem', top: `${20 + i * 20}%` }}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: ['-10%', '110%'], opacity: [0, 1, 1, 0] }}
                transition={{ duration: 3 + i, delay: i * 0.6, repeat: Infinity, repeatDelay: 1 }}
              >{b}</motion.div>
            ))}
          </div>
        );
      case 'golden':
        return (
          <div style={{ position: 'relative', height: 120, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div
              style={{ width: 60, height: 60, borderRadius: '50%', background: 'radial-gradient(circle, #ffd700, #ffb347)' }}
              animate={{ scale: [1, 1.4, 1], boxShadow: ['0 0 20px #ffd700', '0 0 60px #ffd700', '0 0 20px #ffd700'] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
            {[...Array(8)].map((_, i) => (
              <motion.div key={i}
                style={{
                  position: 'absolute',
                  width: 2, height: 20,
                  background: '#ffd700',
                  transformOrigin: '50% 100%',
                  transform: `rotate(${i * 45}deg) translateY(-40px)`,
                  borderRadius: 2,
                }}
                animate={{ opacity: [0.3, 1, 0.3], scaleY: [0.8, 1.3, 0.8] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.19 }}
              />
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'radial-gradient(ellipse at 50% 50%, rgba(20,10,40,0.97), rgba(5,5,20,0.99))',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        backdropFilter: 'blur(8px)',
        padding: '2rem',
      }}
    >
      {/* Fragment emoji */}
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 10 }}
        style={{ fontSize: '3rem', marginBottom: '1.5rem', filter: `drop-shadow(0 0 15px ${fragment.color})` }}
      >
        {fragment.emoji}
      </motion.div>

      {/* Theme title */}
      <motion.h3
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
          color: fragment.color,
          textShadow: `0 0 15px ${fragment.color}`,
          marginBottom: '1rem', textAlign: 'center',
        }}
      >
        ✦ {fragment.theme} ✦
      </motion.h3>

      {/* Animation scene */}
      <motion.div
        style={{ width: 'min(400px, 90vw)', marginBottom: '1.5rem' }}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
      >
        {renderAnimation()}
      </motion.div>

      {/* Text */}
      <AnimatePresence>
        {textStep >= 1 && (
          <motion.p
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
              color: '#fff8dc', textAlign: 'center',
              maxWidth: 480, lineHeight: 1.6,
              textShadow: '0 0 20px rgba(255,248,220,0.4)',
              marginBottom: '0.5rem',
            }}
          >
            "{fragment.text}"
          </motion.p>
        )}
        {textStep >= 2 && (
          <motion.p
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            style={{
              fontFamily: 'var(--font-serif)', fontStyle: 'italic',
              fontSize: 'clamp(0.85rem, 2vw, 1.1rem)',
              color: 'rgba(200,168,240,0.85)', textAlign: 'center',
              maxWidth: 420, lineHeight: 1.7,
            }}
          >
            {fragment.subtext}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Continue button */}
      <AnimatePresence>
        {textStep >= 3 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            className="btn-magic"
            onClick={onClose}
            style={{ marginTop: '2rem', borderColor: `${fragment.color}88`, color: fragment.color }}
          >
            Place Fragment 💎
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Question Card ─────────────────────────────────────────────────────────────
const QuestionCard: React.FC<{
  q: typeof QUESTIONS[0]; index: number; onAnswer: (response: string) => void;
}> = ({ q, index, onAnswer }) => {
  const [flipped, setFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState('');

  const handleAnswer = (i: number) => {
    if (answered) return;
    setAnswered(true);
    setSelectedResponse(q.responses[i]);
    setTimeout(() => onAnswer(q.responses[i]), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 60, rotateX: -30 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: index * 0.1, type: 'spring', damping: 15 }}
      style={{ perspective: 1000 }}
    >
      <motion.div
        onClick={() => !flipped && setFlipped(true)}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: 'min(340px, 88vw)',
          height: answered ? 260 : 280, // Fixed height to prevent collapse since children are absolute
          cursor: flipped ? 'default' : 'pointer',
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}
      >
        {/* Front */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          background: 'rgba(20,10,40,0.85)',
          border: '1px solid rgba(200,168,240,0.3)',
          borderRadius: '1.2rem',
          padding: '1.5rem',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,168,240,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
            color: '#fff8dc',
            textShadow: '0 0 10px rgba(255,248,220,0.3)',
          }}>
            🃏 Tap to reveal...
          </p>
        </div>

        {/* Back */}
        <div style={{
          position: 'absolute', inset: 0,
          backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          background: 'rgba(20,10,40,0.85)',
          border: '1px solid rgba(200,168,240,0.3)',
          borderRadius: '1.2rem',
          padding: '1.5rem',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(200,168,240,0.1)',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: '#fff8dc',
            marginBottom: '1.2rem', lineHeight: 1.5,
            textShadow: '0 0 10px rgba(255,248,220,0.3)',
          }}>
            {q.q}
          </p>
          {!answered && q.options.map((opt, i) => (
            <motion.button key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.12 }}
              onClick={(e) => { e.stopPropagation(); handleAnswer(i); }}
              whileHover={{ scale: 1.04, x: 4 }}
              style={{
                display: 'block', width: '100%', marginBottom: '0.5rem',
                background: 'rgba(200,168,240,0.1)',
                border: '1px solid rgba(200,168,240,0.3)',
                borderRadius: '0.8rem', padding: '0.6rem 1rem',
                color: '#c8a8f0', fontFamily: 'var(--font-serif)',
                fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              {opt}
            </motion.button>
          ))}
          {answered && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ color: '#ffd700', fontStyle: 'italic', fontSize: '0.95rem', lineHeight: 1.6 }}
            >
              {selectedResponse}
            </motion.p>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Typewriter Text ───────────────────────────────────────────────────────────
const TypewriterText: React.FC<{ text: string; delay?: number; style?: React.CSSProperties }> = ({ text, delay = 0, style }) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay * 1000);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 40);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: started ? 1 : 0 }}
      style={{ fontFamily: 'var(--font-serif)', ...style }}
    >
      {displayed}
      {started && displayed.length < text.length && (
        <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }}>|</motion.span>
      )}
    </motion.p>
  );
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
const HealingGlassPage: React.FC = () => {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>('fade-in');
  const [collectedFragments, setCollectedFragments] = useState<Set<number>>(new Set());
  const [activeMemory, setActiveMemory] = useState<number | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [finalAnswer, setFinalAnswer] = useState('');
  const [shakeScreen, setShakeScreen] = useState(false);
  const [burstParticles, setBurstParticles] = useState(false);
  const pageRef = useRef<HTMLDivElement>(null);

  // Fragment positions (scattered around center)
  const fragmentPositions = [
    { x: '15%', y: '25%' },
    { x: '75%', y: '20%' },
    { x: '8%',  y: '55%' },
    { x: '82%', y: '50%' },
    { x: '20%', y: '72%' },
    { x: '70%', y: '75%' },
    { x: '48%', y: '15%' },
  ];

  // Orchestrate intro sequence
  useEffect(() => {
    const t1 = setTimeout(() => setPhase('heart-appear'), 1200);
    const t2 = setTimeout(() => setPhase('cracking'), 4500);
    const t3 = setTimeout(() => {
      setPhase('shatter');
      setShakeScreen(true);
      setBurstParticles(true);
      setTimeout(() => setShakeScreen(false), 600);
    }, 7000);
    const t4 = setTimeout(() => setPhase('collecting'), 9500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const handleFragmentClick = useCallback((index: number) => {
    if (collectedFragments.has(index)) return;
    setActiveMemory(index);
  }, [collectedFragments]);

  const handleMemoryClose = useCallback(() => {
    if (activeMemory === null) return;
    const newSet = new Set(collectedFragments);
    newSet.add(activeMemory);
    setCollectedFragments(newSet);
    setActiveMemory(null);
    if (newSet.size === FRAGMENTS.length) {
      setTimeout(() => setPhase('reassembling'), 800);
      setTimeout(() => setPhase('friendship'), 4500);
    }
  }, [activeMemory, collectedFragments]);

  const handleQuestionAnswered = useCallback(() => {
    setTimeout(() => {
      if (questionIndex < QUESTIONS.length - 1) {
        setQuestionIndex((q) => q + 1);
      } else {
        setPhase('final-question');
      }
    }, 2000);
  }, [questionIndex]);

  const handleFinalAnswer = (response: string) => {
    setFinalAnswer(response);
    setPhase('final-answer');
    setTimeout(() => setPhase('kabini-door'), 5000);
  };

  const bgStyle: React.CSSProperties = {
    position: 'relative',
    minHeight: '100vh',
    width: '100%',
    background: 'radial-gradient(ellipse at 30% 30%, #12052a 0%, #080520 50%, #030215 100%)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  return (
    <div ref={pageRef} style={bgStyle}>
      <FogLayer />
      <FloatingParticles count={25} color="#c8a8f0" />
      <FloatingParticles count={15} color="#a8d8f0" />

      {/* Light rays */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {[30, 50, 70].map((x, i) => (
          <motion.div key={i} style={{
            position: 'absolute', top: 0,
            left: `${x}%`, width: '2px', height: '70%',
            background: `linear-gradient(180deg, rgba(200,168,240,${0.05 + i * 0.02}), transparent)`,
            filter: 'blur(8px)',
            transform: `rotate(${(i - 1) * 8}deg)`, transformOrigin: 'top center',
          }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 5 + i * 2 }}
          />
        ))}
      </div>

      {/* ── PHASE: FADE-IN ── */}
      <AnimatePresence>
        {phase === 'fade-in' && (
          <motion.div
            exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: '#000', zIndex: 50 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          />
        )}
      </AnimatePresence>

      {/* ── PHASE: HEART APPEAR & CRACKING ── */}
      <AnimatePresence>
        {(phase === 'heart-appear' || phase === 'cracking') && (
          <motion.div
            key="heart-phase"
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.2, transition: { duration: 0.2 } }}
            transition={{ duration: 1, type: 'spring', damping: 14 }}
            style={{ position: 'relative', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
          >
            <motion.div
              style={{ width: 'min(200px, 45vw)', height: 'min(180px, 40vw)', position: 'relative' }}
              animate={phase === 'heart-appear' ? {
                filter: ['drop-shadow(0 0 15px #a8d8f0)', 'drop-shadow(0 0 30px #a8d8f0)', 'drop-shadow(0 0 15px #a8d8f0)'],
              } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <CrystalHeart cracked={phase === 'cracking'} glowing />
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: phase === 'cracking' ? 1 : 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              style={{
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                color: '#fff8dc', textAlign: 'center', maxWidth: 480,
                padding: '0 2rem', lineHeight: 1.8,
              }}
            >
              "Some things don't break because they were weak."
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: phase === 'cracking' ? 1 : 0 }}
              transition={{ duration: 1, delay: 2.0 }}
              style={{
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                color: 'rgba(200,168,240,0.9)', textAlign: 'center', maxWidth: 420,
                padding: '0 2rem', lineHeight: 1.8,
              }}
            >
              "Sometimes they break because they carried too much."
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── SHATTER BURST ── */}
      <AnimatePresence>
        {(phase === 'shatter' || burstParticles) && phase !== 'collecting' && (
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 30 }}>
            {[...Array(40)].map((_, i) => (
              <motion.div key={i}
                initial={{ x: '50vw', y: '50vh', scale: 1, opacity: 1 }}
                animate={{
                  x: `${Math.random() * 100}vw`,
                  y: `${Math.random() * 100}vh`,
                  scale: 0, opacity: 0,
                }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: Math.random() * 0.3 }}
                style={{
                  position: 'absolute',
                  width: Math.random() * 8 + 3,
                  height: Math.random() * 8 + 3,
                  borderRadius: '2px',
                  background: ['#a8d8f0', '#c8a8f0', '#fff8dc', '#87ceeb', '#ffd700'][Math.floor(Math.random() * 5)],
                  boxShadow: '0 0 6px rgba(200,168,240,0.8)',
                  top: 0, left: 0,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ── SCREEN SHAKE ── */}
      <motion.div
        style={{ position: 'absolute', inset: 0, zIndex: 99, pointerEvents: 'none' }}
        animate={shakeScreen ? { x: [0, -8, 8, -6, 6, -3, 3, 0], y: [0, 5, -5, 3, -3, 0] } : {}}
        transition={{ duration: 0.5 }}
      />

      {/* ── PHASE: COLLECTING FRAGMENTS ── */}
      <AnimatePresence>
        {phase === 'collecting' && (
          <motion.div
            key="collecting"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'relative', zIndex: 20, width: '100%', height: '100vh' }}
          >
            {/* Instruction */}
            <motion.div
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', padding: '2rem 1rem 0', pointerEvents: 'none' }}
            >
              <h2 style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
                color: '#c8a8f0', textShadow: '0 0 15px #c8a8f0',
                marginBottom: '0.5rem',
              }}>
                ✦ The Healing Glass ✦
              </h2>
              <p style={{ fontFamily: 'var(--font-serif)', color: 'rgba(200,168,240,0.7)', fontSize: '0.95rem' }}>
                Collect all 7 fragments to restore the heart
              </p>
              {/* Progress */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.4rem', marginTop: '0.8rem' }}>
                {FRAGMENTS.map((_, i) => (
                  <motion.div key={i}
                    style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: collectedFragments.has(i) ? '#ffd700' : 'rgba(200,168,240,0.2)',
                      border: '1px solid rgba(200,168,240,0.4)',
                      boxShadow: collectedFragments.has(i) ? '0 0 8px #ffd700' : 'none',
                    }}
                    animate={collectedFragments.has(i) ? { scale: [1, 1.4, 1] } : {}}
                    transition={{ duration: 0.4 }}
                  />
                ))}
              </div>
            </motion.div>

            {/* Floating fragments */}
            {FRAGMENTS.map((frag, i) => (
              <AnimatePresence key={i}>
                {!collectedFragments.has(i) ? (
                  <motion.div
                    style={{
                      position: 'absolute',
                      left: fragmentPositions[i].x,
                      top: fragmentPositions[i].y,
                      width: 55, height: 55,
                      cursor: 'pointer',
                      zIndex: 30,
                    }}
                    initial={{ opacity: 0, scale: 0, rotate: Math.random() * 360 }}
                    animate={{
                      opacity: 1, scale: 1, rotate: 0,
                      y: [0, -12, 0, 8, 0],
                      x: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      opacity: { delay: i * 0.15, duration: 0.5 },
                      scale: { delay: i * 0.15, duration: 0.5, type: 'spring' },
                      rotate: { delay: i * 0.15, duration: 0.5 },
                      y: { delay: i * 0.15 + 0.5, duration: 4 + i * 0.5, repeat: Infinity, ease: 'easeInOut' },
                      x: { delay: i * 0.15 + 0.5, duration: 5 + i * 0.4, repeat: Infinity, ease: 'easeInOut' },
                    }}
                    whileHover={{ scale: 1.35, filter: `drop-shadow(0 0 16px ${frag.color})` }}
                    whileTap={{ scale: 0.85 }}
                    onClick={() => handleFragmentClick(i)}
                    title={`Fragment: ${frag.theme}`}
                  >
                    <FragmentShape index={i} color={frag.color} collected={false} />
                    <motion.div style={{
                      position: 'absolute', bottom: -18,
                      left: '50%', transform: 'translateX(-50%)',
                      fontSize: '0.65rem', color: frag.color, whiteSpace: 'nowrap',
                      fontFamily: 'var(--font-serif)',
                    }}
                      animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }}>
                      {frag.theme}
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div
                    key={`collected-${i}`}
                    style={{
                      position: 'absolute', left: fragmentPositions[i].x, top: fragmentPositions[i].y,
                      width: 55, height: 55, zIndex: 25,
                    }}
                    initial={{ opacity: 1 }}
                    animate={{ x: `calc(50vw - ${fragmentPositions[i].x} - 27px)`, y: `calc(50vh - ${fragmentPositions[i].y} - 27px)`, opacity: 0, scale: 0 }}
                    transition={{ duration: 0.8, ease: 'easeInOut' }}
                  >
                    <FragmentShape index={i} color={frag.color} collected />
                  </motion.div>
                )}
              </AnimatePresence>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MEMORY OVERLAY ── */}
      <AnimatePresence>
        {activeMemory !== null && phase === 'collecting' && (
          <MemoryOverlay fragment={FRAGMENTS[activeMemory]} onClose={handleMemoryClose} />
        )}
      </AnimatePresence>

      {/* ── PHASE: REASSEMBLING ── */}
      <AnimatePresence>
        {phase === 'reassembling' && (
          <motion.div
            key="reassembling"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'relative', zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}
          >
            {/* Gathering particles */}
            {[...Array(25)].map((_, i) => (
              <motion.div key={i}
                initial={{
                  x: (Math.random() - 0.5) * 600,
                  y: (Math.random() - 0.5) * 600,
                  opacity: 0.8, scale: 1,
                }}
                animate={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                transition={{ duration: 1.5, delay: i * 0.06, ease: 'easeIn' }}
                style={{
                  position: 'absolute',
                  width: 6, height: 6, borderRadius: '50%',
                  background: ['#ffd700', '#c8a8f0', '#a8d8f0'][i % 3],
                  boxShadow: '0 0 8px rgba(255,215,0,0.8)',
                }}
              />
            ))}

            {/* Golden heart */}
            <motion.div style={{ width: 'min(200px, 45vw)', height: 'min(180px, 40vw)' }}>
              <GoldenHeart />
            </motion.div>

            {/* Butterflies gathering */}
            <motion.div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {['🦋', '🦋', '🦋', '🦋', '🦋'].map((b, i) => (
                <motion.div key={i}
                  style={{ position: 'absolute', fontSize: '1.6rem' }}
                  initial={{ x: `${(i - 2) * 30}vw`, y: `${(i % 3 - 1) * 30}vh`, opacity: 0 }}
                  animate={{ x: 0, y: 0, opacity: 1 }}
                  transition={{ duration: 2, delay: i * 0.3, ease: 'easeOut' }}
                >
                  {b}
                </motion.div>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
              style={{
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: 'clamp(1rem, 2.5vw, 1.4rem)',
                color: '#ffd700', textAlign: 'center', maxWidth: 420,
                textShadow: '0 0 20px #ffd700', padding: '0 2rem',
              }}
            >
              ✨ The heart is whole again...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PHASE: FRIENDSHIP CHAPTER ── */}
      <AnimatePresence>
        {phase === 'friendship' && (
          <motion.div
            key="friendship"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'relative', zIndex: 20,
              width: '100%', minHeight: '100vh',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '2rem',
            }}
          >
            {/* Magic door opening */}
            <motion.div
              initial={{ scaleY: 0 }} animate={{ scaleY: 1, opacity: [0, 1, 0] }}
              transition={{ duration: 2, ease: 'easeOut' }}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 120, height: 200,
                border: '2px solid #ffd700',
                borderRadius: '60px 60px 0 0',
                boxShadow: '0 0 40px #ffd70066',
                transformOrigin: 'bottom center',
              }}
            />

            {/* Golden particles from door */}
            <motion.div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
              {[...Array(30)].map((_, i) => (
                <motion.div key={i}
                  initial={{ x: '50vw', y: '50vh', opacity: 1, scale: 1 }}
                  animate={{
                    x: `${30 + Math.random() * 40}vw`,
                    y: `${20 + Math.random() * 60}vh`,
                    opacity: 0, scale: 0,
                  }}
                  transition={{ duration: 2, delay: i * 0.07, ease: 'easeOut' }}
                  style={{
                    position: 'absolute', width: 5, height: 5,
                    borderRadius: '50%', background: '#ffd700',
                    boxShadow: '0 0 8px #ffd700',
                  }}
                />
              ))}
            </motion.div>

            {/* Chapter title */}
            <motion.h2
              initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.5, type: 'spring', damping: 12 }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                color: '#ffd700', textShadow: '0 0 25px #ffd700, 0 0 50px #ffd70066',
                textAlign: 'center', marginBottom: '2.5rem',
              }}
            >
              ✦ A Chapter I Wanted To Keep ✦
            </motion.h2>

            {/* Story lines */}
            <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }}>
              {[
                { text: 'We met as strangers.', delay: 2.0, color: '#fff8dc' },
                { text: 'Shared random conversations.', delay: 3.0, color: '#c8a8f0' },
                { text: 'Shared laughs.', delay: 4.0, color: '#ffd700' },
                { text: 'Shared difficult moments.', delay: 5.2, color: '#87ceeb' },
                { text: 'Shared memories.', delay: 6.4, color: '#ffb6c1' },
                { text: 'Some chapters became messy.', delay: 7.8, color: '#a8d8f0' },
                { text: 'Some became beautiful.', delay: 9.0, color: '#98fb98' },
                { text: 'But I\'m still grateful this chapter existed.', delay: 10.5, color: '#ffd700' },
              ].map((line, i) => (
                <TypewriterText
                  key={i}
                  text={line.text}
                  delay={line.delay}
                  style={{
                    fontSize: 'clamp(1rem, 2.5vw, 1.3rem)',
                    color: line.color,
                    marginBottom: '0.8rem',
                    lineHeight: 1.8,
                    fontStyle: 'italic',
                    textShadow: `0 0 12px ${line.color}66`,
                  }}
                />
              ))}
            </div>

            <motion.button
              className="btn-magic"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 13 }}
              onClick={() => setPhase('questions')}
              style={{ marginTop: '2.5rem', borderColor: '#ffd70088', color: '#ffd700' }}
            >
              Continue the Story ✨
            </motion.button>

            {/* Background floating elements */}
            {['🦋', '🌸', '⭐', '🦋', '💫'].map((e, i) => (
              <motion.div key={i}
                style={{
                  position: 'absolute', fontSize: '1.2rem', opacity: 0.3,
                  left: `${5 + i * 20}%`, top: `${10 + (i % 3) * 30}%`,
                  pointerEvents: 'none',
                }}
                animate={{ y: [0, -20, 0], rotate: [0, 15, 0] }}
                transition={{ repeat: Infinity, duration: 4 + i, ease: 'easeInOut' }}
              >
                {e}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PHASE: QUESTIONS ── */}
      <AnimatePresence>
        {phase === 'questions' && (
          <motion.div
            key="questions"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'relative', zIndex: 20,
              width: '100%', minHeight: '100vh',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '2rem 1rem',
            }}
          >
            <motion.h2
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.3rem, 3.5vw, 2rem)',
                color: '#c8a8f0', textShadow: '0 0 15px #c8a8f0',
                marginBottom: '2rem', textAlign: 'center',
              }}
            >
              🃏 Fun Questions
            </motion.h2>

            {QUESTIONS.slice(0, questionIndex + 1).map((q, i) => (
              <div key={i} style={{ marginBottom: '1.5rem' }}>
                <QuestionCard
                  q={q}
                  index={i}
                  onAnswer={i === questionIndex ? handleQuestionAnswered : () => {}}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PHASE: FINAL QUESTION ── */}
      <AnimatePresence>
        {phase === 'final-question' && (
          <motion.div
            key="final-q"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'relative', zIndex: 20,
              width: '100%', minHeight: '100vh',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '2rem',
            }}
          >
            {/* Butterfly lands */}
            <motion.div
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 15, delay: 0.5 }}
              style={{ fontSize: '3.5rem', marginBottom: '2rem', filter: 'drop-shadow(0 0 15px #c8a8f0)' }}
            >
              🦋
            </motion.div>

            <TypewriterText text="One last question..." delay={1} style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: '#fff8dc',
              marginBottom: '0.5rem', fontStyle: 'italic',
            }} />
            <TypewriterText text="No pressure." delay={2.5} style={{
              fontSize: 'clamp(0.85rem, 2vw, 1.1rem)', color: 'rgba(200,168,240,0.7)',
              marginBottom: '0.3rem', fontStyle: 'italic',
            }} />
            <TypewriterText text="No right answer." delay={3.8} style={{
              fontSize: 'clamp(0.85rem, 2vw, 1.1rem)', color: 'rgba(200,168,240,0.7)',
              marginBottom: '2.5rem', fontStyle: 'italic',
            }} />

            <motion.div
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 5.5 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: 'min(420px, 90vw)' }}
            >
              {FINAL_OPTIONS.map((opt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 5.5 + i * 0.2 }}
                  whileHover={{ scale: 1.03, x: 6, boxShadow: '0 0 20px rgba(200,168,240,0.3)' }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleFinalAnswer(opt.response)}
                  style={{
                    background: 'rgba(20,10,40,0.85)',
                    border: '1px solid rgba(200,168,240,0.3)',
                    borderRadius: '1rem', padding: '1rem 1.5rem',
                    color: '#c8a8f0', fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(0.9rem, 2vw, 1.1rem)',
                    cursor: 'pointer', textAlign: 'left',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.3s',
                  }}
                >
                  {opt.label}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PHASE: FINAL ANSWER ── */}
      <AnimatePresence>
        {phase === 'final-answer' && (
          <motion.div
            key="final-ans"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'relative', zIndex: 20,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              minHeight: '100vh', padding: '3rem 2rem', textAlign: 'center',
            }}
          >
            <motion.div
              initial={{ y: 0 }} animate={{ y: -80, opacity: 0 }}
              transition={{ delay: 3.5, duration: 1.5 }}
              style={{ fontSize: '4rem', marginBottom: '2rem' }}
            >
              🦋
            </motion.div>
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              style={{
                fontFamily: 'var(--font-serif)', fontStyle: 'italic',
                fontSize: 'clamp(1rem, 2.5vw, 1.35rem)',
                color: '#fff8dc', maxWidth: 480, lineHeight: 1.9,
                textShadow: '0 0 15px rgba(255,248,220,0.3)',
              }}
            >
              "{finalAnswer}"
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PHASE: KABINI DOOR (hidden chapter reveal) ── */}
      <AnimatePresence>
        {phase === 'kabini-door' && (
          <motion.div
            key="kabini-door"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              background: 'radial-gradient(ellipse at 50% 60%, #1a0a3a 0%, #050310 100%)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '2rem',
            }}
          >
            {/* Stars */}
            {[...Array(80)].map((_, i) => (
              <motion.div key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: Math.random() * 0.8 + 0.1 }}
                transition={{ delay: Math.random() * 2, duration: 0.6 }}
                style={{
                  position: 'absolute',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: Math.random() * 2.5 + 0.5,
                  height: Math.random() * 2.5 + 0.5,
                  borderRadius: '50%',
                  background: '#fff8dc',
                  boxShadow: '0 0 4px #fff8dc',
                  pointerEvents: 'none',
                }}
              />
            ))}

            {/* Hint text */}
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              style={{
                fontFamily: 'var(--font-script)',
                fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                color: 'rgba(200,168,240,0.5)',
                marginBottom: '0.5rem',
                fontStyle: 'italic',
              }}
            >
              The screen doesn't close...
            </motion.p>

            {/* "One last place remains..." */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.8, 1] }}
              transition={{ delay: 2, duration: 2 }}
              style={{
                fontFamily: 'var(--font-script)',
                fontSize: 'clamp(1.1rem, 2.8vw, 1.6rem)',
                color: '#ffd700',
                textShadow: '0 0 20px #ffd70066',
                marginBottom: '2.5rem',
                fontStyle: 'italic',
                letterSpacing: '0.05em',
              }}
            >
              One last place remains...
            </motion.p>

            {/* Glowing Door */}
            <motion.div
              initial={{ opacity: 0, scale: 0.4, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 3.5, duration: 1.2, type: 'spring', damping: 12 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
            >
              <motion.div
                onClick={() => navigate('/kabini')}
                animate={{
                  boxShadow: [
                    '0 0 30px rgba(100,50,200,0.4), 0 0 60px rgba(200,168,240,0.2)',
                    '0 0 55px rgba(100,50,200,0.8), 0 0 110px rgba(200,168,240,0.45)',
                    '0 0 30px rgba(100,50,200,0.4), 0 0 60px rgba(200,168,240,0.2)',
                  ],
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
                whileHover={{
                  scale: 1.07,
                  boxShadow: '0 0 80px rgba(200,168,240,0.9), 0 0 130px rgba(100,50,200,0.6)',
                }}
                whileTap={{ scale: 0.96 }}
                style={{
                  position: 'relative',
                  width: 'clamp(100px, 16vw, 150px)',
                  height: 'clamp(160px, 26vw, 240px)',
                  cursor: 'pointer',
                  borderRadius: '50% 50% 4px 4px / 28% 28% 4px 4px',
                  background: 'linear-gradient(180deg, rgba(80,30,160,0.9) 0%, rgba(40,10,100,0.95) 100%)',
                  border: '2px solid rgba(200,168,240,0.65)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {/* Inner glow */}
                <motion.div
                  animate={{ opacity: [0.3, 0.9, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'radial-gradient(ellipse at 50% 25%, rgba(200,168,240,0.35), transparent 70%)',
                  }}
                />
                {/* Fireflies inside */}
                {[...Array(6)].map((_, i) => (
                  <motion.div key={i}
                    animate={{
                      y: [15, -18, 15],
                      x: [(i - 2.5) * 10, (2.5 - i) * 10, (i - 2.5) * 10],
                      opacity: [0, 1, 0],
                    }}
                    transition={{ duration: 2.2 + i * 0.3, repeat: Infinity, delay: i * 0.45 }}
                    style={{
                      position: 'absolute',
                      width: 3, height: 3, borderRadius: '50%',
                      background: '#aaff88',
                      boxShadow: '0 0 8px #aaff88',
                    }}
                  />
                ))}
                {/* Doorknob */}
                <div style={{
                  position: 'absolute',
                  right: '20%', top: '52%',
                  width: 9, height: 9, borderRadius: '50%',
                  background: '#ffd700',
                  boxShadow: '0 0 10px #ffd700',
                }} />
                {/* Door panel */}
                <div style={{
                  position: 'absolute',
                  top: '14%', left: '14%', right: '14%', bottom: '28%',
                  border: '1px solid rgba(200,168,240,0.25)',
                  borderRadius: '30% 30% 2px 2px / 14% 14% 2px 2px',
                }} />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.7, 0.5, 0.8] }}
                transition={{ delay: 5, duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                style={{
                  fontFamily: 'var(--font-script)',
                  fontSize: '0.9rem',
                  color: 'rgba(200,168,240,0.6)',
                  marginTop: '1.2rem',
                  fontStyle: 'italic',
                }}
              >
                click to enter ✦
              </motion.p>
            </motion.div>

            {/* Skip → go to The End */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 7 }}
              onClick={() => setPhase('ending')}
              style={{
                marginTop: '3rem',
                background: 'none',
                border: '1px solid rgba(200,168,240,0.15)',
                borderRadius: '2rem',
                padding: '0.45rem 1.4rem',
                color: 'rgba(200,168,240,0.35)',
                fontFamily: 'var(--font-serif)',
                fontStyle: 'italic',
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
            >
              Skip → The End
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── PHASE: ENDING ── */}
      <AnimatePresence>
        {phase === 'ending' && (
          <motion.div
            key="ending"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 100,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '2rem',
            }}
          >
            {/* Stars filling screen */}
            {[...Array(80)].map((_, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: Math.random() * 0.9 + 0.1, scale: 1 }}
                transition={{ delay: Math.random() * 2, duration: 0.5 }}
                style={{
                  position: 'absolute',
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  width: Math.random() * 3 + 1,
                  height: Math.random() * 3 + 1,
                  borderRadius: '50%',
                  background: '#fff8dc',
                  boxShadow: '0 0 4px #fff8dc',
                  pointerEvents: 'none',
                }}
              />
            ))}

            {/* Final text */}
            <motion.div style={{ textAlign: 'center', maxWidth: 520, position: 'relative', zIndex: 10 }}>
              <TypewriterText text="Thank you for walking through this forest." delay={1.5} style={{
                fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', color: '#fff8dc',
                marginBottom: '0.8rem', fontStyle: 'italic',
              }} />
              <TypewriterText text="The magic was never the forest." delay={4} style={{
                fontSize: 'clamp(0.9rem, 2vw, 1.2rem)', color: '#c8a8f0',
                marginBottom: '0.5rem', fontStyle: 'italic',
              }} />
              <TypewriterText text="It was always the person exploring it." delay={6.5} style={{
                fontSize: 'clamp(0.9rem, 2vw, 1.2rem)', color: '#ffd700',
                marginBottom: '2.5rem', fontStyle: 'italic',
              }} />

              {/* Fade to white — original ending */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 10, duration: 2 }}
                style={{
                  position: 'fixed', inset: 0, background: 'white',
                  zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column',
                }}
              >
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 12, duration: 1, type: 'spring' }}
                  style={{ textAlign: 'center' }}
                >
                  <p style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: 'clamp(2rem, 6vw, 4rem)',
                    color: '#c8a8f0',
                    textShadow: '0 0 30px #c8a8f088',
                    marginBottom: '1rem',
                  }}>
                    🦋 The End 🦋
                  </p>
                  <motion.button
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 13.5 }}
                    onClick={() => navigate('/')}
                    style={{
                      background: 'none', border: '2px solid #c8a8f0',
                      borderRadius: '2rem', padding: '0.8rem 2rem',
                      color: '#c8a8f0', fontFamily: 'var(--font-serif)',
                      fontSize: '1rem', cursor: 'pointer',
                      boxShadow: '0 0 20px #c8a8f044',
                    }}
                  >
                    Begin Again 🌙
                  </motion.button>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'collecting' && <HintCaption text="Catch the floating glass fragments" />}
      </AnimatePresence>

      <AudioToggle />
    </div>
  );
};

export default HealingGlassPage;
