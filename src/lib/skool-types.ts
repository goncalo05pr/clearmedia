export interface ContentItem {
  id: string;
  type: 'video' | 'pdf' | 'link' | 'text';
  title: string;
  content: string; // URL for video/pdf/link, text content for text type
  duration?: number; // in minutes for video
  isCompleted?: boolean;
  order: number;
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  contentItems: ContentItem[];
  order: number;
  isCompleted?: boolean;
  completedAt?: string;
}

export interface Chapter {
  id: string;
  title: string;
  description?: string;
  modules: Module[];
  order: number;
  isCompleted?: boolean;
  completedAt?: string;
}

export interface Formation {
  id: string;
  title: string;
  description: string;
  price: number;
  coverImage?: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in hours
  formationType: 'videos' | 'pdf' | 'link' | 'text' | 'mixed';
  chapters: Chapter[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FormationProgress {
  formationId: string;
  userId: string;
  completedChapters: string[];
  completedModules: string[];
  completedContentItems: string[];
  progressPercentage: number;
  lastAccessedAt: string;
  startedAt: string;
  completedAt?: string;
}
