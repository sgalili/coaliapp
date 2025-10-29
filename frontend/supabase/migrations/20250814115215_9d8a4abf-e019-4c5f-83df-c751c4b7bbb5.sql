-- Create polls table
CREATE TABLE public.polls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  news_id TEXT NOT NULL,
  question TEXT NOT NULL,
  poll_type TEXT NOT NULL CHECK (poll_type IN ('yes_no', 'rating_1_5', 'multiple_choice')),
  options JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create poll_votes table
CREATE TABLE public.poll_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  option_selected TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;

-- Create policies for polls (readable by everyone)
CREATE POLICY "Polls are viewable by everyone" 
ON public.polls 
FOR SELECT 
USING (is_active = true);

-- Create policies for poll_votes
CREATE POLICY "Users can view all poll votes" 
ON public.poll_votes 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own poll votes" 
ON public.poll_votes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Prevent multiple votes per user per poll
CREATE UNIQUE INDEX idx_poll_votes_user_poll 
ON public.poll_votes(poll_id, user_id);

-- Create index for better performance
CREATE INDEX idx_polls_news_id ON public.polls(news_id);
CREATE INDEX idx_poll_votes_poll_id ON public.poll_votes(poll_id);

-- Add trigger for updated_at timestamp
CREATE TRIGGER update_polls_updated_at
BEFORE UPDATE ON public.polls
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for poll votes to show live results
ALTER TABLE public.poll_votes REPLICA IDENTITY FULL;
ALTER publication supabase_realtime ADD TABLE public.poll_votes;