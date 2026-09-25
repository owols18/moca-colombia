import type { Metadata } from "next";
import Image from "next/image";

import { Button, ButtonLink } from "@/components/ui/Button";
import { TextAreaField, TextField } from "@/components/ui/FormField";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaPreview, SiteFooterPreview, SiteHeaderPreview } from "@/components/ui/SiteChrome";

import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Design System",
  robots: { follow: false, index: false },
};

const colors = [
  ["Forest", "#245749", "Primary brand and headings"],
  ["Cacao", "#8A5639", "Warm brand accent"],
  ["Sand", "#E8D9C2", "Section background"],
  ["Ivory", "#F7F1E7", "Light surface and inverted text"],
  ["Ink", "#1D2925", "Primary body copy"],
  ["Muted", "#66736D", "Footer and secondary copy"],
  ["Gold", "#C59B50", "Rules and focused accents"],
  ["White", "#FFFFFF", "Primary canvas"],
] as const;

const spacing = [4, 8, 12, 16, 24, 32, 48, 64, 96, 128];

export default function DesignSystemPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Moca Colombia · Foundation 01</p>
          <h1>A visual system rooted in warmth, dignity, and action.</h1>
          <p>
            This living page converts the approved Illustrator language into a
            responsive, accessible set of reusable web foundations.
          </p>
        </div>
        <div className={styles.heroMark} aria-hidden="true">
          <Image alt="" height={398} loading="eager" src="/brand/icon-cocoa.svg" width={427} />
        </div>
      </section>

      <nav aria-label="Design system sections" className={styles.jumpNav}>
        <a href="#colors">Colors</a>
        <a href="#typography">Typography</a>
        <a href="#spacing">Spacing</a>
        <a href="#buttons">Buttons</a>
        <a href="#forms">Forms</a>
        <a href="#surfaces">Surfaces</a>
        <a href="#chrome">Site chrome</a>
      </nav>

      <section className={styles.section} id="colors">
        <SectionHeading eyebrow="01 · Foundations">Color system</SectionHeading>
        <p className={styles.intro}>
          The approved brand colors remain primary. Gold is formalized as a
          supporting accent because it appears repeatedly in rules and borders.
        </p>
        <div className={styles.swatches}>
          {colors.map(([name, value, use]) => (
            <article className={styles.swatch} key={name}>
              <div style={{ backgroundColor: value }} />
              <h3>{name}</h3>
              <code>{value}</code>
              <p>{use}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.sandSection}`} id="typography">
        <SectionHeading eyebrow="02 · Foundations">Typography</SectionHeading>
        <div className={styles.typeStack}>
          <article>
            <span>Display · Comfortaa Medium</span>
            <p className={styles.displayType}>Make a difference</p>
          </article>
          <article>
            <span>H1 · Comfortaa SemiBold</span>
            <p className={styles.h1Type}>Our mission</p>
          </article>
          <article>
            <span>H2 · Comfortaa Medium</span>
            <p className={styles.h2Type}>Community challenge</p>
          </article>
          <article>
            <span>Body large · Manrope Light</span>
            <p className={styles.bodyLargeType}>
              We strengthen education, healthcare, nutrition, and sustainable
              livelihoods through community-led initiatives.
            </p>
          </article>
          <article>
            <span>Caption · Manrope Light</span>
            <p className={styles.captionType}>La Argentina, Colombia · 2026</p>
          </article>
        </div>
      </section>

      <section className={styles.section} id="spacing">
        <SectionHeading eyebrow="03 · Foundations">Spacing and layout</SectionHeading>
        <div className={styles.layoutGrid}>
          <div className={styles.spacingScale}>
            {spacing.map((value) => (
              <div key={value}>
                <span>{value}</span>
                <i style={{ width: `${Math.max(value, 4)}px` }} />
              </div>
            ))}
          </div>
          <div className={styles.layoutNotes}>
            <h3>Responsive layout rules</h3>
            <ul>
              <li>Full-bleed backgrounds; capped content at 1760px.</li>
              <li>Fluid gutters from 20px to 120px.</li>
              <li>Readable text capped near 72 characters.</li>
              <li>Section rhythm scales from 72px to 144px.</li>
              <li>Mobile starts at 320px without horizontal overflow.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.forestSection}`} id="buttons">
        <SectionHeading eyebrow="04 · Components" inverted>
          Buttons and actions
        </SectionHeading>
        <div className={styles.buttonMatrix}>
          <div className={styles.lightPreview}>
            <span>Primary</span>
            <Button>Learn more</Button>
          </div>
          <div className={styles.lightPreview}>
            <span>Secondary</span>
            <Button variant="secondary">View project</Button>
          </div>
          <div>
            <span>Light</span>
            <Button variant="light">Donate now</Button>
          </div>
          <div>
            <span>Outline on dark</span>
            <Button variant="outlineLight">Partner with us</Button>
          </div>
          <div className={styles.lightPreview}>
            <span>Disabled</span>
            <Button disabled>Unavailable</Button>
          </div>
          <div>
            <span>Link treatment</span>
            <ButtonLink href="#forms" variant="light">
              Continue
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className={styles.section} id="forms">
        <SectionHeading eyebrow="05 · Components">Form controls</SectionHeading>
        <form className={styles.formPreview}>
          <TextField id="full-name" label="Your full name" placeholder="Full name" />
          <TextField
            hint="We will only use this address to respond."
            id="email"
            label="Your email"
            placeholder="name@example.com"
            type="email"
          />
          <TextField
            error="Enter a valid phone number."
            id="phone"
            label="Your phone"
            placeholder="+1 555 000 0000"
            type="tel"
          />
          <TextAreaField
            id="message"
            label="Tell us about you"
            placeholder="How would you like to help?"
          />
          <div>
            <Button type="button">Send message</Button>
          </div>
        </form>
      </section>

      <section className={`${styles.section} ${styles.ivorySection}`} id="surfaces">
        <SectionHeading eyebrow="06 · Patterns">Surfaces and cards</SectionHeading>
        <div className={styles.surfaceGrid}>
          <article className={styles.editorialCard}>
            <p>Editorial split</p>
            <h3>Purpose</h3>
            <span>
              Clear copy, generous whitespace, and a warm photographic frame
              create the recurring editorial rhythm.
            </span>
          </article>
          <article className={styles.projectCard}>
            <Image alt="" height={398} src="/brand/icon-cocoa.svg" width={427} />
            <p>Mocacao</p>
            <h3>Turning cacao into opportunity</h3>
            <ButtonLink href="#chrome" size="small" variant="secondary">
              Explore project
            </ButtonLink>
          </article>
          <article className={styles.darkCard}>
            <p>Impact</p>
            <strong>Community-led change grows over time.</strong>
            <span>Dark surfaces always use ivory copy and visible focus states.</span>
          </article>
        </div>
      </section>

      <section className={styles.chromeSection} id="chrome">
        <SectionHeading align="center" eyebrow="07 · Patterns">
          Shared site chrome
        </SectionHeading>
        <div className={styles.chromeStack}>
          <SiteHeaderPreview />
          <CtaPreview />
          <SiteFooterPreview />
        </div>
      </section>
    </main>
  );
}
