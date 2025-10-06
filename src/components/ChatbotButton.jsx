import { useState } from "react";

export default function ChatbotButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Chatbot Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition"
      >
        💬
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white border rounded-lg shadow-lg overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-green-600 text-white p-2">
            <span>Chatbot</span>
            <button
              onClick={() => setOpen(false)}
              className="font-bold hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Chat iframe */}
          <iframe
            src="http://localhost:5000/chatbot"
            className="flex-1 w-full h-full"
            title="Chatbot"
          />
        </div>
      )}
    </>
  );
}
