import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createCase } from "../api/client.js";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const inputRef = useRef(null);
  const navigate = useNavigate();

  function chooseFile(nextFile) {
    setError("");
    setStatus("");
    if (!nextFile) return;
    const extension = nextFile.name.split(".").pop()?.toLowerCase();
    if (!nextFile.type.startsWith("image/") && !["csv", "dcm"].includes(extension)) {
      setFile(null);
      setError("Choose an image, CSV, or DICOM (.dcm) file.");
      return;
    }
    setFile(nextFile);
  }

  async function onSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError("Choose a study file before adding it to the queue.");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const newCase = await createCase({ fileName: file.name });
      setFile(null);
      setStatus(`${newCase.patient} was added and is awaiting clinician review.`);
      if (inputRef.current) inputRef.current.value = "";
    } catch {
      setError("The case could not be added. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleDrop(event) {
    event.preventDefault();
    setIsDragging(false);
    chooseFile(event.dataTransfer.files[0]);
  }

  return (
    <section className="upload-page">
      <Link className="back-link" to="/">← Back to queue</Link>
      <div className="page-heading upload-heading">
        <div>
          <p className="eyebrow">QUEUE MANAGEMENT</p>
          <h1>Add a case</h1>
          <p className="page-intro">Choose a study file to create a case for clinician review.</p>
        </div>
      </div>
      <div className="upload-layout">
        <form className="upload-card" onSubmit={onSubmit}>
          <label
            className={`drop-zone${isDragging ? " is-dragging" : ""}${file ? " has-file" : ""}`}
            onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) setIsDragging(false);
            }}
            onDrop={handleDrop}
          >
            <input
              ref={inputRef}
              className="file-input"
              type="file"
              accept="image/*,.csv,.dcm"
              onChange={(event) => chooseFile(event.target.files[0])}
            />
            <span className="upload-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 15.5v3A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5v-3" />
              </svg>
            </span>
            <strong>{file ? "Study ready to add" : "Drop a study file here"}</strong>
            <span className="drop-zone-caption">or <span className="browse-link">browse files</span></span>
            <span className="file-types">Images, CSV, or DICOM (.dcm)</span>
          </label>

          {file && (
            <div className="selected-file">
              <span className="file-type-icon" aria-hidden="true">FILE</span>
              <span className="selected-file-copy">
                <strong title={file.name}>{file.name}</strong>
                <span>{(file.size / (1024 * 1024)).toFixed(2)} MB · Ready to add</span>
              </span>
              <button
                className="remove-file"
                type="button"
                onClick={() => {
                  setFile(null);
                  setError("");
                  if (inputRef.current) inputRef.current.value = "";
                }}
                aria-label="Remove selected file"
              >×</button>
            </div>
          )}

          {error && <p className="error-message form-message" role="alert">{error}</p>}
          {status && <p className="success-message form-message" role="status">{status}</p>}

          <button className="button button-primary submit-button" type="submit" disabled={!file || isSubmitting}>
            {isSubmitting ? "Adding case…" : "Add to review queue"}
            {!isSubmitting && <span aria-hidden="true">→</span>}
          </button>
        </form>

        <aside className="upload-info-card">
          <span className="info-card-icon" aria-hidden="true">i</span>
          <h2>About this demo</h2>
          <p>Files are not uploaded or analyzed. Adding a file creates a temporary case using its filename; it stays in this tab's session and is marked <strong>Awaiting review</strong>.</p>
          <div className="info-divider" />
          <p className="info-disclaimer">Demo scores are placeholders only. A clinician must review the original study and make all care decisions.</p>
          {status && <button className="text-button" type="button" onClick={() => navigate("/")}>View review queue <span aria-hidden="true">→</span></button>}
        </aside>
      </div>
    </section>
  );
}
