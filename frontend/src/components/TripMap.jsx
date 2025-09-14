import "../styles/TripMap.css";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import ButtonsPanel from "./ButtonsPanel";

function FitBounds({ coords }) {
  const map = useMap();
  useEffect(() => {
    if (coords.length) {
      map.fitBounds(coords);
    }
  }, [coords, map]);
  return null;
}

export default function TripMap({ route, meta }) {
  const coords =
    route?.coordinates?.map((c) => [c.lat, c.lng]) ||
    route?.features?.[0]?.geometry?.coordinates?.map((c) => [c[1], c[0]]) ||
    [];

  if (!coords || coords.length === 0) return <p>No route data available.</p>;

  const fallback = [31.95, 35.91];
  const start = coords[0];
  const fuel = coords[Math.floor(coords.length / 2)];
  const end = coords[coords.length - 1];

  const restStops = [];
  const interval = Math.floor(coords.length / 4);

  function isSamePoint(a, b) {
    return Math.abs(a[0] - b[0]) < 0.001 && Math.abs(a[1] - b[1]) < 0.001;
  }

  for (let i = interval; i < coords.length - interval; i += interval) {
    const point = coords[i];
    if (
      isSamePoint(point, start) ||
      isSamePoint(point, fuel) ||
      isSamePoint(point, end)
    )
      continue;
    restStops.push(point);
  }

  return (
    <>
      <h2 className="title-underline">Trip Map</h2>
      <MapContainer
        center={coords[0] || fallback}
        zoom={6}
        className="trip-map-container"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={coords} pathOptions={{ color: "red", weight: 5 }} />
        <Marker position={start}>
          <Tooltip permanent direction="top">🚚 Start</Tooltip>
          <Popup>
            <b>Start Location</b> <br />
            {meta?.current_location || "Current Location"}
          </Popup>
        </Marker>
        <Marker position={fuel}>
          <Tooltip permanent direction="top">⛽ Fuel</Tooltip>
          <Popup>
            <b>Pickup / Fuel Stop</b> <br />
            {meta?.pickup_location || "Pickup Location"}
          </Popup>
        </Marker>
        <Marker position={end}>
          <Tooltip permanent direction="top">🏁 End</Tooltip>
          <Popup>
            <b>Destination</b> <br />
            {meta?.dropoff_location || "Dropoff Location"}
          </Popup>
        </Marker>
        {restStops.map((pos, idx) => (
          <Marker key={idx} position={pos}>
            <Tooltip permanent direction="top">
              <b>Break 30 min</b> ⏱️
            </Tooltip>
            <Popup>
              <b>Mandatory Break</b> ⏱️ <br />
              Stop every ~8h driving
            </Popup>
          </Marker>
        ))}
        <FitBounds coords={coords} />
        <ButtonsPanel coords={coords} meta={meta} horizontal />
      </MapContainer>
    </>
  );
}
