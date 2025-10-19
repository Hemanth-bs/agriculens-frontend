import { useNavigate } from "react-router-dom";

export default function ChatbotButton() {
    const navigate = useNavigate();

    return (
        <button
            onClick={() => navigate('/chat')}
            className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
            aria-label="Open chatbot"
        >
            💬
        </button>
    );
}