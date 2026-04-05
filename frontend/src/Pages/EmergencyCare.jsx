import React, { useMemo, useState } from "react";
import { emergencyServices, emergencySteps, serviceAreas } from "../data/emergency";

const EmergencyCare = () => {
  const [selectedZone, setSelectedZone] = useState("Civil Lines");
  const [requestSent, setRequestSent] = useState(false);

  const matchingServices = useMemo(
    () =>
      emergencyServices.filter((service) =>
        service.areas.some((area) =>
          area.toLowerCase().includes(selectedZone.toLowerCase())
        )
      ),
    [selectedZone]
  );

  return (
    <main className="page-shell container">
      <section className="page-hero scenic-surface emergency-hero">
        <div>
          <span className="eyebrow">Emergency Help</span>
          <h1>Emergency doctor, urgent medicine help, and home visit support near your area.</h1>
          <p>
            This page is built for urgent situations where someone needs quick
            guidance, a nearby doctor visit, or emergency medicine support
            without struggling through a long booking flow.
          </p>
          <div className="hero-actions">
            <button
              type="button"
              className="btn primary-btn"
              onClick={() => setRequestSent(true)}
            >
              Request Emergency Visit
            </button>
            <a href="tel:+919876511000" className="btn ghost-btn">
              Call Emergency Desk
            </a>
          </div>
        </div>
        <div className="emergency-highlight-card">
          <h3>Fast response promise</h3>
          <div className="mini-points">
            <div>Doctor dispatch in 12 to 25 minutes based on area</div>
            <div>Medicine coordination and pickup help after home visit</div>
            <div>Family-friendly support for child, adult, and senior care</div>
          </div>
        </div>
      </section>

      <section className="section-block emergency-layout">
        <div className="soft-surface emergency-request-card">
          <div className="section-heading">
            <span className="eyebrow">Home Doctor</span>
            <h2>Choose your area for urgent support</h2>
            <p>
              Select the area closest to you so the nearest available doctor or
              support partner can respond faster.
            </p>
          </div>

          <div className="zone-selector">
            {["Civil Lines", "Model Town", "Hospital Chowk", "Green Avenue", "Market Road"].map((zone) => (
              <button
                key={zone}
                type="button"
                className={selectedZone === zone ? "voice-chip voice-chip-active" : "voice-chip"}
                onClick={() => {
                  setSelectedZone(zone);
                  setRequestSent(false);
                }}
              >
                {zone}
              </button>
            ))}
          </div>

          <div className="request-status-card">
            <strong>Selected zone:</strong> <span>{selectedZone}</span>
            <p>
              {requestSent
                ? `Emergency request captured for ${selectedZone}. Nearest available doctor is being matched now.`
                : "Choose area and use the emergency button to simulate a fast doctor dispatch flow."}
            </p>
          </div>
        </div>

        <div className="stack-list">
          {matchingServices.map((service) => (
            <article className="list-card service-card" key={service.id}>
              <span className="eyebrow">{service.eta}</span>
              <h3>{service.title}</h3>
              <p>{service.support}</p>
              <div className="service-meta">
                <span>Coverage: {service.areas.join(", ")}</span>
                <span>Direct line: {service.phone}</span>
                <span>Charge: {service.price}</span>
              </div>
              <a href={`tel:${service.phone.replace(/[^+\d]/g, "")}`} className="btn primary-btn">
                Call This Team
              </a>
            </article>
          ))}

          {!matchingServices.length ? (
            <div className="search-empty">
              No exact zone match right now. Use Civil Lines or Model Town for demo support flow.
            </div>
          ) : null}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span className="eyebrow">How It Works</span>
          <h2>Emergency flow designed to feel simple under pressure</h2>
        </div>
        <div className="journey-grid">
          {emergencySteps.map((step, index) => (
            <article key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span className="eyebrow">Area Coverage</span>
          <h2>Nearby emergency and medicine coordination zones</h2>
        </div>
        <div className="feature-grid compact-grid">
          {serviceAreas.map((area) => (
            <article className="feature-card" key={area.zone}>
              <h3>{area.zone}</h3>
              <p>{area.coverage}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};

export default EmergencyCare;
