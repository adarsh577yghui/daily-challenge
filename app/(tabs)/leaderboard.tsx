import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { GlassCard, palette, SectionHeading } from "@/components/challenge-ui";
import { useChallengeStore } from "@/lib/challenge-store";

const PERIODS = ["Daily", "Weekly", "All-time"];

export default function LeaderboardScreen() {
  const { progress } = useChallengeStore();
  const [period, setPeriod] = useState("Daily");
  const today = new Date().toISOString().slice(0, 10);
  const score = progress.dailyScores[today] ?? 0;
  return (
    <ScreenContainer containerClassName="bg-background" className="px-5" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>FRIENDLY COMPETITION</Text><Text style={styles.title}>Leaderboard</Text><Text style={styles.subtitle}>See how your score stacks up. No emails, no private details—just display names.</Text>
        <View style={styles.periods}>{PERIODS.map((item) => <Pressable accessibilityRole="button" key={item} onPress={() => setPeriod(item)} style={({ pressed }) => [styles.period, period === item && styles.periodActive, pressed && { opacity: 0.75 }]}><Text style={[styles.periodText, period === item && styles.periodTextActive]}>{item}</Text></Pressable>)}</View>
        <GlassCard style={styles.yourCard}><View style={styles.yourIcon}><MaterialIcons name="person" size={24} color={palette.purple} /></View><View style={styles.yourCopy}><Text style={styles.yourLabel}>YOUR {period.toUpperCase()} SCORE</Text><Text style={styles.yourName}>{progress.displayName}</Text></View><Text style={styles.yourScore}>{period === "Daily" ? score || "—" : progress.totalScore || "—"}</Text></GlassCard>
        <SectionHeading eyebrow="Live standings" title={`${period} ranks`} />
        <GlassCard style={styles.emptyCard}><View style={styles.emptyIcon}><MaterialIcons name="leaderboard" size={29} color={palette.purple} /></View><Text style={styles.emptyTitle}>The board is waiting for players</Text><Text style={styles.emptyBody}>Global standings will appear here when account sync is enabled. Your progress is safely saved on this device in the meantime.</Text></GlassCard>
        <View style={styles.note}><MaterialIcons name="shield" size={15} color={palette.mint} /><Text style={styles.noteText}>Scores are validated from completed challenge answers.</Text></View>
        <View style={styles.safeBottom} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 20, paddingBottom: 24 },
  kicker: { color: palette.purple, fontSize: 10, fontWeight: "900", letterSpacing: 1.7, marginBottom: 8 },
  title: { color: palette.text, fontSize: 30, fontWeight: "900", letterSpacing: -0.8 },
  subtitle: { color: palette.muted, fontSize: 13, lineHeight: 19, marginTop: 8, marginBottom: 20 },
  periods: { flexDirection: "row", padding: 4, backgroundColor: palette.panel, borderRadius: 15, borderWidth: 1, borderColor: palette.line, marginBottom: 17 },
  period: { flex: 1, minHeight: 36, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  periodActive: { backgroundColor: palette.purple },
  periodText: { color: palette.faint, fontSize: 11, fontWeight: "800" },
  periodTextActive: { color: palette.bg },
  yourCard: { flexDirection: "row", alignItems: "center", padding: 15, marginBottom: 30 },
  yourIcon: { width: 44, height: 44, borderRadius: 15, backgroundColor: "#A78BFA20", alignItems: "center", justifyContent: "center", marginRight: 12 },
  yourCopy: { flex: 1 },
  yourLabel: { color: palette.faint, fontSize: 9, fontWeight: "900", letterSpacing: 1 },
  yourName: { color: palette.text, fontSize: 15, fontWeight: "800", marginTop: 4 },
  yourScore: { color: palette.yellow, fontSize: 22, fontWeight: "900" },
  emptyCard: { alignItems: "center", padding: 26 },
  emptyIcon: { width: 58, height: 58, borderRadius: 20, backgroundColor: "#A78BFA18", alignItems: "center", justifyContent: "center", marginBottom: 17 },
  emptyTitle: { color: palette.text, fontSize: 17, fontWeight: "900", textAlign: "center" },
  emptyBody: { color: palette.muted, fontSize: 12, lineHeight: 18, textAlign: "center", marginTop: 8 },
  note: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 18 },
  noteText: { color: palette.faint, fontSize: 10 },
  safeBottom: { height: 24 },
});
