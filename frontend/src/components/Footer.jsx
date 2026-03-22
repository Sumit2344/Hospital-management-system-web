import React from "react";
import { Link } from "react-router-dom";
import { FaLocationArrow, FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const hours = [
    { id: 1, day: "Monday", time: "08:00 AM - 08:00 PM" },
    { id: 2, day: "Tuesday", time: "08:00 AM - 08:00 PM" },
    { id: 3, day: "Wednesday", time: "08:00 AM - 08:00 PM" },
    { id: 4, day: "Thursday", time: "08:00 AM - 08:00 PM" },
    { id: 5, day: "Friday", time: "08:00 AM - 06:00 PM" },
    { id: 6, day: "Saturday", time: "09:00 AM - 03:00 PM" },
  ];

  return (
    <>
      <footer className={"container site-footer"}>
        <div className="footer-top">
          <div>
            <img src="/logo.png" alt="logo" className="logo-img" />
            <p>
              ZeeCare+ is designed to help patients check information quickly,
              book appointments easily, and understand the next treatment step
              with confidence.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <ul>
              <Link to={"/"}>Home</Link>
              <Link to={"/appointment"}>Appointment</Link>
              <Link to={"/about"}>About Us</Link>
              <Link to={"/profile"}>Our Profile</Link>
            </ul>
          </div>
          <div>
            <h4>Care Hours</h4>
            <ul>
              {hours.map((element) => (
                <li key={element.id}>
                  <span>{element.day}</span>
                  <span>{element.time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Contact Desk</h4>
            <div>
              <FaPhone />
              <span>+91 99999 99999</span>
            </div>
            <div>
              <MdEmail />
              <span>care@zeecareplus.com</span>
            </div>
            <div>
              <FaLocationArrow />
              <span>Main Wellness Campus, New Delhi</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>Built to make hospital booking, profile access, and treatment guidance easier for patients.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
