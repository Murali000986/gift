import React from 'react';
import { motion } from 'framer-motion';
import { useDiscoveryStore } from '../../store/discoveryStore';

interface ProgressOrbProps {
  objectIds: string[];
  label?: string;
}

const ProgressOrb: React.FC<ProgressOrbProps> = ({ objectIds, label }) => {
  const found = useDiscoveryStore((s) => s.found);
  const foundCount = objectIds.filter((id) => found[id]).length;
  const total = objectIds.length;

  return (
    <motion.div
      className="progress-orb"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>
        {label ?? '✨ Found'}
      </span>
      <div className="progress-dots">
        {objectIds.map((id) => (
          <motion.div
            key={id}
            className={`progress-dot ${found[id] ? 'found' : ''}`}
            animate={found[id] ? {
              scale: [1, 1.4, 1],
              boxShadow: [
                '0 0 4px #c8a8f0',
                '0 0 12px #c8a8f0, 0 0 24px #c8a8f088',
                '0 0 4px #c8a8f0',
              ]
            } : {}}
            transition={{ duration: 0.5 }}
          />
        ))}
      </div>
      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: foundCount === total ? '#ffd700' : '#c8a8f0' }}>
        {foundCount}/{total}
      </span>
    </motion.div>
  );
};

export default ProgressOrb;
