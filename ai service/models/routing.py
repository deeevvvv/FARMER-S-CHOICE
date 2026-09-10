"""
TULIP — delivery route optimization.

Solves a small-scale "collect from multiple farms, deliver to one buyer" routing
problem with a nearest-neighbor heuristic over great-circle (haversine) distance.
This is intentionally lightweight (no external routing API needed) so the demo
works fully offline; swap in OSRM / Google Directions for real road distances later.
"""
import math

AVG_SPEED_KMH = 35          # average rural/urban mixed speed for a pickup van
COST_PER_KM = 18            # ₹ per km, fuel + driver, illustrative
BASE_HANDLING_COST = 150    # ₹ flat cost for loading/unloading


def haversine_km(lat1, lon1, lat2, lon2):
    R = 6371.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


def optimize_route(stops: list[dict], buyer: dict) -> dict:
    """
    stops: [{label, latitude, longitude, type}, ...]  (farms / collection centers)
    buyer: {label, latitude, longitude}
    Returns ordered route, total distance, ETA, and estimated cost.
    """
    remaining = list(stops)
    route = []
    current = buyer  # start collection loop conceptually from a depot; we begin at first nearest farm instead
    # Start from the farm nearest to the buyer's overall cluster centroid for a sensible loop
    if remaining:
        centroid_lat = sum(s["latitude"] for s in remaining) / len(remaining)
        centroid_lon = sum(s["longitude"] for s in remaining) / len(remaining)
        remaining.sort(key=lambda s: haversine_km(centroid_lat, centroid_lon, s["latitude"], s["longitude"]))
        current = remaining.pop(0)
        route.append(current)

    # Nearest-neighbor through the rest of the stops
    while remaining:
        nxt = min(remaining, key=lambda s: haversine_km(current["latitude"], current["longitude"], s["latitude"], s["longitude"]))
        route.append(nxt)
        remaining.remove(nxt)
        current = nxt

    # Finally, go to the buyer
    full_path = route + [{"label": buyer["label"], "latitude": buyer["latitude"], "longitude": buyer["longitude"], "type": "buyer"}]

    total_distance = 0.0
    for i in range(len(full_path) - 1):
        a, b = full_path[i], full_path[i + 1]
        total_distance += haversine_km(a["latitude"], a["longitude"], b["latitude"], b["longitude"])

    # Add ~15% to straight-line distance to approximate real road distance
    total_distance *= 1.15
    total_minutes = (total_distance / AVG_SPEED_KMH) * 60
    estimated_cost = BASE_HANDLING_COST * len(full_path) + total_distance * COST_PER_KM

    return {
        "route": [{"label": s["label"], "latitude": s["latitude"], "longitude": s["longitude"], "type": s.get("type", "stop")} for s in full_path],
        "total_distance_km": round(total_distance, 2),
        "estimated_minutes": round(total_minutes),
        "number_of_stops": len(full_path),
        "estimated_cost_inr": round(estimated_cost, 2),
    }