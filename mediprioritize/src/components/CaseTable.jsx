import { Link } from "react-router-dom";
import { priorityScore } from "../lib/triage.js";
import UrgencyBadge from "./UrgencyBadge.jsx";

function formatReceived(received) {
  if (!received) return "—";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(received));
}

export default function CaseTable({ cases }) {
  if (!cases.length) {
    return (
      <div className="empty-state">
        <span className="empty-state-icon" aria-hidden="true">⌕</span>
        <h2>No matching cases</h2>
        <p>Try changing your search or filters to see more studies.</p>
      </div>
    );
  }

  return (
    <div className="table-scroll">
      <table className="case-table">
        <thead>
          <tr>
            <th scope="col">Priority</th>
            <th scope="col">Case</th>
            <th scope="col">Study</th>
            <th scope="col">Finding</th>
            <th scope="col">Received</th>
            <th scope="col"><span className="visually-hidden">Open case</span></th>
          </tr>
        </thead>
        <tbody>
          {cases.map((c) => (
            <tr key={c.id}>
              <td><UrgencyBadge score={priorityScore(c)} /></td>
              <td>
                <Link className="case-link" to={`/cases/${c.id}`}>{c.patient}</Link>
              </td>
              <td>{c.modality}</td>
              <td className="finding-cell">
                {c.finding}
                {c.multimodal && <span className="context-pill">Context matched</span>}
              </td>
              <td className="received-cell">{formatReceived(c.received)}</td>
              <td>
                <Link className="row-action" to={`/cases/${c.id}`} aria-label={`Open ${c.patient}`}>
                  <span aria-hidden="true">→</span>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
