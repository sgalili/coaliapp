/**
 * Trust Button Component
 * Allows users to delegate voting power to experts in specific fields
 */

import React, { useState, useEffect } from 'react';
import { Handshake, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { trustDelegationService } from '@/services/trustDelegationService';
import { supabase } from '@/integrations/supabase/client';
import { trackTrustGained } from '@/utils/impactTracking';

interface TrustButtonProps {
  expertId: string;
  expertName: string;
  currentUserId: string;
  expertiseFields?: string[];
  onTrustChange?: () => void;
}

export const TrustButton: React.FC<TrustButtonProps> = ({
  expertId,
  expertName,
  currentUserId,
  expertiseFields = [],
  onTrustChange
}) => {
  const [showFieldSelector, setShowFieldSelector] = useState(false);
  const [trustedFields, setTrustedFields] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTrustedFields();
  }, [expertId, currentUserId]);

  const loadTrustedFields = async () => {
    try {
      const { data, error } = await supabase
        .from('trust_delegations')
        .select('expertise_field')
        .eq('truster_id', currentUserId)
        .eq('trusted_id', expertId)
        .eq('is_active', true);

      if (error) {
        console.warn('Trust delegations not loaded:', error);
        return;
      }

      setTrustedFields(data?.map(d => d.expertise_field) || []);
    } catch (error) {
      console.error('Error loading trust fields:', error);
    }
  };

  const handleToggleTrust = async (field: string) => {
    setLoading(true);
    try {
      const isTrusted = trustedFields.includes(field);

      if (isTrusted) {
        // Revoke trust
        await trustDelegationService.revokeDelegation(currentUserId, expertId, field);
        setTrustedFields(prev => prev.filter(f => f !== field));
      } else {
        // Create trust
        await trustDelegationService.createDelegation(currentUserId, expertId, field);
        setTrustedFields(prev => [...prev, field]);
        
        // Track impact for the expert who gained trust
        await trackTrustGained(expertId, currentUserId, field);
      }

      onTrustChange?.();
    } catch (error) {
      console.error('Error toggling trust:', error);
    } finally {
      setLoading(false);
    }
  };

  const isTrustedInAnyField = trustedFields.length > 0;

  return (
    <div className="relative">
      <button
        onClick={() => setShowFieldSelector(!showFieldSelector)}
        disabled={loading}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all",
          isTrustedInAnyField
            ? "bg-trust text-white hover:bg-trust/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        )}
      >
        <Handshake className="w-4 h-4" />
        <span>{isTrustedInAnyField ? 'נותן אמון' : 'תן אמון'}</span>
        {isTrustedInAnyField && (
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
            {trustedFields.length}
          </span>
        )}
      </button>

      {/* Expertise Field Selector */}
      {showFieldSelector && (
        <div className="absolute top-full mt-2 right-0 bg-background border border-border rounded-lg shadow-lg p-3 min-w-[250px] z-50">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
            <h4 className="font-medium text-sm">בחר תחומי מומחיות</h4>
            <button
              onClick={() => setShowFieldSelector(false)}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {expertiseFields.length > 0 ? (
              expertiseFields.map(field => {
                const isTrusted = trustedFields.includes(field);
                return (
                  <button
                    key={field}
                    onClick={() => handleToggleTrust(field)}
                    disabled={loading}
                    className={cn(
                      "w-full flex items-center justify-between p-2 rounded-lg transition-colors text-right",
                      isTrusted
                        ? "bg-trust/10 border border-trust text-trust"
                        : "hover:bg-muted border border-transparent"
                    )}
                  >
                    <span className="text-sm">{field}</span>
                    {isTrusted && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                );
              })
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                למשתמש זה אין תחומי מומחיות מוגדרים
              </p>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              {trustedFields.length > 0
                ? `נותן אמון ב-${trustedFields.length} תחומים`
                : 'בחר תחומים כדי להאציל כוח הצבעה'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
