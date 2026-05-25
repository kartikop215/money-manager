import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      <section className="hero-layout">
        <div className="hero-panel">
          <span className="eyebrow">Cash flow clarity for everyday decisions</span>
          <h1 className="hero-title">
            Professional money management for personal finances.
          </h1>
          <p className="hero-copy">
            Track spending, set monthly controls, and review decisions with a
            premium workspace designed like a modern fintech dashboard.
          </p>

          <div className="hero-actions">
            <button className="btn" onClick={() => navigate("/signup")}>
              Open your workspace
            </button>
            <button className="btn-secondary" onClick={() => navigate("/login")}>
              Sign in
            </button>
          </div>

          <div className="hero-metrics">
            <div className="metric-chip">
              <span className="metric-label">Monthly control</span>
              <strong className="metric-value">98.4%</strong>
            </div>
            <div className="metric-chip">
              <span className="metric-label">Savings runway</span>
              <strong className="metric-value">21 days</strong>
            </div>
            <div className="metric-chip">
              <span className="metric-label">Advice response</span>
              <strong className="metric-value">&lt; 2 min</strong>
            </div>
          </div>
        </div>

        <div className="showcase-panel">
          <div className="hero-panel showcase-card">
            <div className="showcase-top">
              <div>
                <span className="panel-kicker">Live overview</span>
                <h3 className="panel-title">Monthly performance</h3>
              </div>
              <span className="status-pill">Healthy cash position</span>
            </div>

            <div className="chart-bars" aria-hidden="true">
              <div className="chart-bar" style={{ height: "44%" }} />
              <div className="chart-bar" style={{ height: "66%" }} />
              <div className="chart-bar" style={{ height: "58%" }} />
              <div className="chart-bar" style={{ height: "82%" }} />
              <div className="chart-bar" style={{ height: "74%" }} />
            </div>

            <div className="insight-list" style={{ marginTop: "18px" }}>
              <div className="mini-stat">
                <span className="stat-label">Budget adherence</span>
                <strong className="stat-value">?12,800</strong>
              </div>
              <div className="mini-stat">
                <span className="stat-label">Planned savings</span>
                <strong className="stat-value">?4,250</strong>
              </div>
            </div>
          </div>

          <div className="surface-card">
            <span className="panel-kicker">Decision support</span>
            <h3 className="panel-title">Ask before you spend</h3>
            <p className="muted-text">
              Simulate a purchase against your remaining balance and get a quick
              affordability decision before you commit.
            </p>
          </div>
        </div>
      </section>

      <section className="surface-card" style={{ marginTop: "24px" }}>
        <span className="panel-kicker">Designed for trust</span>
        <h2 className="section-title">Built to feel like a serious finance product</h2>
        <p className="section-copy">
          The experience focuses on clarity, hierarchy, and confident decisions
          so your budget feels measurable instead of messy.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <h3>Structured budget control</h3>
            <p>Keep monthly targets, fixed commitments, and remaining balance visible.</p>
          </div>
          <div className="feature-card">
            <h3>Decision-first expense flow</h3>
            <p>Move from adding transactions to understanding their impact immediately.</p>
          </div>
          <div className="feature-card">
            <h3>Readable analytics</h3>
            <p>See where your money goes with cleaner summaries and sharper charts.</p>
          </div>
        </div>
      </section>

      <section className="surface-card" style={{ marginTop: "24px" }}>
        <div className="cta-band">
          <div>
            <span className="panel-kicker">Get started</span>
            <h3 className="panel-title">Launch your personal finance workspace</h3>
            <p className="muted-text">
              Set up your budget in minutes and start tracking with a more
              credible product experience.
            </p>
          </div>
          <div className="inline-actions">
            <button className="btn" onClick={() => navigate("/signup")}>
              Create account
            </button>
            <button className="btn-secondary" onClick={() => navigate("/onboarding")}>
              Quick setup
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;