import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from "react-native";

import { ScreenContainer } from "@/components/screen-container";
import { GlassCard, palette, SectionHeading } from "@/components/challenge-ui";
import { useChallengeStore } from "@/lib/challenge-store";

export default function ProfileScreen() {
  const { progress, rename, updateSetting } = useChallengeStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(progress.displayName);
  const initials = progress.displayName.slice(0, 1).toUpperCase();
  const saveName = async () => { await rename(name); setEditing(false); };
  const settings = [
    { key: "notifications" as const, icon: "notifications-none" as const, title: "Daily reminders", subtitle: "A gentle nudge, never spam" },
    { key: "sound" as const, icon: "volume-up" as const, title: "Sound effects", subtitle: "Feedback during play" },
    { key: "haptics" as const, icon: "vibration" as const, title: "Haptics", subtitle: "Tactile feedback on taps" },
    { key: "reducedMotion" as const, icon: "accessibility" as const, title: "Reduced motion", subtitle: "Keep interactions calm" },
  ];
  return (
    <ScreenContainer containerClassName="bg-background" className="px-5" edges={["top", "left", "right"]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>YOUR SPACE</Text><Text style={styles.title}>Profile</Text>
        <GlassCard style={styles.profileCard}><View style={styles.largeAvatar}><Text style={styles.avatarText}>{initials}</Text></View><View style={styles.profileCopy}>{editing ? <TextInput autoFocus value={name} onChangeText={setName} onSubmitEditing={saveName} returnKeyType="done" style={styles.nameInput} maxLength={22} /> : <Text style={styles.name}>{progress.displayName}</Text>}<Text style={styles.handle}>Challenge player</Text></View><Pressable accessibilityRole="button" onPress={editing ? saveName : () => setEditing(true)} style={({ pressed }) => [styles.editButton, pressed && { opacity: 0.7 }]}><MaterialIcons name={editing ? "check" : "edit"} size={18} color={palette.purple} /></Pressable></GlassCard>
        <View style={styles.stats}><View><Text style={styles.statNumber}>{progress.totalScore || "—"}</Text><Text style={styles.statLabel}>TOTAL SCORE</Text></View><View><Text style={styles.statNumber}>{progress.currentStreak || "—"}</Text><Text style={styles.statLabel}>CURRENT STREAK</Text></View><View><Text style={styles.statNumber}>{progress.gamesPlayed}</Text><Text style={styles.statLabel}>PLAYED</Text></View></View>
        <SectionHeading eyebrow="Make it yours" title="Preferences" />
        <GlassCard style={styles.settingsCard}>{settings.map((setting, index) => <View key={setting.key} style={[styles.settingRow, index !== settings.length - 1 && styles.settingDivider]}><View style={styles.settingIcon}><MaterialIcons name={setting.icon} size={19} color={palette.purple} /></View><View style={styles.settingCopy}><Text style={styles.settingTitle}>{setting.title}</Text><Text style={styles.settingSubtitle}>{setting.subtitle}</Text></View><Switch value={progress[setting.key]} onValueChange={(value) => updateSetting(setting.key, value)} trackColor={{ false: "#2A2942", true: "#6D4BD8" }} thumbColor={progress[setting.key] ? palette.purple : "#8A889D"} /></View>)}</GlassCard>
        <SectionHeading eyebrow="Account" title="About" />
        <GlassCard style={styles.aboutCard}><Pressable accessibilityRole="button" onPress={() => Alert.alert("Privacy", "Your local progress stays on this device in this MVP. Cloud sync can be enabled when an account is connected.")}  style={styles.aboutRow}><Text style={styles.aboutTitle}>Privacy</Text><MaterialIcons name="chevron-right" size={19} color={palette.faint} /></Pressable><View style={styles.aboutDivider} /><Pressable accessibilityRole="button" onPress={() => Alert.alert("Terms of play", "Play fairly, keep it friendly, and enjoy one short challenge at a time.")}  style={styles.aboutRow}><Text style={styles.aboutTitle}>Terms of play</Text><MaterialIcons name="chevron-right" size={19} color={palette.faint} /></Pressable></GlassCard>
        <Text style={styles.version}>DAILY CHALLENGE · v1.0 · Play. Think. Beat Your Score.</Text>
        <View style={styles.safeBottom} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 20, paddingBottom: 24 },
  kicker: { color: palette.purple, fontSize: 10, fontWeight: "900", letterSpacing: 1.7, marginBottom: 8 },
  title: { color: palette.text, fontSize: 30, fontWeight: "900", letterSpacing: -0.8, marginBottom: 20 },
  profileCard: { flexDirection: "row", alignItems: "center", padding: 15, marginBottom: 22 },
  largeAvatar: { width: 56, height: 56, borderRadius: 19, backgroundColor: palette.purple, alignItems: "center", justifyContent: "center", marginRight: 13 },
  avatarText: { color: palette.bg, fontSize: 23, fontWeight: "900" },
  profileCopy: { flex: 1 },
  name: { color: palette.text, fontSize: 17, fontWeight: "900" },
  nameInput: { color: palette.text, fontSize: 17, fontWeight: "900", paddingVertical: 3, borderBottomWidth: 1, borderBottomColor: palette.purple },
  handle: { color: palette.faint, fontSize: 11, marginTop: 5 },
  editButton: { width: 36, height: 36, borderRadius: 13, backgroundColor: "#A78BFA18", alignItems: "center", justifyContent: "center" },
  stats: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 9, marginBottom: 31 },
  statNumber: { color: palette.text, fontSize: 20, fontWeight: "900", textAlign: "center" },
  statLabel: { color: palette.faint, fontSize: 9, fontWeight: "900", letterSpacing: 0.6, marginTop: 4, textAlign: "center" },
  settingsCard: { paddingHorizontal: 15, marginBottom: 30 },
  settingRow: { minHeight: 68, flexDirection: "row", alignItems: "center" },
  settingDivider: { borderBottomWidth: 1, borderBottomColor: palette.line },
  settingIcon: { width: 34, height: 34, borderRadius: 12, backgroundColor: "#A78BFA18", alignItems: "center", justifyContent: "center", marginRight: 11 },
  settingCopy: { flex: 1 },
  settingTitle: { color: palette.text, fontSize: 13, fontWeight: "800" },
  settingSubtitle: { color: palette.faint, fontSize: 10, marginTop: 3 },
  aboutCard: { paddingHorizontal: 15, marginBottom: 20 },
  aboutRow: { minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  aboutTitle: { color: palette.text, fontSize: 13, fontWeight: "800" },
  aboutDivider: { height: 1, backgroundColor: palette.line },
  version: { color: palette.faint, fontSize: 10, textAlign: "center", lineHeight: 16 },
  safeBottom: { height: 24 },
});
