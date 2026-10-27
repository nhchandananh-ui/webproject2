import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    studentId: "",
    department: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => setForm({ ...form, [field]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-card">
      <h1>Create a student account</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Full name
          <input required value={form.name} onChange={update("name")} />
        </label>
        <label>
          Email
          <input type="email" required value={form.email} onChange={update("email")} />
        </label>
        <label>
          Password (min 8 characters)
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={update("password")}
          />
        </label>
        <label>
          Student / roll number (optional)
          <input value={form.studentId} onChange={update("studentId")} />
        </label>
        <label>
          Department (optional)
          <input value={form.department} onChange={update("department")} />
        </label>
        {error && <p className="error-text">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? "Creating account…" : "Register"}
        </button>
      </form>
      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
