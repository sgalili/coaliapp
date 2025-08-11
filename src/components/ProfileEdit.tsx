import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProfileEditProps {
  user: any;
  onSave: (updatedUser: any) => void;
  onCancel: () => void;
}

export const ProfileEdit = ({ user, onSave, onCancel }: ProfileEditProps) => {
  const [formData, setFormData] = useState({
    username: user.username,
    bio: user.bio,
    location: user.location,
    expertise: [...user.expertise],
    socialLinks: user.socialLinks || {}
  });

  const [newExpertise, setNewExpertise] = useState("");

  const handleAddExpertise = () => {
    if (newExpertise.trim() && !formData.expertise.includes(newExpertise.trim())) {
      setFormData(prev => ({
        ...prev,
        expertise: [...prev.expertise, newExpertise.trim()]
      }));
      setNewExpertise("");
    }
  };

  const handleRemoveExpertise = (expertise: string) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.filter(exp => exp !== expertise)
    }));
  };

  const handleSocialLinkChange = (platform: string, url: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: url
      }
    }));
  };

  const handleSave = () => {
    onSave({
      ...user,
      ...formData
    });
  };

  return (
    <div className="space-y-6 p-6" dir="rtl">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">עריכת פרופיל</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            ביטול
          </Button>
          <Button onClick={handleSave}>
            שמירה
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="username">שם משתמש</Label>
          <Input
            id="username"
            value={formData.username}
            onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
            className="text-right"
          />
        </div>

        <div>
          <Label htmlFor="bio">תיאור</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            className="text-right min-h-[100px]"
            placeholder="ספר על עצמך..."
          />
        </div>

        <div>
          <Label htmlFor="location">מיקום</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            className="text-right"
            placeholder="עיר, מדינה"
          />
        </div>

        <div>
          <Label>תחומי מומחיות</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.expertise.map((exp, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {exp}
                <button
                  onClick={() => handleRemoveExpertise(exp)}
                  className="hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newExpertise}
              onChange={(e) => setNewExpertise(e.target.value)}
              placeholder="הוסף תחום מומחיות"
              className="text-right"
              onKeyDown={(e) => e.key === 'Enter' && handleAddExpertise()}
            />
            <Button onClick={handleAddExpertise} variant="outline" size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <Label>קישורים לרשתות חברתיות</Label>
          
          <div>
            <Label htmlFor="twitter" className="text-sm text-muted-foreground">טוויטר</Label>
            <Input
              id="twitter"
              value={formData.socialLinks.twitter || ""}
              onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
              placeholder="https://twitter.com/username"
              className="text-right"
            />
          </div>

          <div>
            <Label htmlFor="linkedin" className="text-sm text-muted-foreground">לינקדאין</Label>
            <Input
              id="linkedin"
              value={formData.socialLinks.linkedin || ""}
              onChange={(e) => handleSocialLinkChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/username"
              className="text-right"
            />
          </div>

          <div>
            <Label htmlFor="instagram" className="text-sm text-muted-foreground">אינסטגרם</Label>
            <Input
              id="instagram"
              value={formData.socialLinks.instagram || ""}
              onChange={(e) => handleSocialLinkChange('instagram', e.target.value)}
              placeholder="https://instagram.com/username"
              className="text-right"
            />
          </div>
        </div>
      </div>
    </div>
  );
};