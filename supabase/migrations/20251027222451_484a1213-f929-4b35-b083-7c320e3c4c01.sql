-- Create otp_verifications table
CREATE TABLE IF NOT EXISTS public.otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;

-- Create policy for service role to manage OTPs
CREATE POLICY "Service role can manage OTP verifications"
ON public.otp_verifications
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Create index for phone lookup
CREATE INDEX IF NOT EXISTS idx_otp_verifications_phone 
ON public.otp_verifications(phone_number);

-- Create index for expiry cleanup
CREATE INDEX IF NOT EXISTS idx_otp_verifications_expires 
ON public.otp_verifications(expires_at);