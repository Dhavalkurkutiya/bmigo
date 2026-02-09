import { useHistory } from "@/hooks/useHistory";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";

export default function HistoryScreen({ onBack }: { onBack?: () => void }) {
  const { history, getRecentTrends } = useHistory();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const trends = getRecentTrends();

  // Helper to format date
  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const themeColors = {
    background: isDark ? "#151718" : "#f6f8f7", // Matches BMICalculator Background
    textPrimary: isDark ? "#ffffff" : "#0d1b16",
    textSecondary: isDark ? "#94a3b8" : "#64748b",
    cardBg: isDark ? "#202325" : "#ffffff",
    cardBorder: isDark ? "#2E3032" : "#f1f5f9",
    success: "#2bee9d", // Matches Primary
    warning: "#fbbf24",
    danger: "#ef4444",
    primary: "#2bee9d", // Changed from Neon Mint to standard Primary
    secondary: "#0ea5e9",
    graphCardBg: isDark ? "#202325" : "#ffffff", // Matches cardBg
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes("underweight")) return themeColors.warning; // or a specific blue if desired
    if (s.includes("normal")) return themeColors.success;
    if (s.includes("overweight")) return themeColors.warning;
    if (s.includes("obese")) return themeColors.danger;
    return themeColors.success; // Default fallback
  };
  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: themeColors.background,
            borderBottomColor: themeColors.cardBorder,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => (onBack ? onBack() : router.back())}
          style={styles.headerButton}
        >
          <MaterialIcons
            name="arrow-back-ios"
            size={20}
            color={themeColors.textSecondary}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>
          History
        </Text>
        <TouchableOpacity style={styles.headerButton}>
          <MaterialIcons
            name="search"
            size={24}
            color={themeColors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* BMI Trend Analysis Graph Card */}
        <View
          style={[
            styles.graphCard,
            { backgroundColor: themeColors.graphCardBg },
          ]}
        >
          <View style={styles.graphHeader}>
            <View>
              <Text style={styles.graphTitle}>BMI TREND ANALYSIS</Text>
              <View
                style={{ flexDirection: "row", alignItems: "baseline", gap: 8 }}
              >
                <Text style={styles.graphBigValue}>
                  {trends.avgBmi > 0 ? trends.avgBmi : "--"}
                </Text>
                <Text style={styles.graphChangeText}>
                  {trends.weightChange > 0 ? "+" : ""}
                  {trends.weightChange} avg
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 4 }}>
              <View
                style={[
                  styles.pulseDot,
                  { backgroundColor: themeColors.primary, opacity: 0.2 },
                ]}
              />
              <View
                style={[
                  styles.activeDot,
                  { backgroundColor: themeColors.primary },
                ]}
              />
            </View>
          </View>

          {/* Graph Container */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 24 }}
          >
            <View
              style={{
                height: 160,
                width: Math.max(
                  Dimensions.get("window").width - 80,
                  history.length * 60,
                ),
              }}
            >
              {/* Grid Lines */}
              <View style={styles.gridContainer}>
                {[1, 2, 3, 4].map((i) => (
                  <View key={i} style={styles.gridLine} />
                ))}
              </View>

              {history.length > 1 ? (
                <Svg style={StyleSheet.absoluteFill}>
                  <Defs>
                    <LinearGradient
                      id="lineGradient"
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <Stop
                        offset="0"
                        stopColor={themeColors.primary}
                        stopOpacity="0.8"
                      />
                      <Stop
                        offset="1"
                        stopColor={themeColors.primary}
                        stopOpacity="0.4"
                      />
                    </LinearGradient>
                  </Defs>
                  {/* Simple Path Logic: Normalize BMI to height */}
                  {(() => {
                    const maxBMI = Math.max(...history.map((h) => h.bmi), 30);
                    const minBMI = Math.min(...history.map((h) => h.bmi), 15);
                    const range = maxBMI - minBMI || 1;
                    const height = 120; // available svg height
                    const widthStep = 60;

                    let d = `M 10 ${height - ((history[0].bmi - minBMI) / range) * height}`;
                    history.forEach((h, i) => {
                      if (i === 0) return;
                      const x = 10 + i * widthStep;
                      const y = height - ((h.bmi - minBMI) / range) * height;
                      d += ` L ${x} ${y}`;
                    });

                    return (
                      <>
                        <Path
                          d={d}
                          stroke="url(#lineGradient)"
                          strokeWidth={3}
                          fill="none"
                        />
                        {history.map((h, i) => {
                          const x = 10 + i * widthStep;
                          const y =
                            height - ((h.bmi - minBMI) / range) * height;
                          return (
                            <Circle
                              key={h.id}
                              cx={x}
                              cy={y}
                              r={4}
                              fill={themeColors.primary}
                            />
                          );
                        })}
                      </>
                    );
                  })()}
                </Svg>
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#64748b", fontSize: 12 }}>
                    Add more records to see trend
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>
        </View>

        {/* Timeline History List */}
        <View style={styles.timelineContainer}>
          <View
            style={[
              styles.timelineLine,
              { backgroundColor: isDark ? "#2E3032" : "#f1f5f9" },
            ]}
          />

          {history.map((item, index) => (
            <View key={item.id} style={styles.timelineItem}>
              <View
                style={[
                  styles.timelineDotBg,
                  { backgroundColor: themeColors.cardBg },
                ]}
              >
                <View
                  style={[
                    styles.timelineDot,
                    {
                      backgroundColor:
                        index === 0
                          ? themeColors.primary
                          : isDark
                            ? "#2E3032"
                            : "#e2e8f0",
                      borderColor: themeColors.cardBg,
                    },
                  ]}
                />
              </View>

              <View style={styles.timelineContent}>
                <View>
                  <Text style={styles.timelineDate}>
                    {formatDate(item.date)}
                  </Text>
                  <Text
                    style={[
                      styles.timelineBmi,
                      { color: themeColors.textPrimary },
                    ]}
                  >
                    {item.bmi.toFixed(1)} BMI
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text
                    style={[
                      styles.timelineWeight,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    {item.weight} kg
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) + "20" },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        { color: getStatusColor(item.status) },
                      ]}
                    >
                      {item.status || "Normal"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {history.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialIcons
              name="history"
              size={64}
              color={themeColors.textSecondary}
              style={{ opacity: 0.2 }}
            />
            <Text
              style={[
                styles.emptyStateText,
                { color: themeColors.textSecondary },
              ]}
            >
              No history yet. Calculate your BMI first!
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Decorative Bottom Bar */}
      <View
        style={[
          styles.bottomIndicator,
          { backgroundColor: isDark ? "#2E3032" : "#e2e8f0" },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "android" ? 40 : 60,
    paddingBottom: 16,
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerButton: {
    padding: 8,
  },
  contentContainer: {
    paddingTop: 120, // Space for fixed header
    paddingHorizontal: 24,
    paddingBottom: 32, // Space for bottom nav removed, now full screen
  },
  graphCard: {
    // backgroundColor set dynamically now
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 5,
  },
  graphHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  graphTitle: {
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  graphBigValue: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
  },
  graphChangeText: {
    color: "#00FF8C",
    fontSize: 12,
    fontWeight: "bold",
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  gridContainer: {
    position: "absolute",
    inset: 0,
    justifyContent: "space-between",
    paddingVertical: 10,
    opacity: 0.1,
  },
  gridLine: {
    borderTopWidth: 1,
    borderColor: "#fff",
    width: "100%",
  },
  timelineContainer: {
    paddingHorizontal: 8,
    position: "relative",
  },
  timelineLine: {
    position: "absolute",
    left: 27, // Center of dot (19px left + center)
    top: 0,
    bottom: 0,
    width: 2,
  },
  timelineItem: {
    paddingLeft: 40,
    marginBottom: 32,
    position: "relative",
  },
  timelineDotBg: {
    position: "absolute",
    left: 0,
    top: 2,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "transparent", // Fixed border color issue
  },
  timelineContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timelineDate: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  timelineBmi: {
    fontSize: 16,
    fontWeight: "bold",
  },
  timelineWeight: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 2,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: "bold",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 48,
    gap: 16,
  },
  emptyStateText: {
    fontSize: 15,
    fontWeight: "500",
  },
  bottomIndicator: {
    position: "absolute",
    bottom: 8,
    left: "50%",
    marginLeft: -64, // Half of width (128/2)
    width: 128,
    height: 5,
    borderRadius: 2.5,
    zIndex: 110,
  },
});
