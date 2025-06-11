<<<<<<< HEAD
import { Switch, Route, Redirect } from "wouter";
import { useAuth } from "@clerk/clerk-react";
=======
import { Switch, Route } from "wouter";
>>>>>>> origin/main
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/home";
import Chat from "@/pages/chat";
import UserDashboard from "@/pages/user-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import Pricing from "@/pages/pricing";
<<<<<<< HEAD
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }
  
  if (!isSignedIn) {
    return <Redirect to="/login" />;
  }
  
  return <Component />;
}

function Router() {
  const { isSignedIn } = useAuth();
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/chat/:id">
        {() => <ProtectedRoute component={Chat} />}
      </Route>
      <Route path="/dashboard">
        {() => <ProtectedRoute component={UserDashboard} />}
      </Route>
      <Route path="/admin">
        {() => <ProtectedRoute component={AdminDashboard} />}
      </Route>
=======
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/chat/:id" component={Chat} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/dashboard" component={UserDashboard} />
      <Route path="/admin" component={AdminDashboard} />
>>>>>>> origin/main
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
