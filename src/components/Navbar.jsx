import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Navbar({
  username,
  setUser,
  showHomeButton = true,
  showHistoryButton = true,
  showLogoutButton = true,
}) {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/"); // redirect to login
  };

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Agriculens Logo and Name */}
        <div
          className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 cursor-pointer ml-1" // moved slightly to the right
          onClick={() => navigate("/home")}
        >
          <img
            src="/Agriculens_icon.png"
            alt="Agriculens Logo"
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <span className="text-sm sm:text-xl font-bold text-green-700 text-center">
            Agriculens
          </span>
        </div>

        {/* Buttons and Language Selector */}
        <div className="flex items-center gap-3">
          {showHomeButton && (
            <button
              onClick={() => navigate("/home")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              {t("home")}
            </button>
          )}

          {showHistoryButton && (
            <button
              onClick={() => navigate("/history")}
              className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
            >
              {t("History")}
            </button>
          )}

          {showLogoutButton && (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              {t("logout")}
            </button>
          )}

          {/* Language Switcher */}
          <select
            value={i18n.language}
            onChange={(e) => changeLanguage(e.target.value)}
            className="border px-1 py-0.5 rounded text-sm w-16"
          >
            <option value="en">EN</option>
            <option value="hi">हिंदी</option>
            <option value="kn">ಕನ್ನಡ</option>
            <option value="ta">தமிழ்</option>
            <option value="te">తెలుగు</option>
            <option value="ml">മലയാളം</option>
          </select>
        </div>
      </div>
    </nav>
  );
}
