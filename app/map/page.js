"use client"

import 'leaflet/dist/leaflet.css';
// "use client"

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Define a function to calculate the distance between two points
const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * (Math.PI / 180);
    const φ2 = lat2 * (Math.PI / 180);
    const Δφ = (lat2 - lat1) * (Math.PI / 180);
    const Δλ = (lng2 - lng1) * (Math.PI / 180);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
};

// Custom hook to track user's position
const useGeolocation = (onPositionUpdate) => {
    useEffect(() => {
        const handleSuccess = (position) => {
            const { latitude, longitude } = position.coords;
            onPositionUpdate(latitude, longitude);
        };

        const handleError = (error) => {
            console.error(error);
        };

        const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0,
        });

        return () => {
            navigator.geolocation.clearWatch(watchId);
        };
    }, [onPositionUpdate]);
};

// Component to update map view and handle map click events
const MapHandler = ({ position, markers, setPosition }) => {
    const map = useMap();

    useEffect(() => {
        if (position.lat && position.lng) {
            map.setView([position.lat, position.lng], map.getZoom());
        }
    }, [position, map]);

    useMapEvents({
        click(event) {
            const { latlng } = event;
            console.log(`Clicked at ${latlng.lat}, ${latlng.lng}`);
        },
    });

    useEffect(() => {
        if (position.lat && position.lng) {
            markers.forEach((marker) => {
                const distance = calculateDistance(position.lat, position.lng, marker.lat, marker.lng);
                if (distance < 500) {
                    const audio = new Audio('/alert-sound.mp3');
                    audio.play();
                    console.log('You are within 500 meters of a marker!');
                }
            });
        }
    }, [position, markers]);

    return null;
};

// Map component definition
const MapComponent = () => {
    const [position, setPosition] = useState({ lat: null, lng: null });
    const [markers] = useState([
        { lat: 7.51976, lng: 4.52027 },
        { lat: 7.51988, lng: 4.52058 },
        { lat: 7.51853, lng: 4.52132 },
    ]);

    useGeolocation((lat, lng) => {
        setPosition({ lat, lng });
    });

    const userIcon = new L.Icon({
        iconUrl: '/marker-icon.png',
        iconSize: [60, 60],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
    });
    const potHoleIcon = new L.Icon({
        iconUrl: '/marker-icon-2x.png',
        iconSize: [60, 60],
        popupAnchor: [1, -34],
    });

    return (
        <section style={{ height: '100vh', width: '100%' }}>
            <MapContainer center={[7.51975, 4.52028]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map((marker, index) => (
                    <Marker key={index} position={[marker.lat, marker.lng]} icon={potHoleIcon}>
                        <Popup>Marker {index + 1}</Popup>
                    </Marker>
                ))}
                {position.lat && position.lng && (
                    <Marker position={[position.lat, position.lng]} icon={userIcon}>
                        <Popup>Your Position</Popup>
                    </Marker>
                )}
                <MapHandler position={position} markers={markers} setPosition={setPosition} />
            </MapContainer>
        </section>
    );
};

// Dynamic import of the Map component
const DynamicMap = dynamic(() => Promise.resolve(MapComponent), { ssr: false });

export default function MapWrapper() {
    return (
        <div style={{ height: '100vh' }}>
            <DynamicMap />
        </div>
    );
}



