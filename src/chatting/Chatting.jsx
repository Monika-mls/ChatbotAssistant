import React, { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { MessageCircle } from "lucide-react";
import "./Chatting.css"; // Import your custom styles if needed

const ai = new GoogleGenerativeAI("AIzaSyCH9pwwJ6YMP216PiDZuVZ0NkxA0_ado9s"); // Replace with a valid API key

const Chatting = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollTo({
      top: chatRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent({
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "You are a helpful assistant. Answer concisely. If unsure, say: 'Sorry, that's not in my knowledge base.'\n\nUser: " +
                  input,
              },
            ],
          },
        ],
      });

      const botResponse = await result.response.text();
      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Something went wrong. Try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-black text-white flex flex-col">
    {/* Header */}
    <header className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white text-xl font-semibold p-4 shadow-md">
      Chatbot Assistant
    </header>

    {/* Chat Container with margins */}
    <main className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 md:px-10 space-y-4">
      <div
        ref={chatRef}
        className="h-full flex flex-col space-y-4"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs sm:max-w-sm md:max-w-md px-4 py-2 rounded-lg shadow ${
                msg.sender === "user"
                  ? "bg-red-600 text-white rounded-br-none"
                  : "bg-gray-800 text-gray-100 rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
    </main>

    {/* Input Bar at Bottom */}
    <footer className="bg-black px-4 py-3 sm:px-6 md:px-10 border-t border-gray-800">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 bg-gray-900 text-white border border-red-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 transition disabled:opacity-50"
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </footer>
  </div>
);
}

export default Chatting;