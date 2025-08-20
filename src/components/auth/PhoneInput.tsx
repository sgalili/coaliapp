import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Phone } from 'lucide-react';

interface PhoneInputProps {
  onSubmit: (phone: string) => void;
  isLoading: boolean;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ onSubmit, isLoading }) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const validatePhone = (phoneNumber: string) => {
    // Basic phone validation - can be enhanced
    const phoneRegex = /^\+?[\d\s-()]{10,}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phone.trim()) {
      setError(t('auth.phoneRequired'));
      return;
    }
    
    if (!validatePhone(phone)) {
      setError(t('auth.invalidPhone'));
      return;
    }
    
    setError('');
    onSubmit(phone);
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
              <Input
                type="tel"
                placeholder="+33 6 12 34 56 78"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-lg py-3"
                disabled={isLoading}
              />
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