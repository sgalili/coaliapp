import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, UserCheck } from "lucide-react";
import { useIsDemoMode } from "@/hooks/useIsDemoMode";

interface TrustedUser {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  trust_count: number;
  created_at: string;
}

interface Props {
  userId: string;
  type: 'trusters' | 'trusted';
}

export const TrustedUsersList = ({ userId, type }: Props) => {
  const navigate = useNavigate();
  const { isDemoMode } = useIsDemoMode();
  const [users, setUsers] = useState<TrustedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, [userId, type, isDemoMode]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const trustTable = isDemoMode ? 'demo_trusts' : 'trusts';
      const profilesTable = isDemoMode ? 'demo_profiles' : 'profiles';

      // Get trust relationships
      const { data: trustData, error: trustError } = type === 'trusters'
        ? await supabase.from(trustTable).select('truster_id, created_at').eq('trusted_id', userId)
        : await supabase.from(trustTable).select('trusted_id, created_at').eq('truster_id', userId);

      if (trustError) throw trustError;

      // Get unique user IDs
      const userIds = Array.from(new Set(
        trustData?.map(t => type === 'trusters' 
          ? (t as any).truster_id 
          : (t as any).trusted_id
        ) || []
      ));

      if (userIds.length === 0) {
        setUsers([]);
        setIsLoading(false);
        return;
      }

      // Fetch user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from(profilesTable)
        .select('user_id, first_name, last_name, avatar_url')
        .in('user_id', userIds);

      if (profilesError) throw profilesError;

      // Count trusts for each user
      const usersWithCounts = await Promise.all(
        (profilesData || []).map(async (profile) => {
          const { count } = await supabase
            .from(trustTable)
            .select('*', { count: 'exact', head: true })
            .eq('trusted_id', profile.user_id);

          const trustDate = trustData?.find(t => 
            (type === 'trusters' ? (t as any).truster_id : (t as any).trusted_id) === profile.user_id
          )?.created_at;

          return {
            id: profile.user_id,
            first_name: profile.first_name,
            last_name: profile.last_name,
            avatar_url: profile.avatar_url,
            trust_count: count || 0,
            created_at: trustDate || new Date().toISOString(),
          };
        })
      );

      setUsers(usersWithCounts);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-card border-b border-border p-6">
        <p className="text-sm text-muted-foreground text-center">
          {type === 'trusters' ? 'עדיין אין אנשים שנתנו לך אמון' : 'עדיין לא נתת אמון לאף אחד'}
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border">
      {users.map((user) => (
        <div
          key={user.id}
          className="p-4 hover:bg-accent/50 cursor-pointer transition-colors"
          onClick={() => navigate(`/user/${user.id}`)}
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar_url} alt={`${user.first_name} ${user.last_name}`} />
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold truncate">
                  {user.first_name} {user.last_name}
                </p>
                {user.trust_count > 100 && (
                  <UserCheck className="h-4 w-4 text-trust shrink-0" />
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{user.trust_count.toLocaleString()} אמון</span>
                <span>•</span>
                <span>
                  {new Date(user.created_at).toLocaleDateString('he-IL', {
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
            <Badge variant="outline" className="shrink-0">
              {type === 'trusters' ? 'נותן אמון' : 'מקבל אמון'}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
};
