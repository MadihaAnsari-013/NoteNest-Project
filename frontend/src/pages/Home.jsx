// src/pages/Home.jsx
import { useContext, useState } from "react";
import { NoteContext } from "../context/NoteContext";
import Notecard from "../components/Notecard";
import { motion } from "framer-motion";
import { FileText, Mail, X, Plus } from "lucide-react";
import BACKEND_URL from "../api/url";

export default function Home() {
  const { notes, loading } = useContext(NoteContext);

  // Share Modal State
  const [shareModal, setShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState("");
  const [shareNoteId, setShareNoteId] = useState("");

  // Search State
  const [search, setSearch] = useState("");

  // Share Handler
  const handleShare = (id) => {
    setShareNoteId(id);
    setShareEmail("");
    setShareModal(true);
  };

  const submitShare = async () => {
    if (!shareEmail || !shareEmail.includes("@")) {
      alert("Please enter a valid email");
      return;
    }
    try {
      await BACKEND_URL.post(`/share/${shareNoteId}`, { email: shareEmail });
      alert("Note shared successfully!");
      setShareModal(false);
      setShareEmail("");
    } catch (err) {
      alert("Failed to share note.");
      console.error(err);
    }
  };

  // Check if same day
  const isSameDay = (d1, d2) => {
    return (
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate()
    );
  };

  // Group notes by date
  const groupNotesByDate = (notes) => {
    const groups = {};
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    notes.forEach((note) => {
      const noteDate = new Date(note.createdAt);
      let key;

      if (isSameDay(noteDate, today)) key = "Today";
      else if (isSameDay(noteDate, yesterday)) key = "Yesterday";
      else
        key = noteDate.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });

      if (!groups[key]) groups[key] = [];
      groups[key].push(note);
    });

    return groups;
  };

  // Filter notes by search
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      note.content.toLowerCase().includes(search.toLowerCase())
  );

  // Loading State
  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 animate-pulse"
          >
            <div className="h-7 bg-white/20 rounded mb-4"></div>
            <div className="h-4 bg-white/20 rounded w-5/6 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  // Empty State
  if (notes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen text-center px-6"
      >
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-8"
        >
          <FileText size={100} className="text-blue-400" />
        </motion.div>
        <h2 className="text-4xl font-bold text-white mb-4">Welcome to NoteNest</h2>
        <p className="text-xl text-gray-300 mb-8">Your notes live here. Start creating!</p>
        <a
          href="/create"
          className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg font-semibold rounded-2xl shadow-xl hover:shadow-purple-500/50 transform hover:scale-105 transition"
        >
          Create Your First Note
        </a>
      </motion.div>
    );
  }

  return (
    <>
      {/* Search Bar */}
      <div className="p-6 max-w-3xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search your notes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-4 pr-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition"
          />
          <svg
            className="absolute right-5 top-1/2 -translate-y-1/2 w-7 h-7 text-white/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {/* Notes Grid with Date Grouping */}
      <div className="px-6 pb-24">
        {Object.entries(groupNotesByDate(filteredNotes)).map(([date, dateNotes]) => (
          <div key={date} className="mb-12">
            <h2 className="text-2xl font-bold text-purple-400 mb-6 px-2 border-l-4 border-purple-500">
              {date}
              {search && (
                <span className="text-lg font-normal text-gray-400 ml-3">
                  ({dateNotes.length} found)
                </span>
              )}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {dateNotes.map((note, i) => (
                <motion.div
                  key={note._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Notecard note={note} onShare={handleShare} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* No Search No Results */}
        {search && filteredNotes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">
              No notes found for "
              <span className="text-purple-400 font-bold">{search}</span>"
            </p>
            <p className="text-gray-500 mt-4">Try searching something else</p>
          </div>
        )}
      </div>

      {/* FLOATING ADD BUTTON - THIS IS WHAT YOU WERE MISSING */}
      <div className="fixed bottom-8 right-8 z-50">
        <a
          href="/create"
          className="group flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full shadow-2xl hover:shadow-pink-500/60 transform hover:scale-110 transition-all duration-300"
        >
          <Plus className="w-9 h-9 text-white group-hover:rotate-90 transition-transform duration-500" />
        </a>
      </div>

      {/* Share Modal */}
      {shareModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl w-full max-w-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold flex items-center gap-3 text-gray-800 dark:text-white">
                <Mail className="w-8 h-8 text-purple-500" />
                Share Note
              </h3>
              <button
                onClick={() => setShareModal(false)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <input
              type="email"
              placeholder="friend@example.com"
              value={shareEmail}
              onChange={(e) => setShareEmail(e.target.value)}
              className="w-full px-5 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-4 focus:ring-purple-500 focus:outline-none mb-6 text-lg"
            />

            <button
              onClick={submitShare}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-xl hover:opacity-90 transform hover:scale-105 transition"
            >
              Send via Email
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}