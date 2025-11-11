// src/context/NoteContext.jsx
import { createContext, useEffect, useState } from "react";
import BACKEND_URL from "../api/url";

export const NoteContext = createContext();

export function NoteProvider({ children }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------- FETCH ----------
  const getNotes = async () => {
    setLoading(true);
    try {
      const { data } = await BACKEND_URL.get("/get-notes");
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotes();
  }, []);

  // ---------- CREATE ----------
  const createNote = async (note) => {
    try {
      const { data } = await BACKEND_URL.post("/create-note", note);
      setNotes((prev) => [data, ...prev]);
    } catch (error) {
      console.error("Create error:", error);
    }
  };

  // ---------- UPDATE ----------
  const updateNote = async (id, updated) => {
    try {
      const { data } = await BACKEND_URL.put(`/update-note/${id}`, updated);
      setNotes((prev) => prev.map((n) => (n._id === id ? data : n)));
    } catch (error) {
      console.error("Update error:", error);
    }
  };

  // ---------- DELETE ----------
  const deleteNote = async (id) => {
    try {
      await BACKEND_URL.delete(`/delete-note/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <NoteContext.Provider
      value={{ notes, loading, createNote, updateNote, deleteNote }}
    >
      {children}
    </NoteContext.Provider>
  );
}