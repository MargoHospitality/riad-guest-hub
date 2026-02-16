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

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [searchParams] = useSearchParams();
  
  // Read token from URL on every render (reactive to URL changes)
  const token = useMemo(() => searchParams.get('token'), [searchParams]);

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
