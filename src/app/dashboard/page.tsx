"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

interface Stats {
  meals: number;
  activities: number;
  scheduleBlocks: number;
  staff: number;
  guidelines: number;
  houseRules: number;
  emergencyContacts: number;
  users: number;
  housekeeping: number;
  laundry: number;
  medications: number;
}

export default function DashboardOverview() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  const cards = [
    { label: "Meals", count: stats?.meals ?? 0, icon: "🍴", href: "/dashboard/meals" },
    { label: "Activities", count: stats?.activities ?? 0, icon: "🏃", href: "/dashboard/activities" },
    { label: "Schedule Blocks", count: stats?.scheduleBlocks ?? 0, icon: "📅", href: "/dashboard/schedule" },
    { label: "Staff Members", count: stats?.staff ?? 0, icon: "👥", href: "/dashboard/staff" },
    { label: "Guidelines", count: stats?.guidelines ?? 0, icon: "📖", href: "/dashboard/guidelines" },
    { label: "House Rules", count: stats?.houseRules ?? 0, icon: "🏠", href: "/dashboard/houserules" },
    { label: "Emergency Contacts", count: stats?.emergencyContacts ?? 0, icon: "🚨", href: "/dashboard/emergency" },
    { label: "Users", count: stats?.users ?? 0, icon: "🔑", href: "/dashboard/users" },
    { label: "Housekeeping", count: stats?.housekeeping ?? 0, icon: "🧹", href: "/dashboard/housekeeping" },
    { label: "Laundry", count: stats?.laundry ?? 0, icon: "👕", href: "/dashboard/laundry" },
    { label: "Medications", count: stats?.medications ?? 0, icon: "💊", href: "/dashboard/medications" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1>Dashboard</h1>
          <p className={styles.subtitle}>Overview of all data in the system</p>
        </div>
        <a href="/dashboard/csv-upload" className={styles.uploadBtn}>
          📤 CSV Upload
        </a>
      </div>
      <div className={styles.grid}>
        {cards.map((card) => (
          <a key={card.label} href={card.href} className={styles.statCard}>
            <span className={styles.statIcon}>{card.icon}</span>
            <div>
              <div className={styles.statCount}>{card.count}</div>
              <div className={styles.statLabel}>{card.label}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
