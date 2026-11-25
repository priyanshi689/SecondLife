/** Frontend data contracts. Align field names with backend responses during integration. */
export type Category =
  | "Stationery" | "Academic Books" | "Electronics"
  | "Hostel Essentials" | "Lab Equipment" | "Sports and Lifestyle";

export const CATEGORIES: Category[] = [
  "Stationery", "Academic Books", "Electronics",
  "Hostel Essentials", "Lab Equipment", "Sports and Lifestyle",
];

export type Condition = "Like New" | "Good" | "Fair" | "Well Used";
export const CONDITIONS: Condition[] = ["Like New", "Good", "Fair", "Well Used"];

export interface Seller {
  name: string;
  year: string;
  verified: boolean;
  trustScore?: number; // undefined = New Member
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  condition: Condition;
  ageMonths: number;
  sellingPrice: number;
  originalPrice: number;
  images: string[];
  description: string;
  defects?: string;
  available: boolean;
  seller: Seller;
  listedAt: string;
}

export interface PriceSuggestionRequest {
  category: Category;
  condition: Condition;
  ageMonths: number;
  originalPrice: number;
}

export interface PriceSuggestion {
  suggestedPrice: number;
  range?: { min: number; max: number };
  explanation?: string;
  factors?: string[];
  /** true when the response is NOT from the backend pricing engine */
  illustrative: boolean;
}
