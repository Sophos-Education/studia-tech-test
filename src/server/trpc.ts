import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { prisma } from "./db";

const t = initTRPC.context<{ prisma: typeof prisma }>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure.use(async ({ next }) => {
  return next({
    ctx: { prisma },
  });
});
