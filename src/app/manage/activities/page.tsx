"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../manage.module.css";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

interface Activity {
  id: string;
  name: string;
  description: string | null;
  startTime: string;
  endTime: string;
  location: string | null;
  daysOfWeek: string[];
  notes: string | null;
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editing, setEditing] = useState<Activity | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => { fetchActivities(); }, []);

  const fetchActivities = async () => {
    try {
      const res = await fetch("/api/manage/activities");
      const data = await res.json();
      setActivities(data);
    } catch { setError("Failed to load activities"); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setName(""); setDescription(""); setStartTime(""); setEndTime("");
    setLocation(""); setDaysOfWeek([]); setNotes(""); setEditing(null); setShowForm(false);
  };

  const editActivity = (a: Activity) => {
    setEditing(a); setName(a.name); setDescription(a.description || "");
    setStartTime(a.startTime); setEndTime(a.endTime); setLocation(a.location || "");
    setDaysOfWeek(a.daysOfWeek || []); setNotes(a.notes || ""); setShowForm(true);
  };

  const toggleDay = (day: string) => {
    setDaysOfWeek(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSave = async () => {
    if (!name || !startTime || !endTime) { setError("Name, start time, and end time are required"); return; }
    setError(null);
    const body = { name, description: description || null, startTime, endTime, location: location || null, daysOfWeek, notes: notes || null };
    try {
      const url = editing ? `/api/manage/activities/${editing.id}` : "/api/manage/activities";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Save failed");
      setSuccess(editing ? "Activity updated!" : "Activity created!");
      resetForm(); fetchActivities();
      setTimeout(() => setSuccess(null), 3000);
    } catch { setError("Failed to save activity"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this activity?")) return;
    try {
      await fetch(`/api/manage/activities/${id}`, { method: "DELETE" });
      fetchActivities(); setSuccess("Activity deleted"); setTimeout(() => setSuccess(null), 3000);
    } catch { setError("Failed to delete"); }
  };

  if (loading) return <div className={styles.container}><div className={styles.loading}>Loading...</div></div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.backLink}>← Back to Dashboard</Link>
          <h1>🏃 Activities</h1>
          <p>Manage activity templates shown to users</p>
        </div>
      </header>
      <main className={styles.main}>
        {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}<button onClick={() => setError(null)}>×</button></div>}
        {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}

        {!showForm && <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ marginBottom: 20 }}>+ Add Activity</button>}

        {showForm && (
          <div className={styles.formCard}>
            <h3>{editing ? "Edit Activity" : "Add New Activity"}</h3>
            <div className={styles.formGrid}>
              <div className={`${styles.field} ${styles.formFull}`}>
                <label>Name</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Activity name" />
              </div>
              <div className={styles.field}>
                <label>Start Time</label>
                <input type="text" value={startTime} onChange={e => setStartTime(e.target.value)} placeholder="e.g. 09:00" />
              </div>
              <div className={styles.field}>
                <label>End Time</label>
                <input type="text" value={endTime} onChange={e => setEndTime(e.target.value)} placeholder="e.g. 10:00" />
              </div>
              <div className={styles.field}>
                <label>Location</label>
                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Optional location" />
              </div>
              <div className={`${styles.field} ${styles.formFull}`}>
                <label>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={2} placeholder="Optional description" />
              </div>
              <div className={`${styles.field} ${styles.formFull}`}>
                <label>Days of Week</label>
                <div className={styles.daysRow}>
                  {DAYS.map(d => (
                    <button key={d} type="button" className={`${styles.dayChip} ${daysOfWeek.includes(d) ? styles.dayChipActive : ""}`} onClick={() => toggleDay(d)}>{d}</button>
                  ))}
                </div>
              </div>
              <div className={`${styles.field} ${styles.formFull}`}>
                <label>Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Optional notes" />
              </div>
            </div>
            <div className={styles.formActions}>
              <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editing ? "Update" : "Add Activity"}</button>
            </div>
          </div>
        )}

        {activities.length === 0 ? (
          <div className={styles.empty}><p>No activities configured yet.</p></div>
        ) : (
          <div className={styles.list}>
            {activities.map(a => (
              <div key={a.id} className={styles.listItem}>
                <div className={styles.listItemContent}>
                  <div className={styles.listItemTitle}>{a.name}</div>
                  <div className={styles.listItemMeta}>
                    {a.startTime} - {a.endTime}{a.location ? ` @ ${a.location}` : ""}{a.daysOfWeek?.length > 0 ? ` · ${a.daysOfWeek.join(", ")}` : ""}
                  </div>
                </div>
                <div className={styles.listItemActions}>
                  <button className={styles.btnSmall} onClick={() => editActivity(a)}>Edit</button>
                  <button className={`${styles.btnSmall} ${styles.btnDanger}`} onClick={() => handleDelete(a.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

