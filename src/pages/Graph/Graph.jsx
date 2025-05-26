import React, { useState, useEffect, useRef } from "react";

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
  // Add a location with a single data point for testing
  { id: 11, timestamp: "2025-05-25 10:00", level: 35, location: "Shed Tank" },
  // Add a location with all points at the same level
  { id: 12, timestamp: "2025-05-25 10:00", level: 33, location: "Office Tank" },
  { id: 13, timestamp: "2025-05-25 10:30", level: 33, location: "Office Tank" },
];

const Graph = () => {
  const [selectedLocation, setSelectedLocation] = useState("Main Tank");
  const [width, setWidth] = useState(320);
  const graphRef = useRef(null);

  useEffect(() => {
    const updateSize = () => {
      if (graphRef.current) {
        setWidth(graphRef.current.offsetWidth);
      }
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const HEIGHT = 240;
  const PADDING = 40;
  const TICK_LABEL_FONT_SIZE = "10px";
  const AXIS_COLOR = "#555";
  const TEXT_COLOR = "#333";

  const locations = [...new Set(HISTORY_DATA.map((d) => d.location))];

  const filteredData = HISTORY_DATA
    .filter((d) => d.location === selectedLocation)
    .map((d) => ({
      ...d,
      date: new Date(d.timestamp.replace(" ", "T")),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  const hasData = filteredData.length > 0;

  // --- Dynamic Scaling Logic for Proper Fit ---
  let minLevel, maxLevel, levelRange;
  let minTime, maxTime, timeRange;

  // Y-Axis Scale
  const Y_AXIS_PADDING_PERCENTAGE = 0.1; // e.g., 10% above max and below min
  const MIN_Y_AXIS_SPAN = 10; // Minimum span for Y-axis (e.g., if all data is at one level, or data span is tiny)

  if (hasData) {
    const dataLevels = filteredData.map((d) => d.level);
    const dataMinL = Math.min(...dataLevels);
    const dataMaxL = Math.max(...dataLevels);

    if (dataMinL === dataMaxL) { // All points at the same level
      minLevel = dataMinL - MIN_Y_AXIS_SPAN / 2;
      maxLevel = dataMaxL + MIN_Y_AXIS_SPAN / 2;
    } else {
      const dataSpan = dataMaxL - dataMinL;
      const paddingAmount = Math.max(dataSpan * Y_AXIS_PADDING_PERCENTAGE, MIN_Y_AXIS_SPAN / 2 - dataSpan / 2); // Ensure minimum padding effect if span is too small
      minLevel = dataMinL - paddingAmount;
      maxLevel = dataMaxL + paddingAmount;
    }
    // Ensure levels don't go below a practical minimum (e.g., 0 for water level)
    minLevel = Math.max(0, minLevel);
    if (maxLevel < minLevel + MIN_Y_AXIS_SPAN) { // If clamping minLevel brought it too close to maxLevel
        maxLevel = minLevel + MIN_Y_AXIS_SPAN;
    }

  } else { // No data
    minLevel = 0; // Default min level
    maxLevel = 50; // Default max level
  }
  levelRange = maxLevel - minLevel;
  if (levelRange <= 0) { // Should not happen with above logic, but as a failsafe
      levelRange = MIN_Y_AXIS_SPAN;
      maxLevel = minLevel + levelRange;
  }


  // X-Axis Scale
  const X_AXIS_PADDING_PERCENTAGE = 0.05; // e.g., 5% on each side
  const MIN_X_AXIS_SPAN_MS = 60 * 60 * 1000; // 1 hour minimum span

  if (hasData) {
    const dataTimes = filteredData.map((d) => d.date.getTime());
    const dataMinT = Math.min(...dataTimes);
    const dataMaxT = Math.max(...dataTimes);

    if (dataMinT === dataMaxT) { // Single point in time
      minTime = dataMinT - MIN_X_AXIS_SPAN_MS / 2;
      maxTime = dataMaxT + MIN_X_AXIS_SPAN_MS / 2;
    } else {
      const dataSpan = dataMaxT - dataMinT;
      const paddingAmount = Math.max(dataSpan * X_AXIS_PADDING_PERCENTAGE, MIN_X_AXIS_SPAN_MS / 2 - dataSpan / 2);
      minTime = dataMinT - paddingAmount;
      maxTime = dataMaxT + paddingAmount;
       if (maxTime - minTime < MIN_X_AXIS_SPAN_MS) { // Ensure minimum span
        const deficit = MIN_X_AXIS_SPAN_MS - (maxTime - minTime);
        minTime -= deficit / 2;
        maxTime += deficit / 2;
      }
    }
  } else { // No data
    const now = new Date().getTime();
    minTime = now - MIN_X_AXIS_SPAN_MS;
    maxTime = now;
  }
  timeRange = maxTime - minTime;
   if (timeRange <= 0) { // Should not happen, failsafe
      timeRange = MIN_X_AXIS_SPAN_MS;
      maxTime = minTime + timeRange;
  }
  // --- End Dynamic Scaling Logic ---

  const getX = (time) => {
    const plotWidth = width - 2 * PADDING;
    if (timeRange === 0) return PADDING + plotWidth / 2; // Fallback for unforeseen zero range
    return PADDING + ((time - minTime) / timeRange) * plotWidth;
  };

  const getY = (level) => {
    const plotHeight = HEIGHT - 2 * PADDING;
    if (levelRange === 0) return HEIGHT - PADDING - plotHeight / 2; // Fallback
    return HEIGHT - PADDING - ((level - minLevel) / levelRange) * plotHeight;
  };

  const points = hasData && filteredData.length > 1
    ? filteredData.map((d) => `${getX(d.date.getTime())},${getY(d.level)}`).join(" ")
    : "";

  // Y-Axis Ticks
  const numYTicks = 5;
  const yTicks = [];
  if (levelRange > 0) {
    const yTickInterval = levelRange / (numYTicks - 1);
    for (let i = 0; i < numYTicks; i++) {
      const tickValue = minLevel + i * yTickInterval;
      yTicks.push({ value: tickValue, yPos: getY(tickValue) });
    }
  }
  
  // X-Axis Ticks
  const numDesiredXTicks = width < 300 ? 2 : (width < 450 ? 3 : (width < 600 ? 4 : 5));
  const xTicks = [];
  if (timeRange > 0) {
    for (let i = 0; i < numDesiredXTicks; i++) {
      const proportion = (numDesiredXTicks === 1) ? 0.5 : i / (numDesiredXTicks - 1);
      const tickValueTime = minTime + proportion * timeRange;
      xTicks.push({
        value: new Date(tickValueTime),
        xPos: getX(tickValueTime),
      });
    }
  }

  const formatTimeLabel = (date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };
  
  return (
    <div
      ref={graphRef}
      style={{
        padding: "1rem",
        fontFamily: "sans-serif",
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem", color: TEXT_COLOR }}>
        Water Level - {selectedLocation}
      </h2>

      <label style={{ display: "block", marginBottom: "1rem" }}>
        <span style={{ marginRight: "8px", color: TEXT_COLOR }}>Select Location:</span>
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          style={{
            padding: "6px",
            fontSize: "1rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </label>

      {width > 0 && (
        <svg
            width={width}
            height={HEIGHT}
            style={{
            border: "1px solid #ccc",
            backgroundColor: "#fafafa",
            display: "block",
            }}
        >
            {/* Y-Axis Ticks and Labels */}
            {yTicks.map((tick, idx) => (
            <g key={`y-tick-${idx}`}>
                <line
                x1={PADDING - 5}
                y1={tick.yPos}
                x2={PADDING}
                y2={tick.yPos}
                stroke={AXIS_COLOR}
                strokeWidth="0.5"
                />
                <text
                x={PADDING - 8}
                y={tick.yPos}
                dominantBaseline="middle"
                textAnchor="end"
                fontSize={TICK_LABEL_FONT_SIZE}
                fill={TEXT_COLOR}
                >
                {tick.value.toFixed(1)} {/* Show one decimal for finer grades */}
                </text>
            </g>
            ))}

            {/* X-Axis Ticks and Labels */}
            {xTicks.map((tick, idx) => (
            <g key={`x-tick-${idx}`}>
                <line
                x1={tick.xPos}
                y1={HEIGHT - PADDING}
                x2={tick.xPos}
                y2={HEIGHT - PADDING + 5}
                stroke={AXIS_COLOR}
                strokeWidth="0.5"
                />
                <text
                x={tick.xPos}
                y={HEIGHT - PADDING + 8}
                dominantBaseline="hanging"
                textAnchor="middle"
                fontSize={TICK_LABEL_FONT_SIZE}
                fill={TEXT_COLOR}
                transform={`rotate(-30, ${tick.xPos}, ${HEIGHT - PADDING + 8})`} // Rotate for better fit if many ticks
                style={{textAnchor: "end"}} // Adjust anchor due to rotation
                >
                {formatTimeLabel(tick.value)}
                </text>
            </g>
            ))}

            <line // X-axis
            x1={PADDING}
            y1={HEIGHT - PADDING}
            x2={width - PADDING}
            y2={HEIGHT - PADDING}
            stroke={AXIS_COLOR}
            />
            <line // Y-axis
            x1={PADDING}
            y1={PADDING}
            x2={PADDING}
            y2={HEIGHT - PADDING}
            stroke={AXIS_COLOR}
            />

            {hasData && filteredData.length > 1 && (
            <polyline
                fill="none"
                stroke="#0074d9"
                strokeWidth="2"
                points={points}
            />
            )}

            {hasData && filteredData.map((d) => (
            <circle
                key={d.id}
                cx={getX(d.date.getTime())}
                cy={getY(d.level)}
                r="4"
                fill="orange"
                stroke="#fff"
                strokeWidth="1"
            >
                <title>{`${d.timestamp.replace("T", " ")} - Level: ${d.level}`}</title>
            </circle>
            ))}
            
            {!hasData && (
                <text 
                    x={width / 2} 
                    y={HEIGHT / 2} 
                    textAnchor="middle" 
                    dominantBaseline="middle"
                    fill={TEXT_COLOR}
                    fontSize="1rem"
                >
                    No data for {selectedLocation}
                </text>
            )}
        </svg>
      )}
    </div>
  );
};

export default Graph;