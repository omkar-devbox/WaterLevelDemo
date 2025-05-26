import "./RecordScreen.css";

const records = {
  last: [
    { date: "18. Nov 10:48", value: 88 }, // fillDirection missing, defaults to "ltr"
  ],
  highest: [
    { date: "10:48", value: 35 }, // explicit rtl
    { date: "17. Nov 19:01", value: 37 }, // missing, defaults to ltr
    { date: "05. Nov 16:03", value: 40 }, // missing, defaults to ltr
  ],
  lowest: [
    { date: "10:48", value: 50 }, // missing, defaults to ltr
    { date: "15. Nov 21:37", value: 34 }, // missing, defaults to ltr
    { date: "28. Oct 16:15", value: 30 }, // missing, defaults to ltr
  ],
};

const FIXED_MAX = 100;
const FIXED_UNIT = "%";

const Gauge = ({ value, max, date, unit, fillDirection = "ltr" }) => {
  const fillProportion = Math.max(0, Math.min(1, value / max));
  const percent = fillProportion * 100;

  let cssTransformAngle;
  if (fillDirection === "rtl") {
    cssTransformAngle = (1 - fillProportion) * 180;
  } else {
    cssTransformAngle = (fillProportion - 1) * 180;
  }

  let color = "#28a745"; // green
  if (percent <= 25) color = "#dc3545"; // red
  else if (percent <= 60) color = "#fd7e14"; // orange

  return (
    <div className="gauge-container">
      <div className="gauge-date">{date}</div>
      <div className="gauge">
        <div
          className="gauge-fill"
          style={{
            transform: `rotate(${cssTransformAngle}deg)`,
            backgroundColor: color,
          }}
        />
        <div className="gauge-cover" />
      </div>
      <div className="gauge-value">
        <strong>{value}</strong> {unit}
      </div>
    </div>
  );
};


const RecordScreen = () => {
  return (
    <div className="record-screen">
      <h2>Last measurement - Water level meter</h2>
      <div className="gauge-row">
        {records.last.map((item, i) => (
          <Gauge
            key={`last-${i}`}
            value={item.value}
            max={FIXED_MAX}
            unit={FIXED_UNIT}
            date={item.date}
            fillDirection={item.fillDirection || "ltr"}
          />
        ))}
      </div>

      <h2>The highest level today / 7 days / 30 days</h2>
      <div className="gauge-row">
        {records.highest.map((item, i) => (
          <Gauge
            key={`highest-${i}`}
            value={item.value}
            max={FIXED_MAX}
            unit={FIXED_UNIT}
            date={item.date}
            fillDirection={item.fillDirection || "ltr"}
          />
        ))}
      </div>

      <h2>The lowest level today / 7 days / 30 days</h2>
      <div className="gauge-row">
        {records.lowest.map((item, i) => (
          <Gauge
            key={`lowest-${i}`}
            value={item.value}
            max={FIXED_MAX}
            unit={FIXED_UNIT}
            date={item.date}
            fillDirection={item.fillDirection || "ltr"}
          />
        ))}
      </div>
    </div>
  );
};

export default RecordScreen;
