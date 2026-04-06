export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  review_count: number;
  url: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  location: {
    address1: string;
    city: string;
    state: string;
    zip_code: string;
  };
}

export interface YelpResponse {
  businesses?: Restaurant[];
  error?: {
    code: string;
    description: string;
  };
}
