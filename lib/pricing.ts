/** Flat fee, in dollars, for custom-painting one miniature */
export const PAINTING_FEE = 25;

/** "$4.49"; with `cents: false`, whole amounts drop the cents ("$25") */
export function formatPrice(
  amount: number,
  { cents = true }: { cents?: boolean } = {}
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: cents || !Number.isInteger(amount) ? 2 : 0,
  }).format(amount);
}
