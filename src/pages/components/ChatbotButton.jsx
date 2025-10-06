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

      {/* Chatbot Window */}
      {open && (
        <div className="fixed bottom-20 right-6 w-96 h-96 bg-white border rounded-lg shadow-lg overflow-hidden">
          <div className="flex justify-between items-center bg-green-600 text-white px-4 py-2">
            <h2 className="font-semibold">Chatbot</h2>
            <button onClick={() => setOpen(false)} className="font-bold">✖</button>
          </div>
          <iframe
            src="http://127.0.0.1:5000"   // your Flask chatbot URL
            className="w-full h-full"
            title="Chatbot"
          />
        </div>
      )}
    </>
  );
}
