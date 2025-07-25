"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Home, MessageSquare, Mic, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isActive?: boolean;
}

const NavItem = ({ icon: Icon, label, href, isActive }: NavItemProps) => (
  <Link href={href} passHref>
    <div className="flex flex-col items-center gap-1 text-gray-500 focus:outline-none cursor-pointer">
      {isActive ? (
        <div className="relative">
          <div className="absolute -inset-4 bg-white rounded-full soft-shadow"></div>
          <div className="relative bg-active-nav text-primary-foreground rounded-full p-3 soft-shadow-inset">
            <Icon className="w-6 h-6" />
          </div>
        </div>
      ) : (
        <Icon className="w-6 h-6" />
      )}
      <span
        className={cn(
          "text-xs font-semibold",
          isActive ? "text-active-nav mt-3" : "text-foreground/60"
        )}
      >
        {label}
      </span>
    </div>
  </Link>
);

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  const navItems = [
    { icon: Home, label: "Home", href: "/home" },
    { icon: MessageSquare, label: "Chat", href: "/chat" },
    { icon: Mic, label: "Voice Chat", href: "/voice-chat" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  return (
    <div className="flex flex-col h-screen items-center bg-background">
      <main className="flex-grow w-full max-w-sm overflow-y-auto">
        {children}
      </main>
      <footer className="w-full max-w-sm bg-card rounded-t-3xl p-4 soft-shadow sticky bottom-0">
        <nav className="flex justify-around items-center">
          {navItems.map((item) => (
            <NavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={pathname === item.href}
            />
          ))}
        </nav>
      </footer>
    </div>
  );
}
