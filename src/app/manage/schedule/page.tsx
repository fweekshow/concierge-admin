"use client";

import Link from "next/link";
import styles from "../manage.module.css";

export default function SchedulePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.backLink}>← Back to Dashboard</Link>
          <h1>📅 Schedule</h1>
          <p>The schedule response is generated from Meals and Activities data</p>
        </div>
      </header>
      <main className={styles.main}>
        <div className={styles.formCard}>
          <h3>How Schedule Works</h3>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.6 }}>
            When a user taps <strong>Schedule</strong>, the agent currently sends a static message. 
            To change what users see, edit the <strong>Meals</strong> and <strong>Activities</strong> sections 
            from the dashboard. The agent pulls schedule data from those tables.
          </p>
          <div className={styles.formActions}>
            <Link href="/manage/meals" className="btn btn-secondary">Edit Meals</Link>
            <Link href="/manage/activities" className="btn btn-primary">Edit Activities</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

