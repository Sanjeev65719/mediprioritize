import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listCases } from "../api/client.js";
import { levelFromScore, priorityScore, sortByPriority } from "../lib/triage.js";
import CaseTable from "../components/CaseTable.jsx";

export default function Dashboard() {
  const [cases, setCases] = useState([]);
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState("all");
  const [sort, setSort] = useState("priority");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    listCases()
      .then((items) => {
        if (active) setCases(items);
      })
      .catch(() => {
        if (active) setError("The case queue could not be loaded. Please try again.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const counts = cases.reduce((result, item) => {
    const score = priorityScore(item);
    const level = score == null ? "pending" : levelFromScore(score);
    result[level] += 1;
    return result;
  }, { critical: 0, urgent: 0, routine: 0, pending: 0 });

  const normalizedQuery = query.trim().toLowerCase();
  const visibleCases = cases.filter((item) => {
    const score = priorityScore(item);
    const level = score == null ? "pending" : levelFromScore(score);
    const matchesPriority = priority === "all" || level === priority;
    const searchable = `${item.patient} ${item.modality} ${item.finding}`.toLowerCase();
    return matchesPriority && (!normalizedQuery || searchable.includes(normalizedQuery));
  });
  const sortedCases = sort === "newest"
    ? [...visibleCases].sort((a, b) => new Date(b.received) - new Date(a.received))
    : sortByPriority(visibleCases);

  return (
    <section className="dashboard-page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">CLINICAL WORKSPACE <span className="eyebrow-dot" /></p>
          <h1>Review queue</h1>
          <p className="page-intro">A clear view of studies waiting for your attention.</p>
        </div>
        <Link className="button button-primary heading-action" to="/upload">
          <span aria-hidden="true">+</span> Add a case
        </Link>
      </div>

      <div className="notice-banner" role="note">
        <span className="notice-icon" aria-hidden="true">i</span>
        <p><strong>Demo mode:</strong> sample context can change the illustrative queue order. Scores are not clinical assessments; always review the original study.</p>
      </div>

      <div className="stats-grid" aria-label="Queue summary">
        <article className="stat-card stat-card-total">
          <div className="stat-topline"><span>All studies</span><span className="stat-icon">▤</span></div>
          <strong className="stat-value">{cases.length}</strong>
          <span className="stat-caption">in the review queue</span>
        </article>
        <article className="stat-card stat-card-critical">
          <div className="stat-topline"><span>Critical</span><span className="stat-icon">!</span></div>
          <strong className="stat-value">{counts.critical}</strong>
          <span className="stat-caption">placeholder priority</span>
        </article>
        <article className="stat-card stat-card-urgent">
          <div className="stat-topline"><span>Urgent</span><span className="stat-icon">↑</span></div>
          <strong className="stat-value">{counts.urgent}</strong>
          <span className="stat-caption">placeholder priority</span>
        </article>
        <article className="stat-card stat-card-pending">
          <div className="stat-topline"><span>Awaiting review</span><span className="stat-icon">◷</span></div>
          <strong className="stat-value">{counts.pending}</strong>
          <span className="stat-caption">new demo submissions</span>
        </article>
      </div>

      <section className="queue-panel" aria-labelledby="queue-title">
        <div className="queue-panel-heading">
          <div>
            <h2 id="queue-title">Cases</h2>
            <p className="muted">Search and filter the current queue.</p>
          </div>
          <span className="result-count">{sortedCases.length} {sortedCases.length === 1 ? "case" : "cases"}</span>
        </div>
        <div className="queue-controls">
          <label className="search-field">
            <span className="search-icon" aria-hidden="true" />
            <span className="visually-hidden">Search cases</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search case, study, or finding"
            />
            {query && (
              <button className="clear-search" type="button" onClick={() => setQuery("")} aria-label="Clear search">×</button>
            )}
          </label>
          <label className="select-field">
            <span className="visually-hidden">Filter by priority</span>
            <select value={priority} onChange={(event) => setPriority(event.target.value)}>
              <option value="all">All priorities</option>
              <option value="critical">Critical</option>
              <option value="urgent">Urgent</option>
              <option value="routine">Routine</option>
              <option value="pending">Awaiting review</option>
            </select>
          </label>
          <label className="select-field">
            <span className="visually-hidden">Sort cases</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              <option value="priority">Sort: priority</option>
              <option value="newest">Sort: newest</option>
            </select>
          </label>
        </div>
        {error ? <p className="error-message" role="alert">{error}</p> : null}
        {loading ? (
          <div className="loading-state" role="status">Loading case queue…</div>
        ) : (
          <CaseTable cases={sortedCases} />
        )}
      </section>
    </section>
  );
}
