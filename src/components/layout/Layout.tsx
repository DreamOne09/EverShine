import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import MeteorShower from './MeteorShower';
import StarryBackground from './StarryBackground';
import BottomNav from './BottomNav';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen text-gray-100 font-sans antialiased relative flex flex-col">
            <StarryBackground />
            <MeteorShower />
            <Navbar />
            <main className="flex-grow pt-20 lg:pt-24 min-h-[calc(100vh-80px)] pb-20 md:pb-0">
                <Outlet />
            </main>
            <Footer />
            <BottomNav />
        </div>
    );
};

export default Layout;
