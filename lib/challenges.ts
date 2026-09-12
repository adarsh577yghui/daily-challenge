export type ChallengeType =
  | "MCQ"
  | "TRUE_FALSE"
  | "EMOJI_GUESS"
  | "WORD_GUESS"
  | "MATH"
  | "PATTERN"
  | "MEMORY"
  | "VISUAL"
  | "ODD_ONE_OUT";

export type Difficulty = "Easy" | "Medium" | "Hard";

export type Challenge = {
  id: string;
  type: ChallengeType;
  title: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: Difficulty;
  category: string;
  timeLimit: number;
  points: number;
  publishedAt: string;
  expiresAt: string;
  status: "Published" | "Scheduled" | "Expired";
};

const CATALOG: Challenge[] = [
  {
    id: "daily-emoji-movie",
    type: "EMOJI_GUESS",
    title: "Decode the scene",
    question: "Which movie is represented by these emojis? 🦁👑",
    options: ["The Lion King", "Gladiator", "Mad Max", "Jumanji"],
    correctAnswer: "The Lion King",
    explanation: "A lion and a crown point to The Lion King.",
    difficulty: "Easy",
    category: "Emoji Guess",
    timeLimit: 10,
    points: 850,
    publishedAt: "2026-01-01T00:00:00.000Z",
    expiresAt: "2099-12-31T23:59:59.000Z",
    status: "Published",
  },
  {
    id: "daily-math-sprint",
    type: "MATH",
    title: "Quick calculation",
    question: "What is 18 × 4 − 12?",
    options: ["48", "60", "72", "84"],
    correctAnswer: "60",
    explanation: "18 × 4 is 72, and 72 − 12 is 60.",
    difficulty: "Medium",
    category: "Math Challenge",
    timeLimit: 12,
    points: 900,
    publishedAt: "2026-01-01T00:00:00.000Z",
    expiresAt: "2099-12-31T23:59:59.000Z",
    status: "Published",
  },
  {
    id: "daily-true-false",
    type: "TRUE_FALSE",
    title: "Fact check",
    question: "A day on Venus is longer than a year on Venus.",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation: "Venus rotates so slowly that one rotation takes longer than its trip around the Sun.",
    difficulty: "Hard",
    category: "True / False",
    timeLimit: 10,
    points: 1000,
    publishedAt: "2026-01-01T00:00:00.000Z",
    expiresAt: "2099-12-31T23:59:59.000Z",
    status: "Published",
  },
  {
    id: "daily-odd-one",
    type: "ODD_ONE_OUT",
    title: "Spot the odd one",
    question: "Which number does not belong?",
    options: ["16", "25", "36", "48"],
    correctAnswer: "48",
    explanation: "16, 25, and 36 are perfect squares. 48 is not.",
    difficulty: "Medium",
    category: "Odd One Out",
    timeLimit: 12,
    points: 950,
    publishedAt: "2026-01-01T00:00:00.000Z",
    expiresAt: "2099-12-31T23:59:59.000Z",
    status: "Published",
  },
  {
    id: "daily-pattern",
    type: "PATTERN",
    title: "Complete the pattern",
    question: "What comes next? 2, 4, 8, 16, ?",
    options: ["18", "24", "32", "34"],
    correctAnswer: "32",
    explanation: "Each number doubles: 2 → 4 → 8 → 16 → 32.",
    difficulty: "Easy",
    category: "Pattern Puzzle",
    timeLimit: 10,
    points: 800,
    publishedAt: "2026-01-01T00:00:00.000Z",
    expiresAt: "2099-12-31T23:59:59.000Z",
    status: "Published",
  },
];

export function getDateId(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function getTodayChallenge(date = new Date()): Challenge {
  const day = Math.floor(date.getTime() / 86_400_000);
  return CATALOG[((day % CATALOG.length) + CATALOG.length) % CATALOG.length];
}

export function getQuickChallenges(today = getTodayChallenge()): Challenge[] {
  return [today, ...CATALOG.filter((challenge) => challenge.id !== today.id).slice(0, 3)];
}

export function calculateScore(challenge: Challenge, isCorrect: boolean, elapsedSeconds: number) {
  if (!isCorrect) return 0;
  const safeElapsed = Math.max(0, Math.min(challenge.timeLimit, elapsedSeconds));
  const speedBonus = Math.max(0, Math.round(((challenge.timeLimit - safeElapsed) / challenge.timeLimit) * 150));
  return challenge.points + speedBonus;
}

export function isChallengePublished(challenge: Challenge, now = new Date()) {
  const current = now.getTime();
  return challenge.status === "Published" && new Date(challenge.publishedAt).getTime() <= current && new Date(challenge.expiresAt).getTime() >= current;
}

export function getCatalog() {
  return CATALOG;
}
