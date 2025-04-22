export interface Car {
  id: string;
  name: string;
  image: string;
  transmission: string;
  fuelType: string;
  seats: number;
  features: string[];
  rating: number;
  reviews: number;
  price: number;
  isPopular?: boolean;
  carType: string;
}

export interface CarSearchParams {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  driverAge: number;
  page: number;
  limit: number;
  filters: CarFilter;
}

export interface CarFilter {
  priceRange: {
    min: number;
    max: number;
  };
  carType: string[];
  transmission: string[];
  features: string[];
  rating: number;
}

export interface CarSearchResponse {
  cars: Car[];
  total: number;
} 