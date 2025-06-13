import { Bell, Settings, User, Menu, X, Crown, Zap, Bot, Home, DollarSign } from "lucide-react";
import newLogo from "@assets/favico_1749773352977.png";
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
    { name: "Home", href: "/", icon: Home },
    { name: "Pricing", href: "/pricing", icon: DollarSign },
    { name: "Dashboard", href: "/dashboard", icon: User },
    { name: "Admin", href: "/admin", icon: Settings },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#0a0a0a] border-b border-[#333333] sticky top-0 z-50 backdrop-blur-xl shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <Link href="/">
            <div className="flex items-center space-x-4 cursor-pointer group">
              <div className="relative">
                <div className="relative bg-white rounded-full p-2 shadow-lg">
                  <img 
                    src={newLogo} 
                    alt="Burbie" 
                    className="h-8 w-8 object-contain"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-white tracking-tight">
                  Burbie
                </span>
                <span className="text-xs text-gray-400 font-medium -mt-1">
                  Garden Services
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative",
                      active 
                        ? "bg-[#075e54] text-white shadow-lg" 
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    )}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.name}
                    {item.name === "Pricing" && (
                      <Badge className="ml-2 bg-orange-500 text-white text-xs px-2 py-0.5">
                        New
                      </Badge>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-4">
            <NotificationBell />
            
            {/* Upgrade Button */}
            <Link href="/pricing">
              <Button className="hidden sm:flex bg-[#075e54] hover:bg-[#064e44] text-white font-medium px-4 py-2 rounded-lg shadow-lg transition-all duration-200">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-gray-300 hover:text-white hover:bg-gray-800 p-2 rounded-lg"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.name} href={item.href}>
                  <div
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                      active 
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white" 
                        : "text-gray-300 hover:text-white hover:bg-gray-800"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon className="w-4 h-4 mr-3" />
                    {item.name}
                    {item.name === "Pricing" && (
                      <Badge className="ml-auto bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 py-0.5">
                        New
                      </Badge>
                    )}
                  </div>
                </Link>
              );
            })}
            
            {/* Mobile Upgrade Button */}
            <Link href="/pricing">
              <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg shadow-lg">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}