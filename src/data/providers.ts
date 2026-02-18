// Complete provider data for HIV Connect Central NJ - MSHTGA Network
import type { Provider } from '../types/provider';

export const providers: Provider[] = [
  // Existing providers (updated)
  {
    id: 'eric-chandler-health-center',
    name: 'Eric B. Chandler Health Center',
    type: 'FQHC',
    ryan_white_parts: ['A', 'B', 'C'],
    contact: {
      phone: '(732) 745-4500',
      phone_24hr: '(732) 745-4500',
      email: 'info@chandlerhealth.org',
      website: 'https://www.chandlerhealth.org'
    },
    locations: [
      {
        id: 'chandler-main',
        address: '35 Commercial Avenue',
        city: 'New Brunswick',
        county: 'middlesex',
        zip_code: '08901',
        coordinates: { lat: 40.4862, lng: -74.4518 },
        accessibility: ['wheelchair', 'parking', 'public_transit'],
        hours: {
          monday: { open: '08:00', close: '17:00' },
          tuesday: { open: '08:00', close: '17:00' },
          wednesday: { open: '08:00', close: '17:00' },
          thursday: { open: '08:00', close: '17:00' },
          friday: { open: '08:00', close: '17:00' },
          saturday: { open: '09:00', close: '13:00' },
          sunday: null
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: true,
        prep_services: true,
        std_testing: true,
        specialty_care: ['infectious_disease', 'internal_medicine'],
        dental_care: true,
        mental_health_medical: true
      },
      support_services: {
        case_management: true,
        mental_health: true,
        substance_abuse: false,
        housing_assistance: true,
        transportation: true,
        food_nutrition: false,
        legal_services: false,
        insurance_help: true
      },
      prevention: {
        hiv_testing: true,
        counseling: true,
        prep_counseling: true,
        education: true,
        risk_reduction: true
      }
    },
    eligibility: {
      income_requirements: 'up_to_400_fpl',
      insurance_accepted: ['medicaid', 'medicare', 'private', 'uninsured'],
      special_populations: ['lgbtq', 'youth', 'women']
    },
    languages: ['english', 'spanish'],
    last_updated: '2025-01-15T10:00:00Z',
    description: 'Comprehensive HIV care and support services in a welcoming, community-focused environment.',
    featured: true
  },
  {
    id: 'rwj-dental-program',
    name: 'Robert Wood Johnson University Hospital - Dental Program',
    type: 'Hospital',
    ryan_white_parts: ['A', 'B'],
    contact: {
      phone: '(732) 937-8653',
      fax: '(973) 635-9422',
      website: 'https://www.rwjbh.org/for-health-care-professionals/medical-education/robert-wood-johnson-university-hospital/dental-residency/dental-facilities-at-rwjuh/'
    },
    locations: [
      {
        id: 'rwj-dental-main',
        address: 'One Robert Wood Johnson Place, DentalSuite B',
        city: 'New Brunswick',
        county: 'middlesex',
        zip_code: '08901',
        coordinates: { lat: 40.4897, lng: -74.4480 },
        accessibility: ['wheelchair', 'parking'],
        hours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '17:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '17:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: null,
          sunday: null
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: false,
        prep_services: false,
        std_testing: false,
        specialty_care: [],
        dental_care: true,
        mental_health_medical: false
      },
      support_services: {
        case_management: false,
        mental_health: false,
        substance_abuse: false,
        housing_assistance: false,
        transportation: false,
        food_nutrition: false,
        legal_services: false,
        insurance_help: false
      },
      prevention: {
        hiv_testing: false,
        counseling: false,
        prep_counseling: false,
        education: false,
        risk_reduction: false
      }
    },
    eligibility: {
      insurance_accepted: ['medicaid', 'medicare', 'private'],
      special_populations: ['hiv_positive']
    },
    languages: ['english'],
    last_updated: '2026-02-18T00:00:00Z',
    walk_in_accepted: false,
    description: 'Specialized dental care for HIV-positive patients at Robert Wood Johnson University Hospital. By appointment only.'
  },
  {
    id: 'rwj-aids-program',
    name: 'Rutgers Robert Wood Johnson AIDS Program',
    type: 'Hospital',
    ryan_white_parts: ['A', 'B'],
    contact: {
      phone: '(732) 235-7601',
      email: 'aids-program@rwjms.rutgers.edu',
      website: 'https://www.rwjms.rutgers.edu'
    },
    locations: [
      {
        id: 'rwj-main',
        address: '125 Paterson Street',
        city: 'New Brunswick',
        county: 'middlesex',
        zip_code: '08901',
        coordinates: { lat: 40.4896, lng: -74.4483 },
        accessibility: ['wheelchair', 'parking'],
        hours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '17:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '17:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: null,
          sunday: null
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: true,
        prep_services: true,
        std_testing: true,
        specialty_care: ['infectious_disease', 'psychiatry'],
        dental_care: false,
        mental_health_medical: true
      },
      support_services: {
        case_management: true,
        mental_health: true,
        substance_abuse: true,
        housing_assistance: false,
        transportation: false,
        food_nutrition: false,
        legal_services: false,
        insurance_help: true
      },
      prevention: {
        hiv_testing: true,
        counseling: true,
        prep_counseling: true,
        education: true,
        risk_reduction: true
      }
    },
    eligibility: {
      insurance_accepted: ['medicaid', 'medicare', 'private'],
      special_populations: ['adults']
    },
    languages: ['english', 'spanish'],
    last_updated: '2025-01-15T10:00:00Z',
    description: 'Academic medical center providing specialized HIV care and research-based treatment.'
  },
  {
    id: 'somerset-treatment-services',
    name: 'Somerset Treatment Services',
    type: 'Community Health Center',
    ryan_white_parts: ['B'],
    contact: {
      phone: '(908) 725-4900',
      website: 'https://www.somersettreatment.org'
    },
    locations: [
      {
        id: 'somerset-main',
        address: '118 Union Avenue',
        city: 'Somerville',
        county: 'somerset',
        zip_code: '08876',
        coordinates: { lat: 40.5743, lng: -74.6099 },
        accessibility: ['wheelchair', 'parking'],
        hours: {
          monday: { open: '08:30', close: '17:00' },
          tuesday: { open: '08:30', close: '17:00' },
          wednesday: { open: '08:30', close: '17:00' },
          thursday: { open: '08:30', close: '17:00' },
          friday: { open: '08:30', close: '17:00' },
          saturday: null,
          sunday: null
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: false,
        prep_services: false,
        std_testing: true,
        specialty_care: ['psychiatry'],
        dental_care: false,
        mental_health_medical: true
      },
      support_services: {
        case_management: true,
        mental_health: true,
        substance_abuse: true,
        housing_assistance: true,
        transportation: false,
        food_nutrition: false,
        legal_services: false,
        insurance_help: true
      },
      prevention: {
        hiv_testing: true,
        counseling: true,
        prep_counseling: false,
        education: true,
        risk_reduction: true
      }
    },
    eligibility: {
      insurance_accepted: ['medicaid', 'medicare', 'private', 'uninsured'],
      special_populations: ['substance_use']
    },
    languages: ['english', 'spanish'],
    last_updated: '2025-01-15T10:00:00Z',
    description: 'Integrated substance abuse treatment and HIV support services.'
  },

  // NEW PROVIDERS FROM CSV DATA
  {
    id: 'hyacinth-aids-foundation',
    name: 'Hyacinth AIDS Foundation',
    type: 'ASO',
    ryan_white_parts: ['A', 'B'],
    contact: {
      phone: '(732) 246-0204',
      website: 'https://www.hyacinth.org'
    },
    locations: [
      {
        id: 'hyacinth-new-brunswick',
        address: '103 Bayard Street',
        city: 'New Brunswick',
        county: 'middlesex',
        zip_code: '08901',
        coordinates: { lat: 40.4896, lng: -74.4519 },
        accessibility: ['wheelchair', 'parking', 'public_transit'],
        hours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '17:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '17:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: null,
          sunday: null
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: false,
        prep_services: false,
        std_testing: false,
        specialty_care: [],
        dental_care: false,
        mental_health_medical: false
      },
      support_services: {
        case_management: true,
        mental_health: true,
        substance_abuse: false,
        housing_assistance: true,
        transportation: true,
        food_nutrition: true,
        legal_services: false,
        insurance_help: true
      },
      prevention: {
        hiv_testing: false,
        counseling: true,
        prep_counseling: false,
        education: true,
        risk_reduction: true
      }
    },
    eligibility: {
      insurance_accepted: ['medicaid', 'medicare', 'private', 'uninsured'],
      special_populations: ['lgbtq', 'youth', 'women', 'people_with_hiv']
    },
    languages: ['english', 'spanish'],
    last_updated: '2025-01-15T10:00:00Z',
    description: 'Comprehensive support services including housing assistance, support groups, and emergency financial assistance.',
    featured: true
  },
  {
    id: 'zufall-health',
    name: 'Zufall Health Center',
    type: 'FQHC',
    ryan_white_parts: ['A', 'B', 'C'],
    contact: {
      phone: '(973) 328-5000',
      website: 'https://www.zufallhealth.org'
    },
    locations: [
      {
        id: 'zufall-dover',
        address: '10 Bassett Highway',
        city: 'Dover',
        county: 'middlesex',
        zip_code: '07801',
        coordinates: { lat: 40.8842, lng: -74.5621 },
        accessibility: ['wheelchair', 'parking'],
        hours: {
          monday: { open: '08:00', close: '17:00' },
          tuesday: { open: '08:00', close: '17:00' },
          wednesday: { open: '08:00', close: '17:00' },
          thursday: { open: '08:00', close: '17:00' },
          friday: { open: '08:00', close: '17:00' },
          saturday: { open: '09:00', close: '13:00' },
          sunday: null
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: true,
        prep_services: true,
        std_testing: true,
        specialty_care: ['internal_medicine'],
        dental_care: true,
        mental_health_medical: true
      },
      support_services: {
        case_management: true,
        mental_health: true,
        substance_abuse: false,
        housing_assistance: false,
        transportation: true,
        food_nutrition: false,
        legal_services: false,
        insurance_help: true
      },
      prevention: {
        hiv_testing: true,
        counseling: true,
        prep_counseling: true,
        education: true,
        risk_reduction: true
      }
    },
    eligibility: {
      income_requirements: 'up_to_400_fpl',
      insurance_accepted: ['medicaid', 'medicare', 'private', 'uninsured'],
      special_populations: ['uninsured', 'low_income']
    },
    languages: ['english', 'spanish'],
    last_updated: '2025-01-15T10:00:00Z',
    description: 'Federally Qualified Health Center providing comprehensive medical care regardless of insurance status.'
  },
  {
    id: 'nbcc',
    name: 'New Brunswick Community Center (NBCC)',
    type: 'Community Health Center',
    ryan_white_parts: ['B'],
    contact: {
      phone: '(732) 247-1666',
      website: 'https://www.nbcc.org'
    },
    locations: [
      {
        id: 'nbcc-main',
        address: '88 Easton Avenue',
        city: 'New Brunswick',
        county: 'middlesex',
        zip_code: '08901',
        coordinates: { lat: 40.4896, lng: -74.4519 },
        accessibility: ['wheelchair', 'parking', 'public_transit'],
        hours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '17:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '17:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: null,
          sunday: null
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: false,
        prep_services: false,
        std_testing: true,
        specialty_care: ['addiction_medicine'],
        dental_care: false,
        mental_health_medical: true
      },
      support_services: {
        case_management: true,
        mental_health: true,
        substance_abuse: true,
        housing_assistance: true,
        transportation: false,
        food_nutrition: false,
        legal_services: false,
        insurance_help: true
      },
      prevention: {
        hiv_testing: true,
        counseling: true,
        prep_counseling: false,
        education: true,
        risk_reduction: true
      }
    },
    eligibility: {
      insurance_accepted: ['medicaid', 'medicare', 'private', 'uninsured'],
      special_populations: ['substance_use', 'mental_health']
    },
    languages: ['english', 'spanish'],
    last_updated: '2025-01-15T10:00:00Z',
    description: 'Substance use treatment and HIV support services with integrated care approach.'
  },
  {
    id: 'raritan-bay-medical-center',
    name: 'Raritan Bay Medical Center',
    type: 'Hospital',
    ryan_white_parts: ['A', 'B'],
    contact: {
      phone: '(732) 324-5000',
      website: 'https://www.rwjbh.org/raritan-bay-medical-center'
    },
    locations: [
      {
        id: 'raritan-bay-perth-amboy',
        address: '530 New Brunswick Avenue',
        city: 'Perth Amboy',
        county: 'middlesex',
        zip_code: '08861',
        coordinates: { lat: 40.5057, lng: -74.2654 },
        accessibility: ['wheelchair', 'parking'],
        hours: {
          monday: { open: '08:00', close: '17:00' },
          tuesday: { open: '08:00', close: '17:00' },
          wednesday: { open: '08:00', close: '17:00' },
          thursday: { open: '08:00', close: '17:00' },
          friday: { open: '08:00', close: '17:00' },
          saturday: null,
          sunday: null
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: true,
        prep_services: true,
        std_testing: true,
        specialty_care: ['infectious_disease'],
        dental_care: false,
        mental_health_medical: true
      },
      support_services: {
        case_management: true,
        mental_health: true,
        substance_abuse: false,
        housing_assistance: false,
        transportation: false,
        food_nutrition: false,
        legal_services: false,
        insurance_help: true
      },
      prevention: {
        hiv_testing: true,
        counseling: true,
        prep_counseling: true,
        education: true,
        risk_reduction: true
      }
    },
    eligibility: {
      insurance_accepted: ['medicaid', 'medicare', 'private', 'uninsured'],
      special_populations: ['uninsured']
    },
    languages: ['english', 'spanish'],
    last_updated: '2025-01-15T10:00:00Z',
    walk_in_accepted: false,
    description: 'Hospital-based HIV care with medical case management and comprehensive services.'
  },
  {
    id: 'vnahg',
    name: 'Visiting Nurse Association Health Group (VNAHG)',
    type: 'Community Health Center',
    ryan_white_parts: ['B'],
    contact: {
      phone: '(732) 324-3600',
      website: 'https://www.vnahg.org'
    },
    locations: [
      {
        id: 'vnahg-main',
        address: '141 Bodman Place',
        city: 'Red Bank',
        county: 'middlesex',
        zip_code: '07701',
        coordinates: { lat: 40.3471, lng: -74.0776 },
        accessibility: ['wheelchair', 'parking'],
        hours: {
          monday: { open: '08:30', close: '17:00' },
          tuesday: { open: '08:30', close: '17:00' },
          wednesday: { open: '08:30', close: '17:00' },
          thursday: { open: '08:30', close: '17:00' },
          friday: { open: '08:30', close: '17:00' },
          saturday: null,
          sunday: null
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: false,
        prep_services: false,
        std_testing: false,
        specialty_care: [],
        dental_care: false,
        mental_health_medical: false
      },
      support_services: {
        case_management: true,
        mental_health: true,
        substance_abuse: false,
        housing_assistance: true,
        transportation: true,
        food_nutrition: false,
        legal_services: false,
        insurance_help: true
      },
      prevention: {
        hiv_testing: false,
        counseling: true,
        prep_counseling: false,
        education: true,
        risk_reduction: false
      }
    },
    eligibility: {
      insurance_accepted: ['medicaid', 'medicare', 'private'],
      special_populations: ['elderly', 'disabled']
    },
    languages: ['english'],
    last_updated: '2025-01-15T10:00:00Z',
    description: 'Medical case management and support services with focus on care coordination.'
  },
  {
    id: 'central-jersey-legal-services',
    name: 'Central Jersey Legal Services',
    type: 'ASO',
    ryan_white_parts: ['B'],
    contact: {
      phone: '(732) 249-7600',
      website: 'https://www.lsnj.org'
    },
    locations: [
      {
        id: 'cjls-new-brunswick',
        address: '317 George Street',
        city: 'New Brunswick',
        county: 'middlesex',
        zip_code: '08901',
        coordinates: { lat: 40.4896, lng: -74.4519 },
        accessibility: ['wheelchair', 'public_transit'],
        hours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '17:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '17:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: null,
          sunday: null
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: false,
        prep_services: false,
        std_testing: false,
        specialty_care: [],
        dental_care: false,
        mental_health_medical: false
      },
      support_services: {
        case_management: false,
        mental_health: false,
        substance_abuse: false,
        housing_assistance: true,
        transportation: false,
        food_nutrition: false,
        legal_services: true,
        insurance_help: true
      },
      prevention: {
        hiv_testing: false,
        counseling: false,
        prep_counseling: false,
        education: false,
        risk_reduction: false
      }
    },
    eligibility: {
      income_requirements: 'up_to_200_fpl',
      insurance_accepted: ['medicaid', 'medicare', 'uninsured'],
      special_populations: ['low_income', 'disabled']
    },
    languages: ['english', 'spanish'],
    last_updated: '2025-01-15T10:00:00Z',
    description: 'Free legal assistance with benefits, housing, and HIV-related discrimination issues.'
  },
  {
    id: 'elijahs-promise',
    name: "Elijah's Promise",
    type: 'ASO',
    ryan_white_parts: ['B'],
    contact: {
      phone: '(732) 545-8800',
      website: 'https://www.elijahspromise.org'
    },
    locations: [
      {
        id: 'elijahs-promise-main',
        address: '91 Elm Row',
        city: 'New Brunswick',
        county: 'middlesex',
        zip_code: '08901',
        coordinates: { lat: 40.4896, lng: -74.4519 },
        accessibility: ['wheelchair', 'parking', 'public_transit'],
        hours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '17:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '17:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: { open: '10:00', close: '14:00' },
          sunday: null
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: false,
        prep_services: false,
        std_testing: false,
        specialty_care: [],
        dental_care: false,
        mental_health_medical: false
      },
      support_services: {
        case_management: false,
        mental_health: false,
        substance_abuse: false,
        housing_assistance: false,
        transportation: false,
        food_nutrition: true,
        legal_services: false,
        insurance_help: false
      },
      prevention: {
        hiv_testing: false,
        counseling: false,
        prep_counseling: false,
        education: false,
        risk_reduction: false
      }
    },
    eligibility: {
      insurance_accepted: ['medicaid', 'medicare', 'private', 'uninsured'],
      special_populations: ['low_income', 'homeless']
    },
    languages: ['english', 'spanish'],
    last_updated: '2025-01-15T10:00:00Z',
    description: 'Food pantry and nutrition services for people affected by HIV/AIDS.'
  },
  {
    id: 'legal-services-nwj-hunterdon',
    name: 'Legal Services of Northwest Jersey - Hunterdon',
    type: 'ASO',
    ryan_white_parts: ['B'],
    contact: {
      phone: '(908) 782-7979',
      website: 'https://www.lsnwj.org'
    },
    locations: [
      {
        id: 'lsnwj-hunterdon',
        address: '82 Park Avenue',
        city: 'Flemington',
        county: 'hunterdon',
        zip_code: '08822',
        coordinates: { lat: 40.5123, lng: -74.8593 },
        accessibility: ['wheelchair', 'parking'],
        hours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '17:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '17:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: null,
          sunday: null
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: false,
        prep_services: false,
        std_testing: false,
        specialty_care: [],
        dental_care: false,
        mental_health_medical: false
      },
      support_services: {
        case_management: false,
        mental_health: false,
        substance_abuse: false,
        housing_assistance: true,
        transportation: false,
        food_nutrition: false,
        legal_services: true,
        insurance_help: true
      },
      prevention: {
        hiv_testing: false,
        counseling: false,
        prep_counseling: false,
        education: false,
        risk_reduction: false
      }
    },
    eligibility: {
      income_requirements: 'up_to_200_fpl',
      insurance_accepted: ['medicaid', 'medicare', 'uninsured'],
      special_populations: ['low_income', 'disabled']
    },
    languages: ['english', 'spanish'],
    last_updated: '2025-01-15T10:00:00Z',
    description: 'Free legal assistance with benefits, housing, and HIV-related discrimination issues in Hunterdon County.'
  },
  {
    id: 'legal-services-nwj-somerset',
    name: 'Legal Services of Northwest Jersey - Somerset',
    type: 'ASO',
    ryan_white_parts: ['B'],
    contact: {
      phone: '(908) 231-0840',
      website: 'https://www.lsnwj.org'
    },
    locations: [
      {
        id: 'lsnwj-somerset',
        address: '190 West End Avenue',
        city: 'Somerville',
        county: 'somerset',
        zip_code: '08876',
        coordinates: { lat: 40.5743, lng: -74.6099 },
        accessibility: ['wheelchair', 'parking'],
        hours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '17:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '17:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: null,
          sunday: null
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: false,
        prep_services: false,
        std_testing: false,
        specialty_care: [],
        dental_care: false,
        mental_health_medical: false
      },
      support_services: {
        case_management: false,
        mental_health: false,
        substance_abuse: false,
        housing_assistance: true,
        transportation: false,
        food_nutrition: false,
        legal_services: true,
        insurance_help: true
      },
      prevention: {
        hiv_testing: false,
        counseling: false,
        prep_counseling: false,
        education: false,
        risk_reduction: false
      }
    },
    eligibility: {
      income_requirements: 'up_to_200_fpl',
      insurance_accepted: ['medicaid', 'medicare', 'uninsured'],
      special_populations: ['low_income', 'disabled']
    },
    languages: ['english', 'spanish'],
    last_updated: '2025-01-15T10:00:00Z',
    description: 'Free legal assistance with benefits, housing, and HIV-related discrimination issues in Somerset County.'
  },
  {
    id: 'mcat-transportation',
    name: 'MCAT (Middlesex County Area Transit)',
    type: 'ASO',
    ryan_white_parts: ['B'],
    contact: {
      phone: '(732) 745-4JOB',
      website: 'https://www.co.middlesex.nj.us'
    },
    locations: [
      {
        id: 'mcat-main',
        address: '75 Bayard Street',
        city: 'New Brunswick',
        county: 'middlesex',
        zip_code: '08901',
        coordinates: { lat: 40.4896, lng: -74.4519 },
        accessibility: ['wheelchair', 'parking', 'public_transit'],
        hours: {
          monday: { open: '08:00', close: '17:00' },
          tuesday: { open: '08:00', close: '17:00' },
          wednesday: { open: '08:00', close: '17:00' },
          thursday: { open: '08:00', close: '17:00' },
          friday: { open: '08:00', close: '17:00' },
          saturday: null,
          sunday: null
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: false,
        prep_services: false,
        std_testing: false,
        specialty_care: [],
        dental_care: false,
        mental_health_medical: false
      },
      support_services: {
        case_management: false,
        mental_health: false,
        substance_abuse: false,
        housing_assistance: false,
        transportation: true,
        food_nutrition: false,
        legal_services: false,
        insurance_help: false
      },
      prevention: {
        hiv_testing: false,
        counseling: false,
        prep_counseling: false,
        education: false,
        risk_reduction: false
      }
    },
    eligibility: {
      insurance_accepted: ['medicaid', 'medicare', 'private', 'uninsured'],
      special_populations: ['disabled', 'elderly', 'low_income']
    },
    languages: ['english', 'spanish'],
    last_updated: '2025-01-15T10:00:00Z',
    description: 'Transportation services for medical appointments and essential services.'
  },
  {
    id: 'zufall-mobile-unit',
    name: 'Zufall Health Mobile Dental Unit',
    type: 'FQHC',
    ryan_white_parts: ['C'],
    contact: {
      phone: '(973) 328-5000',
      website: 'https://www.zufallhealth.org'
    },
    locations: [
      {
        id: 'zufall-mobile',
        address: 'Multiple Community Locations',
        city: 'Various',
        county: 'middlesex',
        zip_code: '07801',
        coordinates: { lat: 40.4896, lng: -74.4519 },
        accessibility: ['wheelchair', 'mobile_unit'],
        hours: {
          monday: { open: '09:00', close: '16:00' },
          tuesday: { open: '09:00', close: '16:00' },
          wednesday: { open: '09:00', close: '16:00' },
          thursday: { open: '09:00', close: '16:00' },
          friday: { open: '09:00', close: '16:00' },
          saturday: null,
          sunday: null
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: false,
        prep_services: false,
        std_testing: false,
        specialty_care: [],
        dental_care: true,
        mental_health_medical: false
      },
      support_services: {
        case_management: false,
        mental_health: false,
        substance_abuse: false,
        housing_assistance: false,
        transportation: false,
        food_nutrition: false,
        legal_services: false,
        insurance_help: true
      },
      prevention: {
        hiv_testing: false,
        counseling: false,
        prep_counseling: false,
        education: false,
        risk_reduction: false
      }
    },
    eligibility: {
      income_requirements: 'up_to_400_fpl',
      insurance_accepted: ['medicaid', 'medicare', 'private', 'uninsured'],
      special_populations: ['uninsured', 'low_income']
    },
    languages: ['english', 'spanish'],
    last_updated: '2025-01-15T10:00:00Z',
    description: 'Mobile dental services bringing oral health care directly to communities.'
  },
  {
    id: 'cvs-pharmacy',
    name: 'CVS Pharmacy (Multiple Locations)',
    type: 'Private Practice',
    ryan_white_parts: [],
    contact: {
      phone: '1-800-SHOP-CVS',
      website: 'https://www.cvs.com'
    },
    locations: [
      {
        id: 'cvs-multiple',
        address: 'Multiple Locations',
        city: 'Various',
        county: 'middlesex',
        zip_code: 'Various',
        coordinates: { lat: 40.4896, lng: -74.4519 },
        accessibility: ['wheelchair', 'parking'],
        hours: {
          monday: { open: '08:00', close: '22:00' },
          tuesday: { open: '08:00', close: '22:00' },
          wednesday: { open: '08:00', close: '22:00' },
          thursday: { open: '08:00', close: '22:00' },
          friday: { open: '08:00', close: '22:00' },
          saturday: { open: '08:00', close: '22:00' },
          sunday: { open: '10:00', close: '18:00' }
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: false,
        prep_services: false,
        std_testing: false,
        specialty_care: [],
        dental_care: false,
        mental_health_medical: false
      },
      support_services: {
        case_management: false,
        mental_health: false,
        substance_abuse: false,
        housing_assistance: false,
        transportation: false,
        food_nutrition: false,
        legal_services: false,
        insurance_help: false
      },
      prevention: {
        hiv_testing: true,
        counseling: true,
        prep_counseling: false,
        education: true,
        risk_reduction: false
      }
    },
    eligibility: {
      insurance_accepted: ['medicaid', 'medicare', 'private', 'uninsured'],
      special_populations: []
    },
    languages: ['english', 'spanish'],
    last_updated: '2025-01-15T10:00:00Z',
    walk_in_accepted: true,
    description: 'Convenient HIV testing at multiple pharmacy locations with walk-in availability.'
  },
  {
    id: 'planned-parenthood-nj',
    name: 'Planned Parenthood of Northern, Central & Southern New Jersey',
    type: 'Community Health Center',
    ryan_white_parts: [],
    contact: {
      phone: '1-800-230-PLAN',
      website: 'https://www.plannedparenthood.org'
    },
    locations: [
      {
        id: 'pp-new-brunswick',
        address: '317 George Street',
        city: 'New Brunswick',
        county: 'middlesex',
        zip_code: '08901',
        coordinates: { lat: 40.4896, lng: -74.4519 },
        accessibility: ['wheelchair', 'parking', 'public_transit'],
        hours: {
          monday: { open: '09:00', close: '17:00' },
          tuesday: { open: '09:00', close: '19:00' },
          wednesday: { open: '09:00', close: '17:00' },
          thursday: { open: '09:00', close: '19:00' },
          friday: { open: '09:00', close: '17:00' },
          saturday: { open: '08:00', close: '16:00' },
          sunday: null
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: false,
        prep_services: true,
        std_testing: true,
        specialty_care: ['reproductive_health'],
        dental_care: false,
        mental_health_medical: false
      },
      support_services: {
        case_management: false,
        mental_health: false,
        substance_abuse: false,
        housing_assistance: false,
        transportation: false,
        food_nutrition: false,
        legal_services: false,
        insurance_help: true
      },
      prevention: {
        hiv_testing: true,
        counseling: true,
        prep_counseling: true,
        education: true,
        risk_reduction: true
      }
    },
    eligibility: {
      insurance_accepted: ['medicaid', 'medicare', 'private', 'uninsured'],
      special_populations: ['women', 'lgbtq', 'youth']
    },
    languages: ['english', 'spanish'],
    last_updated: '2025-01-15T10:00:00Z',
    walk_in_accepted: false,
    description: 'Comprehensive sexual and reproductive health services including HIV testing and PrEP.'
  },
  {
    id: 'woodbridge-health-dept',
    name: 'Woodbridge Township Health Department',
    type: 'Community Health Center',
    ryan_white_parts: [],
    contact: {
      phone: '(732) 855-0600',
      website: 'https://www.twp.woodbridge.nj.us'
    },
    locations: [
      {
        id: 'woodbridge-health',
        address: '1 Main Street',
        city: 'Woodbridge',
        county: 'middlesex',
        zip_code: '07095',
        coordinates: { lat: 40.5576, lng: -74.2846 },
        accessibility: ['wheelchair', 'parking'],
        hours: {
          monday: { open: '08:30', close: '16:30' },
          tuesday: { open: '08:30', close: '16:30' },
          wednesday: { open: '08:30', close: '16:30' },
          thursday: { open: '08:30', close: '16:30' },
          friday: { open: '08:30', close: '16:30' },
          saturday: null,
          sunday: null
        }
      }
    ],
    services: {
      medical_care: {
        hiv_treatment: false,
        prep_services: false,
        std_testing: true,
        specialty_care: [],
        dental_care: false,
        mental_health_medical: false
      },
      support_services: {
        case_management: false,
        mental_health: false,
        substance_abuse: false,
        housing_assistance: false,
        transportation: false,
        food_nutrition: false,
        legal_services: false,
        insurance_help: false
      },
      prevention: {
        hiv_testing: true,
        counseling: true,
        prep_counseling: false,
        education: true,
        risk_reduction: true
      }
    },
    eligibility: {
      insurance_accepted: ['medicaid', 'medicare', 'private', 'uninsured'],
      special_populations: ['residents']
    },
    languages: ['english', 'spanish'],
    last_updated: '2025-01-15T10:00:00Z',
    description: 'Local health department providing HIV testing and prevention services to township residents.'
  }
];