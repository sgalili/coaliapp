import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Settings, Heart, Eye, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  useEffect(() => {
    document.documentElement.setAttribute('dir', 'rtl');
    document.documentElement.setAttribute('lang', 'he');
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="relative p-6 text-center">
          <button className="absolute top-4 left-4 p-2 hover:bg-muted rounded-full">
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Avatar */}
          <img
            src="https://trust.coali.app/assets/sarah-profile-_yeQYYpH.jpg"
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-primary"
          />

          <h2 className="text-2xl font-bold mb-1">Demo User</h2>
          <p className="text-sm text-muted-foreground mb-4">@demouser</p>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                <ShieldCheck className="w-5 h-5 text-trust" />
                <p className="text-2xl font-bold">234</p>
              </div>
              <p className="text-xs text-muted-foreground">Trust</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                <Heart className="w-5 h-5 text-primary" />
                <p className="text-2xl font-bold">567</p>
              </div>
              <p className="text-xs text-muted-foreground">Votes</p>
            </div>

            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                <Eye className="w-5 h-5 text-watch" />
                <p className="text-2xl font-bold">1.2K</p>
              </div>
              <p className="text-xs text-muted-foreground">Watch</p>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="px-4">
          <h3 className="text-lg font-bold mb-4">הפוסטים שלי</h3>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="aspect-[3/4] bg-muted rounded-lg flex items-center justify-center"
              >
                <span className="text-4xl">🎥</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Navigation zoozBalance={9957} />
    </div>
  );
}
