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
    
    if (value.length === 4) {
      // Auto-verify when 4 digits are entered
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
    // Hide middle digits for privacy
    if (phoneNumber.length > 6) {
      return phoneNumber.substring(0, 4) + '****' + phoneNumber.substring(phoneNumber.length - 2);
    }
    return phoneNumber;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <MessageCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          {t('auth.verificationCode')}
        </h1>
        <p className="text-muted-foreground">
          {t('auth.codeSentWhatsApp')} {formatPhone(phone)}
        </p>
      </div>

      {/* OTP Input */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex justify-center" dir="ltr">
              <InputOTP
                maxLength={4}
                value={otp}
                onChange={handleOTPChange}
                disabled={isLoading}
              >
                <InputOTPGroup className="gap-2">
                  <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                  <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
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

        {/* Alternative method */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={onAlternativeMethod}
            disabled={isLoading}
            className="w-full"
          >
            <Smartphone className="w-4 h-4 mr-2" />
            {t('auth.receiveSMS')}
          </Button>
        </div>
      </div>
    </div>
  );
};