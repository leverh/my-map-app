import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { saveUserData, getUserData } from '../services/databaseService';
import { getCurrentUserId } from '../services/authService';
import IconSelector from './IconSelector';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './MapComponent.module.css';


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

// MapEvents component outside MapComponent
const MapEvents = ({ onMapClick }) => {
    useMapEvents({
      click: onMapClick,
    });
    return null;
  };

const MapComponent = () => {
    const [selectedIcon, setSelectedIcon] = useState('default');
    const [markers, setMarkers] = useState([]);
    const [mapState, setMapState] = useState({ center: [51.505, -0.09], zoom: 13 });
    const userId = getCurrentUserId();
  
    const handleIconSelected = (icon) => {
      setSelectedIcon(icon);
    };
  
    const handleMapClick = (e) => {
        const comment = prompt("Enter a comment for this location:", "");
        const newMarker = {
          position: e.latlng,
          icon: selectedIcon, // Assuming icon names are saved
          comment: comment || "No comment provided"
        };
        const updatedMarkers = [...markers, newMarker];
        setMarkers(updatedMarkers);
      
        // Save markers to Firebase
        if (userId) {
          saveUserData(userId, { markers: updatedMarkers, mapState });
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
      
        // Save map state to Firebase
        if (userId) {
          saveUserData(userId, { mapState: newMapState, markers });
        }
      };

      const handleRemoveMarker = (markerIndex) => {
        const updatedMarkers = markers.filter((_, idx) => idx !== markerIndex);
        setMarkers(updatedMarkers);
      
        // Update Firebase
        if (userId) {
          saveUserData(userId, { markers: updatedMarkers, mapState });
        }
      };
      
      
  
    return (
      <div className={styles.mapContainer}>
        <IconSelector className={styles.iconSelector} onIconSelected={handleIconSelected} />
        <MapContainer
          className={styles.map}
          center={mapState.center}
          zoom={mapState.zoom}
          style={{ height: '100vh', width: '100%' }}
          whenCreated={(map) => {
            map.on('moveend', handleMapChange);
            map.on('zoomend', handleMapChange);
          }}
        >
          <MapEvents onMapClick={handleMapClick} />
          <TileLayer
            className={styles.tileLayer}
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {markers.map((marker, idx) => (
  <Marker key={idx} position={marker.position} icon={icons[marker.icon]}>
    <Popup className={styles.markerPopup}>
      {marker.comment}
      <br />
      <button className={styles.removeMarkerBtn} onClick={() => handleRemoveMarker(idx)}>Remove</button>
    </Popup>
  </Marker>
))}

        </MapContainer>
      </div>
    );
  };
  
  export default MapComponent;