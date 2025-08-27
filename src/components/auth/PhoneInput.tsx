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
import { Shield, ChevronDown, HelpCircle, CheckCircle } from 'lucide-react';
import { countries, Country, detectCountryFromTimezone } from '@/lib/countries';
import { CoaliOnboarding } from '../CoaliOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PhoneInputProps {
  onSubmit: (phone: string) => void;
  isLoading: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ onSubmit, isLoading }) => {
  const [selectedCountry, setSelectedCountry] = useState<Country>(detectCountryFromTimezone());
  const [phoneNumber, setPhoneNumber] = useState('');
  const [error, setError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [whatsappStep, setWhatsappStep] = useState<'phone' | 'code' | 'verified'>('phone');
  const [whatsappCode, setWhatsappCode] = useState('');
  const [isWhatsappLoading, setIsWhatsappLoading] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const { t } = useTranslation();

  // Cooldown timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const validatePhone = (phoneNumber: string) => {
    // Basic phone validation - can be enhanced
    const phoneRegex = /^[\d\s-()]{7,}$/;
    return phoneRegex.test(phoneNumber);
  };

  // Send WhatsApp OTP
  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
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
    setIsWhatsappLoading(true);
    
    try {
      const fullPhone = `${selectedCountry.dialCode}${phoneNumber.replace(/\s/g, '')}`;
      
      const { data, error } = await supabase.functions.invoke('whatsapp-otp-send', {
        body: { phone: fullPhone }
      });
      
      if (error) {
        console.error('WhatsApp OTP send error:', error);
        setError('שגיאה בשליחת קוד WhatsApp');
        return;
      }
      
      if (data.error) {
        if (data.cooldown) {
          setCooldown(data.cooldown);
          setError(`יש להמתין ${data.cooldown} שניות לפני קוד חדש`);
        } else {
          setError(data.error);
        }
        return;
      }
      
      toast.success('קוד נשלח בהצלחה דרך WhatsApp');
      setWhatsappStep('code');
      setCooldown(data.cooldown || 60);
      
    } catch (error) {
      console.error('WhatsApp OTP error:', error);
      setError('שגיאה בשליחת קוד WhatsApp');
    } finally {
      setIsWhatsappLoading(false);
    }
  };

  // Verify WhatsApp OTP
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!whatsappCode || whatsappCode.length !== 4) {
      setError(t('auth.invalidCode'));
      return;
    }
    
    setError('');
    setIsVerifyingCode(true);
    
    try {
      const fullPhone = `${selectedCountry.dialCode}${phoneNumber.replace(/\s/g, '')}`;
      
      const { data, error } = await supabase.functions.invoke('whatsapp-otp-verify', {
        body: { 
          phone: fullPhone, 
          code: whatsappCode 
        }
      });
      
      if (error) {
        console.error('WhatsApp OTP verify error:', error);
        setError('שגיאה באימות קוד');
        return;
      }
      
      if (data.error) {
        setError(data.error);
        return;
      }
      
      toast.success(t('auth.codeVerified'));
      setWhatsappStep('verified');
      
    } catch (error) {
      console.error('WhatsApp verification error:', error);
      setError('שגיאה באימות קוד');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  // Continue to normal flow (SMS OTP)
  const handleContinueToLogin = () => {
    const fullPhone = `${selectedCountry.dialCode}${phoneNumber.replace(/\s/g, '')}`;
    onSubmit(fullPhone);
  };

  // Reset WhatsApp flow
  const handleRequestNewCode = () => {
    setWhatsappStep('phone');
    setWhatsappCode('');
    setError('');
    setCooldown(0);
  };

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setError('');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4 pt-4">
        <div className="w-20 h-20 bg-gradient-to-br from-primary to-trust rounded-full flex items-center justify-center mx-auto shadow-lg">
          <Shield className="w-10 h-10 text-white" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-trust bg-clip-text text-transparent">
            {t('auth.welcome')}
          </h1>
          <p className="text-lg font-medium text-muted-foreground">
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
        {whatsappStep === 'phone' && (
          <>
            <p className="text-center text-muted-foreground">
              {t('auth.enterPhone')}
            </p>
            
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleWhatsAppSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex" dir="ltr">
                      {/* Country Selector */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 px-3 rounded-r-none border-r-0 bg-card"
                            disabled={isWhatsappLoading}
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
                        placeholder="6 12 34 56 78"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="text-lg py-3 rounded-l-none flex-1"
                        disabled={isWhatsappLoading}
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
                    disabled={isWhatsappLoading || cooldown > 0}
                  >
                    {isWhatsappLoading ? t('auth.sendingWhatsApp') : 
                     cooldown > 0 ? `המתן ${cooldown}s` : 
                     t('auth.receiveCode')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </>
        )}

        {whatsappStep === 'code' && (
          <>
            <p className="text-center text-muted-foreground">
              הכניסו את הקוד בן 4 הספרות שנשלח לכם ב-WhatsApp
            </p>
            
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder={t('auth.codePlaceholder')}
                      value={whatsappCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                        setWhatsappCode(value);
                      }}
                      className="text-2xl text-center py-4 tracking-widest"
                      disabled={isVerifyingCode}
                      maxLength={4}
                      autoFocus
                    />
                    {error && (
                      <p className="text-sm text-destructive">{error}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Button 
                      type="submit" 
                      className="w-full py-3 text-lg" 
                      disabled={isVerifyingCode || whatsappCode.length !== 4}
                    >
                      {isVerifyingCode ? t('auth.verifyingCode') : 'אמת קוד'}
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={handleRequestNewCode}
                      disabled={cooldown > 0}
                    >
                      {cooldown > 0 ? `קוד חדש בעוד ${cooldown}s` : t('auth.requestNewCode')}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </>
        )}

        {whatsappStep === 'verified' && (
          <>
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-green-600">
                  {t('auth.codeVerified')}
                </h3>
                <p className="text-muted-foreground">
                  המשיכו עכשיו לתהליך ההתחברות הרגיל
                </p>
              </div>
            </div>
            
            <Card>
              <CardContent className="p-6">
                <Button 
                  onClick={handleContinueToLogin}
                  className="w-full py-3 text-lg"
                  disabled={isLoading}
                >
                  {isLoading ? t('auth.sending') : t('auth.continueToLogin')}
                </Button>
              </CardContent>
            </Card>
          </>
        )}

        {/* Terms - only show on phone step */}
        {whatsappStep === 'phone' && (
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
        )}
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