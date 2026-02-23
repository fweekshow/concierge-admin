"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import styles from "./layout.module.css";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview", icon: "📊" },
  { href: "/dashboard/meals", label: "Meals", icon: "🍴" },
  { href: "/dashboard/activities", label: "Activities", icon: "🏃" },
  { href: "/dashboard/schedule", label: "Daily Schedule", icon: "📅" },
  { href: "/dashboard/staff", label: "Staff", icon: "👥" },
  { href: "/dashboard/guidelines", label: "Guidelines", icon: "📖" },
  { href: "/dashboard/houserules", label: "House Rules", icon: "🏠" },
  { href: "/dashboard/emergency", label: "Emergency Contacts", icon: "🚨" },
  { href: "/dashboard/housekeeping", label: "Housekeeping", icon: "🧹" },
  { href: "/dashboard/laundry", label: "Laundry", icon: "👕" },
  { href: "/dashboard/users", label: "Users & Roles", icon: "🔑" },
  { href: "/dashboard/assignments", label: "Assignments", icon: "🔗" },
  { href: "/dashboard/overrides", label: "Action Overrides", icon: "⚙️" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.mobileHeader}>
        <button
          className={styles.hamburger}
          onClick={() => setSidebarOpen(true)}
          aria-label="Open menu"
        >
          <span /><span /><span />
        </button>
        <div className={styles.mobileTitle}>
          <span>🏠</span>
          <span>Concierge</span>
        </div>
      </div>

      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.overlayVisible : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <span className={styles.sidebarLogo}>🏠</span>
          <h1 className={styles.sidebarTitle}>Concierge</h1>
          <button
            className={styles.closeBtn}
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <nav className={styles.nav}>
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
                onClick={(e) => {
                  e.preventDefault();
                  router.push(item.href);
                  setSidebarOpen(false);
                }}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>
        <div className={styles.sidebarFooter}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            🚪 Logout
          </button>
        </div>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
