import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, ArrowLeft, Shield } from "lucide-react";

interface KYCFormProps {
  onSubmit: (data: KYCData) => void;
  onBack: () => void;
}

interface KYCData {
  city: string;
  dateOfBirth: string;
  idNumber: string;
}

const cities = [
  "תל אביב", "ירושלים", "חיפה", "באר שבע", "פתח תקווה", "נתניה", 
  "אשדוד", "ראשון לציון", "בני ברק", "רמת גן", "אשקלון", "רחובות",
  "בת ים", "הרצליה", "כפר סבא", "חולון", "רעננה", "גבעתיים"
];

export const KYCForm = ({ onSubmit, onBack }: KYCFormProps) => {
  const [formData, setFormData] = useState<KYCData>({
    city: "",
    dateOfBirth: "",
    idNumber: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.city && formData.dateOfBirth && formData.idNumber) {
      onSubmit(formData);
    }
  };

  const isValid = formData.city && formData.dateOfBirth && formData.idNumber;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 !rounded-none" dir="rtl">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">אימות זהות - רמה 1</h1>
          <p className="text-muted-foreground">
            כדי ליצור תוכן ולתת אמון, עליך לעבור אימות זהות בסיסי
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* City Selection */}
          <div className="space-y-2">
            <Label htmlFor="city" className="text-right block">עיר מגורים</Label>
            <Select 
              value={formData.city} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
            >
              <SelectTrigger className="text-right" dir="rtl">
                <SelectValue placeholder="בחר עיר" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                {cities.map((city) => (
                  <SelectItem key={city} value={city} className="text-right">
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dob" className="text-right block">תאריך לידה</Label>
            <div className="text-right" dir="rtl">
              <Input
                id="dob"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                className="w-full"
                dir="ltr"
              />
            </div>
          </div>

          {/* ID Number */}
          <div className="space-y-2">
            <Label htmlFor="idNumber" className="text-right block">מספר תעודת זהות</Label>
            <Input
              id="idNumber"
              type="text"
              placeholder="123456789"
              value={formData.idNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, idNumber: e.target.value }))}
              className="text-right"
              maxLength={9}
              pattern="[0-9]*"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-4 h-4" />
              חזרה
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="flex-1 flex items-center justify-center gap-2"
            >
              המשך
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
        </form>

        {/* Info */}
        <div className="text-center text-sm text-muted-foreground">
          <p>המידע שלך מוגן ומוצפן</p>
          <p>אנו נשתמש בו רק לצורכי אימות</p>
        </div>
      </div>
    </div>
  );
};