import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import ChatbotButton from "../components/ChatbotButton";

export default function History({ username, setUser }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openGroups, setOpenGroups] = useState({});
  const navigate = useNavigate();

  // Group history by "plant + disease" and create sessions
  const groupedHistory = history.reduce((acc, item) => {
    const key = `${item.plant} - ${item.latest_disease}`;
    if (!acc[key]) acc[key] = [];

    const lastSession = acc[key][acc[key].length - 1];
    if (!lastSession || lastSession[lastSession.length - 1].cured) {
      acc[key].push([item]);
    } else {
      lastSession.push(item);
    }

    return acc;
  }, {});

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
          Object.entries(groupedHistory).map(([key, sessions]) => (
            <div key={key} className="mb-4">
              {/* Crop + Disease Header */}
              <button
                onClick={() => toggleGroup(key)}
                className="w-full bg-white border border-green-400 text-green-700 px-4 py-2 rounded shadow hover:bg-green-50 transition flex justify-between items-center"
              >
                <span className="font-semibold text-lg">{key}</span>
                <span>{openGroups[key] ? "▲" : "▼"}</span>
              </button>

              {/* Collapsible sessions */}
              {openGroups[key] &&
                sessions.map((session, idx) => (
                  <details
                    key={idx}
                    className="mt-2 border rounded-lg bg-white shadow-sm"
                  >
                    <summary className="p-2 cursor-pointer font-medium bg-gray-100 rounded">
                      Session {idx + 1} (
                      {session[session.length - 1].cured
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

        {/* Chatbot Button */}
        <ChatbotButton />
      </div>
    </>
  );
}
