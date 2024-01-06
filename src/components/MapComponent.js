import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet'; // Import Marker
import { saveUserData, getUserData } from '../services/databaseService';
import { getCurrentUserId } from '../services/authService';
import IconSelector from './IconSelector';
import L from 'leaflet';

// Define your icons here
const icons = {
  default: L.icon({ iconUrl: '/icons/default.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
  food: L.icon({ iconUrl: '/icons/food.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
  cinema: L.icon({ iconUrl: '/icons/cinema.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
  education: L.icon({ iconUrl: '/icons/education.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
  cafe: L.icon({ iconUrl: '/icons/cafe.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
  hotel: L.icon({ iconUrl: '/icons/hotel.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
  park: L.icon({ iconUrl: '/icons/park.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
  museum: L.icon({ iconUrl: '/icons/museum.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
  religion: L.icon({ iconUrl: '/icons/religion.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
  shopping: L.icon({ iconUrl: '/icons/shopping.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
  sport: L.icon({ iconUrl: '/icons/sport.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
  transport: L.icon({ iconUrl: '/icons/transport.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
  health: L.icon({ iconUrl: '/icons/health.svg', iconSize: [30, 30], iconAnchor: [15, 30] }),
};

const MapComponent = () => {
  const [selectedIcon, setSelectedIcon] = useState('default');
  const [markers, setMarkers] = useState([]); // New state for markers
  const [mapState, setMapState] = useState({ center: [51.505, -0.09], zoom: 13 });
  const userId = getCurrentUserId();

  const handleIconSelected = (icon) => {
    setSelectedIcon(icon);
  };

  const handleMapClick = (e) => {
    // Add a new marker to the state when the map is clicked
    setMarkers([...markers, { position: e.latlng, icon: icons[selectedIcon] }]);
  };

  // Load map state from Firebase when component mounts
  useEffect(() => {
    if (userId) {
      getUserData(userId)
        .then((snapshot) => {
          if (snapshot.exists()) {
            setMapState(snapshot.val().mapState);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userId]);

  // Function to handle map state changes
  const handleMapChange = (event) => {
    const newMapState = {
      center: event.target.getCenter(),
      zoom: event.target.getZoom(),
    };
    setMapState(newMapState);

    // Save new map state to Firebase
    if (userId) {
      saveUserData(userId, { mapState: newMapState });
    }
  };

  return (
    <div>
      <IconSelector onIconSelected={handleIconSelected} />
      <MapContainer
        center={mapState.center}
        zoom={mapState.zoom}
        style={{ height: '100vh', width: '100%' }}
        whenCreated={(map) => {
          map.on('moveend', handleMapChange);
          map.on('zoomend', handleMapChange);
          map.on('click', handleMapClick); // Add click event handler
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position} icon={marker.icon} />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;