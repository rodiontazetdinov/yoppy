"use client"

import { useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

interface RouteMapProps {
  route: google.maps.LatLng[];
  className?: string;
}

export function RouteMap({ route, className = '' }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const polylineRef = useRef<google.maps.Polyline | null>(null);

  useEffect(() => {
    if (!mapRef.current || route.length === 0) return;

    // Инициализация карты
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        zoom: 15,
        center: route[0],
        disableDefaultUI: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });
    }

    // Создание или обновление линии маршрута
    if (!polylineRef.current) {
      polylineRef.current = new google.maps.Polyline({
        path: route,
        strokeColor: '#3B82F6',
        strokeOpacity: 0.8,
        strokeWeight: 4,
        map: mapInstanceRef.current
      });
    } else {
      polylineRef.current.setPath(route);
    }

    // Центрирование карты на последней точке маршрута
    mapInstanceRef.current.setCenter(route[route.length - 1]);

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [route]);

  return (
    <Card className={className}>
      <div 
        ref={mapRef} 
        className="w-full h-64 rounded-lg overflow-hidden"
      />
    </Card>
  );
} 