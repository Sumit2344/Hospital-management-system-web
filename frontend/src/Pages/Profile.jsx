import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Context } from "../main";

const treatmentTips = [
  "Write your main symptoms, how long they have been happening, and what makes them worse.",
  "Carry previous prescriptions, reports, and medicine names before meeting the doctor.",
  "Use the appointment page to choose the correct department so treatment starts faster.",
];

const doctorChecks = [
  "Heart pain or blood pressure issues: Cardiology",
  "Headache, weakness, or nerve symptoms: Neurology",
  "Bone pain, swelling, or fracture history: Orthopedics",
  "Skin infection, acne, or itching: Dermatology",
];

const Profile = () => {
  const { isAuthenticated, user } = useContext(Context);
  const [preview, setPreview] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const storedAvatar = window.localStorage.getItem("zeecare-profile-avatar");
    if (storedAvatar) {
      setPreview(storedAvatar);
    }
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setPreview(result);
        window.localStorage.setItem("zeecare-profile-avatar", result);
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isAuthenticated) {
    return (
      <main className="page-shell container">
        <section className="page-hero soft-surface">
          <span className="eyebrow">Our Profile</span>
          <h1>Login to open your patient profile and appointment information.</h1>
          <p>
            Your profile page shows your stored patient details, a photo
            preview, and simple doctor and treatment guidance.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn primary-btn">
              Login
            </Link>
            <Link to="/register" className="btn ghost-btn">
              Register
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

  return (
    <main className="page-shell container">
      <section className="profile-grid">
        <article className="profile-card soft-surface">
          <span className="eyebrow">Our Profile</span>
          <button
            type="button"
            className={showDetails ? "avatar-shell profile-reveal-btn profile-reveal-btn-active" : "avatar-shell profile-reveal-btn"}
            onClick={() => setShowDetails((prev) => !prev)}
          >
            {preview ? (
              <img src={preview} alt="profile preview" className="profile-avatar" />
            ) : (
              <div className="profile-avatar avatar-fallback">
                {user.firstName?.[0] || "P"}
              </div>
            )}
          </button>
          <h2>{fullName || "Patient Profile"}</h2>
          <p>{user.email}</p>
          <p>Tap the round photo to {showDetails ? "hide" : "show"} your full information.</p>
          <label className="upload-btn">
            Change Profile Photo
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </label>
        </article>

        <article className="profile-card scenic-surface">
          <span className="eyebrow">Patient Details</span>
          {showDetails ? (
            <div className="details-grid">
              <div>
                <strong>Name</strong>
                <span>{fullName || "Not available"}</span>
              </div>
              <div>
                <strong>Email</strong>
                <span>{user.email || "Not available"}</span>
              </div>
              <div>
                <strong>Mobile</strong>
                <span>{user.phone || "Not available"}</span>
              </div>
              <div>
                <strong>Gender</strong>
                <span>{user.gender || "Not available"}</span>
              </div>
              <div>
                <strong>Role</strong>
                <span>{user.role || "Patient"}</span>
              </div>
            </div>
          ) : (
            <div className="profile-collapsed-note">
              Tap your profile image to reveal all personal information, just like an interactive card view.
            </div>
          )}
        </article>
      </section>

      <section className="section-block split-layout">
        <div className="info-panel">
          <span className="eyebrow">Doctor Check</span>
          <h2>Check which doctor matches your disease or health concern</h2>
          <p>
            This guidance does not replace a doctor diagnosis, but it helps
            users choose the correct department before booking.
          </p>
        </div>
        <div className="stack-list">
          {doctorChecks.map((item) => (
            <div className="list-card" key={item}>
              {item}
            </div>
          ))}
        </div>
      </section>

      <section className="section-block split-layout reverse-layout">
        <div className="stack-list">
          {treatmentTips.map((item) => (
            <div className="list-card" key={item}>
              {item}
            </div>
          ))}
        </div>
        <div className="info-panel soft-surface">
          <span className="eyebrow">Treatment Guide</span>
          <h2>Prepare for better treatment conversations</h2>
          <p>
            Good treatment starts with clear information. Use your profile and
            appointment screens together so your doctor can understand your case
            faster.
          </p>
          <div className="hero-actions">
            <Link to="/appointment" className="btn primary-btn">
              Book Now
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Profile;
