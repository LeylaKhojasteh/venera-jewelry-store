'use client';

import { useState } from 'react';

export type FaqItem = { question: string; answer: string };

export function Faq({ items }: { items: FaqItem[] }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="v3-faq-list">
      {items.map((item, index) => {
        const isOpen = open === index;
        const questionId = `faq-question-${index}`;
        const answerId = `faq-answer-${index}`;

        return (
          <div key={item.question} className={`v3-faq-item${isOpen ? ' is-open' : ''}`}>
            <button
              type="button"
              id={questionId}
              className="v3-faq-question"
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => setOpen(isOpen ? null : index)}
            >
              {item.question}
              <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>

            {isOpen ? (
              <div
                className="v3-faq-answer"
                id={answerId}
                role="region"
                aria-labelledby={questionId}
              >
                <p>{item.answer}</p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
