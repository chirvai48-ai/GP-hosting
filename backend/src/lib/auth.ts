import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "../lib/prisma";

export const auth = betterAuth({
  trustedOrigins: ["http://localhost:3000"],
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  user: {
    modelName: "admin",
    additionalFields:{
      role: {
         type: "string",        
            required: false,
            defaultValue: "Admin",
            input: false
      }
    }
  },
  emailAndPassword: {
    enabled: true,
  },
});
