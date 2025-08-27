"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { ThemeProvider } from "@/components/ThemeProvider";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ThemeProvider>
      <div className="flex h-screen bg-gray-50 ">
        <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-w-0 relative">
          <div className="sticky top-0 z-40 bg-blue-800">
            <Header setSidebarOpen={setSidebarOpen} />
          </div>
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-gray-50 ">
            <div className="max-w-7xl mx-auto">{children}</div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}
