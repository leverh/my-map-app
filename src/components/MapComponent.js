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
  default: L.icon({ iconUrl: '/icons/default.svg', iconSize: [50, 50], iconAnchor: [25, 50] }),
  food: L.icon({ iconUrl: '/icons/food.svg', iconSize: [50, 50], iconAnchor: [25, 50] }),
  cinema: L.icon({ iconUrl: '/icons/cinema.svg', iconSize: [50, 50], iconAnchor: [25, 50] }),
  education: L.icon({ iconUrl: '/icons/education.svg', iconSize: [50, 50], iconAnchor: [25, 50] }),
  cafe: L.icon({ iconUrl: '/icons/cafe.svg', iconSize: [50, 50], iconAnchor: [25, 50] }),
  hotel: L.icon({ iconUrl: '/icons/hotel.svg', iconSize: [50, 50], iconAnchor: [25, 50] }),
  park: L.icon({ iconUrl: '/icons/park.svg', iconSize: [50, 50], iconAnchor: [25, 50] }),
  museum: L.icon({ iconUrl: '/icons/museum.svg', iconSize: [50, 50], iconAnchor: [25, 50] }),
  religion: L.icon({ iconUrl: '/icons/religion.svg', iconSize: [50, 50], iconAnchor: [25, 50] }),
  shopping: L.icon({ iconUrl: '/icons/shopping.svg', iconSize: [50, 50], iconAnchor: [25, 50] }),
  sport: L.icon({ iconUrl: '/icons/sport.svg', iconSize: [50, 50], iconAnchor: [25, 50] }),
  transport: L.icon({ iconUrl: '/icons/transport.svg', iconSize: [50, 50], iconAnchor: [25, 50] }),
  health: L.icon({ iconUrl: '/icons/health.svg', iconSize: [50, 50], iconAnchor: [25, 50] }),
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
    const newMarker = {
      position: e.latlng,
      iconKey: selectedIcon, // Save the key of the selected icon
      comment: comment || "No comment provided"
    };
    setMarkers([...markers, newMarker]);
  
    if (userId) {
      saveUserData(userId, { markers: [...markers, newMarker], mapState });
    }
  };

  useEffect(() => {
    if (userId) {
      getUserData(userId).then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.mapState) {
            setMapState(data.mapState);
          }
          if (data.markers) {
            setMarkers(data.markers);
          }
        }
      }).catch((error) => {
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

  const MapEvents = ({ onMapClick, onMapMove, onMapZoom }) => {
    useMapEvents({
      click: onMapClick,
      moveend: onMapMove,
      zoomend: onMapZoom
    });
    return null;
  };

  const handleRemoveMarker = (markerIndex) => {
    const updatedMarkers = markers.filter((_, index) => index !== markerIndex);
    setMarkers(updatedMarkers);

    // Update Firebase
    if (userId) {
      saveUserData(userId, { markers: updatedMarkers, mapState });
    }
  };

  return (
    <div className={styles.mapContainer}>
      <div className={styles.selectorContainer}>
      <h2 className={styles.header}>My Map</h2>
      <div className={styles.selectors}>
      <IconSelector className={styles.iconSelector} onIconSelected={handleIconSelected} />
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        placeholder="Search for a location"
        className={styles.searchInput}
      />
      <button onClick={handleSearch} className={styles.searchButton}>Search</button>
      </div>
      </div>
      <MapContainer
        className={styles.map}
        center={mapState.center}
        zoom={mapState.zoom}
        style={{ height: '100vh', width: '100%' }}
        ref={mapRef}
      >
        <MapEvents 
    onMapClick={handleMapClick} 
    onMapMove={handleMapChange} 
    onMapZoom={handleMapChange} 
  />
        <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  />
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.position} icon={icons[marker.iconKey]}>
            <Popup className={styles.popup}>
            <div className={styles.popupText}>{marker.comment}</div>
              <br />
              <button className={styles.removeButton} onClick={(e) => {
                e.stopPropagation(); // Prevent triggering map click
                handleRemoveMarker(idx);
              }}>Remove</button>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapComponent;