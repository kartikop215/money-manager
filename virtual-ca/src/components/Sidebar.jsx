import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaUser,
  FaFileAlt,
  FaBars,
} from "react-icons/fa";

function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menu = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "Dashboard", path: "/dashboard", icon: <FaChartBar /> },
    { name: "Reports", path: "/reports", icon: <FaFileAlt /> },
    { name: "Profile", path: "/profile", icon: <FaUser /> },
  ];

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>

      {/* TOGGLE */}
      <div className="toggle" onClick={() => setCollapsed(!collapsed)}>
        <FaBars />
      </div>

      <h2 className="logo">{collapsed ? "💰" : "Money Manager"}</h2>

      <div className="menu">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? "active" : ""}
          >
            <span className="icon">{item.icon}</span>
            {!collapsed && item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;