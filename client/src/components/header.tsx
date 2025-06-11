import { Bell, Settings, User, Menu, X, Crown, Zap } from "lucide-react";
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
<<<<<<< HEAD
    <header className="bg-surface border-b border-border shadow-lg sticky top-0 z-50 backdrop-blur-md bg-opacity-95">
=======
    <header className="bg-gradient-to-r from-surface via-card to-surface border-b border-border shadow-sm sticky top-0 z-50 backdrop-blur-sm">
>>>>>>> origin/main
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/">
<<<<<<< HEAD
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-all duration-200 hover:scale-105">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  ChatLure
                </h1>
                <span className="hidden sm:block text-xs text-muted-foreground -mt-1 font-medium">
                  Peek. Obsess. Repeat.
                </span>
=======
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-90 transition-opacity">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">ChatLure</h1>
                <span className="hidden sm:block text-xs text-muted-foreground -mt-1">Peek. Obsess. Repeat.</span>
>>>>>>> origin/main
              </div>
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
<<<<<<< HEAD
                      "text-foreground hover:bg-surface-hover transition-all duration-200 hover:scale-102 relative",
                      isActive(item.href) && "bg-surface-hover font-semibold text-primary shadow-md"
=======
                      "text-foreground hover:bg-surface-hover transition-all duration-200",
                      isActive(item.href) && "bg-surface-hover font-semibold text-primary"
>>>>>>> origin/main
                    )}
                  >
                    {Icon && <Icon className="w-4 h-4 mr-2" />}
                    {item.name}
                    {item.name === "Pricing" && (
<<<<<<< HEAD
                      <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground text-xs shadow-sm">
                        New
                      </Badge>
                    )}
                    {isActive(item.href) && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                    )}
=======
                      <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground text-xs">
                        New
                      </Badge>
                    )}
>>>>>>> origin/main
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Right Side Actions */}
<<<<<<< HEAD
          <div className="flex items-center space-x-3">
=======
          <div className="flex items-center space-x-2">
>>>>>>> origin/main
            <NotificationBell />
            
            {/* Upgrade Button */}
            <Link href="/pricing">
              <Button
                variant="secondary"
                size="sm"
<<<<<<< HEAD
                className="hidden sm:flex bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
=======
                className="hidden sm:flex bg-gradient-to-r from-primary to-accent-blue text-primary-foreground hover:from-accent-blue hover:to-primary font-semibold"
>>>>>>> origin/main
              >
                <Crown className="w-4 h-4 mr-1" />
                Upgrade
              </Button>
            </Link>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
<<<<<<< HEAD
              className="md:hidden text-foreground hover:bg-surface-hover hover:scale-105 transition-all duration-200"
=======
              className="md:hidden text-foreground hover:bg-surface-hover"
>>>>>>> origin/main
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
<<<<<<< HEAD
          <div className="md:hidden py-4 border-t border-border bg-surface rounded-b-lg mx-4 -mb-4 shadow-lg slide-in">
=======
          <div className="md:hidden py-4 border-t border-border">
>>>>>>> origin/main
            <nav className="flex flex-col space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
<<<<<<< HEAD
                        "w-full justify-start text-foreground hover:bg-surface-hover transition-all duration-200",
                        isActive(item.href) && "bg-surface-hover font-semibold text-primary"
=======
                        "w-full justify-start text-white hover:bg-white/20",
                        isActive(item.href) && "bg-white/20 font-semibold"
>>>>>>> origin/main
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {Icon && <Icon className="w-4 h-4 mr-3" />}
                      {item.name}
                      {item.name === "Pricing" && (
<<<<<<< HEAD
                        <Badge variant="secondary" className="ml-auto bg-primary text-primary-foreground text-xs">
=======
                        <Badge variant="secondary" className="ml-auto bg-yellow-400 text-black text-xs">
>>>>>>> origin/main
                          New
                        </Badge>
                      )}
                    </Button>
                  </Link>
                );
              })}
<<<<<<< HEAD
              <div className="pt-4 border-t border-surface-hover">
                <Link href="/pricing">
                  <Button
                    variant="ghost"
                    className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-lg"
=======
              <div className="pt-4 border-t border-white/20">
                <Link href="/pricing">
                  <Button
                    variant="ghost"
                    className="w-full justify-start bg-gradient-to-r from-yellow-400 to-orange-500 text-black hover:from-yellow-500 hover:to-orange-600 font-semibold"
>>>>>>> origin/main
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