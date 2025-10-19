import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import ChatbotButton from "../components/ChatbotButton";

export default function Home({ username, setUser }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [weatherOpen, setWeatherOpen] = useState(false);
  const [coords, setCoords] = useState({ lat: null, lon: null });
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) =>
        setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude })
      );
    }
  }, []);

  useEffect(() => {
    if (weatherOpen && coords.lat && coords.lon) {
      const fetchWeather = async () => {
        setLoading(true);
        try {
          const res = await fetch(
            `https://mithun23112005-agriculens.hf.space/weather?lat=${coords.lat}&lon=${coords.lon}`
          );
          const data = await res.json();
          setWeatherData(data.weather);
        } catch (e) {
          setWeatherData({ error: t("weather_fetch_error") });
        } finally {
          setLoading(false);
        }
      };
      fetchWeather();
    }
  }, [weatherOpen, coords, t]);

  return (
    <>
      <Navbar
        username={username}
        setUser={setUser}
        showHomeButton={false}
        showHistoryButton={false}
        showLogoutButton={true}
      />

      <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg flex flex-col items-center gap-6">
          <h1 className="text-4xl font-bold text-green-700 text-center">
            {t("welcome")}
          </h1>
          <p className="text-gray-600 text-center mb-4">
            {t("hello_user", { username })}
          </p>

          <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4 text-center text-green-700 shadow-sm">
            {t("logged_in_as", { username })}
          </div>

          {/* Upload Button */}
          <button
            onClick={() => navigate("/upload")}
            className="bg-green-600 text-white px-10 py-4 rounded-xl shadow hover:bg-green-700 transition-all text-lg w-full mt-4"
          >
            {t("upload_image")}
          </button>

          {/* History Button */}
          <button
            onClick={() => navigate("/history")}
            className="bg-yellow-500 text-white px-10 py-4 rounded-xl shadow hover:bg-yellow-600 transition-all text-lg w-full"
          >
            {t("view_history")}
          </button>
        </div>

        {/* Weather Button */}
        <button
          onClick={() => setWeatherOpen(!weatherOpen)}
          className="fixed bottom-6 left-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          🌤️
        </button>

        {/* Weather Window */}
        {weatherOpen && (
          <div className="fixed bottom-16 left-6 w-80 bg-white border rounded-lg shadow-lg flex flex-col">
            <div className="flex justify-between items-center bg-blue-600 text-white p-2 rounded-t-lg">
              <span className="font-semibold">{t("weather")}</span>
              <button
                onClick={() => setWeatherOpen(false)}
                className="font-bold hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="p-3 text-blue-800 flex flex-col gap-2">
              {loading && <p>{t("loading")}</p>}
              {!loading && weatherData && !weatherData.error && (
                <>
                  <p className="text-sm font-semibold capitalize">
                    {weatherData.description}
                  </p>
                  <p className="text-sm">🌡 {weatherData.temperature}°C</p>
                  <p className="text-sm">💧 {weatherData.humidity}% {t("humidity")}</p>
                </>
              )}
              {!loading && weatherData?.error && (
                <p className="text-sm">{weatherData.error}</p>
              )}
            </div>
          </div>
        )}

        <ChatbotButton />
      </div>
    </>
  );
}
