"use client";

import { useEffect, useState, useCallback } from "react";
import s from "../shared.module.css";

interface User { id: string; name: string; role: string; }
interface Assignment { id: string; advocateId: string; clientId: string; advocate: User; client: User; assignedAt: string; }

export default function AssignmentsPage() {
  const [items, setItems] = useState<Assignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ advocateId: "", clientId: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [a, u] = await Promise.all([fetch("/api/assignments").then((r) => r.json()), fetch("/api/users").then((r) => r.json())]);
      setItems(a); setUsers(u);
    } catch { setError("Failed to load"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const advocates = users.filter((u) => u.role === "ADVOCATE" || u.role === "STAFF" || u.role === "ADMIN");
  const clients = users.filter((u) => u.role === "CLIENT");

  const openAdd = () => { setForm({ advocateId: advocates[0]?.id ?? "", clientId: clients[0]?.id ?? "" }); setError(null); setModal(true); };

  const handleSave = async () => {
    if (!form.advocateId || !form.clientId) { setError("Select both advocate and client"); return; }
    setSaving(true); setError(null);
    try {
      const res = await fetch("/api/assignments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error(d.error || "Failed"); }
      setModal(false); fetchData();
    } catch (e: any) { setError(e.message || "Failed to save"); }
    finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try { await fetch(`/api/assignments?id=${deleteId}`, { method: "DELETE" }); setDeleteId(null); fetchData(); }
    catch { setError("Failed to delete"); }
  };

  if (loading) return <div className={s.loading}>Loading assignments...</div>;

  return (
    <div className={s.container}>
      <div className={s.header}>
        <div><h1>🔗 Assignments</h1><p className={s.subtitle}>{items.length} advocate–client pairs</p></div>
        <div className={s.headerActions}><button className="btn btn-primary" onClick={openAdd}>+ Assign</button></div>
      </div>
      {error && <div className={s.errorBanner}>{error}</div>}
      <div className={s.tableWrap}>
        {items.length === 0 ? (
          <div className={s.empty}><div className={s.emptyIcon}>🔗</div><div className={s.emptyText}>No assignments yet</div><button className="btn btn-primary" onClick={openAdd}>Create First</button></div>
        ) : (
          <table className={s.table}>
            <thead><tr><th>Advocate</th><th>Advocate Role</th><th>Client</th><th>Assigned</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.advocate.name}</td>
                  <td><span className={`${s.badge} ${s.badgeGreen}`}>{a.advocate.role}</span></td>
                  <td style={{ fontWeight: 600 }}>{a.client.name}</td>
                  <td className={s.cellMuted}>{new Date(a.assignedAt).toLocaleDateString()}</td>
                  <td><button className={`${s.btnIcon} ${s.btnIconDanger}`} onClick={() => setDeleteId(a.id)}>🗑️</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modal && (
        <div className={s.modalOverlay} onClick={() => setModal(false)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}><h2>New Assignment</h2><button className={s.modalClose} onClick={() => setModal(false)}>✕</button></div>
            <div className={s.modalBody}>
              <div className={s.formGroup}>
                <label>Advocate / Staff</label>
                <select value={form.advocateId} onChange={(e) => setForm({ ...form, advocateId: e.target.value })}>
                  <option value="">Select...</option>
                  {advocates.map((u) => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
                </select>
              </div>
              <div className={s.formGroup}>
                <label>Client</label>
                <select value={form.clientId} onChange={(e) => setForm({ ...form, clientId: e.target.value })}>
                  <option value="">Select...</option>
                  {clients.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
              </div>
            </div>
            <div className={s.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Assign"}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className={s.modalOverlay} onClick={() => setDeleteId(null)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}><h2>Remove Assignment</h2><button className={s.modalClose} onClick={() => setDeleteId(null)}>✕</button></div>
            <div className={s.modalBody}><p className={s.confirmText}>Are you sure you want to remove this assignment?</p></div>
            <div className={s.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleDelete} style={{ background: "var(--error)" }}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
