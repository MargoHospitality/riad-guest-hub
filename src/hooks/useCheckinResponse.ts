/**
 * Hook to save and retrieve check-in responses
 * Created: 2026-02-12
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const GEA_API_URL = 'https://gea.margo-hospitality.com/api/v1';

interface SaveCheckinResponseParams {
  token: string;
  transport_status?: string;
  transport_method?: string;
  transport_details?: string;
  arrival_time?: string;
  guests?: Array<{
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    nationality?: string;
    passportNumber?: string;
  }>;
  restaurant?: {
    mealChoice: string;
    dietaryRestrictions?: string;
  };
  restauration_preferences?: string; // Legacy field
  bedding?: string;
  bedding_preferences?: string; // Legacy field
  bedding_details?: string; // Legacy field
  other?: string;
  other_requests?: string; // Legacy field
}

interface CompleteCheckinParams {
  token: string;
  other?: string;
}

/**
 * Save check-in response (partial updates)
 */
async function saveCheckinResponse(params: SaveCheckinResponseParams): Promise<any> {
  // Transform frontend format to API format
  const apiParams: any = { ...params };
  
  // Map restaurant object to restauration_preferences text
  if (params.restaurant) {
    const { mealChoice, dietaryRestrictions } = params.restaurant;
    apiParams.restauration_preferences = `${mealChoice}${dietaryRestrictions ? ` - ${dietaryRestrictions}` : ''}`;
    delete apiParams.restaurant;
  }
  
  // Map bedding to bedding_preferences
  if (params.bedding) {
    apiParams.bedding_preferences = params.bedding;
    delete apiParams.bedding;
  }
  
  // Map other to other_requests
  if (params.other) {
    apiParams.other_requests = params.other;
    delete apiParams.other;
  }
  
  const response = await fetch(`${GEA_API_URL}/checkin/response`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(apiParams),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to save: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to save');
  }
  
  return result.data;
}

/**
 * Get check-in response (for resume)
 */
async function getCheckinResponse(token: string): Promise<any> {
  const response = await fetch(`${GEA_API_URL}/checkin/response/${token}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      return null; // No data yet
    }
    throw new Error(`Failed to fetch: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch');
  }
  
  return result.data;
}

/**
 * Complete check-in (trigger Cloudbeds sync)
 */
async function completeCheckin(params: CompleteCheckinParams): Promise<any> {
  const response = await fetch(`${GEA_API_URL}/checkin/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to complete: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to complete');
  }
  
  return result;
}

/**
 * Hook to save check-in response
 */
export function useSaveCheckinResponse() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: saveCheckinResponse,
    onSuccess: (data, variables) => {
      // Invalidate cache to refetch
      queryClient.invalidateQueries({ queryKey: ['checkinResponse', variables.token] });
    },
  });
}

/**
 * Hook to get check-in response
 */
export function useCheckinResponse(token: string | null) {
  return useQuery({
    queryKey: ['checkinResponse', token],
    queryFn: () => getCheckinResponse(token!),
    enabled: !!token,
    retry: false,
  });
}

/**
 * Hook to complete check-in
 */
export function useCompleteCheckin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: completeCheckin,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['checkinResponse', variables.token] });
    },
  });
}
