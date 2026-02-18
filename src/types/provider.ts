// Provider data types for HIV Connect Central NJ
export interface ContactInfo {
  phone: string;
  phone_24hr?: string;
  fax?: string;
  email?: string;
  website?: string;
  telehealth_portal?: string;
}

export interface Location {
  id: string;
  address: string;
  city: string;
  county: 'middlesex' | 'somerset' | 'hunterdon';
  zip_code: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  accessibility: string[];
  hours: {
    [key: string]: {
      open: string;
      close: string;
    } | null;
  };
  emergency_hours?: string;
}

export interface ServiceCategories {
  medical_care: {
    hiv_treatment: boolean;
    prep_services: boolean;
    std_testing: boolean;
    specialty_care: string[];
    dental_care: boolean;
    mental_health_medical: boolean;
  };
  support_services: {
    case_management: boolean;
    mental_health: boolean;
    substance_abuse: boolean;
    housing_assistance: boolean;
    transportation: boolean;
    food_nutrition: boolean;
    legal_services: boolean;
    insurance_help: boolean;
  };
  prevention: {
    hiv_testing: boolean;
    counseling: boolean;
    prep_counseling: boolean;
    education: boolean;
    risk_reduction: boolean;
  };
}

export interface EligibilityInfo {
  income_requirements?: string;
  insurance_accepted: string[];
  special_populations: string[];
  age_restrictions?: string;
}

export interface Provider {
  id: string;
  name: string;
  type: 'FQHC' | 'Hospital' | 'Community Health Center' | 'Private Practice' | 'ASO';
  ryan_white_parts: ('A' | 'B' | 'C' | 'D')[];
  contact: ContactInfo;
  locations: Location[];
  services: ServiceCategories;
  eligibility: EligibilityInfo;
  languages: string[];
  last_updated: string;
  description?: string;
  featured?: boolean;
  walk_in_accepted?: boolean; // true = walk-ins welcome, false = appointment required, undefined = unknown
  ryan_white_contact?: {       // Optional: specific RW program contact at this provider
    name?: string;
    phone?: string;
    email?: string;
    notes?: string;
  };
}

export interface SearchFilters {
  location: {
    county?: 'middlesex' | 'somerset' | 'hunterdon';
    city?: string;
    zip_code?: string;
    radius?: number;
  };
  services: string[];
  accessibility: string[];
  insurance: string[];
  languages: string[];
  urgency: 'routine' | 'urgent' | 'emergency';
}