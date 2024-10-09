import React, { useState, useEffect, useRef } from "react"; 
import axios from "axios";
import { FaHourglassHalf, FaTrashAlt, FaPaperPlane, FaPlus, FaExclamationTriangle } from "react-icons/fa";
import { FaClockRotateLeft } from "react-icons/fa6";

const ChatApp = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSessionIndex, setSelectedSessionIndex] = useState(null);
  const messagesEndRef = useRef(null); 

  useEffect(() => {
    const storedMessages = JSON.parse(localStorage.getItem("chatHistory"));
    if (storedMessages) setMessages(storedMessages);

    const savedSessions = JSON.parse(localStorage.getItem("chatSessions")) || [];
    setSessionHistory(savedSessions);
    setSelectedSessionIndex(savedSessions.length);
  }, []);

  useEffect(() => {
    // Auto-scroll to the bottom of messages whenever they change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const saveCurrentSession = () => {
    const updatedSessions = [...sessionHistory];
    updatedSessions[selectedSessionIndex] = [...messages]; // Save messages to the current session
    setSessionHistory(updatedSessions);
    localStorage.setItem("chatSessions", JSON.stringify(updatedSessions));
  };

  const sendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { user: "You", text: input }];
      setMessages(newMessages);
      localStorage.setItem("chatHistory", JSON.stringify(newMessages));

      setLoading(true);
      try {
        const response = await axios.post("http://localhost:8000/query", {
          question: input,
        });

        const botReply = {
          user: "Hogwarts", 
          text: response.data.answer || "Sorry, I don't have an answer for that.",
        };
        const updatedMessages = [...newMessages, botReply];
        setMessages(updatedMessages);
        localStorage.setItem("chatHistory", JSON.stringify(updatedMessages));

        // Save the current session after receiving a reply
        saveCurrentSession();
      } catch (error) {
        console.error("Error fetching data from FastAPI:", error);
        const errorMessage = {
          user: "Hogwarts", 
          text: "There was an error connecting to the server. Please try again later.",
        };
        const updatedMessages = [...newMessages, errorMessage];
        setMessages(updatedMessages);
        localStorage.setItem("chatHistory", JSON.stringify(updatedMessages));

        // Save the current session even after an error
        saveCurrentSession();
      } finally {
        setLoading(false);
      }

      setInput("");
    }
  };

  const startNewSession = () => {
    // Save the current messages to session history only if there are messages
    if (messages.length > 0) {
      saveCurrentSession();
    }

    // Reset messages for the new chat
    setMessages([]);
    localStorage.removeItem("chatHistory");
    setSelectedSessionIndex(sessionHistory.length); // Update the index for the new session
  };

  const loadSession = (index) => {
    if (selectedSessionIndex !== null) {
      saveCurrentSession();
    }

    const session = sessionHistory[index];
    setMessages(session);
    localStorage.setItem("chatHistory", JSON.stringify(session));
    setSelectedSessionIndex(index); // Set the currently selected session index
  };

  const clearAllSessions = () => {
    setSessionHistory([]);
    localStorage.removeItem("chatSessions");
  };

  const showAlert = () => {
    alert("Please ensure that the FastAPI server is running locally.");
  };

  return (
    <div className="flex h-screen gap-2 p-4 bg-slate-800">
      {/* Sidebar */}
      <div className="flex flex-col gap-4 border border-slate-500 rounded p-4 bg-slate-700">
        <h2 className="text-xl text-slate-300 flex gap-2 flex-wrap">
          <span className="text-white inline-flex gap-2 items-center justify-center">
            <FaClockRotateLeft className="inline" />
            Time-Turner : {" "}
          </span>
          Previous Chats
        </h2>
        <hr className="border-b border-slate-500" />
        <div className="flex flex-col gap-2">
          {sessionHistory.map((session, index) => (
            <button
              key={index}
              className={`text-white font-bold py-2 px-4 rounded-lg transition hover:scale-105 ${
                selectedSessionIndex === index ? 'bg-blue-950' : 'bg-indigo-500 hover:bg-indigo-600' // Highlight selected session
              }`}
              onClick={() => loadSession(index)}
            >
              Chat {index + 1}
            </button>
          ))}
        </div>
        <button
          className="flex gap-2 items-center justify-center bg-red-500 rounded-lg p-3 text-white transition hover:bg-red-600"
          onClick={clearAllSessions}
        >
          <FaTrashAlt /> Clear
        </button>

        {/* Alert Button Section */}
        <div className="mt-auto flex justify-start">
          <button
            onClick={showAlert}
            className="flex items-center bg-yellow-500 font-bold px-4 py-2 rounded-lg shadow-md transition hover:bg-yellow-600"
          >
            <FaExclamationTriangle className="mr-2"/>
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="w-3/4 flex flex-col h-full">
        <div className="flex items-center justify-between bg-slate-700 border border-slate-500 p-4 rounded text-white">
          <h1 className="text-2xl font-bold">🧙‍♂️ Hogwarts Q&A</h1>
          <button
            className="flex gap-2 items-center justify-center bg-indigo-500 rounded p-4"
            onClick={startNewSession}
          >
            <FaPlus className="mr-2" /> New Chat
          </button>
        </div>

        <div className="flex-grow p-4 overflow-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 ${message.user === "You" ? "flex justify-end" : "flex justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.user === "You"
                    ? "bg-indigo-500 text-white border border-indigo-600"
                    : "bg-slate-700 text-white border border-gray-600"
                }`}
              >
                <p className="font-bold mb-1">{message.user}</p>
                <p>{message.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-center items-center h-16">
              <FaHourglassHalf className="animate-spin text-indigo-200 text-2xl" />
            </div>
          )}
          <div ref={messagesEndRef} /> {/* Reference for auto-scrolling */}
        </div>

        <div className="p-4 rounded bg-slate-900">
          <div className="flex">
            <input
              type="text"
              className="flex-1 p-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-800 text-white"
              placeholder="Ask a question from Harry Potter and the Prisoner of Azkaban..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold px-4 rounded-r-lg transition"
              onClick={sendMessage}
            >
              {loading ? (
                <FaHourglassHalf className="animate-spin" />
              ) : (
                <FaPaperPlane />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
