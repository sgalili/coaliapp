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
    id: 'channel-10-economy',
    name: 'ערוץ 10 | ערוץ הכלכלה',
    description: 'Channel 10 Economy News',
    logo_url: '/channel-10-logo.jpeg',
    is_public: true,
    member_count: 45000,
    categories: ['הכל', 'שוק ההון', 'נדל׳ן', 'טכנולוגיה', 'קריפטו'],
  },
  {
    id: 'channel-achva',
    name: 'המכללה האקדמית אחווה',
    description: 'Achva Academic College',
    logo_url: '/achva-logo-new.jpeg',
    is_public: true,
    member_count: 8500,
    categories: ['הכל', 'לימודים', 'מחקר', 'אירועים', 'סטודנטים', 'הרצאות'],
  },
  {
    id: 'channel-maccabi',
    name: 'מכבי צבי יבנה',
    description: 'Maccabi Tzvi Yavne Basketball',
    logo_url: '/maccabi-logo.jpeg',
    is_public: false,
    member_count: 12000,
    categories: ['הכל', 'משחקים', 'תוצאות', 'שחקנים', 'חדשות', 'אוהדים'],
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
