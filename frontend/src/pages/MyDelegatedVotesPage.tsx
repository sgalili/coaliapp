/**
 * My Delegated Votes Page
 * Central dashboard for viewing and managing delegated votes
 */

import React from 'react';
import { Navigation } from '@/components/Navigation';
import { DelegatedVotesDashboard } from '@/components/DelegatedVotesDashboard';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyDelegatedVotesPage() {
  const navigate = useNavigate();
  const currentUserId = 'demo-user'; // Replace with actual user ID from auth

  return (
    <div className="min-h-screen bg-background pb-20" dir="rtl">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="flex items-center gap-4 p-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-muted rounded-full"
          >
            <ArrowRight className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">ההצבעות המואצלות שלי</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-900">
            💡 <strong>הצבעות מואצלות</strong> - כאשר מומחה שאתה נותן לו אמון מצביע, הקול שלך מצטרף אוטומטית להצבעה שלו.
            יש לך 3 שעות לפני סגירת ההצבעה כדי לשנות או לבטל את הקול שלך.
          </p>
        </div>

        <DelegatedVotesDashboard userId={currentUserId} />
      </div>

      <Navigation zoozBalance={9957} />
    </div>
  );
}
