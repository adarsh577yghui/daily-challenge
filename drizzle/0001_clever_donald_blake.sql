CREATE TABLE `achievements` (
	`id` varchar(40) NOT NULL,
	`name` varchar(100) NOT NULL,
	`description` text NOT NULL,
	`icon` varchar(60) NOT NULL,
	`requirement` varchar(120) NOT NULL,
	CONSTRAINT `achievements_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `attempts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`challengeId` int NOT NULL,
	`answer` varchar(255) NOT NULL,
	`score` int NOT NULL DEFAULT 0,
	`duration` int NOT NULL,
	`correct` boolean NOT NULL DEFAULT false,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `attempts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `challenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(120) NOT NULL,
	`type` enum('MCQ','TRUE_FALSE','EMOJI_GUESS','WORD_GUESS','MATH','PATTERN','MEMORY','VISUAL','ODD_ONE_OUT') NOT NULL,
	`title` varchar(180) NOT NULL,
	`question` text NOT NULL,
	`options` text NOT NULL,
	`correctAnswer` varchar(255) NOT NULL,
	`explanation` text NOT NULL,
	`category` varchar(80) NOT NULL,
	`difficulty` enum('Easy','Medium','Hard') NOT NULL,
	`timeLimit` int NOT NULL,
	`points` int NOT NULL,
	`imageUrl` text,
	`publishDate` timestamp,
	`expiresAt` timestamp,
	`status` enum('Draft','Scheduled','Published','Expired','Archived') NOT NULL DEFAULT 'Draft',
	`createdBy` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `challenges_id` PRIMARY KEY(`id`),
	CONSTRAINT `challenges_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `dailyChallenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`dateId` varchar(10) NOT NULL,
	`challengeId` int NOT NULL,
	`status` enum('Draft','Scheduled','Published','Expired') NOT NULL DEFAULT 'Scheduled',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dailyChallenges_id` PRIMARY KEY(`id`),
	CONSTRAINT `daily_challenges_date_unique` UNIQUE(`dateId`)
);
--> statement-breakpoint
CREATE TABLE `leaderboardEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`period` enum('daily','weekly','allTime') NOT NULL,
	`periodKey` varchar(20) NOT NULL,
	`userId` int NOT NULL,
	`displayName` varchar(80) NOT NULL,
	`photoURL` text,
	`score` int NOT NULL DEFAULT 0,
	`rank` int NOT NULL DEFAULT 0,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaderboardEntries_id` PRIMARY KEY(`id`),
	CONSTRAINT `leaderboard_user_period_unique` UNIQUE(`period`,`periodKey`,`userId`)
);
--> statement-breakpoint
CREATE TABLE `userAchievements` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`achievementId` varchar(40) NOT NULL,
	`unlockedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userAchievements_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_achievement_unique` UNIQUE(`userId`,`achievementId`)
);
--> statement-breakpoint
CREATE INDEX `attempts_user_challenge_idx` ON `attempts` (`userId`,`challengeId`);--> statement-breakpoint
CREATE INDEX `challenges_status_date_idx` ON `challenges` (`status`,`publishDate`,`expiresAt`);--> statement-breakpoint
CREATE INDEX `daily_challenges_challenge_date_idx` ON `dailyChallenges` (`challengeId`,`dateId`);--> statement-breakpoint
CREATE INDEX `leaderboard_period_rank_idx` ON `leaderboardEntries` (`period`,`periodKey`,`rank`);