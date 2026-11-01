'use client';

import { motion, useReducedMotion } from 'motion/react';

const CHAIN = 'M62 34 C24 96 58 158 130 178 C202 158 236 96 198 34';

export function CartArt() {
  const reduce = useReducedMotion() ?? false;

  return (
    <svg className="v3-cart-art" viewBox="0 0 260 220" aria-hidden="true">
      <motion.path
        d={CHAIN}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0, opacity: 0.35 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      />
      <motion.path
        d={CHAIN}
        fill="none"
        stroke="currentColor"
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeDasharray="1.2 4.8"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 0.95 }}
        transition={{ duration: 0.6, delay: 0.7 }}
      />

      <motion.g
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
      >
        <circle cx="62" cy="34" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="198" cy="34" r="3.4" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path d="M62 34 L70 28 M198 34 L190 28" stroke="currentColor" strokeWidth="1" />
      </motion.g>

      <motion.g
        style={{ transformOrigin: '130px 178px' }}
        animate={reduce ? undefined : { rotate: [-1.8, 1.8, -1.8] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <circle cx="130" cy="180" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <path
          d="M130 184 C121 196 120 207 130 214 C140 207 139 196 130 184 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <motion.circle
          cx="130"
          cy="200"
          r="2.6"
          fill="#fffaf4"
          animate={reduce ? undefined : { opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.g>
    </svg>
  );
}
