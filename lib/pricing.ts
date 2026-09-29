/** Flat fee, in dollars, for custom-painting one miniature */
export const PAINTING_FEE = 25;

export function formatPrice(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}
