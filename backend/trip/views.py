from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Trip, LogSheet
from .serializers import TripSerializer
import requests
import math
from dotenv import load_dotenv
import os

load_dotenv()
ORS_API_KEY = os.environ.get("ORS_API_KEY")
if not ORS_API_KEY:
    raise RuntimeError("ORS_API_KEY not found in environment variables")


class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer

def geocode(location):
    url = "https://api.openrouteservice.org/geocode/search"
    params = {"api_key": ORS_API_KEY, "text": location}
    res = requests.get(url, params=params, timeout=10)
    res.raise_for_status()
    features = res.json().get("features", [])
    if not features:
        raise ValueError(f"No geocode result for {location}")
    return features[0]["geometry"]["coordinates"]

def extract_summary(route_data):
    summary = route_data.get("routes", [{}])[0].get("summary")
    if summary:
        return summary.get("distance"), summary.get("duration")
    return None, None

@api_view(["POST"])
def get_route(request):
    try:
        current = request.data.get("current_location")
        pickup = request.data.get("pickup_location")
        dropoff = request.data.get("dropoff_location")
        cycle_used = float(request.data.get("cycle_used", 0) or 0)
        trip = Trip.objects.create(
            current_location=current,
            pickup_location=pickup,
            dropoff_location=dropoff,
            cycle_used=int(cycle_used),
        )

        current_coords = geocode(current)
        pickup_coords = geocode(pickup)
        dropoff_coords = geocode(dropoff)

        url = "https://api.openrouteservice.org/v2/directions/driving-car/geojson"
        body = {"coordinates": [current_coords, pickup_coords, dropoff_coords]}
        headers = {"Authorization": ORS_API_KEY, "Content-Type": "application/json"}
        r = requests.post(url, json=body, headers=headers, timeout=20)
        r.raise_for_status()
        route_data = r.json()

        distance_m, duration_s = extract_summary(route_data)
        coords = []
        try:
            coords = route_data.get("features", [])[0]["geometry"]["coordinates"]
        except Exception:
            coords = [current_coords, pickup_coords, dropoff_coords]

        if distance_m is None:
            def haversine(a, b):
                lon1, lat1 = a
                lon2, lat2 = b
                R = 6371000
                phi1 = math.radians(lat1); phi2 = math.radians(lat2)
                dphi = math.radians(lat2 - lat1); dlambda = math.radians(lon2 - lon1)
                return R * math.sqrt((dphi)**2 + (math.cos((phi1+phi2)/2)*dlambda)**2)
            distance_m = 0
            for i in range(len(coords)-1):
                distance_m += haversine(coords[i], coords[i+1])
        if duration_s is None:
            avg_speed_m_s = 22.22
            duration_s = distance_m / avg_speed_m_s

        distance_miles = distance_m / 1609.344
        fuel_stop_count = int(math.floor(distance_miles / 1000))
        stops = []
        if fuel_stop_count > 0 and len(coords) > 1:
            for i in range(1, fuel_stop_count + 1):
                idx = int(round((i * (len(coords)-1)) / (fuel_stop_count + 1)))
                stop_coord = coords[idx]
                stops.append({"type": "fuel", "position": [stop_coord[1], stop_coord[0]], "note": f"Fuel stop #{i}"})

        stops.insert(0, {"type": "start", "position":[current_coords[1], current_coords[0]], "note":"Start"})
        stops.append({"type":"pickup", "position":[pickup_coords[1], pickup_coords[0]], "note":"Pickup (1h)"})
        stops.append({"type":"dropoff", "position":[dropoff_coords[1], dropoff_coords[0]], "note":"Dropoff (1h)"})

        duration_hours = float(duration_s) / 3600.0
        driving_only = duration_hours
        on_duty_hours = 2.0
        total_hours = driving_only + on_duty_hours
        remaining_cycle_hours = max(0.0, 70.0 - float(cycle_used))
        planned_driving_hours = min(driving_only, remaining_cycle_hours)

        logs_created = []
        hours_left = planned_driving_hours
        day = 1
        MAX_DAILY_DRIVING = 11.0
        while hours_left > 0:
            drive_today = min(MAX_DAILY_DRIVING, hours_left)
            onduty_today = on_duty_hours if day == 1 else 0.0
            rest_today = max(24.0 - (drive_today + onduty_today), 0.0)
            log = LogSheet.objects.create(
                trip=trip,
                day=day,
                driving_hours=round(drive_today, 2),
                on_duty_hours=round(onduty_today, 2),
                rest_hours=round(rest_today, 2),
            )
            logs_created.append(log)
            hours_left -= drive_today
            day += 1

        if not logs_created:
            log = LogSheet.objects.create(trip=trip, day=1, driving_hours=0.0, on_duty_hours=0.0, rest_hours=24.0)
            logs_created.append(log)

        trip.refresh_from_db()
        trip_data = TripSerializer(trip).data
        meta = {
            "distance_m": distance_m,
            "distance_miles": round(distance_miles, 2),
            "duration_hours": round(duration_hours, 2),
            "planned_driving_hours": round(planned_driving_hours, 2),
            "fuel_stop_count": fuel_stop_count,
            "stops": stops
        }

        return Response({
            "trip": trip_data,
            "route": route_data,
            "meta": meta
        })

    except Exception as e:
        return Response({"error": str(e)}, status=400)
