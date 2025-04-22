export enum TourCategory {
  SAFARI = 'SAFARI',
  BEACH = 'BEACH',
  CULTURAL = 'CULTURAL',
  ADVENTURE = 'ADVENTURE'
}

export enum TourDifficulty {
  EASY = 'EASY',
  MODERATE = 'MODERATE',
  CHALLENGING = 'CHALLENGING'
}

export interface Tour {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: string;
  imageUrl: string;
  location: string;
  rating: number;
  reviews: number;
  category: TourCategory;
  difficulty: TourDifficulty;
  groupSize: number;
  isPopular: boolean;
  discount?: number;
  delay?: number;
  slug: string;
  isFavorite: boolean;
}

export interface TourSearchParams {
  category?: TourCategory;
  difficulty?: TourDifficulty;
  minPrice?: number;
  maxPrice?: number;
  duration?: string;
  groupSize?: number;
  location?: string;
  rating?: number;
  isPopular?: boolean;
  hasDiscount?: boolean;
}

export interface TourSearchResponse {
  tours: Tour[];
  total: number;
  page: number;
  pageSize: number;
} 