// API utilities for fetching data from PayloadCMS backend
import type { Provider } from '../types/provider';

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:3000/api';

// FAQ type definitions
export interface FAQ {
  id: number;
  question: string;
  slug: string;
  answer: any; // Rich text content
  category: string;
  order: number;
  language: 'english' | 'spanish' | 'both';
  tags?: Array<{ id: number; name: string }>;
  status: 'draft' | 'published' | 'archived';
}

interface FAQResponse {
  docs: FAQ[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
}

// Resource type definitions
export interface Resource {
  id: number;
  title: string;
  slug: string;
  description: any; // Rich text content
  category: string;
  pdfFile?: {
    id: number;
    url: string;
    filename: string;
    mimeType: string;
    filesize: number;
  };
  externalLink?: string;
  linkType: 'internal_pdf' | 'external_link';
  tags?: Array<{ id: number; name: string }>;
  language: 'english' | 'spanish' | 'both';
  featured: boolean;
  publishedDate: string;
  status: 'draft' | 'published' | 'archived';
}

interface ResourceResponse {
  docs: Resource[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
}

// Page type definitions
export interface Page {
  id: number;
  title: string;
  slug: string;
  content: any; // Rich text content
  excerpt?: string;
  meta?: {
    title?: string;
    description?: string;
    image?: {
      id: number;
      url: string;
      alt?: string;
    };
  };
  featuredImage?: {
    id: number;
    url: string;
    alt?: string;
  };
  showInNavigation: boolean;
  language: 'english' | 'spanish' | 'both';
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  updatedAt: string;
}

interface PageResponse {
  docs: Page[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
}

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

// Fetch all published FAQs, sorted by order and category
export async function fetchFAQs(language: 'english' | 'spanish' | 'both' = 'english'): Promise<FAQ[]> {
  try {
    const allFAQs: FAQ[] = [];
    let page = 1;
    let hasMore = true;

    // Fetch all pages, filtering for published FAQs only
    while (hasMore) {
      // Build language filter - show FAQs that match language or are marked as 'both'
      const languageFilter = language === 'both'
        ? ''
        : `&where[or][0][language][equals]=${language}&where[or][1][language][equals]=both`;

      const response = await fetch(
        `${API_BASE_URL}/faqs?where[status][equals]=published${languageFilter}&limit=100&page=${page}&sort=order`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch FAQs: ${response.statusText}`);
      }

      const data: FAQResponse = await response.json();
      allFAQs.push(...data.docs);

      hasMore = data.hasNextPage;
      page++;
    }

    return allFAQs;
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    throw error;
  }
}

// Fetch FAQs grouped by category
export async function fetchFAQsByCategory(language: 'english' | 'spanish' | 'both' = 'english'): Promise<Record<string, FAQ[]>> {
  const faqs = await fetchFAQs(language);

  // Group FAQs by category
  return faqs.reduce((grouped, faq) => {
    const category = faq.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(faq);
    return grouped;
  }, {} as Record<string, FAQ[]>);
}

// Fetch all published resources
export async function fetchResources(
  linkType?: 'internal_pdf' | 'external_link',
  language: 'english' | 'spanish' | 'both' = 'english'
): Promise<Resource[]> {
  try {
    const allResources: Resource[] = [];
    let page = 1;
    let hasMore = true;

    // Build filters
    const linkTypeFilter = linkType ? `&where[linkType][equals]=${linkType}` : '';
    const languageFilter = language === 'both'
      ? ''
      : `&where[or][0][language][equals]=${language}&where[or][1][language][equals]=both`;

    // Fetch all pages, filtering for published resources
    while (hasMore) {
      const response = await fetch(
        `${API_BASE_URL}/resources?where[status][equals]=published${linkTypeFilter}${languageFilter}&limit=100&page=${page}&sort=-publishedDate`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch resources: ${response.statusText}`);
      }

      const data: ResourceResponse = await response.json();
      allResources.push(...data.docs);

      hasMore = data.hasNextPage;
      page++;
    }

    return allResources;
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
}

// Fetch only external link resources (for External Resources page)
export async function fetchExternalResources(language: 'english' | 'spanish' | 'both' = 'english'): Promise<Resource[]> {
  return fetchResources('external_link', language);
}

// Fetch only PDF resources (for PDF Library page)
export async function fetchPDFResources(language: 'english' | 'spanish' | 'both' = 'english'): Promise<Resource[]> {
  return fetchResources('internal_pdf', language);
}

// Fetch resources grouped by category
export async function fetchResourcesByCategory(
  linkType?: 'internal_pdf' | 'external_link',
  language: 'english' | 'spanish' | 'both' = 'english'
): Promise<Record<string, Resource[]>> {
  const resources = await fetchResources(linkType, language);

  // Group resources by category
  return resources.reduce((grouped, resource) => {
    const category = resource.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(resource);
    return grouped;
  }, {} as Record<string, Resource[]>);
}

// Fetch all published pages
export async function fetchPages(language: 'english' | 'spanish' | 'both' = 'english'): Promise<Page[]> {
  try {
    const allPages: Page[] = [];
    let page = 1;
    let hasMore = true;

    // Build language filter - show pages that match language or are marked as 'both'
    const languageFilter = language === 'both'
      ? ''
      : `&where[or][0][language][equals]=${language}&where[or][1][language][equals]=both`;

    // Fetch all pages, filtering for published pages only
    while (hasMore) {
      const response = await fetch(
        `${API_BASE_URL}/pages?where[status][equals]=published${languageFilter}&limit=100&page=${page}&sort=title`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch pages: ${response.statusText}`);
      }

      const data: PageResponse = await response.json();
      allPages.push(...data.docs);

      hasMore = data.hasNextPage;
      page++;
    }

    return allPages;
  } catch (error) {
    console.error('Error fetching pages:', error);
    throw error;
  }
}

// Fetch a single page by slug (only if published)
export async function fetchPageBySlug(slug: string): Promise<Page | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/pages?where[slug][equals]=${slug}&where[status][equals]=published&limit=1`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.statusText}`);
    }

    const data: PageResponse = await response.json();

    if (data.docs.length === 0) {
      return null;
    }

    return data.docs[0];
  } catch (error) {
    console.error(`Error fetching page ${slug}:`, error);
    return null;
  }
}
