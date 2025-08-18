'use client';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '@/components/theme-toggle';
import { Check, LayoutGrid, Settings } from 'lucide-react';
import { ThemeSwitcher } from './theme-switcher';

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary" />
            <span className="font-semibold text-lg group-data-[collapsible=icon]:hidden">Task Canvas</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive tooltip="Tasks">
              <LayoutGrid />
              <span>Tasks</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Completed">
              <Check />
              <span>Completed</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Settings">
              <Settings />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex-row items-center justify-between group-data-[collapsible=icon]:justify-center">
        <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
            <ThemeToggle />
            <ThemeSwitcher />
        </div>
        <SidebarTrigger />
      </SidebarFooter>
    </Sidebar>
  );
}
