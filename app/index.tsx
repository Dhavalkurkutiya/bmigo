import Onboarding from "@/components/Onboarding";
import SplashScreen from "@/components/SplashScreen";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const COLORS = {
  primary: "#00ff9d",
  secondary: "#0ea5e9",
  backgroundLight: "#ffffff",
  backgroundDark: "#0f172a",
  textDark: "#0c1d16",
  textLight: "#ffffff",
  slate100: "#f1f5f9",
  slate800: "#1e293b",
};

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      // Minimum delay for splash animation
      const minDelay = new Promise((resolve) => setTimeout(resolve, 3000));
      const [storageStatus] = await Promise.all([
        AsyncStorage.getItem("hasOnboarded"),
        minDelay,
      ]);

      if (storageStatus === "true") {
        setShowOnboarding(false);
      } else {
        setShowOnboarding(true);
      }
      setShowSplash(false);
    };

    if (showSplash) {
      checkOnboarding();
    }
  }, [showSplash]);

  const handleReplay = async () => {
    // Reset for demo purposes
    await AsyncStorage.removeItem("hasOnboarded");
    setShowSplash(true);
    setShowOnboarding(false);
  };

  const handleOnboardingFinish = async () => {
    await AsyncStorage.setItem("hasOnboarded", "true");
    setShowOnboarding(false);
  };

  const ActionButton = ({
    title,
    icon,
    onPress,
    variant = "primary",
  }: {
    title: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    onPress: () => void;
    variant?: "primary" | "secondary";
  }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePressIn = () => {
      scale.value = withSpring(0.95);
    };

    const handlePressOut = () => {
      scale.value = withSpring(1);
    };

    const isPrimary = variant === "primary";
    const bg = isPrimary
      ? COLORS.primary
      : isDark
        ? "rgba(255,255,255,0.1)"
        : "rgba(0,0,0,0.05)";
    const textColor = isPrimary
      ? COLORS.textDark
      : isDark
        ? COLORS.textLight
        : COLORS.textDark;

    return (
      <Animated.View
        style={[animatedStyle, { width: "100%", marginBottom: 16 }]}
      >
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          style={[
            styles.actionButton,
            { backgroundColor: bg },
            !isPrimary && isDark && styles.glassButton,
          ]}
        >
          <MaterialIcons
            name={icon}
            size={24}
            color={textColor}
            style={{ marginRight: 12 }}
          />
          <Text style={[styles.actionButtonText, { color: textColor }]}>
            {title}
          </Text>
          <MaterialIcons
            name="chevron-right"
            size={24}
            color={textColor}
            style={{ marginLeft: "auto", opacity: 0.6 }}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (showOnboarding) {
    return <Onboarding onFinish={handleOnboardingFinish} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <LinearGradient
        colors={isDark ? ["#0f172a", "#1e293b"] : ["#ffffff", "#f8fafc"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Background decoration */}
      <View style={styles.decorationCircle} />

      <View style={styles.content}>
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          style={styles.header}
        >
          <View style={styles.logoContainer}>
            <MaterialIcons name="favorite" size={48} color={COLORS.primary} />
            <View style={styles.logoBadge}>
              <Text style={styles.logoBadgeText}>PRO</Text>
            </View>
          </View>
          <Text
            style={[
              styles.title,
              { color: isDark ? COLORS.textLight : COLORS.textDark },
            ]}
          >
            BMI Go
          </Text>
          <Text
            style={[styles.subtitle, { color: isDark ? "#94a3b8" : "#64748b" }]}
          >
            Accuracy & Empathy
          </Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(500).springify()}
          style={styles.cardContainer}
        >
          <BlurView
            intensity={isDark ? 20 : 40}
            tint={isDark ? "dark" : "light"}
            style={styles.statsCard}
          >
            <View style={styles.statItem}>
              <Text
                style={[
                  styles.statValue,
                  { color: isDark ? COLORS.textLight : COLORS.textDark },
                ]}
              >
                --
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: isDark ? "#94a3b8" : "#64748b" },
                ]}
              >
                BMI
              </Text>
            </View>
            <View
              style={[
                styles.verticalDivider,
                {
                  backgroundColor: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                },
              ]}
            />
            <View style={styles.statItem}>
              <Text
                style={[
                  styles.statValue,
                  { color: isDark ? COLORS.textLight : COLORS.textDark },
                ]}
              >
                --
              </Text>
              <Text
                style={[
                  styles.statLabel,
                  { color: isDark ? "#94a3b8" : "#64748b" },
                ]}
              >
                Weight
              </Text>
            </View>
          </BlurView>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(700).springify()}
          style={styles.actions}
        >
          <ActionButton
            title="Calculate New BMI"
            icon="calculate"
            onPress={() => {}}
          />
          <ActionButton
            title="History"
            icon="history"
            onPress={() => {}}
            variant="secondary"
          />
          <ActionButton
            title="Replay Intro"
            icon="replay"
            onPress={handleReplay}
            variant="secondary"
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  decorationCircle: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: "rgba(0, 255, 157, 0.05)",
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(0, 255, 157, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    position: "relative",
  },
  logoBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: COLORS.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  logoBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#fff",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    marginTop: 8,
    letterSpacing: 0.5,
  },
  cardContainer: {
    marginBottom: 48,
  },
  statsCard: {
    flexDirection: "row",
    borderRadius: 24,
    padding: 24,
    overflow: "hidden",
    backgroundColor:
      Platform.OS === "android" ? "rgba(255,255,255,0.05)" : undefined,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  verticalDivider: {
    width: 1,
    height: "100%",
  },
  actions: {
    width: "100%",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    width: "100%",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  glassButton: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
});
