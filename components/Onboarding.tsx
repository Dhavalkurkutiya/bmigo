import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
} from "react-native-reanimated";

interface OnboardingProps {
  onFinish: () => void;
}

const COLORS = {
  primary: "#00E68E",
  secondary: "#38bdf8",
  backgroundLight: "#ffffff",
  backgroundDark: "#151718",
  darkGrey: "#334155",
  slate100: "#f1f5f9",
  slate200: "#e2e8f0",
  slate300: "#cbd5e1",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate600: "#475569",
  slate700: "#334155",
  slate800: "#1e293b",
  slate900: "#0f172a",
  white: "#ffffff",
  slate50: "#f8fafc",
};

export default function Onboarding({ onFinish }: OnboardingProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      onFinish();
    }
  };

  const backgroundColor = isDark
    ? COLORS.backgroundDark
    : COLORS.backgroundLight;
  const textColor = isDark ? COLORS.white : COLORS.slate900;
  const subTextColor = isDark ? COLORS.slate400 : COLORS.slate500;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Background Grid Pattern (Simulated) */}
      <View style={styles.gridPattern} pointerEvents="none" />

      {/* Progress Bar (Only on Step 2 as per design, but good to have globally if needed) */}
      {step === 1 && (
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressFill, { width: "66.6%" }]} />
        </View>
      )}
      {step === 2 && (
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressFill, { width: "100%" }]} />
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoRow}>
          <View style={styles.logoIconContainer}>
            <MaterialIcons name="favorite" size={28} color={COLORS.primary} />
            <View
              style={[
                styles.logoDivider,
                {
                  backgroundColor: isDark
                    ? COLORS.backgroundDark
                    : COLORS.white,
                },
              ]}
            />
          </View>
          <Text style={[styles.headerTitle, { color: textColor }]}>
            BMI <Text style={{ color: COLORS.secondary }}>Go</Text>
          </Text>
        </View>
        <Text
          style={[
            styles.headerSubtitle,
            { color: isDark ? COLORS.slate400 : COLORS.darkGrey },
          ]}
        >
          ACCURACY & EMPATHY
        </Text>
      </View>

      {/* Content Area */}
      <View style={styles.content}>
        {step === 0 && (
          <Animated.View
            exiting={FadeOut}
            entering={FadeIn}
            style={styles.slideContainer}
          >
            {/* Illustration 1: Athlete Mode */}
            <View style={styles.illustrationContainer}>
              {/* Glow Effects */}
              <View
                style={[
                  styles.glowBlob,
                  {
                    backgroundColor: "rgba(0, 230, 142, 0.05)",
                    top: -16,
                    right: -16,
                  },
                ]}
              />
              <View
                style={[
                  styles.glowBlob,
                  {
                    backgroundColor: "rgba(56, 189, 248, 0.05)",
                    bottom: -32,
                    left: -32,
                    width: 128,
                    height: 128,
                  },
                ]}
              />

              {/* Card */}
              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: isDark ? COLORS.slate900 : COLORS.white,
                    borderColor: isDark ? COLORS.slate800 : COLORS.slate100,
                  },
                ]}
              >
                {/* Badge */}
                <View
                  style={[
                    styles.badge,
                    {
                      backgroundColor: isDark
                        ? "rgba(15, 23, 42, 0.8)"
                        : "rgba(255, 255, 255, 0.8)",
                      borderColor: isDark ? COLORS.slate700 : COLORS.slate200,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="verified"
                    size={14}
                    color={COLORS.primary}
                  />
                  <Text
                    style={[
                      styles.badgeText,
                      { color: isDark ? COLORS.slate300 : COLORS.slate600 },
                    ]}
                  >
                    ATHLETE MODE INCLUDED
                  </Text>
                </View>

                {/* Card Content */}
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.skeletonBlock,
                      {
                        width: 48,
                        height: 8,
                        backgroundColor: isDark
                          ? COLORS.slate800
                          : COLORS.slate100,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: "rgba(0, 230, 142, 0.2)" },
                    ]}
                  />
                </View>

                <View style={styles.cardBody}>
                  {/* Circle Graphic */}
                  <View style={styles.circleGraphic}>
                    <View
                      style={[
                        styles.circleBorder,
                        {
                          borderColor: isDark
                            ? COLORS.slate800
                            : COLORS.slate50,
                        },
                      ]}
                    />
                    <View style={[styles.circleProgress]} />
                    <MaterialIcons
                      name="fitness-center"
                      size={48}
                      color={COLORS.primary}
                    />
                  </View>
                  {/* Bar */}
                  <View
                    style={{
                      width: 96,
                      height: 8,
                      backgroundColor: "rgba(0, 230, 142, 0.1)",
                      borderRadius: 999,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        width: "66%",
                        height: "100%",
                        backgroundColor: COLORS.primary,
                      }}
                    />
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View
                    style={[
                      styles.footerBlock,
                      {
                        backgroundColor: isDark
                          ? COLORS.slate800
                          : COLORS.slate50,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.footerLine,
                        {
                          backgroundColor: isDark
                            ? COLORS.slate700
                            : COLORS.slate200,
                        },
                      ]}
                    />
                  </View>
                  <View
                    style={[
                      styles.footerBlock,
                      {
                        backgroundColor: isDark
                          ? COLORS.slate800
                          : COLORS.slate50,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.footerLine,
                        {
                          backgroundColor: isDark
                            ? COLORS.slate700
                            : COLORS.slate200,
                        },
                      ]}
                    />
                  </View>
                  <View
                    style={[
                      styles.footerBlock,
                      {
                        backgroundColor: "rgba(0, 230, 142, 0.1)",
                        borderColor: "rgba(0, 230, 142, 0.2)",
                        borderWidth: 1,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.footerLine,
                        { backgroundColor: COLORS.primary },
                      ]}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Text Content */}
            <View style={styles.textSection}>
              <Text style={[styles.title, { color: textColor }]}>
                Designed for{" "}
                <Text style={{ fontWeight: "700" }}>Your Body Type</Text>
              </Text>
              <Text style={[styles.description, { color: subTextColor }]}>
                Standard BMI often fails{" "}
                <Text
                  style={{ color: isDark ? COLORS.slate200 : COLORS.slate700 }}
                >
                  athletes and unique builds
                </Text>
                . Our smart algorithm adapts to your specific goals—whether it
                is tracking muscle gain or finding your healthy balance.
              </Text>
            </View>
          </Animated.View>
        )}

        {step === 1 && (
          <Animated.View
            exiting={FadeOut}
            entering={SlideInRight}
            style={styles.slideContainer}
          >
            {/* Illustration 2: Scientific Authority */}
            <View style={styles.illustrationContainer}>
              <View
                style={[
                  styles.glowBlob,
                  {
                    backgroundColor: "rgba(0, 230, 142, 0.1)",
                    top: -16,
                    right: -16,
                  },
                ]}
              />
              <View
                style={[
                  styles.glowBlob,
                  {
                    backgroundColor: "rgba(56, 189, 248, 0.1)",
                    bottom: -32,
                    left: -32,
                    width: 128,
                    height: 128,
                  },
                ]}
              />

              <View
                style={[
                  styles.card,
                  {
                    backgroundColor: isDark ? COLORS.slate900 : COLORS.white,
                    borderColor: isDark ? COLORS.slate800 : COLORS.slate100,
                    padding: 24,
                    justifyContent: "center",
                  },
                ]}
              >
                {/* Bars Chart */}
                <View style={styles.chartContainer}>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: 32,
                        backgroundColor: isDark
                          ? COLORS.slate800
                          : COLORS.slate100,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: 48,
                        backgroundColor: isDark
                          ? COLORS.slate800
                          : COLORS.slate100,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: 64,
                        backgroundColor: isDark
                          ? "rgba(0, 230, 142, 0.1)"
                          : "rgba(0, 230, 142, 0.2)",
                        position: "relative",
                      },
                    ]}
                  >
                    <View
                      style={{
                        position: "absolute",
                        top: -8,
                        left: "50%",
                        transform: [{ translateX: -10 }],
                      }}
                    >
                      <MaterialIcons
                        name="verified-user"
                        size={20}
                        color={COLORS.primary}
                      />
                    </View>
                  </View>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: 56,
                        backgroundColor: isDark
                          ? COLORS.slate800
                          : COLORS.slate100,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: 40,
                        backgroundColor: isDark
                          ? COLORS.slate800
                          : COLORS.slate100,
                      },
                    ]}
                  />
                </View>

                {/* Checkline */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 24,
                    gap: 4,
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      width: 12,
                      height: 32,
                      backgroundColor: isDark
                        ? COLORS.slate300
                        : COLORS.slate700,
                      borderRadius: 999,
                    }}
                  />
                  <View
                    style={{
                      width: 64,
                      height: 16,
                      backgroundColor: isDark
                        ? COLORS.slate700
                        : COLORS.slate200,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 24,
                        backgroundColor: COLORS.primary,
                        borderRadius: 2,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <MaterialIcons
                        name="check"
                        size={12}
                        color={COLORS.slate900}
                        style={{ fontWeight: "bold" }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      width: 12,
                      height: 32,
                      backgroundColor: isDark
                        ? COLORS.slate300
                        : COLORS.slate700,
                      borderRadius: 999,
                    }}
                  />
                </View>

                {/* Legend */}
                <View
                  style={{
                    flexDirection: "row",
                    gap: 16,
                    marginTop: 24,
                    justifyContent: "center",
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={[
                        styles.legendText,
                        { color: isDark ? COLORS.slate100 : COLORS.slate900 },
                      ]}
                    >
                      ATHLETE
                    </Text>
                    <View
                      style={{
                        width: 24,
                        height: 4,
                        backgroundColor: COLORS.primary,
                        borderRadius: 999,
                        marginTop: 4,
                      }}
                    />
                  </View>
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={[
                        styles.legendText,
                        { color: isDark ? COLORS.slate100 : COLORS.slate900 },
                      ]}
                    >
                      CHILD
                    </Text>
                    <View
                      style={{
                        width: 24,
                        height: 4,
                        backgroundColor: COLORS.secondary,
                        borderRadius: 999,
                        marginTop: 4,
                      }}
                    />
                  </View>
                </View>
              </View>
            </View>

            {/* Text Content With Indicators */}
            <View style={styles.textSection}>
              <View style={styles.stepIndicator}>
                <View
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor: isDark
                        ? COLORS.slate800
                        : COLORS.slate200,
                      width: 8,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.stepDot,
                    { backgroundColor: COLORS.primary, width: 32 },
                  ]}
                />
                <View
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor: isDark
                        ? COLORS.slate800
                        : COLORS.slate200,
                      width: 8,
                    },
                  ]}
                />
              </View>

              <Text style={[styles.title, { color: textColor }]}>
                Clinically{" "}
                <Text style={{ fontWeight: "700", fontStyle: "italic" }}>
                  Backed Accuracy
                </Text>
              </Text>
              <Text style={[styles.description, { color: subTextColor }]}>
                From professional athletes to growing teens, we use precise{" "}
                <Text
                  style={{ color: isDark ? COLORS.slate200 : COLORS.slate700 }}
                >
                  WHO-approved growth charts
                </Text>{" "}
                and the{" "}
                <Text
                  style={{ color: isDark ? COLORS.slate200 : COLORS.slate700 }}
                >
                  New BMI formula
                </Text>{" "}
                to ensure accuracy for every stage of life.
              </Text>

              <View style={styles.featuresRow}>
                <View style={styles.featureItem}>
                  <MaterialIcons
                    name="health-and-safety"
                    size={14}
                    color={subTextColor}
                  />
                  <Text style={[styles.featureText, { color: subTextColor }]}>
                    WHO VERIFIED FORMULA
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <MaterialIcons name="lock" size={14} color={subTextColor} />
                  <Text style={[styles.featureText, { color: subTextColor }]}>
                    PRIVACY ENCRYPTED
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View
            exiting={FadeOut}
            entering={SlideInRight}
            style={styles.slideContainer}
          >
            {/* Illustration 3: Health Without Judgment */}
            <View style={styles.illustrationContainer}>
              {/* Giant Heart Glow (Simulated) */}
              <View
                style={{
                  position: "absolute",
                  width: 220,
                  height: 220,
                  borderRadius: 999,
                  backgroundColor: "rgba(0, 230, 142, 0.1)",
                  shadowColor: COLORS.primary,
                  shadowOpacity: 0.5,
                  shadowRadius: 50,
                  elevation: 10,
                }}
              />

              <View
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                }}
              >
                <MaterialIcons
                  name="favorite"
                  size={180}
                  color={COLORS.primary}
                  style={{ opacity: 1 }}
                />

                {/* Scale Line inside Heart */}
                <View
                  style={{
                    position: "absolute",
                    width: 2,
                    height: 90,
                    backgroundColor: isDark
                      ? COLORS.backgroundDark
                      : COLORS.white,
                    borderRadius: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 8,
                      height: 2,
                      backgroundColor: isDark
                        ? "rgba(10, 17, 14, 0.6)"
                        : "rgba(255,255,255,0.6)",
                    }}
                  />
                  <View
                    style={{
                      width: 6,
                      height: 2,
                      backgroundColor: isDark
                        ? "rgba(10, 17, 14, 0.6)"
                        : "rgba(255,255,255,0.6)",
                    }}
                  />
                  <View
                    style={{
                      width: 8,
                      height: 2,
                      backgroundColor: isDark
                        ? "rgba(10, 17, 14, 0.6)"
                        : "rgba(255,255,255,0.6)",
                    }}
                  />
                </View>
              </View>
            </View>

            {/* Text Content */}
            <View style={styles.textSection}>
              <View style={styles.stepIndicator}>
                <View
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor: isDark
                        ? COLORS.slate800
                        : COLORS.slate200,
                      width: 8,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.stepDot,
                    {
                      backgroundColor: isDark
                        ? COLORS.slate800
                        : COLORS.slate200,
                      width: 8,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.stepDot,
                    { backgroundColor: COLORS.primary, width: 32 },
                  ]}
                />
              </View>

              <Text
                style={[
                  styles.title,
                  { color: textColor, textAlign: "center" },
                ]}
              >
                Health Without{"\n"}
                <Text style={{ fontWeight: "700" }}>Judgment</Text>
              </Text>
              <Text
                style={[
                  styles.description,
                  { color: subTextColor, textAlign: "center" },
                ]}
              >
                No body shaming, just smart insights. Get a clear view of your
                health with data-driven guidance designed to help you reach your
                ideal range safely and privately.
              </Text>

              <View style={[styles.featuresRow, { marginTop: 40 }]}>
                <View style={[styles.featureItem, { opacity: 0.8 }]}>
                  <MaterialIcons
                    name="lock"
                    size={16}
                    color={isDark ? COLORS.slate400 : COLORS.darkGrey}
                  />
                  <Text
                    style={[
                      styles.featureText,
                      {
                        color: isDark ? COLORS.slate400 : COLORS.darkGrey,
                        fontSize: 11,
                      },
                    ]}
                  >
                    SECURE & PRIVATE
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNext}
          activeOpacity={0.9}
        >
          <Text style={styles.nextButtonText}>
            {step === 2 ? "Start My Journey" : "Next"}
          </Text>
        </TouchableOpacity>

        {step < 2 ? (
          <TouchableOpacity onPress={onFinish} style={styles.skipButton}>
            <Text
              style={[
                styles.skipButtonText,
                { color: isDark ? COLORS.slate500 : COLORS.slate400 },
              ]}
            >
              Skip
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={{ height: 20 }} />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },
  gridPattern: {
    ...StyleSheet.absoluteFillObject,
    // Note: Actual grid pattern needs SVG or Image. Skipping for now as simple View.
    opacity: 0.05,
  },
  progressBarContainer: {
    height: 2,
    backgroundColor: "rgba(0,0,0,0.05)",
    width: "100%",
    position: "absolute",
    top: 0,
    zIndex: 50,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
  },
  header: {
    paddingTop: 60, // approximate status bar + padding
    paddingHorizontal: 32,
    alignItems: "center",
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoIconContainer: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logoDivider: {
    position: "absolute",
    height: "100%",
    width: 2,
    zIndex: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 10,
    marginTop: 4,
    letterSpacing: 2,
    fontWeight: "700", // "mono-tech" font replacement
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 32,
    paddingBottom: 24,
  },
  slideContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  illustrationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginTop: 20,
  },
  glowBlob: {
    position: "absolute",
    width: 96,
    height: 96,
    borderRadius: 999,
  },
  card: {
    width: "100%",
    maxWidth: 280,
    aspectRatio: 1,
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.15,
    shadowRadius: 30, // for illustration-shadow
    elevation: 5,
    flexDirection: "column",
    gap: 16,
  },
  badge: {
    position: "absolute",
    top: -16,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    zIndex: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  skeletonBlock: {
    borderRadius: 4,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 999,
  },
  cardBody: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  circleGraphic: {
    width: 128,
    height: 128,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  circleBorder: {
    position: "absolute",
    inset: 0,
    borderWidth: 6,
    borderRadius: 999,
  },
  circleProgress: {
    position: "absolute",
    inset: 0,
    borderWidth: 6,
    borderColor: COLORS.primary,
    borderRightColor: "transparent",
    borderBottomColor: "transparent",
    borderRadius: 999,
    transform: [{ rotate: "45deg" }],
  },
  cardFooter: {
    flexDirection: "row",
    gap: 8,
  },
  footerBlock: {
    flex: 1,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  footerLine: {
    width: 16,
    height: 4,
    borderRadius: 2,
  },
  textSection: {
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "300", // font-light
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginTop: 16,
    fontWeight: "300", // font-light
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 40,
    gap: 12,
  },
  nextButton: {
    width: "100%",
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    color: "#0c1d16",
    fontWeight: "600",
    fontSize: 16,
  },
  skipButton: {
    width: "100%",
    paddingVertical: 12,
    alignItems: "center",
  },
  skipButtonText: {
    fontWeight: "500",
    fontSize: 16,
  },
  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 80,
    paddingHorizontal: 16,
  },
  chartBar: {
    width: "18%", // approx
    borderRadius: 4,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  legendText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  stepIndicator: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 24,
  },
  stepDot: {
    height: 4,
    borderRadius: 999,
  },
  featuresRow: {
    flexDirection: "row",
    marginTop: 32,
    gap: 24,
    justifyContent: "center",
    flexWrap: "wrap",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    opacity: 0.6,
  },
  featureText: {
    fontSize: 10,
    fontWeight: "500", // medium
    letterSpacing: 1.5,
  },
});
