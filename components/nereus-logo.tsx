import React from 'react';

interface NereusLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function NereusLogo({ size = 'md', className = '' }: NereusLogoProps) {
  const sizeMap = {
    sm: 24,
    md: 32,
    lg: 40
  };
  
  const dimension = sizeMap[size];
  
  return (
    <svg 
      width={dimension} 
      height={dimension} 
      viewBox="0 0 40 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle - Ocean depth */}
      <circle 
        cx="20" 
        cy="20" 
        r="18" 
        fill="url(#oceanGradient)"
        opacity="0.15"
      />
      
      {/* Trident - Symbol of Nereus */}
      <path 
        d="M20 8 L20 28 M15 12 L15 20 L20 24 M25 12 L25 20 L20 24" 
        stroke="url(#brandGradient)" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        style={{ filter: 'drop-shadow(0 0 4px rgba(59,130,246,0.4))' }}
      />
      
      {/* Wave elements */}
      <path 
        d="M8 30 Q12 28 16 30 T24 30 T32 30" 
        stroke="url(#waveGradient)" 
        strokeWidth="2" 
        strokeLinecap="round"
        opacity="0.6"
      />
      
      <defs>
        <linearGradient id="oceanGradient" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#0EA5E9" />
        </linearGradient>
        
        <linearGradient id="brandGradient" x1="20" y1="8" x2="20" y2="28">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        
        <linearGradient id="waveGradient" x1="8" y1="30" x2="32" y2="30">
          <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0.4" />
          <stop offset="50%" stopColor="#3B82F6" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0EA5E9" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  );
}
