import { useState, useEffect } from 'react';

export interface AuthenticityData {
  city?: string;
  country?: string;
  localTime: string;
  isLocationAvailable: boolean;
  isVerifying: boolean;
  hasLocationPermission: boolean;
  isDirectRecording: boolean;
}

export const useAuthenticity = () => {
  const [authenticityData, setAuthenticityData] = useState<AuthenticityData>({
    localTime: new Date().toLocaleTimeString('he-IL', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    }),
    isLocationAvailable: false,
    isVerifying: false,
    hasLocationPermission: false,
    isDirectRecording: false,
  });

  const formatLocation = async (lat: number, lng: number): Promise<{city?: string, country?: string}> => {
    try {
      // Using a free geocoding service - in production, use a proper API
      const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=he`);
      const data = await response.json();
      
      return {
        city: data.city || data.locality || 'Tel Aviv', // Mock example
        country: data.countryName || 'Israel' // Mock example
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      return {};
    }
  };

  const updateTime = () => {
    setAuthenticityData(prev => ({
      ...prev,
      localTime: new Date().toLocaleTimeString('he-IL', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      })
    }));
  };

  const requestLocationPermission = async () => {
    setAuthenticityData(prev => ({ ...prev, isVerifying: true }));
    
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        });
      });

      const { latitude, longitude } = position.coords;
      const location = await formatLocation(latitude, longitude);
      
      setAuthenticityData(prev => ({
        ...prev,
        city: location.city,
        country: location.country,
        isLocationAvailable: true,
        isVerifying: false,
        hasLocationPermission: true,
        isDirectRecording: true, // Set to true when recording directly
      }));
    } catch (error) {
      console.error('Location error:', error);
      setAuthenticityData(prev => ({
        ...prev,
        isLocationAvailable: false,
        isVerifying: false,
        hasLocationPermission: false,
      }));
    }
  };

  // Check if location is already available or request it
  useEffect(() => {
    if (navigator.geolocation) {
      requestLocationPermission();
    }
    
    // Update time every minute
    const timeInterval = setInterval(updateTime, 60000);
    
    return () => clearInterval(timeInterval);
  }, []);

  const getAuthenticityStatus = (): 'authentic' | 'partial' | 'unavailable' => {
    if (authenticityData.isLocationAvailable && authenticityData.city && authenticityData.country && authenticityData.isDirectRecording) {
      return 'authentic';
    }
    if (authenticityData.hasLocationPermission) {
      return 'partial';
    }
    return 'unavailable';
  };

  const getStatusText = (): string => {
    const status = getAuthenticityStatus();
    
    if (authenticityData.isVerifying) {
      return 'מאמת מיקום ⏳';
    }
    
    switch (status) {
      case 'authentic':
        return `אותנטי ✓ | 📍 ${authenticityData.city}, ${authenticityData.country} - ${authenticityData.localTime}`;
      case 'partial':
        return `חלקי ⚠️ | 📍 מיקום זמין - ${authenticityData.localTime}`;
      case 'unavailable':
        return `חסר מיקום ❌ | ${authenticityData.localTime}`;
      default:
        return `📍 ${authenticityData.localTime}`;
    }
  };

  return {
    authenticityData,
    getAuthenticityStatus,
    getStatusText,
    requestLocationPermission,
    updateTime
  };
};