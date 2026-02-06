import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface SplashScreenProps {
  onFinish?: () => void;
}

// Updated Design Tokens from User Request
const COLORS = {
  primary: "#00ff9d",
  secondary: "#0ea5e9", // More vibrant sky blue
  backgroundLight: "#ffffff",
  backgroundDark: "#0f172a", // Updated dark background
  textDark: "#0c1d16", // Kept for light mode text
  textLight: "#ffffff",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate900: "#0f172a", // Dark slate for light mode title
};

const { width } = Dimensions.get("window");
// Calculate a scale factor based on a standard mobile width (e.g., 375px)
// We want it to be "smaller", so we might reduce the base scale further.
const scaleFactor = Math.min(width / 375, 1) * 0.8; // Added 0.8 multiplier to make it visually smaller

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(1);
  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);
  const textOpacity = useSharedValue(0);

  useEffect(() => {
    // Pulse Animation (Subtle rotation for the arcs)
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.6, { duration: 1500 }),
        withTiming(0.3, { duration: 1500 }),
      ),
      -1,
      true,
    );

    // Entrance Animation
    logoOpacity.value = withTiming(1, { duration: 800 });
    logoScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.elastic(1),
    });

    textOpacity.value = withDelay(500, withTiming(1, { duration: 1000 }));
  }, [logoOpacity, logoScale, pulseOpacity, pulseScale, textOpacity]);

  const arc1Style = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value * 1.5 }, { rotate: "-15deg" }],
    opacity: 0.2, // Base opacity from design
  }));

  const arc2Style = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value * 1.25 }, { rotate: "12deg" }],
    opacity: 0.4, // Base opacity from design
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [
      { translateY: interpolate(textOpacity.value, [0, 1], [20, 0]) },
    ],
  }));

  const backgroundColor = isDark
    ? COLORS.backgroundDark
    : COLORS.backgroundLight;

  const titleColor = isDark ? COLORS.textLight : COLORS.slate900;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* iOS Status Bar Placeholder Removed as per previous instructions */}

      {/* Main Content */}
      <View style={styles.content}>
        {/* Logo Section */}
        <Animated.View style={styles.logoContainer}>
          {/* Progress Arc 1: opacity-20 scale-150 blur-[1px] (Blur not easily supported in RN standard View without Skia, simulating via opacity/layers or just distinct lines) */}
          <Animated.View style={[styles.progressArc, styles.arc1, arc1Style]} />

          {/* Progress Arc 2: opacity-40 scale-125 rotate-12 */}
          <Animated.View style={[styles.progressArc, styles.arc2, arc2Style]} />

          {/* Decorative Dot: -right-4 -top-4 w-4 h-4 */}
          <View style={styles.decorativeDotTop} />

          {/* Logo Composition */}
          <Animated.View style={[styles.logoComposition, logoStyle]}>
            <View style={styles.logoGlow} />

            <MaterialIcons
              name="favorite"
              size={120}
              color={COLORS.primary}
              style={styles.heartIcon}
            />

            {/* Minimalist Scale Mark */}
            <View style={styles.scaleMark} />

            {/* Dots */}
            <View style={styles.dotsContainer}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </Animated.View>
        </Animated.View>

        {/* Text Section */}
        <Animated.View style={[styles.textContainer, textStyle]}>
          <Text style={[styles.title, { color: titleColor }]}>
            BMI{" "}
            <Text style={[styles.titleGo, { color: COLORS.secondary }]}>
              Go
            </Text>
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: isDark ? COLORS.slate500 : COLORS.slate400 },
            ]}
          >
            Accuracy & Empathy
          </Text>
        </Animated.View>

        {/* Safe Area Indicator */}
        <View style={styles.safeAreaContainer}>
          <View
            style={[
              styles.safeAreaIndicator,
              { backgroundColor: isDark ? "#1e293b" : "#e2e8f0" },
            ]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -20, // Slight visual adjustment
  },
  logoContainer: {
    width: 256 * scaleFactor, // w-64
    height: 256 * scaleFactor, // h-64
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  // Base style for the arcs
  progressArc: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 128 * scaleFactor, // 50% of 256
    borderWidth: 2,
    borderTopColor: COLORS.primary,
    borderRightColor: COLORS.secondary,
    borderBottomColor: "transparent",
    borderLeftColor: "transparent",
  },
  arc1: {
    // scale 1.5 handled in animated style
  },
  arc2: {
    // scale 1.25 handled in animated style
  },
  decorativeDotTop: {
    position: "absolute",
    right: -16 * scaleFactor,
    top: -16 * scaleFactor,
    width: 16 * scaleFactor,
    height: 16 * scaleFactor,
    borderRadius: 8 * scaleFactor,
    backgroundColor: "rgba(14, 165, 233, 0.3)", // secondary/30
  },
  logoComposition: {
    width: 160 * scaleFactor, // w-40
    height: 160 * scaleFactor, // h-40
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    // translate-x-2 -translate-y-2
    transform: [
      { translateX: 8 * scaleFactor },
      { translateY: -8 * scaleFactor },
    ],
  },
  logoGlow: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 80 * scaleFactor,
    backgroundColor: "rgba(0, 255, 157, 0.05)", // primary/5
  },
  heartIcon: {
    // Size 120 handled in props
  },
  scaleMark: {
    width: 6 * scaleFactor, // w-1.5 (~6px)
    height: 56 * scaleFactor, // h-14 (56px)
    backgroundColor: COLORS.secondary,
    borderRadius: 999,
    position: "absolute",
    top: "50%",
    marginTop: -4 * scaleFactor, // -translate-y-1
    zIndex: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0.5, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  dotsContainer: {
    flexDirection: "row",
    gap: 8 * scaleFactor, // gap-2
    position: "absolute",
    bottom: 20 * scaleFactor,
    transform: [{ translateY: 36 * scaleFactor }], // translate-y-9
    zIndex: 20,
  },
  dot: {
    width: 6 * scaleFactor, // w-1.5
    height: 6 * scaleFactor, // h-1.5
    borderRadius: 3 * scaleFactor,
    backgroundColor: "rgba(14, 165, 233, 0.8)", // secondary/80
  },
  textContainer: {
    marginTop: 60 * scaleFactor, // approx pb-24 spacing logic
    alignItems: "center",
    zIndex: 20,
  },
  title: {
    fontSize: 42 * scaleFactor, // text-[42px]
    fontWeight: "800", // font-extrabold
    letterSpacing: -0.5 * scaleFactor, // tracking-tight
    textAlign: "center",
    lineHeight: 48 * scaleFactor, // Leading-none-ish accounting for font
  },
  titleGo: {
    fontSize: 48 * scaleFactor, // text-[48px]
    marginLeft: 4 * scaleFactor, // ml-1
  },
  subtitle: {
    fontSize: 12 * scaleFactor, // text-xs
    fontWeight: "600",
    marginTop: 16 * scaleFactor, // mt-4
    letterSpacing: 3 * scaleFactor, // tracking-[0.2em] ~ 3px approx
    textTransform: "uppercase",
  },
  safeAreaContainer: {
    position: "absolute",
    bottom: 8 * scaleFactor,
    width: "100%",
    alignItems: "center",
  },
  safeAreaIndicator: {
    width: 128 * scaleFactor, // w-32
    height: 4 * scaleFactor, // h-1
    borderRadius: 2 * scaleFactor, // rounded-full
  },
});
