import { useState, useEffect, useRef } from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChannel } from "@/contexts/ChannelContext";

export const ChannelSelector = ({ onCreateChannel }: { onCreateChannel?: () => void }) => {
  const { selectedChannel, setSelectedChannel, availableChannels, selectedCategory, setSelectedCategory } = useChannel();
  const [isOpen, setIsOpen] = useState(false);
  const [myChannels, setMyChannels] = useState<any[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const currentUserId = localStorage.getItem('authenticated_user_id');

  const publicChannels = availableChannels.filter(ch => ch.is_public && ch.id !== null);
  const privateChannels = availableChannels.filter(ch => !ch.is_public);
  
  // Load user's approved channels
  useEffect(() => {
    if (currentUserId && currentUserId !== 'demo-user') {
      loadMyChannels();
    }
  }, [currentUserId]);
  
  const loadMyChannels = async () => {
    try {
      const { data } = await supabase
        .from('channel_requests')
        .select('*')
        .eq('user_id', currentUserId)
        .eq('status', 'approved');
      
      console.log('📺 My approved channels:', data?.length || 0);
      setMyChannels(data || []);
    } catch (error) {
      console.error('Error loading my channels:', error);
    }
  };

  const handleSelectChannel = (channel: any) => {
    console.log('=== CHANNEL SWITCH START ===');
    console.log('Previous channel:', selectedChannel.name, selectedChannel.id);
    console.log('New channel:', channel.name, channel.id);
    console.log('Previous category:', selectedCategory);
    console.log('New channel categories:', channel.categories);
    
    setSelectedChannel(channel);
    
    // Get first category
    const firstCategory = channel.categories[0] || 'הכל';
    console.log('First category of new channel:', firstCategory);
    
    // Force set category
    setSelectedCategory(firstCategory);
    console.log('Category set to:', firstCategory);
    console.log('=== CHANNEL SWITCH END ===');
    
    setIsOpen(false);
  };

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative">
      {/* Channel Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-lg flex items-center justify-center transition-all overflow-hidden bg-transparent border-0"
      >
        {selectedChannel.logo_url.startsWith('/') ? (
          <img src={selectedChannel.logo_url} alt={selectedChannel.name} className="w-full h-full object-contain" />
        ) : (
          <span className="text-xl">{selectedChannel.logo_url}</span>
        )}
      </button>

      {/* Channel Dropdown Menu - Scrollable with proper positioning */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full right-0 mt-2 bg-background border border-border rounded-xl shadow-xl w-[280px] z-50 overflow-hidden">
            {/* Scrollable container with max height to avoid nav bar */}
            <div 
              className="max-h-[60vh] overflow-y-auto"
              style={{ 
                maxHeight: 'calc(100vh - 200px)',
                paddingBottom: '20px'
              }}
            >
              {/* Coali Main */}
              <button
                onClick={() => handleSelectChannel(availableChannels[0])}
                className={cn(
                  "w-full flex items-center gap-3 p-3 transition-colors",
                  selectedChannel.id === null
                    ? "bg-primary/10 border-b-2 border-primary"
                    : "hover:bg-muted/30 border-b border-border"
                )}
                dir="rtl"
              >
                {availableChannels[0].logo_url.startsWith('/') ? (
                  <img src={availableChannels[0].logo_url} alt={availableChannels[0].name} className="w-8 h-8 rounded-lg object-contain" />
                ) : (
                  <div className="text-2xl">{availableChannels[0].logo_url}</div>
                )}
                <p className="font-semibold text-sm text-foreground">{availableChannels[0].name}</p>
                {selectedChannel.id === null && <Check className="w-4 h-4 text-primary ml-auto" />}
              </button>

              {/* Public Channels */}
              {publicChannels.length > 0 && (
                <>
                  <div className="px-3 py-2 bg-muted/30 text-right">
                    <p className="text-xs font-medium text-muted-foreground">ערוצים ציבוריים</p>
                  </div>
                  {publicChannels.map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => handleSelectChannel(channel)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 transition-colors border-b border-border/50",
                        selectedChannel.id === channel.id
                          ? "bg-primary/10"
                          : "hover:bg-muted/30"
                      )}
                      dir="rtl"
                    >
                      {channel.logo_url.startsWith('/') ? (
                        <img src={channel.logo_url} alt={channel.name} className="w-8 h-8 rounded-lg object-contain" />
                      ) : (
                        <div className="text-2xl">{channel.logo_url}</div>
                      )}
                      <p className="font-semibold text-sm text-foreground">{channel.name}</p>
                      {selectedChannel.id === channel.id && <Check className="w-4 h-4 text-primary ml-auto" />}
                    </button>
                  ))}
                </>
              )}

              {/* Private Channels */}
              {privateChannels.length > 0 && (
                <>
                  <div className="px-3 py-2 bg-muted/30 text-right">
                    <p className="text-xs font-medium text-muted-foreground">הערוצים הפרטיים שלי</p>
                  </div>
                  {privateChannels.map(channel => (
                    <button
                      key={channel.id}
                      onClick={() => handleSelectChannel(channel)}
                      className={cn(
                        "w-full flex items-center gap-3 p-3 transition-colors border-b border-border/50",
                        selectedChannel.id === channel.id
                          ? "bg-primary/10"
                          : "hover:bg-muted/30"
                      )}
                      dir="rtl"
                    >
                      {channel.logo_url.startsWith('/') ? (
                        <img src={channel.logo_url} alt={channel.name} className="w-8 h-8 rounded-lg object-contain" />
                      ) : (
                        <div className="text-2xl">{channel.logo_url}</div>
                      )}
                      <p className="font-semibold text-sm text-foreground">{channel.name}</p>
                      {selectedChannel.id === channel.id && <Check className="w-4 h-4 text-primary ml-auto" />}
                    </button>
                  ))}
                </>
              )}

              {/* Create Channel Button */}
              <button 
                onClick={() => {
                  setIsOpen(false);
                  onCreateChannel?.();
                }}
                className="w-full flex items-center justify-between gap-3 p-3 bg-muted/50 hover:bg-muted transition-colors" 
                dir="rtl"
              >
                <p className="text-sm font-medium text-foreground text-right flex-1">צור ערוץ חדש</p>
                <Plus className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
