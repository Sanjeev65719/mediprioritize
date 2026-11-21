import { NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import Upload from "./pages/Upload.jsx";
import CaseDetail from "./pages/CaseDetail.jsx";

export default function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink to="/" className="brand" aria-label="MediPrioritize home">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-copy">
            <strong>MediPrioritize</strong>
            <span>Imaging review workspace</span>
          </span>
        </NavLink>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end className="nav-link">Queue</NavLink>
          <NavLink to="/upload" className="nav-link nav-link-primary">
            <span aria-hidden="true">+</span> Add a case
          </NavLink>
        </nav>
      </header>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/cases/:id" element={<CaseDetail />} />
        </Routes>
      </main>
      <footer className="site-footer">
        <span>For clinician review only</span>
        <span>Demo prioritization is not a diagnosis.</span>
      </footer>
    </div>
  );
}
