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
    <header className="bg-surface border-b border-border shadow-lg sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-all duration-200 hover:scale-105">
              <img 
                src={chatLureLogo} 
                alt="ChatLure Logo" 
                className="h-16 w-auto object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "text-foreground hover:bg-surface-hover transition-all duration-200 hover:scale-102 relative",
                      isActive(item.href) && "bg-surface-hover font-semibold text-primary shadow-md"
                    )}
                  >
                    {Icon && <Icon className="w-4 h-4 mr-2" />}
                    {item.name}
                    {item.name === "Pricing" && (
                      <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground text-xs shadow-sm">
                        New
                      </Badge>
                    )}
                    {isActive(item.href) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                    )}
                  </Button>
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
                variant="secondary"
                size="sm"
                className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              >
                <Crown className="w-4 h-4 mr-1" />
                Upgrade
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-foreground hover:bg-surface-hover hover:scale-105 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-surface rounded-b-lg mx-4 -mb-4 shadow-lg slide-in">
            <nav className="flex flex-col space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start text-foreground hover:bg-surface-hover transition-all duration-200",
                        isActive(item.href) && "bg-surface-hover font-semibold text-primary"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {Icon && <Icon className="w-4 h-4 mr-3" />}
                      {item.name}
                      {item.name === "Pricing" && (
                        <Badge variant="secondary" className="ml-auto bg-primary text-primary-foreground text-xs">
                          New
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-surface-hover">
                <Link href="/pricing">
                  <Button
                    variant="ghost"
                    className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Crown className="w-4 h-4 mr-3" />
                    Upgrade to Premium
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}