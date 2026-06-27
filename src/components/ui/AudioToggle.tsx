import React from 'react';
import { motion } from 'framer-motion';
import { useAudioStore } from '../../hooks/useAudio';

const AudioToggle: React.FC = () => {
  const { muted, toggle } = useAudioStore();

  return (
    <motion.button
      className="audio-toggle"
      onClick={toggle}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      title={muted ? 'Unmute music' : 'Mute music'}
      aria-label={muted ? 'Unmute music' : 'Mute music'}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <motion.span
        animate={muted ? {} : { 
          filter: ['drop-shadow(0 0 3px #c8a8f0)', 'drop-shadow(0 0 8px #c8a8f0)', 'drop-shadow(0 0 3px #c8a8f0)']
        }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {muted ? '🔇' : '🎵'}
      </motion.span>
    </motion.button>
  );
};

export default AudioToggle;
