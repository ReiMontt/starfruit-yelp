"use server";

import { YelpResponse } from "../types/types";

export async function getRestaurants(city: string): Promise<YelpResponse> {
  if (!city) {
    return { error: { code: "VALIDATION", description: "City is required." } };
  }

  // 5 miles = 8046 meters
  const RADIUS_IN_METERS = 8046;
  const url = `https://api.yelp.com/v3/businesses/search?location=${encodeURIComponent(
    city,
  )}&term=restaurants&radius=${RADIUS_IN_METERS}&sort_by=best_match&limit=20`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.YELP_API_KEY}`,
        accept: "application/json",
      },
      // cache for 1hr
      next: { revalidate: 3600 },
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        error: {
          code: "API_ERROR",
          description:
            data.error?.description || "Failed to fetch data from Yelp.",
        },
      };
    }

    return { businesses: data.businesses };
  } catch (error) {
    return {
      error: {
        code: "NETWORK_ERROR",
        description: "An unexpected network error occurred.",
      },
    };
  }
}
