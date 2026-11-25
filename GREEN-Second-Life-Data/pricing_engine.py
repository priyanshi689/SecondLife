
import pandas as pd

insights = pd.read_csv("output/pricing_insights.csv")

AGE_GROUPS = [
    (0, 1, "Under 1 year"),
    (1, 2, "1-2 years"),
    (2, 3, "2-3 years"),
    (3, 5, "3-5 years"),
    (5, float("inf"), "5+ years")
]


def recommend_price(category, condition, age, original_price):

    if category not in [
        "Books", "Calculators", "Cycles",
        "Electronics", "Furniture"
    ]:
        raise ValueError("Invalid category")

    if condition not in [
        "Like New", "Good", "Fair", "Poor"
    ]:
        raise ValueError("Invalid condition")

    if age < 0 or original_price <= 0:
        raise ValueError("Invalid input")

    age_group = next(
        label for low, high, label in AGE_GROUPS
        if low <= age < high
    )

    result = insights[
        (insights["category"] == category) &
        (insights["condition"] == condition) &
        (insights["age_group"] == age_group)
    ]

    if result.empty:
        result = insights[
            (insights["category"] == category) &
            (insights["condition"] == condition)
        ]

    if result.empty:
        result = insights[
            insights["category"] == category
        ]

    if result.empty:
        raise ValueError("No pricing data available")

    retention = result["median_retention"].median()

    fair_price = round(original_price * retention / 100)

    return {
        "suggested_price": fair_price,
        "retention_percentage": round(retention, 2),
        "reason": (
            f"Estimated using {category} resale trends, "
            f"{condition} condition and {age_group} age."
        )
    }
