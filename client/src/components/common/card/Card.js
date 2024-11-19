import React, { useState } from 'react';

const Card = ({ children }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };  

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (    
        <div
            className={`card ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {children}
        </div>    
    );
};

export default Card;