import dns from "node:dns";

// Local e kichu network SRV DNS lookup block kore, tai public DNS use korchi
if (process.env.NODE_ENV !== "production") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}
import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

// Serverless (Vercel) e connection baar baar na khule ekta reuse korbo
const globalForMongo = globalThis as unknown as { _mongoClient?: MongoClient };

const client =
  globalForMongo._mongoClient ?? new MongoClient(process.env.MONGODB_URI!);

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClient = client;
}

const db = client.db(process.env.MONGODB_DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  user: {
    additionalFields: {
      // client theke asha role: sudhu vendor/customer, admin kokhono na (niche hook dekho)
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      // eigulo client kokhono set korte parbe na (input: false)
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      businessName: { type: "string", required: false, input: true },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Public registration e admin role dewa jabe na
          const role = user.role === "vendor" ? "vendor" : "customer";
          return {
            data: {
              ...user,
              role,
              isBlocked: false,
              subscriptionPlan: "free",
            },
          };
        },
      },
      update: {
        before: async (userData) => {
          // Profile update diye role/block/subscription bodlano jabe na
          const protectedKeys = [
            "role",
            "isBlocked",
            "subscriptionPlan",
            "subscriptionExpiresAt",
          ];
          if (protectedKeys.some((k) => k in userData)) return false;
        },
      },
    },
  },

  plugins: [jwt()],
});
