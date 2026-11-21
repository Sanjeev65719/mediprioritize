import { levelFromScore } from "../lib/triage.js";

export default function UrgencyBadge({ score }) {
  if (score == null) {
    return <span className="badge badge-pending">Awaiting review</span>;
  }

  const level = levelFromScore(score);
  return <span className={`badge badge-${level}`}>{level}</span>;
}
