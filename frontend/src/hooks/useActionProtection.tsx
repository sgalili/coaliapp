import { useAuth } from './useAuth';
import { useKYC } from './useKYC';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

export type ActionLevel = 'none' | 'auth' | 'kyc1';

export const useActionProtection = () => {
  const { user } = useAuth();
  const { isKYCVerified, triggerKYCCheck } = useKYC();
  const navigate = useNavigate();

  const checkPermission = (requiredLevel: ActionLevel): boolean => {
    switch (requiredLevel) {
      case 'none':
        return true;
      case 'auth':
        return !!user;
      case 'kyc1':
        return !!user && isKYCVerified;
      default:
        return false;
    }
  };

  const executeProtectedAction = (
    action: () => void,
    requiredLevel: ActionLevel = 'auth',
    options?: {
      authMessage?: string;
      kycMessage?: string;
      redirectToAuth?: boolean;
    }
  ) => {
    const {
      authMessage = 'יש להתחבר כדי לבצע פעולה זו',
      kycMessage = 'נדרש אימות KYC רמה 1 לביצוע פעולה זו',
      redirectToAuth = true
    } = options || {};

    // No authentication/KYC required
    if (requiredLevel === 'none') {
      action();
      return;
    }

    // Check if user is authenticated
    if (!user) {
      toast({
        title: 'נדרשת התחברות',
        description: authMessage,
        variant: 'destructive'
      });
      
      if (redirectToAuth) {
        navigate('/auth');
      }
      return;
    }

    // Check KYC level if required
    if (requiredLevel === 'kyc1' && !isKYCVerified) {
      toast({
        title: 'נדרש אימות זהות',
        description: kycMessage,
        variant: 'destructive'
      });
      
      triggerKYCCheck(action);
      return;
    }

    // All checks passed, execute the action
    action();
  };

  const getActionStatus = (requiredLevel: ActionLevel) => {
    return {
      canExecute: checkPermission(requiredLevel),
      needsAuth: requiredLevel !== 'none' && !user,
      needsKYC: requiredLevel === 'kyc1' && !isKYCVerified,
      isAuthenticated: !!user,
      isKYCVerified
    };
  };

  return {
    executeProtectedAction,
    getActionStatus,
    checkPermission,
    isAuthenticated: !!user,
    isKYCVerified
  };
};