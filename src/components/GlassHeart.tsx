import React from 'react';
import { motion } from 'framer-motion';

interface GlassHeartProps {
  className?: string;
  size?: number;
}

export const GlassHeart: React.FC<GlassHeartProps> = ({ className = '', size = 320 }) => {
  return (
    <div
      className={`relative flex items-center justify-center select-none pointer-events-auto ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient glowing aura behind the heart */}
      <div 
        className="absolute inset-0 rounded-full blur-3xl opacity-60 pointer-events-none transform -translate-y-2"
        style={{
          background: 'radial-gradient(circle, rgba(247, 200, 217, 0.8) 0%, rgba(217, 130, 165, 0.4) 45%, rgba(230, 210, 255, 0) 70%)',
          width: size * 1.25,
          height: size * 1.25,
          left: -size * 0.125,
          top: -size * 0.125,
        }}
      />

      {/* Floating 3D Heart Wrapper */}
      <motion.div
        animate={{
          y: [-6, 6, -6],
          rotate: [-1, 1, -1],
          scale: [1, 1.025, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative w-full h-full cursor-pointer group"
      >
        {/* Soft shadow cast on typography and background */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-8 rounded-full blur-xl opacity-35 bg-[#75445C] transform scale-y-50"
        />

        {/* 3D Glass Heart SVG with realistic refraction, highlights & translucency */}
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full drop-shadow-2xl overflow-visible transition-transform duration-500 group-hover:scale-105"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Soft glass body gradient with rose, blush and lavender tints */}
            <linearGradient id="heartGlassBody" x1="15%" y1="10%" x2="85%" y2="90%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#FDE2EC" stopOpacity="0.65" />
              <stop offset="55%" stopColor="#F7AEC8" stopOpacity="0.5" />
              <stop offset="78%" stopColor="#D982A5" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#B36087" stopOpacity="0.75" />
            </linearGradient>

            {/* Inner liquid refractive glow */}
            <radialGradient id="innerRefraction" cx="42%" cy="40%" r="58%" fx="35%" fy="32%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="28%" stopColor="#FFA6C9" stopOpacity="0.65" />
              <stop offset="65%" stopColor="#E06994" stopOpacity="0.45" />
              <stop offset="85%" stopColor="#AA406C" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#5C1F3D" stopOpacity="0.85" />
            </radialGradient>

            {/* Lavender reflection for iridescent glass edge */}
            <linearGradient id="lavenderReflect" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#E9D5FF" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#FCE7F0" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#C084FC" stopOpacity="0.85" />
            </linearGradient>

            {/* Glossy specular reflection for top left lobe */}
            <linearGradient id="topGlare" x1="20%" y1="0%" x2="70%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Secondary right lobe gloss */}
            <linearGradient id="rightGlare" x1="80%" y1="10%" x2="20%" y2="80%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            {/* Bevel lighting filter */}
            <filter id="glassRefraction" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceAlpha" stdDeviation="6" result="blur" />
              <feOffset dx="-3" dy="-4" result="offset" />
              <feSpecularLighting in="blur" surfaceScale="5" specularConstant="1.2" specularExponent="22" result="specular">
                <fePointLight x="180" y="100" z="260" />
              </feSpecularLighting>
              <feComposite in="specular" in2="SourceAlpha" operator="in" result="specular" />
              <feComposite in="SourceGraphic" in2="specular" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" />
            </filter>
          </defs>

          {/* Main 3D Heart Silhouette */}
          <path
            d="M 250 420
               C 220 385 100 295 65 210
               C 35 135 75 60 160 60
               C 210 60 238 95 250 120
               C 262 95 290 60 340 60
               C 425 60 465 135 435 210
               C 400 295 280 385 250 420 Z"
            fill="url(#innerRefraction)"
            filter="url(#glassRefraction)"
            className="transition-all duration-300"
          />

          {/* Translucent glass depth overlay */}
          <path
            d="M 250 420
               C 220 385 100 295 65 210
               C 35 135 75 60 160 60
               C 210 60 238 95 250 120
               C 262 95 290 60 340 60
               C 425 60 465 135 435 210
               C 400 295 280 385 250 420 Z"
            fill="url(#heartGlassBody)"
            opacity="0.8"
            style={{ mixBlendMode: 'screen' }}
          />

          {/* Iridescent outer glass rim */}
          <path
            d="M 250 415
               C 222 380 105 293 72 212
               C 44 140 82 68 160 68
               C 207 68 234 99 250 125
               C 266 99 293 68 340 68
               C 418 68 456 140 428 212
               C 395 293 278 380 250 415 Z"
            fill="none"
            stroke="url(#lavenderReflect)"
            strokeWidth="5"
            strokeOpacity="0.75"
            filter="blur(1px)"
          />

          {/* Deep inner refraction crescent / bottom glass thickness */}
          <path
            d="M 120 230
               C 150 320 220 375 250 395
               C 280 375 350 320 380 230
               C 365 300 290 365 250 375
               C 210 365 135 300 120 230 Z"
            fill="#FFFFFF"
            opacity="0.45"
            style={{ mixBlendMode: 'overlay' }}
          />

          {/* Top Left Specular Gleam (Gloss highlight) */}
          <path
            d="M 125 105
               C 145 85 175 80 195 90
               C 210 98 220 115 225 135
               C 215 132 190 125 170 125
               C 145 125 130 115 125 105 Z"
            fill="url(#topGlare)"
            opacity="0.9"
            filter="blur(1.5px)"
          />

          {/* Left curvature glass reflection streak */}
          <path
            d="M 85 175
               C 70 215 90 270 145 325
               C 130 280 105 235 110 185
               C 112 170 102 165 85 175 Z"
            fill="#FFFFFF"
            opacity="0.55"
            filter="blur(2px)"
          />

          {/* Right Top Specular Gleam */}
          <path
            d="M 370 100
               C 395 110 410 135 415 165
               C 405 150 385 140 365 142
               C 350 144 345 135 345 125
               C 345 112 355 102 370 100 Z"
            fill="url(#rightGlare)"
            opacity="0.8"
            filter="blur(1.5px)"
          />

          {/* Tiny twinkling star sparkles inside glass */}
          <g transform="translate(180, 160) scale(0.6)">
            <path
              d="M 0,-18 Q 0,0 18,0 Q 0,0 0,18 Q 0,0 -18,0 Q 0,0 0,-18 Z"
              fill="#FFFFFF"
              opacity="0.85"
            />
          </g>
          <g transform="translate(325, 210) scale(0.45)">
            <path
              d="M 0,-18 Q 0,0 18,0 Q 0,0 0,18 Q 0,0 -18,0 Q 0,0 0,-18 Z"
              fill="#FFFFFF"
              opacity="0.9"
            />
          </g>
        </svg>

        {/* Center glass reflection pulse */}
        <div 
          className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full pointer-events-none opacity-40 mix-blend-overlay filter blur-md"
          style={{ background: 'radial-gradient(circle, #ffffff 0%, transparent 70%)' }}
        />
      </motion.div>
    </div>
  );
};
