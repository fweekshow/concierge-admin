"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../manage.module.css";

interface HouseRuleItem { id: string; title: string; content: string; category: string | null; }

export default function HouseRulesPage() {
  const [items, setItems] = useState<HouseRuleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [editing, setEditing] = useState<HouseRuleItem | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try { const res = await fetch("/api/manage/houserules"); setItems(await res.json()); }
    catch { setError("Failed to load"); } finally { setLoading(false); }
  };

  const resetForm = () => { setTitle(""); setContent(""); setCategory(""); setEditing(null); setShowForm(false); };

  const editItem = (item: HouseRuleItem) => {
    setEditing(item); setTitle(item.title); setContent(item.content); setCategory(item.category || ""); setShowForm(true);
  };

  const handleSave = async () => {
    if (!title || !content) { setError("Title and content are required"); return; }
    setError(null);
    const body = { title, content, category: category || null };
    try {
      const url = editing ? `/api/manage/houserules/${editing.id}` : "/api/manage/houserules";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      setSuccess(editing ? "Updated!" : "Created!"); resetForm(); fetchItems();
      setTimeout(() => setSuccess(null), 3000);
    } catch { setError("Failed to save"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this house rule?")) return;
    try { await fetch(`/api/manage/houserules/${id}`, { method: "DELETE" }); fetchItems(); setSuccess("Deleted"); setTimeout(() => setSuccess(null), 3000); }
    catch { setError("Failed to delete"); }
  };

  if (loading) return <div className={styles.container}><div className={styles.loading}>Loading...</div></div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.backLink}>← Back to Dashboard</Link>
          <h1>🏠 House Rules</h1>
          <p>Manage house rules shown to users</p>
        </div>
      </header>
      <main className={styles.main}>
        {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}<button onClick={() => setError(null)}>×</button></div>}
        {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}

        {!showForm && <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ marginBottom: 20 }}>+ Add House Rule</button>}

        {showForm && (
          <div className={styles.formCard}>
            <h3>{editing ? "Edit House Rule" : "Add New House Rule"}</h3>
            <div className={styles.formGrid}>
              <div className={styles.field}><label>Title</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Rule title" /></div>
              <div className={styles.field}><label>Category</label><input type="text" value={category} onChange={e => setCategory(e.target.value)} placeholder="Optional category" /></div>
              <div className={`${styles.field} ${styles.formFull}`}><label>Content</label><textarea value={content} onChange={e => setContent(e.target.value)} rows={6} placeholder="Rule content..." /></div>
            </div>
            <div className={styles.formActions}>
              <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editing ? "Update" : "Add Rule"}</button>
            </div>
          </div>
        )}

        {items.length === 0 ? (<div className={styles.empty}><p>No house rules yet.</p></div>) : (
          <div className={styles.list}>
            {items.map(item => (
              <div key={item.id} className={styles.listItem}>
                <div className={styles.listItemContent}>
                  <div className={styles.listItemTitle}>{item.title}</div>
                  <div className={styles.listItemMeta}>{item.category ? `${item.category} · ` : ""}{item.content.substring(0, 100)}{item.content.length > 100 ? "..." : ""}</div>
                </div>
                <div className={styles.listItemActions}>
                  <button className={styles.btnSmall} onClick={() => editItem(item)}>Edit</button>
                  <button className={`${styles.btnSmall} ${styles.btnDanger}`} onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

