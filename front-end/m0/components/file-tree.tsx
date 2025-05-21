"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Folder,
  FileCode,
  ChevronRight,
  ChevronDown,
  FileJson,
  FileText,
  ImageIcon,
  FileCog,
  FileType,
  GitBranch,
  Edit,
  Trash2,
  Copy,
  FolderPlus,
  FilePlus,
} from "lucide-react"

type FileNode = {
  id: string
  name: string
  type: "file" | "folder"
  icon?: string
  children?: FileNode[]
  isGenerated?: boolean
  timestamp?: string
  gitStatus?: "modified" | "untracked" | "deleted" | "staged" | null
}

interface FileTreeProps {
  fileStructure: FileNode[]
  selectedFile: string | null
  onSelectFile: (id: string) => void
}

type FileNodeProps = {
  node: FileNode
  level: number
  selectedFile: string | null
  onSelectFile: (id: string) => void
  onContextMenu: (e: React.MouseEvent, node: FileNode) => void
}

type ContextMenuProps = {
  x: number
  y: number
  node: FileNode | null
  onClose: () => void
  onAction: (action: string, node: FileNode) => void
}

function FileNode({ node, level, selectedFile, onSelectFile, onContextMenu }: FileNodeProps) {
  const [isOpen, setIsOpen] = useState(level === 0)
  const isSelected = selectedFile === node.id

  const toggleOpen = (e: React.MouseEvent) => {
    if (node.type === "folder") {
      setIsOpen(!isOpen)
      e.stopPropagation()
    }
  }

  const handleClick = () => {
    if (node.type === "file") {
      onSelectFile(node.id)

      // TODO: integrate with backend
      // const loadFileContent = async (fileId: string) => {
      //   const response = await fetch(`/api/file/${fileId}`);
      //   const data = await response.json();
      //   return data.content;
      // }
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    onContextMenu(e, node)
  }

  const getFileIcon = () => {
    if (node.type === "folder") {
      return isOpen ? (
        <ChevronDown className="h-4 w-4 text-neon-blue mr-1" />
      ) : (
        <ChevronRight className="h-4 w-4 text-neon-blue mr-1" />
      )
    }

    switch (node.icon) {
      case "tsx":
      case "jsx":
        return <FileCode className="h-4 w-4 text-neon-blue ml-5 mr-2" />
      case "ts":
      case "js":
        return <FileType className="h-4 w-4 text-blue-400 ml-5 mr-2" />
      case "json":
        return <FileJson className="h-4 w-4 text-neon-pink ml-5 mr-2" />
      case "image":
        return <ImageIcon className="h-4 w-4 text-neon-green ml-5 mr-2" />
      case "config":
        return <FileCog className="h-4 w-4 text-yellow-400 ml-5 mr-2" />
      default:
        return <FileText className="h-4 w-4 text-blue-400 ml-5 mr-2" />
    }
  }

  const getGitStatusBadge = () => {
    if (!node.gitStatus) return null

    let badgeText = ""
    let badgeClass = ""

    switch (node.gitStatus) {
      case "modified":
        badgeText = "M"
        badgeClass = "bg-yellow-600 text-yellow-100"
        break
      case "untracked":
        badgeText = "U"
        badgeClass = "bg-blue-600 text-blue-100"
        break
      case "deleted":
        badgeText = "D"
        badgeClass = "bg-red-600 text-red-100"
        break
      case "staged":
        badgeText = "S"
        badgeClass = "bg-green-600 text-green-100"
        break
    }

    return (
      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${badgeClass} flex items-center justify-center`}>
        {badgeText}
      </span>
    )
  }

  return (
    <div>
      <div
        className={`flex items-center py-1 px-2 hover:bg-blue-800/20 rounded-lg cursor-pointer group transition-colors duration-200 ease-out ${
          isSelected ? "bg-blue-800/30 text-neon-blue shadow-glow-blue" : ""
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
      >
        <span className="flex items-center" onClick={toggleOpen}>
          {getFileIcon()}
          {node.type === "folder" && <Folder className="h-4 w-4 text-neon-blue mr-2" />}
        </span>
        <span
          className={`text-sm group-hover:text-neon-blue transition-colors duration-200 ease-out ${
            isSelected ? "text-neon-blue" : node.isGenerated ? "text-neon-pink" : ""
          }`}
        >
          {node.name}
        </span>

        {node.isGenerated && <span className="ml-2 text-xs text-blue-400">{node.timestamp}</span>}
        {getGitStatusBadge()}
      </div>

      {isOpen && node.children && (
        <div className="animate-slide-down">
          {node.children.map((child) => (
            <FileNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedFile={selectedFile}
              onSelectFile={onSelectFile}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ContextMenu({ x, y, node, onClose, onAction }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [onClose])

  if (!node) return null

  // Adjust position if menu would go off screen
  const adjustedX = Math.min(x, window.innerWidth - 200) // 200px is approximate menu width
  const adjustedY = Math.min(y, window.innerHeight - 300) // 300px is approximate max menu height

  const isFolder = node.type === "folder"

  return (
    <div
      ref={menuRef}
      className="fixed z-50 bg-blue-900/95 border border-blue-800 rounded-md shadow-lg backdrop-blur-sm animate-scale-in"
      style={{ left: adjustedX, top: adjustedY }}
    >
      <div className="py-1 min-w-[180px]">
        {isFolder && (
          <>
            <button
              className="w-full text-left px-4 py-2 text-sm text-blue-200 hover:bg-blue-800/50 flex items-center"
              onClick={() => onAction("newFile", node)}
            >
              <FilePlus className="h-4 w-4 mr-2 text-neon-blue" />
              New File
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-blue-200 hover:bg-blue-800/50 flex items-center"
              onClick={() => onAction("newFolder", node)}
            >
              <FolderPlus className="h-4 w-4 mr-2 text-neon-blue" />
              New Folder
            </button>
            <div className="border-t border-blue-800 my-1"></div>
          </>
        )}
        <button
          className="w-full text-left px-4 py-2 text-sm text-blue-200 hover:bg-blue-800/50 flex items-center"
          onClick={() => onAction("rename", node)}
        >
          <Edit className="h-4 w-4 mr-2 text-neon-green" />
          Rename
        </button>
        <button
          className="w-full text-left px-4 py-2 text-sm text-blue-200 hover:bg-blue-800/50 flex items-center"
          onClick={() => onAction("duplicate", node)}
        >
          <Copy className="h-4 w-4 mr-2 text-neon-blue" />
          Duplicate
        </button>
        <div className="border-t border-blue-800 my-1"></div>
        <button
          className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-900/30 flex items-center"
          onClick={() => onAction("delete", node)}
        >
          <Trash2 className="h-4 w-4 mr-2 text-red-400" />
          Delete
        </button>
      </div>
    </div>
  )
}

function FileActionDialog({
  isOpen,
  onClose,
  title,
  placeholder,
  initialValue = "",
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  placeholder: string
  initialValue?: string
  onSubmit: (value: string) => void
}) {
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
      // If it's a rename operation, select the name without the extension
      if (initialValue) {
        const lastDotIndex = initialValue.lastIndexOf(".")
        if (lastDotIndex > 0) {
          inputRef.current.setSelectionRange(0, lastDotIndex)
        } else {
          inputRef.current.select()
        }
      }
    }
    setValue(initialValue)
  }, [isOpen, initialValue])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (value.trim()) {
      onSubmit(value.trim())
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-blue-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-blue-900/90 border border-blue-800 rounded-lg shadow-lg w-full max-w-md overflow-hidden animate-scale-in">
        <div className="p-4 border-b border-blue-800">
          <h3 className="text-lg font-medium text-neon-blue">{title}</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="p-4">
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={placeholder}
              className="w-full bg-blue-950/50 border border-blue-800 rounded-md px-3 py-2 text-blue-100 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-neon-blue"
            />
          </div>
          <div className="flex justify-end space-x-2 p-4 border-t border-blue-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-blue-950/50 text-blue-300 rounded-md hover:bg-blue-800/50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-neon-blue/20 text-neon-blue rounded-md hover:bg-neon-blue/30 transition-colors"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Add TODO comment for backend integration
export default function FileTree({ fileStructure, selectedFile, onSelectFile }: FileTreeProps) {
  // TODO: BACKEND INTEGRATION POINT
  // In a real app, fetch the file tree from your backend
  // Example:
  // const [files, setFiles] = useState<FileNode[]>([]);
  //
  // useEffect(() => {
  //   const fetchFileTree = async () => {
  //     try {
  //       const response = await fetch('/api/files/tree');
  //       const data = await response.json();
  //       setFiles(data);
  //     } catch (error) {
  //       console.error('Error fetching file tree:', error);
  //     }
  //   };
  //
  //   fetchFileTree();
  // }, []);

  const [files, setFiles] = useState<FileNode[]>(fileStructure)

  useEffect(() => {
    setFiles(fileStructure)
  }, [fileStructure])

  const [contextMenu, setContextMenu] = useState<{
    x: number
    y: number
    node: FileNode | null
  } | null>(null)
  const [dialog, setDialog] = useState<{
    type: "newFile" | "newFolder" | "rename" | null
    node: FileNode | null
  }>({ type: null, node: null })
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false)
  const headerMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setFiles(fileStructure)
  }, [fileStructure])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(event.target as Node)) {
        setHeaderMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleContextMenu = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault()
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      node,
    })
  }

  const handleContextMenuAction = (action: string, node: FileNode) => {
    setContextMenu(null)

    switch (action) {
      case "newFile":
        setDialog({ type: "newFile", node })
        break
      case "newFolder":
        setDialog({ type: "newFolder", node })
        break
      case "rename":
        setDialog({ type: "rename", node })
        break
      case "duplicate":
        handleDuplicate(node)
        break
      case "delete":
        handleDelete(node)
        break
      default:
        break
    }
  }

  const handleNewFile = (parentNode: FileNode, fileName: string) => {
    // TODO: BACKEND INTEGRATION POINT
    // In a real app, create a new file in your backend
    // Example:
    // const createFile = async (parentId: string, fileName: string) => {
    //   const response = await fetch('/api/files', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ parentId, name: fileName, type: 'file' })
    //   });
    //   const newFile = await response.json();
    //   updateFileTree();
    // }
    // createFile(parentNode.id, fileName);

    // For now, update the state directly
    const newFileId = `new-${Date.now()}`
    const fileExtension = fileName.includes(".") ? "" : ".tsx" // Default to .tsx if no extension
    const newFileName = fileName.includes(".") ? fileName : `${fileName}${fileExtension}`

    // Determine icon based on file extension
    const extension = newFileName.split(".").pop() || ""
    let icon = "text"
    if (["tsx", "jsx", "ts", "js"].includes(extension)) {
      icon = extension
    } else if (["json"].includes(extension)) {
      icon = "json"
    } else if (["png", "jpg", "jpeg", "gif", "svg"].includes(extension)) {
      icon = "image"
    }

    const newFile: FileNode = {
      id: newFileId,
      name: newFileName,
      type: "file",
      icon,
      isGenerated: false,
      gitStatus: "untracked",
    }

    updateFileTreeWithNewNode(files, parentNode.id, newFile)
  }

  const handleNewFolder = (parentNode: FileNode, folderName: string) => {
    // TODO: BACKEND INTEGRATION POINT
    // In a real app, create a new folder in your backend
    // Example:
    // const createFolder = async (parentId: string, folderName: string) => {
    //   const response = await fetch('/api/folders', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ parentId, name: folderName })
    //   });
    //   const newFolder = await response.json();
    //   updateFileTree();
    // }
    // createFolder(parentNode.id, folderName);

    // For now, update the state directly
    const newFolderId = `folder-${Date.now()}`
    const newFolder: FileNode = {
      id: newFolderId,
      name: folderName,
      type: "folder",
      children: [],
      isGenerated: false,
      gitStatus: "untracked",
    }

    updateFileTreeWithNewNode(files, parentNode.id, newFolder)
  }

  const handleRename = (node: FileNode, newName: string) => {
    // TODO: BACKEND INTEGRATION POINT
    // In a real app, rename the file/folder in your backend
    // Example:
    // const renameNode = async (nodeId: string, newName: string) => {
    //   const response = await fetch(`/api/files/${nodeId}`, {
    //     method: 'PATCH',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify({ name: newName })
    //   });
    //   const updatedNode = await response.json();
    //   updateFileTree();
    // }
    // renameNode(node.id, newName);

    // For now, update the state directly
    const updatedFiles = [...files]
    renameNodeInTree(updatedFiles, node.id, newName)
    setFiles(updatedFiles)
  }

  const handleDuplicate = (node: FileNode) => {
    // TODO: BACKEND INTEGRATION POINT
    // In a real app, duplicate the file/folder in your backend
    // Example:
    // const duplicateNode = async (nodeId: string) => {
    //   const response = await fetch(`/api/files/${nodeId}/duplicate`, {
    //     method: 'POST'
    //   });
    //   const duplicatedNode = await response.json();
    //   updateFileTree();
    // }
    // duplicateNode(node.id);

    // For now, update the state directly
    const duplicateId = `${node.id}-copy-${Date.now()}`
    const duplicateName = `${node.name} (copy)`

    const duplicateNode: FileNode = {
      ...JSON.parse(JSON.stringify(node)), // Deep clone
      id: duplicateId,
      name: duplicateName,
      gitStatus: "untracked",
    }

    // Find parent node
    const parentNode = findParentNode(files, node.id)
    if (parentNode) {
      updateFileTreeWithNewNode(files, parentNode.id, duplicateNode)
    } else {
      // If no parent found, it's a top-level node
      setFiles([...files, duplicateNode])
    }
  }

  const handleDelete = (node: FileNode) => {
    // TODO: BACKEND INTEGRATION POINT
    // In a real app, delete the file/folder in your backend
    // Example:
    // const deleteNode = async (nodeId: string) => {
    //   await fetch(`/api/files/${nodeId}`, {
    //     method: 'DELETE'
    //   });
    //   updateFileTree();
    // }
    // deleteNode(node.id);

    // For now, update the state directly
    const updatedFiles = [...files]
    deleteNodeFromTree(updatedFiles, node.id)
    setFiles(updatedFiles)
  }

  const updateFileTreeWithNewNode = (tree: FileNode[], parentId: string, newNode: FileNode) => {
    const updatedTree = [...tree]

    const addNodeToParent = (nodes: FileNode[], id: string, newNode: FileNode): boolean => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === id) {
          if (nodes[i].type === "folder") {
            if (!nodes[i].children) {
              nodes[i].children = []
            }
            nodes[i].children.push(newNode)
            return true
          }
          return false
        }

        if (nodes[i].children) {
          if (addNodeToParent(nodes[i].children, id, newNode)) {
            return true
          }
        }
      }
      return false
    }

    if (addNodeToParent(updatedTree, parentId, newNode)) {
      setFiles(updatedTree)
    }
  }

  const renameNodeInTree = (tree: FileNode[], nodeId: string, newName: string) => {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].id === nodeId) {
        tree[i].name = newName
        // Update icon if file extension changed
        if (tree[i].type === "file") {
          const extension = newName.split(".").pop() || ""
          if (["tsx", "jsx", "ts", "js"].includes(extension)) {
            tree[i].icon = extension
          } else if (["json"].includes(extension)) {
            tree[i].icon = "json"
          } else if (["png", "jpg", "jpeg", "gif", "svg"].includes(extension)) {
            tree[i].icon = "image"
          }
        }
        return true
      }

      if (tree[i].children) {
        if (renameNodeInTree(tree[i].children, nodeId, newName)) {
          return true
        }
      }
    }
    return false
  }

  const deleteNodeFromTree = (tree: FileNode[], nodeId: string) => {
    for (let i = 0; i < tree.length; i++) {
      if (tree[i].id === nodeId) {
        tree.splice(i, 1)
        return true
      }

      if (tree[i].children) {
        if (deleteNodeFromTree(tree[i].children, nodeId)) {
          return true
        }
      }
    }
    return false
  }

  const findParentNode = (tree: FileNode[], nodeId: string): FileNode | null => {
    for (const node of tree) {
      if (node.children) {
        for (const child of node.children) {
          if (child.id === nodeId) {
            return node
          }
        }

        const result = findParentNode(node.children, nodeId)
        if (result) {
          return result
        }
      }
    }
    return null
  }

  const handleDialogSubmit = (value: string) => {
    if (!dialog.node || !dialog.type) return

    switch (dialog.type) {
      case "newFile":
        handleNewFile(dialog.node, value)
        break
      case "newFolder":
        handleNewFolder(dialog.node, value)
        break
      case "rename":
        handleRename(dialog.node, value)
        break
      default:
        break
    }
  }

  const handleHeaderMenuAction = (action: string) => {
    setHeaderMenuOpen(false)

    // Find the root folder (first folder in the tree)
    const rootFolder = files.find((node) => node.type === "folder")

    if (!rootFolder) return

    switch (action) {
      case "newFile":
        setDialog({ type: "newFile", node: rootFolder })
        break
      case "newFolder":
        setDialog({ type: "newFolder", node: rootFolder })
        break
      default:
        break
    }
  }

  return (
    <div
      className="h-full overflow-auto p-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#1e2650] bg-gradient-to-b from-blue-950/20 to-blue-950/10"
      id="file-tree"
      tabIndex={-1}
      aria-label="Project file tree"
    >
      <div className="flex items-center mb-3 px-2 py-1 text-xs text-blue-400 border-b border-blue-800/50">
        <GitBranch className="h-3 w-3 mr-1.5" />
        <span>main</span>
        <div className="ml-auto flex items-center space-x-1">
          <span className="px-1.5 py-0.5 rounded-full bg-yellow-600 text-yellow-100 text-xs">M</span>
          <span className="px-1.5 py-0.5 rounded-full bg-blue-600 text-blue-100 text-xs">U</span>
          <span className="px-1.5 py-0.5 rounded-full bg-green-600 text-green-100 text-xs">S</span>
        </div>
      </div>
      {files.map((node) => (
        <FileNode
          key={node.id}
          node={node}
          level={0}
          selectedFile={selectedFile}
          onSelectFile={onSelectFile}
          onContextMenu={handleContextMenu}
        />
      ))}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          node={contextMenu.node}
          onClose={() => setContextMenu(null)}
          onAction={handleContextMenuAction}
        />
      )}

      {/* Dialog for new file/folder/rename */}
      <FileActionDialog
        isOpen={dialog.type !== null}
        onClose={() => setDialog({ type: null, node: null })}
        title={
          dialog.type === "newFile" ? "Create New File" : dialog.type === "newFolder" ? "Create New Folder" : "Rename"
        }
        placeholder={
          dialog.type === "newFile"
            ? "Enter file name (e.g. component.tsx)"
            : dialog.type === "newFolder"
              ? "Enter folder name"
              : "Enter new name"
        }
        initialValue={dialog.type === "rename" && dialog.node ? dialog.node.name : ""}
        onSubmit={handleDialogSubmit}
      />
    </div>
  )
}
