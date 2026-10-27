import React from "react";

const LABELS = {
  pending: "Pending",
  "in-progress": "In progress",
  resolved: "Resolved",
  rejected: "Rejected",
};

export default function StatusBadge({ status }) {
  return <span className={`badge badge-${status}`}>{LABELS[status] || status}</span>;
}
