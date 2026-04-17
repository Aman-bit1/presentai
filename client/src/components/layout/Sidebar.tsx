import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Sun, Moon, Keyboard } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const [location] = useLocation();
  const { resolvedTheme, setTheme } = useTheme();

  const isActive = (path: string) => location === path;

  const sidebarClass = isOpen
    ? "fixed inset-0 z-50 flex md:hidden transform transition-transform duration-300 ease-in-out"
    : "hidden md:flex md:w-64 flex-col fixed inset-y-0 z-50 transform transition-transform duration-300 ease-in-out";

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) setIsOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, setIsOpen]);

  const toggleTheme = () => setTheme(resolvedTheme === "dark" ? "light" : "dark");

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm md:hidden z-40 transition-opacity duration-300 dark:bg-black/60" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`${sidebarClass} bg-white dark:bg-slate-900 shadow-lg`}>
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center px-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
                <i className="ri-presentation-line text-xl"></i>
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400">PresentAI</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI Presentation Coach</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 pt-6 px-4 space-y-2 overflow-y-auto scrollbar-hide">
            <div className="mb-4 px-3">
              <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Main</h2>
            </div>

            <Link href="/" className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive("/") ? "bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-primary-700 dark:text-primary-300 shadow-sm" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
              <div className={`w-8 h-8 mr-3 rounded-full flex items-center justify-center ${isActive("/") ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                <i className="ri-dashboard-line text-lg"></i>
              </div>
              <span>Dashboard</span>
              {isActive("/") && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"></span>}
            </Link>

            <Link href="/upload" className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive("/upload") ? "bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-primary-700 dark:text-primary-300 shadow-sm" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
              <div className={`w-8 h-8 mr-3 rounded-full flex items-center justify-center ${isActive("/upload") ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                <i className="ri-upload-cloud-line text-lg"></i>
              </div>
              <span>Upload Video</span>
              {isActive("/upload") && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"></span>}
            </Link>

            <Link href="/evaluations" className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${isActive("/evaluations") ? "bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-primary-700 dark:text-primary-300 shadow-sm" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"}`}>
              <div className={`w-8 h-8 mr-3 rounded-full flex items-center justify-center ${isActive("/evaluations") ? "bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-md" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"}`}>
                <i className="ri-history-line text-lg"></i>
              </div>
              <span>Past Evaluations</span>
              {isActive("/evaluations") && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500"></span>}
            </Link>

            <div className="mt-6 mb-4 px-3">
              <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Settings</h2>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={toggleTheme} className="flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
                  <div className="w-8 h-8 mr-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                    {resolvedTheme === "dark" ? <Sun className="text-lg h-4 w-4" /> : <Moon className="text-lg h-4 w-4" />}
                  </div>
                  <span>{resolvedTheme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent><p>Toggle {resolvedTheme === "dark" ? "light" : "dark"} mode</p></TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={() => document.dispatchEvent(new CustomEvent("toggle-shortcuts"))} className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200">
                  <div className="w-8 h-8 mr-3 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400">
                    <Keyboard className="text-lg h-4 w-4" />
                  </div>
                  <span>Keyboard Shortcuts</span>
                  <kbd className="ml-auto px-1.5 py-0.5 text-xs bg-slate-200 dark:bg-slate-700 rounded">?</kbd>
                </button>
              </TooltipTrigger>
              <TooltipContent><p>Press ? to toggle shortcuts</p></TooltipContent>
            </Tooltip>
          </nav>

          <div className="border-t border-slate-100 dark:border-slate-800 p-4 mt-auto">
            <div className="glass p-3 rounded-xl">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 text-white flex items-center justify-center shadow-md">
                  <i className="ri-user-smile-line"></i>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Guest User</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Free Plan</p>
                </div>
                <button className="ml-auto p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <i className="ri-settings-4-line"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
