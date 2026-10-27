import React, { useEffect, useState } from "react";
import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import StatusBadge from "../components/StatusBadge.jsx";

const STATUSES = ["pending", "in-progress", "resolved", "rejected"];

export default function Dashboard() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const { data } = await api.get("/complaints", {
        params: statusFilter ? { status: statusFilter } : {},
      });
      setComplaints(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load complaints");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  async function updateComplaint(id, updates) {
    try {
      const { data } = await api.patch(`/complaints/${id}`, updates);
      setComplaints((prev) => prev.map((c) => (c._id === id ? data : c)));
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{user.role === "admin" ? "All complaints" : "My complaints"}</h1>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {loading && <p>Loading…</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && complaints.length === 0 && <p>No complaints found.</p>}

      <div className="complaint-list">
        {complaints.map((c) => (
          <div className="complaint-card" key={c._id}>
            <div className="complaint-card-header">
              <h3>{c.title}</h3>
              <StatusBadge status={c.status} />
            </div>
            <p className="meta">
              {c.category} · {c.department || "Unassigned"} ·{" "}
              {new Date(c.createdAt).toLocaleString()}
            </p>
            {user.role === "admin" && (
              <p className="meta">
                From: {c.student?.name} ({c.student?.email})
              </p>
            )}
            <p>{c.description}</p>
            {c.imagePath && (
              <a href={c.imagePath} target="_blank" rel="noreferrer">
                View attached photo
              </a>
            )}
            {c.adminNote && (
              <p className="admin-note">
                <strong>Admin note:</strong> {c.adminNote}
              </p>
            )}

            {user.role === "admin" && (
              <AdminControls complaint={c} onUpdate={updateComplaint} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminControls({ complaint, onUpdate }) {
  const [status, setStatus] = useState(complaint.status);
  const [department, setDepartment] = useState(complaint.department || "");
  const [adminNote, setAdminNote] = useState(complaint.adminNote || "");

  function save() {
    onUpdate(complaint._id, { status, department, adminNote });
  }

  return (
    <div className="admin-controls">
      <label>
        Status
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
      <label>
        Department
        <input value={department} onChange={(e) => setDepartment(e.target.value)} />
      </label>
      <label>
        Note
        <input value={adminNote} onChange={(e) => setAdminNote(e.target.value)} />
      </label>
      <button onClick={save}>Save</button>
    </div>
  );
}
