import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ⚠️ YOUR CONFIG (เปลี่ยนเป็น true ถ้าจะใช้ Google Maps)
const USE_GOOGLE_MAPS = false;
const GOOGLE_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY_HERE";

// --- Config for Leaflet Custom Icon ---
// Fix Leaflet's default icon missing issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});


// --- 1. FREE MAP COMPONENT (OpenStreetMap) ---
function LeafletMapComponent({ center, zoom }) {
    function FlyToLocation() {
        const map = useMap();
        useEffect(() => {
            map.flyTo(center, zoom);
        }, [center, zoom, map]);
        return null;
    }

    return (
        <MapContainer
            center={center}
            zoom={zoom}
            style={{ width: "100%", height: "300px", borderRadius: "24px", zIndex: 0 }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={center}>
                <Popup>Your Package is here!</Popup>
            </Marker>
            <FlyToLocation />
        </MapContainer>
    );
}

// --- 2. GOOGLE MAP COMPONENT (Premium) ---
const renderGoogle = (status) => {
    if (status === Status.LOADING) return <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>Loading Map...</div>;
    return <div className="glass-panel" style={{ padding: '20px', textAlign: 'center', color: '#ef4444' }}>Error Loading Google Map</div>;
};

function GoogleMapComponent({ center, zoom }) {
    const ref = useRef(null);
    useEffect(() => {
        if (ref.current) {
            new window.google.maps.Map(ref.current, {
                center, zoom, disableDefaultUI: true,
                styles: [
                    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
                    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
                ],
            });
            new window.google.maps.Marker({ position: center, map: new window.google.maps.Map(ref.current), title: "Package" });
        }
    }, [center, zoom]);
    return <div ref={ref} style={{ width: "100%", height: "300px", borderRadius: "24px" }} />;
}

// --- 3. MAIN EXPORT ---
export default function LiveMap({ center = { lat: 13.7563, lng: 100.5018 }, zoom = 12 }) {
    // Falls back to Leaflet if API Key is placeholder or USE_GOOGLE_MAPS is false
    const shouldUseGoogle = USE_GOOGLE_MAPS && GOOGLE_API_KEY.length > 30;

    if (shouldUseGoogle) {
        return (
            <Wrapper apiKey={GOOGLE_API_KEY} render={renderGoogle}>
                <GoogleMapComponent center={center} zoom={zoom} />
            </Wrapper>
        );
    }

    return <LeafletMapComponent center={center} zoom={zoom} />;
}
