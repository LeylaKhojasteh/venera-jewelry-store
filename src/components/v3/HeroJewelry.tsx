'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { NecklaceLine } from '@/components/v3/NecklaceLine';
import { StageSkeleton } from '@/components/v3/StageSkeleton';

const Stage = dynamic(() => import('@/components/v3/JewelryStage').then((module) => module.JewelryStage), {
  ssr: false,
  loading: () => (
    <div className="v3-hero-art v3-hero-3d" data-hero="true">
      <StageSkeleton />
    </div>
  ),
});

export function HeroJewelry() {
  const [supported] = useState(() => {
    if (typeof document === 'undefined') return true;
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  });

  if (!supported) return <NecklaceLine animate={false} />;
  return <Stage />;
}
