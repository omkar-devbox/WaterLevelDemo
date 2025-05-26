import React, { useState, useEffect } from "react";
import "./History.css";

const ITEMS_PER_PAGE = 5;

const LABELS = {
  en: {
    historyTitle: "History",
    dateTime: "Date & Time",
    waterLevel: "Water Level",
    location: "Location",
    prev: "Prev",
    next: "Next",
  },
  mr: {
    historyTitle: "इतिहास",
    dateTime: "दिनांक व वेळ",
    waterLevel: "पाण्याची पातळी",
    location: "स्थान",
    prev: "मागे",
    next: "पुढे",
  },
};

const HISTORY_DATA = [
  { id: 1, timestamp: "2025-05-25 09:00", level: 40, location: "Main Tank" },
  { id: 2, timestamp: "2025-05-25 08:30", level: 38, location: "Main Tank" },
  { id: 3, timestamp: "2025-05-25 08:00", level: 42, location: "Garden Tank" },
  { id: 4, timestamp: "2025-05-25 07:30", level: 44, location: "Roof Tank" },
  { id: 5, timestamp: "2025-05-25 07:00", level: 41, location: "Main Tank" },
  { id: 6, timestamp: "2025-05-25 06:30", level: 39, location: "Garden Tank" },
  { id: 7, timestamp: "2025-05-25 06:00", level: 43, location: "Roof Tank" },
  { id: 8, timestamp: "2025-05-25 05:30", level: 45, location: "Main Tank" },
  { id: 9, timestamp: "2025-05-25 05:00", level: 46, location: "Garden Tank" },
  { id: 10, timestamp: "2025-05-25 04:30", level: 47, location: "Roof Tank" },
];

const History = () => {
  const [level, setLevel] = useState(30);
  const [bubbles, setBubbles] = useState([]);
  const [language, setLanguage] = useState("mr");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(HISTORY_DATA.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = HISTORY_DATA.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // Bubble animation generator based on level
  useEffect(() => {
    const bubbleCount = Math.min(Math.round(level / 2), 20);
    const generatedBubbles = Array.from({ length: bubbleCount }, () => ({
      id: Math.random(),
      left: `${Math.random() * 90 + 5}%`,
      duration: `${(Math.random() * 3 + 2).toFixed(2)}s`,
      size: `${(Math.random() * 4 + 4).toFixed(2)}px`,
      delay: `${(Math.random() * 3).toFixed(2)}s`,
    }));
    setBubbles(generatedBubbles);
  }, [level]);

  // Language preference from localStorage
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang) setLanguage(savedLang);
  }, []);

  // Persist language preference
  useEffect(() => {
    localStorage.setItem("lang", language);
  }, [language]);

  const translateLocation = (loc) => {
    const translations = {
      "Main Tank": "मुख्य टाकी",
      "Garden Tank": "बागेची टाकी",
      "Roof Tank": "छपरावरील टाकी",
    };
    return translations[loc] || loc;
  };

  return (
    <div className="history-wrapper">
      <div className="history-container">
        {/* Language Selector */}
        <header className="header-top">
          <div className="language-select">
            <label htmlFor="langSelect" title="Select Language">
              🌐
            </label>
            <select
              id="langSelect"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Select Language"
            >
              <option value="mr">मराठी</option>
              <option value="en">English</option>
            </select>
          </div>
        </header>

        {/* History Table */}
        <section className="history-section">
          <h2>{LABELS[language].historyTitle}</h2>
          <table className="history-table">
            <thead>
              <tr>
                <th>{LABELS[language].dateTime}</th>
                <th>{LABELS[language].waterLevel}</th>
                <th>{LABELS[language].location}</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map(({ id, timestamp, level, location }) => (
                <tr key={id}>
                  <td>{timestamp}</td>
                  <td>{level}%</td>
                  <td>
                    {language === "en" ? location : translateLocation(location)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              {LABELS[language].prev}
            </button>
            <span>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              {LABELS[language].next}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default History;
