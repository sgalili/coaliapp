import { useState } from "react";
import { MapPin, Calendar, GraduationCap, Briefcase, Award, ExternalLink, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EditableField } from "@/components/EditableField";
import { Badge } from "@/components/ui/badge";

interface BioData {
  experience: string;
  education: string;
  achievements: string;
  expertise: string[];
  socialLinks: { platform: string; url: string; }[];
  professionalBackground: string;
  communityInvolvement: string;
  publicInfluence: string;
}

interface ProfileBioSectionProps {
  bioData: BioData;
  isOwnProfile: boolean;
  onUpdate: (field: keyof BioData, value: any) => void;
  className?: string;
}

export const ProfileBioSection = ({ 
  bioData, 
  isOwnProfile, 
  onUpdate, 
  className = "" 
}: ProfileBioSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const BioSection = ({ 
    title, 
    icon: Icon, 
    value, 
    field, 
    placeholder, 
    type = "text" 
  }: {
    title: string;
    icon: any;
    value: string;
    field: keyof BioData;
    placeholder: string;
    type?: "text" | "textarea";
  }) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="w-4 h-4" />
        <span>{title}</span>
      </div>
      {isOwnProfile ? (
        <EditableField
          value={value}
          onSave={(newValue) => onUpdate(field, newValue)}
          type={type}
          placeholder={placeholder}
          className="text-sm text-right leading-relaxed"
          maxLength={type === "textarea" ? 500 : 200}
        />
      ) : (
        <p className="text-sm text-right leading-relaxed">
          {value || <span className="text-muted-foreground italic">לא צוין</span>}
        </p>
      )}
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {isOwnProfile && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">מידע מקצועי ואישי</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? "סיום עריכה" : "עריכה"}
          </Button>
        </div>
      )}

      <div className="grid gap-6">
        <BioSection
          title="רקע מקצועי"
          icon={Briefcase}
          value={bioData.professionalBackground}
          field="professionalBackground"
          placeholder="תאר את הרקע המקצועי שלך..."
          type="textarea"
        />

        <BioSection
          title="השכלה"
          icon={GraduationCap}
          value={bioData.education}
          field="education"
          placeholder="תואר, מוסד לימודים, שנת סיום..."
          type="textarea"
        />

        <BioSection
          title="ניסיון מקצועי"
          icon={Briefcase}
          value={bioData.experience}
          field="experience"
          placeholder="תפקידים קודמים, ניסיון רלוונטי..."
          type="textarea"
        />

        <BioSection
          title="מעורבות קהילתית"
          icon={Award}
          value={bioData.communityInvolvement}
          field="communityInvolvement"
          placeholder="פעילות קהילתית, התנדבות, ארגונים..."
          type="textarea"
        />

        <BioSection
          title="השפעה ציבורית"
          icon={Award}
          value={bioData.publicInfluence}
          field="publicInfluence"
          placeholder="פרסומים, הרצאות, הכרה ציבורית..."
          type="textarea"
        />

        <BioSection
          title="הישגים וכישורים"
          icon={Award}
          value={bioData.achievements}
          field="achievements"
          placeholder="פרסים, הסמכות, הישגים מיוחדים..."
          type="textarea"
        />

        {/* Expertise Tags */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <GraduationCap className="w-4 h-4" />
            <span>תחומי מומחיות</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {bioData.expertise.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {isOwnProfile && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => {
                  const newSkill = prompt("הוסף תחום מומחיות:");
                  if (newSkill) {
                    onUpdate("expertise", [...bioData.expertise, newSkill]);
                  }
                }}
              >
                + הוסף
              </Button>
            )}
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <ExternalLink className="w-4 h-4" />
            <span>קישורים חברתיים ומקצועיים</span>
          </div>
          <div className="space-y-2">
            {bioData.socialLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <ExternalLink className="w-3 h-3 text-muted-foreground" />
                <a 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  {link.platform}
                </a>
              </div>
            ))}
            {isOwnProfile && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => {
                  const platform = prompt("שם הפלטפורמה:");
                  const url = prompt("קישור:");
                  if (platform && url) {
                    onUpdate("socialLinks", [...bioData.socialLinks, { platform, url }]);
                  }
                }}
              >
                + הוסף קישור
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};