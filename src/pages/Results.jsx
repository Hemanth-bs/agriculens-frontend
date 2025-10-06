import { useLocation } from "react-router-dom";
import ChatbotButton from "../components/ChatbotButton";
import Navbar from "../components/Navbar";

export default function Results() {
  const location = useLocation();
  const file = location.state?.file;
  const username = location.state?.username || "User";

  return (
    <>
      <Navbar username={username} />

      <div className="min-h-screen bg-green-100 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-green-700 mb-6">Results</h1>

        {file ? (
          <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md flex flex-col items-center gap-4">
            <img
              src={URL.createObjectURL(file)}
              alt="Uploaded"
              className="w-full h-64 object-contain border rounded"
            />
            {/* Placeholder for ML results */}
            <div className="mt-4 p-4 border rounded w-full text-center">
              <p className="text-green-700 font-semibold">Detected disease: Leaf Blight</p>
              <p className="text-gray-700 mt-2">Confidence: 92%</p>
            </div>
          </div>
        ) : (
          <p className="text-red-500">No image uploaded. Go back and upload an image.</p>
        )}

        <ChatbotButton />
      </div>
    </>
  );
}
