import React from "react";
import { Link } from "react-router-dom";

const highlights = [
  {
    title: "Smart Appointment Desk",
    text: "Book faster with a cleaner form, better department choice, and doctor matching that feels simple.",
  },
  {
    title: "Doctor And Disease Guidance",
    text: "Understand which specialist to meet, what information to carry, and what treatment steps may come next.",
  },
  {
    title: "Profile That Feels Useful",
    text: "Keep your basic patient information ready so future visits are easier to manage.",
  },
];

const services = [
  "Cardiology support for chest pain, blood pressure, and heart follow-up",
  "Neurology review for headaches, dizziness, and nerve-related issues",
  "Dermatology help for skin allergy, acne, rashes, and treatment plans",
  "Orthopedics for bone pain, back pain, injury recovery, and joint care",
];

const Home = () => {
  return (
    <main>
      <section className="hero-shell container">
        <div className="hero-copy">
          <span className="eyebrow">Better Patient Experience</span>
          <h1>Book appointments, check your care details, and explore treatment support in one simple system.</h1>
          <p>
            This updated ZeeCare+ frontend is designed to be cleaner, easier to
            use, and more helpful for everyday patients. You can move quickly
            between booking, learning, and reviewing your profile.
          </p>
          <div className="hero-actions">
            <Link to="/appointment" className="btn primary-btn">
              Get Appointment
            </Link>
            <Link to="/profile" className="btn ghost-btn">
              Open Profile
            </Link>
          </div>
          <div className="hero-stats">
            <div>
              <strong>09+</strong>
              <span>Specialist departments</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Support information access</span>
            </div>
            <div>
              <strong>Easy</strong>
              <span>Patient-first booking flow</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="sun-glow" />
          <div className="landscape-card">
            <img src="/hero.png" alt="doctor support" className="hero-image" />
            <div className="floating-note">
              <h4>Patient Focus</h4>
              <p>Login, appointment, profile, and treatment guidance in one smoother journey.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="container section-block">
        <div className="section-heading">
          <span className="eyebrow">What Changed</span>
          <h2>A simpler inside system for your users</h2>
          <p>The app now focuses on the pages and information patients actually need most.</p>
        </div>
        <div className="feature-grid">
          {highlights.map((item) => (
            <article className="feature-card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="container section-block split-layout">
        <div className="info-panel scenic-panel">
          <span className="eyebrow">Care Areas</span>
          <h2>Find the right doctor for the right problem</h2>
          <p>
            Patients usually need two things fast: which department to choose,
            and what kind of treatment discussion to expect. This design keeps
            those answers visible.
          </p>
        </div>
        <div className="stack-list">
          {services.map((service) => (
            <div className="list-card" key={service}>
              {service}
            </div>
          ))}
        </div>
      </section>

      <section className="container section-block journey-panel">
        <div className="section-heading">
          <span className="eyebrow">How It Works</span>
          <h2>Easy flow for every patient</h2>
        </div>
        <div className="journey-grid">
          <article>
            <span>01</span>
            <h3>Login Or Register</h3>
            <p>Use your email or mobile number with a simple password-based patient account.</p>
          </article>
          <article>
            <span>02</span>
            <h3>Choose Appointment Details</h3>
            <p>Pick department, review doctor options, add your concern, and submit in one place.</p>
          </article>
          <article>
            <span>03</span>
            <h3>Open Our Profile</h3>
            <p>See your information, doctor guidance, and treatment preparation tips from one screen.</p>
          </article>
        </div>
      </section>
    </main>
  );
};

export default Home;
