import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { Pressable, StyleSheet, Text, View, type PressableProps } from "react-native";

export const palette = {
  bg: "#080812",
  panel: "#121223",
  panelRaised: "#191832",
  line: "#292742",
  text: "#F8F7FF",
  muted: "#A5A4B6",
  faint: "#74738A",
  purple: "#A78BFA",
  purpleDark: "#6D4BD8",
  mint: "#39D6A2",
  yellow: "#F7C75E",
  coral: "#F47B95",
};

export function GradientOrb() {
  return (
    <View style={[styles.orbLayer, { pointerEvents: "none" }]} >
      <View style={[styles.orb, styles.orbOne]} />
      <View style={[styles.orb, styles.orbTwo]} />
      <View style={[styles.orb, styles.orbThree]} />
      <Text style={[styles.floatingSymbol, styles.symbolOne]}>?</Text>
      <Text style={[styles.floatingSymbol, styles.symbolTwo]}>✦</Text>
      <Text style={[styles.floatingSymbol, styles.symbolThree]}>◈</Text>
      <Text style={[styles.floatingSymbol, styles.symbolFour]}>+</Text>
    </View>
  );
}

export function SectionHeading({ eyebrow, title, action, onAction }: { eyebrow?: string; title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeading}>
      <View>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {action && onAction ? <Pressable accessibilityRole="button" onPress={onAction} style={({ pressed }) => [styles.textAction, pressed && { opacity: 0.7 }]}><Text style={styles.textActionLabel}>{action}</Text></Pressable> : null}
    </View>
  );
}

export function PrimaryButton({ children, icon, ...props }: PressableProps & { children: React.ReactNode; icon?: React.ComponentProps<typeof MaterialIcons>["name"] }) {
  return (
    <Pressable {...props} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]}>
      <Text style={styles.primaryLabel}>{children}</Text>
      {icon ? <MaterialIcons name={icon} size={20} color={palette.bg} /> : null}
    </Pressable>
  );
}

export function GlassCard({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.glassCard, style]}>{children}</View>;
}

export function StatPill({ icon, value, label, color = palette.purple }: { icon: React.ComponentProps<typeof MaterialIcons>["name"]; value: string; label: string; color?: string }) {
  return <View style={styles.statPill}><View style={[styles.statIcon, { backgroundColor: `${color}20` }]}><MaterialIcons name={icon} size={16} color={color} /></View><View><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View></View>;
}

export function ProgressDots({ total, active }: { total: number; active: number }) {
  return <View style={styles.dots}>{Array.from({ length: total }).map((_, index) => <View key={index} style={[styles.dot, index < active && styles.dotActive, index === active && styles.dotCurrent]} />)}</View>;
}

const styles = StyleSheet.create({
  orbLayer: { position: "absolute", top: -12, right: -14, width: 220, height: 190, opacity: 0.95 },
  orb: { position: "absolute", borderRadius: 100 },
  orbOne: { width: 130, height: 130, top: 5, right: 14, backgroundColor: "#5B41BE", opacity: 0.22, transform: [{ rotate: "18deg" }] },
  orbTwo: { width: 78, height: 78, top: 76, right: 108, backgroundColor: "#39D6A2", opacity: 0.15 },
  orbThree: { width: 42, height: 42, top: 24, right: 146, backgroundColor: "#F7C75E", opacity: 0.18 },
  floatingSymbol: { position: "absolute", color: "#C4B6FF", fontWeight: "900", textShadowColor: "#A78BFA", textShadowRadius: 14 },
  symbolOne: { top: 28, right: 64, fontSize: 42, transform: [{ rotate: "10deg" }] },
  symbolTwo: { top: 92, right: 36, fontSize: 22, color: "#F7C75E" },
  symbolThree: { top: 70, right: 138, fontSize: 18, color: "#39D6A2", transform: [{ rotate: "22deg" }] },
  symbolFour: { top: 120, right: 112, fontSize: 26, color: "#F47B95" },
  sectionHeading: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14 },
  eyebrow: { color: palette.purple, fontSize: 11, fontWeight: "800", letterSpacing: 1.4, textTransform: "uppercase", marginBottom: 5 },
  sectionTitle: { color: palette.text, fontSize: 21, fontWeight: "800", letterSpacing: -0.4 },
  textAction: { paddingVertical: 4, paddingLeft: 12 },
  textActionLabel: { color: palette.purple, fontSize: 12, fontWeight: "800" },
  primaryButton: { minHeight: 54, paddingHorizontal: 22, borderRadius: 18, backgroundColor: palette.purple, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10, shadowColor: palette.purple, shadowOpacity: 0.25, shadowRadius: 14, shadowOffset: { width: 0, height: 8 }, elevation: 6 },
  primaryLabel: { color: palette.bg, fontSize: 15, fontWeight: "900", letterSpacing: 0.4 },
  pressed: { transform: [{ scale: 0.97 }], opacity: 0.88 },
  glassCard: { borderRadius: 24, backgroundColor: palette.panel, borderWidth: 1, borderColor: palette.line, overflow: "hidden" },
  statPill: { flexDirection: "row", alignItems: "center", gap: 9, minWidth: 96 },
  statIcon: { width: 31, height: 31, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  statValue: { color: palette.text, fontSize: 16, fontWeight: "900" },
  statLabel: { color: palette.faint, fontSize: 10, fontWeight: "700", marginTop: 1 },
  dots: { flexDirection: "row", alignItems: "center", gap: 6 },
  dot: { width: 6, height: 6, borderRadius: 6, backgroundColor: palette.line },
  dotActive: { backgroundColor: palette.purple },
  dotCurrent: { width: 20, backgroundColor: palette.mint },
});
