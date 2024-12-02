"use client";

import { useState, useEffect } from 'react';

const MouseFollower = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      // Clear any existing timeout
      clearTimeout(timeoutId);
      setIsVisible(true);
      
      // Add some smoothing by using requestAnimationFrame
      requestAnimationFrame(() => {
        setPosition({
          x: e.clientX - 5,
          y: e.clientY - 5,
        });
      });

      // Hide the dot if theres no movement after 1s 
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 1000);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      className={`z-10 fixed pointer-events-none w-2 h-2 rounded-full bg-blue-300 transition-all duration-300 ease-out
                ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
		top: 0,
		left: 0,
        boxShadow: '0 0 20px 4px rgba(147, 197, 253, 0.3)',
      }}
    />
  );
};

export default MouseFollower;