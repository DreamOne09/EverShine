import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
    blur,
    scale,
    spring,
    transition as motionTransition,
    useShouldReduceMotion,
    useTempoTransition,
} from '@animate-ui/react/utils/motion';

const BackToTop: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const reduce = useShouldReduceMotion();
    const popIn = useTempoTransition(spring.pop);
    const popOut = useTempoTransition(motionTransition.popOut);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: reduce ? 'auto' : 'smooth',
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    type="button"
                    initial={{
                        opacity: 0,
                        filter: blur.icon,
                        transform: reduce ? 'scale(1)' : `scale(${scale.action})`,
                    }}
                    animate={{
                        opacity: 1,
                        filter: 'blur(0px)',
                        transform: 'scale(1)',
                        transition: popIn,
                        transitionEnd: { filter: 'none' },
                    }}
                    exit={{
                        opacity: 0,
                        filter: blur.icon,
                        transform: reduce ? 'scale(1)' : `scale(${scale.action})`,
                        transition: popOut,
                    }}
                    whileTap={{ transform: reduce ? 'scale(1)' : `scale(${scale.press})`, transition: spring.press }}
                    onClick={scrollToTop}
                    className="fixed bottom-24 md:bottom-8 right-8 z-50 p-3 bg-primary text-bg-dark rounded-full shadow-lg hover:bg-gold-light transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
                    aria-label="回到頂部"
                >
                    <ArrowUp size={24} />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

export default BackToTop;
