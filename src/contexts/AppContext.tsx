import React, { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
  const [token] = useState<string | null>(getTokenFromUrl());

  // Fetch branding data
  const {
    data: brandingData,
    isLoading: isLoadingBranding,
    error: brandingError,
  } = useQuery({
    queryKey: ['branding'],
    queryFn: () => fetchBranding(),
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  // Validate token if present
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

  // Apply branding colors when loaded
  useEffect(() => {
    if (brandingData) {
      applyBrandingColors(brandingData);
    }
  }, [brandingData]);

  const value: AppContextValue = {
    branding: brandingData || null,
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
