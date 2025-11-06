import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { MessageCircle, Smartphone, RotateCcw } from 'lucide-react';

interface OTPInputProps {
  phone: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onAlternativeMethod: () => void;
  isLoading: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({ 
  phone, 
  onVerify, 
  onResend, 
  onAlternativeMethod, 
  isLoading 
}) => {
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOTPChange = (value: string) => {
    setOtp(value);
    setError('');
    
    if (value.length === 6) {
      // Auto-verify when 6 digits are entered
      onVerify(value);
    }
  };

  const handleResend = () => {
    setTimeLeft(60);
    setCanResend(false);
    setError('');
    onResend();
  };

  const formatPhone = (phoneNumber: string) => {
    // New format: +41******972-5 (show first 3, hide middle, show last 3)
    if (phoneNumber.length > 8) {
      const clean = phoneNumber.replace(/\+/, '');
      const first3 = clean.substring(clean.length - 2); // Last 2 digits
      const last3 = clean.substring(0, 3); // First 3 digits (country code part)
      return `+${last3}******${first3}`;
    }
    return phoneNumber;
  };

  return (
    <div className="space-y-6">
      {/* Header with WhatsApp Icon */}
      <div className="text-center space-y-2">
        <div className="w-20 h-20 bg-[#25D366] rounded-full flex items-center justify-center mx-auto shadow-lg">
          <svg viewBox="0 0 24 24" className="w-12 h-12 text-white" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          קוד אימות
        </h1>
        <p className="text-muted-foreground">
          קוד נשלח דרך WhatsApp ל {formatPhone(phone)}
        </p>
      </div>

      {/* OTP Input */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-center" dir="ltr">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={handleOTPChange}
                disabled={isLoading}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        {/* Resend */}
        <div className="text-center">
          {canResend ? (
            <Button
              variant="ghost"
              onClick={handleResend}
              disabled={isLoading}
              className="text-primary"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t('auth.resendCode')}
            </Button>
          ) : (
            <p className="text-muted-foreground text-sm">
              {t('auth.resendIn')} {timeLeft}s
            </p>
          )}
        </div>
      </div>
    </div>
  );
};