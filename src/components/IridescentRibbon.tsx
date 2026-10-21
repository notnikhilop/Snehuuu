import React from 'react';
import { motion } from 'framer-motion';

interface IridescentRibbonProps {
  side: 'left' | 'right';
}

export const IridescentRibbon: React.FC<IridescentRibbonProps> = ({ side }) => {
  const isLeft = side === 'left';

  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 pointer-events-none select-none z-10 hidden md:block overflow-visible ${
        isLeft ? 'left-[-4%] lg:left-0' : 'right-[-4%] lg:right-0'
      }`}
      style={{
        width: '42vw',
        maxWidth: '540px',
        height: '460px',
        transform: isLeft ? 'translateY(-50%)' : 'translateY(-50%) scaleX(-1)',
      }}
    >
      <motion.svg
        viewBox="0 0 600 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full opacity-90"
        animate={{
          y: [-12, 10, -12],
          rotate: [-1.5, 1.2, -1.5],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <defs>
          {/* Silky pearlescent gradient: iridescent white, pale pink, cyan, lilac */}
          <linearGradient id={`ribbonGrad1_${side}`} x1="0%" y1="20%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
            <stop offset="25%" stopColor="#E2F5FC" stopOpacity="0.75" />
            <stop offset="55%" stopColor="#FDE4F2" stopOpacity="0.8" />
            <stop offset="85%" stopColor="#E9D5FF" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id={`ribbonGrad2_${side}`} x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="#C8F1FF" stopOpacity="0.65" />
            <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#FFD1E6" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#D982A5" stopOpacity="0.3" />
          </linearGradient>

          {/* Soft blur for silk sheen */}
          <filter id={`silkGlow_${side}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Primary swirling silk ribbon wave */}
        <path
          d="M -30 260
             C 120 180, 200 340, 340 240
             C 440 160, 510 210, 580 180
             C 520 230, 420 220, 320 290
             C 180 390, 80 260, -30 320 Z"
          fill={`url(#ribbonGrad1_${side})`}
          filter={`url(#silkGlow_${side})`}
          opacity="0.85"
        />

        {/* Secondary twisted loop showing depth and light reflection */}
        <path
          d="M 20 230
             C 160 140, 250 210, 390 170
             C 470 145, 520 170, 560 160
             C 490 200, 410 195, 330 235
             C 210 295, 110 270, 20 275 Z"
          fill={`url(#ribbonGrad2_${side})`}
          opacity="0.9"
        />

        {/* Delicate glossy highlight crest */}
        <path
          d="M 40 240
             C 170 160, 240 295, 370 215
             C 450 165, 520 190, 550 175"
          stroke="#FFFFFF"
          strokeWidth="3.5"
          strokeLinecap="round"
          opacity="0.95"
          filter="blur(1px)"
        />

        {/* Faint cyan sheen edge */}
        <path
          d="M 60 255
             C 180 180, 260 310, 380 230
             C 440 190, 500 205, 530 190"
          stroke="#BAE6FD"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.75"
        />
      </motion.svg>
    </div>
  );
};
