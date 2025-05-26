import React, { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import Dashbord from "./pages/DashBord/dashbord"; // Make sure path & spelling matches
import History from "./pages/History/History";
import "./App.css"
import RecordScreen from "./pages/Record/RecordScreen";
import Graph from "./pages/Graph/Graph";
function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [page, setPage] = useState("dashboard"); // Track active page

  const menuRef = useRef(null);
  const profileRef = useRef(null);

  // Close menu/profile on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle nav link click: set page, close menu & profile
  const handleNavClick = (pageName) => {
    setPage(pageName);
    setMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
            <div className={`bar ${menuOpen ? "open" : ""}`}></div>
          </div>
          <div className="logo">MyApp</div>
        </div>
        <div className={`nav-links ${menuOpen ? "active" : ""}`} ref={menuRef}>
          <a
            href="#dashboard"
            onClick={() => handleNavClick("dashboard")}
            className={page === "dashboard" ? "active-link" : ""}
          >
            Dashboard
          </a>
          <a
            href="#history"
            onClick={() => handleNavClick("history")}
            className={page === "history" ? "active-link" : ""}
          >
            History
          </a>
          <a
            href="#records"
            onClick={() => handleNavClick("records")}
            className={page === "records" ? "active-link" : ""}
          >
            Records
          </a>
          <a
            href="#graph"
            onClick={() => handleNavClick("graph")}
            className={page === "graph" ? "active-link" : ""}
          >
            Graph
          </a>
        </div>
        <div className="user-section" ref={profileRef}>
          <FaUserCircle
            className="user-icon"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setMenuOpen(false);
            }}
          />
          {profileOpen && (
            <div className="profile-menu">
              <a href="#profile" onClick={() => setProfileOpen(false)}>
                Profile
              </a>
              <a href="#logout" onClick={() => setProfileOpen(false)}>
                Logout
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Main content area */}
      <main>
        {page === "dashboard" && <Dashbord />}
        {page === "history" && (
          <History/>
        )}
        {page === "records" && (
          <RecordScreen/>
        )}
        {page === "graph" && (
          <Graph/>
        )}
      </main>

      
    </>
  );
}

export default App;
