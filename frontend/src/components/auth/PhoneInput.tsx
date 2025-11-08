import React, { useState } from 'react';
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
import { Shield, ChevronDown, HelpCircle } from 'lucide-react';
import { countries, Country, detectCountryFromTimezone } from '@/lib/countries';
import { CoaliOnboarding } from '../CoaliOnboarding';
import { supabase } from '@/integrations/supabase/client';

interface PhoneInputProps {
  onSubmit: (phone: string) => void;
  isLoading: boolean;
}

// Helper pour formater en +972...
const toE164 = (dialCode: string, local: string) => {
  const d = dialCode.startsWith('+') ? dialCode : `+${dialCode}`;
  const n = (local || '').replace(/\D/g, '').replace(/^0+/, ''); // enlève le zéro initial
  return `${d}${n}`;
};

export const PhoneInput: React.FC<PhoneInputProps> = ({ onSubmit, isLoading }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(detectCountryFromTimezone());
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { t } = useTranslation();

  const validatePhone = (phoneNumber: string) => {
    // Basic phone validation - can be enhanced
    const phoneRegex = /^[\d\s-()]{7,}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber.trim()) {
      setError('נא להזין מספר טלפון');
      return;
    }
    
    if (!validatePhone(phoneNumber)) {
      setError('מספר טלפון לא תקין');
      return;
    }
    
    setError('');
    const fullPhone = toE164(selectedCountry.dialCode, phoneNumber);

    try {
      setBusy(true);
      
      // 1. Check if user already exists
      const { data: existingUser, error: userCheckError } = await supabase
        .from('profiles')
        .select('user_id, phone, first_name, is_verified')
        .eq('phone', fullPhone)
        .maybeSingle();
      
      if (existingUser && existingUser.is_verified) {
        console.log('✅ Existing user found');
      }
      
      // 2. Send OTP via backend
      const backendUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/otp/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: fullPhone })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to send OTP');
      }

      const result = await response.json();
      console.log('✅ OTP sent:', result);
      
      // If in debug mode, show OTP
      if (result.otp) {
        console.log('🔑 DEBUG OTP:', result.otp);
      }

      onSubmit(fullPhone);
      
    } catch (err: any) {
      console.error('Phone submit error:', err);
      setError(err?.message || 'שגיאה לא צפויה');
    } finally {
      setBusy(false);
    }
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setError('');
  };

  return (
    <div className="space-y-8">
      {/* Header with Coali Logo */}
      <div className="text-center space-y-4 pt-4">
        <div className="flex justify-center">
          <img 
            src="/coali-logo.webp" 
            alt="Coali" 
            className="w-24 h-24 object-contain"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">
            ברוכים הבאים ל-Coali
          </h1>
          <p className="text-sm text-muted-foreground">
            הרשת הראשונה של אמון דיגיטלי
          </p>
        </div>
      </div>
            {t('auth.subtitle')}
          </p>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-sm text-muted-foreground hover:text-foreground"
            onClick={() => setShowOnboarding(true)}
          >
            <HelpCircle className="w-4 h-4 mr-1" />
            {t('auth.whatIsCoali')}
          </Button>
        </div>
      </div>

      {/* Auth Form */}
      <div className="space-y-4">
        <p className="text-center text-muted-foreground">
          {t('auth.enterPhone')}
        </p>
        
        {/* Form */}
        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex" dir="ltr">
                  {/* Country Selector */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 px-3 rounded-r-none border-r-0 bg-card"
                        disabled={isLoading || busy}
                        type="button"
                      >
                        <span className="text-lg">{selectedCountry.flag}</span>
                        <span className="text-sm font-medium">{selectedCountry.dialCode}</span>
                        <ChevronDown className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      className="w-72 max-h-60 overflow-y-auto bg-popover border shadow-lg z-50 [direction:ltr]"
                      align="start"
                    >
                      {countries.map((country) => (
                        <DropdownMenuItem
                          key={country.code}
                          onClick={() => handleCountrySelect(country)}
                          className="flex items-center gap-3 cursor-pointer hover:bg-accent"
                        >
                          <span className="text-lg">{country.flag}</span>
                          <span className="text-sm font-medium w-12">{country.dialCode}</span>
                          <span className="text-sm flex-1 text-left">{country.name}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Phone Number Input */}
                  <Input
                    type="tel"
                    placeholder=""
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="text-lg py-3 rounded-l-none flex-1"
                    disabled={isLoading || busy}
                    dir="ltr"
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>
              
              <Button 
                type="submit" 
                className="w-full py-3 text-lg" 
                disabled={isLoading || busy}
              >
                {(isLoading || busy) ? t('auth.sending') : t('auth.receiveCode')}
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

      {/* Coali Onboarding */}
      {showOnboarding && (
        <CoaliOnboarding
          onClose={() => setShowOnboarding(false)}
          onGetStarted={() => {
            setShowOnboarding(false);
            // Focus will naturally return to the phone input form
          }}
        />
      )}
    </div>
  );
};