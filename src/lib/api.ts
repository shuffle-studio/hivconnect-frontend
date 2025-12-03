// API utilities for fetching data from PayloadCMS backend
import type { Provider } from '../types/provider';

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api';

// PayloadCMS provider structure (from backend)
interface PayloadProvider {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type: string;
  location: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    county: string;
  };
  contact: {
    phone?: string;
    phone24hr?: string | null;
    fax?: string | null;
    email?: string | null;
    website?: string | null;
  };
  hours: {
    monday?: string;
    tuesday?: string;
    wednesday?: string;
    thursday?: string;
    friday?: string;
    saturday?: string;
    sunday?: string;
  };
  services: {
    medical: Array<{ id: string; service: string }>;
    support: Array<{ id: string; service: string }>;
    prevention: Array<{ id: string; service: string }>;
  };
  eligibility: Array<{ id: string; requirement: string }>;
  ryanWhite: boolean;
  ryanWhiteParts: string[];
  languages: Array<{ id: string; language: string }>;
  accessibility: Array<{ id: string; feature: string }>;
  insurance: Array<{ id: string; plan: string }>;
  coordinates: {
    lat: number;
    lng: number;
  };
  status: string;
}

interface PayloadResponse {
  docs: PayloadProvider[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
}

// Helper to parse hours string like "08:00 - 17:00" or "Closed"
function parseHours(hoursStr: string | undefined): { open: string; close: string } | null {
  if (!hoursStr || hoursStr === 'Closed') return null;
  const [open, close] = hoursStr.split(' - ');
  return { open, close };
}

// Helper to check if a service is in the array
function hasService(services: Array<{ service: string }>, serviceName: string): boolean {
  return services.some(s =>
    s.service.toLowerCase().replace(/\s+/g, '_') === serviceName.toLowerCase()
  );
}

// Helper to get specialty care services
function getSpecialtyCare(services: Array<{ service: string }>): string[] {
  const specialties = [
    'Infectious Disease',
    'Internal Medicine',
    'Psychiatry',
    'Addiction Medicine',
    'Reproductive Health'
  ];

  return services
    .filter(s => specialties.some(spec => s.service === spec))
    .map(s => s.service.toLowerCase().replace(/\s+/g, '_'));
}

// Transform PayloadCMS provider to frontend Provider type
function transformProvider(payloadProvider: PayloadProvider): Provider {
  const medical = payloadProvider.services.medical;
  const support = payloadProvider.services.support;
  const prevention = payloadProvider.services.prevention;

  // Map provider type from backend to frontend enum
  const typeMap: Record<string, Provider['type']> = {
    'FQHC': 'FQHC',
    'Hospital': 'Hospital',
    'Community': 'Community Health Center',
    'Other': 'Private Practice',
  };

  return {
    id: payloadProvider.slug,
    name: payloadProvider.name,
    type: typeMap[payloadProvider.type] || 'Community Health Center',
    ryan_white_parts: payloadProvider.ryanWhiteParts as ('A' | 'B' | 'C' | 'D')[],
    contact: {
      phone: payloadProvider.contact.phone || '',
      phone_24hr: payloadProvider.contact.phone24hr || undefined,
      email: payloadProvider.contact.email || undefined,
      website: payloadProvider.contact.website || undefined,
    },
    locations: [
      {
        id: `${payloadProvider.slug}-main`,
        address: payloadProvider.location.address,
        city: payloadProvider.location.city,
        county: payloadProvider.location.county as 'middlesex' | 'somerset' | 'hunterdon',
        zip_code: payloadProvider.location.zipCode,
        coordinates: payloadProvider.coordinates,
        accessibility: payloadProvider.accessibility.map(a => a.feature.toLowerCase().replace(/\s+/g, '_')),
        hours: {
          monday: parseHours(payloadProvider.hours.monday),
          tuesday: parseHours(payloadProvider.hours.tuesday),
          wednesday: parseHours(payloadProvider.hours.wednesday),
          thursday: parseHours(payloadProvider.hours.thursday),
          friday: parseHours(payloadProvider.hours.friday),
          saturday: parseHours(payloadProvider.hours.saturday),
          sunday: parseHours(payloadProvider.hours.sunday),
        },
      },
    ],
    services: {
      medical_care: {
        hiv_treatment: hasService(medical, 'hiv_treatment'),
        prep_services: hasService(medical, 'prep_services'),
        std_testing: hasService(medical, 'std_testing'),
        specialty_care: getSpecialtyCare(medical),
        dental_care: hasService(medical, 'dental_care'),
        mental_health_medical: hasService(medical, 'mental_health'),
      },
      support_services: {
        case_management: hasService(support, 'case_management'),
        mental_health: hasService(support, 'mental_health'),
        substance_abuse: hasService(support, 'substance_abuse'),
        housing_assistance: hasService(support, 'housing_assistance'),
        transportation: hasService(support, 'transportation'),
        food_nutrition: hasService(support, 'food_nutrition'),
        legal_services: hasService(support, 'legal_services'),
        insurance_help: hasService(support, 'insurance_help'),
      },
      prevention: {
        hiv_testing: hasService(prevention, 'hiv_testing'),
        counseling: hasService(prevention, 'counseling'),
        prep_counseling: hasService(prevention, 'prep_counseling'),
        education: hasService(prevention, 'education'),
        risk_reduction: hasService(prevention, 'risk_reduction'),
      },
    },
    eligibility: {
      insurance_accepted: payloadProvider.insurance.map(i => i.plan.toLowerCase()),
      special_populations: payloadProvider.eligibility.map(e =>
        e.requirement.toLowerCase().replace(/\s+/g, '_')
      ),
    },
    languages: payloadProvider.languages.map(l => l.language.toLowerCase()),
    last_updated: new Date().toISOString(), // Using current date since backend tracks this differently
    description: payloadProvider.description,
    featured: payloadProvider.ryanWhite && payloadProvider.ryanWhiteParts.includes('A'),
  };
}

// Fetch all active providers from the API
export async function fetchProviders(): Promise<Provider[]> {
  try {
    const allProviders: PayloadProvider[] = [];
    let page = 1;
    let hasMore = true;

    // Fetch all pages, filtering for active providers only
    while (hasMore) {
      const response = await fetch(
        `${API_BASE_URL}/providers?where[status][equals]=active&limit=100&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch providers: ${response.statusText}`);
      }

      const data: PayloadResponse = await response.json();
      allProviders.push(...data.docs);

      hasMore = data.hasNextPage;
      page++;
    }

    // Transform and return providers
    return allProviders.map(transformProvider);
  } catch (error) {
    console.error('Error fetching providers:', error);
    throw error;
  }
}

// Fetch a single provider by slug (only if active)
export async function fetchProviderBySlug(slug: string): Promise<Provider | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/providers?where[slug][equals]=${slug}&where[status][equals]=active&limit=1`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch provider: ${response.statusText}`);
    }

    const data: PayloadResponse = await response.json();

    if (data.docs.length === 0) {
      return null;
    }

    return transformProvider(data.docs[0]);
  } catch (error) {
    console.error(`Error fetching provider ${slug}:`, error);
    return null;
  }
}
