'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react';

const chapters = [
  {
    title: 'طرح‌های خاص',
    text: 'ماموریت ما ارائه بهترین تنوع و کیفیت با مناسب‌ترین قیمت است.',
    image: '/images/products/bracelet-spiral-silver-01.jpg',
    alt: 'دستبند حلزونی نقره‌ای ونرا',
  },
  {
    title: 'رضایت مشتری',
    text: 'جلب رضایت مشتریان همیشگی و رشد کردن در کنار هم.',
    image: '/images/products/earrings-butterfly-01.jpg',
    alt: 'گوشواره پروانه اویزی ونرا',
  },
  {
    title: 'دستیابی به اهداف بلند مدت',
    text: 'تبدیل شدن به بزرگ‌ترین ارائه‌دهنده اکسسوری در تهران با حمایت شما و تعهد ما به ارائه بهترین خدمات و پشتیبانی.',
    image: '/images/products/ring-set-six-gold-01.jpg',
    alt: 'ست شش‌تایی مینیمال طلایی ونرا',
  },
];

export function AboutChapters() {
  const sectionRef = useRef<HTMLElement>(null);
  const chapterRefs = useRef<(HTMLElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start center', 'end center'] });

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    const next = Math.min(chapters.length - 1, Math.max(0, Math.floor(value * chapters.length)));
    setActive((current) => (current === next ? current : next));
  });

  return (
    <section ref={sectionRef} className="v3-about-chapters" aria-label="سه تصمیم ونرا">
      <div className="v3-about-chapters-grid">
        <div className="v3-about-chapters-media" aria-hidden="true">
          <div className="v3-about-frame">
            {chapters.map((chapter, index) => (
              <motion.div
                key={chapter.image}
                className="v3-about-frame-image"
                initial={false}
                animate={{ opacity: active === index ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.7, ease: 'easeInOut' }}
              >
                <Image src={chapter.image} alt={chapter.alt} fill sizes="(max-width: 900px) 100vw, 42vw" className="object-cover" />
              </motion.div>
            ))}
          </div>

          <div className="v3-about-progress">
            <span className="v3-about-progress-rail" aria-hidden="true">
              <motion.span className="v3-about-progress-fill" style={{ scaleY: scrollYProgress }} />
            </span>
            <div className="v3-about-progress-dots">
              {chapters.map((chapter, index) => (
                <button
                  key={chapter.title}
                  type="button"
                  className={active === index ? 'is-active' : undefined}
                  aria-label={chapter.title}
                  aria-current={active === index ? 'true' : undefined}
                  onClick={() =>
                    chapterRefs.current[index]?.scrollIntoView({
                      behavior: reduce ? 'auto' : 'smooth',
                      block: 'center',
                    })
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <div className="v3-about-chapters-copy">
          {chapters.map((chapter, index) => (
            <article
              key={chapter.title}
              ref={(node) => {
                chapterRefs.current[index] = node;
              }}
              className={`v3-about-chapter${active === index ? ' is-active' : ''}`}
            >
              <span className="v3-about-chapter-rule" aria-hidden="true" />
              <h3 className="v3-h2">{chapter.title}</h3>
              <p className="v3-body">{chapter.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
