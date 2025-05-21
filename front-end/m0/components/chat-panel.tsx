"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, User, Bot, Paperclip, Sparkles } from "lucide-react"

type Message = {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
  isTyping?: boolean
  code?: string
  language?: string
}

interface ChatPanelProps {
  chatId: string
  // Future props
  // assistantOnline?: boolean
}

export default function ChatPanel({ chatId }: ChatPanelProps) {
  // Mock chat data for different chats
  const chatData: Record<string, Message[]> = {
    "1": [
      {
        id: "1",
        content: "Hello! I'm your AI coding assistant. How can I help you today?",
        sender: "assistant",
        timestamp: new Date(),
      },
    ],
    "2": [
      {
        id: "1",
        content: "I need help integrating an API into my React application.",
        sender: "user",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "2",
        content: "I'd be happy to help with API integration. What specific API are you trying to integrate?",
        sender: "assistant",
        timestamp: new Date(Date.now() - 3500000),
      },
    ],
    "3": [
      {
        id: "1",
        content: "Can you help me design a database schema for a blog platform?",
        sender: "user",
        timestamp: new Date(Date.now() - 86400000 * 3),
      },
      {
        id: "2",
        content: "For a blog platform, you'll need several key tables. Here's a suggested schema:",
        sender: "assistant",
        timestamp: new Date(Date.now() - 86400000 * 3 + 100000),
        code: `CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id UUID PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
  id UUID PRIMARY KEY,
  content TEXT NOT NULL,
  user_id UUID REFERENCES users(id),
  post_id UUID REFERENCES posts(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`,
        language: "sql",
      },
    ],
  }

  const [messages, setMessages] = useState<Message[]>(chatData[chatId] || [])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if viewport is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Update messages when chatId changes
  useEffect(() => {
    setMessages(chatData[chatId] || [])
    // Scroll to bottom when chat changes
    setTimeout(scrollToBottom, 100)
  }, [chatId])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleSendMessage = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Show typing indicator
    setIsTyping(true)

    // Mock AI response with typing effect
    const typingMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: "",
      sender: "assistant",
      timestamp: new Date(),
      isTyping: true,
    }

    setMessages((prev) => [...prev, typingMessage])
    scrollToBottom()

    // TODO: BACKEND INTEGRATION POINT
    // Replace this mock response with your actual backend API call
    // Example:
    // const sendChatMessage = async (message: string) => {
    //   try {
    //     const response = await fetch('/api/chat', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify({ message, chatId })
    //     });
    //     const data = await response.json();
    //
    //     // Remove typing indicator and add real response
    //     setIsTyping(false);
    //     setMessages((prev) =>
    //       prev.filter((msg) => !msg.isTyping).concat({
    //         id: data.id,
    //         content: data.content,
    //         sender: 'assistant',
    //         timestamp: new Date(),
    //         code: data.code,
    //         language: data.language,
    //       })
    //     );
    //   } catch (error) {
    //     console.error('Error sending message:', error);
    //     setIsTyping(false);
    //     // Handle error state
    //   }
    // }
    // sendChatMessage(input);

    // Simulate typing and response
    setTimeout(() => {
      setIsTyping(false)

      // Generate a code example if the message contains certain keywords
      let codeExample = null
      let language = null

      if (input.toLowerCase().includes("component") || input.toLowerCase().includes("react")) {
        codeExample = `import React, { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Counter: {count}</h2>
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setCount(count + 1)}
      >
        Increment
      </button>
    </div>
  );
}

export default Counter;`
        language = "jsx"
      }

      setMessages((prev) =>
        prev
          .filter((msg) => !msg.isTyping)
          .concat({
            id: (Date.now() + 2).toString(),
            content:
              "Here's a solution based on your request. I've created a sample implementation that should help you get started.",
            sender: "assistant",
            timestamp: new Date(),
            code: codeExample,
            language: language,
          }),
      )

      scrollToBottom()
    }, 2000)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    // Auto-resize textarea
    e.target.style.height = "auto"
    e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`
  }

  return (
    <div className="flex flex-col h-full">
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#1e2650]"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"} ${
              message.sender === "user" ? "animate-slide-right" : "animate-slide-left"
            }`}
          >
            <div
              className={`max-w-[90%] sm:max-w-[85%] rounded-lg p-3 sm:p-4 ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-blue-700/80 to-blue-600/80 text-white"
                  : "bg-blue-900/30 text-blue-100 border border-blue-800/50"
              } shadow-md backdrop-blur-sm transition-shadow duration-200 ease-out hover:shadow-glow-${
                message.sender === "user" ? "blue" : "pink"
              }`}
            >
              <div className="flex items-center mb-2">
                {message.sender === "assistant" ? (
                  <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-neon-pink mr-2" />
                ) : (
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-neon-blue mr-2" />
                )}
                <span className="text-xs opacity-70">{formatTime(message.timestamp)}</span>
              </div>
              {message.isTyping ? (
                <div className="flex items-center">
                  <div className="flex space-x-1 items-center">
                    <div
                      className="w-2 h-2 bg-neon-pink rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-neon-pink rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-neon-pink rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                  <span className="text-blue-300 ml-2 text-sm">Generating response...</span>
                </div>
              ) : (
                <>
                  <p className="whitespace-pre-wrap text-sm sm:text-base">{message.content}</p>

                  {/* Code block if present */}
                  {message.code && (
                    <div className="mt-4 bg-blue-950/50 rounded-md overflow-hidden border border-blue-800/50 animate-slide-down">
                      <div className="bg-blue-900/50 px-3 sm:px-4 py-1 sm:py-2 text-xs flex justify-between items-center">
                        <span>{message.language || "code"}</span>
                        <button
                          className="text-blue-300 hover:text-neon-blue transition-colors duration-200 ease-out"
                          onClick={() => navigator.clipboard.writeText(message.code || "")}
                          aria-label="Copy code"
                        >
                          Copy
                        </button>
                      </div>
                      <pre className="p-3 sm:p-4 text-xs sm:text-sm overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#1e2650]">
                        <code>{message.code}</code>
                      </pre>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 sm:p-6 border-t border-blue-800/50">
        <div className="flex flex-col bg-blue-900/20 rounded-lg overflow-hidden shadow-md hover:shadow-glow-blue transition-shadow duration-200 ease-out">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
            placeholder="Ask me to generate code, explain concepts, or debug issues..."
            className="flex-1 bg-transparent p-3 sm:p-4 outline-none text-blue-100 placeholder-blue-400 resize-none min-h-[40px] max-h-[150px] text-sm sm:text-base"
            style={{ height: "40px" }}
            aria-label="Chat message input"
          />
          <div className="flex justify-between items-center px-3 sm:px-4 py-2 sm:py-3 bg-blue-950/30">
            <div className="flex items-center">
              <button
                className="p-1 sm:p-2 rounded-lg text-blue-400 hover:text-neon-blue hover:bg-blue-800/30 transition-colors duration-200 ease-out mr-2"
                aria-label="Attach file"
              >
                <Paperclip size={isMobile ? 14 : 16} />
              </button>
              <button
                className="p-1 sm:p-2 rounded-lg text-blue-400 hover:text-neon-pink hover:bg-blue-800/30 transition-colors duration-200 ease-out"
                aria-label="Use AI suggestions"
              >
                <Sparkles size={isMobile ? 14 : 16} />
              </button>
              <span className="text-xs text-blue-500 ml-2 sm:ml-3 hidden sm:inline">Press Enter to send</span>
            </div>
            <button
              onClick={handleSendMessage}
              disabled={input.trim() === "" || isTyping}
              className={`p-1 sm:p-2 rounded-lg ${
                input.trim() === "" || isTyping
                  ? "text-blue-700 cursor-not-allowed"
                  : "text-neon-blue hover:text-neon-pink hover:bg-blue-800/30"
              } transition-colors duration-200 ease-out`}
              aria-label="Send message"
            >
              <Send className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
