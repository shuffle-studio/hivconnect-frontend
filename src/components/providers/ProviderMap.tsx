import React, { useEffect, useState } from 'react';
import type { Provider } from '../../types/provider';

interface Props {
  providers: Provider[];
  filteredProviders: Provider[];
}

const ProviderMap: React.FC<Props> = ({ providers, filteredProviders }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapComponents, setMapComponents] = useState<any>(null);

  useEffect(() => {
    const loadMapComponents = async () => {
      if (typeof window !== 'undefined' && !isLoaded) {
        try {
          // Import Leaflet and React Leaflet dynamically
          const [leafletModule, reactLeafletModule] = await Promise.all([
            import('leaflet'),
            import('react-leaflet'),
            import('leaflet/dist/leaflet.css')
          ]);

          const L = leafletModule.default;

          // Fix for default markers in React Leaflet
          delete (L.Icon.Default.prototype as any)._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
          });

          // Create custom marker icons for different service types
          const createCustomIcon = (color: string) => {
            return L.divIcon({
              className: 'custom-marker',
              html: `
                <div style="
                  background-color: ${color};
                  width: 20px;
                  height: 20px;
                  border-radius: 50%;
                  border: 3px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                "></div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            });
          };

          // Determine service type and marker color
          const getMarkerColor = (provider: Provider) => {
            if (provider.services.medical_care.hiv_treatment) return '#dc2626'; // Red for treatment
            if (provider.services.medical_care.hiv_testing) return '#2563eb'; // Blue for testing
            if (provider.services.support_services.case_management) return '#16a34a'; // Green for support
            return '#6b7280'; // Gray for general services
          };

          setMapComponents({
            MapContainer: reactLeafletModule.MapContainer,
            TileLayer: reactLeafletModule.TileLayer,
            Marker: reactLeafletModule.Marker,
            Popup: reactLeafletModule.Popup,
            createCustomIcon,
            getMarkerColor,
            L
          });
          setIsLoaded(true);
        } catch (error) {
          console.error('Error loading map components:', error);
        }
      }
    };

    loadMapComponents();
  }, [isLoaded]);

  if (!isLoaded || !mapComponents) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Provider Locations</h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span className="text-gray-700">HIV Treatment</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-gray-700">HIV Testing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span className="text-gray-700">Support Services</span>
            </div>
          </div>
        </div>
        <div className="w-full h-96 min-h-[400px] flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading interactive map...</p>
          </div>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, createCustomIcon, getMarkerColor } = mapComponents;

  // Calculate map bounds based on filtered providers
  const locations = filteredProviders.flatMap(provider => 
    provider.locations.map(location => [location.coordinates.lat, location.coordinates.lng])
  );

  const defaultCenter = [40.4637, -74.5409]; // Central NJ
  const defaultZoom = 10;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Provider Locations</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-600"></div>
            <span className="text-gray-700">HIV Treatment</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-600"></div>
            <span className="text-gray-700">HIV Testing</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-600"></div>
            <span className="text-gray-700">Support Services</span>
          </div>
        </div>
      </div>
      
      <div className="w-full h-96 min-h-[400px]">
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%' }}
          className="leaflet-container"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {filteredProviders.map(provider => 
            provider.locations.map((location, locationIndex) => (
              <Marker
                key={`${provider.id}-${locationIndex}`}
                position={[location.coordinates.lat, location.coordinates.lng]}
                icon={createCustomIcon(getMarkerColor(provider))}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h4 className="font-semibold text-gray-900 mb-2">{provider.name}</h4>
                    <div className="text-sm text-gray-600 space-y-1 mb-3">
                      <p><strong>Address:</strong> {location.address}, {location.city}</p>
                      <p><strong>Phone:</strong> {provider.contact.phone}</p>
                      <p><strong>Hours:</strong> Call for hours</p>
                    </div>
                    
                    {/* Services offered */}
                    <div className="text-sm mb-3">
                      <p className="font-medium text-gray-900 mb-1">Services:</p>
                      <div className="flex flex-wrap gap-1">
                        {provider.services.medical_care.hiv_treatment && (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">HIV Treatment</span>
                        )}
                        {provider.services.medical_care.hiv_testing && (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">HIV Testing</span>
                        )}
                        {provider.services.medical_care.prep_services && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">PrEP</span>
                        )}
                        {provider.services.support_services.case_management && (
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Case Management</span>
                        )}
                      </div>
                    </div>
                    
                    <a 
                      href={`/providers/${provider.id}`}
                      className="inline-block bg-primary-600 text-white px-3 py-1 rounded text-xs hover:bg-primary-700 transition-colors"
                    >
                      View Details
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))
          )}
        </MapContainer>
      </div>
    </div>
  );
};

export default ProviderMap;