"use client"

import { useState, useEffect, useRef } from "react"
import {
  Code,
  FileCode,
  MessageSquare,
  Plus,
  Zap,
  Maximize2,
  Minimize2,
  Minimize,
  PanelLeft,
  Command,
  X,
  Copy,
  Check,
  Download,
  Play,
  Loader2,
  Settings,
  FilePlus,
  FolderPlus,
  ChevronDown,
} from "lucide-react"
import ChatPanel from "@/components/chat-panel"
import CodeEditor from "@/components/code-editor"
import FileTree from "@/components/file-tree"
import ChatList from "@/components/chat-list"
import { mockFileStructure, mockFileContents } from "@/lib/mock-data"

export default function DevTool() {
  // Responsive breakpoints
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  }

  const [screenSize, setScreenSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  })
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  const [activeChat, setActiveChat] = useState("1")
  const [chatListOpen, setChatListOpen] = useState(true)
  const [expandedChat, setExpandedChat] = useState(false)
  const [fileTreeWidth, setFileTreeWidth] = useState(240)
  const [fileTreeWidthPercent, setFileTreeWidthPercent] = useState(30) // 30% by default
  const [selectedFile, setSelectedFile] = useState<string | null>("21") // Default to DataFetcher.tsx
  const [currentCode, setCurrentCode] = useState("")
  const [currentLanguage, setCurrentLanguage] = useState("tsx")
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const [commandFilter, setCommandFilter] = useState("")
  const commandInputRef = useRef<HTMLInputElement>(null)
  const [copied, setCopied] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const [fileTreeAnimating, setFileTreeAnimating] = useState(false)
  const [codeMenuOpen, setCodeMenuOpen] = useState(false)
  const [chatSectionWidth, setChatSectionWidth] = useState(50) // 50% by default
  const [fileMenuOpen, setFileMenuOpen] = useState(false)
  const fileMenuRef = useRef<HTMLDivElement>(null)
  const [fileDialog, setFileDialog] = useState<{
    type: "newFile" | "newFolder" | null
    parentId?: string
  }>({ type: null })

  // Animation states
  const [isLoaded, setIsLoaded] = useState(false)
  const [layoutTransitioning, setLayoutTransitioning] = useState(false)

  const [fileTreeVisible, setFileTreeVisible] = useState(true)
  const [chatSectionVisible, setChatSectionVisible] = useState(true)
  const [chats, setChats] = useState([
    { id: "1", title: "React Component Generator", date: "Today", starred: true },
    { id: "2", title: "API Integration Help", date: "Yesterday", starred: false },
    { id: "3", title: "Database Schema Design", date: "Apr 20", starred: true },
    { id: "4", title: "CSS Animation Problem", date: "Apr 18", starred: false },
    { id: "5", title: "Next.js Routing Question", date: "Apr 15", starred: false },
  ])

  const toggleChatExpanded = () => {
    setLayoutTransitioning(true)
    setExpandedChat(!expandedChat)
    setTimeout(() => setLayoutTransitioning(false), 300)
  }

  const toggleFileTree = () => {
    setFileTreeAnimating(true)
    setFileTreeVisible(!fileTreeVisible)
    setTimeout(() => setFileTreeAnimating(false), 300)
  }

  const formatCode = () => {
    // TODO: BACKEND INTEGRATION POINT
    // In a real app, format code with Prettier or your preferred formatter
    // For now, just show a notification or simulate formatting
    console.log("Formatting code...")
    // Mock formatting by adding a small delay
    setTimeout(() => {
      console.log("Code formatted!")
    }, 300)
  }

  const handleCopy = () => {
    if (currentCode) {
      navigator.clipboard.writeText(currentCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    if (currentCode) {
      const blob = new Blob([currentCode], { type: "text/javascript" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `code.${currentLanguage}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleRun = () => {
    setIsRunning(true)
    // Simulate code execution
    setTimeout(() => {
      setIsRunning(false)
      console.log("Code executed!")
    }, 2000)
  }

  const createNewChat = () => {
    // TODO: BACKEND INTEGRATION POINT
    // In a real app, create a new chat in your backend
    // Example:
    // const createChat = async () => {
    //   const response = await fetch('/api/chats', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ title: `New Chat ${Date.now()}` })
    //   });
    //   const newChat = await response.json();
    //   setChats([...chats, newChat]);
    //   setActiveChat(newChat.id);
    // }
    // createChat();

    // Using mock data for now
    const newChatId = (Math.max(...chats.map((chat) => Number.parseInt(chat.id))) + 1).toString()
    const newChat = {
      id: newChatId,
      title: `New Chat ${newChatId}`,
      date: "Just now",
      starred: false,
    }
    setChats([...chats, newChat])
    setActiveChat(newChatId)
    // Make sure chat section is visible when creating a new chat
    setChatSectionVisible(true)
  }

  // Command palette options
  const commands = [
    {
      id: "toggle-chat",
      label: "Toggle Chat Panel",
      shortcut: "⌘J",
      action: () => setChatSectionVisible(!chatSectionVisible),
    },
    {
      id: "toggle-files",
      label: "Toggle File Tree",
      shortcut: "⌘K",
      action: () => toggleFileTree(),
    },
    { id: "new-chat", label: "Create New Chat", shortcut: "⌘N", action: createNewChat },
    {
      id: "focus-editor",
      label: "Focus Code Editor",
      shortcut: "⌘E",
      action: () => document.getElementById("code-editor")?.focus(),
    },
    {
      id: "focus-tree",
      label: "Focus File Tree",
      shortcut: "⌘B",
      action: () => document.getElementById("file-tree")?.focus(),
    },
    { id: "toggle-maximize", label: "Toggle Maximize Chat", shortcut: "⌘M", action: toggleChatExpanded },
    { id: "format-code", label: "Format Code", shortcut: "⌘S", action: formatCode },
    { id: "new-file", label: "Create New File", shortcut: "⌘F", action: () => setFileDialog({ type: "newFile" }) },
    {
      id: "new-folder",
      label: "Create New Folder",
      shortcut: "⌘D",
      action: () => setFileDialog({ type: "newFolder" }),
    },
  ]

  // Filtered commands based on search
  const filteredCommands = commandFilter
    ? commands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(commandFilter.toLowerCase()) ||
          cmd.id.toLowerCase().includes(commandFilter.toLowerCase()),
      )
    : commands

  // Check viewport size and set responsive states
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight

      setScreenSize({ width, height })
      setIsMobile(width < breakpoints.md)
      setIsTablet(width >= breakpoints.md && width < breakpoints.lg)

      // Adjust fileTreeWidth based on screen size
      if (width < breakpoints.md) {
        setFileTreeWidth(width * 0.8) // 80% of screen width on mobile
      } else if (width < breakpoints.lg) {
        setFileTreeWidth(Math.min(300, width * 0.4)) // 40% of screen width on tablet, max 300px
      } else {
        // Calculate the width based on the percentage of the code section
        const codeSection = document.querySelector(".code-section-container")
        if (codeSection) {
          const codeSectionWidth = codeSection.clientWidth
          setFileTreeWidth((codeSectionWidth * fileTreeWidthPercent) / 100)
        } else {
          setFileTreeWidth(Math.min(400, width * 0.25)) // 25% of screen width on desktop, max 400px
        }
      }
    }

    handleResize() // Initial check
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [breakpoints.lg, breakpoints.md, fileTreeWidthPercent])

  // Boot animation
  useEffect(() => {
    // Simulate boot sequence
    setTimeout(() => {
      setIsLoaded(true)
    }, 1000)
  }, [])

  // Load code for selected file
  useEffect(() => {
    if (selectedFile) {
      // TODO: BACKEND INTEGRATION POINT
      // In a real app, fetch file content from your backend API
      // Example:
      // const fetchFileContent = async (fileId) => {
      //   const response = await fetch(`/api/files/${fileId}`);
      //   const data = await response.json();
      //   setCurrentCode(data.content);
      //   setCurrentLanguage(data.language);
      // }
      // fetchFileContent(selectedFile);

      // Using mock data for now
      const fileData = mockFileContents[selectedFile]
      if (fileData) {
        setCurrentCode(fileData.content)
        setCurrentLanguage(fileData.language)
      }
    }
  }, [selectedFile])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command palette
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setCommandPaletteOpen((prev) => !prev)
        setTimeout(() => commandInputRef.current?.focus(), 10)
      }

      // Cmd/Ctrl + B to focus file tree
      if ((e.metaKey || e.ctrlKey) && e.key === "b") {
        e.preventDefault()
        document.getElementById("file-tree")?.focus()
      }

      // Cmd/Ctrl + E to focus editor
      if ((e.metaKey || e.ctrlKey) && e.key === "e") {
        e.preventDefault()
        document.getElementById("code-editor")?.focus()
      }

      // Cmd/Ctrl + J to toggle chat list
      if ((e.metaKey || e.ctrlKey) && e.key === "j") {
        e.preventDefault()
        setChatSectionVisible(!chatSectionVisible)
      }

      // Cmd/Ctrl + M to toggle maximize chat
      if ((e.metaKey || e.ctrlKey) && e.key === "m") {
        e.preventDefault()
        toggleChatExpanded()
      }

      // Cmd/Ctrl + S to format code
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault()
        formatCode()
      }

      // Cmd/Ctrl + F to create new file
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault()
        setFileDialog({ type: "newFile" })
      }

      // Cmd/Ctrl + D to create new folder
      if ((e.metaKey || e.ctrlKey) && e.key === "d") {
        e.preventDefault()
        setFileDialog({ type: "newFolder" })
      }

      // Escape to close command palette
      if (e.key === "Escape" && commandPaletteOpen) {
        setCommandPaletteOpen(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [chatSectionVisible, fileTreeVisible, commandPaletteOpen])

  const handleSelectFile = (fileId: string) => {
    setSelectedFile(fileId)
  }

  // Calculate layout dimensions based on screen size
  const getChatListWidth = () => {
    if (!chatSectionVisible) return "0px"
    if (screenSize.width < breakpoints.md) return "100%"
    if (screenSize.width < breakpoints.lg) return "240px"
    return "280px"
  }

  const getMainPanelClasses = () => {
    let classes = "flex-1 flex flex-col min-w-0 overflow-hidden"

    if (!expandedChat) {
      classes += " sm:flex-row"
    }

    if (screenSize.width < breakpoints.md) {
      classes += " h-[50vh]"
    } else {
      classes += " h-full"
    }

    if (layoutTransitioning) {
      classes += " transition-all duration-300 ease-in-out"
    }

    return classes
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (codeMenuOpen && !(event.target as Element).closest(".code-menu-container")) {
        setCodeMenuOpen(false)
      }
      if (fileMenuOpen && fileMenuRef.current && !fileMenuRef.current.contains(event.target as Node)) {
        setFileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [codeMenuOpen, fileMenuOpen])

  // Handle file tree resizing
  const handleFileTreeResize = (newWidthPercent: number) => {
    const codeSection = document.querySelector(".code-section-container")
    if (codeSection) {
      const codeSectionWidth = codeSection.clientWidth
      const newWidth = (codeSectionWidth * newWidthPercent) / 100
      setFileTreeWidthPercent(newWidthPercent)
      setFileTreeWidth(newWidth)
    }
  }

  // Find the root folder for new file/folder creation
  const getRootFolder = () => {
    return mockFileStructure.find((node) => node.type === "folder")?.id || "1"
  }

  // Helper function to add a node to a parent in the file structure
  const addNodeToParent = (tree: typeof mockFileStructure, parentId: string, newNode: any) => {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].id === parentId) {
        if (tree[i].type === "folder") {
          if (!tree[i].children) {
            tree[i].children = []
          }
          tree[i].children.push(newNode)
          return true
        }
        return false
      }

      if (tree[i].children) {
        if (addNodeToParent(tree[i].children, parentId, newNode)) {
          return true
        }
      }
    }

    // If we couldn't find the parent, add to the first folder at root level
    if (parentId === getRootFolder() && tree.length > 0) {
      const rootFolder = tree.find((node) => node.type === "folder")
      if (rootFolder && rootFolder.children) {
        rootFolder.children.push(newNode)
        return true
      }
    }

    return false
  }

  return (
    <div className="flex h-screen w-full bg-midnight text-blue-50 overflow-hidden font-mono relative bg-gradient-to-br from-blue-950 to-blue-900/90">
      {/* Loading overlay */}
      <div
        className={`fixed inset-0 bg-black z-50 flex items-center justify-center transition-opacity duration-1000 ${
          isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="text-center">
          <div className="text-neon-blue text-4xl font-bold mb-4 animate-pulse">AI Code Assistant</div>
          <div className="text-blue-400 animate-bounce">Initializing system...</div>
        </div>
      </div>

      {/* Command Palette */}
      {commandPaletteOpen && (
        <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-blue-900/90 border border-blue-800 rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-scale-in">
            <div className="flex items-center p-3 border-b border-blue-800">
              <Command className="h-5 w-5 text-blue-400 mr-2" />
              <input
                ref={commandInputRef}
                type="text"
                placeholder="Search commands..."
                className="flex-1 bg-transparent border-none outline-none text-blue-100 placeholder-blue-400"
                value={commandFilter}
                onChange={(e) => setCommandFilter(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => setCommandPaletteOpen(false)}
                className="text-blue-400 hover:text-neon-blue p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {filteredCommands.map((cmd) => (
                <button
                  key={cmd.id}
                  className="w-full text-left px-4 py-3 hover:bg-blue-800/50 flex items-center justify-between"
                  onClick={() => {
                    cmd.action()
                    setCommandPaletteOpen(false)
                  }}
                >
                  <span>{cmd.label}</span>
                  <span className="text-blue-400 text-sm bg-blue-950/50 px-2 py-1 rounded">{cmd.shortcut}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* File Dialog */}
      {fileDialog.type && (
        <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-blue-900/90 border border-blue-800 rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-4 border-b border-blue-800">
              <h3 className="text-lg font-medium text-neon-blue">
                {fileDialog.type === "newFile" ? "Create New File" : "Create New Folder"}
              </h3>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const input = e.currentTarget.querySelector("input") as HTMLInputElement
                const value = input.value.trim()

                if (value) {
                  // Find the root folder or use the specified parent
                  const parentId = fileDialog.parentId || getRootFolder()

                  // Create a new file or folder in the mock file structure
                  const newId = `new-${Date.now()}`

                  if (fileDialog.type === "newFile") {
                    // Determine file extension and icon
                    const fileExtension = value.includes(".") ? "" : ".tsx" // Default to .tsx if no extension
                    const newFileName = value.includes(".") ? value : `${value}${fileExtension}`
                    const extension = newFileName.split(".").pop() || ""

                    let icon = "text"
                    if (["tsx", "jsx", "ts", "js"].includes(extension)) {
                      icon = extension
                    } else if (["json"].includes(extension)) {
                      icon = "json"
                    } else if (["png", "jpg", "jpeg", "gif", "svg"].includes(extension)) {
                      icon = "image"
                    }

                    // Create the new file node
                    const newFile = {
                      id: newId,
                      name: newFileName,
                      type: "file" as const,
                      icon,
                      isGenerated: false,
                      gitStatus: "untracked" as const,
                    }

                    // Add the file to the file structure
                    const updatedStructure = [...mockFileStructure]
                    addNodeToParent(updatedStructure, parentId, newFile)

                    // Select the new file
                    setSelectedFile(newId)

                    // Add empty content for the new file
                    mockFileContents[newId] = {
                      language: extension,
                      content: `// New file: ${newFileName}\n\n`,
                    }
                  } else {
                    // Create a new folder
                    const newFolder = {
                      id: newId,
                      name: value,
                      type: "folder" as const,
                      children: [],
                      isGenerated: false,
                      gitStatus: "untracked" as const,
                    }

                    // Add the folder to the file structure
                    const updatedStructure = [...mockFileStructure]
                    addNodeToParent(updatedStructure, parentId, newFolder)
                  }

                  setFileDialog({ type: null })
                }
              }}
            >
              <div className="p-4">
                <input
                  type="text"
                  placeholder={
                    fileDialog.type === "newFile" ? "Enter file name (e.g. component.tsx)" : "Enter folder name"
                  }
                  className="w-full bg-blue-950/50 border border-blue-800 rounded-md px-3 py-2 text-blue-100 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-neon-blue"
                  autoFocus
                />
              </div>
              <div className="flex justify-end space-x-2 p-4 border-t border-blue-800">
                <button
                  type="button"
                  onClick={() => setFileDialog({ type: null })}
                  className="px-4 py-2 bg-blue-950/50 text-blue-300 rounded-md hover:bg-blue-800/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-neon-blue/20 text-neon-blue rounded-md hover:bg-neon-blue/30 transition-colors"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        {/* Chat list panel */}
        <div
          className="transition-all duration-300 ease-out flex flex-col border-r border-blue-800/50 bg-blue-950/30"
          style={{
            width: getChatListWidth(),
            height: screenSize.width < breakpoints.md && chatSectionVisible ? "50vh" : "100%",
            overflow: chatSectionVisible ? "visible" : "hidden",
          }}
        >
          <div className="p-4 sm:p-6 border-b border-blue-800/50 flex items-center justify-between">
            <h2 className="text-base font-bold text-neon-blue">Chats</h2>
            <div className="flex items-center space-x-2">
              <button
                className="p-2 rounded-lg hover:bg-blue-800/30 text-blue-400 hover:text-neon-blue transition-colors duration-200 ease-out shadow-sm hover:shadow-glow-blue"
                title="New Chat"
                aria-label="Create new chat"
                onClick={createNewChat}
              >
                <Plus size={16} />
              </button>
              <button
                className="p-2 rounded-lg hover:bg-blue-800/30 text-blue-400 hover:text-neon-blue transition-colors duration-200 ease-out"
                onClick={() => setChatSectionVisible(false)}
                aria-label="Minimize chat list"
              >
                <Minimize size={16} />
              </button>
            </div>
          </div>
          <ChatList activeChat={activeChat} setActiveChat={setActiveChat} chats={chats} />
        </div>

        {/* Chat interface */}
        <div className={`${getMainPanelClasses()} chat-code-container`}>
          {/* Left Panel - Chat Interface */}
          <div
            className={`${
              expandedChat ? "w-full h-full" : isMobile ? "w-full h-1/2" : "h-full"
            } border-r border-blue-800/50 flex flex-col transition-all duration-300 ease-out min-w-0 overflow-hidden`}
            style={{ width: expandedChat || isMobile ? "100%" : `${chatSectionWidth}%` }}
          >
            <div className="bg-blue-950/30 px-4 sm:px-6 py-3 sm:py-4 border-b border-blue-800/50 flex items-center">
              <div className="flex items-center">
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-neon-blue mr-2 sm:mr-3" />
                <h2 className="text-sm sm:text-base font-bold text-neon-blue">AI Assistant</h2>
              </div>
              <div className="ml-auto flex items-center space-x-2 sm:space-x-4">
                <div className="hidden sm:flex items-center">
                  <span className="inline-flex h-2 w-2 rounded-full bg-neon-green mr-2 animate-pulse"></span>
                  <span className="text-xs text-neon-green">Online</span>
                </div>
                {!chatSectionVisible && (
                  <button
                    className="p-1 sm:p-2 rounded-lg hover:bg-blue-800/30 text-blue-400 hover:text-neon-blue transition-colors duration-200 ease-out"
                    onClick={() => setChatSectionVisible(true)}
                    aria-label="Show chat list"
                  >
                    <PanelLeft size={16} />
                  </button>
                )}
                <button
                  onClick={toggleChatExpanded}
                  className="p-1 sm:p-2 rounded-lg hover:bg-blue-800/30 text-blue-400 hover:text-neon-blue transition-colors duration-200 ease-out"
                  aria-label={expandedChat ? "Minimize chat" : "Maximize chat"}
                >
                  {expandedChat ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                </button>
              </div>
            </div>
            <ChatPanel chatId={activeChat} />
          </div>

          {/* Vertical Resizable Splitter */}
          {!expandedChat && !isMobile && (
            <div
              className="w-1 hover:w-1.5 bg-blue-800/30 hover:bg-neon-blue cursor-col-resize transition-all duration-200 ease-out relative"
              onMouseDown={(e) => {
                const startX = e.clientX
                const startWidth = chatSectionWidth

                const handleMouseMove = (moveEvent: MouseEvent) => {
                  const containerWidth = document.querySelector(".chat-code-container")?.clientWidth || 100
                  const deltaX = moveEvent.clientX - startX
                  const newWidthPercent = Math.max(20, Math.min(80, startWidth + (deltaX / containerWidth) * 100))
                  setChatSectionWidth(newWidthPercent)
                }

                const handleMouseUp = () => {
                  document.removeEventListener("mousemove", handleMouseMove)
                  document.removeEventListener("mouseup", handleMouseUp)
                  document.body.style.cursor = "default"
                }

                document.addEventListener("mousemove", handleMouseMove)
                document.addEventListener("mouseup", handleMouseUp)
                document.body.style.cursor = "col-resize"
                e.preventDefault()
              }}
            >
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 w-4 h-12 flex items-center justify-center">
                <div className="h-8 w-1 rounded-full bg-blue-700"></div>
              </div>
            </div>
          )}

          {/* Right Panel - Code Editor and File Tree */}
          {!expandedChat && (
            <div
              className="flex flex-col md:flex-row overflow-hidden min-w-0 animate-fade-in code-section-container"
              style={{ width: isMobile ? "100%" : `${100 - chatSectionWidth}%`, height: isMobile ? "50%" : "100%" }}
            >
              {/* File Tree - On medium screens and up, this is side by side with code editor */}
              {fileTreeVisible && (
                <div
                  className={`h-2/5 md:h-full flex-shrink-0 overflow-hidden transition-all duration-300 ease-in-out animate-slide-right`}
                  style={{ width: isMobile ? "100%" : `${fileTreeWidthPercent}%` }}
                >
                  <div className="h-full flex flex-col">
                    <div className="bg-blue-950/30 px-4 sm:px-6 py-3 sm:py-4 border-b border-blue-800/50 flex items-center">
                      <div className="flex items-center">
                        <FileCode className="h-4 w-4 sm:h-5 sm:w-5 text-neon-blue mr-2 sm:mr-3" />
                        <h2 className="text-sm sm:text-base font-bold text-neon-blue truncate">Project Files</h2>
                      </div>
                      <div className="ml-auto flex items-center space-x-2">
                        {/* File actions dropdown */}
                        <div className="relative" ref={fileMenuRef}>
                          <button
                            className="p-1 sm:p-2 rounded-lg hover:bg-blue-800/30 text-blue-400 hover:text-neon-blue transition-colors duration-200 ease-out flex items-center"
                            onClick={() => setFileMenuOpen(!fileMenuOpen)}
                            aria-label="File actions"
                          >
                            <Plus size={16} className="mr-1" />
                            <ChevronDown size={14} />
                          </button>

                          {fileMenuOpen && (
                            <div className="absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-blue-900/90 ring-1 ring-blue-800 z-10 animate-slide-down">
                              <div className="py-1">
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-blue-200 hover:bg-blue-800/50 flex items-center"
                                  onClick={() => {
                                    setFileDialog({ type: "newFile", parentId: getRootFolder() })
                                    setFileMenuOpen(false)
                                  }}
                                >
                                  <FilePlus className="h-4 w-4 mr-2 text-neon-blue" />
                                  New File
                                </button>
                                <button
                                  className="w-full text-left px-4 py-2 text-sm text-blue-200 hover:bg-blue-800/50 flex items-center"
                                  onClick={() => {
                                    setFileDialog({ type: "newFolder", parentId: getRootFolder() })
                                    setFileMenuOpen(false)
                                  }}
                                >
                                  <FolderPlus className="h-4 w-4 mr-2 text-neon-blue" />
                                  New Folder
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          className="p-1 sm:p-2 rounded-lg hover:bg-blue-800/30 text-blue-400 hover:text-neon-blue transition-colors duration-200 ease-out"
                          onClick={toggleFileTree}
                          aria-label="Minimize file tree"
                        >
                          <Minimize size={16} />
                        </button>
                      </div>
                    </div>
                    <FileTree
                      fileStructure={mockFileStructure}
                      selectedFile={selectedFile}
                      onSelectFile={handleSelectFile}
                    />
                  </div>
                </div>
              )}

              {/* Resizable splitter for desktop */}
              {!isMobile && fileTreeVisible && (
                <div
                  className="w-1 hover:w-1.5 bg-blue-800/30 hover:bg-neon-blue cursor-col-resize transition-all duration-200 ease-out relative"
                  onMouseDown={(e) => {
                    const startX = e.clientX
                    const startWidth = fileTreeWidthPercent

                    const handleMouseMove = (moveEvent: MouseEvent) => {
                      const containerWidth = document.querySelector(".code-section-container")?.clientWidth || 100
                      const deltaX = moveEvent.clientX - startX
                      const newWidthPercent = Math.max(10, Math.min(50, startWidth + (deltaX / containerWidth) * 100))
                      handleFileTreeResize(newWidthPercent)
                    }

                    const handleMouseUp = () => {
                      document.removeEventListener("mousemove", handleMouseMove)
                      document.removeEventListener("mouseup", handleMouseUp)
                      document.body.style.cursor = "default"
                    }

                    document.addEventListener("mousemove", handleMouseMove)
                    document.addEventListener("mouseup", handleMouseUp)
                    document.body.style.cursor = "col-resize"
                    e.preventDefault()
                  }}
                >
                  <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 w-4 h-12 flex items-center justify-center">
                    <div className="h-8 w-1 rounded-full bg-blue-700"></div>
                  </div>
                </div>
              )}

              {/* Code Editor */}
              <div
                className={`h-3/5 md:h-full flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
                  fileTreeVisible ? "" : "animate-expand-left"
                }`}
                style={{ width: isMobile ? "100%" : fileTreeVisible ? `${100 - fileTreeWidthPercent}%` : "100%" }}
              >
                <div className="bg-blue-950/30 px-4 sm:px-6 py-3 sm:py-4 border-b border-blue-800/50 flex items-center">
                  <div className="flex items-center">
                    <Code className="h-4 w-4 sm:h-5 sm:w-5 text-neon-blue mr-2 sm:mr-3" />
                    <h2 className="text-sm sm:text-base font-bold text-neon-blue truncate">Code Editor</h2>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <div className="hidden md:flex items-center mr-4">
                      <Zap className="h-4 w-4 text-neon-pink mr-2" />
                      <span className="text-xs text-neon-pink">Auto-generating</span>
                    </div>

                    {/* Always visible action button - click to toggle dropdown */}
                    <div className="relative code-menu-container">
                      <button
                        onClick={() => setCodeMenuOpen(!codeMenuOpen)}
                        className="p-1.5 rounded-md bg-blue-900/30 hover:bg-blue-800/50 text-blue-400 hover:text-neon-blue transition-colors duration-200"
                        aria-label="Code actions"
                        title="Code actions"
                      >
                        <Settings className="h-3.5 w-3.5" />
                      </button>

                      {/* Dropdown menu */}
                      {codeMenuOpen && (
                        <div className="absolute right-0 top-full mt-1 w-auto min-w-[160px] rounded-md shadow-lg bg-blue-900/90 ring-1 ring-blue-800 z-50 animate-slide-down">
                          <div className="py-1">
                            <button
                              onClick={() => {
                                handleCopy()
                                setCodeMenuOpen(false)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-blue-200 hover:bg-blue-800/50 flex items-center"
                            >
                              {copied ? <Check className="h-3.5 w-3.5 mr-2" /> : <Copy className="h-3.5 w-3.5 mr-2" />}
                              Copy Code
                            </button>
                            <button
                              onClick={() => {
                                handleDownload()
                                setCodeMenuOpen(false)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-blue-200 hover:bg-blue-800/50 flex items-center"
                            >
                              <Download className="h-3.5 w-3.5 mr-2" />
                              Download
                            </button>
                            <button
                              onClick={() => {
                                handleRun()
                                setCodeMenuOpen(false)
                              }}
                              disabled={isRunning}
                              className={`w-full text-left px-4 py-2 text-sm text-blue-200 hover:bg-blue-800/50 flex items-center ${
                                isRunning ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              {isRunning ? (
                                <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                              ) : (
                                <Play className="h-3.5 w-3.5 mr-2" />
                              )}
                              {isRunning ? "Running..." : "Run Code"}
                            </button>
                            {!fileTreeVisible && (
                              <button
                                onClick={() => {
                                  toggleFileTree()
                                  setCodeMenuOpen(false)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-blue-200 hover:bg-blue-800/50 flex items-center"
                              >
                                <PanelLeft className="h-3.5 w-3.5 mr-2" />
                                Show File Tree
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Keep the individual buttons for larger screens */}
                    <div className="hidden md:flex items-center space-x-2">
                      <button
                        onClick={handleCopy}
                        className="p-1.5 rounded-md bg-blue-900/30 hover:bg-blue-800/50 text-blue-400 hover:text-neon-pink transition-colors duration-200"
                        title="Copy code"
                        aria-label="Copy code"
                      >
                        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                      <button
                        onClick={handleDownload}
                        className="p-1.5 rounded-md bg-blue-900/30 hover:bg-blue-800/50 text-blue-400 hover:text-neon-blue transition-colors duration-200"
                        title="Download code"
                        aria-label="Download code"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={handleRun}
                        disabled={isRunning}
                        className={`p-1.5 rounded-md ${
                          isRunning
                            ? "bg-blue-900/20 text-blue-600 cursor-not-allowed"
                            : "bg-blue-900/30 hover:bg-blue-800/50 text-blue-400 hover:text-neon-green transition-colors duration-200"
                        }`}
                        title="Run code"
                        aria-label="Run code"
                      >
                        {isRunning ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Play className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    {!fileTreeVisible && (
                      <button
                        className="hidden md:block p-1.5 rounded-md hover:bg-blue-800/30 text-blue-400 hover:text-neon-blue transition-colors duration-200"
                        onClick={toggleFileTree}
                        aria-label="Show file tree"
                      >
                        <PanelLeft className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <button
                      className="p-1.5 rounded-md hover:bg-blue-800/30 text-blue-400 hover:text-neon-blue transition-colors duration-200"
                      onClick={() => setCommandPaletteOpen(true)}
                      aria-label="Open command palette"
                    >
                      <Command className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <CodeEditor initialCode={currentCode} language={currentLanguage} selectedFile={selectedFile} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
