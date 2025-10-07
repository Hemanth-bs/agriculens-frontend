import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import ChatbotButton from "../components/ChatbotButton";

export default function Home({ username }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <Navbar username={username} />

      <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg flex flex-col items-center gap-6">
          <h1 className="text-4xl font-bold text-green-700 text-center">
            {t('welcome')}
          </h1>
          <p className="text-gray-600 text-center mb-4">
            {t('hello_user', { username })}
          </p>

          <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4 text-center text-green-700 shadow-sm">
            {t('logged_in_as', { username })}
          </div>

          <button
            onClick={() => navigate("/upload")}
            className="bg-green-600 text-white px-10 py-4 rounded-xl shadow hover:bg-green-700 transition-all text-lg w-full mt-4"
          >
            {t('upload_image')}
          </button>

          <div className="text-gray-500 text-sm mt-2 text-center">
            {t('choose_file')}
          </div>
        </div>

        <ChatbotButton />
      </div>
    </>
  );
}
