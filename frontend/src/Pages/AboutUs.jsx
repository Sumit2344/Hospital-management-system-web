import React from "react";

const values = [
  {
    title: "Clear Information",
    text: "Patients should not struggle to find doctor, disease, and treatment guidance inside the system.",
  },
  {
    title: "Easy Actions",
    text: "Every important task should be possible in a few simple steps without confusion.",
  },
  {
    title: "Warm Experience",
    text: "A hospital app should feel calm, trustworthy, and visually welcoming instead of dull or heavy.",
  },
];

const AboutUs = () => {
  return (
    <main className="page-shell container">
      <section className="page-hero soft-surface">
        <span className="eyebrow">About Us</span>
        <h1>We redesigned the patient experience to make hospital management easier to understand and easier to use.</h1>
        <p>
          ZeeCare+ is focused on practical patient needs: booking appointments,
          checking profile details, understanding which doctor to meet, and
          preparing for treatment conversations with more confidence.
        </p>
      </section>

      <section className="section-block">
        <div className="feature-grid">
          {values.map((value) => (
            <article className="feature-card" key={value.title}>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block split-layout">
        <div className="info-panel">
          <span className="eyebrow">Our Vision</span>
          <h2>One app area for appointment, one for information, one for profile</h2>
          <p>
            Instead of hiding the important flow under too many sections, this
            version puts the main patient journey front and center. That makes
            it easier for users to work quickly and confidently.
          </p>
        </div>
        <div className="stack-list">
          <div className="list-card">
            <strong>Appointment</strong>
            <p>Better booking with doctor selection and logged-in patient details.</p>
          </div>
          <div className="list-card">
            <strong>About Us</strong>
            <p>A clearer explanation of how the hospital system supports users.</p>
          </div>
          <div className="list-card">
            <strong>Our Profile</strong>
            <p>Patient profile details, photo preview, doctor check guidance, and treatment readiness tips.</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutUs;
