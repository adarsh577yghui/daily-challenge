import { boolean, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const challenges = mysqlTable("challenges", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 120 }).notNull().unique(),
  type: mysqlEnum("type", ["MCQ", "TRUE_FALSE", "EMOJI_GUESS", "WORD_GUESS", "MATH", "PATTERN", "MEMORY", "VISUAL", "ODD_ONE_OUT"]).notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  question: text("question").notNull(),
  options: text("options").notNull(),
  correctAnswer: varchar("correctAnswer", { length: 255 }).notNull(),
  explanation: text("explanation").notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  difficulty: mysqlEnum("difficulty", ["Easy", "Medium", "Hard"]).notNull(),
  timeLimit: int("timeLimit").notNull(),
  points: int("points").notNull(),
  imageUrl: text("imageUrl"),
  publishDate: timestamp("publishDate"),
  expiresAt: timestamp("expiresAt"),
  status: mysqlEnum("status", ["Draft", "Scheduled", "Published", "Expired", "Archived"]).default("Draft").notNull(),
  createdBy: int("createdBy").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  statusDateIdx: index("challenges_status_date_idx").on(table.status, table.publishDate, table.expiresAt),
}));

export const dailyChallenges = mysqlTable("dailyChallenges", {
  id: int("id").autoincrement().primaryKey(),
  dateId: varchar("dateId", { length: 10 }).notNull(),
  challengeId: int("challengeId").notNull(),
  status: mysqlEnum("status", ["Draft", "Scheduled", "Published", "Expired"]).default("Scheduled").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  dateUnique: uniqueIndex("daily_challenges_date_unique").on(table.dateId),
  challengeDateIdx: index("daily_challenges_challenge_date_idx").on(table.challengeId, table.dateId),
}));

export const attempts = mysqlTable("attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  challengeId: int("challengeId").notNull(),
  answer: varchar("answer", { length: 255 }).notNull(),
  score: int("score").default(0).notNull(),
  duration: int("duration").notNull(),
  correct: boolean("correct").default(false).notNull(),
  completedAt: timestamp("completedAt").defaultNow().notNull(),
}, (table) => ({
  userChallengeIdx: index("attempts_user_challenge_idx").on(table.userId, table.challengeId),
}));

export const leaderboardEntries = mysqlTable("leaderboardEntries", {
  id: int("id").autoincrement().primaryKey(),
  period: mysqlEnum("period", ["daily", "weekly", "allTime"]).notNull(),
  periodKey: varchar("periodKey", { length: 20 }).notNull(),
  userId: int("userId").notNull(),
  displayName: varchar("displayName", { length: 80 }).notNull(),
  photoURL: text("photoURL"),
  score: int("score").default(0).notNull(),
  rank: int("rank").default(0).notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  periodRankIdx: index("leaderboard_period_rank_idx").on(table.period, table.periodKey, table.rank),
  userPeriodUnique: uniqueIndex("leaderboard_user_period_unique").on(table.period, table.periodKey, table.userId),
}));

export const achievements = mysqlTable("achievements", {
  id: varchar("id", { length: 40 }).primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 60 }).notNull(),
  requirement: varchar("requirement", { length: 120 }).notNull(),
});

export const userAchievements = mysqlTable("userAchievements", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  achievementId: varchar("achievementId", { length: 40 }).notNull(),
  unlockedAt: timestamp("unlockedAt").defaultNow().notNull(),
}, (table) => ({
  userAchievementUnique: uniqueIndex("user_achievement_unique").on(table.userId, table.achievementId),
}));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type ChallengeRow = typeof challenges.$inferSelect;
export type InsertChallenge = typeof challenges.$inferInsert;
export type Attempt = typeof attempts.$inferSelect;
