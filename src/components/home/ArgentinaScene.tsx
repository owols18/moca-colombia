import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import type { HomePartC1Content } from "@/lib/content";
import styles from "./HomeStory.module.css";

export function ArgentinaScene({ content }: { content: HomePartC1Content }) {
  return (
    <section className={styles.argentinaScene} data-argentina-scene aria-labelledby="home-argentina-title">
      <div className={styles.argentinaPhotos}>
        {content.images.map((asset, index) => (
          <div className={styles.argentinaPhoto} data-argentina-photo={index} key={asset.src}>
            <Image src={asset.src} alt={asset.alt} width={asset.width} height={asset.height}
              sizes="(max-width: 900px) 90vw, 44vw" loading="eager" />
          </div>
        ))}
      </div>
      <div className={styles.argentinaCopy}>
        <h2 className={`${styles.missionTitle} ${styles.argentinaTitle}`} id="home-argentina-title">
          {content.titleLines.map(line => <span key={line}>{line}</span>)}
        </h2>
        <div className={styles.argentinaReadingWindow} data-argentina-window>
          <p className={styles.argentinaParagraph} data-argentina-paragraph>
            <span className={styles.readerText}>{content.description}</span>
            <span aria-hidden="true">
              {content.description.split(" ").map((word, index) => (
                <span className={styles.argentinaWord} data-argentina-word key={index}>{word}{" "}</span>
              ))}
            </span>
          </p>
        </div>
        <div className={styles.argentinaCta}>
          <ButtonLink href={content.cta.href} variant="secondary">{content.cta.label}</ButtonLink>
        </div>
      </div>
    </section>
  );
}
