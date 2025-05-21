"use client"

import { MessageSquare, Star, Trash2 } from "lucide-react"

interface ChatListProps {
  activeChat: string
  setActiveChat: (id: string) => void
  chats: Array<{
    id: string
    title: string
    date: string
    starred: boolean
  }>
}

// Add TODO comment for backend integration
export default function ChatList({ activeChat, setActiveChat, chats }: ChatListProps) {
  // TODO: BACKEND INTEGRATION POINT
  // In a real app, fetch chat history from your backend
  // Example:
  // const [chatHistory, setChatHistory] = useState([]);
  //
  // useEffect(() => {
  //   const fetchChats = async () => {
  //     try {
  //       const response = await fetch('/api/chats');
  //       const data = await response.json();
  //       setChatHistory(data);
  //     } catch (error) {
  //       console.error('Error fetching chats:', error);
  //     }
  //   };
  //
  //   fetchChats();
  // }, []);
  //
  // const deleteChat = async (chatId) => {
  //   try {
  //     await fetch(`/api/chats/${chatId}`, { method: 'DELETE' });
  //     setChatHistory(chatHistory.filter(chat => chat.id !== chatId));
  //   } catch (error) {
  //     console.error('Error deleting chat:', error);
  //   }
  // };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#1e2650]">
      <ul className="p-4 space-y-1">
        {chats.map((chat) => (
          <li key={chat.id}>
            <button
              className={`w-full text-left p-3 rounded-lg flex items-start group transition-colors duration-200 ease-out ${
                activeChat === chat.id
                  ? "bg-blue-800/30 text-blue-100 shadow-glow-blue"
                  : "hover:bg-blue-900/20 text-blue-300"
              }`}
              onClick={() => setActiveChat(chat.id)}
              aria-current={activeChat === chat.id ? "true" : "false"}
            >
              <MessageSquare size={16} className="mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{chat.title}</h3>
                  {chat.starred && <Star size={14} className="text-yellow-400 ml-1 flex-shrink-0" />}
                </div>
                <p className="text-xs text-blue-400 mt-1">{chat.date}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out ml-2 flex-shrink-0">
                <button
                  className="p-1 text-blue-400 hover:text-red-400 transition-colors duration-200 ease-out"
                  aria-label={`Delete chat: ${chat.title}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
