// src/components/Navbar.jsx
import { Link, useLocation } from "react-router-dom";
import { BookOpen, Sun, Moon } from "lucide-react";
import { useContext } from "react";
import { NoteContext } from "../context/NoteContext";

export default function Navbar() {
  const location = useLocation();
  const { darkMode, setDarkMode } = useContext(NoteContext);

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-blue-400" />
          <span className="text-2xl text-blue-400 tracking-wide">NoteKeeper</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`hover:text-blue-400 transition ${location.pathname === "/" ? "text-blue-400 font-semibold" : "text-gray-300"}`}
          >
            Home
          </Link>
          <Link
            to="/create"
            className={`hover:text-blue-400 transition ${location.pathname === "/create" ? "text-blue-400 font-semibold" : "text-gray-300"}`}
          >
            Create Note
          </Link>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-blue-400" />}
          </button>
        </div>
      </div>
    </nav>
  );
}