import { Link } from "@tanstack/react-router";
import { Heart, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";

export const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;
export const savingsPct = (p: Product) => Math.round((1 - p.sellingPrice / p.originalPrice) * 100);

export function TrustBadge({ seller }: { seller: Product["seller"] }) {
  if (seller.trustScore === undefined)
    return <span className="rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-secondary-foreground">New Member</span>;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-[11px] font-medium text-forest">
      <ShieldCheck className="size-3" /> {seller.trustScore}
    </span>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const [fav, setFav] = useState(false);
  const pct = savingsPct(product);
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link to="/product/$id" params={{ id: product.id }} className="relative block aspect-[4/3.4] overflow-hidden bg-muted">
        <img src={product.images[0]} alt={product.name} loading="lazy" width={816} height={816}
          className={`size-full object-cover transition-transform duration-500 group-hover:scale-105 ${product.available ? "" : "grayscale"}`} />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-gold px-2.5 py-1 text-xs font-semibold text-gold-foreground">
          <Sparkles className="size-3" /> Save {pct}%
        </span>
        {!product.available && (
          <span className="absolute inset-x-3 bottom-3 rounded-lg bg-deep/90 py-1.5 text-center text-xs font-medium text-deep-foreground">Already claimed</span>
        )}
      </Link>
      <button aria-label="Favourite" onClick={() => setFav(!fav)}
        className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-card/90 shadow-card">
        <Heart className={`size-4 ${fav ? "fill-destructive text-destructive" : "text-foreground"}`} />
      </button>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          <span>{product.category}</span><span className="size-1 rounded-full bg-gold" /><span>{product.condition}</span>
        </div>
        <Link to="/product/$id" params={{ id: product.id }} className="mt-1.5 line-clamp-2 font-display font-semibold leading-snug hover:text-primary">
          {product.name}
        </Link>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-2xl font-bold text-primary">{inr(product.sellingPrice)}</span>
          <span className="text-sm text-muted-foreground line-through">{inr(product.originalPrice)}</span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-dashed pt-3">
          <div className="text-xs">
            <p className="font-medium">{product.seller.name}</p>
            <p className="text-muted-foreground">{product.seller.year}</p>
          </div>
          <TrustBadge seller={product.seller} />
        </div>
      </div>
    </article>
  );
}
