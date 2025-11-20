import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import ChatbotButton from "../components/ChatbotButton";

export default function History({ username, setUser }) {
  const { t, i18n } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openGroups, setOpenGroups] = useState({});
  const [, setLang] = useState(i18n.language); 
  const navigate = useNavigate();

  // Force re-render when language changes
  useEffect(() => {
    const handleChange = () => setLang(i18n.language);
    i18n.on("languageChanged", handleChange);
    return () => i18n.off("languageChanged", handleChange);
  }, [i18n]);

  // Fetch history from API
  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.token) {
        setLoading(false);
        return;
      }
      const token = user.token;

      const res = await fetch(
        "https://mithun23112005-agriculens.hf.space/history",
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) {
          if (res.status === 401) {
              console.error("Authentication failed. Redirecting.");
              localStorage.removeItem("user");
              navigate("/login");
            }
          throw new Error("Failed to fetch history: ${res.statusText}");
      }
      
      const data = await res.json();
      setHistory(data.history || []);
    } catch (err) {
      console.error("Error fetching history:", err);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  }, [navigate]); // Added navigate to dependency array

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // #############################################################
  // # CORE LOGIC REPLACEMENT: Strict Session Grouping & Curing  #
  // #############################################################

  const groupedHistory = history
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .reduce((acc, item) => {
      const plantKey = item.plant;
      // Clean and normalize the disease name for the session key
      const disease = item.latest_disease?.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const isHealthy = disease === "healthy" || item.cured;

      // Initialize structures: plantData holds sessions and the counter
      if (!acc[plantKey]) acc[plantKey] = {
        sessions: {}, 
        nextSessionId: 1 // Counter for the next disease outbreak
      };

      const plantData = acc[plantKey];
      const plantSessions = plantData.sessions;
      
      // --- Update/Initialize Session ---

      if (!isHealthy) {
        // --- LOGIC FOR DISEASED IMAGE / HANDLING RECURRENCE ---
        
        const baseKey = `${plantKey}__${disease}`;
        
        // 1. Try to find an existing ongoing session for this disease
        let currentSessionKey = Object.keys(plantSessions).find(key => 
            key.startsWith(baseKey) && !plantSessions[key].cured
        );

        // 2. If no ongoing session exists (i.e., the disease is reappearing or is new), create a unique key
        if (!currentSessionKey) {
            currentSessionKey = `${baseKey}__${plantData.nextSessionId}`;
            plantData.nextSessionId += 1; // Increment the counter for the next outbreak
        }
        
        const sessionKey = currentSessionKey;

        if (!plantSessions[sessionKey]) {
          // Initialize new session
          plantSessions[sessionKey] = {
            diseaseName: item.latest_disease, 
            status: "Ongoing",
            cured: item.cured || false,
            latestIndex: item.latest_health_index,
            cureDate: null,
            items: [],
          };
        }

        const session = plantSessions[sessionKey];

        // 3. Only update the session if it's NOT already marked as CURED.
        if (!session.cured) {
          session.items.push(item);
          session.latestIndex = item.latest_health_index;
        }

      } else {
        // --- LOGIC FOR HEALTHY IMAGE (The Curing Mechanism) ---
        
        // 1. Identify the MOST RECOVERED (HIGHEST INDEX) UN-CURED session
        let bestSessionKeyToCure = null;
        let highestDiseaseIndex = -1; 

        for (const [key, session] of Object.entries(plantSessions)) {
          // Check only active disease sessions
          if (session.diseaseName !== "healthy" && !session.cured) {
              const currentSessionIndex = session.latestIndex;
              
              // Find the session that is "most healthy" (highest index)
              if (currentSessionIndex > highestDiseaseIndex) {
                  highestDiseaseIndex = currentSessionIndex;
                  bestSessionKeyToCure = key;
              }
          }
        }
        
        // 2. Compare new healthy index against the best active index
        if (bestSessionKeyToCure) {
          const sessionToCure = plantSessions[bestSessionKeyToCure];
          
          // CURE CONDITION: The healthy image's index is higher than the most recovered session's index
          if (item.latest_health_index > sessionToCure.latestIndex) { 
              // Mark the most recovered session as CURED and lock it
              sessionToCure.status = "Cured";
              sessionToCure.cured = true;
              sessionToCure.cureDate = new Date(item.created_at);

              // Add the Curing image as the final event for this session
              sessionToCure.items.push(item);
          }
        }
      }

      return acc;
    }, {});
    
    // Final transformation: Convert nested objects into renderable arrays for the JSX map
    const renderableHistory = {};
    for (const plantKey in groupedHistory) {
      // Filter out only the session objects that have prediction items 
      renderableHistory[plantKey] = Object.values(groupedHistory[plantKey].sessions)
                                          .filter(session => session.items.length > 0);
    }
  
  // #############################################################
  // # END CORE LOGIC REPLACEMENT                              #
  // #############################################################

  return (
    <>
      <Navbar
        username={username}
        setUser={setUser}
        showHomeButton={true}
        showLogoutButton={false}
        showHistoryButton={false}
      />

<div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-50 p-6 relative">
        <h1 className="text-3xl font-bold text-green-700 text-center mb-4">
          {t("history_title")}
        </h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => navigate("/upload")}
            className="bg-green-600 text-white px-6 py-3 rounded shadow hover:bg-green-700 transition"
          >
            {t("upload_new_image")}
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">{t("loading_history")}</p>
        ) : history.length === 0 ? (
          <p className="text-center text-gray-500">{t("no_predictions_yet")}</p>
        ) : (
          // Use renderableHistory for iteration
          Object.entries(renderableHistory).map(([plantKey, sessions]) => (
            <div key={plantKey} className="mb-4">
              <button
                onClick={() => toggleGroup(plantKey)}
                className="w-full bg-white border border-green-400 text-green-700 px-4 py-2 rounded shadow hover:bg-green-50 transition flex justify-between items-center"
              >
                <span className="font-semibold text-lg">{plantKey}</span>
                <span>{openGroups[plantKey] ? "▲" : "▼"}</span>
              </button>

              {openGroups[plantKey] &&
                [...sessions].reverse().map((sessionData, idx) => ( // Use sessionData object
                  <details
                    key={sessionData.items[0].history_id || idx} // Use the first item's ID for key
                    className="mt-2 border rounded-lg bg-white shadow-sm"
                  >
                    <summary className="p-2 cursor-pointer font-medium bg-gray-100 rounded">
                      {/* Display the name of the disease for the session */}
                      {sessionData.diseaseName} (
                      {sessionData.cured ? t("cured_label") : t("ongoing_label")}
                      )
                    </summary>
                    <div className="p-2 flex flex-col gap-2">
                      {sessionData.items.map((item) => ( // Iterate over sessionData.items
                        <div
                          key={item.history_id}
                          className="bg-gray-50 p-2 rounded shadow-sm"
                        >
                          <p>{t("disease_label")}: {item.latest_disease}</p>
                          <p>{t("health_index_label")}: {item.latest_health_index}%</p>
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