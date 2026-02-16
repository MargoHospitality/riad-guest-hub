/**
 * Hook to fetch and use check-in configuration
 * Created: 2026-02-12
 */

import { useQuery } from '@tanstack/react-query';
import { useApp } from '@/contexts/AppContext';

interface CheckinConfig {
  property_id: string;
  step_transport_enabled: boolean;
  step_guest_details_enabled: boolean;
  step_restauration_enabled: boolean;
  step_bedding_enabled: boolean;
  step_other_requests_enabled: boolean;
  first_guest_mandatory: boolean;
  additional_guests_optional: boolean;
  max_additional_guests: number;
  lunch_price?: number;
  dinner_price?: number;
  currency?: string;
}

const GEA_API_URL = 'https://gea.margo-hospitality.com/api/v1';

async function fetchCheckinConfig(propertyId: string): Promise<CheckinConfig> {
  const response = await fetch(`${GEA_API_URL}/checkin/config/${propertyId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch config: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch config');
  }
  
  return result.data;
}

export function useCheckinConfig() {
  const { validation } = useApp();
  // Use cloudbeds_property_id for checkin config endpoint
  const cloudbedsPropertyId = validation?.reservation?.cloudbeds_property_id;
  
  return useQuery({
    queryKey: ['checkinConfig', cloudbedsPropertyId],
    queryFn: () => fetchCheckinConfig(cloudbedsPropertyId!),
    enabled: !!cloudbedsPropertyId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

/**
 * Build step sequence based on config + transport status
 */
export function buildStepSequence(
  config: CheckinConfig | undefined,
  hasTransport: boolean
): string[] {
  if (!config) {
    // Default sequence (all steps)
    return [
      '/checkin/transport',
      '/checkin/guest-details',
      '/checkin/step3',
      '/checkin/step4',
      '/checkin/step5',
    ];
  }
  
  const steps: string[] = [];
  
  // Transport step (skip if transport via Margo Flow)
  if (config.step_transport_enabled && !hasTransport) {
    steps.push('/checkin/transport');
  }
  
  // Guest details
  if (config.step_guest_details_enabled) {
    steps.push('/checkin/guest-details');
  }
  
  // Restauration
  if (config.step_restauration_enabled) {
    steps.push('/checkin/restaurant');
  }
  
  // Bedding
  if (config.step_bedding_enabled) {
    steps.push('/checkin/bedding');
  }
  
  // Other requests
  if (config.step_other_requests_enabled) {
    steps.push('/checkin/other');
  }
  
  return steps;
}
