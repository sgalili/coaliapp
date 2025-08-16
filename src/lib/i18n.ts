import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  he: {
    translation: {
      profile: {
        title: "הפרופיל שלך",
        edit: "עריכת פרופיל",
        addLocation: "הוסף מיקום",
        addExpertise: "הוסף תחום מומחיות",
        bio: "כתוב על עצמך...",
        stats: {
          trust: "אמון",
          zooz: "ZOOZ הרוויחו",
          posts: "פוסטים",
          watchers: "צופים"
        },
        tabs: {
          posts: "פוסטים",
          trusted: "נותן אמון",
          trusters: "מקבל אמון"
        },
        vote: "הצבעה",
        watch: "צפה",
        joined: "נרשם"
      },
      kyc: {
        unverified: "לא מאומת",
        basic: "אימות בסיסי",
        community: "אימות קהילתי",
        full: "אימות מלא",
        upgrade: "שדרג עכשיו",
        future: "העתיד: BVI Blockchain"
      },
      menu: {
        settings: "הגדרות הפרופיל",
        notifications: "התראות",
        inviteFriends: "הזמן חברים",
        language: "שפה",
        privacy: "הגדרות פרטיות",
        dataPrivacy: "הנתונים שלי",
        personalStats: "הסטטיסטיקות שלי",
        contact: "יצירת קשר ומשוב",
        donations: "תרומות ותמיכה",
        marketplace: "Marketplace",
        helpCenter: "מרכז עזרה",
        darkMode: "מצב לילה",
        logout: "התנתק"
      }
    }
  },
  en: {
    translation: {
      profile: {
        title: "Your Profile",
        edit: "Edit Profile",
        addLocation: "Add location",
        addExpertise: "Add expertise",
        bio: "Write about yourself...",
        stats: {
          trust: "Trust",
          zooz: "ZOOZ Earned",
          posts: "Posts",
          watchers: "Watchers"
        },
        tabs: {
          posts: "Posts",
          trusted: "Trusting",
          trusters: "Trusted by"
        },
        vote: "Vote",
        watch: "Watch",
        joined: "Joined"
      },
      kyc: {
        unverified: "Unverified",
        basic: "Basic Verification",
        community: "Community Verification",
        full: "Full Verification",
        upgrade: "Upgrade Now",
        future: "Future: BVI Blockchain"
      },
      menu: {
        settings: "Profile Settings",
        notifications: "Notifications",
        inviteFriends: "Invite Friends",
        language: "Language",
        privacy: "Privacy Settings",
        dataPrivacy: "My Data",
        personalStats: "My Statistics",
        contact: "Contact & Feedback",
        donations: "Donations & Support",
        marketplace: "Marketplace",
        helpCenter: "Help Center",
        darkMode: "Dark Mode",
        logout: "Logout"
      }
    }
  },
  fr: {
    translation: {
      profile: {
        title: "Votre Profil",
        edit: "Modifier le Profil",
        addLocation: "Ajouter une localisation",
        addExpertise: "Ajouter une expertise",
        bio: "Écrivez sur vous...",
        stats: {
          trust: "Confiance",
          zooz: "ZOOZ Gagnés",
          posts: "Publications",
          watchers: "Observateurs"
        },
        tabs: {
          posts: "Publications",
          trusted: "Fait confiance",
          trusters: "Fait confiance par"
        },
        vote: "Vote",
        watch: "Regarder",
        joined: "Rejoint"
      },
      kyc: {
        unverified: "Non vérifié",
        basic: "Vérification de base",
        community: "Vérification communautaire",
        full: "Vérification complète",
        upgrade: "Mettre à niveau maintenant",
        future: "Futur: BVI Blockchain"
      },
      menu: {
        settings: "Paramètres du Profil",
        notifications: "Notifications",
        inviteFriends: "Inviter des Amis",
        language: "Langue",
        privacy: "Paramètres de Confidentialité",
        dataPrivacy: "Mes Données",
        personalStats: "Mes Statistiques",
        contact: "Contact et Commentaires",
        donations: "Dons et Soutien",
        marketplace: "Marketplace",
        helpCenter: "Centre d'Aide",
        darkMode: "Mode Sombre",
        logout: "Déconnexion"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'he', // Default language
    fallbackLng: 'he',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;