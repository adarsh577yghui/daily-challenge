import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs } from "expo-router";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const INK = "#F8F7FF";
const MUTED = "#77768E";
const ACCENT = "#A78BFA";
const BG = "#0C0B18";

function TabIcon({ name, color, focused }: { name: React.ComponentProps<typeof MaterialIcons>["name"]; color: string; focused: boolean }) {
  return <MaterialIcons name={name} size={focused ? 24 : 22} color={color} />;
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 10 : Math.max(10, insets.bottom);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ACCENT,
        tabBarInactiveTintColor: MUTED,
        tabBarStyle: { height: 64 + bottomPadding, paddingBottom: bottomPadding, paddingTop: 8, backgroundColor: BG, borderTopColor: "#24223A", borderTopWidth: 1 },
        tabBarLabelStyle: { fontSize: 10, fontWeight: "700" },
      }}
    >
      <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, focused }) => <TabIcon name="home" color={focused ? INK : color} focused={focused} /> }} />
      <Tabs.Screen name="play" options={{ title: "Play", tabBarIcon: ({ color, focused }) => <TabIcon name="play-arrow" color={focused ? INK : color} focused={focused} /> }} />
      <Tabs.Screen name="leaderboard" options={{ title: "Ranks", tabBarIcon: ({ color, focused }) => <TabIcon name="leaderboard" color={focused ? INK : color} focused={focused} /> }} />
      <Tabs.Screen name="achievements" options={{ title: "Badges", tabBarIcon: ({ color, focused }) => <TabIcon name="military-tech" color={focused ? INK : color} focused={focused} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color, focused }) => <TabIcon name="person" color={focused ? INK : color} focused={focused} /> }} />
    </Tabs>
  );
}
