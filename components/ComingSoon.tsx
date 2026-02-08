import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React, { useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export default function ComingSoon() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 1000 }),
        withTiming(1, { duration: 1000 }),
      ),
      -1,
      true,
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
    opacity: 1.5 - pulseAnim.value * 0.5,
  }));

  const themeColors = {
    textPrimary: isDark ? "#ffffff" : "#0f172a",
    textSecondary: isDark ? "#94a3b8" : "#64748b",
    cardBg: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.6)",
    border: isDark ? "#2a3c34" : "#f1f5f9",
    accent: "#00FF8C",
    secondaryAccent: "#0ea5e9",
    iconBg: isDark ? "#334155" : "#f1f5f9",
    iconColor: isDark ? "#cbd5e1" : "#475569",
    bgRocket: isDark ? "#1e293b" : "#ffffff",
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.heroSection}>
        <View style={styles.rocketContainer}>
          <Animated.View
            style={[
              styles.pulseCircle,
              animatedStyle,
              { borderColor: "rgba(14, 165, 233, 0.2)" },
            ]}
          />
          <View
            style={[
              styles.iconWrapper,
              {
                shadowColor: themeColors.accent,
                backgroundColor: themeColors.bgRocket,
              },
            ]}
          >
            <MaterialIcons
              name="rocket-launch"
              size={64}
              color={themeColors.accent}
            />
          </View>
        </View>

        <View style={styles.titleContainer}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>
            BMI <Text style={{ color: themeColors.secondaryAccent }}>Go</Text>
          </Text>
          <Text style={styles.subtitle}>ACCURACY & EMPATHY</Text>
        </View>
      </View>

      <View style={styles.featuresContainer}>
        <Text
          style={[styles.featuresTitle, { color: themeColors.textPrimary }]}
        >
          Exciting Features on the Way
        </Text>

        <BlurView
          intensity={20}
          tint={isDark ? "dark" : "light"}
          style={[styles.featureCard, { borderColor: themeColors.border }]}
        >
          <View
            style={[
              styles.featureIconBox,
              { backgroundColor: "rgba(0, 255, 140, 0.1)" },
            ]}
          >
            <MaterialIcons
              name="restaurant-menu"
              size={24}
              color={themeColors.accent}
            />
          </View>
          <View style={styles.featureContent}>
            <View style={styles.featureHeader}>
              <Text
                style={[styles.featureName, { color: themeColors.textPrimary }]}
              >
                AI Meal Planner
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>SOON</Text>
              </View>
            </View>
            <Text
              style={[styles.featureDesc, { color: themeColors.textSecondary }]}
            >
              Customized nutrition for your BMI goals.
            </Text>
          </View>
        </BlurView>

        <BlurView
          intensity={20}
          tint={isDark ? "dark" : "light"}
          style={[styles.featureCard, { borderColor: themeColors.border }]}
        >
          <View
            style={[
              styles.featureIconBox,
              { backgroundColor: "rgba(14, 165, 233, 0.1)" },
            ]}
          >
            <MaterialIcons
              name="support-agent"
              size={24}
              color={themeColors.secondaryAccent}
            />
          </View>
          <View style={styles.featureContent}>
            <View style={styles.featureHeader}>
              <Text
                style={[styles.featureName, { color: themeColors.textPrimary }]}
              >
                Live Coach Support
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>BETA</Text>
              </View>
            </View>
            <Text
              style={[styles.featureDesc, { color: themeColors.textSecondary }]}
            >
              Direct chat with certified professionals.
            </Text>
          </View>
        </BlurView>

        <BlurView
          intensity={20}
          tint={isDark ? "dark" : "light"}
          style={[styles.featureCard, { borderColor: themeColors.border }]}
        >
          <View
            style={[
              styles.featureIconBox,
              { backgroundColor: themeColors.iconBg },
            ]}
          >
            <MaterialIcons
              name="speed"
              size={24}
              color={themeColors.iconColor}
            />
          </View>
          <View style={styles.featureContent}>
            <View style={styles.featureHeader}>
              <Text
                style={[styles.featureName, { color: themeColors.textPrimary }]}
              >
                Smart Wearable Sync
              </Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Q4</Text>
              </View>
            </View>
            <Text
              style={[styles.featureDesc, { color: themeColors.textSecondary }]}
            >
              Connect your favorite fitness devices.
            </Text>
          </View>
        </BlurView>
      </View>

      <TouchableOpacity
        style={[styles.notifyButton, { shadowColor: themeColors.accent }]}
      >
        <Text style={styles.notifyButtonText}>Notify Me</Text>
        <MaterialIcons name="notifications-active" size={20} color="#0f172a" />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  heroSection: {
    alignItems: "center",
    marginBottom: 40,
    width: "100%",
  },
  rocketContainer: {
    width: 128,
    height: 128,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    position: "relative",
  },
  pulseCircle: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 64,
    borderWidth: 2,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
    zIndex: 10,
  },
  titleContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    letterSpacing: -1,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 3,
    color: "#94a3b8",
    textTransform: "uppercase",
    marginTop: 8,
  },
  featuresContainer: {
    width: "100%",
    maxWidth: 380,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 24,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    overflow: "hidden",
  },
  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 2,
  },
  featureName: {
    fontSize: 16,
    fontWeight: "700",
  },
  badge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  featureDesc: {
    fontSize: 12,
  },
  notifyButton: {
    width: "100%",
    maxWidth: 380,
    height: 56,
    backgroundColor: "#00FF8C",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 32,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  notifyButtonText: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "800",
  },
});
