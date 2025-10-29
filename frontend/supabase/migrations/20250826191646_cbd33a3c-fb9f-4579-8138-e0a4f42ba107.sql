-- Ensure required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create referral codes table
CREATE TABLE public.referral_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  max_uses INTEGER DEFAULT 10,
  current_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create trust intents table for trusting unregistered users
CREATE TABLE public.trust_intents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  truster_user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  target_phone_hash TEXT NOT NULL,
  referral_code TEXT NOT NULL REFERENCES public.referral_codes(code) ON DELETE CASCADE,
  is_consumed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  consumed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(target_phone_hash, truster_user_id)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trust_intents ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- RLS Policies for referral_codes
CREATE POLICY "Users can view their own referral codes" 
ON public.referral_codes 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own referral codes" 
ON public.referral_codes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own referral codes" 
ON public.referral_codes 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for trust_intents
CREATE POLICY "Users can view their own trust intents" 
ON public.trust_intents 
FOR SELECT 
USING (auth.uid() = truster_user_id);

CREATE POLICY "Users can insert their own trust intents" 
ON public.trust_intents 
FOR INSERT 
WITH CHECK (auth.uid() = truster_user_id);

CREATE POLICY "Users can update their own trust intents" 
ON public.trust_intents 
FOR UPDATE 
USING (auth.uid() = truster_user_id);

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists_check BOOLEAN;
BEGIN
  LOOP
    -- Generate 8 character alphanumeric code
    code := upper(substring(md5(random()::text) from 1 for 8));
    
    -- Check if code already exists
    SELECT EXISTS(SELECT 1 FROM public.referral_codes WHERE referral_codes.code = code) INTO exists_check;
    
    -- Exit loop if code is unique
    IF NOT exists_check THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to create profile and referral code automatically
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
BEGIN
  -- Generate unique referral code
  new_code := public.generate_referral_code();
  
  -- Insert profile
  INSERT INTO public.profiles (user_id, first_name, last_name, phone)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', '')
  );
  
  -- Insert referral code
  INSERT INTO public.referral_codes (user_id, code)
  VALUES (NEW.id, new_code);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to create profile and referral code on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to validate invitation code
CREATE OR REPLACE FUNCTION public.validate_invitation_code(invitation_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  code_record RECORD;
BEGIN
  -- Check if code exists and is valid
  SELECT * INTO code_record 
  FROM public.referral_codes 
  WHERE code = invitation_code 
    AND is_active = true 
    AND current_uses < max_uses;
  
  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to check if phone has trust intent
CREATE OR REPLACE FUNCTION public.has_trust_for_phone_hash(phone_hash TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS(
    SELECT 1 FROM public.trust_intents 
    WHERE target_phone_hash = phone_hash 
      AND is_consumed = false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to consume invitation code
CREATE OR REPLACE FUNCTION public.consume_invitation(invitation_code TEXT, new_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  code_record RECORD;
BEGIN
  -- Get and lock the referral code record
  SELECT * INTO code_record 
  FROM public.referral_codes 
  WHERE code = invitation_code 
    AND is_active = true 
    AND current_uses < max_uses
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Increment usage count
  UPDATE public.referral_codes 
  SET current_uses = current_uses + 1,
      updated_at = now()
  WHERE code = invitation_code;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to consume trust intent
CREATE OR REPLACE FUNCTION public.consume_trust(phone_hash TEXT, new_user_id UUID)
RETURNS TEXT AS $$
DECLARE
  trust_record RECORD;
  used_code TEXT;
BEGIN
  -- Get the most recent unconsumed trust intent for this phone hash
  SELECT * INTO trust_record 
  FROM public.trust_intents 
  WHERE target_phone_hash = phone_hash 
    AND is_consumed = false
  ORDER BY created_at DESC
  LIMIT 1
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN NULL;
  END IF;
  
  used_code := trust_record.referral_code;
  
  -- Mark trust intent as consumed
  UPDATE public.trust_intents 
  SET is_consumed = true,
      consumed_at = now()
  WHERE id = trust_record.id;
  
  -- Also consume the referral code
  PERFORM public.consume_invitation(used_code, new_user_id);
  
  RETURN used_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to create trust intent
CREATE OR REPLACE FUNCTION public.create_trust_intent(
  target_phone_hash TEXT,
  truster_id UUID DEFAULT auth.uid()
)
RETURNS BOOLEAN AS $$
DECLARE
  truster_code TEXT;
BEGIN
  -- Get truster's referral code
  SELECT code INTO truster_code 
  FROM public.referral_codes 
  WHERE user_id = truster_id 
    AND is_active = true
  LIMIT 1;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Insert or update trust intent (upsert to handle "last click wins")
  INSERT INTO public.trust_intents (truster_user_id, target_phone_hash, referral_code)
  VALUES (truster_id, target_phone_hash, truster_code)
  ON CONFLICT (target_phone_hash, truster_user_id) 
  DO UPDATE SET 
    referral_code = EXCLUDED.referral_code,
    created_at = now(),
    is_consumed = false,
    consumed_at = NULL;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to get user's referral code
CREATE OR REPLACE FUNCTION public.get_my_referral_code()
RETURNS TEXT AS $$
DECLARE
  user_code TEXT;
BEGIN
  SELECT code INTO user_code 
  FROM public.referral_codes 
  WHERE user_id = auth.uid() 
    AND is_active = true
  LIMIT 1;
  
  RETURN user_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to hash phone number consistently
CREATE OR REPLACE FUNCTION public.hash_phone(phone_number TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN encode(digest(phone_number, 'sha256'), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_referral_codes_updated_at
  BEFORE UPDATE ON public.referral_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();