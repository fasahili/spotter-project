import FlyToButton from "./FlyToButton";
import "../styles/ButtonsPanel.css";

export default function ButtonsPanel({ coords, meta }) {
  if (!coords || coords.length === 0) return null;

  return (
    <div className="buttons-panel">
      <FlyToButton position={coords[0]}>
        Start {meta?.current_location ? `(${meta.current_location})` : ""}
      </FlyToButton>

      <FlyToButton position={coords[Math.floor(coords.length / 2)]}>
        Fuel {meta?.pickup_location ? `(${meta.pickup_location})` : ""}
      </FlyToButton>

      <FlyToButton position={coords[coords.length - 1]}>
        End {meta?.dropoff_location ? `(${meta.dropoff_location})` : ""}
      </FlyToButton>
    </div>
  );
}
