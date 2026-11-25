# Second Life — Frontend integration notes (Creative UI role)

Set `VITE_API_BASE_URL` to switch from sample data to the real backend. All calls live in `src/services/`.

Connected to contract: `GET /products`, `POST /products` (multipart: name, category, condition, ageMonths, originalPrice, sellingPrice, description, defects, images[]), `POST /chat/message` ({ message } -> { reply }, to confirm).

Placeholders the backend team must provide:
- Fair-price recommendation API (`pricingService.ts` returns an illustrative response until then).
- Product detail API (currently filters the list).
- Product image upload API (if separate from POST /products).
- Auth token format (attach in `api.ts` interceptor).

Note: routing uses TanStack Router (platform requirement) instead of React Router DOM; pages map 1:1.
