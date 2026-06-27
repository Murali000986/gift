import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import PetalCanvas from '../../components/canvas/PetalCanvas';
import ButterflyCanvas from '../../components/canvas/ButterflyCanvas';
import MessageCrystal from '../../components/ui/MessageCrystal';
import ProgressOrb from '../../components/ui/ProgressOrb';
import AudioToggle from '../../components/ui/AudioToggle';
import HintCaption from '../../components/ui/HintCaption';
import { useDiscoveryStore } from '../../store/discoveryStore';
import { useSynthAudio, playMagic } from '../../hooks/useAudio';

const FLOWERS = [
  { id: 'garden-tulip', emoji: '🌷', name: 'Tulip', message: '"Dreams are not silly. They are the most honest thing about you."', color: '#ff6b8a', left: '12%', top: '55%' },
  { id: 'garden-sunflower', emoji: '🌻', name: 'Sunflower', message: '"Keep creating. Every brushstroke, every word, every idea — it matters."', color: '#ffd700', left: '30%', top: '62%' },
  { id: 'garden-rose', emoji: '🌹', name: 'Rose', message: '"Your future self is so proud of you for not giving up today."', color: '#ff4466', left: '50%', top: '50%' },
  { id: 'garden-lily', emoji: '🌸', name: 'Lily', message: '"You bloom at your own pace. Never compare your chapter 1 to someone else\'s chapter 20."', color: '#ffb6c1', left: '68%', top: '60%' },
  { id: 'garden-lavender', emoji: '💐', name: 'Bouquet', message: '"You deserve all the beauty you pour into the world."', color: '#b784f0', left: '84%', top: '53%' },
];

const PAGE_IDS = [...FLOWERS.map((f) => f.id), 'garden-bunny'];

const GardenPage: React.FC = () => {
  const navigate = useNavigate();
  const { markFound, isFound } = useDiscoveryStore();
  const found = useDiscoveryStore((s) => s.found);
  const [crystal, setCrystal] = useState<{ icon: string; message: string; color: string } | null>(null);
  const [bunnyVisible, setBunnyVisible] = useState(false);
  const bunnyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useSynthAudio('garden');

  const foundCount = PAGE_IDS.filter((id) => found[id]).length;
  const allFound = foundCount >= 5;

  // Bunny appears randomly every ~90 seconds
  useEffect(() => {
    const triggerBunny = () => {
      if (isFound('garden-bunny')) return;
      setBunnyVisible(true);
      // Bunny runs for 4 seconds
      const hideTimer = setTimeout(() => {
        setBunnyVisible(false);
        bunnyTimerRef.current = setTimeout(triggerBunny, 20000 + Math.random() * 30000);
      }, 4000);
      return () => clearTimeout(hideTimer);
    };

    // First appearance after 8 seconds
    bunnyTimerRef.current = setTimeout(triggerBunny, 8000);
    return () => {
      if (bunnyTimerRef.current) clearTimeout(bunnyTimerRef.current);
    };
  }, [isFound]);

  const handleBunnyClick = useCallback(() => {
    if (isFound('garden-bunny')) return;
    markFound('garden-bunny');
    playMagic();
    setBunnyVisible(false);
    setCrystal({
      icon: '🐇',
      message: '"You found the secret bunny! 🎉\n\nThe most magical things in life are the ones you have to look for. Just like happiness — it\'s always been closer than you think."',
      color: '#ffb6c1',
    });
    if (bunnyTimerRef.current) clearTimeout(bunnyTimerRef.current);
  }, [isFound, markFound]);

  const handleFlowerClick = useCallback((flower: typeof FLOWERS[0]) => {
    if (isFound(flower.id)) return;
    markFound(flower.id);
    playMagic();
    setCrystal({ icon: flower.emoji, message: flower.message, color: flower.color });
  }, [isFound, markFound]);

  return (
    <div
      className="page page-scroll"
      style={{
        background: 'linear-gradient(180deg, #2d0a4e 0%, #6b2fa0 30%, #c44569 60%, #ffb347 85%, #ffd700 100%)',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <PetalCanvas count={30} mouseTrail />
      <ButterflyCanvas count={6} />

      {/* Ground gradient */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '45%',
        background: 'linear-gradient(180deg, transparent 0%, rgba(20,80,20,0.6) 60%, rgba(10,50,10,0.9) 100%)',
        zIndex: 3,
        pointerEvents: 'none',
      }} />

      {/* Grass */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '15%', zIndex: 4,
        pointerEvents: 'none',
      }}>
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          {[...Array(60)].map((_, i) => {
            const x = (i / 60) * 1440;
            const h = 40 + Math.random() * 60;
            return <path key={i} d={`M${x},120 Q${x + 5},${120 - h} ${x + 10},120`} fill={`hsl(${115 + Math.random() * 30}, 60%, ${18 + Math.random() * 12}%)`} />;
          })}
        </svg>
      </div>

      {/* Page header */}
      <motion.div
        style={{ position: 'absolute', top: '5%', zIndex: 15, textAlign: 'center', width: '100%', pointerEvents: 'none' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="title-magical" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)', color: '#fff8dc' }}>
          Garden of Dreams
        </h2>
        <p className="subtitle-magical" style={{ fontSize: '1rem', color: '#ffb6c1' }}>
          Touch each flower and follow the petals 🌸
        </p>
      </motion.div>

      {/* Flowers */}
      {FLOWERS.map((flower, i) => (
        <motion.div
          key={flower.id}
          style={{
            position: 'absolute',
            left: flower.left,
            top: flower.top,
            zIndex: 15,
            cursor: isFound(flower.id) ? 'default' : 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
          }}
          initial={{ scale: 0, rotate: -45, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.2, type: 'spring', damping: 12 }}
          onClick={() => handleFlowerClick(flower)}
          title={`Click the ${flower.name}!`}
        >
          <motion.div
            style={{ fontSize: 'clamp(2.5rem, 4vw, 4rem)' }}
            animate={!isFound(flower.id) ? {
              y: [0, -8, 0],
              rotate: [-3, 3, -3],
              filter: [
                `drop-shadow(0 0 6px ${flower.color})`,
                `drop-shadow(0 0 16px ${flower.color})`,
                `drop-shadow(0 0 6px ${flower.color})`
              ],
            } : { opacity: 0.5 }}
            transition={{ repeat: Infinity, duration: 2 + i * 0.3, ease: 'easeInOut' }}
          >
            {flower.emoji}
          </motion.div>

          {/* Glow dot */}
          {!isFound(flower.id) && (
            <motion.div
              style={{
                width: 6, height: 6, borderRadius: '50%',
                background: flower.color,
                boxShadow: `0 0 8px ${flower.color}`,
              }}
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
          )}

          {isFound(flower.id) && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ fontSize: '0.85rem', color: flower.color }}
            >
              ✨ found
            </motion.span>
          )}
        </motion.div>
      ))}

      {/* Bunny */}
      <AnimatePresence>
        {bunnyVisible && (
          <motion.div
            style={{
              position: 'absolute',
              bottom: '18%',
              zIndex: 25,
              fontSize: '2.5rem',
              cursor: 'pointer',
              filter: 'drop-shadow(0 0 10px #ffb6c1)',
            }}
            initial={{ left: '-10%' }}
            animate={{ left: '110%' }}
            transition={{ duration: 4, ease: 'linear' }}
            onClick={handleBunnyClick}
            title="Catch the bunny!"
          >
            <motion.span
              animate={{ scaleX: [-1, -1], y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 0.4 }}
              style={{ display: 'inline-block' }}
            >
              🐇
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue button */}
      <AnimatePresence>
        {allFound && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'absolute', bottom: '5%', zIndex: 30,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
            }}
          >
            <motion.p style={{
              fontFamily: 'var(--font-script)', fontSize: '1.2rem',
              color: '#ffd700', textShadow: '0 0 20px #ffd700',
            }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              🌺 The garden blooms for you!
            </motion.p>
            <button className="btn-magic" onClick={() => navigate('/island')}
              style={{ borderColor: '#ffd70088', color: '#ffd700' }}>
              Rise to the Sky Islands →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mouse trail hint */}
      <motion.p
        style={{
          position: 'absolute', bottom: '2%', right: '2%',
          fontFamily: 'var(--font-script)', fontSize: '0.85rem',
          color: 'rgba(255,182,193,0.5)', zIndex: 10,
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ repeat: Infinity, duration: 3 }}
      >
        move your mouse to scatter petals ✨
      </motion.p>

      <ProgressOrb objectIds={PAGE_IDS} label="🌸 Found" />

      <MessageCrystal
        icon={crystal?.icon ?? ''}
        message={crystal?.message ?? ''}
        isOpen={!!crystal}
        onClose={() => setCrystal(null)}
        color={crystal?.color ?? '#ff69b4'}
      />

      {!allFound && <HintCaption text="Click each flower and the bunny" />}

      <AudioToggle />
    </div>
  );
};

export default GardenPage;
