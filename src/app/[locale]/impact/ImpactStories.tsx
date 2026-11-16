"use client";

import Image from "next/image";
import { type CSSProperties, useEffect, useRef, useState } from "react";
import type { ImpactContent } from "@/lib/content";

import styles from "./page.module.css";

type Stories = ImpactContent["sections"]["storiesOfChange"];

export function ImpactStories({ content }: { content: Stories }) {
  const [active, setActive] = useState<number | null>(null);
  const panel = useRef<HTMLElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const reading = useRef<HTMLDivElement>(null);
  const isOpen = active !== null;
  const story = active === null ? null : content.people[active];

  useEffect(() => {
    if (isOpen) {
      close.current?.focus({ preventScroll: true });

    } else if (opener.current) {
      opener.current.focus({ preventScroll: true });
      opener.current.scrollIntoView({ block: "center", behavior: "instant" });
    }
  }, [isOpen]);

  useEffect(() => {
    if (active === null) return;
    if (reading.current) reading.current.scrollTop = 0;
    panel.current?.scrollIntoView({ block: "center", behavior: "instant" });
  }, [active]);

  function move(step: number) {
    setActive(index => index === null ? null : (index + step + content.people.length) % content.people.length);
  }

  return (
    <section className={styles.stories} id={content.id} aria-labelledby="impact-stories-title">
      <div className={styles.storiesInner}>
        <h2 id="impact-stories-title">{content.title}</h2>
        {content.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        <div className={styles.cards} style={{ "--story-row": (active ?? 0) + 1 } as CSSProperties}>
          {content.people.map((person, index) => (
            <button key={person.id} className={styles.card} type="button"
              aria-expanded={active === index} aria-controls="impact-story-detail"
              onClick={event => {
                opener.current = event.currentTarget;
                setActive(index);
                close.current?.focus({ preventScroll: true });
              }}>
              <Image alt="" fill unoptimized src={person.card} sizes="(max-width: 600px) 92vw, (max-width: 1920px) 31vw, 570px" />
              <span>{person.name}</span>
            </button>
          ))}

          <section id="impact-story-detail" className={styles.detail} ref={panel} hidden={!story}
            aria-labelledby={story ? "impact-person" : undefined}
            onKeyDown={event => {
              if (event.key === "Escape") setActive(null);
              else if (event.key === "ArrowLeft") move(-1);
              else if (event.key === "ArrowRight") move(1);
              else return;
              event.preventDefault();
            }}>
            {story && <>
              <button type="button" ref={close} onClick={() => setActive(null)} aria-label={content.close} className={styles.close}>×</button>
              <button type="button" onClick={() => move(-1)} aria-label={content.previous} className={styles.previous}>←</button>
              <div className={styles.detailInner}>
                <div className={styles.portrait}>
                  <Image alt="" fill src={story.portrait} sizes="(max-width: 700px) 42vw, (max-width: 1600px) 28vw, 480px" />
                </div>
                <div className={styles.reading} ref={reading} tabIndex={0} role="region" aria-labelledby="impact-person">
                  <h3 id="impact-person" aria-live="polite" aria-atomic="true">{story.title}</h3>
                    {(story.biography.length ? story.biography : [content.pending]).map(paragraph => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </div>
              <button type="button" onClick={() => move(1)} aria-label={content.next} className={styles.next}>→</button>
            </>}
          </section>
        </div>
      </div>
    </section>
  );
}
