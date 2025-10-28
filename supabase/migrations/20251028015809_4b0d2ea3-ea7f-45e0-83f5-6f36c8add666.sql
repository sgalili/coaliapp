-- Create demo_messages table for demo mode messaging
CREATE TABLE IF NOT EXISTS public.demo_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_read BOOLEAN DEFAULT false,
  conversation_id TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE public.demo_messages ENABLE ROW LEVEL SECURITY;

-- Demo users can view their messages
CREATE POLICY "Demo users can view their messages"
  ON public.demo_messages
  FOR SELECT
  USING (is_demo_user(auth.uid()) AND (auth.uid() = sender_id OR auth.uid() = recipient_id));

-- Demo users can send messages
CREATE POLICY "Demo users can send messages"
  ON public.demo_messages
  FOR INSERT
  WITH CHECK (is_demo_user(auth.uid()) AND auth.uid() = sender_id);

-- Demo users can update their messages (mark as read)
CREATE POLICY "Demo users can update their messages"
  ON public.demo_messages
  FOR UPDATE
  USING (is_demo_user(auth.uid()) AND (auth.uid() = sender_id OR auth.uid() = recipient_id));

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_demo_messages_conversation ON public.demo_messages(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_demo_messages_recipient ON public.demo_messages(recipient_id, is_read);