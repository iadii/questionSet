"use client";

import dynamic from "next/dynamic";
import "@excalidraw/excalidraw/index.css";

const Excalidraw = dynamic(
  async () => (await import("@excalidraw/excalidraw")).Excalidraw,
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center bg-gray-50 text-gray-400">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Loading Whiteboard...</span>
        </div>
      </div>
    )
  }
);

interface WhiteboardProps {
  onChange?: (elements: readonly any[]) => void;
  setExcalidrawAPI?: (api: any) => void;
}

export default function Whiteboard({ onChange, setExcalidrawAPI }: WhiteboardProps) {
  return (
    <div className="h-full w-full relative">
      <Excalidraw 
        theme="dark" 
        onChange={onChange ? (elements) => onChange(elements) : undefined} 
        excalidrawAPI={setExcalidrawAPI ? (api) => setExcalidrawAPI(api) : undefined}
      />
    </div>
  );
}
