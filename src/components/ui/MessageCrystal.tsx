import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageCrystalProps {
  icon: string;
  message: string;
  isOpen: boolean;
  onClose: () => void;
  color?: string;
}

const MessageCrystal: React.FC<MessageCrystalProps> = ({
  icon,
  message,
  isOpen,
  onClose,
  color = '#a8d8ea',
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="crystal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          style={{ cursor: 'pointer' }}
        >
          <motion.div
            className="crystal-card"
            initial={{ opacity: 0, scale: 0.5, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 40 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            style={{
              borderColor: `${color}55`,
              boxShadow: `0 0 15px ${color}44, 0 0 40px ${color}22, 0 20px 60px rgba(0,0,0,0.5)`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative corners */}
            <div style={{
              position: 'absolute', top: 12, left: 12,
              width: 20, height: 20,
              borderTop: `2px solid ${color}88`,
              borderLeft: `2px solid ${color}88`,
              borderRadius: '4px 0 0 0'
            }} />
            <div style={{
              position: 'absolute', top: 12, right: 12,
              width: 20, height: 20,
              borderTop: `2px solid ${color}88`,
              borderRight: `2px solid ${color}88`,
              borderRadius: '0 4px 0 0'
            }} />
            <div style={{
              position: 'absolute', bottom: 12, left: 12,
              width: 20, height: 20,
              borderBottom: `2px solid ${color}88`,
              borderLeft: `2px solid ${color}88`,
              borderRadius: '0 0 0 4px'
            }} />
            <div style={{
              position: 'absolute', bottom: 12, right: 12,
              width: 20, height: 20,
              borderBottom: `2px solid ${color}88`,
              borderRight: `2px solid ${color}88`,
              borderRadius: '0 0 4px 0'
            }} />

            <motion.div
              className="crystal-icon"
              animate={{ 
                scale: [1, 1.1, 1],
                filter: [`drop-shadow(0 0 10px ${color})`, `drop-shadow(0 0 25px ${color})`, `drop-shadow(0 0 10px ${color})`]
              }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              {icon}
            </motion.div>

            <p className="crystal-message">{message}</p>

            {/* Particle sparkles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: color,
                  left: `${15 + i * 14}%`,
                  top: `${10 + (i % 2) * 80}%`,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1.5, 0],
                  y: [0, -20, 0],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  delay: i * 0.3,
                }}
              />
            ))}

            <button
              className="crystal-close"
              onClick={onClose}
              aria-label="Close message"
              style={{ borderColor: `${color}66`, color }}
            >
              ✕
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MessageCrystal;
