export interface HomepageContent {
  id: string;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  stats: {
    satisfactionRate: number;
    averageRoi: number;
    support: string;
  };
  services: {
    seo: {
      title: string;
      description: string;
      features: string[];
    };
    ads: {
      title: string;
      description: string;
      features: string[];
    };
    socialMedia: {
      title: string;
      description: string;
      features: string[];
    };
    content: {
      title: string;
      description: string;
      features: string[];
    };
    analytics: {
      title: string;
      description: string;
      features: string[];
    };
    branding: {
      title: string;
      description: string;
      features: string[];
    };
  };
  testimonials: {
    id: string;
    name: string;
    company: string;
    role: string;
    content: string;
    result: string;
    metrics: {
      roi?: string;
      revenue?: string;
      scale?: string;
      time?: string;
    };
    avatar: string;
  }[];
  lastUpdated: string;
}

export interface FormationContent {
  id: string;
  title: string;
  description: string;
  price: number;
  coverImage?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  formationType: 'videos' | 'pdf' | 'link' | 'text' | 'mixed';
  isActive: boolean;
  chapters: {
    id: string;
    title: string;
    description: string;
    modules: {
      id: string;
      title: string;
      description: string;
      contentItems: {
        id: string;
        type: 'video' | 'pdf' | 'link' | 'text';
        title: string;
        content: string;
        duration?: number;
      }[];
    }[];
  }[];
  createdAt: string;
  updatedAt: string;
}
