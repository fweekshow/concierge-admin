"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

const QUICK_ACTIONS = [
  { id: "schedule", label: "📅 Schedule", description: "Today's schedule message", href: "/manage/schedule", color: "#3b82f6" },
  { id: "meals", label: "🍴 Meals", description: "Meal templates and times", href: "/manage/meals", color: "#f59e0b" },
  { id: "activities", label: "🏃 Activities", description: "Activity schedule and details", href: "/manage/activities", color: "#22c55e" },
  { id: "logistics", label: "🧳 Logistics", description: "Logistics info message", href: "/manage/logistics", color: "#8b5cf6" },
  { id: "medications", label: "💊 Medications", description: "User medication schedules", href: "/manage/medications", color: "#ec4899" },
  { id: "guidelines", label: "📖 Guidelines", description: "Facility guidelines", href: "/manage/guidelines", color: "#06b6d4" },
  { id: "houserules", label: "🏠 House Rules", description: "House rules list", href: "/manage/houserules", color: "#f97316" },
  { id: "support", label: "🆘 Request Support", description: "Support request message", href: "/manage/support", color: "#ef4444" },
  { id: "advocates", label: "🙋 Advocates", description: "Advocate assignments", href: "/manage/advocates", color: "#14b8a6" },
];

export default function Dashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTop}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>🏠</span>
              <h1>Concierge Admin</h1>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
          <p className={styles.subtitle}>Manage quick action responses</p>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.grid}>
          {QUICK_ACTIONS.map((action) => (
            <Link key={action.id} href={action.href} className={styles.card}>
              <div className={styles.cardAccent} style={{ background: action.color }} />
              <div className={styles.cardBody}>
                <span className={styles.actionLabel}>{action.label}</span>
                <p className={styles.actionDesc}>{action.description}</p>
              </div>
              <div className={styles.cardArrow}>→</div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
