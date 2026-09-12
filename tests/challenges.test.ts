import { describe, expect, it } from "vitest";

import { calculateScore, getQuickChallenges, getTodayChallenge, isChallengePublished } from "../lib/challenges";

describe("daily challenge rules", () => {
  const challenge = getTodayChallenge(new Date("2026-09-12T10:00:00.000Z"));

  it("awards base points plus a bounded speed bonus for a correct answer", () => {
    expect(calculateScore(challenge, true, 1)).toBeGreaterThan(challenge.points);
    expect(calculateScore(challenge, true, challenge.timeLimit)).toBe(challenge.points);
  });

  it("awards zero points for an incorrect answer", () => {
    expect(calculateScore(challenge, false, 1)).toBe(0);
  });

  it("selects a stable challenge for a calendar date", () => {
    expect(getTodayChallenge(new Date("2026-09-12T10:00:00.000Z")).id).toBe(getTodayChallenge(new Date("2026-09-12T22:00:00.000Z")).id);
  });

  it("returns a short set for quick play", () => {
    expect(getQuickChallenges(challenge)).toHaveLength(4);
    expect(getQuickChallenges(challenge)[0].id).toBe(challenge.id);
  });

  it("honors publish and expiry windows", () => {
    const published = { ...challenge, publishedAt: "2026-01-01T00:00:00.000Z", expiresAt: "2026-12-31T23:59:59.000Z", status: "Published" as const };
    expect(isChallengePublished(published, new Date("2026-09-12T00:00:00.000Z"))).toBe(true);
    expect(isChallengePublished(published, new Date("2027-01-01T00:00:00.000Z"))).toBe(false);
  });
});
