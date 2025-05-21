"use client"

// Mock file structure with newer AI-generated files
export const mockFileStructure = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      {
        id: "2",
        name: "components",
        type: "folder",
        children: [
          { id: "3", name: "Button.tsx", type: "file", icon: "tsx", isGenerated: false },
          { id: "4", name: "Card.tsx", type: "file", icon: "tsx", isGenerated: false },
          { id: "5", name: "Input.tsx", type: "file", icon: "tsx", isGenerated: false, gitStatus: "modified" },
          {
            id: "21",
            name: "DataFetcher.tsx",
            type: "file",
            icon: "tsx",
            isGenerated: true,
            timestamp: "Just now",
            gitStatus: "untracked",
          },
          {
            id: "22",
            name: "Counter.tsx",
            type: "file",
            icon: "tsx",
            isGenerated: true,
            timestamp: "5 min ago",
            gitStatus: "staged",
          },
        ],
      },
      {
        id: "6",
        name: "pages",
        type: "folder",
        children: [
          { id: "7", name: "index.tsx", type: "file", icon: "tsx", isGenerated: false },
          { id: "8", name: "about.tsx", type: "file", icon: "tsx", isGenerated: false, gitStatus: "modified" },
          {
            id: "23",
            name: "dashboard.tsx",
            type: "file",
            icon: "tsx",
            isGenerated: true,
            timestamp: "10 min ago",
            gitStatus: "untracked",
          },
        ],
      },
      {
        id: "24",
        name: "hooks",
        type: "folder",
        children: [
          {
            id: "25",
            name: "useData.ts",
            type: "file",
            icon: "ts",
            isGenerated: true,
            timestamp: "15 min ago",
            gitStatus: "staged",
          },
          { id: "26", name: "useAuth.ts", type: "file", icon: "ts", isGenerated: true, timestamp: "15 min ago" },
        ],
      },
      { id: "9", name: "App.tsx", type: "file", icon: "tsx", isGenerated: false },
      { id: "10", name: "index.tsx", type: "file", icon: "tsx", isGenerated: false, gitStatus: "modified" },
    ],
  },
  {
    id: "11",
    name: "public",
    type: "folder",
    children: [
      { id: "12", name: "favicon.ico", type: "file", icon: "image", isGenerated: false },
      { id: "13", name: "robots.txt", type: "file", icon: "text", isGenerated: false },
    ],
  },
  { id: "14", name: "package.json", type: "file", icon: "json", isGenerated: false, gitStatus: "modified" },
  { id: "15", name: "tsconfig.json", type: "file", icon: "json", isGenerated: false },
  { id: "16", name: "README.md", type: "file", icon: "text", isGenerated: false },
  {
    id: "27",
    name: "ai-config.json",
    type: "file",
    icon: "json",
    isGenerated: true,
    timestamp: "20 min ago",
    gitStatus: "untracked",
  },
]

// Mock file contents for different files
export const mockFileContents: Record<string, { content: string; language: string }> = {
  "21": {
    language: "tsx",
    content: `// AI-generated React component
import { useState, useEffect } from 'react';

// This is a React component that fetches data from an API
function DataFetcher({ endpoint }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API call would happen here
    // In a real implementation, this would connect to your backend
    async function fetchData() {
      try {
        const response = await fetch(endpoint);
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    }

    fetchData();
  }, [endpoint]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div className="data-container">
      {/* Render your data here */}
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default DataFetcher;

// INTEGRATION POINT: Add your API endpoint configuration below
// const API_ENDPOINT = 'https://api.example.com/data';`,
  },
  "22": {
    language: "tsx",
    content: `import React, { useState } from 'react';

// A simple counter component with increment and decrement
function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4 bg-blue-100 rounded-lg">
      <h2 className="text-xl font-bold mb-2">Counter: {count}</h2>
      <div className="flex space-x-2">
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setCount(count + 1)}
        >
          Increment
        </button>
        <button 
          className="px-4 py-2 bg-red-500 text-white rounded"
          onClick={() => setCount(count - 1)}
        >
          Decrement
        </button>
      </div>
    </div>
  );
}

export default Counter;`,
  },
  "23": {
    language: "tsx",
    content: `import React from 'react';
import DataFetcher from '../components/DataFetcher';
import Counter from '../components/Counter';

// Dashboard page that uses multiple components
export default function Dashboard() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">User Stats</h2>
          <DataFetcher endpoint="/api/user-stats" />
        </div>
        
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Interactive Counter</h2>
          <Counter />
        </div>
        
        <div className="bg-white p-4 rounded shadow md:col-span-2">
          <h2 className="text-lg font-semibold mb-2">Recent Activity</h2>
          <DataFetcher endpoint="/api/recent-activity" />
        </div>
      </div>
    </div>
  );
}`,
  },
  "25": {
    language: "ts",
    content: `import { useState, useEffect } from 'react';

// Custom hook for fetching data from an API
export function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [refetchIndex, setRefetchIndex] = useState<number>(0);

  // Function to manually trigger a refetch
  const refetch = () => setRefetchIndex(prev => prev + 1);

  useEffect(() => {
    let isMounted = true;
    
    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        
        const result = await response.json();
        
        if (isMounted) {
          setData(result);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('An unknown error occurred'));
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();
    
    return () => {
      isMounted = false;
    };
  }, [url, refetchIndex]);

  return { data, loading, error, refetch };
}`,
  },
  "26": {
    language: "ts",
    content: `import { useState, useEffect } from 'react';

// Types for authentication
type User = {
  id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
};

// Custom hook for authentication
export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        // In a real app, this would be an API call to verify the session
        const response = await fetch('/api/auth/session');
        const data = await response.json();
        
        if (data.user) {
          setAuthState({
            user: data.user,
            isAuthenticated: true,
            isLoading: false
          });
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // In a real app, this would be an API call to log in
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setAuthState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false
        });
        return { success: true };
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: data.error };
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // In a real app, this would be an API call to log out
      await fetch('/api/auth/logout', { method: 'POST' });
      
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      
      return { success: true };
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: 'Logout failed' };
    }
  };

  return {
    ...authState,
    login,
    logout
  };
}`,
  },
  "27": {
    language: "json",
    content: `{
  "aiProvider": "openai",
  "model": "gpt-4o",
  "apiKey": "YOUR_API_KEY_HERE", // TODO: BACKEND INTEGRATION POINT - Replace with your actual API key
  "temperature": 0.7,
  "maxTokens": 2048,
  "features": {
    "codeGeneration": true,
    "codeExplanation": true,
    "debugging": true,
    "refactoring": true,
    "documentation": true
  },
  "codeLanguages": [
    "javascript",
    "typescript",
    "python",
    "java",
    "csharp",
    "go",
    "rust",
    "php",
    "ruby"
  ],
  "frameworks": [
    "react",
    "nextjs",
    "vue",
    "angular",
    "svelte",
    "express",
    "django",
    "flask",
    "spring",
    "laravel"
  ],
  "integrations": {
    "github": {
      "enabled": true,
      "repositories": ["user/repo1", "user/repo2"]
    },
    "vscode": {
      "enabled": true
    }
  },
  "customPrompts": [
    {
      "name": "Generate React Component",
      "prompt": "Create a React component that..."
    },
    {
      "name": "Optimize Code",
      "prompt": "Optimize the following code for performance..."
    }
  ]
}`,
  },
  "3": {
    language: "tsx",
    content: `import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
}: ButtonProps) {
  const baseStyles = 'rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  const sizeStyles = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };
  
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  return (
    <button
      className={\`\${baseStyles} \${variantStyles[variant]} \${sizeStyles[size]} \${disabledStyles} \${className}\`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}`,
  },
}
