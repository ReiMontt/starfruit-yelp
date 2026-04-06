// src/app/page.tsx
"use client";

import { useState } from "react";
import { getRestaurants } from "@/actions/yelp";
import { Restaurant } from "@/types/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { MapPin, Star, Navigation } from "lucide-react";

export default function Home() {
  const [city, setCity] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError("");
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
    <main className="min-h-screen bg-zinc-50 p-6 md:p-12 font-sans">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Starfruit Express Search
          </h1>
          <p className="text-muted-foreground">
            Find the best restaurants in your city.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
          <Input
            placeholder="Enter a city (e.g., San Francisco)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={loading}
          />
          <Button type="submit" disabled={loading || !city.trim()}>
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>

        {error && (
          <div className="p-4 text-sm text-red-800 bg-red-100 rounded-lg text-center">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {restaurants.map((place) => (
            <Card key={place.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-1">
                  {place.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 text-yellow-600 font-medium">
                  <Star className="w-4 h-4 fill-current" />
                  {place.rating} / 5.0 ({place.review_count} reviews)
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                  <p>
                    {place.location.address1
                      ? `${place.location.address1}, `
                      : ""}
                    {place.location.city}, {place.location.state}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Navigation className="w-4 h-4 shrink-0" />
                  <p className="font-mono text-xs">
                    {place.coordinates.latitude?.toFixed(4)},{" "}
                    {place.coordinates.longitude?.toFixed(4)}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
