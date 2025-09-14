import "../styles/LogSheet.css";

export default function LogSheet({ trip }) {
  if (!trip || !trip.logs || trip.logs.length === 0) return <p>No logs yet</p>;

  return (
    <div className="logsheet-container">
      <h2 className="title-underline">Driver Log Sheet</h2>
      <table className="logsheet-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Driving Hours</th>
            <th>On Duty Hours</th>
            <th>Rest Hours</th>
            <th>Hourly Grid</th>
          </tr>
        </thead>
        <tbody>
          {trip.logs.map((log, index) => {
            const totalCells = 24 * 2;
            const drivingCells = Math.round(log.driving_hours * 2);
            const ondutyCells = Math.round(log.on_duty_hours * 2);

            return (
              <tr
                key={log.id}
                className={index % 2 === 0 ? "even-row" : "odd-row"}
              >
                <td>{log.day}</td>
                <td>{log.driving_hours}</td>
                <td>{log.on_duty_hours}</td>
                <td>{log.rest_hours}</td>
                <td>
                  <div className="log-grid">
                    {[...Array(totalCells)].map((_, hour) => {
                      let status = "rest";
                      if (hour < drivingCells) status = "driving";
                      else if (hour < drivingCells + ondutyCells)
                        status = "onduty";
                      return (
                        <div key={hour} className={`cell ${status}`}></div>
                      );
                    })}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="legend">
        <div className="legend-item">
          <div className="cell driving circle"></div>
          <span>Driving</span>
        </div>
        <div className="legend-item">
          <div className="cell onduty circle"></div>
          <span>On Duty</span>
        </div>
        <div className="legend-item">
          <div className="cell rest circle"></div>
          <span>Rest</span>
        </div>
      </div>
    </div>
  );
}
