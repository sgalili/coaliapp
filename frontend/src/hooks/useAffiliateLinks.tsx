import { useState, useEffect } from 'react';

const AFFILIATE_KEY = 'coalichain_affiliate_ref';

export interface AffiliateData {
  ref: string;
  timestamp: number;
  source?: string;
}

export const useAffiliateLinks = () => {
  const [affiliateData, setAffiliateData] = useState<AffiliateData | null>(null);

  // Load affiliate data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(AFFILIATE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setAffiliateData(parsed);
      } catch (error) {
        console.error('Error parsing affiliate data:', error);
        localStorage.removeItem(AFFILIATE_KEY);
      }
    }
  }, []);

  const saveAffiliateLink = (ref: string, source?: string) => {
    const data: AffiliateData = {
      ref,
      timestamp: Date.now(),
      source
    };
    
    localStorage.setItem(AFFILIATE_KEY, JSON.stringify(data));
    setAffiliateData(data);
  };

  const getAffiliateRef = (): string | null => {
    return affiliateData?.ref || null;
  };

  const clearAffiliateData = () => {
    localStorage.removeItem(AFFILIATE_KEY);
    setAffiliateData(null);
  };

  const isAffiliateValid = (maxAgeHours: number = 24 * 7): boolean => {
    if (!affiliateData) return false;
    
    const maxAge = maxAgeHours * 60 * 60 * 1000; // Convert to milliseconds
    const age = Date.now() - affiliateData.timestamp;
    
    return age <= maxAge;
  };

  return {
    affiliateData,
    saveAffiliateLink,
    getAffiliateRef,
    clearAffiliateData,
    isAffiliateValid
  };
};