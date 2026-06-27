import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import MessageCrystal from '../../components/ui/MessageCrystal';
import ProgressOrb from '../../components/ui/ProgressOrb';
import AudioToggle from '../../components/ui/AudioToggle';
import HintCaption from '../../components/ui/HintCaption';
import { useDiscoveryStore } from '../../store/discoveryStore';
import { useSynthAudio, playMagic } from '../../hooks/useAudio';
import { useCanvas } from '../../hooks/useCanvas';

/* =====================================================
   Constellation definitions
   ===================================================== */
const CONSTELLATIONS = [
  {
    id: 'c-courage', name: 'Courage', color: '#ff8c42',
    stars: [
      { id: 'c-courage-0', cx: 20, cy: 25 },
      { id: 'c-courage-1', cx: 28, cy: 15 },
      { id: 'c-courage-2', cx: 35, cy: 22 },
    ],
  },
  {
    id: 'c-hope', name: 'Hope', color: '#87ceeb',
    stars: [
      { id: 'c-hope-0', cx: 50, cy: 12 },
      { id: 'c-hope-1', cx: 55, cy: 20 },
      { id: 'c-hope-2', cx: 48, cy: 28 },
      { id: 'c-hope-3', cx: 58, cy: 30 },
    ],
  },
  {
    id: 'c-kindness', name: 'Kindness', color: '#98fb98',
    stars: [
      { id: 'c-kindness-0', cx: 73, cy: 18 },
      { id: 'c-kindness-1', cx: 80, cy: 10 },
      { id: 'c-kindness-2', cx: 85, cy: 20 },
      { id: 'c-kindness-3', cx: 78, cy: 28 },
    ],
  },
  {
    id: 'c-dreams', name: 'Dreams', color: '#dda0dd',
    stars: [
      { id: 'c-dreams-0', cx: 18, cy: 55 },
      { id: 'c-dreams-1', cx: 25, cy: 45 },
      { id: 'c-dreams-2', cx: 32, cy: 52 },
      { id: 'c-dreams-3', cx: 22, cy: 62 },
    ],
  },
  {
    id: 'c-strength', name: 'Strength', color: '#ffd700',
    stars: [
      { id: 'c-strength-0', cx: 65, cy: 55 },
      { id: 'c-strength-1', cx: 70, cy: 45 },
      { id: 'c-strength-2', cx: 78, cy: 48 },
      { id: 'c-strength-3', cx: 75, cy: 58 },
      { id: 'c-strength-4', cx: 68, cy: 65 },
    ],
  },
];

const PAGE_IDS = CONSTELLATIONS.map((c) => c.id);

// Shresta letters as star positions (% of viewport)
const SHRESTA_STARS: { x: number; y: number }[] = [
  // S
  { x: 38, y: 75 }, { x: 40, y: 73 }, { x: 42, y: 74 }, { x: 41, y: 77 }, { x: 39, y: 79 }, { x: 41, y: 80 },
  // H
  { x: 44, y: 73 }, { x: 44, y: 78 }, { x: 45, y: 76 }, { x: 46, y: 73 }, { x: 46, y: 78 },
  // R
  { x: 48, y: 73 }, { x: 48, y: 79 }, { x: 49, y: 74 }, { x: 50, y: 74 }, { x: 50, y: 76 }, { x: 49, y: 76 }, { x: 50, y: 79 },
  // E
  { x: 52, y: 73 }, { x: 53, y: 73 }, { x: 52, y: 76 }, { x: 53, y: 76 }, { x: 52, y: 79 }, { x: 53, y: 79 },
  // S
  { x: 55, y: 73 }, { x: 57, y: 73 }, { x: 55, y: 76 }, { x: 57, y: 76 }, { x: 55, y: 79 }, { x: 57, y: 79 }, { x: 56, y: 73 }, { x: 56, y: 76 },
  // T
  { x: 59, y: 73 }, { x: 61, y: 73 }, { x: 60, y: 73 }, { x: 60, y: 76 }, { x: 60, y: 79 },
  // A
  { x: 63, y: 79 }, { x: 64, y: 73 }, { x: 65, y: 79 }, { x: 63, y: 76 }, { x: 65, y: 76 },
];

const ConstellationPage: React.FC = () => {
  const navigate = useNavigate();
  const { markFound, isFound } = useDiscoveryStore();
  const found = useDiscoveryStore((s) => s.found);
  const [clickedStars, setClickedStars] = useState<Set<string>>(new Set());
  const [crystal, setCrystal] = useState<{ name: string; color: string } | null>(null);
  const [showShresta, setShowShresta] = useState(false);

  useSynthAudio('constellation');

  const MESSAGES: Record<string, string> = {
    Courage: '"Courage is not the absence of fear. It is walking forward even when your heart trembles. You have it."',
    Hope: '"Hope is the quiet voice that says \'maybe tomorrow\' even on the hardest nights. Never silence it."',
    Kindness: '"Your kindness is a constellation that lights up everyone around you — even when you don\'t realize it."',
    Dreams: '"Your dreams are not too big. The world is just not used to how bright you are yet."',
    Strength: '"Strength is not about never falling. It\'s about the thousand times you got back up. You are extraordinary."',
  };

  const foundCount = PAGE_IDS.filter((id) => found[id]).length;
  const allFound = foundCount >= 5;

  useEffect(() => {
    if (allFound) {
      setTimeout(() => setShowShresta(true), 1500);
    }
  }, [allFound]);

  const handleStarClick = useCallback((starId: string, constellationId: string, name: string, color: string) => {
    const newClicked = new Set(clickedStars);
    newClicked.add(starId);
    setClickedStars(newClicked);

    // Check if whole constellation is complete
    const constellation = CONSTELLATIONS.find((c) => c.id === constellationId);
    if (constellation && !isFound(constellationId)) {
      const allStarsClicked = constellation.stars.every((s) => newClicked.has(s.id));
      if (allStarsClicked) {
        markFound(constellationId);
        playMagic();
        setCrystal({ name, color });
      }
    }
    playMagic();
  }, [clickedStars, isFound, markFound]);

  // Background star canvas
  const bgStarsRef = React.useRef<{x:number;y:number;r:number;phase:number;speed:number}[]>([]);

  const bgDraw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, delta: number) => {
    if (bgStarsRef.current.length === 0) {
      bgStarsRef.current = Array.from({ length: 300 }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.3,
        phase: Math.random() * Math.PI * 2,
        speed: Math.random() + 0.3,
      }));
    }
    bgStarsRef.current.forEach((s) => {
      s.phase += delta * s.speed;
      const o = 0.2 + 0.8 * Math.abs(Math.sin(s.phase));
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,248,220,${o})`;
      ctx.fill();
    });
    // Shooting star occasionally
    if (Math.random() < 0.002) {
      const sx = Math.random() * width;
      const sy = Math.random() * height * 0.5;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + 80, sy + 40);
      ctx.strokeStyle = 'rgba(255,248,220,0.8)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, []);

  const bgCanvasRef = useCanvas(bgDraw, []);


  return (
    <div
      className="page"
      style={{
        background: 'radial-gradient(ellipse at 50% 0%, #0a0a2e 0%, #050d1a 60%, #020810 100%)',
        minHeight: '100vh',
        overflow: 'hidden',
      }}
    >
      <canvas ref={bgCanvasRef} style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }} />

      {/* Galaxy gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 30% 50%, rgba(100,50,150,0.12) 0%, transparent 60%), radial-gradient(ellipse at 70% 30%, rgba(50,100,150,0.1) 0%, transparent 50%)',
      }} />

      {/* Page header */}
      <motion.div
        style={{ position: 'absolute', top: '3%', zIndex: 20, textAlign: 'center', width: '100%', pointerEvents: 'none' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="title-magical" style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}>
          Constellation Sky
        </h2>
        <p className="subtitle-magical" style={{ fontSize: '1rem' }}>
          Click each star to reveal the constellation ⭐
        </p>
      </motion.div>

      {/* Constellation stars */}
      {CONSTELLATIONS.map((constellation) => {
        const constellationComplete = isFound(constellation.id);
        return (
          <React.Fragment key={constellation.id}>
            {/* Constellation lines (drawn when complete) */}
            {constellationComplete && (
              <svg
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  zIndex: 10, pointerEvents: 'none',
                }}
              >
                {constellation.stars.slice(0, -1).map((star, i) => {
                  const next = constellation.stars[i + 1];
                  return (
                    <motion.line
                      key={`line-${i}`}
                      x1={`${star.cx}%`} y1={`${star.cy}%`}
                      x2={`${next.cx}%`} y2={`${next.cy}%`}
                      stroke={constellation.color}
                      strokeWidth="1"
                      strokeOpacity="0.6"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.8, delay: i * 0.2 }}
                    />
                  );
                })}
              </svg>
            )}

            {/* Stars */}
            {constellation.stars.map((star) => {
              const isStarClicked = clickedStars.has(star.id);
              return (
                <motion.div
                  key={star.id}
                  style={{
                    position: 'absolute',
                    left: `${star.cx}%`,
                    top: `${star.cy}%`,
                    zIndex: 15,
                    cursor: constellationComplete ? 'default' : 'pointer',
                    transform: 'translate(-50%, -50%)',
                  }}
                  onClick={() => !constellationComplete && handleStarClick(star.id, constellation.id, constellation.name, constellation.color)}
                  whileHover={!constellationComplete ? { scale: 1.5 } : {}}
                  title={!constellationComplete ? 'Click this star!' : constellation.name}
                >
                  <motion.div
                    style={{
                      width: isStarClicked ? 14 : 10,
                      height: isStarClicked ? 14 : 10,
                      borderRadius: '50%',
                      background: isStarClicked || constellationComplete ? constellation.color : '#fff8dc',
                      boxShadow: isStarClicked || constellationComplete
                        ? `0 0 10px ${constellation.color}, 0 0 25px ${constellation.color}88`
                        : '0 0 4px #fff8dc88',
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: constellationComplete ? [0.8, 1, 0.8] : [0.5, 1, 0.5],
                    }}
                    transition={{ repeat: Infinity, duration: 2 + Math.random() }}
                  />
                </motion.div>
              );
            })}

            {/* Constellation label */}
            {constellationComplete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  position: 'absolute',
                  left: `${constellation.stars[0].cx - 3}%`,
                  top: `${constellation.stars[0].cy + 8}%`,
                  zIndex: 20,
                  fontFamily: 'var(--font-script)',
                  fontSize: 'clamp(0.9rem, 2vw, 1.3rem)',
                  color: constellation.color,
                  textShadow: `0 0 10px ${constellation.color}, 0 0 25px ${constellation.color}88`,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                }}
              >
                ✦ {constellation.name}
              </motion.div>
            )}
          </React.Fragment>
        );
      })}

      {/* SHRESTA name in stars */}
      <AnimatePresence>
        {showShresta && (
          <>
            {SHRESTA_STARS.map((s, i) => (
              <motion.div
                key={`shr-${i}`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, type: 'spring' }}
                style={{
                  position: 'absolute',
                  left: `${s.x}%`, top: `${s.y}%`,
                  width: 6, height: 6,
                  borderRadius: '50%',
                  background: '#ffd700',
                  boxShadow: '0 0 8px #ffd700, 0 0 20px #ffd70088',
                  transform: 'translate(-50%,-50%)',
                  zIndex: 25,
                  pointerEvents: 'none',
                }}
              />
            ))}
            {/* Shooting stars for reveal */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={`shoot-${i}`}
                initial={{ x: -200, y: 0, opacity: 1 }}
                animate={{ x: '110vw', y: 200, opacity: 0 }}
                transition={{ duration: 1.5, delay: i * 0.3, ease: 'easeIn' }}
                style={{
                  position: 'absolute',
                  top: `${10 + i * 12}%`,
                  left: 0, zIndex: 30,
                  width: 3, height: 3,
                  borderRadius: '50%',
                  background: '#fff8dc',
                  boxShadow: '-30px 0 20px #fff8dc88',
                  pointerEvents: 'none',
                }}
              />
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              style={{
                position: 'absolute',
                top: '68%',
                left: '50%', transform: 'translateX(-50%)',
                zIndex: 26,
                fontFamily: 'var(--font-script)',
                fontSize: 'clamp(1.5rem, 4vw, 3rem)',
                color: '#ffd700',
                textShadow: '0 0 20px #ffd700, 0 0 50px #ffd70066',
                whiteSpace: 'nowrap',
              }}
            >
              ✨ Shresta ✨
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Unlock */}
      <AnimatePresence>
        {allFound && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              position: 'absolute', bottom: '4%', zIndex: 35,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem',
            }}
          >
            <motion.p style={{
              fontFamily: 'var(--font-script)', fontSize: '1.2rem',
              color: '#ffd700', textShadow: '0 0 20px #ffd700',
            }}
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ⭐ Your name is written in the stars, Shresta
            </motion.p>
            <button className="btn-magic" onClick={() => navigate('/sunrise')}
              style={{ borderColor: '#ffd70088', color: '#ffd700', background: 'rgba(255,215,0,0.08)' }}>
              Witness the Sunrise →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <ProgressOrb objectIds={PAGE_IDS} label="⭐ Connected" />

      {/* Crystal message */}
      <MessageCrystal
        icon="⭐"
        message={crystal ? MESSAGES[crystal.name] ?? '' : ''}
        isOpen={!!crystal}
        onClose={() => setCrystal(null)}
        color={crystal?.color ?? '#ffd700'}
      />

      {!allFound && <HintCaption text="Click the stars" />}

      <AudioToggle />
    </div>
  );
};

export default ConstellationPage;
