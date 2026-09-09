import { useEffect, useState } from "react";

function ActivityPanel({ activity }) {
  const [elapsed, setElapsed] = useState(activity.elapsed);

  useEffect(() => {
    if (activity.status !== "working") {
      setElapsed(activity.elapsed);
      return;
    }
    const update = () => setElapsed((Date.now() - activity.startedAt) / 1000);
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [activity]);

  return (
    <aside className="activity">
      <p className="label">CURRENT ACTIVITY</p>
      <h2>{activity.title}</h2>
      <p className={`activity-status ${activity.status}`}>{activity.status === "working" ? "In progress" : activity.status === "error" ? "Needs attention" : activity.status === "success" ? "Complete" : "Ready"}</p>
      <ol>
        {activity.steps.map((step) => <li key={step}>{step}</li>)}
      </ol>
      <p className="activity-time">Time: {elapsed.toFixed(1)} seconds</p>
    </aside>
  );
}

export default ActivityPanel;
