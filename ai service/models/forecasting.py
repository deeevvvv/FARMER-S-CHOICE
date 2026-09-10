"""
TULIP — demand forecasting model.

Uses a simple, explainable linear-regression-per-product approach:
each crop's weekly demand history is fit with scikit-learn's LinearRegression,
then the model extrapolates one week ahead. This keeps the hackathon MVP fast,
transparent, and easy to swap for a fancier model (Prophet / ARIMA / XGBoost) later.
"""
import os
from datetime import date, timedelta

import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression

DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "historical_sales.csv")


def _demand_level(pct_change: float) -> str:
    if pct_change >= 15:
        return "HIGH"
    if pct_change <= -15:
        return "LOW"
    return "MEDIUM"


def _recommendation(product: str, pct_change: float, level: str) -> str:
    if level == "HIGH":
        return f"Demand is expected to rise. Consider increasing {product.lower()} supply for the upcoming week."
    if level == "LOW":
        return f"Demand is expected to fall. Consider reducing new {product.lower()} planting or seeking bulk-buyer contracts."
    return f"Demand for {product.lower()} is roughly stable. Maintain current supply levels."


def generate_forecasts() -> list[dict]:
    """Fit a per-product linear trend on historical weekly demand and predict week 11."""
    df = pd.read_csv(DATA_PATH)
    next_week_date = date.today() + timedelta(days=7)

    results = []
    for product, group in df.groupby("product"):
        group = group.sort_values("week")
        X = group[["week"]].to_numpy()
        y = group["demand_kg"].to_numpy()

        model = LinearRegression()
        model.fit(X, y)

        current_demand = float(y[-1])
        next_week = int(X[-1][0]) + 1
        predicted_demand = float(model.predict([[next_week]])[0])
        predicted_demand = max(predicted_demand, 0)

        pct_change = ((predicted_demand - current_demand) / current_demand) * 100 if current_demand else 0
        level = _demand_level(pct_change)

        results.append({
            "product_name": product,
            "current_demand_kg": round(current_demand, 1),
            "predicted_demand_kg": round(predicted_demand, 1),
            "pct_change": round(pct_change, 1),
            "demand_level": level,
            "recommendation": _recommendation(product, pct_change, level),
            "forecast_week": next_week_date.isoformat(),
        })

    # Sort so the biggest movers (up or down) surface first
    results.sort(key=lambda r: abs(r["pct_change"]), reverse=True)
    return results


def forecast_for_product(product_name: str) -> dict | None:
    forecasts = generate_forecasts()
    for f in forecasts:
        if f["product_name"].lower() == product_name.lower():
            return f
    return None