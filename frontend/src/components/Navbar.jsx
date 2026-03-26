import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";
import { API_URL } from "../api";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const handleLogout = async () => {
    await axios
      .get(`${API_URL}/api/v1/user/patient/logout`, {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
        setShow(false);
      })
      .catch((err) => {
        toast.error(
          err.response?.data?.message || "Logout failed. Please try again."
        );
      });
  };

  const navigateTo = useNavigate();

  const goToLogin = () => {
    setShow(false);
    navigateTo("/login");
  };

  return (
    <>
      <nav className={"container site-nav"}>
        <div className="logo brand-mark">
          <img src="/logo.png" alt="logo" className="logo-img" />
          <div>
            <span className="brand-title">ZeeCare+</span>
            <p>Simple care, clearer information, faster booking.</p>
          </div>
        </div>
        <div className={show ? "navLinks showmenu" : "navLinks"}>
          <div className="links">
            <Link to={"/"} onClick={() => setShow(false)}>
              Home
            </Link>
            <Link to={"/appointment"} onClick={() => setShow(false)}>
              Appointment
            </Link>
            <Link to={"/about"} onClick={() => setShow(false)}>
              About Us
            </Link>
            <Link to={"/profile"} onClick={() => setShow(false)}>
              Our Profile
            </Link>
            <Link to={"/store"} onClick={() => setShow(false)}>
              Medicine Store
            </Link>
          </div>
          <div className="nav-actions">
            <Link to={"/appointment"} className="btn ghost-btn" onClick={() => setShow(false)}>
              Book Visit
            </Link>
            {isAuthenticated ? (
              <button className="logoutBtn btn" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <button className="loginBtn btn" onClick={goToLogin}>
                Login
              </button>
            )}
          </div>
        </div>
        <div className="hamburger" onClick={() => setShow(!show)}>
          <GiHamburgerMenu />
        </div>
      </nav>
    </>
  );
};

export default Navbar;
