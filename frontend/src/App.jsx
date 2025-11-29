// src/App.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Createnote from "./pages/Createnote";
import ParticlesBG from "./components/ParticlesBG";
import { NoteProvider } from "./context/NoteContext";

function App() {
  const location = useLocation();

  return (
    <NoteProvider>
      <div className="min-h-screen bg-black text-cyan-100">
        <ParticlesBG />
        <div className="relative z-10">
          <Navbar />
          <main className="container mx-auto p-4 max-w-7xl">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/create" element={<Createnote />} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </div>
    </NoteProvider>
  );
}

export default App;   // THIS LINE WAS MISSING!