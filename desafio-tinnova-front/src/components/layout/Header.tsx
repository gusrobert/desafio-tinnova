"use client";

import { Button } from "@/components/ui/button";
import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";


interface AppHeaderProps {
  pageTitle: string;
}

export default function AppHeader({ pageTitle }: AppHeaderProps) {
  const { toggleSidebar, isMobile } = useSidebar();
  
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-6 shadow-sm">
      {isMobile && (
        <Button variant="outline" size="icon" onClick={toggleSidebar} className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      )}
      <h1 className="text-xl font-semibold text-foreground">{pageTitle}</h1>
    </header>
  );
}
