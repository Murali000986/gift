import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import CloudCanvas from '../../components/canvas/CloudCanvas';
import MessageCrystal from '../../components/ui/MessageCrystal';
import ProgressOrb from '../../components/ui/ProgressOrb';
import AudioToggle from '../../components/ui/AudioToggle';
import HintCaption from '../../components/ui/HintCaption';
import { useDiscoveryStore } from '../../store/discoveryStore';
import { useSynthAudio, playMagic } from '../../hooks/useAudio';

const ISLANDS = [
  {
    id: 'island-1', label: 'Island of Perseverance',
    message: '"A bad day is not a bad life. Even storms pass, and after every rain comes clarity."',
    color: '#87ceeb', icon: '🏔️', emoji: '⛅',
    left: '10%', top: '20%',
  },
  {
    id: 'island-2', label: 'Island of Survival',
    message: '"You have survived every single difficult chapter so far. Your resilience is extraordinary."',
    color: '#98fb98', icon: '🌿', emoji: '☁️',
    left: '38%', top: '10%',
  },
  {
    id: 'island-3', label: 'Island of Hope',
    message: '"The best pages of your story haven\'t been written yet. Your greatest chapters are ahead."',
    color: '#ffd700', icon: '⭐', emoji: '🌤️',
    left: '65%', top: '22%',
  },
];

const PAGE_IDS = ISLANDS.map((i) => i.id);

// Flying birds canvas (pure CSS/SVG animation)
const FlyingBirds: React.FC = () => (
  <div style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none', overflow: 'hidden' }}>
    {[...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        style={{
          position: 'absolute',
          top: `${15 + i * 10}%`,
          fontSize: '1.2rem',
          filter: 'drop-shadow(0 0 4px rgba(135,206,235,0.5))',
        }}
        animate={{ x: ['110vw', '-10vw'] }}
        transition={{
          duration: 12 + i * 3,
          repeat: Infinity,
          delay: i * 2.5,
          ease: 'linear',
        }}
      >
        <motion.span
          animate={{ scaleY: [1, -0.3, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 + i * 0.1 }}
          style={{ display: 'inline-block' }}
        >
          🦅
        </motion.span>
      </motion.div>
    ))}
  </div>
);

const IslandPage: React.FC = () => {
  const navigate = useNavigate();
  const { markFound, isFound } = useDiscoveryStore();
  const found = useDiscoveryStore((s) => s.found);
  const [crystal, setCrystal] = useState<{ icon: string; message: string; color: string } | null>(null);

  useSynthAudio('island');

  const foundCount = PAGE_IDS.filter((id) => found[id]).length;
  const allFound = foundCount >= 3;

  const handleIslandClick = useCallback((island: typeof ISLANDS[0]) => {
    if (isFound(island.id)) return;
    markFound(island.id);
    playMagic();
    setCrystal({ icon: island.icon, message: island.message, color: island.color });
  }, [isFound, markFound]);

  return (
    <div
      className="page"
      style={{
        background: 'linear-gradient(180deg, #87ceeb 0%, #b0e0ff 35%, #ddeeff 60%, #fff5e6 85%, #ffe4b5 100%)',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <CloudCanvas />
      <FlyingBirds />

      {/* Page header */}
      <motion.div
        style={{ position: 'absolute', top: '3%', zIndex: 15, textAlign: 'center', width: '100%', pointerEvents: 'none' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="title-magical" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', color: '#2d4a6e' }}>
          The Sky Islands
        </h2>
        <p style={{
          fontFamily: 'var(--font-script)', fontSize: '1rem',
          color: '#5a7a9e',
        }}>
          Visit each floating island ☁️
        </p>
      </motion.div>

      {/* Floating Islands */}
      {ISLANDS.map((island, i) => (
        <motion.div
          key={island.id}
          style={{
            position: 'absolute',
            left: island.left,
            top: island.top,
            zIndex: 10,
            cursor: isFound(island.id) ? 'default' : 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          initial={{ opacity: 0, y: -30, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3 + i * 0.3, type: 'spring' }}
          onClick={() => handleIslandClick(island)}
          title={island.label}
        >
          {/* Island cloud emoji */}
          <motion.div
            style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)' }}
            animate={{
              y: [0, -12, 0],
              rotate: [-1, 1, -1],
              filter: isFound(island.id)
                ? [`drop-shadow(0 0 20px ${island.color})`]
                : [
                    `drop-shadow(0 0 6px ${island.color})`,
                    `drop-shadow(0 0 20px ${island.color})`,
                    `drop-shadow(0 0 6px ${island.color})`,
                  ],
            }}
            transition={{ repeat: Infinity, duration: 3 + i, ease: 'easeInOut' }}
          >
            {island.emoji}
          </motion.div>

          {/* Island base */}
          <div style={{
            position: 'relative',
            width: 'clamp(120px, 18vw, 200px)',
            marginTop: '-1rem',
          }}>
            <svg viewBox="0 0 200 80" style={{ width: '100%' }}>
              {/* Island dirt */}
              <ellipse cx="100" cy="55" rx="90" ry="30"
                fill={`${island.color}33`}
                stroke={`${island.color}66`}
                strokeWidth="1.5"
              />
              <ellipse cx="100" cy="45" rx="80" ry="25" fill={`${island.color}22`} />
              {/* Grass top */}
              <ellipse cx="100" cy="35" rx="80" ry="18"
                fill={isFound(island.id) ? `${island.color}88` : `${island.color}44`}
              />
              {/* Mini trees */}
              <polygon points="70,35 80,15 90,35" fill="#2d8a2d" opacity="0.7" />
              <polygon points="110,35 120,18 130,35" fill="#2d8a2d" opacity="0.7" />
              {/* Island icon */}
              <text x="100" y="42" textAnchor="middle" fontSize="16"
                style={{ filter: isFound(island.id) ? `drop-shadow(0 0 6px ${island.color})` : 'none' }}>
                {island.icon}
              </text>
            </svg>

            {/* Island name */}
            <div style={{
              textAlign: 'center', marginTop: 4,
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
              color: isFound(island.id) ? island.color : '#2d4a6e',
              textShadow: isFound(island.id) ? `0 0 10px ${island.color}` : 'none',
              fontWeight: isFound(island.id) ? 700 : 400,
            }}>
              {isFound(island.id) ? '✨ ' + island.label : island.label}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Rope bridges between islands (decorative SVG lines) */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 6, pointerEvents: 'none' }}
        viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M25,32 Q36,45 46,28" fill="none" stroke="rgba(100,80,60,0.3)" strokeWidth="0.3" strokeDasharray="2,2" />
        <path d="M52,28 Q62,38 70,35" fill="none" stroke="rgba(100,80,60,0.3)" strokeWidth="0.3" strokeDasharray="2,2" />
      </svg>

      {/* Rainbow - appears when all found */}
      <AnimatePresence>
        {allFound && (
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.85, scaleX: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '5%', left: '50%',
              transform: 'translateX(-50%)',
              width: '80%',
              height: '200px',
              borderRadius: '200px 200px 0 0',
              background: 'linear-gradient(180deg, rgba(255,0,0,0.15), rgba(255,165,0,0.15), rgba(255,255,0,0.15), rgba(0,255,0,0.12), rgba(0,0,255,0.1), rgba(75,0,130,0.1), rgba(238,130,238,0.1))',
              border: '2px solid transparent',
              borderImage: 'linear-gradient(90deg, rgba(255,0,0,0.3), rgba(255,165,0,0.3), rgba(255,255,0,0.3), rgba(0,128,0,0.25), rgba(0,0,255,0.2), rgba(75,0,130,0.2)) 1',
              zIndex: 8,
              boxShadow: '0 0 30px rgba(200,168,240,0.2)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>

      {/* Unlock */}
      <AnimatePresence>
        {allFound && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'absolute', bottom: '8%', zIndex: 30,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
            }}
          >
            <motion.p style={{
              fontFamily: 'var(--font-script)', fontSize: '1.2rem',
              color: '#2d4a6e',
              textShadow: '0 0 10px rgba(135,206,235,0.8)',
            }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🌈 A rainbow bridges the way forward!
            </motion.p>
            <button
              className="btn-magic"
              onClick={() => navigate('/lake')}
              style={{ borderColor: '#87ceeb88', color: '#2d4a6e',
                background: 'rgba(135,206,235,0.15)' }}
            >
              Descend to Butterfly Lake →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ProgressOrb objectIds={PAGE_IDS} label="☁️ Visited" />

      <MessageCrystal
        icon={crystal?.icon ?? ''}
        message={crystal?.message ?? ''}
        isOpen={!!crystal}
        onClose={() => setCrystal(null)}
        color={crystal?.color ?? '#87ceeb'}
      />

      {!allFound && <HintCaption text="Click each floating island" />}

      <AudioToggle />
    </div>
  );
};

export default IslandPage;
