export type ContentType = 'video' | 'pdf' | 'link' | 'text' | 'quiz';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  content?: string;
  url?: string;
  durationMinutes?: number;
  fileUrl?: string;
  order: number;
}

export interface FormationModule {
  id: string;
  title: string;
  contentType: ContentType;
  content: ContentItem[];
  order: number;
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  price: number;
  modules: FormationModule[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormationWithModules extends Formation {
  modules: FormationModule[];
}
