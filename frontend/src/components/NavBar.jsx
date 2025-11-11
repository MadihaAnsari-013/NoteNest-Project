// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function Navbar() {
  const [dark, setDark] = useState(true);
  const [time, setTime] = useState("");
  const location = useLocation();

  // Live Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istTime = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
      setTime(istTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // APPLY DARK MODE
  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/5 dark:bg-black/10 backdrop-blur-xl border-b border-white/10 dark:border-white/5 sticky top-0 z-50"
    >
      <div className="container mx-auto flex justify-between items-center p-4">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl group-hover:scale-110 transition-transform">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            NoteKeeper
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/" className={`hidden sm:block text-lg ${location.pathname === "/" ? "text-purple-400" : "text-gray-300"} hover:text-purple-400`}>
            Home
          </Link>
          <Link to="/create" className={`hidden sm:block text-lg ${location.pathname === "/create" ? "text-purple-400" : "text-gray-300"} hover:text-purple-400`}>
            Create
          </Link>

          <div className="text-sm font-medium text-gray-300">
            <span className="text-purple-400">{time}</span>
          </div>

          <button
            onClick={() => setDark(!dark)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          >
            <motion.div
              key={dark ? "sun" : "moon"}
              initial={{ rotate: -180 }}
              animate={{ rotate: 0 }}
              transition={{ duration: 0.4 }}
            >
              {dark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
            </motion.div>
          </button>
        </div>
      </div>
    </motion.nav>
  );
}