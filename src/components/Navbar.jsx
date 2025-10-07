import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Navbar({ username, showAuthButtons = true }) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('language', lng);
  };

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div
          className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 cursor-pointer"
          onClick={() => navigate("/home")}
        >
          <img src="/Agriculens_icon.png" alt="Agriculens Logo" className="w-8 h-8 sm:w-10 sm:h-10" />
          <span className="text-sm sm:text-xl font-bold text-green-700 text-center">Agriculens</span>
        </div>

        {showAuthButtons && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/home")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              {t('home')}
            </button>
            <button
              onClick={() => navigate("/")}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              {t('logout')}
            </button>

            {/* Language Switcher */}
            <select
              value={i18n.language}
              onChange={(e) => changeLanguage(e.target.value)}
              className="ml-2 border px-2 py-1 rounded"
            >
              <option value="en">EN</option>
              <option value="hi">हिंदी</option>
              <option value="kn">ಕನ್ನಡ</option>
            </select>
          </div>
        )}
      </div>
    </nav>
  );
}
