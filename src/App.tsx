import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, lazy, Suspense } from 'react';
import React from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import StarryBackground from './components/layout/StarryBackground';
import BackToTop from './components/common/BackToTop';
import BottomNav from './components/layout/BottomNav';
import Home from './pages/Home';
import Members from './pages/Members';
import Referrals from './pages/Referrals';
import MemberEdit from './pages/MemberEdit';
import BNI from './pages/BNI';
import Login from './pages/Login';
import { AuthProvider } from './contexts/AuthContext';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/bni" element={<BNI />} />
        <Route path="/members" element={<Members />} />
        <Route path="/referrals" element={<Referrals />} />
        <Route path="/login" element={<Login />} />
        <Route path="/member-edit" element={<MemberEdit />} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <StarryBackground />
        <div className="flex flex-col min-h-screen relative z-10">
          <Navbar />
          <main className="flex-grow">
            <AnimatedRoutes />
          </main>
          <Footer />
          <BackToTop />
          <BottomNav />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
