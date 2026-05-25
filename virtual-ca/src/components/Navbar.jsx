import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="nav">
      <div className="nav-inner">

        {/* LOGO */}
        <h2 onClick={() => navigate("/")}>
          💰 Money Manager
        </h2>

        {/* LINKS */}
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/reports">Reports</Link>
          <Link to="/profile">Profile</Link>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;