import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Users, ArrowRight } from 'lucide-react';
import { Button } from '@animate-ui/react/primitives/buttons/button';
import { CountingNumber } from '@animate-ui/react/primitives/texts/counting-number';
import { Effect } from '@animate-ui/react/primitives/effects/effect';
import SEO from '../components/common/SEO';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-dvh flex items-center justify-center px-4 pt-24 pb-12 md:pt-32 relative overflow-hidden">
            <SEO title="找不到頁面" noindex />
            <div className="absolute inset-0 bg-gradient-to-br from-bg-dark via-[#0a1628] to-bg-dark" aria-hidden />
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none" aria-hidden />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" aria-hidden />

            <Effect fade blur={{ initialBlur: 4 }} slide={{ offset: 16 }}>
                <div className="relative z-10 text-center max-w-2xl">
                    <div className="mb-6">
                        <h1 className="text-[130px] md:text-[180px] font-bold leading-none">
                            <span className="bg-gradient-to-r from-primary via-primary-light to-primary bg-clip-text text-transparent">
                                404
                            </span>
                        </h1>
                    </div>

                    <div className="space-y-3 mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-white">
                            這個網址目前沒有頁面
                        </h2>
                        <p className="text-gray-400 text-lg max-w-xl mx-auto">
                            可能連結已經換了，或網址多打了字。你可以直接回首頁，或去會員名錄找你想認識的專業代表。
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-10 max-w-md mx-auto">
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                            <div className="text-2xl font-bold text-primary font-mono tabular-nums">
                                <CountingNumber number={59} fromNumber={30} inView />
                            </div>
                            <div className="text-xs text-gray-400">在籍會員</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                            <div className="text-2xl font-bold text-primary font-mono tabular-nums">8</div>
                            <div className="text-xs text-gray-400">大產業鏈</div>
                        </div>
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                            <div className="text-2xl font-bold text-primary font-mono">週三</div>
                            <div className="text-xs text-gray-400">06:30 線上例會</div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button asChild>
                            <Link
                                to="/"
                                className="btn-lux btn-primary-lux px-8 py-4 font-bold rounded-full transition-colors flex items-center gap-2"
                            >
                                <Home size={20} />
                                <span>回到首頁</span>
                                <ArrowRight size={20} />
                            </Link>
                        </Button>

                        <Button asChild>
                            <Link
                                to="/members"
                                className="btn-lux btn-ghost-lux px-8 py-4 font-bold rounded-full transition-colors flex items-center gap-2"
                            >
                                <Users size={20} />
                                <span>瀏覽會員名錄</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </Effect>
        </div>
    );
};

export default NotFound;
