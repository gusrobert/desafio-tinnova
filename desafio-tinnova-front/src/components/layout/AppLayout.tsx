"use client";

import type { ReactNode } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./Sidebar";
import AppHeader from "./Header";

interface AppLayoutProps {
  children: ReactNode;
  pageTitle: string;
}

export default function AppLayout({ children, pageTitle }: AppLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex flex-1 flex-col w-full max-w-full">
          <AppHeader pageTitle={pageTitle} />
          <main className="flex-1 p-6 bg-background overflow-auto w-full max-w-full">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
