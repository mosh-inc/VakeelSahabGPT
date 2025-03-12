import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import DbManager from "@/pages/DbManager";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/db-manager" component={DbManager} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <header className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <a href="/" className="font-bold text-lg text-primary">VakeelSahabGPT</a>
            <nav>
              <ul className="flex space-x-4">
                <li><a href="/" className="text-sm text-gray-600 hover:text-primary">Home</a></li>
                <li><a href="/db-manager" className="text-sm text-gray-600 hover:text-primary">Manage Database</a></li>
              </ul>
            </nav>
          </div>
        </header>
        <Router />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
