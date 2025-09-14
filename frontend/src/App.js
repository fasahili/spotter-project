import { useState, useRef, useEffect } from "react";
import TripForm from "./components/TripForm";
import Footer from "./components/Footer";
import Tabs from "./components/Tabs";
import "./styles/Layout.css";
import "./App.css";

function App() {
  const [tripData, setTripData] = useState(null);
  const tabsRef = useRef(null);

  useEffect(() => {
    if (tripData) {
      setTimeout(() => {
        tabsRef.current?.scrollIntoView({ behavior: "smooth" });
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

      {tripData && (
        <div ref={tabsRef}>
          <Tabs tripData={tripData} />
        </div>
      )}

      <Footer />
    </div>
  );
}

export default App;
