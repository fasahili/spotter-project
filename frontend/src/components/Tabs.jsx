import { useState } from "react";
import TripMap from "./TripMap";
import LogSheet from "./LogSheet";
import TripDetails from "./TripDetails";
import "../styles/Tabs.css";

function Tabs({ tripData }) {
  const [activeTab, setActiveTab] = useState("map");

  return (
    <div className="section">
      <div className="tabs-header">
        <button
          className={`tab-btn ${activeTab === "map" ? "active" : ""}`}
          onClick={() => setActiveTab("map")}
        >
          Map
        </button>
        <button
          className={`tab-btn ${activeTab === "log" ? "active" : ""}`}
          onClick={() => setActiveTab("log")}
        >
          Log
        </button>
        <button
          className={`tab-btn ${activeTab === "details" ? "active" : ""}`}
          onClick={() => setActiveTab("details")}
        >
          Details
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "map" && tripData?.route && (
          <TripMap route={tripData.route} meta={tripData.meta} />
        )}
        {activeTab === "log" && tripData?.trip && (
          <LogSheet trip={tripData.trip} />
        )}
        {activeTab === "details" && tripData?.meta && (
          <TripDetails meta={tripData.meta} />
        )}
      </div>
    </div>
  );
}

export default Tabs;
