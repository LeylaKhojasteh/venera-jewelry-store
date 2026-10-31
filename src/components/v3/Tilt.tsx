'use client';

import React, { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionStyle,
  type SpringOptions,
} from 'motion/react';

export function Tilt({
  children,
  className,
  style,
  rotationFactor = 8,
  springOptions,
}: {
  children: React.ReactNode;
  className?: string;
  style?: MotionStyle;
  rotationFactor?: number;
  springOptions?: SpringOptions;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, springOptions ?? { stiffness: 140, damping: 20 });
  const ySpring = useSpring(y, springOptions ?? { stiffness: 140, damping: 20 });
  const rotateX = useTransform(ySpring, [-0.5, 0.5], [-rotationFactor, rotationFactor]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], [rotationFactor, -rotationFactor]);
  const transform = useMotionTemplate`perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ transformStyle: 'preserve-3d', ...style, transform }}
      onPointerMove={(event) => {
        if (!ref.current) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((event.clientX - rect.left) / rect.width - 0.5);
        y.set((event.clientY - rect.top) / rect.height - 0.5);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
