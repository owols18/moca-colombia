"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import type { AboutUsContent } from "@/lib/content";

import styles from "./page.module.css";

type BoardOfDirectorsProps = {
  content: AboutUsContent["board"];
};

export function BoardOfDirectors({ content }: BoardOfDirectorsProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeDirector = content.directors[activeIndex];
  const showControls = content.directors.length > 1;
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    const card = rail?.children[activeIndex];
    if (!rail || !(card instanceof HTMLElement)) return;

    function revealSelected(behavior: ScrollBehavior) {
      if (!rail || !(card instanceof HTMLElement)) return;
      const left = card.offsetLeft;
      const right = left + card.offsetWidth;
      if (left < rail.scrollLeft) rail.scrollTo({ left, behavior });
      else if (right > rail.scrollLeft + rail.clientWidth) {
        rail.scrollTo({ left: right - rail.clientWidth, behavior });
      }
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    revealSelected(reducedMotion ? "instant" : "smooth");
    let previousWidth = rail.clientWidth;
    const observer = new ResizeObserver(() => {
      if (rail.clientWidth !== previousWidth) {
        previousWidth = rail.clientWidth;
        revealSelected("instant");
      }
    });
    observer.observe(rail);
    return () => observer.disconnect();
  }, [activeIndex]);

  if (!activeDirector) return null;

  function selectPrevious() {
    setActiveIndex((current) =>
      current === 0 ? content.directors.length - 1 : current - 1,
    );
  }

  function selectNext() {
    setActiveIndex((current) => (current + 1) % content.directors.length);
  }

  return (
    <section className={styles.boardSection} id={content.id}>
      <div className={styles.boardInner}>
        <h2 className={styles.boardTitle}>{content.title}</h2>

        {showControls ? (
          <div className={styles.boardControls}>
            <button
              aria-controls="board-director-cards"
              aria-label={content.previousLabel}
              onClick={selectPrevious}
              type="button"
            >
              <span aria-hidden="true">←</span>
              <span>{content.previousLabel}</span>
            </button>
            <button
              aria-controls="board-director-cards"
              aria-label={content.nextLabel}
              onClick={selectNext}
              type="button"
            >
              <span>{content.nextLabel}</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        ) : null}

        <div
          aria-label={content.selectLabel}
          className={styles.directorRail}
          id="board-director-cards"
          ref={railRef}
          role="group"
        >
          {content.directors.map((director, index) => {
            const isActive = index === activeIndex;

            return (
              <button
                aria-pressed={isActive}
                className={`${styles.directorCard} ${isActive ? styles.directorCardActive : ""}`}
                key={director.id}
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <span className={styles.cardPortrait}>
                  <Image
                    alt=""
                    fill
                    sizes="(max-width: 600px) 44vw, 15rem"
                    src={director.image}
                  />
                </span>
                <span className={styles.cardName}>{director.name}</span>
                <span className={styles.cardRole}>{director.role}</span>
              </button>
            );
          })}
        </div>

        <article aria-live="polite" className={styles.featuredDirector} key={activeDirector.id}>
          <div className={styles.featuredVisual}>
            <Image
              alt=""
              aria-hidden="true"
              className={styles.portraitBackground}
              fill
              sizes="(max-width: 700px) 78vw, (max-width: 1100px) 40vw, 31rem"
              src="/images/about-us/teams-cards-background.svg"
            />
            <div className={styles.featuredPortrait}>
              <Image
                alt={activeDirector.alt}
                fill
                priority={activeIndex === 0}
                sizes="(max-width: 700px) 78vw, (max-width: 1100px) 40vw, 28rem"
                src={activeDirector.image}
              />
            </div>
          </div>

          <div className={styles.featuredCopy}>
            <header>
              <h3>{activeDirector.name}</h3>
              <p className={styles.featuredRole}>{activeDirector.role}</p>
            </header>
            <div className={styles.biography} tabIndex={0}>
              {activeDirector.biography.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
