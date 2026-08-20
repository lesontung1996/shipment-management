"use client";

import { useEffect, useMemo } from "react";
import L from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";

export type MapPoint = {
  id: string;
  lat: number;
  lng: number;
  label?: string;
};

type MapProps = {
  points: MapPoint[];
  /** Point to center the map on; defaults to the first point. */
  centerId?: string;
  /** Draw lines connecting points in array order (assignment route). */
  connect?: boolean;
};

function MapRecenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);

  return null;
}

function createPinIcon(selected: boolean) {
  const fill = selected ? "var(--primary)" : "var(--muted-foreground)";
  const size = selected ? 36 : 28;

  return L.divIcon({
    className: "shipment-map-pin",
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="var(--primary-foreground)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/><circle cx="12" cy="10" r="3"/></svg>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size + 4],
  });
}

const selectedPinIcon = createPinIcon(true);
const defaultPinIcon = createPinIcon(false);

export default function Map({ points, centerId, connect = false }: MapProps) {
  const centerPoint = useMemo(() => {
    if (points.length === 0) return null;
    return points.find((point) => point.id === centerId) ?? points[0];
  }, [points, centerId]);

  const linePositions = useMemo(
    () => points.map((point) => [point.lat, point.lng] as [number, number]),
    [points]
  );

  if (!centerPoint) return null;

  const ariaLabel =
    points.length > 1
      ? `Map showing ${points.length} shipment locations`
      : centerPoint.label
        ? `Map showing ${centerPoint.label}`
        : "Shipment location map";

  return (
    <div
      className="h-64 overflow-hidden rounded-lg border"
      role="img"
      aria-label={ariaLabel}
    >
      <MapContainer
        center={[centerPoint.lat, centerPoint.lng]}
        zoom={13}
        scrollWheelZoom={false}
        className="z-0 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapRecenter lat={centerPoint.lat} lng={centerPoint.lng} />
        {connect && linePositions.length > 1 ? (
          <Polyline
            positions={linePositions}
            pathOptions={{
              color: "var(--primary)",
              weight: 3,
              opacity: 0.7,
            }}
          />
        ) : null}
        {points.map((point) => {
          const selected = point.id === centerPoint.id;
          return (
            <Marker
              key={point.id}
              position={[point.lat, point.lng]}
              icon={selected ? selectedPinIcon : defaultPinIcon}
              zIndexOffset={selected ? 1000 : 0}
            >
              {point.label ? <Popup>{point.label}</Popup> : null}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
