import { LayoutDashboard, Code, FileCode, Settings, BookOpen, History, Users, Zap } from "lucide-react"
import Link from "next/link"

export default function Sidebar() {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/", shortcut: "" },
    { icon: <Code size={20} />, label: "Code Gen", href: "/code", shortcut: "⌘E" },
    { icon: <FileCode size={20} />, label: "Projects", href: "/projects", shortcut: "⌘B" },
    { icon: <BookOpen size={20} />, label: "Docs", href: "/docs", shortcut: "" },
    { icon: <History size={20} />, label: "History", href: "/history", shortcut: "" },
    { icon: <Users size={20} />, label: "Team", href: "/team", shortcut: "" },
    { icon: <Zap size={20} />, label: "Models", href: "/models", shortcut: "" },
    { icon: <Settings size={20} />, label: "Settings", href: "/settings", shortcut: "" },
  ]

  return (
    <>
      <div className="w-12 h-12 bg-gradient-to-br from-neon-blue to-neon-pink rounded-xl flex items-center justify-center mb-8 shadow-glow-blue">
        <Code size={24} className="text-white" />
      </div>

      <nav className="flex-1 w-full" aria-label="Main navigation">
        <ul className="space-y-6">
          {menuItems.map((item, index) => (
            <li key={index} className="flex justify-center">
              <Link
                href={item.href}
                className="flex flex-col items-center text-blue-400 hover:text-neon-blue transition-colors duration-200 ease-out p-2 group"
                aria-label={item.label}
              >
                <div className="p-2 rounded-lg group-hover:bg-blue-900/30 transition-colors duration-200 ease-out group-hover:shadow-glow-blue">
                  {item.icon}
                </div>
                <span className="text-xs mt-1">{item.label}</span>
                {item.shortcut && <span className="text-[10px] text-blue-500 mt-0.5">{item.shortcut}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-900/50 flex items-center justify-center text-neon-blue border border-blue-800/50">
          AI
        </div>
      </div>
    </>
  )
}
