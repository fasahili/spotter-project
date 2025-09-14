import axios from "axios";

const API = axios.create({ baseURL: "https://spotter-project-vzau.onrender.com/api/" });

export const createTrip = (data) => API.post("/trips/", data);
export const getTrips = () => API.get("/trips/");
export const getRoute = (data) => API.post("/route/", data);
