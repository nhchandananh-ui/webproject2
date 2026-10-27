import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client.js";

const CATEGORIES = ["Hostel", "Academics", "Infrastructure", "Canteen", "IT/Network", "Other"];

export default function NewComplaint() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", description: "", category: "Other" });
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("title", form.title);
      payload.append("description", form.description);
      payload.append("category", form.category);
      if (image) payload.append("image", image);

      // Don't set Content-Type manually here — the browser needs to add its
      // own multipart boundary, which it only does if we leave this to it.
      await api.post("/complaints", payload);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit complaint");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <h1>Submit a complaint</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Title
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Wi-Fi down in Block C"
          />
        </label>
        <label>
          Category
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label>
          Description
          <textarea
            required
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the issue, location, and when it started"
          />
        </label>
        <label>
          Photo (optional)
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Submitting…" : "Submit complaint"}
        </button>
      </form>
    </div>
  );
}
