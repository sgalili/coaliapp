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
      },
      auth: {
        welcome: "ברוכים הבאים ל-Coali",
        subtitle: "הרשת הראשונה של אמון דיגיטלי",
        whatIsCoali: "מה זה Coali?",
        enterPhone: "הכניסו את מספר הטלפון שלכם כדי להתחיל",
        receiveCode: "קבלו קוד בוואטסאפ",
        sending: "שולח...",
        verificationCode: "קוד אימות",
        codeSentWhatsApp: "קוד נשלח דרך WhatsApp ל",
        resendCode: "שלחו קוד מחדש",
        resendIn: "שלחו מחדש בעוד",
        receiveSMS: "קבלו ב-SMS",
        completeProfile: "השלימו את הפרופיל שלכם",
        finalizeRegistration: "כמה פרטים כדי לסיים את ההרשמה",
        firstName: "שם פרטי",
        lastName: "שם משפחה",
        start: "התחילו",
        finalizing: "מסיים...",
        termsAccept: "בהמשך, אתם מסכימים ל",
        termsOfService: "תנאי השימוש",
        and: "ו",
        privacyPolicy: "מדיניות הפרטיות",
        phoneRequired: "אנא הכניסו מספר טלפון",
        invalidPhone: "פורמט מספר טלפון לא תקין",
        firstNameRequired: "שם פרטי נדרש",
        lastNameRequired: "שם משפחה נדרש",
        whatsappCode: "קוד WhatsApp (4 ספרות)",
        codePlaceholder: "1234",
        sendingWhatsApp: "שולח קוד בוואטסאפ...",
        verifyingCode: "מאמת קוד...",
        codeVerified: "הנומר אומת בהצלחה דרך WhatsApp",
        invalidCode: "קוד לא תקין",
        codeExpired: "קוד פג תוקף",
        tooManyAttempts: "יותר מדי ניסיונות",
        requestNewCode: "בקש קוד חדש",
        continueToLogin: "המשך להתחברות"
      },
      onboarding: {
        close: "סגור",
        step1: {
          title: "העולם הפך מזויף",
          subtitle: "ב-2027, אף אחד לא יודע מי אמיתי",
          description: "הסרטונים מורכבים. הפרופילים נקנים.\nההחלטות? מתקבלות על ידי רוחות רפאים."
        },
        step2: {
          title: "Coali מחזיר את האמון למרכז",
          description: "כאן, אתה זוכה באמון של אלה שרואים אותך, שומעים אותך ותומכים בך בזמן אמת.\nאתה לא קונה את ההשפעה שלך. אתה בונה אותה."
        },
        step3: {
          title: "מה אתה זוכה עם Trust",
          benefit1: "התערב בזמן אמת בחדשות, בנושאים שאתה שולט בהם",
          benefit2: "קבל ZOOZ בזמן אמת כדי להתקדם מהר יותר בפרויקטים שלך",
          benefit3: "גש לקבוצות השפעה ופעולה",
          future: "בקרוב: תוכל לזכות בתפקידים מפתח כדי לפתח את החברה שלנו"
        },
        step4: {
          title: "הצטרף למהימנים ביותר",
          description: "הם לא חיכו.\nואתה, אתה רוצה להישאר בלתי נראה?",
          cta: "אני רוצה את המקום שלי ברשת האמון",
          counter: "אנשים כבר התחילו לבנות את ה-TrustRank שלהם.\nומה איתך?"
        }
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
      },
      auth: {
        welcome: "Welcome to Coali",
        subtitle: "The First Trust Network",
        whatIsCoali: "What is Coali?",
        enterPhone: "Enter your phone number to get started",
        receiveCode: "Receive Code",
        sending: "Sending...",
        verificationCode: "Verification Code",
        codeSentWhatsApp: "Code sent via WhatsApp to",
        resendCode: "Resend Code",
        resendIn: "Resend in",
        receiveSMS: "Receive via SMS",
        completeProfile: "Complete Your Profile",
        finalizeRegistration: "A few details to finalize your registration",
        firstName: "First Name",
        lastName: "Last Name",
        start: "Get Started",
        finalizing: "Finalizing...",
        termsAccept: "By continuing, you agree to our",
        termsOfService: "Terms of Service",
        and: "and",
        privacyPolicy: "Privacy Policy",
        phoneRequired: "Please enter your phone number",
        invalidPhone: "Invalid phone number format",
        firstNameRequired: "First name is required",
        lastNameRequired: "Last name is required",
        whatsappCode: "WhatsApp Code (4 digits)",
        codePlaceholder: "1234",
        sendingWhatsApp: "Sending WhatsApp code...",
        verifyingCode: "Verifying code...",
        codeVerified: "Number verified successfully via WhatsApp",
        invalidCode: "Invalid code",
        codeExpired: "Code expired",
        tooManyAttempts: "Too many attempts",
        requestNewCode: "Request new code",
        continueToLogin: "Continue to login"
      },
      onboarding: {
        close: "Close",
        step1: {
          title: "The world became fake",
          subtitle: "In 2027, no one knows who is real",
          description: "Videos are edited. Profiles are bought.\nDecisions? Made by ghosts."
        },
        step2: {
          title: "Coali puts trust back at the center",
          description: "Here, you gain trust from those who see you, hear you and support you live.\nYou don't buy your influence. You build it."
        },
        step3: {
          title: "What you gain with Trust",
          benefit1: "Intervene live on news, on topics you master",
          benefit2: "Receive ZOOZ live to go faster in your projects",
          benefit3: "Access impact and action groups",
          future: "Soon: you will be able to win key positions to evolve our society"
        },
        step4: {
          title: "Join the most trusted",
          description: "They didn't wait.\nAnd you, do you want to stay invisible?",
          cta: "I want my place in the Trust Network",
          counter: "people have already started building their TrustRank.\nWhat about you?"
        }
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
      },
      auth: {
        welcome: "Bienvenue à Coali",
        subtitle: "Le Premier Réseau de Confiance",
        whatIsCoali: "Qu'est-ce que Coali ?",
        enterPhone: "Entrez votre numéro de téléphone pour commencer",
        receiveCode: "Recevoir le code",
        sending: "Envoi...",
        verificationCode: "Code de vérification",
        codeSentWhatsApp: "Code envoyé via WhatsApp au",
        resendCode: "Renvoyer le code",
        resendIn: "Renvoyer dans",
        receiveSMS: "Recevoir par SMS",
        completeProfile: "Complétez votre profil",
        finalizeRegistration: "Quelques informations pour finaliser votre inscription",
        firstName: "Prénom",
        lastName: "Nom",
        start: "Commencer",
        finalizing: "Finalisation...",
        termsAccept: "En continuant, vous acceptez nos",
        termsOfService: "Conditions d'utilisation",
        and: "et notre",
        privacyPolicy: "Politique de confidentialité",
        phoneRequired: "Veuillez entrer votre numéro de téléphone",
        invalidPhone: "Format de numéro de téléphone invalide",
        firstNameRequired: "Le prénom est requis",
        lastNameRequired: "Le nom est requis",
        whatsappCode: "Code WhatsApp (4 chiffres)",
        codePlaceholder: "1234",
        sendingWhatsApp: "Envoi du code WhatsApp...",
        verifyingCode: "Vérification du code...",
        codeVerified: "Numéro vérifié avec succès via WhatsApp",
        invalidCode: "Code invalide",
        codeExpired: "Code expiré",
        tooManyAttempts: "Trop de tentatives",
        requestNewCode: "Demander un nouveau code",
        continueToLogin: "Continuer vers la connexion"
      },
      onboarding: {
        close: "Fermer",
        step1: {
          title: "Le monde est devenu fake",
          subtitle: "En 2027, plus personne ne sait qui est vrai",
          description: "Les vidéos sont montées. Les profils sont achetés.\nLes décisions ? Prises par des fantômes."
        },
        step2: {
          title: "Coali remet la confiance au centre",
          description: "Ici, tu gagnes de la confiance de ceux qui te voient, t'écoutent et te soutiennent en direct.\nTu n'achètes pas ton influence. Tu la construis."
        },
        step3: {
          title: "Ce que tu gagnes avec le Trust",
          benefit1: "Interviens en direct sur les news, sur les sujets que tu maîtrises",
          benefit2: "Reçois des ZOOZ en direct pour aller plus vite dans tes projets",
          benefit3: "Accède à des groupes d'impact et d'action",
          future: "Bientôt: tu pourras gagner des postes clé pour faire évoluer notre société"
        },
        step4: {
          title: "Rejoins les plus trusted",
          description: "Ils n'ont pas attendu.\nEt toi, tu veux rester invisible ?",
          cta: "Je veux ma place dans le Trust Network",
          counter: "personnes ont déjà commencé à bâtir leur TrustRank.\nEt toi ?"
        }
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