/**
 * DEVELOPMENT DATA ONLY. Used when VITE_API_BASE_URL is not configured.
 * Remove once GET /products is connected.
 */
import calculator from "@/assets/p-calculator.jpg";
import books from "@/assets/p-books.jpg";
import labcoat from "@/assets/p-labcoat.jpg";
import kettle from "@/assets/p-kettle.jpg";
import racket from "@/assets/p-racket.jpg";
import stationery from "@/assets/p-stationery.jpg";
import type { Product } from "@/lib/types";

export const DEV_PRODUCTS: Product[] = [
  { id: "dev-1", name: "Casio fx-991EX ClassWiz", category: "Electronics", condition: "Like New", ageMonths: 8, sellingPrice: 850, originalPrice: 1495, images: [calculator], description: "Used for two semesters of engineering maths. All functions work, solar panel fine.", available: true, seller: { name: "Aarav M.", year: "4th year, ECE", verified: true, trustScore: 92 }, listedAt: "2026-11-24" },
  { id: "dev-2", name: "Core Mechanical Textbook Set (4)", category: "Academic Books", condition: "Good", ageMonths: 20, sellingPrice: 1200, originalPrice: 3600, images: [books], description: "Mechanics, fluids, thermo and heat transfer. Light pencil notes, important pages flagged.", defects: "Spine wear on Thermodynamics.", available: true, seller: { name: "Riya S.", year: "4th year, ME", verified: true, trustScore: 88 }, listedAt: "2026-11-23" },
  { id: "dev-3", name: "Lab Coat + Safety Goggles", category: "Lab Equipment", condition: "Good", ageMonths: 12, sellingPrice: 300, originalPrice: 650, images: [labcoat], description: "Size M lab coat, washed and ironed. Anti-fog goggles included.", available: true, seller: { name: "Kabir T.", year: "3rd year, Chem", verified: false }, listedAt: "2026-11-25" },
  { id: "dev-4", name: "1L Electric Kettle", category: "Hostel Essentials", condition: "Fair", ageMonths: 18, sellingPrice: 400, originalPrice: 1100, images: [kettle], description: "Boils in 3 minutes. Perfect for late-night maggi. Mug included.", defects: "Small scratch near base.", available: true, seller: { name: "Meera J.", year: "4th year, CSE", verified: true, trustScore: 76 }, listedAt: "2026-11-22" },
  { id: "dev-5", name: "Yonex Badminton Racket + Shuttles", category: "Sports and Lifestyle", condition: "Good", ageMonths: 14, sellingPrice: 900, originalPrice: 2200, images: [racket], description: "Restrung last month. Three feather shuttles thrown in.", available: false, seller: { name: "Dev P.", year: "4th year, IT", verified: true, trustScore: 81 }, listedAt: "2026-11-20" },
  { id: "dev-6", name: "Engineering Drawing Kit", category: "Stationery", condition: "Like New", ageMonths: 6, sellingPrice: 350, originalPrice: 780, images: [stationery], description: "Full geometry box, three pigment liners and two unused notebooks.", available: true, seller: { name: "Sana K.", year: "2nd year, Civil", verified: true, trustScore: 69 }, listedAt: "2026-11-25" },
];
