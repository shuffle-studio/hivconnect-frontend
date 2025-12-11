import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icons (use CDN URLs like ProviderMap)
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface EventMapProps {
  coordinates: { lat: number; lng: number };
  eventName: string;
  address: string;
}

export default function EventMap({ coordinates, eventName, address }: EventMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render on server (Leaflet requires window)
  if (!isClient) {
    return <div className="h-96 bg-gray-100 rounded-lg">Loading map...</div>;
  }

  const position: LatLngExpression = [coordinates.lat, coordinates.lng];

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
      <MapContainer center={position} zoom={14} scrollWheelZoom={true} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>
            <h3 className="font-bold">{eventName}</h3>
            <p className="text-sm">{address}</p>
            <a
              href={`https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              View on OpenStreetMap →
            </a>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
