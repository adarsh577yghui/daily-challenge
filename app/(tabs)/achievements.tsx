import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { GlassCard, palette, SectionHeading } from "@/components/challenge-ui";
import { useChallengeStore, type AchievementId } from "@/lib/challenge-store";

const BADGES: { id: AchievementId; icon: React.ComponentProps<typeof MaterialIcons>["name"]; title: string; description: string; requirement: string; color: string }[] = [
  { id: "first", icon: "rocket-launch", title: "First Spark", description: "Complete your first challenge", requirement: "1 challenge", color: palette.purple },
  { id: "five", icon: "looks-5", title: "On a Roll", description: "Get through five challenges", requirement: "5 challenges", color: palette.mint },
  { id: "ten", icon: "looks-6", title: "Double Digits", description: "Complete ten challenges", requirement: "10 challenges", color: palette.yellow },
  { id: "streak7", icon: "local-fire-department", title: "Week Warrior", description: "Keep a seven-day streak", requirement: "7 day streak", color: palette.coral },
  { id: "streak30", icon: "workspace-premium", title: "Unstoppable", description: "Keep a thirty-day streak", requirement: "30 day streak", color: "#65B8FF" },
  { id: "perfect", icon: "my-location", title: "Bullseye", description: "Score the full base points", requirement: "Perfect score", color: "#D2A1FF" },
  { id: "speed", icon: "speed", title: "Speed Master", description: "Answer quickly for a bonus", requirement: "Speed bonus", color: "#FF9F6E" },
  { id: "master", icon: "school", title: "Quiz Master", description: "Build a serious score", requirement: "8,000 total pts", color: "#B9D76A" },
];

export default function AchievementsScreen() {
  const { progress } = useChallengeStore();
  const unlocked = new Set(progress.achievements);
  const unlockedCount = BADGES.filter((badge) => unlocked.has(badge.id)).length;
  return (
    <ScreenContainer containerClassName="bg-background" className="px-5" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>MILESTONES</Text><Text style={styles.title}>Your achievements</Text><Text style={styles.subtitle}>Small wins add up. Keep playing to light up the wall.</Text>
        <GlassCard style={styles.summary}><View style={styles.trophy}><MaterialIcons name="military-tech" size={28} color={palette.yellow} /></View><View style={styles.summaryCopy}><Text style={styles.summaryTitle}>{unlockedCount} of {BADGES.length} unlocked</Text><Text style={styles.summarySubtitle}>{unlockedCount === 0 ? "Your first badge is one challenge away." : "Your collection is growing."}</Text></View><Text style={styles.summaryPercent}>{Math.round((unlockedCount / BADGES.length) * 100)}%</Text></GlassCard>
        <SectionHeading eyebrow="Collection" title="Badge wall" />
        <View style={styles.grid}>{BADGES.map((badge) => { const isUnlocked = unlocked.has(badge.id); return <GlassCard key={badge.id} style={[styles.badgeCard, isUnlocked && { borderColor: `${badge.color}75` }]}><View style={[styles.badgeIcon, { backgroundColor: isUnlocked ? `${badge.color}20` : "#1B1A2B" }]}><MaterialIcons name={badge.icon} size={25} color={isUnlocked ? badge.color : palette.faint} /></View><Text style={[styles.badgeTitle, !isUnlocked && styles.lockedText]}>{badge.title}</Text><Text style={styles.badgeDescription}>{badge.description}</Text><View style={styles.badgeFooter}>{isUnlocked ? <><MaterialIcons name="check-circle" size={13} color={palette.mint} /><Text style={styles.unlockedText}>UNLOCKED</Text></> : <><MaterialIcons name="lock" size={13} color={palette.faint} /><Text style={styles.requirement}>{badge.requirement}</Text></>}</View></GlassCard>; })}</View>
        <View style={styles.safeBottom} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 20, paddingBottom: 24 },
  kicker: { color: palette.purple, fontSize: 10, fontWeight: "900", letterSpacing: 1.7, marginBottom: 8 },
  title: { color: palette.text, fontSize: 30, fontWeight: "900", letterSpacing: -0.8 },
  subtitle: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 8, maxWidth: 300, marginBottom: 22 },
  summary: { flexDirection: "row", alignItems: "center", padding: 15, marginBottom: 29 },
  trophy: { width: 50, height: 50, borderRadius: 17, backgroundColor: "#F7C75E18", alignItems: "center", justifyContent: "center", marginRight: 12 },
  summaryCopy: { flex: 1 },
  summaryTitle: { color: palette.text, fontSize: 15, fontWeight: "800" },
  summarySubtitle: { color: palette.faint, fontSize: 10, marginTop: 4 },
  summaryPercent: { color: palette.yellow, fontSize: 18, fontWeight: "900" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 11 },
  badgeCard: { width: "48%", minHeight: 183, padding: 14, borderRadius: 20 },
  badgeIcon: { width: 44, height: 44, borderRadius: 15, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  badgeTitle: { color: palette.text, fontSize: 14, fontWeight: "900" },
  lockedText: { color: palette.muted },
  badgeDescription: { color: palette.faint, fontSize: 10, lineHeight: 15, marginTop: 5, minHeight: 30 },
  badgeFooter: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: "auto", paddingTop: 12 },
  unlockedText: { color: palette.mint, fontSize: 9, fontWeight: "900", letterSpacing: 0.5 },
  requirement: { color: palette.faint, fontSize: 9, fontWeight: "800" },
  safeBottom: { height: 20 },
});
