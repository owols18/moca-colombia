import Link from "next/link";

import styles from "./status.module.css";

export default function ProjectStatusPage() {
  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Moca Colombia</p>
        <h1>Design System in progress</h1>
        <p>
          The public Home will be developed last as a dedicated scrollytelling
          experience. The current review surface is the living Design System.
        </p>
        <Link href="/design-system">Open Design System</Link>
      </div>
    </main>
  );
}
