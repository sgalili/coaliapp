-- Create simple OTP table for WhatsApp verification
CREATE TABLE IF NOT EXISTS public.otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  otp TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;

-- Create basic policies (since this is server-side managed)
CREATE POLICY "Service role can manage OTPs" ON public.otps
FOR ALL USING (true) WITH CHECK (true);