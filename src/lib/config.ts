const PROD_API_URL = "https://wedplan-server-tawny.vercel.app";
const envUrl = process.env.NEXT_PUBLIC_API_URL;

// Production e localhost URL kokhono use hobe na
export const API_URL =
  process.env.NODE_ENV === "production"
    ? envUrl && !envUrl.includes("localhost")
      ? envUrl
      : PROD_API_URL
    : envUrl || "http://localhost:5001";
