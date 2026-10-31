'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';

const PATH = 'M120 70 C120 330 210 505 320 545 C430 505 520 330 520 70';

type Bead = { x: number; y: number };

export function NecklaceLine() {
  const reduce = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [beads, setBeads] = useState<Bead[]>([]);

  const tiltX = useSpring(0, { stiffness: 90, damping: 18 });
  const tiltY = useSpring(0, { stiffness: 90, damping: 18 });
  const { scrollY } = useScroll();
  const lift = useTransform(scrollY, [0, 700], [0, -34]);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const total = path.getTotalLength();
    const next: Bead[] = [];
    for (let i = 1; i <= 15; i += 1) {
      const point = path.getPointAtLength((total * i) / 16);
      next.push({ x: point.x, y: point.y });
    }
    setBeads(next);
  }, []);

  return (
    <div
      ref={stageRef}
      className="v3-hero-art"
      data-hero="true"
      onPointerMove={(event) => {
        if (reduce || !stageRef.current) return;
        const rect = stageRef.current.getBoundingClientRect();
        tiltY.set(((event.clientX - rect.left) / rect.width - 0.5) * 12);
        tiltX.set(-((event.clientY - rect.top) / rect.height - 0.5) * 10);
      }}
      onPointerLeave={() => {
        tiltX.set(0);
        tiltY.set(0);
      }}
    >
      <motion.div className="v3-art-inner" style={{ rotateX: tiltX, rotateY: tiltY, y: lift }}>
        <svg viewBox="0 0 640 700" role="img" aria-label="طرح خطی یک گردنبند استیل ونرا" style={{ color: 'var(--bone)' }}>
          <motion.path
            ref={pathRef}
            d={PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            initial={reduce ? false : { pathLength: 0, opacity: 0.15 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          />

          <circle cx="120" cy="70" r="3.2" fill="currentColor" />
          <circle cx="520" cy="70" r="3.2" fill="currentColor" />

          {beads.map((bead, index) => {
            const accent = index === 4 || index === 10;
            return (
              <motion.circle
                key={`${bead.x}-${bead.y}`}
                cx={bead.x}
                cy={bead.y}
                r={accent ? 5 : 3.6}
                fill={accent ? 'var(--copper)' : 'currentColor'}
                initial={reduce ? false : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 + index * 0.055, type: 'spring', stiffness: 220, damping: 18 }}
                style={{ transformOrigin: `${bead.x}px ${bead.y}px` }}
              />
            );
          })}

          <motion.g
            className="v3-pendant"
            initial={reduce ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.45, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <line x1="320" y1="545" x2="320" y2="568" stroke="currentColor" strokeWidth="1.2" />
            <path
              d="M320 568 L336 588 L320 608 L304 588 Z"
              fill="none"
              style={{ stroke: 'var(--copper)' }}
              strokeWidth="1.6"
            />
            <circle cx="320" cy="588" r="2.4" style={{ fill: 'var(--copper)' }} />
          </motion.g>
        </svg>
      </motion.div>
      <span className="v3-art-caption">استیل ۳۱۶ / طراحی تهران</span>
    </div>
  );
}
