// src/pages/Home.jsx
import { useContext } from "react";
import { NoteContext } from "../context/NoteContext";
import Notecard from "../components/Notecard";
import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function Home() {
  const { notes, loading } = useContext(NoteContext);

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white/10 backdrop-blur-md rounded-2xl p-5 animate-pulse">
            <div className="h-6 bg-white/20 rounded mb-3"></div>
            <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-screen text-center p-6"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-6"
        >
          <FileText size={80} className="text-blue-400" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">No Notes Yet</h3>
        <p className="text-gray-400 mb-6">Start by creating your first note!</p>
        <a
          href="/create"
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-medium transition"
        >
          Create Note
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4"
    >
      {notes.map((note, i) => (
        <motion.div
          key={note._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <Notecard note={note} />
        </motion.div>
      ))}
    </motion.div>
  );
}