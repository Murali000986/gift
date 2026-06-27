import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import FireflyCanvas from '../../components/canvas/FireflyCanvas';
import MessageCrystal from '../../components/ui/MessageCrystal';
import ProgressOrb from '../../components/ui/ProgressOrb';
import AudioToggle from '../../components/ui/AudioToggle';
import HintCaption from '../../components/ui/HintCaption';
import { useDiscoveryStore } from '../../store/discoveryStore';
import { useSynthAudio, playMagic } from '../../hooks/useAudio';

const OBJECTS = [
  { id: 'tree-bird1', icon: '🐦', label: 'Robin', top: '22%', left: '38%', message: '"You are stronger than you think. You have survived things that once seemed impossible."', color: '#87ceeb' },
  { id: 'tree-bird2', icon: '🦜', label: 'Parrot', top: '35%', left: '62%', message: '"Your voice matters. Never let anyone silence the music inside you."', color: '#98fb98' },
  { id: 'tree-leaf1', icon: '🍃', label: 'Leaf', top: '45%', left: '28%', message: '"Some battles are invisible — the ones fought quietly inside. You are brave for fighting them."', color: '#90ee90' },
  { id: 'tree-leaf2', icon: '🌿', label: 'Fern', top: '52%', left: '72%', message: '"Growth takes time, just like trees. Be patient with yourself."', color: '#7cfc00' },
  { id: 'tree-leaf3', icon: '🍂', label: 'Autumn Leaf', top: '30%', left: '52%', message: '"Even falling leaves are beautiful. Change is not an ending — it\'s a becoming."', color: '#ffa500' },
];

const PAGE_IDS = OBJECTS.map((o) => o.id);

const TreePage: React.FC = () => {
  const navigate = useNavigate();
  const { markFound, isFound } = useDiscoveryStore();
  const found = useDiscoveryStore((s) => s.found);
  const [crystal, setCrystal] = useState<{ icon: string; message: string; color: string } | null>(null);

  useSynthAudio('tree');

  const foundCount = PAGE_IDS.filter((id) => found[id]).length;
  const allFound = foundCount >= 5;

  const handleClick = useCallback((obj: typeof OBJECTS[0]) => {
    if (isFound(obj.id)) return;
    markFound(obj.id);
    playMagic();
    setCrystal({ icon: obj.icon, message: obj.message, color: obj.color });
  }, [isFound, markFound]);

  return (
    <div
      className="page"
      style={{
        background: 'radial-gradient(ellipse at 50% 100%, #071507 0%, #0a1a0a 40%, #050d0a 100%)',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <FireflyCanvas count={30} />

      {/* Sky gradient behind tree */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 0%, #1a1a2e 0%, transparent 60%)',
        zIndex: 0,
      }} />

      {/* Bokeh effect */}
      {[...Array(15)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: Math.random() * 80 + 20,
          height: Math.random() * 80 + 20,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(${Math.random() > 0.5 ? '144,238,144' : '100,200,100'},0.06) 0%, transparent 70%)`,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          filter: 'blur(8px)',
          animation: `float ${3 + Math.random() * 4}s ease-in-out ${Math.random() * 3}s infinite`,
          zIndex: 0,
        }} />
      ))}

      {/* THE MAGICAL TREE - SVG */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(700px, 95vw)', height: '90vh',
        zIndex: 5,
      }}>
        <svg viewBox="0 0 500 700" style={{ width: '100%', height: '100%' }} overflow="visible">
          {/* Root glow */}
          <ellipse cx="250" cy="700" rx="120" ry="20"
            fill="rgba(45,100,45,0.3)" filter="url(#glow)" />
          
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="leaf-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Trunk */}
          <motion.g
            animate={{ rotate: [-0.5, 0.5, -0.5] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            style={{ transformOrigin: '250px 700px' }}
          >
            <path d="M210,700 Q200,550 220,420 Q240,300 250,200" stroke="#2d1b0e" strokeWidth="35" fill="none" strokeLinecap="round" />
            <path d="M290,700 Q300,550 280,420 Q260,300 250,200" stroke="#3d2b1e" strokeWidth="30" fill="none" strokeLinecap="round" />
            {/* Bark texture lines */}
            <path d="M225,650 Q230,600 220,540" stroke="#1a0f07" strokeWidth="2" fill="none" opacity="0.6" />
            <path d="M270,680 Q265,620 275,560" stroke="#1a0f07" strokeWidth="2" fill="none" opacity="0.6" />
            
            {/* Main branches */}
            <motion.path d="M240,350 Q180,280 120,220" stroke="#2d1b0e" strokeWidth="18" fill="none" strokeLinecap="round"
              animate={{ rotate: [-1, 1, -1] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
              style={{ transformOrigin: '240px 350px' }} />
            <motion.path d="M255,300 Q320,230 390,180" stroke="#2d1b0e" strokeWidth="16" fill="none" strokeLinecap="round"
              animate={{ rotate: [1, -1, 1] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              style={{ transformOrigin: '255px 300px' }} />
            <motion.path d="M248,250 Q248,170 250,100" stroke="#2d1b0e" strokeWidth="14" fill="none" strokeLinecap="round"
              animate={{ rotate: [-0.8, 0.8, -0.8] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              style={{ transformOrigin: '250px 250px' }} />

            {/* Sub-branches left */}
            <path d="M160,270 Q130,230 100,210" stroke="#3d2010" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M130,245 Q105,215 85,200" stroke="#3d2010" strokeWidth="8" fill="none" strokeLinecap="round" />

            {/* Sub-branches right */}
            <path d="M330,225 Q360,200 390,195" stroke="#3d2010" strokeWidth="10" fill="none" strokeLinecap="round" />
            <path d="M355,205 Q380,185 405,175" stroke="#3d2010" strokeWidth="8" fill="none" strokeLinecap="round" />

            {/* Hidden branch - only shows when all found */}
            {allFound && (
              <motion.path
                d="M248,220 Q200,140 170,100"
                stroke="#4a7a1e"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            )}
          </motion.g>

          {/* Foliage clusters */}
          {[
            { cx: 250, cy: 100, r: 85, color: '#1a4a0e' },
            { cx: 110, cy: 200, r: 70, color: '#154008' },
            { cx: 390, cy: 160, r: 65, color: '#1a4a0e' },
            { cx: 175, cy: 150, r: 55, color: '#1f5a12' },
            { cx: 325, cy: 125, r: 50, color: '#1a4a0e' },
          ].map((c, i) => (
            <motion.ellipse key={i} cx={c.cx} cy={c.cy} rx={c.r} ry={c.r * 0.85}
              fill={c.color}
              filter="url(#leaf-glow)"
              animate={{ scale: [1, 1.02, 1], rotate: [-1, 1, -1] }}
              transition={{ repeat: Infinity, duration: 3 + i * 0.5, ease: 'easeInOut', delay: i * 0.3 }}
              style={{ transformOrigin: `${c.cx}px ${c.cy}px` }}
            />
          ))}

          {/* Individual animated leaves */}
          {[...Array(20)].map((_, i) => {
            const angle = (i / 20) * Math.PI * 2;
            const dist = 60 + Math.random() * 50;
            const cx = 250 + Math.cos(angle) * dist * 1.5;
            const cy = 130 + Math.sin(angle) * dist;
            return (
              <motion.ellipse key={`lf-${i}`}
                cx={cx} cy={cy} rx={6} ry={3}
                fill={`hsl(${110 + Math.random() * 40}, 60%, ${25 + Math.random() * 15}%)`}
                animate={{
                  y: [0, -8, 0],
                  rotate: [0, 20, 0],
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 3,
                  ease: 'easeInOut',
                }}
                style={{ transformOrigin: `${cx}px ${cy}px` }}
              />
            );
          })}
        </svg>
      </div>

      {/* Clickable objects positioned on tree */}
      {OBJECTS.map((obj) => (
        <motion.div
          key={obj.id}
          className={`clickable-obj ${isFound(obj.id) ? 'found' : ''}`}
          style={{
            top: obj.top, left: obj.left,
            fontSize: '2rem',
            color: obj.color,
            zIndex: 20,
          }}
          whileHover={{ scale: 1.3 }}
          whileTap={{ scale: 0.8 }}
          onClick={() => handleClick(obj)}
          title={`Click the ${obj.label}!`}
          animate={!isFound(obj.id) ? {
            y: [0, -6, 0],
            filter: [`drop-shadow(0 0 6px ${obj.color})`, `drop-shadow(0 0 14px ${obj.color})`, `drop-shadow(0 0 6px ${obj.color})`],
          } : { opacity: 0.4 }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
        >
          {obj.icon}
          {isFound(obj.id) && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              style={{ position: 'absolute', top: -8, right: -8, fontSize: '0.7rem' }}
            >
              ✨
            </motion.span>
          )}
        </motion.div>
      ))}

      {/* Page header */}
      <motion.div
        style={{ position: 'absolute', top: '5%', zIndex: 15, textAlign: 'center', pointerEvents: 'none' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="title-magical" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}>
          The Tree of Memories
        </h2>
        <p className="subtitle-magical" style={{ fontSize: '1rem' }}>
          Find all hidden friends in the tree ✨
        </p>
      </motion.div>

      {/* Unlock reveal */}
      <AnimatePresence>
        {allFound && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, type: 'spring' }}
            style={{
              position: 'absolute', bottom: '12%', zIndex: 30,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
            }}
          >
            <motion.p
              style={{
                fontFamily: 'var(--font-script)', fontSize: '1.3rem',
                color: '#ffd700',
                textShadow: '0 0 20px #ffd700, 0 0 40px #ffd70088',
              }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ✨ A hidden branch has opened...
            </motion.p>
            <motion.button
              className="btn-magic"
              onClick={() => navigate('/garden')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ borderColor: '#ffd70088', color: '#ffd700' }}
            >
              Continue Journey →
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <ProgressOrb objectIds={PAGE_IDS} label="🌿 Found" />

      <MessageCrystal
        icon={crystal?.icon ?? ''}
        message={crystal?.message ?? ''}
        isOpen={!!crystal}
        onClose={() => setCrystal(null)}
        color={crystal?.color ?? '#90ee90'}
      />

      {!allFound && <HintCaption text="Click the hidden friends in the tree" />}

      <AudioToggle />
    </div>
  );
};

export default TreePage;
