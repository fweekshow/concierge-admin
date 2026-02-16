"use client";

import Link from "next/link";
import styles from "../manage.module.css";

export default function SupportPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.backLink}>← Back to Dashboard</Link>
          <h1>🆘 Request Support</h1>
          <p>The support request response is currently a hardcoded message in the agent</p>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.formCard}>
          <h3>Current Message</h3>
          <div style={{ padding: "16px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", fontFamily: "'JetBrains Mono', monospace", fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.6 }}>
            🆘 Support request sent!
          </div>
          <p className={styles.hint} style={{ marginTop: 12 }}>
            To change this message, update the agent code in concierge-reddoor → mainmenu.plugin.ts → MAINMENU_SUPPORT_REQUEST handler.
          </p>
        </div>
      </main>
    </div>
  );
}

