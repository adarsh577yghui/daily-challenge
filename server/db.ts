import { and, eq, gte, lte } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { attempts, challenges, dailyChallenges, InsertUser, users, type ChallengeRow } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) { console.warn("[Database] Cannot upsert user: database not available"); return; }
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const textFields = ["name", "email", "loginMethod"] as const;
  for (const field of textFields) { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } }
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; } else if (user.openId === ENV.ownerOpenId) { values.role = "admin"; updateSet.role = "admin"; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function getChallengeForDate(dateId: string, now = new Date()): Promise<ChallengeRow | undefined> {
  const db = await getDb();
  if (!db) return undefined;
  const scheduled = await db.select({ challengeId: dailyChallenges.challengeId }).from(dailyChallenges).where(and(eq(dailyChallenges.dateId, dateId), eq(dailyChallenges.status, "Published"))).limit(1);
  const challengeId = scheduled[0]?.challengeId;
  if (!challengeId) return undefined;
  const result = await db.select().from(challenges).where(and(eq(challenges.id, challengeId), eq(challenges.status, "Published"), lte(challenges.publishDate, now), gte(challenges.expiresAt, now))).limit(1);
  return result[0];
}

export async function getChallengeById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(challenges).where(eq(challenges.id, id)).limit(1);
  return result[0];
}

export async function recordValidatedAttempt(input: { userId: number; challenge: ChallengeRow; answer: string; duration: number }) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const duration = Math.max(0, Math.min(input.challenge.timeLimit, Math.round(input.duration)));
  const correct = input.answer === input.challenge.correctAnswer;
  const speedBonus = correct ? Math.max(0, Math.round(((input.challenge.timeLimit - duration) / input.challenge.timeLimit) * 150)) : 0;
  const score = correct ? input.challenge.points + speedBonus : 0;
  await db.insert(attempts).values({ userId: input.userId, challengeId: input.challenge.id, answer: input.answer, duration, correct, score });
  return { correct, score, explanation: input.challenge.explanation };
}
