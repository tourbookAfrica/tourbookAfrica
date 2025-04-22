export interface Hotel {
  id: string;
  name: string;
  location: string;
  description: string;
  stars: number;
  rating: number;
  reviewCount: number;
  price: number;
  images: string[];
  amenities: string[];
  type: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adults: number;
    children: number;
    rooms: number;
  };
}

export type HotelSortOption = 'price' | 'rating' | 'name';

export interface HotelFilterOptions {
  priceRange: [number, number];
  starRating: number[];
  amenities: { name: string; selected: boolean }[];
  propertyTypes: { name: string; selected: boolean }[];
} 