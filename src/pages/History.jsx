import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ChatbotButton from "../components/ChatbotButton";

export default function History({ username, setUser }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openGroups, setOpenGroups] = useState({});
  const navigate = useNavigate();

  // 🧩 Group sessions by plant and time
  const groupedHistory = history
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .reduce((acc, item) => {
      const plantKey = item.plant;
      const disease = item.latest_disease?.toLowerCase();
      const isHealthy = disease === "healthy" || item.cured;

      if (!acc[plantKey]) acc[plantKey] = [];

      const sessions = acc[plantKey];
      const lastSession = sessions[sessions.length - 1];
      const lastItem = lastSession ? lastSession[lastSession.length - 1] : null;

      // 🦠 Diseased leaf logic
      if (!isHealthy) {
        if (
          !lastSession ||
          lastSession.some((i) => i.cured || i.latest_disease.toLowerCase() === "healthy") ||
          (lastItem && lastItem.latest_disease.toLowerCase() !== disease)
        ) {
          sessions.push([item]);
        } else {
          lastSession.push(item);
        }
      } else {
        // ✅ Healthy/Cured leaf logic
        if (!lastSession) {
          sessions.push([item]);
        } else {
          const hasOngoingDisease = lastSession.some(
            (i) => i.latest_disease.toLowerCase() !== "healthy" && !i.cured
          );

          if (hasOngoingDisease) {
            lastSession.push(item);
          } else {
            sessions.push([item]);
          }
        }
      }

      return acc;
    }, {});

  // 🧠 Fetch history from API
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user.token) return;

        const res = await fetch(
          "https://mithun23112005-agriculens.hf.space/history",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch history");
        const data = await res.json();
        setHistory(data.history || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // 🧭 UI Rendering
  return (
    <>
      <Navbar
        username={username}
        setUser={setUser}
        showHomeButton={true}
        showLogoutButton={false}
        showHistoryButton={false}
      />

      <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 p-6 relative">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-4">
          Prediction History
        </h1>

        {/* Upload Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={() => navigate("/upload")}
            className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700 transition"
          >
            Upload New Image
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-500">
            No predictions yet. Upload one to get started!
          </p>
        ) : (
          Object.entries(groupedHistory).map(([plantKey, sessions]) => (
            <div key={plantKey} className="mb-4">
              <button
                onClick={() => toggleGroup(plantKey)}
                className="w-full bg-white border border-green-400 text-green-700 px-4 py-2 rounded shadow hover:bg-green-50 transition flex justify-between items-center"
              >
                <span className="font-semibold text-lg">{plantKey}</span>
                <span>{openGroups[plantKey] ? "▲" : "▼"}</span>
              </button>

              {openGroups[plantKey] &&
                [...sessions] // create a shallow copy
                  .reverse() // reverse to show most recent first
                  .map((session, idx) => (
                    <details
                      key={idx}
                      className="mt-2 border rounded-lg bg-white shadow-sm"
                    >
                      <summary className="p-2 cursor-pointer font-medium bg-gray-100 rounded">
                        Session {sessions.length - idx} (
                        {session[session.length - 1].cured ||
                        session[session.length - 1].latest_disease.toLowerCase() ===
                          "healthy"
                          ? "✅ Cured"
                          : "🦠 Ongoing"}
                        )
                      </summary>
                      <div className="p-2 flex flex-col gap-2">
                        {session.map((item) => (
                          <div
                            key={item.history_id}
                            className="bg-gray-50 p-2 rounded shadow-sm"
                          >
                            <p>Disease: {item.latest_disease}</p>
                            <p>Health Index: {item.latest_health_index}%</p>
                            <p className="text-sm text-gray-500">
                              {new Date(item.created_at).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </details>
                  ))}
            </div>
          ))
        )}

        <ChatbotButton />
      </div>
    </>
  );
}
