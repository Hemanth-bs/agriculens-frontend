import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar";
import ChatbotButton from "../components/ChatbotButton";

export default function Results({ username, setUser }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const prediction = location.state?.prediction;

  const [suggestions, setSuggestions] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!prediction) return;

      setLoadingSuggestions(true);
      try {
        const res = await fetch("https://chatbotserver-925w.onrender.com/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Give clear, professional, and actionable plant treatment instructions based on this data:
Plant: ${prediction.plant || "Unknown"}
Disease: ${prediction.disease || "Unknown"}
Health Index: ${prediction.health_index || "N/A"}
Confidence: ${prediction.confidence || "N/A"}

Provide the following details:
1. Chemical treatment — specify the exact chemical name, concentration (in mg or ml per litre), and duration (in days).
2. Organic or natural treatment — specify materials, preparation method, dosage, and duration (in days).

Do NOT include any introductory phrases or summaries — start directly with the treatment details.`,
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setSuggestions(data.reply || "No suggestions available.");
      } catch (error) {
        console.error("Chatbot API error:", error);
        setSuggestions("Failed to fetch suggestions.");
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [prediction]);

  return (
    <>
      <Navbar
        username={username}
        setUser={setUser}
        showHomeButton={true}
        showLogoutButton={false}
      />

      <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-green-700 text-center mb-4">
            {t("results")}
          </h1>

          {prediction ? (
            <div className="flex flex-col items-center gap-6 w-full">
              {/* Backend image */}
              {prediction.image_url ? (
                <div className="w-full h-72 bg-gray-50 rounded-xl overflow-hidden shadow-inner border border-gray-200">
                  <img
                    src={prediction.image_url}
                    alt="Prediction Output"
                    className="w-full h-full object-contain rounded-xl transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ) : (
                <p className="text-gray-500 mt-4 text-center">No image available</p>
              )}

              {/* Prediction Details */}
<div className="mt-4 p-4 border rounded-lg w-full text-center shadow-sm bg-white space-y-2">
  <h2 className="text-2xl font-bold text-green-700 flex flex-col items-center">
    <span>{prediction.plant}</span>
    <span className="text-xl text-red-600">{prediction.disease}</span>
  </h2>
  <p className="text-gray-700">
    Confidence: {prediction.confidence.toFixed(2)}%
  </p>
  <p className="text-gray-700">
    Health Index: {prediction.health_index}
  </p>
  <p className="text-gray-500 text-sm">
    Predicted At: {new Date(prediction.created_at).toLocaleString()}
  </p>
  <p className="text-gray-500 text-sm">
    Prediction: {prediction.prediction}
  </p>
</div>

              {/* Suggestions Button */}
              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="mt-2 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-all w-full"
              >
                {showSuggestions ? "Hide Care Suggestions" : "Show Care Suggestions"}
              </button>

              {/* Suggestions Markdown */}
              {showSuggestions && (
                <div className="mt-4 w-full p-4 border rounded-lg bg-gray-50 shadow-inner text-left max-h-96 overflow-y-auto">
                  {loadingSuggestions ? (
                    <p className="text-gray-600 text-center">Loading suggestions...</p>
                  ) : (
                    <ReactMarkdown>{suggestions}</ReactMarkdown>
                  )}
                </div>
              )}

              {/* Upload Another Button */}
              <button
                onClick={() => navigate("/upload")}
                className="mt-4 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 w-full transition-all"
              >
                {t("Upload Another")}
              </button>
            </div>
          ) : (
            <p className="text-red-500 text-center">{t("No Prediction")}</p>
          )}
        </div>

        {/* Chatbot Button */}
        <ChatbotButton />
      </div>
    </>
  );
}
