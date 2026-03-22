import axios from "axios";
import React, { useEffect, useState } from "react";
import AppointmentForm from "../components/AppointmentForm";

const points = [
  "Login once, then use your saved patient details for easier appointment booking.",
  "Choose the department first so matching doctors appear automatically.",
  "Share your health concern clearly so the doctor can understand your case faster.",
];

const doctorProfiles = {
  "aarav.sharma@zeecareplus.com": {
    image: "/departments/cardio.jpg",
    summary: "Heart rhythm, blood pressure, and preventive cardiac care.",
  },
  "diya.patel@zeecareplus.com": {
    image: "/departments/neuro.jpg",
    summary: "Headache, nerve pain, dizziness, and brain-health review.",
  },
  "rohan.verma@zeecareplus.com": {
    image: "/departments/ortho.jpg",
    summary: "Bone pain, joints, posture, injury recovery, and mobility care.",
  },
  "anaya.mehta@zeecareplus.com": {
    image: "/departments/derma.jpg",
    summary: "Skin allergy, acne, infection, and treatment planning.",
  },
  "kabir.reddy@zeecareplus.com": {
    image: "/departments/pedia.jpg",
    summary: "Child wellness, fever support, vaccinations, and growth checks.",
  },
  "ira.kapoor@zeecareplus.com": {
    image: "/departments/onco.jpg",
    summary: "Cancer care guidance, screening support, and treatment follow-up.",
  },
  "vivaan.nair@zeecareplus.com": {
    image: "/departments/radio.jpg",
    summary: "Imaging support, scan review, and diagnosis coordination.",
  },
  "saanvi.iyer@zeecareplus.com": {
    image: "/departments/ent.jpg",
    summary: "Ear, nose, throat, sinus, and allergy-related consultation.",
  },
  "reyansh.gupta@zeecareplus.com": {
    image: "/departments/therapy.jpg",
    summary: "Pain recovery, exercise therapy, posture, and movement support.",
  },
  "myra.singh@zeecareplus.com": {
    image: "/departments/cardio.jpg",
    summary: "Women-focused heart health, recovery coaching, and monitoring.",
  },
};

const Appointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/user/doctors",
          { withCredentials: true }
        );
        setDoctors(data.doctors || []);
      } catch (error) {
        setDoctors([]);
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorSelect = (doctorId) => {
    setSelectedDoctorId(doctorId);
    const bookingSection = document.getElementById("appointment-booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="page-shell container">
      <section className="page-hero scenic-surface">
        <span className="eyebrow">Appointment</span>
        <h1>Get appointment information with a simpler login-based patient flow.</h1>
        <p>
          This page is now designed to be easier to use. Login helps the system
          prefill patient details and keeps booking connected to your profile.
        </p>
      </section>

      <section className="section-block feature-grid compact-grid">
        {points.map((point) => (
          <article className="feature-card" key={point}>
            <h3>Patient Tip</h3>
            <p>{point}</p>
          </article>
        ))}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <span className="eyebrow">Doctors</span>
          <h2>Tap a doctor to see information and take an appointment</h2>
          <p>
            The doctor section is now inside the appointment page only. Each
            card shows photo, department, mobile number, and booking access.
          </p>
        </div>

        <div className="doctor-grid">
          {doctors.map((doctor) => {
            const profile = doctorProfiles[doctor.email] || {
              image: "/hero.png",
              summary: "General specialist support for patient booking and care.",
            };

            return (
              <article className="doctor-card soft-surface" key={doctor._id}>
                <img
                  src={doctor.docAvatar?.url || profile.image}
                  alt={`${doctor.firstName} ${doctor.lastName}`}
                  className="doctor-card-image"
                />
                <div className="doctor-card-body">
                  <span className="eyebrow">{doctor.doctorDepartment}</span>
                  <h3>
                    Dr. {doctor.firstName} {doctor.lastName}
                  </h3>
                  <p>{profile.summary}</p>
                  <div className="doctor-meta">
                    <span>Email: {doctor.email}</span>
                    <span>Mobile: {doctor.phone}</span>
                    <span>Gender: {doctor.gender}</span>
                  </div>
                  <button
                    type="button"
                    className="btn primary-btn"
                    onClick={() => handleDoctorSelect(doctor._id)}
                  >
                    Take Appointment
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div id="appointment-booking">
        <AppointmentForm preselectedDoctorId={selectedDoctorId} />
      </div>
    </main>
  );
};

export default Appointment;
