// src/App.jsx
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Createnote from "./pages/Createnote";
import ParticlesBG from "./components/ParticlesBG";

function App() {
  const location = useLocation();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-teal-900 overflow-hidden">
      <ParticlesBG />
      <div className="relative z-10">
        <Navbar />
        <main className="flex-1 container mx-auto p-4">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route
                path="/"
                element={
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Home />
                  </motion.div>
                }
              />
              <Route
                path="/create"
                element={
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Createnote />
                  </motion.div>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;