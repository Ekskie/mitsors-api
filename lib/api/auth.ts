import { apiFetch } from './client';

export interface HydrationPayload {
  googleToken?: string;
  facebookToken?: string;
  firstName: string;
  lastName: string;
  email: string;
  region: string;
  city: string;
  userRoles: string[];
}

/**
 * Interface representing the backend response for social sign-in.
 * Matches specifications from post-auth-signin-google.md and facebook.md.
 */
export interface AuthResponse {
  success: boolean;
  message: string;
  session: {
    id: string;
    userId: string;
    expiresAt: string;
  };
  user: {
    id: string;
    email: string;
    name: string;
    image: string;
    firstName: string;
    lastName: string;
    displayName: string;
    region: string;
    city: string;
    userRoles: string[];
    verificationStatus: string;
    createdAt: string;
  };
}

/**
 * Synchronizes social authentication using the centralized apiFetch wrapper.
 * This performs the atomic hydration operation required for B-3.
 */
export const syncSocialAuth = async (
  provider: 'google' | 'facebook', 
  payload: HydrationPayload
): Promise<AuthResponse> => {
  // Add the /v1 prefix to match backend logs and documentation
  const endpoint = `/api/v1/auth/signin/${provider}`;
  
  return apiFetch<AuthResponse>(endpoint, {
    method: 'POST',
    json: payload,
  });
};