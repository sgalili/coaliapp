-- Table de journalisation des OTP WhatsApp
CREATE TABLE IF NOT EXISTS public.whatsapp_otps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_e164 TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'sent', -- sent | verified | expired | failed
  attempts INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  ip_address TEXT,
  user_agent TEXT,
  vendor_message_id TEXT, -- id du message UltraMsg le cas échéant
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index pour recherches efficaces
CREATE INDEX IF NOT EXISTS idx_whatsapp_otps_phone_expires
  ON public.whatsapp_otps (phone_e164, expires_at);

CREATE INDEX IF NOT EXISTS idx_whatsapp_otps_created_at
  ON public.whatsapp_otps (created_at);

-- Sécurité: activer RLS et ne créer aucune policy => accès interdit au client
ALTER TABLE public.whatsapp_otps ENABLE ROW LEVEL SECURITY;