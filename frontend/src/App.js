import { useState, useEffect, useRef } from "react";
import TripForm from "./components/TripForm";
import TripMap from "./components/TripMap";
import LogSheet from "./components/LogSheet";
import Footer from "./components/Footer";
import "./styles/Layout.css";
import "./App.css";

function App() {
  const [tripData, setTripData] = useState(null);
  const logSheetRef = useRef(null);

  useEffect(() => {
    if (tripData?.trip) {
      setTimeout(() => {
        logSheetRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  }, [tripData]);

  return (
    <div
      className="app-container"
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <h1 className="title">Trip Planner & Driver Log</h1>
      <div className="section">
        <TripForm onTripCreated={setTripData} />
      </div>

      {tripData?.route && (
        <div
          className="section map-section"
          style={{ display: "flex", position: "relative" }}
        >
          <div style={{ flex: 1 }}>
            <TripMap route={tripData.route} meta={tripData.meta} />
          </div>
        </div>
      )}

      {tripData?.trip && (
        <div ref={logSheetRef}>
          <LogSheet trip={tripData.trip} />
        </div>
      )}
      <Footer />
    </div>
  );
}

export default App;
