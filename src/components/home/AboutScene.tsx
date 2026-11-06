"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties } from "react";
import type { HomePartFContent } from "@/lib/content";
import { ButtonLink } from "@/components/ui/Button";
import { getGalleryOffset } from "./aboutMotion";
import styles from "./AboutScene.module.css";

function AboutGallery({ images, labels }: { images: HomePartFContent["images"]; labels: HomePartFContent["galleryLabels"] }) {
  const [active, setActive] = useState(0);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const count = images.length;
  const go = (step: number) => setActive(current => (current + step + count) % count);
  if (!count) return null;
  return (
    <div className={styles.gallery} data-about-gallery role="region" aria-roledescription={labels.role} aria-label={labels.label}
      onKeyDown={event => {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          go(event.key === "ArrowRight" ? 1 : -1);
        }
      }}>
      <div className={styles.galleryWindow}
        onPointerDown={event => { if (event.button === 0) { pointer.current = { x: event.clientX, y: event.clientY }; event.currentTarget.setPointerCapture(event.pointerId); } }}
        onPointerCancel={() => { pointer.current = null; }}
        onPointerUp={event => {
          const start = pointer.current;
          pointer.current = null;
          if (!start) return;
          const dx = event.clientX - start.x;
          if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(event.clientY - start.y)) go(dx < 0 ? 1 : -1);
        }}>
        {images.map((asset, i) => {
          const offset = getGalleryOffset(i, active, count);
          return <div key={asset.src} className={styles.slide} data-about-slide={i + 1} data-active={i === active}
            role="group" aria-roledescription={labels.slideRole} aria-label={`${i + 1} ${labels.of} ${count}`} aria-hidden={i !== active}
            style={{ "--slide-offset": offset } as CSSProperties}>
            <Image src={asset.src} alt={asset.alt} width={asset.width} height={asset.height} sizes="(max-width: 700px) 90vw, 84vw" loading="eager" draggable={false}
              unoptimized />
          </div>;
        })}
      </div>
      {count > 1 && <div className={styles.controls}>
        <button type="button" aria-label={labels.previous} onClick={() => go(-1)}>←</button>
        <div className={styles.dots}>
          {images.map((asset, i) => <button type="button" key={asset.src} aria-label={`${labels.goToPhoto} ${i + 1}`} aria-current={i === active ? "true" : undefined} onClick={() => setActive(i)}><span /></button>)}
        </div>
        <button type="button" aria-label={labels.next} onClick={() => go(1)}>→</button>
      </div>}
      <span className={styles.srOnly} aria-live="polite" aria-atomic="true">{labels.photo} {active + 1} {labels.of} {count}</span>
    </div>
  );
}

export function AboutScene({ content }: { content: HomePartFContent }) {
  return (
    <section className={styles.scene} data-about-scene aria-labelledby="home-about-title">
      <div className={styles.landscape} aria-hidden="true">
        <div className={styles.house} data-about-house><Image src={content.house.src} width={content.house.width} height={content.house.height} alt="" sizes="(max-aspect-ratio: 1/1) 65vh, 75vw" loading="eager" /></div>
        {content.grains.map((asset, i) => <div className={styles.grain} data-about-grain={i + 1} key={asset.src}><Image src={asset.src} width={asset.width} height={asset.height} alt="" sizes="(max-aspect-ratio: 1/1) 65vh, 75vw" loading="eager" /></div>)}
      </div>
      <div className={styles.overlay} aria-hidden="true" />
      <div className={styles.content} data-about-content>
        <h2 className={styles.title} id="home-about-title" aria-label={content.title}>
          {Array.from(content.title).map((letter, i) => <span data-about-letter aria-hidden="true" key={i}>{letter === " " ? "\u00a0" : letter}</span>)}
        </h2>
        <p className={styles.description}>{content.description}</p>
        <AboutGallery images={content.images} labels={content.galleryLabels} />
        <div className={styles.action} data-about-action><ButtonLink href={content.cta.href} variant="secondary">{content.cta.label}</ButtonLink></div>
      </div>
    </section>
  );
}
