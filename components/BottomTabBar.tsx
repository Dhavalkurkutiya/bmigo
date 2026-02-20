import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

type Tab = "home" | "stats" | "hub";

interface BottomTabBarProps {
  currentTab: Tab;
  onTabPress: (tab: Tab) => void;
}

const PRIMARY = "#00ff9d";
const INACTIVE = "#cbd5e1"; // slate-300

export default function BottomTabBar({
  currentTab,
  onTabPress,
}: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Dynamic Colors
  const activeColor = PRIMARY;
  const inactiveColor = isDark ? "#94a3b8" : INACTIVE;
  const bgColor = isDark ? "rgba(21, 23, 24, 0.9)" : "rgba(255, 255, 255, 0.9)";
  const borderColor = isDark ? "#2E3032" : "#f1f5f9";

  const renderTab = (tab: Tab, label: string, iconName: any) => {
    const isActive = currentTab === tab;
    const color = isActive ? activeColor : inactiveColor;

    return (
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onTabPress(tab)}
        activeOpacity={0.7}
      >
        <MaterialIcons name={iconName} size={28} color={color} />
        <Text style={[styles.tabLabel, { color }]}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.containerWrapper}>
      <BlurView
        intensity={isDark ? 50 : 80}
        tint={isDark ? "dark" : "light"}
        style={[styles.blurContainer, { borderTopColor: borderColor }]}
      >
        <View style={[styles.container, { backgroundColor: bgColor }]}>
          {renderTab("home", "HOME", "home")}
          {renderTab("stats", "STATS", "show-chart")}
          {renderTab("hub", "HUB", "person")}
        </View>
      </BlurView>
      {/* Home Indicator line for iPhone */}
      {Platform.OS === "ios" && <View style={styles.homeIndicator} />}
    </View>
  );
}

const styles = StyleSheet.create({
  containerWrapper: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    zIndex: 100,
  },
  blurContainer: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9", // slate-100
  },
  container: {
    flexDirection: "row",
    height: 80,
    justifyContent: "space-around",
    alignItems: "center",
    paddingBottom: 20, // Padding for safe area / aesthetic
    paddingTop: 10,
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Fallback if blur fails or adds to it
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    minWidth: 60,
  },
  tabLabel: {
    fontSize: 9,
    fontWeight: "800", // font-black / bold
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  homeIndicator: {
    position: "absolute",
    bottom: 8,
    alignSelf: "center",
    width: 130, // w-32 = 128px
    height: 5,
    borderRadius: 100,
    backgroundColor: "#e2e8f0", // slate-200
  },
});
