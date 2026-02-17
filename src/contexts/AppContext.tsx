import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { 
  fetchBranding, 
  validateToken, 
  applyBrandingColors, 
  getTokenFromUrl,
  type BrandingData,
  type ValidationData 
} from '@/lib/api';
import { initAnalytics, identifySession, analytics } from '@/lib/analytics';

interface AppContextValue {
  branding: BrandingData | null;
  validation: ValidationData | null;
  isLoadingBranding: boolean;
  isLoadingValidation: boolean;
  brandingError: Error | null;
  validationError: Error | null;
  token: string | null;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const STORAGE_KEY = 'guest_app_token';

// Initialize PostHog once (no-op if VITE_POSTHOG_KEY not set)
initAnalytics();

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  
  // Read token from URL or localStorage (with URL priority)
  const token = useMemo(() => {
    const urlToken = searchParams.get('token');
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    
    // URL token takes priority (new session)
    if (urlToken) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, urlToken);
      }
      return urlToken;
    }
    
    // Fallback to stored token if no URL token
    return storedToken;
  }, [searchParams]);

  // Validate token if present (includes branding in response)
  const {
    data: validationData,
    isLoading: isLoadingValidation,
    error: validationError,
  } = useQuery({
    queryKey: ['validation', token],
    queryFn: () => validateToken(token!),
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Use branding from token validation (no fallback without token)
  const brandingData = validationData?.branding || null;
  const isLoadingBranding = isLoadingValidation;
  const brandingError = validationError;

  // Apply branding colors when loaded
  useEffect(() => {
    if (brandingData) {
      applyBrandingColors(brandingData);
    }
  }, [brandingData]);

  // Identify PostHog session once validation is available
  useEffect(() => {
    if (token && validationData?.reservation) {
      const { property_id } = validationData.reservation;
      const propertyName = validationData.branding?.property_name || '';
      identifySession(token, property_id, propertyName);
      analytics.sessionStarted(property_id, propertyName);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationData?.reservation?.property_id]);

  const value: AppContextValue = {
    branding: brandingData,
    validation: validationData || null,
    isLoadingBranding,
    isLoadingValidation,
    brandingError: brandingError as Error | null,
    validationError: validationError as Error | null,
    token,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
