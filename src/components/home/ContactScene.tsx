import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import type { HomePartHContent } from "@/lib/content";
import styles from "./ContactScene.module.css";

export function ContactScene({ content }: { content: HomePartHContent }) {
  return <section className={styles.scene} data-contact-scene aria-labelledby="home-contact-title">
    <div className={styles.landscape} aria-hidden="true">
      {content.grains.map((asset, i) => <div className={styles.grain} data-contact-grain={i + 4} key={asset.src}>
        <Image {...asset} alt="" unoptimized loading="eager" />
      </div>)}
    </div>
    <div className={styles.content} data-contact-content>
      <div className={styles.columns}>
        <div className={styles.visual}>
          <div className={styles.photo} data-contact-photo><Image {...content.image} unoptimized loading="eager" /></div>
          <div className={`${styles.fruit} ${styles.fruitOne}`} aria-hidden="true"><Image {...content.fruits[0]} alt="" unoptimized loading="eager" /></div>
        </div>
        <div className={styles.copy}>
          <h2 className={styles.title} id="home-contact-title" aria-label={content.titleLines.join(" ")}>
            {content.titleLines.map(line => <span className={styles.titleLine} key={line} aria-hidden="true">
              {Array.from(line).map((letter, i) => <span className={styles.letter} data-contact-letter key={i}>{letter === " " ? "\u00a0" : letter}</span>)}
            </span>)}
          </h2>
          <p className={styles.description}>{content.description}</p>
          <div className={styles.action} data-contact-action><ButtonLink href={content.cta.href} variant="secondary">{content.cta.label}</ButtonLink></div>
          <div className={`${styles.fruit} ${styles.fruitTwo}`} aria-hidden="true"><Image {...content.fruits[1]} alt="" unoptimized loading="eager" /></div>
        </div>
      </div>
    </div>
  </section>;
}
