import React from 'react';
import { motion } from 'framer-motion';

interface HintCaptionProps {
  text: string;
}

const HintCaption: React.FC<HintCaptionProps> = ({ text }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: [0.4, 1, 0.4], y: 0 }}
      transition={{ opacity: { repeat: Infinity, duration: 2.5, ease: 'easeInOut' }, y: { duration: 0.8 } }}
      style={{
        position: 'fixed',
        bottom: '2.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'rgba(20, 10, 40, 0.6)',
        border: '1px solid rgba(200, 168, 240, 0.4)',
        borderRadius: '2rem',
        padding: '0.6rem 1.5rem',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        boxShadow: '0 0 15px rgba(200, 168, 240, 0.15)',
      }}
    >
      <span style={{ fontSize: '1.2rem' }}>💡</span>
      <span style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '0.9rem',
        color: '#e0d4ff',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontWeight: 500,
      }}>
        Hint: {text}
      </span>
    </motion.div>
  );
};

export default HintCaption;
