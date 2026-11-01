'use client';

import { useState } from 'react';

export type FaqItem = { question: string; answer: string };

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const current = open === null ? null : items[open];

  return (
    <div className="v3-faq-list">
      {items.map((item, index) => {
        const isOpen = open === index;
        return (
          <div key={item.question} className="v3-faq-item">
            <button
              type="button"
              className="v3-faq-question"
              aria-expanded={isOpen}
              aria-controls="faq-answer-panel"
              onClick={() => setOpen(isOpen ? null : index)}
            >
              {item.question}
              <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
          </div>
        );
      })}

      <div className="v3-faq-answer" id="faq-answer-panel" aria-live="polite">
        {current ? <p>{current.answer}</p> : null}
      </div>
    </div>
  );
}
