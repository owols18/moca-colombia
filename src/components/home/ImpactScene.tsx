import Image from "next/image";
import type { HomePartEContent } from "@/lib/content";
import { ButtonLink } from "@/components/ui/Button";
import homeStyles from "./HomeStory.module.css";
import styles from "./ImpactScene.module.css";

export function ImpactScene({ content }: { content: HomePartEContent }) {
  return (
    <section className={styles.scene} data-impact-scene aria-labelledby="home-impact-title">
      <div className={styles.houses} aria-hidden="true">
        {content.houses.map((house, i) => (
          <div className={styles.house} data-impact-house={i + 1} key={house.src}>
            <Image src={house.src} width={house.width} height={house.height} alt=""
              sizes="(max-aspect-ratio: 1/1) 60vh, 75vw" loading="eager" />
          </div>
        ))}
      </div>
      <div className={styles.copy} data-impact-copy>
        <h2 id="home-impact-title" className={`${homeStyles.missionTitle} ${styles.title}`} aria-label={content.title}>
          {Array.from(content.title).map((letter, i) => <span key={i} data-impact-letter aria-hidden="true">{letter}</span>)}
        </h2>
        <p className={styles.paragraph} aria-label={content.description}>
          {content.descriptionLines.map((line, i) => (
            <span className={styles.lineMask} key={line} aria-hidden="true">
              <span data-impact-line={i}>{line}{i < content.descriptionLines.length - 1 ? " " : ""}</span>
            </span>
          ))}
        </p>
        <div className={styles.action} data-impact-action>
          <ButtonLink href={content.cta.href} variant="primary">{content.cta.label}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
