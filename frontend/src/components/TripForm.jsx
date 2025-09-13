import { useState } from "react";
import { getRoute } from "../services/api";
import "../styles/TripForm.css";

export default function TripForm({ onTripCreated }) {
  const [current, setCurrent] = useState("");
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [cycleUsed, setCycleUsed] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await getRoute({
        current_location: current,
        pickup_location: pickup,
        dropoff_location: dropoff,
        cycle_used: cycleUsed,
      });
      onTripCreated(data);
    } catch (err) {
      console.error(err);
      alert("Error creating trip!");
    }
    setLoading(false);
  };

  return (
    <>
      <h2 className="title-underline-f">Plan Your Trip</h2>
      <form className="tripform-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Current Location:</label>
          <input
            type="text"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="e.g. Paris, France"
            required
          />
        </div>
        <div className="form-group">
          <label>Pickup Location:</label>
          <input
            type="text"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="e.g. Berlin, Germany"
            required
          />
        </div>
        <div className="form-group">
          <label>Dropoff Location:</label>
          <input
            type="text"
            value={dropoff}
            onChange={(e) => setDropoff(e.target.value)}
            placeholder="e.g. Rome, Italy"
            required
          />
        </div>
        <div className="form-group">
          <label>Cycle Used (hours):</label>
          <input
            type="number"
            value={cycleUsed}
            onChange={(e) => setCycleUsed(e.target.value)}
            min={0}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Trip"}
        </button>
      </form>
    </>
  );
}
