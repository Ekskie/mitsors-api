export interface LocationState {
  region: string; // Region Code
  regionName?: string; // Region Name
  province?: string; // Province Name (Optional, as structure implies direct City-Region link)
  city: string; // City/Municipality Name
}

export interface GuestProfile {
  firstName: string;
  lastName: string;
  phone: string;
  region: string;
  city: string; // Standardized to 'city'
  updatedAt: string;
}
