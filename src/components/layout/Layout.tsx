import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import StarryBackground from './StarryBackground';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
    return (
        <div className="min-h-screen bg-bg-primary text-gray-100 font-sans antialiased relative flex flex-col">
            <StarryBackground />
            <Navbar />
            <main className="flex-grow pt-20 lg:pt-24 min-h-[calc(100vh-80px)]">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
