// import { defineConfig } from 'prisma/config';

// // DATABASE_URL is read from .env.local / environment at runtime.
// // The url is optional here so Prisma CLI works even when DATABASE_URL is not set yet.
// const databaseUrl = process.env.DATABASE_URL;

// export default defineConfig({
//   schema: './prisma/schema.prisma',
//   ...(databaseUrl ? { datasource: { url: databaseUrl } } : {}),
// });
// import 'dotenv/config';
// import { defineConfig } from 'prisma/config';

// export default defineConfig({
//   schema: './prisma/schema.prisma',
//   datasource: {
//     url: process.env.DATABASE_URL!,
//   },
// });

import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
