"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Car, ChevronRight, LayoutList, BarChart3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";


const navItems = [
  { href: "/vehicles-dashboard", label: "Dashboard de Veículos", icon: BarChart3 },
  { href: "/vehicles", label: "Gestão de veículos", icon: Car },
];

const exerciseItems = [
  { href: "/exercises/exercise-1", label: "Exercício 1" },
  { href: "/exercises/exercise-2", label: "Exercício 2" },
  { href: "/exercises/exercise-3", label: "Exercício 3" },
  { href: "/exercises/exercise-4", label: "Exercício 4" },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r bg-[#202020]">
      <SidebarHeader className="p-4 items-center justify-center bg-[#202020]">
        <Link href="/exercicios" className="flex items-center gap-2 text-white hover:text-gray-300">
          <Image
            src="/images/logo.png"
            alt="Desafio Tinnova"
            width={0}
            height={0}
            sizes="100vw"
            style={{ 
              width: "auto", 
              height: "auto",
              maxWidth: "160px",
              maxHeight: "160px"
            }}
            className="object-contain transition-transform"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2 bg-[#202020]">
        <SidebarMenu>
          <Collapsible>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="justify-start text-white hover:text-gray-300">
                  <LayoutList className="h-5 w-5" />
                  <span className="group-data-[collapsible=icon]:hidden">Exercícios</span>
                  <ChevronRight className="ml-auto h-4 w-4 transition-transform group-data-[state=open]:rotate-90" />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  {exerciseItems.map((item) => (
                    <SidebarMenuSubItem key={item.href}>
                      <SidebarMenuSubButton asChild isActive={pathname === item.href}>
                        <Link href={item.href} className="text-white hover:text-gray-300">
                          {item.label}
                        </Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>

          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href || (item.href !== "/exercicios" && pathname.startsWith(item.href))}
                  tooltip={{ children: item.label, side: "right" }}
                  className="justify-start"
                >
                  <Link href={item.href} className="flex items-center gap-2 text-white hover:text-gray-300">
                    <item.icon className="h-5 w-5" />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
}
