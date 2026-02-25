"use client";

import { useEffect, useState, useCallback } from "react";
import s from "../shared.module.css";

interface User { id: string; name: string; role: string; }
interface Assignment {
  id: string;
  advocateUserId: string;
  clientUserId: string;
  advocate: { id: string; name: string; walletAddress: string };
  client: { id: string; name: string; walletAddress: string };
  createdAt: string;
}

export default function AssignmentsPage() {
  const [items, setItems] = useState<Assignment[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ advocateUserId: "", clientUserId: "" });
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

  const advocates = users.filter((u) => {
    const r = u.role.toLowerCase();
    return r === "advocate" || r === "staff" || r === "admin";
  });
  const clients = users.filter((u) => u.role.toLowerCase() === "client");

  const openAdd = () => { setForm({ advocateUserId: advocates[0]?.id ?? "", clientUserId: clients[0]?.id ?? "" }); setError(null); setModal(true); };

  const handleSave = async () => {
    if (!form.advocateUserId || !form.clientUserId) { setError("Select both advocate and client"); return; }
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
        <div className={s.headerActions}>
          <button className={s.btnIcon} onClick={openAdd} style={{ width: "auto", padding: "8px 16px" }}>➕ Assign</button>
        </div>
      </div>
      {error && <div className={s.errorBanner}>{error}</div>}
      <div className={s.tableWrap}>
        {items.length === 0 ? (
          <div className={s.empty}><div className={s.emptyIcon}>🔗</div><div className={s.emptyText}>No assignments yet</div>
            <button className={s.btnIcon} onClick={openAdd} style={{ width: "auto", padding: "8px 16px" }}>➕ Create First</button>
          </div>
        ) : (
          <table className={s.table}>
            <thead><tr><th>Advocate</th><th>Client</th><th>Assigned</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{a.advocate?.name || "—"}</div>
                    <div className={s.cellMuted} style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}>{a.advocate?.walletAddress?.slice(0, 10)}...</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{a.client?.name || "—"}</div>
                    <div className={s.cellMuted} style={{ fontSize: 11, fontFamily: "JetBrains Mono, monospace" }}>{a.client?.walletAddress?.slice(0, 10)}...</div>
                  </td>
                  <td className={s.cellMuted}>{new Date(a.createdAt).toLocaleDateString()}</td>
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
              {error && <div className={s.errorBanner}>{error}</div>}
              <div className={s.formGroup}>
                <label>Advocate / Staff</label>
                <select value={form.advocateUserId} onChange={(e) => setForm({ ...form, advocateUserId: e.target.value })}>
                  <option value="">Select...</option>
                  {advocates.map((u) => <option key={u.id} value={u.id}>{u.name || "Unnamed"} ({u.role})</option>)}
                </select>
              </div>
              <div className={s.formGroup}>
                <label>Client</label>
                <select value={form.clientUserId} onChange={(e) => setForm({ ...form, clientUserId: e.target.value })}>
                  <option value="">Select...</option>
                  {clients.map((u) => <option key={u.id} value={u.id}>{u.name || "Unnamed"}</option>)}
                </select>
              </div>
            </div>
            <div className={s.modalFooter}>
              <button className={s.btnIcon} style={{ width: "auto", padding: "8px 16px" }} onClick={() => setModal(false)}>Cancel</button>
              <button className={s.btnIcon} style={{ width: "auto", padding: "8px 16px", background: "var(--accent-primary)", color: "white", borderColor: "var(--accent-primary)" }} onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Assign"}</button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className={s.modalOverlay} onClick={() => setDeleteId(null)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <div className={s.modalHeader}><h2>Remove Assignment</h2><button className={s.modalClose} onClick={() => setDeleteId(null)}>✕</button></div>
            <div className={s.modalBody}><p className={s.confirmText}>Are you sure you want to remove this advocate–client assignment?</p></div>
            <div className={s.modalFooter}>
              <button className={s.btnIcon} style={{ width: "auto", padding: "8px 16px" }} onClick={() => setDeleteId(null)}>Cancel</button>
              <button className={`${s.btnIcon} ${s.btnIconDanger}`} style={{ width: "auto", padding: "8px 16px" }} onClick={handleDelete}>Remove</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
