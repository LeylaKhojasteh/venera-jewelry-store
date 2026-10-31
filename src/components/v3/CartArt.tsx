'use client';

import { motion } from 'motion/react';

export function CartArt() {
  return (
    <svg className="v3-cart-art" viewBox="0 0 220 160" aria-hidden="true">
      <motion.path
        d="M30 20 C30 98 76 132 110 132 C144 132 190 98 190 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        initial={{ pathLength: 0, opacity: 0.35 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2.4, repeat: Infinity, repeatType: 'reverse', repeatDelay: 0.8, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="110"
        cy="132"
        r="4"
        fill="currentColor"
        animate={{ opacity: [0.35, 1, 0.35] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="70"
        cy="95"
        r="2.5"
        fill="currentColor"
        animate={{ opacity: [0.25, 0.9, 0.25] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="150"
        cy="95"
        r="2.5"
        fill="currentColor"
        animate={{ opacity: [0.9, 0.25, 0.9] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="30"
        cy="20"
        r="3"
        fill="currentColor"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.circle
        cx="190"
        cy="20"
        r="3"
        fill="currentColor"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </svg>
  );
}
