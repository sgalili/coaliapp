import { useState } from "react";
import { Check, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useChannel } from "@/contexts/ChannelContext";

export const ChannelSelector = () => {
  const { selectedChannel, setSelectedChannel, availableChannels } = useChannel();
  const [isOpen, setIsOpen] = useState(false);

  const publicChannels = availableChannels.filter(ch => ch.is_public && ch.id !== null);
  const privateChannels = availableChannels.filter(ch => !ch.is_public);

  const handleSelectChannel = (channel: any) => {
    setSelectedChannel(channel);
    setIsOpen(false);
  };

  return (
    <>
      {/* Channel Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all",
          selectedChannel.id === null
            ? "bg-gradient-to-br from-primary to-watch border-2 border-primary shadow-md"
            : "bg-card border-2 border-primary shadow-md"
        )}
      >
        {selectedChannel.logo_url}
      </button>

      {/* Channel Dropdown Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-background w-full md:max-w-lg md:rounded-t-2xl md:rounded-lg overflow-hidden max-h-[80vh] overflow-y-auto animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background">
              <h3 className="text-lg font-semibold text-foreground">בחר ערוץ</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4">
              {/* Coali Main */}
              <button
                onClick={() => handleSelectChannel(availableChannels[0])}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-xl transition-colors mb-4",
                  selectedChannel.id === null
                    ? "bg-primary/10 border-2 border-primary"
                    : "bg-card border border-border hover:bg-muted/30"
                )}
              >
                <div className="text-3xl">{availableChannels[0].logo_url}</div>
                <div className="flex-1 text-right">
                  <div className="flex items-center gap-2 justify-end">
                    <p className="font-semibold text-foreground">{availableChannels[0].name}</p>
                    {selectedChannel.id === null && <Check className="w-5 h-5 text-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{availableChannels[0].description}</p>
                </div>
              </button>

              {/* Public Channels */}
              {publicChannels.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2 px-1">ערוצים ציבוריים:</p>
                  <div className="space-y-2">
                    {publicChannels.map(channel => (
                      <button
                        key={channel.id}
                        onClick={() => handleSelectChannel(channel)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
                          selectedChannel.id === channel.id
                            ? "bg-primary/10 border-2 border-primary"
                            : "bg-card border border-border hover:bg-muted/30"
                        )}
                      >
                        <div className="text-3xl">{channel.logo_url}</div>
                        <div className="flex-1 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <p className="font-semibold text-foreground">{channel.name}</p>
                            {selectedChannel.id === channel.id && <Check className="w-5 h-5 text-primary" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{channel.description}</p>
                          <p className="text-xs text-muted-foreground">{channel.member_count?.toLocaleString()} חברים</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Private Channels */}
              {privateChannels.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-muted-foreground mb-2 px-1">הערוצים הפרטיים שלי:</p>
                  <div className="space-y-2">
                    {privateChannels.map(channel => (
                      <button
                        key={channel.id}
                        onClick={() => handleSelectChannel(channel)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl transition-colors",
                          selectedChannel.id === channel.id
                            ? "bg-primary/10 border-2 border-primary"
                            : "bg-card border border-border hover:bg-muted/30"
                        )}
                      >
                        <div className="text-3xl">{channel.logo_url}</div>
                        <div className="flex-1 text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <p className="font-semibold text-foreground">{channel.name}</p>
                            {selectedChannel.id === channel.id && <Check className="w-5 h-5 text-primary" />}
                          </div>
                          <p className="text-xs text-muted-foreground">{channel.description}</p>
                          <p className="text-xs text-muted-foreground">{channel.member_count} חברים</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Create Channel Button */}
              <button className="w-full flex items-center gap-3 p-4 bg-muted hover:bg-muted/80 rounded-xl transition-colors border border-dashed border-border">
                <Plus className="w-6 h-6 text-muted-foreground" />
                <p className="font-medium text-foreground">צור ערוץ חדש</p>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
