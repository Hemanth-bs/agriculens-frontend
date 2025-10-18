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
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation();

  const [coords, setCoords] = useState({ lat: 12.97, lon: 77.59 });

  // Get user’s location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
        (err) => console.warn("Location permission denied or error:", err)
      );
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setCroppedFile(null);
      getLocation();
    }
  };

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleCropSubmit = async () => {
    if (!file || !croppedAreaPixels) return;

    const croppedBlob = await getCroppedImg(URL.createObjectURL(file), croppedAreaPixels);
    const newCroppedFile = new File([croppedBlob], file.name, { type: file.type });
    setCroppedFile(newCroppedFile);
  };

  // Resize/compress for mobile
  const resizeImage = async (file, maxSize = 1024) =>
    new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob((blob) => resolve(blob), file.type, 0.8);
      };
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!croppedFile && file) {
      alert("Please crop the image first.");
      return;
    }

    setLoading(true);
    try {
      const uploadFile = croppedFile || file;
      if (!uploadFile) throw new Error("No file selected.");

      const resizedBlob = await resizeImage(uploadFile);
      const finalFile = new File([resizedBlob], uploadFile.name, { type: uploadFile.type });

      const userData =
        username && localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user"))
          : null;
      const token = userData?.token;

      if (!token) {
        alert("Access token missing. Please login again.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", finalFile);
      formData.append("lat", coords.lat);
      formData.append("lon", coords.lon);

      const res = await fetch("https://mithun23112005-agriculens.hf.space/predict", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("API error response:", text);
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();
      navigate("/results", {
  state: { 
    file: finalFile,
    username,
    prediction: data.prediction,
    weather: data.weather // <-- include this
  }
});
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Make sure your file is valid and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar
        username={username}
        setUser={setUser}
        showHomeButton={true}
        showLogoutButton={false}
      />

      <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg flex flex-col gap-6 relative">
          {loading && (
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-2xl z-10">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600 mb-4"></div>
                <p className="text-green-700 font-medium">Processing...</p>
              </div>
            </div>
          )}

          <h1 className="text-3xl font-bold text-green-700 text-center mb-4">
            {t("upload_crop_image")}
          </h1>

          <div className="flex flex-col gap-4">
            <label className="bg-blue-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-blue-600 text-center">
              {t("select_file")}
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            <label className="bg-green-500 text-white px-6 py-3 rounded-lg cursor-pointer hover:bg-green-600 text-center">
              {t("take_picture")}
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
            <div className="text-gray-500 text-sm mt-2 text-center">
            {t("choose_file")}
          </div>
          </div>

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

          {file && !croppedFile && (
            <button
              onClick={handleCropSubmit}
              className="mt-4 bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition-all w-full"
            >
              Crop Image
            </button>
          )}

          {croppedFile && (
            <div className="mt-4 flex flex-col items-center">
              <img
                src={URL.createObjectURL(croppedFile)}
                alt="Cropped Preview"
                className="w-full h-64 object-contain rounded-xl shadow-md"
              />
            </div>
          )}

          {croppedFile && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`mt-4 text-white py-3 rounded-lg w-full transition-all ${
                loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-700 hover:bg-green-800"
              }`}
            >
              {loading ? "Processing..." : t("upload_results")}
            </button>
          )}
        </div>
        

        <ChatbotButton />
      </div>
    </>
  );
}
