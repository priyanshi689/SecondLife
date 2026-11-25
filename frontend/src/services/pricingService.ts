import type { PriceSuggestion, PriceSuggestionRequest } from "@/lib/types";

/**
 * INTEGRATION PLACEHOLDER — Fair-price recommendation API.
 * The endpoint is not in the API contract yet. The backend team must provide it;
 * the Python pricing engine is the source of truth. Replace `requestSuggestedPrice`
 * body with the real call. Until then an ILLUSTRATIVE response is returned.
 */
export async function requestSuggestedPrice(req: PriceSuggestionRequest): Promise<PriceSuggestion> {
  await new Promise((r) => setTimeout(r, 500));
  return illustrativeResponse(req);
}

/** Development-only placeholder so the UI can be designed. Not a pricing model. */
function illustrativeResponse(req: PriceSuggestionRequest): PriceSuggestion {
  const share = { "Like New": 0.6, Good: 0.45, Fair: 0.32, "Well Used": 0.2 }[req.condition];
  const mid = Math.round((req.originalPrice * share) / 10) * 10;
  return {
    suggestedPrice: mid,
    range: { min: Math.round(mid * 0.85), max: Math.round(mid * 1.15) },
    explanation: "Illustrative example only. The real suggestion will come from the Second Life pricing engine.",
    factors: [`Condition: ${req.condition}`, `Age: ${req.ageMonths} months`, `Category: ${req.category}`],
    illustrative: true,
  };
}
