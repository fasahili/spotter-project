import "../styles/TripDetails.css";

export default function TripDetails() {
  return (
    <div className="tripdetails-container">
      <h2 className="title-underline">Trip Overview</h2>

      <p className="highlight">
        Plan your trip efficiently and track your driving logs with ease.
      </p>

      <div className="cards-container">
        <div className="card">
          <h3>Map</h3>
          <p>
            Visualize your route, stops, and estimated breaks on an interactive
            map.
          </p>
        </div>
        <div className="card">
          <h3>Log</h3>
          <p>
            Daily log sheets show driving, on-duty, and rest hours for each day.
          </p>
        </div>
        <div className="card">
          <h3>Details</h3>
          <p>Quick summary of your trip and key assumptions for planning.</p>
        </div>
      </div>

      <p className="note">
        Assumptions: 70hrs over 8 days, fueling every 1,000 miles, 1 hour
        pickup/drop-off, property-carrying driver.
      </p>
    </div>
  );
}
