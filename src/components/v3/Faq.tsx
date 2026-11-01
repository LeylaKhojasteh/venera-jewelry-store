'use client';

import { useState } from 'react';

export type FaqItem = { question: string; answer: string };

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

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
              aria-controls={`faq-answer-${index}`}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              {item.question}
              <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen ? (
              <p className="v3-body v3-faq-answer" id={`faq-answer-${index}`}>
                {item.answer}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
