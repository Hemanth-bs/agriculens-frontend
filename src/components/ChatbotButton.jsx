import { useState, useRef, useEffect } from "react";

export default function ChatbotButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const GEMINI_API_URL = "https://chatbotserver-925w.onrender.com/chat";

  // Scroll to bottom when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input, time: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true); // show typing while waiting

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await response.json();

      const botMessage = {
        sender: "bot",
        text: data.reply || "Sorry, I didn't get that.",
        time: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error: Could not reach API.", time: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

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
        <div className="fixed bottom-20 right-6 w-80 h-96 bg-white border rounded-lg shadow-lg flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center bg-green-600 text-white p-2 rounded-t-lg">
            <span className="font-semibold">Chatbot</span>
            <button
              onClick={() => setOpen(false)}
              className="font-bold hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-3 overflow-y-auto flex flex-col space-y-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[70%] px-3 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  {formatTime(msg.time)}
                </span>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex items-center space-x-1 bg-gray-200 text-gray-800 px-3 py-2 rounded-lg w-fit rounded-bl-none animate-pulse">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 flex gap-2 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-600"
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="bg-green-600 text-white px-4 rounded-full hover:bg-green-700 transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
