
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path

# ==========================================
# GREEN - SECOND LIFE
# DATA ANALYST MODULE
# ==========================================

OUTPUT = Path("output")
OUTPUT.mkdir(exist_ok=True)

np.random.seed(42)

# 1. CATEGORY CONFIGURATION

items = {
    "Books": {
        "names": ["Engineering Textbook", "DSA Book",
                  "Python Programming Book", "Novel"],
        "price": (300, 1500),
        "depreciation": 0.14
    },
    "Calculators": {
        "names": ["Scientific Calculator", "Casio Calculator"],
        "price": (800, 3000),
        "depreciation": 0.10
    },
    "Cycles": {
        "names": ["Mountain Bicycle", "Gear Bicycle",
                  "City Bicycle"],
        "price": (5000, 15000),
        "depreciation": 0.12
    },
    "Electronics": {
        "names": ["Keyboard", "Headphones", "Mouse",
                  "Computer Monitor"],
        "price": (500, 12000),
        "depreciation": 0.18
    },
    "Furniture": {
        "names": ["Study Table", "Study Chair",
                  "Bookshelf"],
        "price": (1500, 8000),
        "depreciation": 0.08
    }
}

condition_multipliers = {
    "Like New": 0.85,
    "Good": 0.70,
    "Fair": 0.52,
    "Poor": 0.32
}

conditions = list(condition_multipliers.keys())

# 2. GENERATE 200 SYNTHETIC RECORDS

records = []

for category, config in items.items():

    for i in range(40):

        item = np.random.choice(config["names"])

        age = round(np.random.uniform(0.2, 8), 1)

        condition = np.random.choice(
            conditions,
            p=[0.20, 0.40, 0.28, 0.12]
        )

        original_price = np.random.randint(
            config["price"][0],
            config["price"][1] + 1
        )

        # Condition-based and age-based depreciation
        condition_factor = condition_multipliers[condition]

        age_factor = np.exp(
            -config["depreciation"] * age
        )

        random_factor = np.random.uniform(0.92, 1.08)

        sold_price = (
            original_price
            * condition_factor
            * age_factor
            * random_factor
        )

        sold_price = round(
            np.clip(sold_price, original_price * 0.08,
                    original_price * 0.98)
        )

        retention = round(
            sold_price / original_price * 100, 2
        )

        records.append({
            "item": item,
            "category": category,
            "condition": condition,
            "age_years": age,
            "original_price": original_price,
            "sold_price": sold_price,
            "price_retention": retention
        })

df = pd.DataFrame(records)

df.to_csv(OUTPUT / "listings.csv", index=False)

print("Dataset generated:", len(df), "records")


# 3. AGE GROUPS

age_bins = [0, 1, 2, 3, 5, 100]
age_labels = [
    "Under 1 year",
    "1-2 years",
    "2-3 years",
    "3-5 years",
    "5+ years"
]

df["age_group"] = pd.cut(
    df["age_years"],
    bins=age_bins,
    labels=age_labels,
    right=False
)


# 4. PRICING INSIGHTS

pricing_insights = (
    df.groupby(
        ["category", "condition", "age_group"],
        observed=True
    )
    .agg(
        average_sold_price=("sold_price", "mean"),
        median_sold_price=("sold_price", "median"),
        average_retention=("price_retention", "mean"),
        median_retention=("price_retention", "median"),
        item_count=("item", "count")
    )
    .reset_index()
)

pricing_insights.to_csv(
    OUTPUT / "pricing_insights.csv", index=False
)


# 5. CATEGORY-WISE SUMMARY

category_summary = (
    df.groupby("category")
    .agg(
        total_items=("item", "count"),
        average_original_price=("original_price", "mean"),
        average_sold_price=("sold_price", "mean"),
        average_retention=("price_retention", "mean")
    )
    .round(2)
    .reset_index()
)

category_summary.to_csv(
    OUTPUT / "category_summary.csv", index=False
)


# 6. FAIR PRICE RECOMMENDATION ENGINE

def get_age_group(age):
    if age < 0:
        raise ValueError("Age cannot be negative.")

    for i in range(len(age_bins) - 1):
        if age_bins[i] <= age < age_bins[i + 1]:
            return age_labels[i]

    return age_labels[-1]


def recommend_fair_price(category, condition,
                         age_years, original_price):

    if category not in items:
        raise ValueError("Unknown category.")

    if condition not in condition_multipliers:
        raise ValueError("Invalid condition.")

    if age_years < 0 or original_price <= 0:
        raise ValueError("Invalid age or original price.")

    age_group = get_age_group(age_years)

    # Exact category + condition + age match
    matched = pricing_insights[
        (pricing_insights["category"] == category) &
        (pricing_insights["condition"] == condition) &
        (pricing_insights["age_group"] == age_group)
    ]

    # Fallback 1: category + condition
    if matched.empty:
        matched = pricing_insights[
            (pricing_insights["category"] == category) &
            (pricing_insights["condition"] == condition)
        ]

    # Fallback 2: category
    if matched.empty:
        matched = pricing_insights[
            pricing_insights["category"] == category
        ]

    # Fallback 3: global median
    if matched.empty:
        retention = df["price_retention"].median() / 100
    else:
        retention = (
            matched["median_retention"].median() / 100
        )

    fair_price = round(original_price * retention)

    return {
        "fair_price": fair_price,
        "retention_percentage": round(retention * 100, 2),
        "explanation": (
            f"Based on {category}, {condition} condition, "
            f"and {age_group} age group."
        )
    }


# 7. VISUALIZATIONS

# Chart 1: Average resale retention by category

plt.figure(figsize=(9, 5))

plt.bar(
    category_summary["category"],
    category_summary["average_retention"]
)

plt.title("Average Price Retention by Category")
plt.xlabel("Category")
plt.ylabel("Price Retention (%)")
plt.tight_layout()

plt.savefig(OUTPUT / "category_retention.png")
plt.close()


# Chart 2: Price retention by condition

condition_summary = (
    df.groupby("condition")["price_retention"]
    .mean()
    .reindex(conditions)
)

plt.figure(figsize=(8, 5))

plt.bar(
    condition_summary.index,
    condition_summary.values
)

plt.title("Price Retention by Item Condition")
plt.xlabel("Condition")
plt.ylabel("Average Price Retention (%)")
plt.tight_layout()

plt.savefig(OUTPUT / "condition_retention.png")
plt.close()


# Chart 3: Effect of age

plt.figure(figsize=(9, 5))

for category in items:
    subset = df[df["category"] == category]

    age_trend = subset.groupby("age_group", observed=True)[
        "price_retention"
    ].mean()

    plt.plot(
        age_trend.index.astype(str),
        age_trend.values,
        marker="o",
        label=category
    )

plt.title("Effect of Age on Price Retention")
plt.xlabel("Age Group")
plt.ylabel("Average Price Retention (%)")
plt.legend()
plt.tight_layout()

plt.savefig(OUTPUT / "age_depreciation.png")
plt.close()


# 8. SAMPLE RECOMMENDATION

result = recommend_fair_price(
    category="Calculators",
    condition="Good",
    age_years=2,
    original_price=2000
)

print("\nSample Fair Price Recommendation:")
print(result)

print("\nCategory Summary:")
print(category_summary)

print("\nAll deliverables saved in output folder!")
