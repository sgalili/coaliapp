import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Shield, Users, FileText, CheckCircle, Clock, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface KYCVerificationProps {
  currentLevel: 1 | 2 | 3;
  onUpgrade: (level: 2 | 3, data: any) => void;
  onClose: () => void;
}

export const KYCVerification = ({ currentLevel, onUpgrade, onClose }: KYCVerificationProps) => {
  const [selectedLevel, setSelectedLevel] = useState<2 | 3>(currentLevel === 1 ? 2 : 3);
  const [formData, setFormData] = useState<any>({});
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});

  const levels = {
    2: {
      title: "אימות קהילתי",
      description: "קבל אימות מ-3 חברי קהילה מאומתים",
      requirements: [
        "בחר 3 חברי קהילה שיאמתו אותך",
        "כל מאמת חייב להיות עם KYC רמה 2 ומעלה",
        "תהליך האימות יארך עד 48 שעות"
      ],
      color: "blue"
    },
    3: {
      title: "אימות מלא",
      description: "אימות זהות מלא עם מסמכים רשמיים",
      requirements: [
        "העלה תמונה של תעודת זהות",
        "העלה תמונה של עצמך אוחז את התעודה",
        "מלא פרטים אישיים",
        "תהליך האימות יארך עד 3 ימי עסקים"
      ],
      color: "emerald"
    }
  };

  const handleFileUpload = (key: string, file: File) => {
    setFiles(prev => ({ ...prev, [key]: file }));
  };

  const handleSubmit = () => {
    if (selectedLevel === 2) {
      // Community verification
      onUpgrade(2, {
        type: "community",
        validators: formData.validators || [],
        message: formData.message || ""
      });
    } else {
      // Document verification
      onUpgrade(3, {
        type: "document",
        personalInfo: formData.personalInfo || {},
        documents: files
      });
    }
  };

  const isFormValid = () => {
    if (selectedLevel === 2) {
      return formData.validators && formData.validators.length >= 3;
    } else {
      return files.idCard && files.selfieWithId && formData.personalInfo?.firstName && formData.personalInfo?.lastName;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" dir="rtl">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">שדרוג KYC</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Level Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(levels).map(([level, info]) => {
              const levelNum = parseInt(level) as 2 | 3;
              const isDisabled = levelNum <= currentLevel;
              const isSelected = selectedLevel === levelNum;
              
              return (
                <Card 
                  key={level}
                  className={cn(
                    "p-4 cursor-pointer transition-all",
                    isDisabled && "opacity-50 cursor-not-allowed",
                    isSelected && `ring-2 ring-${info.color}-500`,
                    !isDisabled && !isSelected && "hover:bg-accent"
                  )}
                  onClick={() => !isDisabled && setSelectedLevel(levelNum)}
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Shield className={cn("w-5 h-5", `text-${info.color}-500`)} />
                      <h3 className="font-semibold">{info.title}</h3>
                      {isDisabled && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{info.description}</p>
                    <ul className="text-xs space-y-1">
                      {info.requirements.map((req, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-muted-foreground">•</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Form for selected level */}
          {selectedLevel === 2 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                אימות קהילתי
              </h3>
              
              <div>
                <Label>בחר 3 חברי קהילה שיאמתו אותך</Label>
                <div className="space-y-2 mt-2">
                  {[0, 1, 2].map((index) => (
                    <Input
                      key={index}
                      placeholder={`מאמת ${index + 1} - שם משתמש או אימייל`}
                      className="text-right"
                      value={formData.validators?.[index] || ""}
                      onChange={(e) => {
                        const validators = [...(formData.validators || [])];
                        validators[index] = e.target.value;
                        setFormData(prev => ({ ...prev, validators }));
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label>הודעה למאמתים (אופציונלי)</Label>
                <Textarea
                  placeholder="כתב הודעה קצרה למאמתים..."
                  className="text-right"
                  value={formData.message || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>
            </div>
          )}

          {selectedLevel === 3 && (
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-500" />
                אימות מסמכים
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>שם פרטי</Label>
                  <Input
                    placeholder="שם פרטי"
                    className="text-right"
                    value={formData.personalInfo?.firstName || ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, firstName: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <Label>שם משפחה</Label>
                  <Input
                    placeholder="שם משפחה"
                    className="text-right"
                    value={formData.personalInfo?.lastName || ""}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      personalInfo: { ...prev.personalInfo, lastName: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>תעודת זהות</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('idCard', e.target.files[0])}
                      className="hidden"
                      id="idCard"
                    />
                    <label htmlFor="idCard" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {files.idCard ? files.idCard.name : "העלה תמונה של תעודת הזהות"}
                      </p>
                    </label>
                  </div>
                </div>

                <div>
                  <Label>תמונה עם תעודת זהות</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload('selfieWithId', e.target.files[0])}
                      className="hidden"
                      id="selfieWithId"
                    />
                    <label htmlFor="selfieWithId" className="cursor-pointer">
                      <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        {files.selfieWithId ? files.selfieWithId.name : "העלה תמונה שלך עם תעודת הזהות"}
                      </p>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={onClose} variant="outline" className="flex-1">
              ביטול
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!isFormValid()}
              className="flex-1"
            >
              <Clock className="w-4 h-4 ml-2" />
              שלח לאימות
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};