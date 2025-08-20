import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Phone, ChevronDown } from 'lucide-react';
import { countries, Country, detectCountryFromTimezone } from '@/lib/countries';

interface PhoneInputProps {
  onSubmit: (phone: string) => void;
  isLoading: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ onSubmit, isLoading }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(detectCountryFromTimezone());
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const validatePhone = (phoneNumber: string) => {
    // Basic phone validation - can be enhanced
    const phoneRegex = /^[\d\s-()]{7,}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      setError(t('auth.phoneRequired'));
      return;
    }
    
    if (!validatePhone(phoneNumber)) {
      setError(t('auth.invalidPhone'));
      return;
    }
    
    setError('');
    const fullPhone = `${selectedCountry.dialCode}${phoneNumber.replace(/\s/g, '')}`;
    onSubmit(fullPhone);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setError('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <Phone className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {t('auth.welcome')}
        </h1>
        <p className="text-muted-foreground">
          {t('auth.enterPhone')}
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <div className="flex rtl:flex-row-reverse">
                {/* Phone Number Input */}
                <Input
                  type="tel"
                  placeholder="6 12 34 56 78"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="text-lg py-3 rounded-r-none rtl:rounded-l-none rtl:rounded-r-md border-r-0 rtl:border-l-0 rtl:border-r flex-1"
                  disabled={isLoading}
                />

                {/* Country Selector */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 px-3 rounded-l-none rtl:rounded-r-none rtl:rounded-l-md bg-card"
                      disabled={isLoading}
                      type="button"
                    >
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-72 max-h-60 overflow-y-auto bg-popover border shadow-lg z-50"
                    align="end"
                  >
                    {countries.map((country) => (
                      <DropdownMenuItem
                        key={country.code}
                        onClick={() => handleCountrySelect(country)}
                        className="flex items-center gap-3 cursor-pointer hover:bg-accent"
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span className="text-sm font-medium w-12">{country.dialCode}</span>
                        <span className="text-sm flex-1">{country.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}
            </div>
            
            <Button 
              type="submit" 
              className="w-full py-3 text-lg" 
              disabled={isLoading}
            >
              {isLoading ? t('auth.sending') : t('auth.receiveCode')}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Terms */}
      <div className="text-center space-y-2">
        <p className="text-xs text-muted-foreground leading-relaxed">
          {t('auth.termsAccept')}{' '}
          <a href="/terms" className="text-primary underline">
            {t('auth.termsOfService')}
          </a>{' '}
          {t('auth.and')}{' '}
          <a href="/privacy" className="text-primary underline">
            {t('auth.privacyPolicy')}
          </a>
        </p>
      </div>
    </div>
  );
};