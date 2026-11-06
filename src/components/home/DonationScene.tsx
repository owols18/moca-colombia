import Image from "next/image";
import { SharedCta } from "@/components/site/SharedCta";
import type { HomePartGContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import styles from "./DonationScene.module.css";

export function DonationScene({ content, locale }: { content: HomePartGContent; locale: Locale }) {
  return <div className={styles.scene} data-donation-scene>
    <div className={styles.landscape} aria-hidden="true">
      {content.trees.map((asset, index) => <div className={styles.tree} data-cocoa-tree={index + 1} key={asset.src}>
        <Image src={asset.src} width={asset.width} height={asset.height} alt="" unoptimized loading="eager" />
      </div>)}
      <div className={styles.grains} data-cocoa-grains>
        <Image src={content.grains.src} width={content.grains.width} height={content.grains.height} alt="" unoptimized loading="eager" />
      </div>
    </div>
    <div className={styles.content} data-donation-content>
      <div className={styles.cta} data-donation-cta><SharedCta content={content.cta} locale={locale} /></div>
    </div>
  </div>;
}
