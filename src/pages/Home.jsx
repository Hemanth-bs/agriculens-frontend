import { useNavigate } from "react-router-dom";
import ChatbotButton from "../components/ChatbotButton";
import Navbar from "../components/Navbar";

export default function Home({ username }) {
  const navigate = useNavigate();

  return (
    <>
      <Navbar username={username} />

      <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg flex flex-col items-center gap-6">
          <h1 className="text-4xl font-bold text-green-700 text-center">
            Welcome to Agriculens
          </h1>
          <p className="text-gray-600 text-center mb-4">
            Hello, <span className="font-semibold">{username}</span>! Ready to analyze your crops?
          </p>

          {/* User info card */}
          <div className="w-full bg-green-50 border border-green-200 rounded-lg p-4 text-center text-green-700 shadow-sm">
            Logged in as <span className="font-medium">{username}</span>
          </div>

          {/* Upload Image Button */}
          <button
            onClick={() => navigate("/upload")}
            className="bg-green-600 text-white px-10 py-4 rounded-xl shadow hover:bg-green-700 transition-all text-lg w-full mt-4"
          >
            Upload Image
          </button>

          <div className="text-gray-500 text-sm mt-2 text-center">
            After uploading an image, you can interact with the chatbot for recommendations.
          </div>
        </div>

        <ChatbotButton />
      </div>
    </>
  );
}
