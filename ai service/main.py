"""
TULIP — Technology for Unified Logistics & Intelligent Prediction
FastAPI micro-service powering demand forecasting and route optimization
for Farmer's Choice.
"""
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), ".."))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models.forecasting import generate_forecasts, forecast_for_product
from models.routing import optimize_route

app = FastAPI(
    title="TULIP AI Service",
    description="Technology for Unified Logistics & Intelligent Prediction — the AI engine behind Farmer's Choice.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


class Stop(BaseModel):
    label: str
    latitude: float
    longitude: float
    type: str | None = "farm"


class Buyer(BaseModel):
    label: str
    latitude: float
    longitude: float


class RouteRequest(BaseModel):
    stops: list[Stop]
    buyer: Buyer


@app.get("/")
def root():
    return {"service": "TULIP AI", "status": "online", "endpoints": ["/forecast/demand", "/forecast/demand/{product}", "/optimize-route"]}


@app.get("/forecast/demand")
def get_all_forecasts():
    """Return demand forecasts for every tracked crop."""
    return generate_forecasts()


@app.post("/forecast/demand")
def refresh_forecasts():
    """Re-run the forecasting model (used by the backend's /api/forecasts/refresh)."""
    return generate_forecasts()


@app.get("/forecast/demand/{product}")
def get_product_forecast(product: str):
    result = forecast_for_product(product)
    if not result:
        raise HTTPException(status_code=404, detail=f"No historical data for '{product}'")
    return result


@app.post("/optimize-route")
def route_optimization(payload: RouteRequest):
    """
    Compute an efficient multi-stop pickup route ending at the buyer, e.g.
    Farm A -> Farm C -> Farm B -> Collection Center -> Buyer
    """
    if not payload.stops:
        raise HTTPException(status_code=400, detail="At least one stop is required")
    stops = [s.model_dump() for s in payload.stops]
    buyer = payload.buyer.model_dump()
    return optimize_route(stops, buyer)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)