import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: "ltr" | "rtl";
}

const languages: Language[] = [
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱", direction: "rtl" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇵🇸", direction: "rtl" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", direction: "ltr" },
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸", direction: "ltr" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", direction: "ltr" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", direction: "ltr" },
  { code: "am", name: "Amharic", nativeName: "አማርኛ", flag: "🇪🇹", direction: "ltr" },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "🇷🇴", direction: "ltr" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", direction: "ltr" },
  { code: "yi", name: "Yiddish", nativeName: "ייִדיש", flag: "🕍", direction: "rtl" }
];

const LanguageSettingsPage = () => {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState("he"); // Default to Hebrew
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get current language from localStorage or default to Hebrew
    const currentLang = localStorage.getItem("app-language") || "he";
    setSelectedLanguage(currentLang);
    
    // Set document direction based on current language
    const currentLanguageObj = languages.find(lang => lang.code === currentLang);
    if (currentLanguageObj) {
      document.dir = currentLanguageObj.direction;
    }
  }, []);

  const handleLanguageChange = (languageCode: string) => {
    setSelectedLanguage(languageCode);
  };

  const handleSaveLanguage = async () => {
    setIsLoading(true);
    
    try {
      // Save to localStorage
      localStorage.setItem("app-language", selectedLanguage);
      
      // Update document direction
      const selectedLangObj = languages.find(lang => lang.code === selectedLanguage);
      if (selectedLangObj) {
        document.dir = selectedLangObj.direction;
      }
      
      // Show success toast
      toast({
        title: selectedLanguage === "he" ? "השפה נשמרה בהצלחה" : "Language saved successfully",
        description: selectedLanguage === "he" ? "השפה שונתה והוחלה על האפליקציה" : "Language has been changed and applied to the app",
      });

      // Navigate back after a short delay
      setTimeout(() => {
        navigate(-1);
      }, 1000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save language preference",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isRTL = selectedLanguage === "he" || selectedLanguage === "ar" || selectedLanguage === "yi";

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className={`flex items-center gap-4 p-4 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="h-10 w-10"
            aria-label={isRTL ? "חזור" : "Back"}
          >
            <ArrowLeft className={`h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
          </Button>
          <h1 className={`text-xl font-bold ${isRTL ? "text-right" : "text-left"}`}>
            {selectedLanguage === "he" ? "הגדרות שפה" : "Language Settings"}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        <Card>
          <CardHeader className={isRTL ? "text-right" : "text-left"}>
            <CardTitle className={`flex items-center gap-2 ${isRTL ? "justify-end" : "justify-start"}`}>
              <Globe className="h-5 w-5 text-primary" />
              {selectedLanguage === "he" ? "בחר שפה" : "Choose Language"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={selectedLanguage} onValueChange={handleLanguageChange}>
              <div className="space-y-3">
                {languages.map((language) => {
                  const isSelected = selectedLanguage === language.code;
                  return (
                    <div key={language.code}>
                      <Label
                        htmlFor={language.code}
                        className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
                          isSelected ? "border-primary bg-primary/5" : "border-border"
                        } ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                          <RadioGroupItem value={language.code} id={language.code} />
                          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
                            <span className="text-2xl">{language.flag}</span>
                            <div className={isRTL ? "text-right" : "text-left"}>
                              <div className="font-medium" dir={language.direction}>
                                {language.nativeName}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {language.name}
                              </div>
                            </div>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className={`flex gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Button
            onClick={handleSaveLanguage}
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              selectedLanguage === "he" ? "שומר..." : "Saving..."
            ) : (
              selectedLanguage === "he" ? "שמור שפה" : "Save Language"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex-1"
          >
            {selectedLanguage === "he" ? "ביטול" : "Cancel"}
          </Button>
        </div>

        {/* Info */}
        <Card className="bg-muted/50">
          <CardContent className={`p-4 ${isRTL ? "text-right" : "text-left"}`}>
            <p className="text-sm text-muted-foreground">
              {selectedLanguage === "he" 
                ? "השפה תשפיע על כל הטקסטים באפליקציה. שינוי זה ייכנס לתוקף מיד."
                : "The language will affect all texts in the application. This change will take effect immediately."
              }
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LanguageSettingsPage;