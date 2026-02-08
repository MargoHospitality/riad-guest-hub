// GEA API Client for Guest App

const GEA_API_URL = 'https://gea.margo-hospitality.com/api/v1';
const PROPERTY_ID = '3'; // Riad Massiba

export interface BrandingData {
  property_id: string;
  property_name: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  background_image_url: string | null;
}

export interface ValidationData {
  valid: boolean;
  property_id?: string;
  reservation?: {
    id: string;
    guest_name: string;
    check_in: string;
    check_out: string;
    room_name: string;
  };
  message?: string;
}

/**
 * Fetch branding data for the property
 */
export async function fetchBranding(propertyId: string = PROPERTY_ID): Promise<BrandingData> {
  const response = await fetch(`${GEA_API_URL}/branding/${propertyId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch branding: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch branding');
  }
  
  return result.data;
}

/**
 * Validate guest token
 */
export async function validateToken(token: string): Promise<ValidationData> {
  const response = await fetch(`${GEA_API_URL}/validate-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to validate token: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Token validation failed');
  }
  
  return result.data;
}

/**
 * Fetch page content for the property
 */
export async function fetchPageContent(pageSlug: string, propertyId: string = PROPERTY_ID) {
  const response = await fetch(`${GEA_API_URL}/content/${propertyId}/${pageSlug}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch content: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch content');
  }
  
  return result.data;
}

export interface FeaturedItem {
  id: string;
  title: string;
  image_url: string;
  link_url?: string;
  order_index: number;
}

/**
 * Fetch featured items for the property
 */
export async function fetchFeaturedItems(propertyId: string = PROPERTY_ID): Promise<FeaturedItem[]> {
  const response = await fetch(`${GEA_API_URL}/featured-items/${propertyId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch featured items: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch featured items');
  }
  
  return result.data || [];
}

export interface PageInfo {
  code: string;
  title: string;
  route: string;
  icon: string;
}

/**
 * Fetch available pages for the property
 */
export async function fetchAvailablePages(propertyId: string = PROPERTY_ID): Promise<PageInfo[]> {
  const response = await fetch(`${GEA_API_URL}/pages/${propertyId}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch pages: ${response.statusText}`);
  }
  
  const result = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch pages');
  }
  
  return result.data || [];
}

/**
 * Apply branding colors to CSS variables
 */
export function applyBrandingColors(branding: BrandingData) {
  if (typeof document === 'undefined') return;
  
  const root = document.documentElement;
  
  // Apply primary color
  if (branding.primary_color) {
    root.style.setProperty('--color-primary', branding.primary_color);
    
    // Convert hex to HSL for shadcn/ui compatibility
    const hsl = hexToHSL(branding.primary_color);
    root.style.setProperty('--primary', hsl);
  }
  
  // Apply secondary color
  if (branding.secondary_color) {
    root.style.setProperty('--color-secondary', branding.secondary_color);
    
    const hsl = hexToHSL(branding.secondary_color);
    root.style.setProperty('--secondary', hsl);
  }
}

/**
 * Convert hex color to HSL format (for shadcn/ui)
 */
function hexToHSL(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert hex to RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  const lPercent = Math.round(l * 100);
  
  return `${h} ${s}% ${lPercent}%`;
}

/**
 * Get token from URL query params
 */
export function getTokenFromUrl(): string | null {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  return params.get('token');
}
