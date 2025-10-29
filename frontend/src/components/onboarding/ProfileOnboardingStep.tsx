import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Gift, Search, TrendingUp, Shield, GraduationCap, Heart, Smartphone, Palette } from 'lucide-react';
import { cn } from '@/lib/utils';

const domains = [
  { id: 'economy', name: 'כלכלה', icon: TrendingUp, color: 'green' },
  { id: 'security', name: 'ביטחון', icon: Shield, color: 'blue' },
  { id: 'education', name: 'חינוך', icon: GraduationCap, color: 'purple' },
  { id: 'health', name: 'רפואה', icon: Heart, color: 'red' },
  { id: 'tech', name: 'טכנולוגיה', icon: Smartphone, color: 'orange' },
  { id: 'culture', name: 'תרבות', icon: Palette, color: 'pink' },
  { id: 'law', name: 'משפטים', icon: Shield, color: 'blue' },
  { id: 'environment', name: 'סביבה', icon: Heart, color: 'green' },
  { id: 'business', name: 'עסקים', icon: TrendingUp, color: 'orange' },
  { id: 'science', name: 'מדע', icon: GraduationCap, color: 'purple' },
] as const;

interface ProfileOnboardingStepProps {
  onNext: (bio: string, selectedDomains: string[]) => void;
  isLoading?: boolean;
}

export const ProfileOnboardingStep: React.FC<ProfileOnboardingStepProps> = ({ 
  onNext, 
  isLoading = false 
}) => {
  const [bio, setBio] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation();

  const maxBioLength = 280;
  const maxDomains = 3;

  const filteredDomains = domains.filter(domain =>
    domain.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDomain = (domainId: string) => {
    if (selectedDomains.includes(domainId)) {
      setSelectedDomains(prev => prev.filter(id => id !== domainId));
    } else if (selectedDomains.length < maxDomains) {
      setSelectedDomains(prev => [...prev, domainId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext(bio.trim(), selectedDomains);
  };

  const canProceed = selectedDomains.length > 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with ZOOZ banner */}
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-4 rounded-xl border border-primary/20">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Gift className="w-6 h-6 text-primary animate-bounce" />
            <span className="text-xl font-bold text-primary">10 ZOOZ</span>
            <Gift className="w-6 h-6 text-primary animate-bounce" />
          </div>
          <h1 className="text-lg font-bold text-foreground">
            השלים את הפרופיל שלך וקבל 10 ZOOZ 🎁
          </h1>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bio Section */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground block">
                ספר/י קצת על עצמך
              </label>
              <div className="relative">
                <Textarea
                  placeholder="כמה מילים על הרקע שלך, התחומים שמעניינים אותך, או כל דבר שחשוב לך לשתף..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="min-h-[100px] resize-none"
                  maxLength={maxBioLength}
                  disabled={isLoading}
                />
                <div className="absolute bottom-2 left-3 text-xs text-muted-foreground">
                  {bio.length}/{maxBioLength}
                </div>
              </div>
            </div>

            {/* Domains Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-foreground">
                  בחר/י עד {maxDomains} תחומי מומחיות
                </label>
                <span className="text-xs text-muted-foreground">
                  {selectedDomains.length}/{maxDomains}
                </span>
              </div>

              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="חפש תחום..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10"
                  disabled={isLoading}
                />
              </div>

              {/* Domain Pills */}
              <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                {filteredDomains.map((domain) => {
                  const IconComponent = domain.icon;
                  const isSelected = selectedDomains.includes(domain.id);
                  const isDisabled = !isSelected && selectedDomains.length >= maxDomains;
                  
                  return (
                    <button
                      key={domain.id}
                      type="button"
                      onClick={() => !isDisabled && toggleDomain(domain.id)}
                      disabled={isDisabled || isLoading}
                      className={cn(
                        "transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100",
                        isSelected && "animate-scale-in"
                      )}
                    >
                      <Badge 
                        variant={isSelected ? "default" : "secondary"}
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-2 cursor-pointer select-none",
                          "hover:shadow-md transition-all duration-200",
                          isSelected && "ring-2 ring-primary/20 shadow-lg",
                          isDisabled && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <IconComponent className="w-3.5 h-3.5" />
                        <span className="text-sm font-medium">{domain.name}</span>
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full py-3 text-lg font-semibold"
              disabled={!canProceed || isLoading}
            >
              {isLoading ? 'שומר...' : 'הבא'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};