import { 
  TrendingUp, 
  Shield, 
  GraduationCap, 
  Heart, 
  Smartphone, 
  Palette,
  Vote,
  Trophy,
  Newspaper,
  Shirt,
  Paintbrush,
  Music,
  Film,
  Atom,
  Leaf,
  Scale,
  Church,
  Brain,
  Radio,
  Briefcase,
  Lightbulb,
  Wheat,
  MapPin,
  ChefHat,
  Car,
  Home,
  type LucideIcon
} from "lucide-react";

export type ExpertDomain = 
  | 'economy' 
  | 'security' 
  | 'education' 
  | 'health' 
  | 'tech' 
  | 'culture'
  | 'politics'
  | 'sports'
  | 'news'
  | 'fashion'
  | 'art'
  | 'music'
  | 'cinema'
  | 'science'
  | 'environment'
  | 'law'
  | 'religion'
  | 'psychology'
  | 'media'
  | 'business'
  | 'entrepreneurship'
  | 'agriculture'
  | 'tourism'
  | 'gastronomy'
  | 'automotive'
  | 'realestate';

export interface DomainConfig {
  id: ExpertDomain;
  name: string;
  hebrewName: string;
  icon: LucideIcon;
  bgColor: string;
  textColor: string;
  borderColor: string;
  accentColor: string;
}

export const domainConfigs: Record<ExpertDomain, DomainConfig> = {
  // Catégories principales existantes
  politics: {
    id: 'politics',
    name: 'Politics',
    hebrewName: 'פוליטיקה',
    icon: Vote,
    bgColor: 'bg-red-500/20',
    textColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    accentColor: 'text-red-500'
  },
  tech: {
    id: 'tech',
    name: 'Technology',
    hebrewName: 'טכנולוגיה',
    icon: Smartphone,
    bgColor: 'bg-blue-500/20',
    textColor: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    accentColor: 'text-blue-500'
  },
  economy: {
    id: 'economy',
    name: 'Economy',
    hebrewName: 'כלכלה',
    icon: TrendingUp,
    bgColor: 'bg-green-500/20',
    textColor: 'text-green-400',
    borderColor: 'border-green-500/30',
    accentColor: 'text-green-500'
  },
  sports: {
    id: 'sports',
    name: 'Sports',
    hebrewName: 'ספורט',
    icon: Trophy,
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/30',
    accentColor: 'text-orange-500'
  },
  culture: {
    id: 'culture',
    name: 'Culture',
    hebrewName: 'תרבות',
    icon: Palette,
    bgColor: 'bg-purple-500/20',
    textColor: 'text-purple-400',
    borderColor: 'border-purple-500/30',
    accentColor: 'text-purple-500'
  },
  news: {
    id: 'news',
    name: 'News',
    hebrewName: 'חדשות',
    icon: Newspaper,
    bgColor: 'bg-gray-500/20',
    textColor: 'text-gray-400',
    borderColor: 'border-gray-500/30',
    accentColor: 'text-gray-500'
  },

  // Catégories existantes étendues
  education: {
    id: 'education',
    name: 'Education',
    hebrewName: 'חינוך',
    icon: GraduationCap,
    bgColor: 'bg-emerald-500/20',
    textColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    accentColor: 'text-emerald-500'
  },
  health: {
    id: 'health',
    name: 'Health',
    hebrewName: 'בריאות',
    icon: Heart,
    bgColor: 'bg-rose-500/20',
    textColor: 'text-rose-400',
    borderColor: 'border-rose-500/30',
    accentColor: 'text-rose-500'
  },
  security: {
    id: 'security',
    name: 'Security',
    hebrewName: 'ביטחון',
    icon: Shield,
    bgColor: 'bg-slate-500/20',
    textColor: 'text-slate-400',
    borderColor: 'border-slate-500/30',
    accentColor: 'text-slate-500'
  },

  // Nouvelles catégories
  fashion: {
    id: 'fashion',
    name: 'Fashion',
    hebrewName: 'אופנה',
    icon: Shirt,
    bgColor: 'bg-pink-500/20',
    textColor: 'text-pink-400',
    borderColor: 'border-pink-500/30',
    accentColor: 'text-pink-500'
  },
  art: {
    id: 'art',
    name: 'Art',
    hebrewName: 'אמנות',
    icon: Paintbrush,
    bgColor: 'bg-fuchsia-500/20',
    textColor: 'text-fuchsia-400',
    borderColor: 'border-fuchsia-500/30',
    accentColor: 'text-fuchsia-500'
  },
  music: {
    id: 'music',
    name: 'Music',
    hebrewName: 'מוזיקה',
    icon: Music,
    bgColor: 'bg-indigo-500/20',
    textColor: 'text-indigo-400',
    borderColor: 'border-indigo-500/30',
    accentColor: 'text-indigo-500'
  },
  cinema: {
    id: 'cinema',
    name: 'Cinema',
    hebrewName: 'קולנוע',
    icon: Film,
    bgColor: 'bg-violet-500/20',
    textColor: 'text-violet-400',
    borderColor: 'border-violet-500/30',
    accentColor: 'text-violet-500'
  },
  science: {
    id: 'science',
    name: 'Science',
    hebrewName: 'מדע',
    icon: Atom,
    bgColor: 'bg-teal-500/20',
    textColor: 'text-teal-400',
    borderColor: 'border-teal-500/30',
    accentColor: 'text-teal-500'
  },
  environment: {
    id: 'environment',
    name: 'Environment',
    hebrewName: 'סביבה',
    icon: Leaf,
    bgColor: 'bg-lime-500/20',
    textColor: 'text-lime-400',
    borderColor: 'border-lime-500/30',
    accentColor: 'text-lime-500'
  },
  law: {
    id: 'law',
    name: 'Law',
    hebrewName: 'משפט',
    icon: Scale,
    bgColor: 'bg-zinc-500/20',
    textColor: 'text-zinc-400',
    borderColor: 'border-zinc-500/30',
    accentColor: 'text-zinc-500'
  },
  religion: {
    id: 'religion',
    name: 'Religion',
    hebrewName: 'דת',
    icon: Church,
    bgColor: 'bg-amber-500/20',
    textColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    accentColor: 'text-amber-500'
  },
  psychology: {
    id: 'psychology',
    name: 'Psychology',
    hebrewName: 'פסיכולוגיה',
    icon: Brain,
    bgColor: 'bg-lavender-500/20',
    textColor: 'text-lavender-400',
    borderColor: 'border-lavender-500/30',
    accentColor: 'text-lavender-500'
  },
  media: {
    id: 'media',
    name: 'Media',
    hebrewName: 'תקשורת',
    icon: Radio,
    bgColor: 'bg-cyan-500/20',
    textColor: 'text-cyan-400',
    borderColor: 'border-cyan-500/30',
    accentColor: 'text-cyan-500'
  },
  business: {
    id: 'business',
    name: 'Business',
    hebrewName: 'עסקים',
    icon: Briefcase,
    bgColor: 'bg-mint-500/20',
    textColor: 'text-mint-400',
    borderColor: 'border-mint-500/30',
    accentColor: 'text-mint-500'
  },
  entrepreneurship: {
    id: 'entrepreneurship',
    name: 'Entrepreneurship',
    hebrewName: 'יזמות',
    icon: Lightbulb,
    bgColor: 'bg-yellow-500/20',
    textColor: 'text-yellow-400',
    borderColor: 'border-yellow-500/30',
    accentColor: 'text-yellow-500'
  },
  agriculture: {
    id: 'agriculture',
    name: 'Agriculture',
    hebrewName: 'חקלאות',
    icon: Wheat,
    bgColor: 'bg-olive-500/20',
    textColor: 'text-olive-400',
    borderColor: 'border-olive-500/30',
    accentColor: 'text-olive-500'
  },
  tourism: {
    id: 'tourism',
    name: 'Tourism',
    hebrewName: 'תיירות',
    icon: MapPin,
    bgColor: 'bg-turquoise-500/20',
    textColor: 'text-turquoise-400',
    borderColor: 'border-turquoise-500/30',
    accentColor: 'text-turquoise-500'
  },
  gastronomy: {
    id: 'gastronomy',
    name: 'Gastronomy',
    hebrewName: 'גסטרונומיה',
    icon: ChefHat,
    bgColor: 'bg-brown-500/20',
    textColor: 'text-brown-400',
    borderColor: 'border-brown-500/30',
    accentColor: 'text-brown-500'
  },
  automotive: {
    id: 'automotive',
    name: 'Automotive',
    hebrewName: 'רכב',
    icon: Car,
    bgColor: 'bg-stone-500/20',
    textColor: 'text-stone-400',
    borderColor: 'border-stone-500/30',
    accentColor: 'text-stone-500'
  },
  realestate: {
    id: 'realestate',
    name: 'Real Estate',
    hebrewName: 'נדל״ן',
    icon: Home,
    bgColor: 'bg-neutral-500/20',
    textColor: 'text-neutral-400',
    borderColor: 'border-neutral-500/30',
    accentColor: 'text-neutral-500'
  }
};

// Helper functions
export const getDomainConfig = (domain: ExpertDomain): DomainConfig => {
  return domainConfigs[domain];
};

export const getDomainBadgeClasses = (domain: ExpertDomain): string => {
  const config = getDomainConfig(domain);
  return `${config.bgColor} ${config.textColor} ${config.borderColor} px-2 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm`;
};

export const getAllDomains = (): DomainConfig[] => {
  return Object.values(domainConfigs);
};

export const getDomainsByCategory = (category: 'main' | 'extended' | 'new'): DomainConfig[] => {
  const mainCategories = ['politics', 'tech', 'economy', 'sports', 'culture', 'news'];
  const extendedCategories = ['education', 'health', 'security'];
  
  switch (category) {
    case 'main':
      return mainCategories.map(id => domainConfigs[id as ExpertDomain]);
    case 'extended':
      return extendedCategories.map(id => domainConfigs[id as ExpertDomain]);
    case 'new':
      return Object.values(domainConfigs).filter(
        config => !mainCategories.includes(config.id) && !extendedCategories.includes(config.id)
      );
    default:
      return getAllDomains();
  }
};