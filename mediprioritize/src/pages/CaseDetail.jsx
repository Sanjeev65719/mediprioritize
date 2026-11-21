import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getCase } from "../api/client.js";
import { priorityScore } from "../lib/triage.js";
import UrgencyBadge from "../components/UrgencyBadge.jsx";

export default function CaseDetail() {
  const { id } = useParams();
  const [c, setC] = useState(undefined);
  useEffect(() => { getCase(id).then(setC); }, [id]);

  if (c === undefined) return <p className="loading-state">Loading case…</p>;
  if (c === null) {
    return (
      <div className="empty-state detail-empty">
        <h1>Case not found</h1>
        <p>This case may no longer be available in the current demo session.</p>
        <Link className="button button-primary" to="/">Back to queue</Link>
      </div>
    );
  }
  const score = priorityScore(c);
  const multimodal = c.multimodal;
  return (
    <section className="detail-page">
      <Link className="back-link" to="/">← Back to queue</Link>
      <div className="detail-card">
        <div className="detail-heading">
          <div>
            <p className="eyebrow">CASE OVERVIEW</p>
            <h1>{c.patient}</h1>
          </div>
          <UrgencyBadge score={score} />
        </div>
        <div className="detail-grid">
          <div className="detail-field">
            <span>Study type</span>
            <strong>{c.modality}</strong>
          </div>
          <div className="detail-field">
            <span>Received</span>
            <strong>{c.received ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(new Date(c.received)) : "—"}</strong>
          </div>
          <div className="detail-field detail-field-wide">
            <span>Finding</span>
            <strong>{c.finding}</strong>
          </div>
        </div>
        <div className="detail-notice">
          <span aria-hidden="true">i</span>
          <p>{c.score == null
            ? "This demo case has no priority score. Review the original study; the application does not analyze uploaded files."
            : "All priority scores and context adjustments are illustrative placeholders, not clinical assessments. Review the original study and make an independent clinical assessment."}</p>
        </div>
      </div>

      <section className="fusion-section" aria-labelledby="fusion-title">
        <div className="fusion-section-heading">
          <div>
            <p className="eyebrow">MULTIMODAL FUSION</p>
            <h2 id="fusion-title">Imaging + patient context</h2>
          </div>
          <span className="demo-tag">Illustrative sample</span>
        </div>
        <div className="fusion-grid">
          <article className="context-card">
            <h3>Structured context</h3>
            {multimodal ? (
              <>
                <div className="context-group">
                  <span className="context-label">Labs</span>
                  {multimodal.labs.map((item) => (
                    <div className="context-row" key={item.name}>
                      <span>{item.name}</span>
                      <strong className="context-value-attention">{item.value}</strong>
                    </div>
                  ))}
                </div>
                <div className="context-group">
                  <span className="context-label">Vitals</span>
                  {multimodal.vitals.map((item) => (
                    <div className="context-row" key={item.name}>
                      <span>{item.name}</span><strong>{item.value}</strong>
                    </div>
                  ))}
                </div>
                <div className="context-group">
                  <span className="context-label">History</span>
                  <p className="context-description">{multimodal.history}</p>
                </div>
              </>
            ) : (
              <p className="context-empty">No structured labs, vitals, or history are attached to this sample case.</p>
            )}
          </article>

          <article className="comparison-card">
            <div className="comparison-card-heading">
              <h3>Longitudinal comparison</h3>
              <span className="comparison-icon" aria-hidden="true">↗</span>
            </div>
            {multimodal?.priorScan ? (
              <>
                <div className="scan-comparison">
                  <div className="scan-point">
                    <span className="scan-point-dot scan-point-muted" />
                    <div>
                      <span className="scan-date">PREVIOUS · {multimodal.priorScan.date}</span>
                      <p>{multimodal.priorScan.finding}</p>
                    </div>
                  </div>
                  <div className="scan-connector" />
                  <div className="scan-point">
                    <span className="scan-point-dot" />
                    <div>
                      <span className="scan-date">CURRENT · {c.received ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(c.received)) : "Today"}</span>
                      <p>{multimodal.currentScan}</p>
                    </div>
                  </div>
                </div>
                <div className="change-highlight">
                  <span className="change-icon" aria-hidden="true">↗</span>
                  <div><strong>Change highlighted</strong><p>{multimodal.change}</p></div>
                </div>
              </>
            ) : (
              <p className="context-empty">No prior scan is available for comparison in this sample.</p>
            )}
          </article>
        </div>

        <article className="fusion-score-card">
          <div className="fusion-score-copy">
            <span className="context-label">DEMO PRIORITY PREVIEW</span>
            <strong>Context can change queue order</strong>
            <p>This example combines a placeholder image score with sample structured signals. The weighting is not clinically validated.</p>
          </div>
          <div className="score-comparison">
            <div className="score-step">
              <span>Image only</span>
              <strong>{multimodal ? multimodal.imageOnlyScore.toFixed(2) : score == null ? "—" : score.toFixed(2)}</strong>
            </div>
            {multimodal && (
              <>
                <span className="score-plus" aria-hidden="true">+</span>
                <div className="score-step score-context-step">
                  <span>Context demo</span>
                  <strong>{multimodal.contextAdjustment.toFixed(2)}</strong>
                </div>
              </>
            )}
            <span className="score-equals" aria-hidden="true">→</span>
            <div className="score-step score-total-step">
              <span>Combined demo</span>
              <strong>{score == null ? "Pending" : score.toFixed(2)}</strong>
            </div>
          </div>
        </article>
      </section>
    </section>
  );
}
