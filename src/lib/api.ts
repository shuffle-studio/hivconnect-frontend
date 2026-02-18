// API utilities for fetching data from PayloadCMS backend
import type { Provider } from '../types/provider';

// Use PUBLIC_PAYLOAD_URL (without /api suffix) for the base URL
const PAYLOAD_URL = import.meta.env.PUBLIC_PAYLOAD_URL || 'https://hivconnect-backend-production.shuffle-seo.workers.dev';
const API_BASE_URL = `${PAYLOAD_URL}/api`;

// FAQ type definitions
export interface FAQ {
  id: number;
  question: string;
  slug: string;
  answer: any; // Rich text content (Lexical format)
  category: string;
  order: number;
  language: 'english' | 'spanish' | 'both';
  tags?: Array<{ id: number; name: string }>;
  status: 'draft' | 'published' | 'archived';
}

// Helper function to extract plain text from Lexical rich text format
export function extractTextFromLexical(lexicalData: any): string {
  if (!lexicalData || !lexicalData.root || !lexicalData.root.children) {
    return '';
  }

  let text = '';
  const processNode = (node: any): void => {
    if (node.type === 'text') {
      text += node.text;
    } else if (node.children && Array.isArray(node.children)) {
      node.children.forEach((child: any) => processNode(child));
      // Add paragraph breaks
      if (node.type === 'paragraph' && text && !text.endsWith('\n\n')) {
        text += '\n\n';
      }
    }
  };

  lexicalData.root.children.forEach((child: any) => processNode(child));
  return text.trim();
}

// Render Lexical rich text format to HTML string
export function renderLexicalToHTML(lexicalData: any): string {
  if (!lexicalData) return '';

  // If it's already a plain string, return it wrapped in a paragraph
  if (typeof lexicalData === 'string') {
    return `<p>${lexicalData}</p>`;
  }

  if (!lexicalData.root || !lexicalData.root.children) {
    return '';
  }

  const escapeHTML = (str: string): string =>
    str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const renderTextNode = (node: any): string => {
    let text = escapeHTML(node.text || '');
    if (node.format) {
      if (node.format & 1) text = `<strong>${text}</strong>`;
      if (node.format & 2) text = `<em>${text}</em>`;
      if (node.format & 8) text = `<u>${text}</u>`;
      if (node.format & 4) text = `<s>${text}</s>`;
      if (node.format & 16) text = `<code>${text}</code>`;
    }
    return text;
  };

  const renderNode = (node: any): string => {
    if (!node) return '';

    switch (node.type) {
      case 'text':
        return renderTextNode(node);

      case 'link': {
        const href = node.fields?.url || node.url || '#';
        const children = (node.children || []).map(renderNode).join('');
        return `<a href="${escapeHTML(href)}" target="_blank" rel="noopener noreferrer">${children}</a>`;
      }

      case 'paragraph': {
        const children = (node.children || []).map(renderNode).join('');
        return children ? `<p>${children}</p>` : '';
      }

      case 'heading': {
        const tag = node.tag || 'h2';
        const children = (node.children || []).map(renderNode).join('');
        return `<${tag}>${children}</${tag}>`;
      }

      case 'list': {
        const tag = node.listType === 'number' ? 'ol' : 'ul';
        const children = (node.children || []).map(renderNode).join('');
        return `<${tag}>${children}</${tag}>`;
      }

      case 'listitem': {
        const children = (node.children || []).map(renderNode).join('');
        return `<li>${children}</li>`;
      }

      case 'quote': {
        const children = (node.children || []).map(renderNode).join('');
        return `<blockquote>${children}</blockquote>`;
      }

      case 'horizontalrule':
        return '<hr />';

      case 'linebreak':
        return '<br />';

      default:
        if (node.children && Array.isArray(node.children)) {
          return node.children.map(renderNode).join('');
        }
        return '';
    }
  };

  return lexicalData.root.children.map(renderNode).join('');
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
  walkInAccepted?: boolean;
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
    walk_in_accepted: payloadProvider.walkInAccepted,
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

// Event type definitions
export interface Event {
  id: number;
  title: string;
  slug: string;
  description: any; // Rich text content (Lexical format)
  featuredImage?: {
    id: number;
    url: string;
    alt?: string;
  };
  startDate: string;
  endDate?: string;
  location: {
    type: 'in-person' | 'virtual' | 'hybrid';
    venueName?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    virtualLink?: string;
  };
  coordinates?: {
    lat: number | null;
    lng: number | null;
  };
  contactEmail?: string;
  contactPhone?: string;
  rsvpLink?: string;
  category: string;
  tags?: Array<{ id: number; name: string }>;
  status: 'draft' | 'published' | 'cancelled';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

interface EventResponse {
  docs: Event[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  hasNextPage: boolean;
}

// Fetch all published events
export async function fetchEvents(
  includeUpcoming: boolean = true,
  includePast: boolean = false
): Promise<Event[]> {
  try {
    const allEvents: Event[] = [];
    let page = 1;
    let hasMore = true;

    // Build date filter based on flags
    const now = new Date().toISOString();
    let dateFilter = '';

    if (includeUpcoming && !includePast) {
      // Only upcoming events
      dateFilter = `&where[startDate][greater_than_equal]=${now}`;
    } else if (!includeUpcoming && includePast) {
      // Only past events
      dateFilter = `&where[startDate][less_than]=${now}`;
    }
    // If both true or both false, fetch all events (no date filter)

    // Fetch all pages, filtering for published events only
    while (hasMore) {
      const response = await fetch(
        `${API_BASE_URL}/events?where[status][equals]=published${dateFilter}&limit=100&page=${page}&sort=startDate`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`);
      }

      const data: EventResponse = await response.json();
      allEvents.push(...data.docs);

      hasMore = data.hasNextPage;
      page++;
    }

    return allEvents;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
}

// Fetch upcoming events only
export async function fetchUpcomingEvents(): Promise<Event[]> {
  return fetchEvents(true, false);
}

// Fetch past events only
export async function fetchPastEvents(): Promise<Event[]> {
  return fetchEvents(false, true);
}

// Fetch featured events
export async function fetchFeaturedEvents(): Promise<Event[]> {
  try {
    const now = new Date().toISOString();
    const response = await fetch(
      `${API_BASE_URL}/events?where[status][equals]=published&where[featured][equals]=true&where[startDate][greater_than_equal]=${now}&limit=10&sort=startDate`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch featured events: ${response.statusText}`);
    }

    const data: EventResponse = await response.json();
    return data.docs;
  } catch (error) {
    console.error('Error fetching featured events:', error);
    throw error;
  }
}

// Fetch a single event by slug (only if published)
export async function fetchEventBySlug(slug: string): Promise<Event | null> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/events?where[slug][equals]=${slug}&where[status][equals]=published&limit=1`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch event: ${response.statusText}`);
    }

    const data: EventResponse = await response.json();

    if (data.docs.length === 0) {
      return null;
    }

    return data.docs[0];
  } catch (error) {
    console.error(`Error fetching event ${slug}:`, error);
    return null;
  }
}
