import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { Challenge, getDateId } from "@/lib/challenges";

const STORAGE_KEY = "daily-challenge-progress-v1";

export type AchievementId = "first" | "five" | "ten" | "streak7" | "streak30" | "perfect" | "speed" | "master";

export type UserProgress = {
  displayName: string;
  currentStreak: number;
  bestStreak: number;
  totalScore: number;
  gamesPlayed: number;
  lastDailyCompletedAt?: string;
  completedIds: string[];
  achievements: AchievementId[];
  dailyScores: Record<string, number>;
  sound: boolean;
  haptics: boolean;
  reducedMotion: boolean;
  notifications: boolean;
};

type ChallengeStore = {
  ready: boolean;
  progress: UserProgress;
  completeChallenge: (challenge: Challenge, score: number) => Promise<void>;
  rename: (displayName: string) => Promise<void>;
  updateSetting: (key: "sound" | "haptics" | "reducedMotion" | "notifications", value: boolean) => Promise<void>;
};

const defaultProgress: UserProgress = {
  displayName: "Player One",
  currentStreak: 0,
  bestStreak: 0,
  totalScore: 0,
  gamesPlayed: 0,
  completedIds: [],
  achievements: [],
  dailyScores: {},
  sound: true,
  haptics: true,
  reducedMotion: false,
  notifications: false,
};

const StoreContext = createContext<ChallengeStore | null>(null);

function dayDifference(from: string, to: string) {
  return Math.round((new Date(`${to}T00:00:00.000Z`).getTime() - new Date(`${from}T00:00:00.000Z`).getTime()) / 86_400_000);
}

function unlockAchievements(progress: UserProgress, challenge: Challenge, score: number) {
  const unlocked = new Set(progress.achievements);
  if (progress.gamesPlayed >= 1) unlocked.add("first");
  if (progress.gamesPlayed >= 5) unlocked.add("five");
  if (progress.gamesPlayed >= 10) unlocked.add("ten");
  if (progress.currentStreak >= 7) unlocked.add("streak7");
  if (progress.currentStreak >= 30) unlocked.add("streak30");
  if (score >= challenge.points) unlocked.add("perfect");
  if (score >= challenge.points + 120) unlocked.add("speed");
  if (progress.gamesPlayed >= 10 && progress.totalScore >= 8_000) unlocked.add("master");
  return Array.from(unlocked);
}

export function ChallengeProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (stored) setProgress({ ...defaultProgress, ...JSON.parse(stored) });
      })
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, []);

  const persist = useCallback(async (next: UserProgress) => {
    setProgress(next);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const completeChallenge = useCallback(async (challenge: Challenge, score: number) => {
    const today = getDateId();
    const alreadyCompletedToday = progress.lastDailyCompletedAt === today;
    const nextStreak = alreadyCompletedToday
      ? progress.currentStreak
      : !progress.lastDailyCompletedAt || dayDifference(progress.lastDailyCompletedAt, today) > 1
        ? 1
        : progress.currentStreak + 1;
    const next: UserProgress = {
      ...progress,
      currentStreak: nextStreak,
      bestStreak: Math.max(progress.bestStreak, nextStreak),
      totalScore: progress.totalScore + score,
      gamesPlayed: alreadyCompletedToday ? progress.gamesPlayed : progress.gamesPlayed + 1,
      lastDailyCompletedAt: today,
      completedIds: progress.completedIds.includes(challenge.id) ? progress.completedIds : [...progress.completedIds, challenge.id],
      dailyScores: { ...progress.dailyScores, [today]: Math.max(progress.dailyScores[today] ?? 0, score) },
      achievements: unlockAchievements({ ...progress, currentStreak: nextStreak, totalScore: progress.totalScore + score, gamesPlayed: alreadyCompletedToday ? progress.gamesPlayed : progress.gamesPlayed + 1 }, challenge, score),
    };
    await persist(next);
  }, [persist, progress]);

  const rename = useCallback(async (displayName: string) => {
    await persist({ ...progress, displayName: displayName.trim() || "Player One" });
  }, [persist, progress]);

  const updateSetting = useCallback(async (key: "sound" | "haptics" | "reducedMotion" | "notifications", value: boolean) => {
    await persist({ ...progress, [key]: value });
  }, [persist, progress]);

  const value = useMemo(() => ({ ready, progress, completeChallenge, rename, updateSetting }), [ready, progress, completeChallenge, rename, updateSetting]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useChallengeStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useChallengeStore must be used inside ChallengeProvider");
  return value;
}
