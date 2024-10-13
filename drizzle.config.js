export default {
  dialect: "postgresql",
  schema: "./utils/db/schema.ts",
  out: "./drizzle",

  dbCredentials: {
    url: process.env.DATABASE_URL,
    connectionString:
      process.env.DATABASE_URL,
  },
};

// postgresql://zerotohero_owner:SPVe2rokvBf6@ep-bitter-shadow-a5lbwa60.us-east-2.aws.neon.tech/threadcraft?sslmode=require
// postgresql://zerotohero_owner:SPVe2rokvBf6@ep-bitter-shadow-a5lbwa60.us-east-2.aws.neon.tech/threadcraft?sslmode=require