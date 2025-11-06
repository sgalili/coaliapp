/**
 * City Autocomplete Component
 * Auto-suggest Israeli cities with "Other" option
 */

import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { ISRAELI_CITIES, searchCities } from '@/data/israeliCities';
import { cn } from '@/lib/utils';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value,
  onChange,
  placeholder = "עיר מגורים",
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);
  const [showOtherInput, setShowOtherInput] = useState(value === 'אחר' || (value && !ISRAELI_CITIES.includes(value)));
  const [otherCity, setOtherCity] = useState(showOtherInput ? value : '');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredCities = searchCities(searchQuery);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value && ISRAELI_CITIES.includes(value)) {
      setSearchQuery(value);
      setShowOtherInput(false);
    } else if (value && value !== 'אחר') {
      setShowOtherInput(true);
      setOtherCity(value);
    }
  }, [value]);

  const handleSelect = (city: string) => {
    if (city === 'אחר') {
      setShowOtherInput(true);
      setSearchQuery('אחר');
      setOtherCity('');
      onChange('');
    } else {
      setSearchQuery(city);
      onChange(city);
      setShowOtherInput(false);
    }
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setIsOpen(true);
    
    if (!showOtherInput) {
      onChange(val);
    }
  };

  const handleOtherChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setOtherCity(val);
    onChange(val);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <Input
        value={showOtherInput ? 'אחר' : searchQuery}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className={className}
        disabled={showOtherInput}
      />

      {/* Dropdown */}
      {isOpen && !showOtherInput && filteredCities.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-[200px] overflow-y-auto">
          {filteredCities.map((city, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelect(city)}
              className={cn(
                "w-full px-4 py-2 text-right hover:bg-muted transition-colors",
                city === 'אחר' && "border-t border-border text-primary font-medium"
              )}
            >
              {city}
            </button>
          ))}
        </div>
      )}

      {/* Custom City Input */}
      {showOtherInput && (
        <div className="mt-2 space-y-2">
          <Input
            value={otherCity}
            onChange={handleOtherChange}
            placeholder="הזן שם עיר..."
            className="text-right"
          />
          <button
            type="button"
            onClick={() => {
              setShowOtherInput(false);
              setSearchQuery('');
              setOtherCity('');
              onChange('');
            }}
            className="text-sm text-primary hover:underline"
          >
            בחר מהרשימה
          </button>
        </div>
      )}
    </div>
  );
};
