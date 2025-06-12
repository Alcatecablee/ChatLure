import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import UserDashboard from "@/pages/user-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import Pricing from "@/pages/pricing";

import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat/:id" component={Chat} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/dashboard" component={UserDashboard} />
      <Route path="/admin" component={AdminDashboard} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-[#0d1117] text-[#f0f6fc]">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
