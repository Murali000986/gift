import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MessageCrystal from '../../components/ui/MessageCrystal';
import ProgressOrb from '../../components/ui/ProgressOrb';
import AudioToggle from '../../components/ui/AudioToggle';
import HintCaption from '../../components/ui/HintCaption';
import { useDiscoveryStore } from '../../store/discoveryStore';
import { useSynthAudio, playMagic } from '../../hooks/useAudio';

const BUTTERFLIES = [
  { id: 'lake-b1', x: '15%', y: '25%', color1: '#ff69b4', color2: '#da70d6', message: '"Never forget how far you\'ve come. Every step, every struggle shaped you beautifully."' },
  { id: 'lake-b2', x: '35%', y: '18%', color1: '#87ceeb', color2: '#b0e2ff', message: '"You are a work in progress, and that is perfectly okay. Progress is always beautiful."' },
  { id: 'lake-b3', x: '55%', y: '28%', color1: '#ffd700', color2: '#ffb347', message: '"The courage you show every single day — even when no one sees it — is remarkable."' },
  { id: 'lake-b4', x: '72%', y: '15%', color1: '#98fb98', color2: '#90ee90', message: '"Your kindness is your superpower. The world is better because you are in it."' },
  { id: 'lake-b5', x: '85%', y: '30%', color1: '#dda0dd', color2: '#b784f0', message: '"You are not behind. You are on your own beautiful timeline."' },
  { id: 'lake-b6', x: '25%', y: '40%', color1: '#ff8c42', color2: '#ff6b8a', message: '"Healing is not linear. Some days you\'ll bloom; some days you rest. Both are sacred."' },
  { id: 'lake-b7', x: '50%', y: '42%', color1: '#c8a8f0', color2: '#a8d8ea', message: '"Magic is real. Look at you — breathing, feeling, still choosing to try. That is magic."' },
  { id: 'lake-b8', x: '78%', y: '44%', color1: '#ffb6c1', color2: '#ffc6d3', message: '"The light inside you has never gone out. It just needed you to believe in it again."' },
];

const PAGE_IDS = BUTTERFLIES.map((b) => b.id);

interface ButterflyObjProps {
  bf: typeof BUTTERFLIES[0];
  onClick: (bf: typeof BUTTERFLIES[0]) => void;
  found: boolean;
}

const ButterflyObj: React.FC<ButterflyObjProps> = ({ bf, onClick, found }) => {
  const [isTransforming, setIsTransforming] = useState(false);

  const handleClick = () => {
    if (found) return;
    setIsTransforming(true);
    setTimeout(() => {
      setIsTransforming(false);
      onClick(bf);
    }, 600);
  };

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: bf.x, top: bf.y,
        zIndex: 15, cursor: found ? 'default' : 'pointer',
        width: 60, height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
      animate={!found ? {
        y: [0, -10, 0],
        x: [0, 5, -5, 0],
      } : {}}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      onClick={handleClick}
      title="Click the butterfly to release its memory!"
    >
      {!found ? (
        <motion.div
          animate={isTransforming ? {
            scale: [1, 1.5, 0.2],
            rotate: [0, 180, 360],
          } : {
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: isTransforming ? 0.6 : 2, ease: 'easeInOut' }}
          style={{ position: 'relative' }}
        >
          {/* SVG Butterfly */}
          <svg width="50" height="40" viewBox="0 0 50 40">
            <motion.ellipse
              cx="15" cy="15" rx="12" ry="10"
              fill={bf.color1}
              animate={{ scaleX: [1, 0.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
              style={{ transformOrigin: '25px 20px', filter: `drop-shadow(0 0 6px ${bf.color1})` }}
            />
            <motion.ellipse
              cx="35" cy="15" rx="12" ry="10"
              fill={bf.color2}
              animate={{ scaleX: [1, 0.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
              style={{ transformOrigin: '25px 20px', filter: `drop-shadow(0 0 6px ${bf.color2})` }}
            />
            <motion.ellipse
              cx="17" cy="27" rx="8" ry="6"
              fill={`${bf.color1}bb`}
              animate={{ scaleX: [1, 0.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
              style={{ transformOrigin: '25px 20px' }}
            />
            <motion.ellipse
              cx="33" cy="27" rx="8" ry="6"
              fill={`${bf.color2}bb`}
              animate={{ scaleX: [1, 0.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut' }}
              style={{ transformOrigin: '25px 20px' }}
            />
            <ellipse cx="25" cy="20" rx="2" ry="8" fill="#2d1b4e" />
          </svg>
        </motion.div>
      ) : (
        /* Memory Crystal */
        <motion.div
          initial={{ scale: 0, rotate: 180 }}
          animate={{ scale: 1, rotate: 0 }}
          style={{
            width: 30, height: 30,
            background: `linear-gradient(135deg, ${bf.color1}66, ${bf.color2}44)`,
            border: `1px solid ${bf.color1}88`,
            borderRadius: '6px',
            transform: 'rotate(45deg)',
            boxShadow: `0 0 15px ${bf.color1}88, 0 0 30px ${bf.color1}44`,
            animation: 'pulse-glow 2s ease-in-out infinite',
          }}
        />
      )}
    </motion.div>
  );
};

const LakePage: React.FC = () => {
  const navigate = useNavigate();
  const { markFound } = useDiscoveryStore();
  const found = useDiscoveryStore((s) => s.found);
  const [crystal, setCrystal] = useState<{ icon: string; message: string; color: string } | null>(null);

  useSynthAudio('lake');

  const foundCount = PAGE_IDS.filter((id) => found[id]).length;
  const allFound = foundCount >= 8;
  const glowLevel = foundCount / 8;

  const handleClick = useCallback((bf: typeof BUTTERFLIES[0]) => {
    markFound(bf.id);
    playMagic();
    setCrystal({ icon: '💎', message: bf.message, color: bf.color1 });
  }, [markFound]);

  return (
    <div
      className="page"
      style={{
        background: 'linear-gradient(180deg, #0a0a2e 0%, #1a1a4e 30%, #0d1f3a 60%, #050d1a 100%)',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      {/* Sky area */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '50%',
        background: 'linear-gradient(180deg, #0a0a2e 0%, #1a1a4e 100%)',
        zIndex: 0,
      }} />

      {/* Lake surface */}
      <div style={{
        position: 'absolute', top: '48%', left: 0, right: 0, bottom: 0,
        zIndex: 2,
        background: 'linear-gradient(180deg, rgba(10,20,60,0.9) 0%, rgba(5,10,30,1) 100%)',
        borderTop: '1px solid rgba(168,216,234,0.2)',
        backdropFilter: 'blur(2px)',
      }}>
        {/* Lake glow */}
        <motion.div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 50% 20%, rgba(168,216,234,${glowLevel * 0.3}) 0%, transparent 70%)`,
        }} />

        {/* Water shimmer lines */}
        {[...Array(8)].map((_, i) => (
          <motion.div key={i}
            style={{
              position: 'absolute',
              top: `${10 + i * 10}%`,
              left: `${10 + Math.random() * 20}%`,
              right: `${10 + Math.random() * 20}%`,
              height: 1,
              background: `rgba(168,216,234,${0.05 + glowLevel * 0.15})`,
              borderRadius: '50%',
            }}
            animate={{ scaleX: [0.8, 1.1, 0.8], opacity: [0.3, 1, 0.3] }}
            transition={{ repeat: Infinity, duration: 3 + i * 0.5, delay: i * 0.4 }}
          />
        ))}

        {/* Reflection of butterflies */}
        {BUTTERFLIES.filter((b) => found[b.id]).map((bf) => (
          <motion.div
            key={`refl-${bf.id}`}
            style={{
              position: 'absolute',
              left: bf.x,
              top: '5%',
              width: 20, height: 20,
              borderRadius: '3px',
              transform: 'rotate(45deg)',
              background: `linear-gradient(135deg, ${bf.color1}33, ${bf.color2}22)`,
              border: `1px solid ${bf.color1}44`,
              filter: 'blur(2px)',
              opacity: 0.6,
            }}
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        ))}
      </div>

      {/* Divider line / horizon */}
      <div style={{
        position: 'absolute', top: '48%', left: 0, right: 0, height: 2,
        background: `rgba(168,216,234,${0.1 + glowLevel * 0.4})`,
        boxShadow: `0 0 ${10 + glowLevel * 20}px rgba(168,216,234,${glowLevel * 0.5})`,
        zIndex: 5,
      }} />

      {/* Butterflies */}
      {BUTTERFLIES.map((bf) => (
        <ButterflyObj key={bf.id} bf={bf} onClick={handleClick} found={!!found[bf.id]} />
      ))}

      {/* Trees silhouette at sides */}
      <div style={{ position: 'absolute', bottom: '52%', left: 0, right: 0, height: '25%', zIndex: 3, pointerEvents: 'none' }}>
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          {[...Array(6)].map((_, i) => {
            const x = i * 60;
            return <polygon key={i} points={`${x},200 ${x + 25},${80 - i * 10} ${x + 50},200`} fill="#051505" opacity="0.8" />;
          })}
          {[...Array(6)].map((_, i) => {
            const x = 1200 + i * 40;
            return <polygon key={`r${i}`} points={`${x},200 ${x + 20},${90 - i * 8} ${x + 40},200`} fill="#051505" opacity="0.8" />;
          })}
        </svg>
      </div>

      {/* Page header */}
      <motion.div
        style={{ position: 'absolute', top: '3%', zIndex: 20, textAlign: 'center', width: '100%', pointerEvents: 'none' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="title-magical" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}>
          Butterfly Lake
        </h2>
        <p className="subtitle-magical" style={{ fontSize: '1rem' }}>
          Release each butterfly — find the memory crystal within 💎
        </p>
      </motion.div>

      {/* Glow progress indicator */}
      <motion.div style={{
        position: 'absolute', bottom: '55%', left: '50%', transform: 'translateX(-50%)',
        zIndex: 8,
        fontFamily: 'var(--font-script)', fontSize: '0.9rem',
        color: `rgba(168,216,234,${0.3 + glowLevel * 0.7})`,
        textShadow: `0 0 10px rgba(168,216,234,${glowLevel * 0.8})`,
      }}>
        {foundCount > 0 && `✨ ${foundCount} memories released — the lake awakens`}
      </motion.div>

      {/* Unlock */}
      <AnimatePresence>
        {allFound && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'absolute', bottom: '5%', zIndex: 30,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
            }}
          >
            <motion.p style={{
              fontFamily: 'var(--font-script)', fontSize: '1.2rem',
              color: '#a8d8ea',
              textShadow: '0 0 20px #a8d8ea',
            }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              💎 All memories have been released! The lake glows with your journey.
            </motion.p>
            <button className="btn-magic" onClick={() => navigate('/constellation')}
              style={{ borderColor: '#a8d8ea88', color: '#a8d8ea', background: 'rgba(168,216,234,0.1)' }}>
              Reach for the Stars →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ProgressOrb objectIds={PAGE_IDS} label="💎 Crystals" />

      <MessageCrystal
        icon={crystal?.icon ?? ''}
        message={crystal?.message ?? ''}
        isOpen={!!crystal}
        onClose={() => setCrystal(null)}
        color={crystal?.color ?? '#a8d8ea'}
      />

      {!allFound && <HintCaption text="Click the butterflies" />}

      <AudioToggle />
    </div>
  );
};

export default LakePage;
