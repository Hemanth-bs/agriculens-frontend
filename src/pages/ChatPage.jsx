import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";

const API_BASE_URL = "https://mithun23112005-agriculens.hf.space";
const GEMINI_API_URL = "https://mithun23112005-agriculens.hf.space/chat/generate";

export default function ChatPage({ username, setUser }) {
  const { t, i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [chatList, setChatList] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [deleteModalChat, setDeleteModalChat] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // 🔊 TTS states
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTTSMessage, setCurrentTTSMessage] = useState(null);
  const utteranceRef = useRef(null);

  const chatEndRef = useRef(null);

  // -----------------------------
  // Utility Functions
  // -----------------------------
  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user?.token;
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const formatTime = (date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // -----------------------------
  // Fetch Chat List
  // -----------------------------
  const fetchChatList = useCallback(async () => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/chat`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setChatList(data.chats || []);
      }
    } catch (error) {
      console.error("Failed to fetch chat list:", error);
      showNotification(t("chat_list_failed"));
    }
  }, [t]);

  useEffect(() => {
    fetchChatList();
  }, [fetchChatList]);

  // -----------------------------
  // Fetch Messages
  // -----------------------------
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChatId) {
        setMessages([]);
        return;
      }
      const token = getToken();
      if (!token) return;

      try {
        const res = await fetch(`${API_BASE_URL}/chat/${activeChatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          const formattedMessages = (data.messages || []).map((msg) => ({
            sender: msg.role === "model" ? "bot" : msg.role,
            text: msg.content,
            time: new Date(msg.createdAt || Date.now()),
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error(error);
        showNotification(t("messages_load_failed"));
      } finally {
        setIsTyping(false);
      }
    };

    // Stop any TTS when switching chats
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTTSMessage(null);

    fetchMessages();
  }, [activeChatId, t]);

  // -----------------------------
  // Send Message
  // -----------------------------
  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;
    const token = getToken();
    if (!token) return;

    let currentChatId = activeChatId;

    if (!currentChatId) {
      try {
        const res = await fetch(`${API_BASE_URL}/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title: input.substring(0, 30) }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error("Failed to create new chat session.");
        currentChatId = data.chat_id;
        setActiveChatId(currentChatId);
        setChatList((prev) => [data, ...prev]);
      } catch (error) {
        console.error(error);
        showNotification(t("chat_create_failed"));
        return;
      }
    }

    const userMessage = { sender: "user", text: input, time: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          message: input,
          language: i18n.language || "en",
          chat_id: currentChatId,
        }),
      });

      const data = await response.json();
      const botMessage = {
        sender: "bot",
        text: data.reply || t("bot_unavailable"),
        time: new Date(),
      };
      const finalMessages = [...updatedMessages, botMessage];
      setMessages(finalMessages);

      await fetch(`${API_BASE_URL}/chat/${currentChatId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          messages: finalMessages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "model",
            content: msg.text,
            createdAt: msg.time.toISOString(),
          })),
        }),
      });
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: t("bot_error"), time: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // -----------------------------
  // TTS: Play / Pause / Resume
  // -----------------------------
  const speakMessage = (text) => {
    if (!window.speechSynthesis) return;

    if (currentTTSMessage === text && isPlaying) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
      return;
    }

    if (currentTTSMessage === text && isPaused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;
    setCurrentTTSMessage(text);

    const langMap = {
      hi: "hi-IN",
      ta: "ta-IN",
      te: "te-IN",
      kn: "kn-IN",
      ml: "ml-IN",
      en: "en-IN",
    };
    utterance.lang = langMap[i18n.language] || "en-IN";
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setCurrentTTSMessage(null);
    };
  };

  useEffect(() => {
    return () => window.speechSynthesis.cancel();
  }, []);

  // -----------------------------
  // Speech Recognition
  // -----------------------------
  const toggleListening = () => {
    if (isListening) {
      recognition?.stop();
      return;
    }

    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recog = new SpeechRecognition();
    setRecognition(recog);

    recog.lang = i18n.language || "en-IN";
    recog.interimResults = false;
    recog.maxAlternatives = 1;

    recog.onstart = () => {
      setIsListening(true);
      showNotification(t("listening"));
    };

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      showNotification(t("speech_captured"));
    };

    recog.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      showNotification(t("speech_error"));
      setIsListening(false);
    };

    recog.onend = () => setIsListening(false);

    recog.start();
  };

  // -----------------------------
  // Delete Chat
  // -----------------------------
  const handleDeleteChat = async (chat_id) => {
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/chat/${chat_id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to delete chat.");

      setChatList((prev) => prev.filter((c) => c.chat_id !== chat_id));
      if (activeChatId === chat_id) {
        setActiveChatId(null);
        setMessages([]);
      }
      showNotification(t("chat_deleted"));
    } catch (error) {
      console.error(error);
      showNotification(t("chat_delete_failed"));
    } finally {
      setDeleteModalChat(null);
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar
        username={username}
        setUser={setUser}
        showHomeButton
        showLogoutButton={false}
        showHistoryButton={false}
      />

      {notification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50 transition-opacity">
          {notification}
        </div>
      )}

      {deleteModalChat && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 text-center">
            <p className="mb-4 font-semibold">
              {t("confirm_delete_chat", { title: deleteModalChat.title })}
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => handleDeleteChat(deleteModalChat.chat_id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                {t("yes")}
              </button>
              <button
                onClick={() => setDeleteModalChat(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                {t("no")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden min-h-0">
        {/* Sidebar */}
        <aside
          className={`bg-gray-50 border-r flex flex-col overflow-hidden transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0 w-64" : "-translate-x-full w-0"}
            fixed sm:relative h-full z-40`}
        >
          <div className="p-2 border-b flex flex-col flex-shrink-0">
            <div className="flex justify-between items-center mb-1">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-green-700 hover:text-green-900 rounded-md transition"
              >
                &#10005;
              </button>
              <span className="text-lg font-semibold text-gray-700">{t("chats")}</span>
            </div>

            <button
              onClick={() => {
                setActiveChatId(null);
                setMessages([]);
                setIsSidebarOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-green-800 bg-green-100 rounded-md hover:bg-green-200 transition"
            >
              <span className="flex items-center justify-center w-5 h-5 bg-green-200 text-green-800 rounded-full text-[10px] font-bold leading-none">
                +
              </span>
              {t("new_chat")}
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto mt-0">
            <ul className="m-0 p-0">
              {chatList.map((chat) => (
                <li key={chat.chat_id} className="flex justify-between items-center group relative">
                  <button
                    onClick={() => {
                      setActiveChatId(chat.chat_id);
                      setIsSidebarOpen(false);
                    }}
                    className={`flex-1 text-left p-3 text-sm border-l-4 transition-all ${
                      activeChatId === chat.chat_id
                        ? "bg-green-100 border-green-600 font-semibold text-green-800"
                        : "border-transparent hover:border-green-400 hover:bg-gray-100"
                    }`}
                  >
                    {chat.title}
                  </button>
                  <button
                    onClick={() => setDeleteModalChat(chat)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 opacity-0 group-hover:opacity-100 transition text-lg font-bold"
                    title={t("delete_chat")}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-[90px] left-4 z-50 p-2 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700"
          >
            &#9776;
          </button>
        )}

        {/* Chat Area */}
        <main className="flex-1 flex flex-col min-h-0 transition-all duration-300 relative">
          <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !isTyping && (
              <div className="text-center text-gray-500 my-auto flex flex-col items-center">
                <img src="/Agriculens_icon.png" alt="Logo" className="w-16 h-16 mb-4" />
                <h2 className="text-xl">{t("chat_welcome")}</h2>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`relative max-w-[75%] px-4 py-2 rounded-lg prose prose-sm ${
                    msg.sender === "user"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none pb-10"
                  }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>

                  {msg.sender === "bot" && (
                    <button
                      onClick={() => speakMessage(msg.text)}
                      className="absolute bottom-1 right-1 text-green-600 hover:text-green-800 text-lg"
                      title={t("play_sound")}
                    >
                      {currentTTSMessage === msg.text
                        ? isPlaying
                          ? "⏸"
                          : isPaused
                          ? "▶"
                          : "🔊"
                        : "🔊"}
                    </button>
                  )}
                </div>
                <span className="text-xs text-gray-400 mt-1">{formatTime(msg.time)}</span>
              </div>
            ))}

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

          {/* Input Area */}
          <div className="sticky bottom-0 bg-white p-4 border-t flex-shrink-0">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t("message_placeholder")}
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />

              {/* MIC BUTTON */}
              <button
                onClick={toggleListening}
                className={`relative flex items-center justify-center w-10 h-10 rounded-full border transition ${
                  isListening
                    ? "bg-red-500 border-red-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                title={isListening ? t("stop_listening") : t("start_speaking")}
              >
                {isListening && (
                  <span className="absolute inline-flex h-8 w-8 rounded-full bg-red-400 opacity-75 animate-ping"></span>
                )}
                🎤
              </button>

              {/* SEND BUTTON */}
              <button
                onClick={sendMessage}
                disabled={isTyping}
                className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition disabled:bg-gray-400"
              >
                {t("send")}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
