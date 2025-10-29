import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import Navbar from "../components/Navbar";
import ChatbotButton from "../components/ChatbotButton";

// Map i18n.language codes to friendly language names for chatbot
const languageMap = {
  en: "English",
  hi: "Hindi",
  kn: "Kannada",
  ta: "Tamil",
  te: "Telugu",
  ml: "Malayalam",
};



// Translate plant & disease from class_name safely
const translateClassName = (className, t) => {
  if (!className) return { plant: "Unknown", disease: "Unknown" };

  const normalized = className.replace(/\++/g, "").replace(/\s+/g, "").toLowerCase();

  let plantKey = null;
  let diseaseKey = null;

  const plants = t("plants", { returnObjects: true });
  const diseases = t("diseases", { returnObjects: true });

  Object.keys(plants).forEach((key) => {
    if (normalized.startsWith(key.toLowerCase())) plantKey = key;
  });

  let diseasePart = plantKey ? normalized.slice(plantKey.length).replace(/^_+/, "") : "";

  Object.keys(diseases).forEach((key) => {
    if (diseasePart.includes(key.toLowerCase())) diseaseKey = key;
  });

  return {
    plant: plantKey ? t(`plants.${plantKey}`) : className,
    disease: diseaseKey ? t(`diseases.${diseaseKey}`) : diseasePart || "Unknown",
  };
};

export default function Results({ username, setUser }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const prediction = location.state?.prediction;
  const weather = location.state?.weather;

  const [suggestions, setSuggestions] = useState("");
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ---------------------------
  // FIXED TTS (manual resume for Android Chrome)
  // ---------------------------
  const [utterances, setUtterances] = useState([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const cleanTextForSpeech = (text) => {
    if (!text) return "";
    return text
      .replace(/(\*|_|~|`|>)/g, "")
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      .replace(/#+\s?/g, "")
      .replace(/^\s+|\s+$/g, "");
  };

  const { plant, disease } = prediction
    ? translateClassName(prediction.class_name || prediction.prediction, t)
    : { plant: "", disease: "" };

  const languageName = languageMap[i18n.language] || "English";

  const splitIntoSentences = (text) => {
    return text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  };

  const speakFromIndex = (startIndex, sentences, lang) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    for (let i = startIndex; i < sentences.length; i++) {
      const utter = new SpeechSynthesisUtterance(sentences[i].trim());
      utter.lang = lang;
      utter.onend = () => setCurrentSentenceIndex(i + 1);
      window.speechSynthesis.speak(utter);
    }
    setIsPlaying(true);
    setIsPaused(false);
  };

  const speakSuggestions = () => {
    if (!suggestions) return;
    const cleanedText = cleanTextForSpeech(suggestions);
    const langMap = {
      en: "en-IN",
      hi: "hi-IN",
      ta: "ta-IN",
      te: "te-IN",
      kn: "kn-IN",
      ml: "ml-IN",
    };
    const lang = langMap[i18n.language] || "en-IN";

    // Case 1 — If currently speaking → Pause
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(true);
      return;
    }

    // Case 2 — If paused → Resume from last sentence
    if (isPaused) {
      speakFromIndex(currentSentenceIndex, utterances, lang);
      return;
    }

    // Case 3 — Start fresh
    const sentences = splitIntoSentences(cleanedText);
    setUtterances(sentences);
    setCurrentSentenceIndex(0);
    speakFromIndex(0, sentences, lang);
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  // ---------------------------
  // Fetch chatbot suggestions
  // ---------------------------
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!prediction) return;
      setLoadingSuggestions(true);

      try {
        const weatherInfo = weather
          ? `Weather at time of prediction: ${weather.description}, Temperature: ${weather.temperature}°C, Humidity: ${weather.humidity}%, Latitude: ${weather.lat}, Longitude: ${weather.lon}`
          : "Weather information not available";

        const res = await fetch("https://chatbotserver-925w.onrender.com/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Respond in ${languageName}:
Give clear, professional, and actionable plant treatment instructions based on this data:
Plant: ${plant}
Disease: ${disease}
Health Index: ${prediction.health_index || "N/A"}
Confidence: ${prediction.confidence || "N/A"}
${weatherInfo}

Provide the following details:
1. Chemical treatment — specify the exact chemical name, concentration (in mg or ml per litre), and duration (in days).
2. Organic or natural treatment — specify materials, preparation method, dosage, and duration (in days).
3. Weather-related suggestions based on the weather data above.

Do NOT include any introductions — start directly with the treatment details.`,
          }),
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setSuggestions(data.reply || t("no_suggestions_available"));
      } catch (error) {
        console.error("Chatbot API error:", error);
        setSuggestions(t("failed_fetch_suggestions"));
      } finally {
        setLoadingSuggestions(false);
      }
    };

    fetchSuggestions();
  }, [prediction, weather, plant, disease, t, languageName]);

  const getDiseaseColor = (diseaseName) => {
    if (!diseaseName) return "text-gray-600";
    return diseaseName.toLowerCase() === t("diseases.healthy").toLowerCase()
      ? "text-green-600"
      : "text-red-600";
  };

  return (
    <>
      <Navbar username={username} setUser={setUser} showHomeButton={true} showLogoutButton={false} />

      <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg flex flex-col gap-6 relative">
          <h1 className="text-3xl font-bold text-green-700 text-center mb-4">{t("results")}</h1>

          {prediction ? (
            <div className="flex flex-col items-center gap-6 w-full">
              {prediction.image_url ? (
                <div className="w-full h-72 bg-gray-50 rounded-xl overflow-hidden shadow-inner border border-gray-200">
                  <img
                    src={prediction.image_url}
                    alt={t("prediction_output")}
                    className="w-full h-full object-contain rounded-xl transition-transform duration-300 hover:scale-105"
                  />
                </div>
              ) : (
                <p className="text-gray-500 mt-4 text-center">{t("no_image_available")}</p>
              )}

              <div className="mt-4 p-4 border rounded-lg w-full text-center shadow-sm bg-white space-y-2">
                <h2 className="text-2xl font-bold flex flex-col items-center">
                  <span className="text-green-700">{plant}</span>
                  <span className={`text-xl ${getDiseaseColor(disease)}`}>{disease}</span>
                </h2>
                <p className="text-gray-700">
                  {t("confidence")}: {prediction.confidence ? `${prediction.confidence.toFixed(2)}%` : "N/A"}
                </p>
                <p className="text-gray-700"> {t("health_index")}: {prediction.health_index || "N/A"} </p>
                <p className="text-gray-500 text-sm">
                  {prediction.created_at ? `${t("predicted_at")}: ${new Date(prediction.created_at).toLocaleString()}` : ""}
                </p>
                {prediction.prediction && (
                  <p className="text-gray-500 text-sm"> {t("prediction_label")}: {prediction.prediction} </p>
                )}
                {weather && (
                  <p className="text-gray-600 text-sm mt-1">
                    {t("weather")}: {weather.description}, {t("temperature")}: {weather.temperature}°C,{" "}
                    {t("humidity")}: {weather.humidity}%
                  </p>
                )}
              </div>

              <button
                onClick={() => setShowSuggestions(!showSuggestions)}
                className="mt-2 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-all w-full"
              >
                {showSuggestions ? t("hide_care_suggestions") : t("show_care_suggestions")}
              </button>

              {showSuggestions && (
                <div className="mt-4 w-full p-4 border rounded-lg bg-gray-50 shadow-inner text-left max-h-96 overflow-y-auto flex flex-col gap-2">
                  {loadingSuggestions ? (
                    <p className="text-gray-600 text-center">{t("loading_suggestions")}</p>
                  ) : (
                    <>
                      <ReactMarkdown>{suggestions}</ReactMarkdown>
                      <button
                        onClick={speakSuggestions}
                        className="mt-2 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition w-full"
                      >
                        {isPlaying ? t("pause_voice") : isPaused ? t("resume_voice") : t("play_voice")}
                      </button>
                    </>
                  )}
                </div>
              )}

              <button
                onClick={() => navigate("/upload")}
                className="mt-4 bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 w-full transition-all"
              >
                {t("upload_another")}
              </button>
            </div>
          ) : (
            <p className="text-red-500 text-center">{t("no_prediction")}</p>
          )}
        </div>

        <ChatbotButton />
      </div>
    </>
  );
}
