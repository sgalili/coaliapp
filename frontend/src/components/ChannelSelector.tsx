import { useState, useEffect, useRef } from "react";
import { Check, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChannel } from "@/contexts/ChannelContext";

export const ChannelSelector = () => {
  const { selectedChannel, setSelectedChannel, availableChannels } = useChannel();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const publicChannels = availableChannels.filter(ch => ch.is_public && ch.id !== null);
  const privateChannels = availableChannels.filter(ch => !ch.is_public);

  const handleSelectChannel = (channel: any) => {
    setSelectedChannel(channel);
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
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center transition-all overflow-hidden",
          selectedChannel.id === null
            ? "bg-white border-2 border-primary shadow-md"
            : "bg-card border-2 border-primary shadow-md"
        )}
      >
        {selectedChannel.logo_url.startsWith('/') ? (
          <img src={selectedChannel.logo_url} alt={selectedChannel.name} className="w-full h-full object-contain p-1" />
        ) : (
          <span className="text-xl">{selectedChannel.logo_url}</span>
        )}
      </button>

      {/* Channel Dropdown Menu - Opens below icon, aligned to right */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-background border border-border rounded-xl shadow-xl w-[280px] z-50 overflow-hidden">
          {/* Coali Main */}
          <button
            onClick={() => handleSelectChannel(availableChannels[0])}
            className={cn(
              "w-full flex items-center justify-end gap-3 p-3 transition-colors",
              selectedChannel.id === null
                ? "bg-primary/10 border-b-2 border-primary"
                : "hover:bg-muted/30 border-b border-border"
            )}
          >
            <div className="text-right">
              <div className="flex items-center gap-2 justify-end">
                {selectedChannel.id === null && <Check className="w-4 h-4 text-primary" />}
                <p className="font-semibold text-sm text-foreground">{availableChannels[0].name}</p>
              </div>
              <p className="text-xs text-muted-foreground">{availableChannels[0].description}</p>
            </div>
            {availableChannels[0].logo_url.startsWith('/') ? (
              <img src={availableChannels[0].logo_url} alt={availableChannels[0].name} className="w-8 h-8 object-contain flex-shrink-0" />
            ) : (
              <div className="text-2xl flex-shrink-0">{availableChannels[0].logo_url}</div>
            )}
          </button>

          {/* Public Channels */}
          {publicChannels.length > 0 && (
            <>
              <div className="px-3 py-2 bg-muted/30">
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
                >
                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {selectedChannel.id === channel.id && <Check className="w-4 h-4 text-primary" />}
                      <p className="font-semibold text-sm text-foreground">{channel.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground text-right">{channel.description}</p>
                    <p className="text-xs text-muted-foreground text-right">{channel.member_count?.toLocaleString()} חברים</p>
                  </div>
                  <div className="text-2xl">{channel.logo_url}</div>
                </button>
              ))}
            </>
          )}

          {/* Private Channels */}
          {privateChannels.length > 0 && (
            <>
              <div className="px-3 py-2 bg-muted/30">
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
                >
                  <div className="flex-1 text-right">
                    <div className="flex items-center gap-2 justify-end">
                      {selectedChannel.id === channel.id && <Check className="w-4 h-4 text-primary" />}
                      <p className="font-semibold text-sm text-foreground">{channel.name}</p>
                    </div>
                    <p className="text-xs text-muted-foreground text-right">{channel.description}</p>
                    <p className="text-xs text-muted-foreground text-right">{channel.member_count} חברים</p>
                  </div>
                  <div className="text-2xl">{channel.logo_url}</div>
                </button>
              ))}
            </>
          )}

          {/* Create Channel Button */}
          <button className="w-full flex items-center gap-3 p-3 bg-muted/50 hover:bg-muted transition-colors">
            <Plus className="w-5 h-5 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">צור ערוץ חדש</p>
          </button>
        </div>
      )}
    </div>
  );
};
