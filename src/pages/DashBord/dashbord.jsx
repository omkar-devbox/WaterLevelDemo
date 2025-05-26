import React, { useState, useEffect } from "react";
import "./Dashboard.css";

const Dashboard = () => {
  const [level, setLevel] = useState(50);
  const [bubbles, setBubbles] = useState([]);
  const [location, setLocation] = useState("Main Tank");
  const [language, setLanguage] = useState("mr");

  useEffect(() => {
    const bubbleCount = Math.min(Math.round(level / 2), 20);
    const newBubbles = Array.from({ length: bubbleCount }, () => ({
      id: Math.random(),
      left: `${Math.random() * 90 + 5}%`,
      duration: `${(Math.random() * 3 + 2).toFixed(2)}s`,
      size: `${(Math.random() * 4 + 4).toFixed(2)}px`,
      delay: `${(Math.random() * 3).toFixed(2)}s`,
    }));
    setBubbles(newBubbles);
  }, [level]);

  const lastHourAvg = 62;
  const todayAvg = 58;
  const minLevelToday = 45;
  const maxLevelToday = 72;
  const lastUpdated = new Date().toLocaleTimeString();

  const instructions = {
    en: "Use the slider below to adjust the water level. Monitor stats and switch tank locations.",
    mr: "पाण्याची पातळी समायोजित करण्यासाठी खालील स्लायडर वापरा. टाकीची माहिती पहा आणि लोकेशन बदला.",
  };

  return (
    <div className="dashboard-wrapper">
      <div className="dashboard-container">
        <header className="dashboard-header">
          <div className="header-top">
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
                <option value="en">English</option>
                <option value="mr">मराठी</option>
              </select>
            </div>
          </div>

          <h1>
            {language === "en"
              ? "Water Tank Level Monitor"
              : "पाण्याच्या टाकीची पातळी निरीक्षण"}
          </h1>
          <p>
            {language === "en"
              ? "Track and control the water level in real time."
              : "पाण्याची पातळी वास्तविक वेळेत पहा आणि नियंत्रित करा."}
          </p>

          <div className="location-dropdown">
            <label htmlFor="locationSelect">
              {language === "en" ? "Location:" : "स्थान:"}
            </label>
            <select
              id="locationSelect"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              aria-label={
                language === "en"
                  ? "Select Tank Location"
                  : "टाकीचे स्थान निवडा"
              }
            >
              <option value="Main Tank">
                {language === "en" ? "Main Tank" : "मुख्य टाकी"}
              </option>
              <option value="Garden Tank">
                {language === "en" ? "Garden Tank" : "बागेची टाकी"}
              </option>
              <option value="Roof Tank">
                {language === "en" ? "Roof Tank" : "छपरावरील टाकी"}
              </option>
            </select>
          </div>
        </header>

        <main className="tank-section">
          <div className="tank">
            <div className="water" style={{ height: `${level}%` }}>
              {bubbles.map((bubble) => (
                <div
                  key={bubble.id}
                  className="bubble"
                  style={{
                    left: bubble.left,
                    animationDuration: bubble.duration,
                    width: bubble.size,
                    height: bubble.size,
                    animationDelay: bubble.delay,
                  }}
                />
              ))}
            </div>
            <div className="level-display">{level}%</div>
          </div>

          <div className="cards-container">
            <div className="card">
              <h3>{language === "en" ? "Current Level" : "सध्याची पातळी"}</h3>
              <p>{level}%</p>
            </div>
            <div className="card">
              <h3>
                {language === "en" ? "Last Hour Avg" : "शेवटच्या तासाचा सरासरी"}
              </h3>
              <p>{lastHourAvg}%</p>
            </div>
            <div className="card">
              <h3>{language === "en" ? "Today Avg" : "आजची सरासरी"}</h3>
              <p>{todayAvg}%</p>
            </div>
            <div className="card">
              <h3>{language === "en" ? "Min Today" : "आजची किमान"}</h3>
              <p>{minLevelToday}%</p>
            </div>
            <div className="card">
              <h3>{language === "en" ? "Max Today" : "आजची कमाल"}</h3>
              <p>{maxLevelToday}%</p>
            </div>
            <div className="card">
              <h3>{language === "en" ? "Last Updated" : "शेवटचे अपडेट"}</h3>
              <p style={{ fontSize: "0.9rem" }}>{lastUpdated}</p>
            </div>
          </div>
        </main>

        {/* <section className="controls">
          <label htmlFor="levelSlider">
            {language === "en" ? "Set Water Level:" : "पाण्याची पातळी निवडा:"}
          </label>
          <input
            type="range"
            id="levelSlider"
            min="0"
            max="100"
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
          />
          <p className="instruction">{instructions[language]}</p>
        </section> */}
      </div>
    </div>
  );
};

export default Dashboard;
