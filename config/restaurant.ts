// Bridge file: re-exports factory-generated data in the shape components expect.
// The factory writes lib/restaurant.ts, lib/reviews-data.ts, and lib/menu-data.ts.
// This file maps those into a single config object so component imports stay clean.

import { restaurant } from "@/lib/restaurant";
import { reviewsData } from "@/lib/reviews-data";
import { menuCategories } from "@/lib/menu-data";

export type OpeningHoursEntry = {
  day: string;
  hours: string;
};

export type ReviewExcerpt = {
  name: string;
  rating: number;
  date: string;
  text: string;
};

export type MenuItemConfig = {
  name: string;
  description: string;
  price: string;
};

export type MenuCategoryConfig = {
  category: string;
  subtitle: string;
  items: MenuItemConfig[];
};

export type RestaurantConfigBridge = {
  name: string;
  tagline: string;
  intro: string;
  address: {
    street: string;
    city: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    instagram: string;
  };
  openingHours: OpeningHoursEntry[];
  reviews: {
    rating: number;
    count: number;
    source: string;
    excerpts: ReviewExcerpt[];
  };
  menu: MenuCategoryConfig[];
  socialMedia: typeof restaurant.socialMedia;
  legal: typeof restaurant.legal;
  mapsUrl: string;
};

const config: RestaurantConfigBridge = {
  name: restaurant.name,
  tagline: restaurant.tagline,
  intro: "",
  address: {
    street: restaurant.address.street,
    city: restaurant.address.cityLine,
    country: "Deutschland",
  },
  contact: {
    phone: restaurant.phone,
    email: restaurant.email,
    instagram: restaurant.socialMedia.hidden.instagram
      ? ""
      : restaurant.socialMedia.instagram,
  },
  openingHours: restaurant.hours.map((h) => ({
    day: h.day,
    hours: h.closed ? "Ruhetag" : h.time,
  })),
  reviews: {
    rating: reviewsData.overallRating,
    count: reviewsData.totalRatings,
    source: "Google",
    excerpts: reviewsData.reviews.map((r) => ({
      name: r.author,
      rating: r.rating,
      date: r.time,
      text: r.text,
    })),
  },
  menu: menuCategories.map((c) => ({
    category: c.label,
    subtitle: c.intro || "",
    items: c.items.map((i) => ({
      name: i.name,
      description: i.description || "",
      price: i.price,
    })),
  })),
  socialMedia: restaurant.socialMedia,
  legal: restaurant.legal,
  mapsUrl: restaurant.mapsUrl,
};

export default config;
