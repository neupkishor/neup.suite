
'use client';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Helper to convert hex to HSL
const hexToHsl = (hex: string): [number, number, number] | null => {
  if (!hex) return null;
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};


const DEFAULT_APP_NAME = 'Neup.Suite';
const DEFAULT_PRIMARY_COLOR = '#3399FF'; // Corresponds to HSL 210 100% 60% approx.

interface BrandingContextType {
  appName: string;
  setAppName: (name: string) => void;
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export const BrandingProvider = ({ children }: { children: ReactNode }) => {
  const [appName, setAppNameState] = useState(DEFAULT_APP_NAME);
  const [primaryColor, setPrimaryColorState] = useState(DEFAULT_PRIMARY_COLOR);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const storedName = localStorage.getItem('appName');
    const storedColor = localStorage.getItem('primaryColor');
    if (storedName) setAppNameState(storedName);
    if (storedColor) setPrimaryColorState(storedColor);
  }, []);

  useEffect(() => {
      if (isMounted) {
        const hsl = hexToHsl(primaryColor);
        if (hsl) {
            document.documentElement.style.setProperty('--primary', `${hsl[0]} ${hsl[1]}% ${hsl[2]}%`);
        }
      }
  }, [primaryColor, isMounted]);

  const setAppName = (name: string) => {
    setAppNameState(name);
    localStorage.setItem('appName', name);
  };

  const setPrimaryColor = (color: string) => {
    setPrimaryColorState(color);
    localStorage.setItem('primaryColor', color);
  };

  if (!isMounted) {
    return null; // or a loading spinner
  }

  return (
    <BrandingContext.Provider value={{ appName, setAppName, primaryColor, setPrimaryColor }}>
      {children}
    </BrandingContext.Provider>
  );
};

export const useBranding = () => {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
};
