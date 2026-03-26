import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import { API_URL } from "../api";

const departmentsArray = [
  "Pediatrics",
  "Orthopedics",
  "Cardiology",
  "Neurology",
  "Oncology",
  "Radiology",
  "Physical Therapy",
  "Dermatology",
  "ENT",
];

const AppointmentForm = ({ preselectedDoctorId = "" }) => {
  const { isAuthenticated, user } = useContext(Context);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [department, setDepartment] = useState("Pediatrics");
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [doctorFirstName, setDoctorFirstName] = useState("");
  const [doctorLastName, setDoctorLastName] = useState("");
  const [address, setAddress] = useState("");
  const [healthConcern, setHealthConcern] = useState("");
  const [hasVisited, setHasVisited] = useState(false);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/v1/user/doctors`,
          { withCredentials: true }
        );
        setDoctors(data.doctors || []);
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Unable to load doctors right now."
        );
      }
    };

    fetchDoctors();
  }, []);

  useEffect(() => {
    if (!user || !isAuthenticated) return;
    const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
    setFullName(name);
    setEmail(user.email || "");
    setPhone(user.phone || "");
    setGender(user.gender || "");
    if (user.dob) {
      setDob(String(user.dob).substring(0, 10));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!preselectedDoctorId || !doctors.length) return;
    const selectedDoctor = doctors.find(
      (doctor) => doctor._id === preselectedDoctorId
    );
    if (!selectedDoctor) return;

    setSelectedDoctorId(selectedDoctor._id);
    setDoctorFirstName(selectedDoctor.firstName);
    setDoctorLastName(selectedDoctor.lastName);
    setDepartment(selectedDoctor.doctorDepartment);
  }, [preselectedDoctorId, doctors]);

  const handleAppointment = async (e) => {
    e.preventDefault();

    const trimmedName = fullName.trim();
    const nameParts = trimmedName.split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "Patient";

    if (!trimmedName || !email || !phone || !gender || !appointmentDate) {
      toast.error("Please fill the required appointment details.");
      return;
    }

    if (!doctorFirstName || !doctorLastName) {
      toast.error("Please select a doctor.");
      return;
    }

    try {
      setIsSubmitting(true);
      const { data } = await axios.post(
        `${API_URL}/api/v1/appointment/post`,
        {
          firstName,
          lastName,
          email,
          phone,
          dob,
          gender,
          appointment_date: appointmentDate,
          department,
          doctor_firstName: doctorFirstName,
          doctor_lastName: doctorLastName,
          hasVisited,
          address:
            address.trim() ||
            (healthConcern.trim()
              ? `Health concern: ${healthConcern.trim()}`
              : ""),
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(data.message);
      setAppointmentDate("");
      setDepartment("Pediatrics");
      setSelectedDoctorId("");
      setDoctorFirstName("");
      setDoctorLastName("");
      setAddress("");
      setHealthConcern("");
      setHasVisited(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Appointment request failed. Please check your details."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <section className="appointment-locked soft-surface">
        <h2>Login first to get appointment information</h2>
        <p>
          Appointment booking is now connected to the patient login system so
          your details stay attached to your profile.
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
    );
  }

  return (
    <section className="appointment-layout section-block">
      <article className="soft-surface booking-note">
        <span className="eyebrow">Booking Support</span>
        <h2>Use your logged-in information to submit faster</h2>
        <p>
          Your profile fills key details automatically. Add your concern,
          choose a department, and select the doctor you want to meet.
        </p>
        <div className="mini-points">
          <div>Profile-linked appointment flow</div>
          <div>Doctor list filtered by department</div>
          <div>Health concern notes included in booking</div>
        </div>
      </article>

      <article className="form-component appointment-form soft-surface">
        <h2>Appointment Details</h2>
        <form onSubmit={handleAppointment}>
          <div>
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <input
              type="tel"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div>
            <input
              type="date"
              placeholder="Date of Birth"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            <input
              type="date"
              placeholder="Appointment Date"
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
            />
          </div>

          <div>
            <select
              value={department}
              onChange={(e) => {
                setDepartment(e.target.value);
                setSelectedDoctorId("");
                setDoctorFirstName("");
                setDoctorLastName("");
              }}
            >
              {departmentsArray.map((depart) => (
                <option value={depart} key={depart}>
                  {depart}
                </option>
              ))}
            </select>

            <select
              value={selectedDoctorId}
              onChange={(e) => {
                const doctorId = e.target.value;
                setSelectedDoctorId(doctorId);
                if (!doctorId) {
                  setDoctorFirstName("");
                  setDoctorLastName("");
                  return;
                }
                const selectedDoctor = doctors.find(
                  (doctor) => doctor._id === doctorId
                );
                if (!selectedDoctor) {
                  setDoctorFirstName("");
                  setDoctorLastName("");
                  return;
                }
                setDoctorFirstName(selectedDoctor.firstName);
                setDoctorLastName(selectedDoctor.lastName);
                setDepartment(selectedDoctor.doctorDepartment);
              }}
            >
              <option value="">Select Doctor</option>
              {doctors.map((doctor) => (
                <option
                  key={doctor._id}
                  value={doctor._id}
                >
                  {doctor.firstName} {doctor.lastName} - {doctor.doctorDepartment}
                </option>
              ))}
            </select>
          </div>

          <textarea
            rows="5"
            value={healthConcern}
            onChange={(e) => setHealthConcern(e.target.value)}
            placeholder="Write your disease, pain, symptoms, or treatment concern"
          />

          <textarea
            rows="4"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Address"
          />

          <div className="checkbox-row">
            <p>Have you visited before?</p>
            <input
              type="checkbox"
              checked={hasVisited}
              onChange={(e) => setHasVisited(e.target.checked)}
            />
          </div>

          <button
            type="submit"
            className="btn primary-btn form-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Get Appointment"}
          </button>
        </form>
      </article>
    </section>
  );
};

export default AppointmentForm;
