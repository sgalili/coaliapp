import React, { createContext, useContext, useState, useEffect } from 'react';

interface Channel {
  id: string | null;
  name: string;
  description: string;
  logo_url: string;
  is_public: boolean;
  member_count: number | null;
  categories: string[];
}

interface ChannelContextType {
  selectedChannel: Channel;
  setSelectedChannel: (channel: Channel) => void;
  availableChannels: Channel[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  showChannelIndicator: boolean;
  setShowChannelIndicator: (show: boolean) => void;
  isLoading: boolean;
}

const defaultChannel: Channel = {
  id: null,
  name: 'Coali',
  description: 'All Public Content',
  logo_url: '/coali-logo.webp',
  is_public: true,
  member_count: null,
  categories: ['הכל', 'פוליטיקה', 'טכנולוגיה', 'כלכלה', 'חברה', 'בריאות', 'תרבות'],
};

const demoChannels: Channel[] = [
  defaultChannel,
  {
    id: 'channel-economy',
    name: 'ערוץ כלכלה',
    description: 'Economy & Finance Channel',
    logo_url: '📊',
    is_public: true,
    member_count: 2340,
    categories: ['הכל', 'שוק ההון', 'נדל"ן', 'מטבעות דיגיטליים', 'כלכלה עולמית', 'סטארטאפים'],
  },
  {
    id: 'channel-tech',
    name: 'ערוץ היי-טק',
    description: 'Technology & Innovation',
    logo_url: '💻',
    is_public: true,
    member_count: 1850,
    categories: ['הכל', 'AI', 'Startups', 'Coding', 'Cybersecurity', 'Hardware'],
  },
  {
    id: 'channel-news',
    name: 'ערוץ חדשות',
    description: 'Breaking News & Current Events',
    logo_url: '📰',
    is_public: true,
    member_count: 3120,
    categories: ['הכל', 'פוליטיקה', 'ביטחון', 'עולם', 'מקומי'],
  },
  {
    id: 'channel-company-alpha',
    name: 'חברת אלפא',
    description: 'Company Alpha Internal',
    logo_url: '🏢',
    is_public: false,
    member_count: 50,
    categories: ['Announcements', 'HR', 'Projects', 'Social'],
  },
  {
    id: 'channel-friends',
    name: 'קבוצת חברים',
    description: 'Friends Group',
    logo_url: '👥',
    is_public: false,
    member_count: 12,
    categories: ['הכל', 'אישי', 'תכנון אירועים'],
  },
];

const ChannelContext = createContext<ChannelContextType | undefined>(undefined);

export const ChannelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedChannel, setSelectedChannelState] = useState<Channel>(defaultChannel);
  const [selectedCategory, setSelectedCategoryState] = useState<string>('הכל');
  const [showChannelIndicator, setShowChannelIndicatorState] = useState<boolean>(true);
  const [availableChannels] = useState<Channel[]>(demoChannels);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved channel and category from localStorage on mount
  useEffect(() => {
    const savedChannelId = localStorage.getItem('selected_channel_id');
    const savedCategory = localStorage.getItem('selected_category');
    
    if (savedChannelId) {
      const savedChannel = demoChannels.find(ch => ch.id === savedChannelId);
      if (savedChannel) {
        setSelectedChannelState(savedChannel);
      }
    }
    
    if (savedCategory) {
      setSelectedCategoryState(savedCategory);
    }
  }, []);

  const setSelectedChannel = (channel: Channel) => {
    setIsLoading(true);
    
    // Save to localStorage
    if (channel.id) {
      localStorage.setItem('selected_channel_id', channel.id);
    } else {
      localStorage.removeItem('selected_channel_id');
    }
    
    // Show indicator when channel changes
    setShowChannelIndicatorState(true);
    
    // Simulate loading
    setTimeout(() => {
      setSelectedChannelState(channel);
      setIsLoading(false);
    }, 300);
  };

  const setSelectedCategory = (category: string) => {
    setSelectedCategoryState(category);
    // Save to localStorage
    localStorage.setItem('selected_category', category);
  };

  const setShowChannelIndicator = (show: boolean) => {
    setShowChannelIndicatorState(show);
  };

  return (
    <ChannelContext.Provider
      value={{
        selectedChannel,
        setSelectedChannel,
        availableChannels,
        selectedCategory,
        setSelectedCategory,
        showChannelIndicator,
        setShowChannelIndicator,
        isLoading,
      }}
    >
      {children}
    </ChannelContext.Provider>
  );
};

export const useChannel = () => {
  const context = useContext(ChannelContext);
  if (context === undefined) {
    throw new Error('useChannel must be used within a ChannelProvider');
  }
  return context;
};
