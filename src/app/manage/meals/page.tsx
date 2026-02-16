"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../manage.module.css";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

interface Meal {
  id: string;
  mealType: string;
  items: string[];
  startTime: string | null;
  endTime: string | null;
  daysOfWeek: string[];
  notes: string | null;
}

export default function MealsPage() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editing, setEditing] = useState<Meal | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [mealType, setMealType] = useState("breakfast");
  const [items, setItems] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState<string[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => { fetchMeals(); }, []);

  const fetchMeals = async () => {
    try {
      const res = await fetch("/api/manage/meals");
      const data = await res.json();
      setMeals(data);
    } catch { setError("Failed to load meals"); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setMealType("breakfast"); setItems(""); setStartTime(""); setEndTime("");
    setDaysOfWeek([]); setNotes(""); setEditing(null); setShowForm(false);
  };

  const editMeal = (meal: Meal) => {
    setEditing(meal);
    setMealType(meal.mealType);
    setItems(Array.isArray(meal.items) ? meal.items.join(", ") : "");
    setStartTime(meal.startTime || "");
    setEndTime(meal.endTime || "");
    setDaysOfWeek(meal.daysOfWeek || []);
    setNotes(meal.notes || "");
    setShowForm(true);
  };

  const toggleDay = (day: string) => {
    setDaysOfWeek(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSave = async () => {
    setError(null);
    const body = {
      mealType,
      items: items.split(",").map(s => s.trim()).filter(Boolean),
      startTime: startTime || null,
      endTime: endTime || null,
      daysOfWeek,
      notes: notes || null,
    };
    try {
      const url = editing ? `/api/manage/meals/${editing.id}` : "/api/manage/meals";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error("Save failed");
      setSuccess(editing ? "Meal updated!" : "Meal created!");
      resetForm();
      fetchMeals();
      setTimeout(() => setSuccess(null), 3000);
    } catch { setError("Failed to save meal"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this meal?")) return;
    try {
      await fetch(`/api/manage/meals/${id}`, { method: "DELETE" });
      fetchMeals();
      setSuccess("Meal deleted");
      setTimeout(() => setSuccess(null), 3000);
    } catch { setError("Failed to delete meal"); }
  };

  if (loading) return <div className={styles.container}><div className={styles.loading}>Loading meals...</div></div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.backLink}>← Back to Dashboard</Link>
          <h1>🍴 Meals</h1>
          <p>Manage meal templates shown to users</p>
        </div>
      </header>
      <main className={styles.main}>
        {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}<button onClick={() => setError(null)}>×</button></div>}
        {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}

        {!showForm && (
          <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ marginBottom: 20 }}>+ Add Meal</button>
        )}

        {showForm && (
          <div className={styles.formCard}>
            <h3>{editing ? "Edit Meal" : "Add New Meal"}</h3>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Meal Type</label>
                <select value={mealType} onChange={e => setMealType(e.target.value)}>
                  {MEAL_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label>Start Time</label>
                <input type="text" value={startTime} onChange={e => setStartTime(e.target.value)} placeholder="e.g. 08:00" />
              </div>
              <div className={styles.field}>
                <label>End Time</label>
                <input type="text" value={endTime} onChange={e => setEndTime(e.target.value)} placeholder="e.g. 09:00" />
              </div>
              <div className={`${styles.field} ${styles.formFull}`}>
                <label>Items (comma separated)</label>
                <input type="text" value={items} onChange={e => setItems(e.target.value)} placeholder="Eggs, Toast, Juice" />
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
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Optional notes..." />
              </div>
            </div>
            <div className={styles.formActions}>
              <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editing ? "Update Meal" : "Add Meal"}
              </button>
            </div>
          </div>
        )}

        {meals.length === 0 ? (
          <div className={styles.empty}><p>No meals configured yet.</p></div>
        ) : (
          <div className={styles.list}>
            {meals.map(meal => (
              <div key={meal.id} className={styles.listItem}>
                <div className={styles.listItemContent}>
                  <div className={styles.listItemTitle}>{meal.mealType.toUpperCase()}</div>
                  <div className={styles.listItemMeta}>
                    {meal.startTime && meal.endTime ? `${meal.startTime} - ${meal.endTime}` : "No time set"}
                    {" · "}
                    {Array.isArray(meal.items) ? meal.items.join(", ") : ""}
                    {meal.daysOfWeek?.length > 0 && ` · ${meal.daysOfWeek.join(", ")}`}
                  </div>
                </div>
                <div className={styles.listItemActions}>
                  <button className={styles.btnSmall} onClick={() => editMeal(meal)}>Edit</button>
                  <button className={`${styles.btnSmall} ${styles.btnDanger}`} onClick={() => handleDelete(meal.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

