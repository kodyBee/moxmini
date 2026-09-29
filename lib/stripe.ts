import "server-only";
import Stripe from "stripe";

let stripe: Stripe | null = null;

export function getStripe() {
  if (!stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripe = new Stripe(key, {
      apiVersion: "2026-08-26.dahlia",
    });
  }
  return stripe;
}
