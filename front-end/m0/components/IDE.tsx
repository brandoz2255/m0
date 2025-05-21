"use client"

import { useState } from "react"
import FileTree from "@/components/file-tree"
import CodeEditor from "@/components/code-editor"

// ✅ Mock file content
const fileContentMap: Record<string, string> = {
  "app.tsx": `import React from "react"\n\nexport default function App() {\n  return <div>Hello World</div>\n}`,
  "utils.ts": `export function add(a: number, b: number) {\n  return a + b;\n}`,
  "index.json": `{\n  "name": "project",\n  "version": "1.0.0"\n}`,
}

const mockFileTree = [
  {
    id: "root",
    name: "src",
    type: "folder",
    children: [
      { id: "app.tsx", name: "app.tsx", type: "file", icon: "tsx", gitStatus: "modified" },
      { id: "utils.ts", name: "utils.ts", type: "file", icon: "ts", gitStatus: "untracked" },
      { id: "index.json", name: "index.json", type: "file", icon: "json", gitStatus: "staged" },
    ],
  },
]

export default function IDE() {
  const [selectedFile, setSelectedFile] = useState<string | null>("app.tsx")

  const currentContent = selectedFile ? fileContentMap[selectedFile] || "// Empty file" : ""

  return (
    <div className="h-screen w-screen flex bg-blue-950 text-white">
      {/* FileTree Panel */}
      <div className="w-64 border-r border-blue-800 overflow-auto">
        <FileTree
          fileStructure={mockFileTree}
          selectedFile={selectedFile}
          onSelectFile={setSelectedFile}
        />
      </div>

      {/* Code Editor Panel */}
      <div className="flex-1 min-w-0">
        <CodeEditor
          initialCode={currentContent}
          language="typescript"
        />
      </div>
    </div>
  )
}

