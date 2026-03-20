/**
 * Hook to fetch dynamic pages from GEA
 * Created: 2026-02-16
 */

import { useQuery } from '@tanstack/react-query';
import { useApp } from '@/contexts/AppContext';

export interface Page {
  code: string;
  title: string;
  title_fr: string;
  title_en: string;
  route: string;
  icon: string;
  external_url?: string;
}

const GEA_API_URL = 'https://gea.margo-hospitality.com/api/v1';

async function fetchPages(propertyId: string): Promise<Page[]> {
  const response = await fetch(`${GEA_API_URL}/pages/${propertyId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch pages: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch pages');
  }
  
  return result.data;
}

export function usePages() {
  const { validation } = useApp();
  const propertyId = validation?.reservation?.property_id;
  
  return useQuery({
    queryKey: ['pages', propertyId],
    queryFn: () => fetchPages(propertyId!),
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
