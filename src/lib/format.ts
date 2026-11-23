export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const formatPrice = (n: number) => `৳${n.toLocaleString()}`;
