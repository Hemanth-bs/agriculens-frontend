import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import ChatbotButton from "../components/ChatbotButton";

export default function Upload({ username }) {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    navigate("/results", { state: { file, username } });
  };

  return (
    <>
      <Navbar username={username} />

      <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-green-700 text-center mb-4">
            {t('upload_crop_image')}
          </h1>
          <p className="text-gray-600 text-center mb-6">{t('choose_file')}</p>

          {/* Upload Buttons */}
          <div className="flex flex-col gap-4">
            <label className="bg-blue-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-600 text-center">
              {t('select_file')}
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            <label className="bg-green-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-green-600 text-center">
              {t('take_picture')}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Preview */}
          {file && (
            <div className="mt-4 flex flex-col items-center">
              <img
                src={URL.createObjectURL(file)}
                alt="Preview"
                className="w-full h-64 object-contain rounded-xl shadow-md"
              />
            </div>
          )}

          {/* Upload Button */}
          {file && (
            <button
              onClick={handleSubmit}
              className="mt-4 bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition-all w-full"
            >
              {t('upload_results')}
            </button>
          )}
        </div>

        <ChatbotButton />
      </div>
    </>
  );
}
