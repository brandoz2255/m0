"use client"

import { useState, useEffect } from "react"
import { Settings } from "lucide-react"
import dynamic from "next/dynamic"
import * as monacoEditor from "monaco-editor/esm/vs/editor/editor.api"
import "monaco-editor/esm/vs/language/typescript/monaco.contribution"
import "monaco-editor/esm/vs/basic-languages/typescript/typescript.contribution"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false })



export default function CodeEditor({
  initialCode = "",
  language = "typescript",
}: {
  initialCode?: string
  language?: string
}) {
  const [code, setCode] = useState(initialCode)
  const [isMobile, setIsMobile] = useState(false)
  const [output, setOutput] = useState<string | null>(null)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640)
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])


  const handleBeforeMount = (monaco: typeof monacoEditor) => {
    monaco.editor.defineTheme("custom-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [
        { token: "comment", foreground: "64748b", fontStyle: "italic" },
        { token: "keyword", foreground: "7dd3fc", fontStyle: "bold" },
        { token: "identifier", foreground: "f472b6" },
        { token: "string", foreground: "4ade80" },
        { token: "number", foreground: "facc15" },
        { token: "type.identifier", foreground: "818cf8" },
        { token: "function", foreground: "38bdf8" },
      ],
      colors: {
        "editor.background": "#0f172a",
        "editor.foreground": "#cbd5e1",
        "editorLineNumber.foreground": "#475569",
        "editorCursor.foreground": "#f472b6",
        "editor.lineHighlightBackground": "#1e293b",
        "editorIndentGuide.background": "#1e293b",
        "editorIndentGuide.activeBackground": "#334155",
      },
    })
    monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
      target: monacoEditor.languages.typescript.ScriptTarget.ESNext,
      allowNonTsExtensions: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
    });
  }



  // // ✅ Theme + language setup happens before Monaco renders
  // const handleBeforeMount = (monaco: typeof import("monaco-editor")) => {
  //   monaco.editor.defineTheme("custom-dark", {
  //     base: "vs-dark",
  //     inherit: true,
  //     rules: [
  //       { token: "comment", foreground: "64748b", fontStyle: "italic" },
  //       { token: "keyword", foreground: "7dd3fc", fontStyle: "bold" },
  //       { token: "identifier", foreground: "f472b6" },
  //       { token: "string", foreground: "4ade80" },
  //       { token: "number", foreground: "facc15" },
  //       { token: "type.identifier", foreground: "818cf8" },
  //       { token: "function", foreground: "38bdf8" },
  //     ],
  //     colors: {
  //       "editor.background": "#0f172a",
  //       "editor.foreground": "#cbd5e1",
  //       "editorLineNumber.foreground": "#475569",
  //       "editorCursor.foreground": "#f472b6",
  //       "editor.lineHighlightBackground": "#1e293b",
  //       "editorIndentGuide.background": "#1e293b",
  //       "editorIndentGuide.activeBackground": "#334155",
  //     },
  //   })
  // }

  return (
    <div className="h-full w-full flex flex-col bg-blue-950 text-white">
      {isMobile && (
        <div className="flex justify-between items-center px-3 py-2 bg-blue-900 border-b border-blue-800">
          <span className="text-xs text-blue-300">{language.toUpperCase()}</span>
          <span className="text-xs text-blue-400">{code.split("\n").length} lines</span>
        </div>
      )}

      <div className="flex-1 min-h-0">
        <MonacoEditor
          language="typescript"
          height="100%"
          // language={language}
          value={code}
          beforeMount={handleBeforeMount}
          theme="custom-dark"
          onChange={(value) => setCode(value ?? "")}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            wordWrap: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            lineNumbers: "on",
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>

      {output && (
        <div className="p-4 text-green-400 text-sm border-t border-blue-800 bg-blue-900">
          Output: {output}
        </div>
      )}
    </div>
  )
}

