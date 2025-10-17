import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import ChatbotButton from "../components/ChatbotButton";

export default function Results({ username, setUser }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const file = location.state?.file;
  const prediction = location.state?.prediction || null;

  return (
    <>
      {/* Navbar: same style as Upload page */}
      <Navbar username={username} setUser={setUser} showHomeButton={true} showLogoutButton={false} />

      <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-green-700 text-center mb-4">
            {t("results")}
          </h1>

          {file ? (
            <div className="flex flex-col items-center gap-6 w-full">
              {/* Image Container */}
              <div className="w-full h-72 bg-gray-100 rounded-xl overflow-hidden shadow-inner border border-gray-200">
                <img
                  src={URL.createObjectURL(file)}
                  alt="Uploaded"
                  className="w-full h-full object-contain rounded-xl transition-transform duration-300 hover:scale-105"
                />
              </div>

              {/* Prediction Card */}
              {prediction ? (
                <div className="mt-4 p-4 border rounded-lg w-full text-center shadow-sm bg-white">
                  <p className="text-green-700 font-semibold text-lg">
                    {t("detected_disease", { disease: prediction.disease })}
                  </p>
                  <p className="text-gray-700 mt-2">
                    {t("confidence", { confidence: prediction.confidence.toFixed(2) + "%" })}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 mt-4 text-center">{t("No Prediction")}</p>
              )}

              {/* Back to Upload Button */}
              <button
                onClick={() => navigate("/upload")}
                className="mt-4 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 w-full transition-all"
              >
                {t("Upload Another")}
              </button>
            </div>
          ) : (
            <p className="text-red-500 text-center">{t("No Image")}</p>
          )}
        </div>

        <ChatbotButton />
      </div>
    </>
  );
}
