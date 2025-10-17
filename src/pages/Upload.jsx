import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";
import ChatbotButton from "../components/ChatbotButton";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage"; // helper function to get cropped blob

export default function Upload({ username, setUser }) {
  const [file, setFile] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedFile, setCroppedFile] = useState(null);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setCroppedFile(null); // reset crop if new image chosen
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSubmit = async () => {
    if (!file || !croppedAreaPixels) return;
    const croppedBlob = await getCroppedImg(URL.createObjectURL(file), croppedAreaPixels);
    const croppedFile = new File([croppedBlob], file.name, { type: file.type });
    setCroppedFile(croppedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!croppedFile && file) {
      alert("Please crop the image first.");
      return;
    }
    navigate("/results", { state: { file: croppedFile, username } });
  };

  return (
    <>
      {/* Navbar: show only Home button */}
      <Navbar username={username} setUser={setUser} showHomeButton={true} showLogoutButton={false} />

      <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg flex flex-col gap-6">
          <h1 className="text-3xl font-bold text-green-700 text-center mb-4">
            {t('upload_crop_image')}
          </h1>
          <p className="text-gray-600 text-center mb-2">{t('choose_file')}</p>
          <p className="text-gray-500 text-sm text-center mb-4">
            ⚠️ Please crop the leaf properly for better prediction.
          </p>

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

          {/* Cropper */}
          {file && !croppedFile && (
            <div className="relative w-full h-64 bg-gray-200 rounded-xl overflow-hidden mt-4">
              <Cropper
                image={URL.createObjectURL(file)}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
          )}

          {/* Crop Button */}
          {file && !croppedFile && (
            <button
              onClick={handleCropSubmit}
              className="mt-4 bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-all w-full"
            >
              Crop Image
            </button>
          )}

          {/* Preview Cropped Image */}
          {croppedFile && (
            <div className="mt-4 flex flex-col items-center">
              <img
                src={URL.createObjectURL(croppedFile)}
                alt="Cropped Preview"
                className="w-full h-64 object-contain rounded-xl shadow-md"
              />
            </div>
          )}

          {/* Predict / Upload Button */}
          {croppedFile && (
            <button
              onClick={handleSubmit}
              className="mt-4 bg-green-700 text-white py-3 rounded-lg hover:bg-green-800 transition-all w-full"
            >
              {t('upload_results')}
            </button>
          )}
        </div>

        {/* Chatbot Button */}
        <ChatbotButton />
      </div>
    </>
  );
}
