// src/app/page.tsx
"use client";

import { useState } from "react";
import { getRestaurants } from "@/actions/yelp";
import { Restaurant } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Navigation, Search, AlertCircle } from "lucide-react";
import { RestaurantSkeleton } from "@/components/SkeletonRestaurant";

export default function Home() {
  const [city, setCity] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError("");
    setHasSearched(true);
    setRestaurants([]);

    const response = await getRestaurants(city);

    if (response.error) {
      setError(response.error.description);
    } else if (response.businesses?.length === 0) {
      setError(`No restaurants found within 5 miles of "${city}".`);
    } else {
      setRestaurants(response.businesses || []);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-zinc-50 to-white font-sans selection:bg-primary selection:text-primary-foreground">
      <div className="max-w-5xl mx-auto px-6 py-16 md:py-24 space-y-12">
        {/* Header & Search Section */}
        <div className="space-y-8 text-center max-w-2xl mx-auto">
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2 text-primary">
              <Star className="w-8 h-8 fill-current" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900">
              Starfruit Express
            </h1>
            <p className="text-lg text-zinc-500">
              Discover top-rated restaurants within 5 miles of your city.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="relative flex items-center w-full shadow-sm rounded-full bg-white border border-zinc-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all overflow-hidden p-1"
          >
            <Search className="w-5 h-5 text-zinc-400 ml-4 shrink-0" />
            <Input
              placeholder="Enter your city (e.g., Austin, TX)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={loading}
              className="border-0 focus-visible:ring-0 shadow-none text-base h-12 bg-transparent w-full"
            />
            <Button
              type="submit"
              disabled={loading || !city.trim()}
              className="rounded-full px-8 h-12 shrink-0 transition-all"
            >
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>
        </div>

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 border border-red-100 rounded-2xl text-red-600 animate-in fade-in zoom-in-95 duration-300">
            <AlertCircle className="w-8 h-8 mb-3 text-red-500" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Empty / Initial State */}
        {!hasSearched && !loading && !error && (
          <div className="text-center py-12">
            <p className="text-zinc-400 font-medium">
              Type a city above to start exploring.
            </p>
          </div>
        )}

        {/* Results Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <RestaurantSkeleton key={i} />
            ))}

          {!loading &&
            restaurants.map((place) => (
              <a
                key={place.id}
                href={place.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
              >
                <Card className="h-full overflow-hidden border-zinc-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-zinc-300 bg-white">
                  {/* Card Image Header */}
                  <div className="relative h-48 w-full overflow-hidden bg-zinc-100">
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={place.image_url || "/api/placeholder/400/300"}
                      alt={place.name}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&q=80";
                      }}
                    />
                    <Badge className="absolute top-3 right-3 z-20 font-semibold bg-white/95 text-zinc-900 hover:bg-white shadow-sm border-0">
                      <Star className="w-3.5 h-3.5 mr-1 fill-yellow-400 text-yellow-400" />
                      {place.rating}
                    </Badge>
                  </div>

                  {/* Card Content */}
                  <CardContent className="p-5 space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="text-xl font-bold line-clamp-1 text-zinc-900 group-hover:text-primary transition-colors">
                        {place.name}
                      </h3>

                      <div className="flex flex-wrap items-center gap-2 text-sm">
                        {place.price && (
                          <span className="font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {place.price}
                          </span>
                        )}
                        <span className="text-zinc-500 font-medium">
                          {place.categories[0]?.title || "Restaurant"}
                        </span>
                        <span className="text-zinc-300">•</span>
                        <span className="text-zinc-500">
                          {place.review_count} reviews
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2.5 pt-2 border-t border-zinc-100">
                      <div className="flex items-start gap-2.5 text-zinc-600 text-sm">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-zinc-400" />
                        <p className="line-clamp-2 leading-relaxed">
                          {place.location.address1
                            ? `${place.location.address1}, `
                            : ""}
                          {place.location.city}, {place.location.state}{" "}
                          {place.location.zip_code}
                        </p>
                      </div>

                      <div className="flex items-center gap-2.5 text-zinc-500 text-sm">
                        <Navigation className="w-4 h-4 shrink-0 text-zinc-400" />
                        <p className="font-mono text-xs">
                          {place.coordinates.latitude?.toFixed(4)},{" "}
                          {place.coordinates.longitude?.toFixed(4)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
        </div>
      </div>
    </main>
  );
}
