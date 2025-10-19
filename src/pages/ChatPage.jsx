import { useState, useRef, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";
import Navbar from "../components/Navbar";

const API_BASE_URL = "https://mithun23112005-agriculens.hf.space";
const GEMINI_API_URL = "https://chatbotserver-925w.onrender.com/chat";

export default function ChatPage({ username, setUser }) {
  const { i18n } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatList, setChatList] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [deleteModalChat, setDeleteModalChat] = useState(null);
  const [notification, setNotification] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const chatEndRef = useRef(null);

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
      showNotification("Failed to load chats.");
    }
  }, []);

  useEffect(() => {
    fetchChatList();
  }, [fetchChatList]);

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
            sender: msg.role,
            text: msg.content,
            time: new Date(msg.createdAt || Date.now()),
          }));
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error(error);
        showNotification("Failed to load messages.");
      } finally {
        setIsTyping(false);
      }
    };

    fetchMessages();
  }, [activeChatId]);

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
        fetchChatList();
      } catch (error) {
        console.error(error);
        showNotification("Could not start a new chat. Try again.");
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          language: i18n.language || "en",
        }),
      });
      const data = await response.json();
      const botMessage = {
        sender: "bot",
        text: data.reply || "Sorry, I am unable to respond right now.",
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
        { sender: "bot", text: "Error: Could not process message.", time: new Date() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

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
      showNotification("Chat deleted successfully.");
    } catch (error) {
      console.error(error);
      showNotification("Could not delete chat.");
    } finally {
      setDeleteModalChat(null);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Navbar
        username={username}
        setUser={setUser}
        showHomeButton={true}
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
              Are you sure you want to delete "{deleteModalChat.title}"?
            </p>
            <div className="flex justify-around">
              <button
                onClick={() => handleDeleteChat(deleteModalChat.chat_id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={() => setDeleteModalChat(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                No
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
            fixed sm:relative h-full z-40
          `}
        >
          <div className="p-2 border-b flex flex-col flex-shrink-0">
            <div className="flex justify-between items-center mb-1">
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-green-700 hover:text-green-900 rounded-md transition"
              >
                &#10005;
              </button>
              <span className="text-lg font-semibold text-gray-700">Chats</span>
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
              New Chat
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
                    {chat.title} {/* full chat names */}
                  </button>
                  <button
                    onClick={() => setDeleteModalChat(chat)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-green-500 opacity-0 group-hover:opacity-100 transition text-lg font-bold"
                    title="Delete chat"
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Hamburger */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="fixed top-[90px] left-4 z-50 p-2 bg-green-600 text-white rounded-md shadow-lg hover:bg-green-700"
          >
            &#9776;
          </button>
        )}

        {/* Chat Window */}
        <main className="flex-1 flex flex-col min-h-0 transition-all duration-300 relative">
          <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !isTyping && (
              <div className="text-center text-gray-500 my-auto flex flex-col items-center">
                <img
                  src="/Agriculens_icon.png"
                  alt="Logo"
                  className="w-16 h-16 mb-4"
                />
                <h2 className="text-xl">How can I help you today?</h2>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.sender === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[75%] px-4 py-2 rounded-lg prose prose-sm ${
                    msg.sender === "user"
                      ? "bg-green-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <span className="text-xs text-gray-400 mt-1">
                  {formatTime(msg.time)}
                </span>
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

          <div className="sticky bottom-0 bg-white p-4 border-t flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Agri-Assistant..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                disabled={isTyping}
                className="bg-green-600 text-white px-5 py-2 rounded-full hover:bg-green-700 transition disabled:bg-gray-400"
              >
                Send
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}