import { z } from "zod";
import { getDateId, getTodayChallenge } from "../lib/challenges";
import { COOKIE_NAME } from "../shared/const.js";
import { getSessionCookieOptions } from "./_core/cookies";
import { getChallengeById, getChallengeForDate, recordValidatedAttempt } from "./db";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

function clientChallenge(challenge: { id: number | string; type: string; title: string; question: string; options: string[] | string; explanation?: string; difficulty: string; category: string; timeLimit: number; points: number; publishDate?: Date | string | null; expiresAt?: Date | string | null; status: string }) {
  return {
    id: challenge.id,
    type: challenge.type,
    title: challenge.title,
    question: challenge.question,
    options: Array.isArray(challenge.options) ? challenge.options : JSON.parse(challenge.options),
    explanation: challenge.explanation,
    difficulty: challenge.difficulty,
    category: challenge.category,
    timeLimit: challenge.timeLimit,
    points: challenge.points,
    publishDate: challenge.publishDate,
    expiresAt: challenge.expiresAt,
    status: challenge.status,
  };
}

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  challenges: router({
    today: publicProcedure.query(async () => {
      const dateId = getDateId();
      const serverChallenge = await getChallengeForDate(dateId);
      if (serverChallenge) return clientChallenge({ ...serverChallenge, options: serverChallenge.options });
      const fallback = getTodayChallenge();
      return clientChallenge(fallback);
    }),
    submit: protectedProcedure.input(z.object({ challengeId: z.number().int().positive(), answer: z.string().min(1).max(255), duration: z.number().min(0).max(3600) })).mutation(async ({ ctx, input }) => {
      const challenge = await getChallengeById(input.challengeId);
      if (!challenge) throw new Error("Challenge not found");
      return recordValidatedAttempt({ userId: ctx.user.id, challenge, answer: input.answer, duration: input.duration });
    }),
  }),
});

export type AppRouter = typeof appRouter;
