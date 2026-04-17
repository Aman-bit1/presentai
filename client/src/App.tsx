import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import UploadVideo from "@/pages/UploadVideo";
import VideoAnalysis from "@/pages/VideoAnalysis";
import PastEvaluations from "@/pages/PastEvaluations";
import Sidebar from "@/components/layout/Sidebar";
import { useState } from "react";
import { AnalysisProvider } from "@/contexts/AnalysisContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useKeyboardShortcuts, ShortcutModal } from "@/hooks/use-keyboard-shortcuts";
import { useLocation } from "wouter";

function Router() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [, navigate] = useLocation();

  const shortcuts = [
    { key: "?", action: () => setShortcutsOpen((prev) => !prev), description: "Toggle keyboard shortcuts" },
    { key: "d", ctrl: true, action: () => navigate("/"), description: "Go to Dashboard" },
    { key: "u", ctrl: true, action: () => navigate("/upload"), description: "Upload new video" },
    { key: "e", ctrl: true, action: () => navigate("/evaluations"), description: "View evaluations" },
    { key: "Escape", action: () => { setShortcutsOpen(false); setMobileMenuOpen(false); }, description: "Close modal/menu" },
  ];

  useKeyboardShortcuts(shortcuts);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={mobileMenuOpen} setIsOpen={setMobileMenuOpen} />
      <main className="flex-1 overflow-y-auto md:ml-[16rem] h-full">
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <div className="h-16 flex items-center justify-between px-4">
            <div className="flex items-center">
              <div className="bg-primary-600 text-white p-1.5 rounded">
                <i className="ri-presentation-line text-xl"></i>
              </div>
              <h1 className="ml-2 text-xl font-semibold text-slate-900 dark:text-white">PresentAI</h1>
            </div>
            <div className="flex items-center gap-2">
              <button type="button" className="p-2 rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setShortcutsOpen(true)} title="Keyboard shortcuts">
                <i className="ri-keyboard-line text-xl"></i>
              </button>
              <button type="button" className="p-2 rounded-md text-slate-700 dark:text-slate-300" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <i className="ri-menu-line text-xl"></i>
              </button>
            </div>
          </div>
        </div>
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/upload" component={UploadVideo} />
          <Route path="/analysis/:id" component={VideoAnalysis} />
          <Route path="/evaluations" component={PastEvaluations} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <ShortcutModal isOpen={shortcutsOpen} onClose={() => setShortcutsOpen(false)} shortcuts={shortcuts} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AnalysisProvider>
          <Router />
          <Toaster />
        </AnalysisProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
