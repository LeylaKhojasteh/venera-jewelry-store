'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

const lengths = [
  { cm: 40, label: 'بالای گردن', depth: 0 },
  { cm: 45, label: 'گودی گردن', depth: 1 },
  { cm: 50, label: 'روی سینه', depth: 2 },
];

export function LengthGuide() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(1);
  const active = lengths[index];
  const bottom = 235 + active.depth * 52;

  return (
    <section className="v3-section" aria-labelledby="fit-title" style={{ background: 'var(--ink-2)' }}>
      <div className="v3-shell">
        <div className="v3-guide">
          <div>
            <h2 id="fit-title" className="v3-h2">
              نشستن گردنبند
            </h2>
            <p className="v3-body" style={{ marginTop: '1rem', maxWidth: '36ch' }}>
              طول زنجیر گردنبند را انتخاب کن؛ خط روی گردن جابه‌جا می‌شود. برای دستبند و انگشتر، اندازه
              در صفحهٔ همان قطعه آمده است.
            </p>

            <div className="v3-guide-options" role="group" aria-label="طول گردنبند">
              {lengths.map((item, itemIndex) => (
                <button
                  key={item.cm}
                  type="button"
                  className="v3-choice"
                  aria-pressed={itemIndex === index}
                  onClick={() => setIndex(itemIndex)}
                >
                  {new Intl.NumberFormat('fa-IR').format(item.cm)} سانتی‌متر
                </button>
              ))}
            </div>

            <p className="v3-guide-readout" aria-live="polite">
              <strong>
                {new Intl.NumberFormat('fa-IR').format(active.cm)} سانتی‌متر / {active.label}
              </strong>
              <br />
              {active.depth === 0
                ? 'کوتاه‌ترین حالت؛ روی استخوان گردن می‌نشیند.'
                : active.depth === 1
                  ? 'حالت پیشنهادی؛ روی گودی گردن و با یقهٔ گرد هماهنگ است.'
                  : 'بلندتر؛ آویز روی سینه می‌افتد و با یقهٔ هفت‌یقه خوب می‌شود.'}
            </p>
          </div>

          <svg className="v3-guide-svg" viewBox="0 0 640 420" role="img" aria-label="طرح گردن و سه حالت طول گردنبند">
            <path
              d="M70 420 C120 300 200 250 320 250 C440 250 520 300 570 420"
              fill="none"
              style={{ stroke: 'var(--line)' }}
              strokeWidth="1.2"
            />
            <path
              d="M230 110 C230 200 270 250 320 250 C370 250 410 200 410 110"
              fill="none"
              style={{ stroke: 'var(--line)' }}
              strokeWidth="1.2"
            />

            {lengths.map((item, itemIndex) => {
              const y = 235 + item.depth * 52;
              const isActive = itemIndex === index;
              return (
                <path
                  key={item.cm}
                  d={`M250 112 C250 ${y - 40} 285 ${y} 320 ${y} C355 ${y} 390 ${y - 40} 390 112`}
                  fill="none"
                  style={{
                    stroke: isActive ? 'var(--copper)' : 'var(--bone)',
                    strokeOpacity: isActive ? 1 : 0.22,
                    strokeWidth: isActive ? 2.2 : 1.2,
                    transition: 'stroke 260ms ease, stroke-opacity 260ms ease, stroke-width 260ms ease',
                  }}
                />
              );
            })}

            <motion.circle
              cx="320"
              cy={bottom}
              r="5"
              style={{ fill: 'var(--copper)' }}
              animate={{ cy: bottom }}
              transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 22 }}
            />
            <line
              x1="320"
              y1={bottom}
              x2="320"
              y2={bottom + 22}
              style={{ stroke: 'var(--copper)' }}
              strokeWidth="1.2"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
