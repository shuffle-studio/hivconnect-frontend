import React, { useState, useMemo } from 'react';
import type { Provider, SearchFilters } from '../../types/provider';
import ProviderMap from './ProviderMap';

interface Props {
  providers: Provider[];
}

const ProviderSearch: React.FC<Props> = ({ providers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    location: {},
    services: [],
    accessibility: [],
    insurance: [],
    languages: [],
    urgency: 'routine'
  });

  // Filter providers based on search and filters
  const filteredProviders = useMemo(() => {
    return providers.filter(provider => {
      // Text search
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesName = provider.name.toLowerCase().includes(searchLower);
        const matchesDescription = provider.description?.toLowerCase().includes(searchLower);
        const matchesServices = Object.values(provider.services).some(category =>
          Object.keys(category).some(service => service.toLowerCase().includes(searchLower))
        );
        if (!matchesName && !matchesDescription && !matchesServices) return false;
      }

      // County filter
      if (filters.location.county) {
        const hasCountyLocation = provider.locations.some(
          location => location.county === filters.location.county
        );
        if (!hasCountyLocation) return false;
      }

      // Service filters
      if (filters.services.length > 0) {
        const hasRequiredServices = filters.services.every(service => {
          // Check if provider offers this service
          return Object.values(provider.services).some(category =>
            Object.entries(category).some(([key, value]) =>
              key.includes(service.toLowerCase().replace(/\s+/g, '_')) && value === true
            )
          );
        });
        if (!hasRequiredServices) return false;
      }

      // Language filter
      if (filters.languages.length > 0) {
        const hasLanguage = filters.languages.some(lang => 
          provider.languages.includes(lang.toLowerCase())
        );
        if (!hasLanguage) return false;
      }

      // Insurance filter
      if (filters.insurance.length > 0) {
        const acceptsInsurance = filters.insurance.some(insurance =>
          provider.eligibility.insurance_accepted.includes(insurance.toLowerCase())
        );
        if (!acceptsInsurance) return false;
      }

      return true;
    });
  }, [providers, searchTerm, filters]);

  const handleServiceToggle = (service: string) => {
    setFilters(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const handleInsuranceToggle = (insurance: string) => {
    setFilters(prev => ({
      ...prev,
      insurance: prev.insurance.includes(insurance)
        ? prev.insurance.filter(i => i !== insurance)
        : [...prev.insurance, insurance]
    }));
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilters({
      location: {},
      services: [],
      accessibility: [],
      insurance: [],
      languages: [],
      urgency: 'routine'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Find HIV Care & Support Services</h2>
        
        {/* Search Input */}
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Search by provider name, service, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input pl-10"
            aria-label="Search providers"
          />
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* County Filter */}
          <div>
            <label htmlFor="county-filter" className="form-label">County</label>
            <select
              id="county-filter"
              value={filters.location.county || ''}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                location: { ...prev.location, county: e.target.value as any }
              }))}
              className="form-input"
              aria-label="Filter by county"
            >
              <option value="">All Counties</option>
              <option value="middlesex">Middlesex County</option>
              <option value="somerset">Somerset County</option>
              <option value="hunterdon">Hunterdon County</option>
            </select>
          </div>

          {/* Urgency Filter */}
          <div>
            <label htmlFor="urgency-filter" className="form-label">Care Needed</label>
            <select
              id="urgency-filter"
              value={filters.urgency}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                urgency: e.target.value as any
              }))}
              className="form-input"
              aria-label="Select urgency of care needed"
            >
              <option value="routine">Routine Care</option>
              <option value="urgent">Urgent (Within Week)</option>
              <option value="emergency">Emergency (Same Day)</option>
            </select>
          </div>

          {/* Service Type Checkboxes */}
          <div>
            <label className="form-label">Services Needed</label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {['HIV Testing', 'HIV Treatment', 'PrEP Services', 'Case Management', 'Mental Health'].map(service => (
                <label key={service} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.services.includes(service)}
                    onChange={() => handleServiceToggle(service)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Language Filter */}
          <div>
            <label className="form-label">Language</label>
            <div className="space-y-2">
              {['English', 'Spanish'].map(language => (
                <label key={language} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.languages.includes(language)}
                    onChange={() => handleLanguageToggle(language)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{language}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filters & Clear */}
        {(searchTerm || filters.location.county || filters.services.length > 0 || filters.languages.length > 0) && (
          <div className="mt-4 flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-800">
                  Search: "{searchTerm}"
                </span>
              )}
              {filters.location.county && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-secondary-100 text-secondary-800">
                  {filters.location.county.charAt(0).toUpperCase() + filters.location.county.slice(1)} County
                </span>
              )}
              {filters.services.map(service => (
                <span key={service} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-success-100 text-success-800">
                  {service}
                </span>
              ))}
            </div>
            <button
              onClick={clearFilters}
              className="text-sm text-gray-600 hover:text-primary-600 underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Interactive Map */}
      <div className="mt-8">
        <ProviderMap providers={providers} filteredProviders={filteredProviders} />
      </div>

      {/* Results Summary */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredProviders.length} of {providers.length} providers
        {filters.urgency === 'emergency' && (
          <div className="mt-2 p-3 bg-error-50 border border-error-200 rounded-md">
            <p className="text-error-800 font-medium">Need immediate help?</p>
            <p className="text-error-700">Call 988 for crisis support or 911 for medical emergencies</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderSearch;