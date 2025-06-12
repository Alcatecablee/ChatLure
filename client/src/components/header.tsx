import { Bell, Settings, User, Menu, X, Crown, Zap, Edit3 } from "lucide-react";
import chatLureLogo from "../assets/chatlure-logo.png";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import NotificationBell from "./notification-bell";
import { cn } from "@/lib/utils";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  const navigation = [
    { name: "Home", href: "/", icon: null },
    { name: "Pricing", href: "/pricing", icon: Crown },
    { name: "Dashboard", href: "/dashboard", icon: User },
    { name: "Admin", href: "/admin", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="bg-[#0d1117] border-b border-[#21262d] sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer group">
              <img 
                src={chatLureLogo} 
                alt="ChatLure Logo" 
                className="h-8 w-auto object-contain transition-all duration-200 group-hover:scale-105"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <button
                    className={cn(
                      "px-3 py-2 text-sm font-medium text-[#7d8590] hover:text-[#f0f6fc] transition-colors duration-200 relative rounded-md",
                      isActive(item.href) && "text-[#f0f6fc] bg-[#21262d]"
                    )}
                  >
                    {Icon && <Icon className="w-4 h-4 mr-2 inline" />}
                    {item.name}
                    {item.name === "Pricing" && (
                      <span className="ml-2 px-1.5 py-0.5 text-xs bg-[#0969da] text-white rounded-full">
                        New
                      </span>
                    )}
                  </button>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            <NotificationBell />
            
            {/* Upgrade Button */}
            <Link href="/pricing">
              <Button
                size="sm"
                className="hidden sm:flex bg-[#0969da] text-white hover:bg-[#0860ca] border-none font-medium px-3 py-1.5 text-sm"
              >
                <Crown className="w-4 h-4 mr-1.5" />
                Upgrade
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#21262d] p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-[#21262d] bg-[#0d1117]">
            <nav className="flex flex-col space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <button
                      className={cn(
                        "w-full px-3 py-2 text-left text-sm font-medium text-[#7d8590] hover:text-[#f0f6fc] hover:bg-[#21262d] transition-colors duration-200 rounded-md",
                        isActive(item.href) && "text-[#f0f6fc] bg-[#21262d]"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {Icon && <Icon className="w-4 h-4 mr-3 inline" />}
                      {item.name}
                      {item.name === "Pricing" && (
                        <span className="ml-auto px-1.5 py-0.5 text-xs bg-[#0969da] text-white rounded-full">
                          New
                        </span>
                      )}
                    </button>
                  </Link>
                );
              })}
              <div className="pt-3 mt-3 border-t border-[#21262d]">
                <Link href="/pricing">
                  <button
                    className="w-full px-3 py-2 text-left text-sm font-medium bg-[#0969da] text-white hover:bg-[#0860ca] transition-colors duration-200 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Crown className="w-4 h-4 mr-3 inline" />
                    Upgrade to Premium
                  </button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}