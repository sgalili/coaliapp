-- Complete database structure for fully functional app

-- Posts table for user content
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  title TEXT,
  content TEXT,
  video_url TEXT,
  thumbnail_url TEXT,
  category TEXT,
  domain TEXT,
  view_count INTEGER DEFAULT 0,
  zooz_earned INTEGER DEFAULT 0,
  trust_count INTEGER DEFAULT 0,
  watch_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  is_live BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User balances for ZOOZ
CREATE TABLE public.user_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE UNIQUE,
  zooz_balance INTEGER DEFAULT 1000,
  usd_value DECIMAL(10,2) DEFAULT 12.80,
  percentage_change DECIMAL(5,2) DEFAULT 2.3,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ZOOZ transactions
CREATE TABLE public.zooz_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  from_user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  to_user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('send', 'receive', 'reward', 'purchase', 'withdrawal')),
  description TEXT,
  note TEXT,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Trust relationships
CREATE TABLE public.trusts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  truster_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  trusted_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(truster_id, trusted_id, post_id)
);

-- Watch relationships
CREATE TABLE public.watches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  watcher_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  watched_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(watcher_id, watched_id, post_id)
);

-- Follow relationships
CREATE TABLE public.follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Comments on posts
CREATE TABLE public.comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  related_user_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  related_post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User expertise domains
CREATE TABLE public.user_expertise (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  level INTEGER DEFAULT 1 CHECK (level >= 1 AND level <= 5),
  verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, domain)
);

-- KYC verification
CREATE TABLE public.kyc_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE UNIQUE,
  level INTEGER DEFAULT 0 CHECK (level >= 0 AND level <= 3),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  documents JSONB,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Messages between users
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Storage buckets for media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES 
  ('videos', 'videos', true, 104857600, ARRAY['video/mp4', 'video/webm', 'video/quicktime']),
  ('images', 'images', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on all tables
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zooz_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trusts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_expertise ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for posts
CREATE POLICY "Posts are viewable by everyone" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Users can create their own posts" ON public.posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own posts" ON public.posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own posts" ON public.posts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_balances
CREATE POLICY "Users can view their own balance" ON public.user_balances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own balance" ON public.user_balances FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create balances" ON public.user_balances FOR INSERT WITH CHECK (true);

-- RLS Policies for zooz_transactions
CREATE POLICY "Users can view their own transactions" ON public.zooz_transactions 
  FOR SELECT USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "Users can create transactions" ON public.zooz_transactions FOR INSERT WITH CHECK (
  auth.uid() = from_user_id OR from_user_id IS NULL
);

-- RLS Policies for trusts
CREATE POLICY "Trusts are viewable by everyone" ON public.trusts FOR SELECT USING (true);
CREATE POLICY "Users can create trusts" ON public.trusts FOR INSERT WITH CHECK (auth.uid() = truster_id);
CREATE POLICY "Users can delete their own trusts" ON public.trusts FOR DELETE USING (auth.uid() = truster_id);

-- RLS Policies for watches
CREATE POLICY "Watches are viewable by everyone" ON public.watches FOR SELECT USING (true);
CREATE POLICY "Users can create watches" ON public.watches FOR INSERT WITH CHECK (auth.uid() = watcher_id);
CREATE POLICY "Users can delete their own watches" ON public.watches FOR DELETE USING (auth.uid() = watcher_id);

-- RLS Policies for follows
CREATE POLICY "Follows are viewable by everyone" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can create follows" ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);
CREATE POLICY "Users can delete their own follows" ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- RLS Policies for comments
CREATE POLICY "Comments are viewable by everyone" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own comments" ON public.comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own comments" ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "Users can view their own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_expertise
CREATE POLICY "Expertise is viewable by everyone" ON public.user_expertise FOR SELECT USING (true);
CREATE POLICY "Users can manage their expertise" ON public.user_expertise FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for kyc_verifications
CREATE POLICY "Users can view their own KYC" ON public.kyc_verifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own KYC" ON public.kyc_verifications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own KYC" ON public.kyc_verifications FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages" ON public.messages 
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their own messages" ON public.messages 
  FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Storage policies for videos
CREATE POLICY "Anyone can view videos" ON storage.objects FOR SELECT USING (bucket_id = 'videos');
CREATE POLICY "Authenticated users can upload videos" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'videos' AND auth.role() = 'authenticated');

-- Storage policies for images
CREATE POLICY "Anyone can view images" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');

-- Storage policies for avatars
CREATE POLICY "Anyone can view avatars" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
CREATE POLICY "Users can upload their own avatar" ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update their own avatar" ON storage.objects FOR UPDATE 
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Functions for ZOOZ transactions
CREATE OR REPLACE FUNCTION public.transfer_zooz(
  from_user_id UUID,
  to_user_id UUID,
  amount INTEGER,
  description TEXT DEFAULT NULL,
  note TEXT DEFAULT NULL,
  post_id UUID DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  from_balance INTEGER;
BEGIN
  -- Check sender's balance
  SELECT zooz_balance INTO from_balance 
  FROM public.user_balances 
  WHERE user_id = from_user_id;
  
  IF from_balance < amount THEN
    RETURN false;
  END IF;
  
  -- Update balances
  UPDATE public.user_balances SET zooz_balance = zooz_balance - amount WHERE user_id = from_user_id;
  UPDATE public.user_balances SET zooz_balance = zooz_balance + amount WHERE user_id = to_user_id;
  
  -- Record transaction
  INSERT INTO public.zooz_transactions (from_user_id, to_user_id, amount, transaction_type, description, note, post_id)
  VALUES (from_user_id, to_user_id, amount, 'send', description, note, post_id);
  
  RETURN true;
END;
$$;

-- Function to reward ZOOZ for actions
CREATE OR REPLACE FUNCTION public.reward_zooz(
  user_id UUID,
  amount INTEGER,
  reason TEXT,
  post_id UUID DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update balance
  UPDATE public.user_balances SET zooz_balance = zooz_balance + amount WHERE user_id = user_id;
  
  -- Record transaction
  INSERT INTO public.zooz_transactions (to_user_id, amount, transaction_type, description, post_id)
  VALUES (user_id, amount, 'reward', reason, post_id);
  
  RETURN true;
END;
$$;

-- Function to create notifications
CREATE OR REPLACE FUNCTION public.create_notification(
  user_id UUID,
  notification_type TEXT,
  title TEXT,
  message TEXT,
  related_user_id UUID DEFAULT NULL,
  related_post_id UUID DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  notification_id UUID;
BEGIN
  INSERT INTO public.notifications (user_id, type, title, message, related_user_id, related_post_id)
  VALUES (user_id, notification_type, title, message, related_user_id, related_post_id)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_balances_updated_at BEFORE UPDATE ON public.user_balances
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_kyc_verifications_updated_at BEFORE UPDATE ON public.kyc_verifications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create initial balance for existing user
INSERT INTO public.user_balances (user_id, zooz_balance, usd_value, percentage_change)
VALUES ('00000000-0000-0000-0000-000000000001'::uuid, 9957, 127.43, 2.3)
ON CONFLICT (user_id) DO NOTHING;

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.zooz_transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trusts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.watches;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;