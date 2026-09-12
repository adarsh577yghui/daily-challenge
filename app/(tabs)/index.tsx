import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { GradientOrb, GlassCard, palette, PrimaryButton, SectionHeading, StatPill } from "@/components/challenge-ui";
import { getQuickChallenges, getTodayChallenge } from "@/lib/challenges";
import { useChallengeStore } from "@/lib/challenge-store";

export default function HomeScreen() {
  const { progress, ready } = useChallengeStore();
  const today = getTodayChallenge();
  const quickChallenges = getQuickChallenges(today);
  const todayScore = progress.dailyScores[new Date().toISOString().slice(0, 10)] ?? 0;
  const completedToday = progress.lastDailyCompletedAt === new Date().toISOString().slice(0, 10);

  return (
    <ScreenContainer containerClassName="bg-background" className="px-5" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topRow}>
          <View>
            <Text style={styles.kicker}>DAILY CHALLENGE</Text>
            <Text style={styles.greeting}>Good morning, {progress.displayName.split(" ")[0]}</Text>
          </View>
          <View style={styles.avatar}><Text style={styles.avatarText}>{progress.displayName.slice(0, 1).toUpperCase()}</Text></View>
        </View>

        <View style={styles.streakRow}>
          <View style={styles.streakFire}><Text style={styles.fire}>🔥</Text></View>
          <View><Text style={styles.streakValue}>{ready ? `${progress.currentStreak} day streak` : "—"}</Text><Text style={styles.streakHint}>Complete today’s challenge to keep it going</Text></View>
          <MaterialIcons name="chevron-right" size={21} color={palette.faint} style={styles.chevron} />
        </View>

        <GlassCard style={styles.heroCard}>
          <GradientOrb />
          <View style={styles.heroContent}>
            <View style={styles.heroBadge}><View style={styles.liveDot} /><Text style={styles.heroBadgeText}>{completedToday ? "COMPLETED TODAY" : "TODAY'S CHALLENGE"}</Text></View>
            <Text style={styles.heroTitle}>{today.title}</Text>
            <Text style={styles.heroQuestion}>{today.question}</Text>
            <View style={styles.heroMeta}><Text style={styles.metaText}><MaterialIcons name="schedule" size={14} color={palette.muted} /> {today.timeLimit} sec</Text><Text style={styles.metaText}><MaterialIcons name="bolt" size={14} color={palette.yellow} /> up to {today.points + 150} pts</Text></View>
            <PrimaryButton icon="arrow-forward" onPress={() => router.push("/(tabs)/play")}>{completedToday ? "PLAY AGAIN" : "PLAY NOW"}</PrimaryButton>
          </View>
        </GlassCard>

        <View style={styles.statsRow}>
          <StatPill icon="stars" value={todayScore ? String(todayScore) : "—"} label="Today's score" color={palette.yellow} />
          <StatPill icon="emoji-events" value={progress.bestStreak ? `${progress.bestStreak}d` : "—"} label="Best streak" color={palette.mint} />
          <StatPill icon="gamepad" value={String(progress.gamesPlayed)} label="Played" color={palette.purple} />
        </View>

        <SectionHeading eyebrow="Keep your brain warm" title="Quick challenges" action="See all" onAction={() => router.push("/(tabs)/play")} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickRow}>
          {quickChallenges.map((challenge, index) => (
            <Pressable key={challenge.id} accessibilityRole="button" onPress={() => router.push("/(tabs)/play")} style={({ pressed }) => [styles.quickCard, index === 0 && styles.quickCardFeatured, pressed && { opacity: 0.78, transform: [{ scale: 0.98 }] }]}>
              <Text style={styles.quickEmoji}>{["🧩", "⚡", "🌙", "🎯"][index]}</Text>
              <Text style={styles.quickCategory}>{challenge.category}</Text>
              <Text style={styles.quickTitle} numberOfLines={2}>{index === 0 ? "Today's challenge" : challenge.title}</Text>
              <View style={styles.quickFooter}><Text style={styles.quickTime}>{challenge.timeLimit}s</Text><MaterialIcons name="arrow-outward" size={15} color={index === 0 ? palette.bg : palette.purple} /></View>
            </Pressable>
          ))}
        </ScrollView>

        <SectionHeading eyebrow="Your progress" title="This week" />
        <GlassCard style={styles.weekCard}>
          <View style={styles.weekCopy}><Text style={styles.weekTitle}>{progress.currentStreak > 0 ? "Nice momentum." : "Start your streak."}</Text><Text style={styles.weekSubtitle}>A tiny challenge every day adds up.</Text></View>
          <View style={styles.weekDays}>{["M", "T", "W", "T", "F", "S", "S"].map((day, index) => { const filled = index >= 7 - Math.min(progress.currentStreak, 7); return <View key={`${day}-${index}`} style={styles.day}><View style={[styles.dayCircle, filled && styles.dayFilled]}><Text style={[styles.dayMark, filled && styles.dayMarkFilled]}>{filled ? "✓" : day}</Text></View><Text style={styles.dayLabel}>{day}</Text></View>; })}</View>
        </GlassCard>

        <View style={styles.safeBottom} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 18, paddingBottom: 18 },
  topRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 18 },
  kicker: { color: palette.purple, fontSize: 10, fontWeight: "900", letterSpacing: 2, marginBottom: 7 },
  greeting: { color: palette.text, fontSize: 23, fontWeight: "800", letterSpacing: -0.5 },
  avatar: { width: 40, height: 40, borderRadius: 15, backgroundColor: palette.panelRaised, borderWidth: 1, borderColor: palette.line, alignItems: "center", justifyContent: "center" },
  avatarText: { color: palette.purple, fontSize: 16, fontWeight: "900" },
  streakRow: { flexDirection: "row", alignItems: "center", marginBottom: 18, paddingVertical: 11, paddingHorizontal: 13, borderRadius: 18, backgroundColor: "#141326", borderWidth: 1, borderColor: "#27233D" },
  streakFire: { width: 34, height: 34, borderRadius: 12, backgroundColor: "#F7C75E18", alignItems: "center", justifyContent: "center", marginRight: 10 },
  fire: { fontSize: 19 },
  streakValue: { color: palette.text, fontSize: 14, fontWeight: "800" },
  streakHint: { color: palette.faint, fontSize: 10, marginTop: 3 },
  chevron: { marginLeft: "auto" },
  heroCard: { minHeight: 295, marginBottom: 22 },
  heroContent: { padding: 21, zIndex: 2 },
  heroBadge: { flexDirection: "row", alignItems: "center", gap: 7, marginBottom: 16 },
  liveDot: { width: 7, height: 7, borderRadius: 7, backgroundColor: palette.mint },
  heroBadgeText: { color: palette.mint, fontSize: 10, letterSpacing: 1.4, fontWeight: "900" },
  heroTitle: { color: palette.text, fontSize: 29, fontWeight: "900", letterSpacing: -1, maxWidth: "72%", lineHeight: 34 },
  heroQuestion: { color: palette.muted, fontSize: 13, lineHeight: 19, maxWidth: "68%", marginTop: 10, minHeight: 40 },
  heroMeta: { flexDirection: "row", gap: 14, marginTop: 13, marginBottom: 18 },
  metaText: { color: palette.muted, fontSize: 11, fontWeight: "700" },
  statsRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 3, marginBottom: 29 },
  quickRow: { gap: 11, paddingBottom: 27 },
  quickCard: { width: 134, height: 144, padding: 14, borderRadius: 19, backgroundColor: palette.panel, borderWidth: 1, borderColor: palette.line },
  quickCardFeatured: { backgroundColor: palette.purple, borderColor: palette.purple },
  quickEmoji: { fontSize: 24, marginBottom: 10 },
  quickCategory: { color: palette.muted, fontSize: 9, fontWeight: "800", textTransform: "uppercase", letterSpacing: 0.6 },
  quickTitle: { color: palette.text, fontSize: 13, fontWeight: "800", lineHeight: 17, marginTop: 4 },
  quickFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: "auto" },
  quickTime: { color: palette.muted, fontSize: 11, fontWeight: "800" },
  weekCard: { padding: 17, marginBottom: 12 },
  weekCopy: { marginBottom: 19 },
  weekTitle: { color: palette.text, fontSize: 16, fontWeight: "800" },
  weekSubtitle: { color: palette.faint, fontSize: 11, marginTop: 4 },
  weekDays: { flexDirection: "row", justifyContent: "space-between" },
  day: { alignItems: "center", gap: 7 },
  dayCircle: { width: 29, height: 29, borderRadius: 12, backgroundColor: "#1C1B30", alignItems: "center", justifyContent: "center" },
  dayFilled: { backgroundColor: palette.mint },
  dayMark: { color: palette.faint, fontSize: 10, fontWeight: "800" },
  dayMarkFilled: { color: palette.bg, fontSize: 13 },
  dayLabel: { color: palette.faint, fontSize: 9, fontWeight: "800" },
  safeBottom: { height: 22 },
});
