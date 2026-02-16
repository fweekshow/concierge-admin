"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../manage.module.css";

interface UserInfo { id: string; walletAddress: string; role: { name: string } }
interface Assignment { id: string; advocate: UserInfo; client: UserInfo; createdAt: string }

export default function AdvocatesPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [advocateId, setAdvocateId] = useState("");
  const [clientId, setClientId] = useState("");

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/manage/advocates");
      const data = await res.json();
      setAssignments(data.assignments || []);
      setUsers(data.users || []);
    } catch { setError("Failed to load"); }
    finally { setLoading(false); }
  };

  const advocates = users.filter(u => u.role?.name === "advocate");
  const clients = users.filter(u => u.role?.name === "client");

  const handleSave = async () => {
    if (!advocateId || !clientId) { setError("Select both advocate and client"); return; }
    setError(null);
    try {
      const res = await fetch("/api/manage/advocates", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ advocateUserId: advocateId, clientUserId: clientId }),
      });
      if (!res.ok) throw new Error();
      setSuccess("Assignment created!"); setShowForm(false);
      setAdvocateId(""); setClientId(""); fetchData();
      setTimeout(() => setSuccess(null), 3000);
    } catch { setError("Failed to create assignment. May already exist."); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this assignment?")) return;
    try {
      await fetch(`/api/manage/advocates/${id}`, { method: "DELETE" });
      fetchData(); setSuccess("Assignment removed");
      setTimeout(() => setSuccess(null), 3000);
    } catch { setError("Failed to remove"); }
  };

  const shortAddr = (addr: string) => addr.length > 16 ? `${addr.substring(0, 8)}...${addr.substring(addr.length - 6)}` : addr;

  if (loading) return <div className={styles.container}><div className={styles.loading}>Loading...</div></div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link href="/" className={styles.backLink}>← Back to Dashboard</Link>
          <h1>🙋 Advocates</h1>
          <p>Manage advocate-to-client assignments</p>
        </div>
      </header>
      <main className={styles.main}>
        {error && <div className={`${styles.alert} ${styles.alertError}`}>{error}<button onClick={() => setError(null)}>×</button></div>}
        {success && <div className={`${styles.alert} ${styles.alertSuccess}`}>{success}</div>}

        {!showForm && <button className="btn btn-primary" onClick={() => setShowForm(true)} style={{ marginBottom: 20 }}>+ Assign Advocate</button>}

        {showForm && (
          <div className={styles.formCard}>
            <h3>Assign Advocate to Client</h3>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Advocate</label>
                <select value={advocateId} onChange={e => setAdvocateId(e.target.value)}>
                  <option value="">Select advocate...</option>
                  {advocates.map(u => <option key={u.id} value={u.id}>{shortAddr(u.walletAddress)}</option>)}
                </select>
              </div>
              <div className={styles.field}>
                <label>Client</label>
                <select value={clientId} onChange={e => setClientId(e.target.value)}>
                  <option value="">Select client...</option>
                  {clients.map(u => <option key={u.id} value={u.id}>{shortAddr(u.walletAddress)}</option>)}
                </select>
              </div>
            </div>
            <div className={styles.formActions}>
              <button className="btn btn-secondary" onClick={() => { setShowForm(false); setAdvocateId(""); setClientId(""); }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>Assign</button>
            </div>
          </div>
        )}

        {assignments.length === 0 ? (<div className={styles.empty}><p>No advocate assignments yet.</p></div>) : (
          <div className={styles.list}>
            {assignments.map(a => (
              <div key={a.id} className={styles.listItem}>
                <div className={styles.listItemContent}>
                  <div className={styles.listItemTitle}>
                    {shortAddr(a.advocate.walletAddress)} → {shortAddr(a.client.walletAddress)}
                  </div>
                  <div className={styles.listItemMeta}>
                    Advocate ({a.advocate.role?.name}) assigned to Client ({a.client.role?.name})
                  </div>
                </div>
                <div className={styles.listItemActions}>
                  <button className={`${styles.btnSmall} ${styles.btnDanger}`} onClick={() => handleDelete(a.id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

