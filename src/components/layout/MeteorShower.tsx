import React, { useEffect, useState } from 'react';

const MeteorShower: React.FC = () => {
    const [meteors, setMeteors] = useState<any[]>([]);

    useEffect(() => {
        const createMeteor = () => {
            const style = {
                left: Math.random() * window.innerWidth + 'px',
                top: Math.random() * window.innerHeight * 0.5 + 'px', // Start from top half
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 2 + 2 + 's'
            };
            return style;
        };

        const initialMeteors = Array.from({ length: 5 }).map((_, i) => ({
            id: i,
            style: createMeteor()
        }));

        setMeteors(initialMeteors);

        // Periodically refresh meteors to keep randomness
        const interval = setInterval(() => {
            setMeteors(prev => prev.map(m => ({ ...m, style: createMeteor() })));
        }, 8000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="meteor-shower">
            {meteors.map(m => (
                <div key={m.id} className="meteor" style={m.style}></div>
            ))}
        </div>
    );
};

export default MeteorShower;
