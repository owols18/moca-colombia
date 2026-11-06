import Image from "next/image";
import type { HomePartDContent } from "@/lib/content";
import homeStyles from "./HomeStory.module.css";
import styles from "./ProjectsScene.module.css";

export function ProjectsScene({ content }: { content: HomePartDContent }) {
  return (
    <section className={styles.scene} data-projects-scene aria-labelledby="home-projects-title">
      <div className={styles.landscape} aria-hidden="true">
        {content.trees.map((asset, index) => (
          <div className={styles.tree} data-project-tree={index} key={asset.src}>
            <Image src={asset.src} alt="" width={asset.width} height={asset.height}
              sizes="(max-aspect-ratio: 1/1) 64vw, 30vw" loading="eager" />
          </div>
        ))}
        {content.vegetationPath && (
          <div className={styles.pathVegetation} data-project-vegetation>
            <Image src={content.vegetationPath.src} alt="" width={content.vegetationPath.width} height={content.vegetationPath.height}
              sizes="(max-aspect-ratio: 1/1) 100vh, 125vw" loading="eager" />
          </div>
        )}
        <div className={styles.way} data-project-way>
          <Image src={content.way.src} alt="" width={content.way.width} height={content.way.height}
            sizes="(max-aspect-ratio: 1/1) 100vw, 88vw" loading="eager" />
        </div>
        <div className={styles.church} data-project-church>
          <Image src={content.church.src} alt="" width={content.church.width} height={content.church.height}
            sizes="(max-aspect-ratio: 1/1) 40vw, 29vw" loading="eager" />
        </div>
      </div>
      <div className={styles.projects} data-projects-content>
        <h2 id="home-projects-title" className={`${homeStyles.missionTitle} ${styles.title}`}>{content.title}</h2>
        <div className={styles.cards}>
          {content.projects.map(project => (
            <a className={styles.card} href={project.href} key={project.href}>
              <div className={styles.info}>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
              </div>
              <div className={styles.photo}>
                <Image src={project.image.src} alt="" width={project.image.width} height={project.image.height}
                  sizes="(max-width: 900px) 46vw, 23vw" loading="eager" />
                <div className={styles.overlay} />
              </div>
              <span className={styles.restTitle} aria-hidden="true">{project.title}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
