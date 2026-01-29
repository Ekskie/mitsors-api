export type LivestockType = 'fattener' | 'piglet' | 'both';

export type SubmitPriceDto = {
  region: string;
  city: string;
  pricePerKg: number;
  livestockType?: LivestockType;
  breed?: string;
  notes?: string;
  dateObserved?: string; // YYYY-MM-DD
};

export type SubmitPriceResponse = {
  success: boolean;
  message: string;
  data: {
    id: string;
    userId: string;
    verificationStatus: 'verified' | 'unverified';
    region: string;
    city: string;
    pricePerKg: number;
    livestockType?: LivestockType | null;
    breed?: string | null;
    notes?: string | null;
    dateObserved: string; // ISO 8601
    createdAt: string; // ISO 8601
  };
};

export type PriceAverage = {
  pricePerKg: number;
  sampleSize: number;
  lastUpdated: string;
} | null;

export type AggregatedPricesResponse = {
  verifiedAverage: PriceAverage;
  unverifiedAverage: PriceAverage;
  region: string;
  city: string;
  message?: string;
};
