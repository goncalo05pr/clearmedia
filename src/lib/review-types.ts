export interface Review {
  id: string;
  formationId: string;
  userId: string;
  rating: number; // 1-5
  comment?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    email: string;
    fullName?: string;
  };
  formation?: {
    title: string;
  };
}

export interface FormationStats {
  totalSales: number;
  averageRating: number;
  totalReviews: number;
  satisfactionRate: number;
}
