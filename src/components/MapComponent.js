import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { saveUserData, getUserData } from '../services/databaseService';
import { getCurrentUserId } from '../services/authService';
import IconSelector from './IconSelector';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './MapComponent.module.css';


//  icons 
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

const MapEvents = ({ onMapClick, onMapMove, onMapZoom }) => {
  useMapEvents({
    click: onMapClick,
    moveend: onMapMove,
    zoomend: onMapZoom
  });
  return null;
};

const MapComponent = () => {
  const [selectedIcon, setSelectedIcon] = useState('default');
  const [markers, setMarkers] = useState([]);
  const [mapState, setMapState] = useState({ center: [51.505, -0.09], zoom: 13 });
  const mapRef = useRef();
  const [searchInput, setSearchInput] = useState('');
  const userId = getCurrentUserId();

  const handleIconSelected = (icon) => {
    setSelectedIcon(icon);
  };

  const handleMapClick = (e) => {
    const comment = prompt("Enter a comment for this location:", "");
    console.log("Selected icon key:", selectedIcon); // Debugging the selected icon key
    console.log("Selected icon object:", icons[selectedIcon]); // Debugging the selected icon object
  
    const newMarker = {
      position: e.latlng,
      icon: icons[selectedIcon], // Ensure this refers to a valid Leaflet icon instance
      comment: comment || "No comment provided"
    };
  
    console.log("New marker:", newMarker); // Debugging the new marker object
  
    setMarkers([...markers, newMarker]);
  
    if (userId) {
      saveUserData(userId, { markers: [...markers, newMarker], mapState });
    }
  };
  
  

  useEffect(() => {
    console.log("Map Ref:", mapRef.current);
    if (userId) {
      getUserData(userId)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            if (data.mapState) {
              setMapState(data.mapState);
            }
            if (data.markers) {
              setMarkers(data.markers);
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [userId]);

  const handleMapChange = (event) => {
    const newMapState = {
      center: event.target.getCenter(),
      zoom: event.target.getZoom(),
    };
    setMapState(newMapState);

    if (userId) {
      saveUserData(userId, { mapState: newMapState, markers });
    }
  };

  const handleSearch = () => {
    if (searchInput) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchInput)}`)
        .then(response => response.json())
        .then(data => {
          if (data.length > 0) {
            const location = data[0];
            if (mapRef.current) {
              const mapInstance = mapRef.current;
              mapInstance.flyTo([location.lat, location.lon], 13);
            } else {
              console.log('Map instance not found');
            }
          } else {
            console.log('Location not found');
          }
        })
        .catch(error => console.log('Error:', error));
    }
  };
  
  

  return (
    <div className={styles.mapContainer}>
      <IconSelector className={styles.iconSelector} onIconSelected={handleIconSelected} />
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search for a place"
        className={styles.searchInput}
      />
      <button onClick={handleSearch} className={styles.searchButton}>Search</button>
      <MapContainer
      className={styles.map}
      center={mapState.center}
      zoom={mapState.zoom}
      style={{ height: '100vh', width: '100%' }}
      ref={mapRef} // Ensure this is correctly set
      >
        <MapEvents onMapClick={handleMapClick} onMapMove={handleMapChange} onMapZoom={handleMapChange} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position} icon={icons[marker.icon]}>
            <Popup>
              {marker.comment}
              <br />
              <button onClick={() => {
                const updatedMarkers = markers.filter((_, index) => index !== idx);
                setMarkers(updatedMarkers);
                if (userId) {
                  saveUserData(userId, { markers: updatedMarkers, mapState });
                }
              }}>Remove</button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;