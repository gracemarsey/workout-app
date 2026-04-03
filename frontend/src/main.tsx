import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { ToastProvider } from "./components/Toast";
import { Home } from "./pages/Home";
import { Workouts } from "./pages/Workouts";
import { WorkoutDetail } from "./pages/WorkoutDetail";
import { Progress } from "./pages/Progress";

const queryClient = new QueryClient();

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

// Bottom Navigation Component
const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path === "/workouts" && location.pathname.startsWith("/workouts")) return true;
    if (path === "/progress" && location.pathname === "/progress") return true;
    return false;
  };

  const handleNav = (path: string) => {
    window.scrollTo(0, 0);
    navigate(path);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 pb-safe">
      <div className="max-w-lg mx-auto flex justify-around py-3">
        <button
          onClick={() => handleNav("/")}
          className={`flex flex-col items-center ${
            isActive("/") ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <span className="text-xl">🏠</span>
          <span className="text-xs mt-1">Home</span>
        </button>
        <button
          onClick={() => handleNav("/workouts")}
          className={`flex flex-col items-center ${
            isActive("/workouts") ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <span className="text-xl">🏋️</span>
          <span className="text-xs mt-1">Workouts</span>
        </button>
        <button
          onClick={() => handleNav("/progress")}
          className={`flex flex-col items-center ${
            isActive("/progress") ? "text-blue-600" : "text-gray-400"
          }`}
        >
          <span className="text-xl">📊</span>
          <span className="text-xs mt-1">Progress</span>
        </button>
      </div>
    </div>
  );
};

// Layout component with bottom nav
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {children}
      <BottomNav />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ToastProvider>
          <ScrollToTop />
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/workouts/:type" element={<WorkoutDetail />} />
              <Route path="/progress" element={<Progress />} />
            </Routes>
          </Layout>
        </ToastProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
