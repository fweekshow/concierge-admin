"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../manage.module.css";

interface MedRecord {
  id: string;
  userId: string;
  schedule: Record<string, string[]>;
  user: { id: string; walletAddress: string };
}

export default function MedicationsPage() {
  const [meds, setMeds] = useState<MedRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editing, setEditing] = useState<MedRecord | null>(null);
  const [scheduleText, setScheduleText] = useState("");

  useEffect(() => { fetchMeds(); }, []);

  const fetchMeds = async () => {
    try { const res = await fetch("/api/manage/medications"); setMeds(await res.json()); }
    catch { setError("Failed to load medications"); } finally { setLoading(false); }
  };

  const editMed = (med: MedRecord) => {
    setEditing(med);
    setScheduleText(JSON.stringify(med.schedule, null, 2));
  };

  const handleSave = async () => {
    if (!editing) return;
    setError(null);
    let schedule;
    try { schedule = JSON.parse(scheduleText); } catch { setError("Invalid JSON format"); return; }
    try {
      const res = await fetch(`/api/manage/medications/${editing.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ schedule }),
      });
      if (!res.ok) throw new Error();
      setSuccess("Medication schedule updated!");
      setEditing(null); fetchMeds();
      setTimeout(() => setSuccess(null), 3000);
    } catch { setError("Failed to save"); }
  };

  if (loading) return <div className={styles.container}><div className={styles.loading}>Loading...</div></div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.backLink}>← Back to Dashboard</Link>
          <h1>💊 Medications</h1>
          <p>View and edit user medication schedules</p>
        </div>
      </header>
      <main className={styles.main}>
        {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}<button onClick={() => setError(null)}>×</button></div>}
        {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}

        {editing && (
          <div className={styles.formCard}>
            <h3>Edit Schedule for {editing.user.walletAddress.substring(0, 10)}...</h3>
            <div className={styles.field}>
              <label>Schedule (JSON)</label>
              <textarea className={styles.staticTextArea} value={scheduleText} onChange={e => setScheduleText(e.target.value)} rows={12} />
              <p className={styles.hint}>Format: {`{ "8:00 AM": ["Med1", "Med2"], "8:00 PM": ["Med3"] }`}</p>
            </div>
            <div className={styles.formActions}>
              <button className="btn btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Save Schedule</button>
            </div>
          </div>
        )}

        {meds.length === 0 ? (<div className={styles.empty}><p>No medication records found.</p></div>) : (
          <div className={styles.list}>
            {meds.map(med => {
              const schedule = med.schedule as Record<string, string[]>;
              const times = Object.keys(schedule);
              const totalMeds = times.reduce((sum, t) => sum + (Array.isArray(schedule[t]) ? schedule[t].length : 0), 0);
              return (
                <div key={med.id} className={styles.listItem}>
                  <div className={styles.listItemContent}>
                    <div className={styles.listItemTitle}>{med.user.walletAddress.substring(0, 16)}...</div>
                    <div className={styles.listItemMeta}>{times.length} time slots · {totalMeds} medications</div>
                  </div>
                  <div className={styles.listItemActions}>
                    <button className={styles.btnSmall} onClick={() => editMed(med)}>Edit</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

