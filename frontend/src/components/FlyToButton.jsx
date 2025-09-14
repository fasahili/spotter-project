import { useMap } from "react-leaflet";
import "../styles/FlyToButton.css";

export default function FlyToButton({ position, zoom = 12, children }) {
  const map = useMap();

  const handleClick = () => {
    if (position) {
      map.flyTo(position, zoom, { duration: 1.5 });
    }
  };

  return (
    <button className="flyto-button" onClick={handleClick}>
      {children}
    </button>
  );
}
