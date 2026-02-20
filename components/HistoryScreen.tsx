import { useHistory } from "@/hooks/useHistory";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
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
  Text as SvgText,
} from "react-native-svg";

export default function HistoryScreen({ onBack }: { onBack?: () => void }) {
  const { history, getRecentTrends } = useHistory();

  // Pagination State
  const [page, setPage] = React.useState(1);
  const [isLoadingMore, setIsLoadingMore] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearching, setIsSearching] = React.useState(false);
  const ITEMS_PER_PAGE = 20;

  const displayedHistory = React.useMemo(() => {
    let filtered = history;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = history.filter(
        (item) =>
          item.date.includes(query) ||
          item.bmi.toString().includes(query) ||
          item.status.toLowerCase().includes(query),
      );
    }
    return filtered.slice(0, page * ITEMS_PER_PAGE);
  }, [history, page, searchQuery]);

  const handleLoadMore = () => {
    // If searching, show all results (or handle pagination for search results if desired, effectively infinite scroll on filtered list)
    const totalFilteredLength = searchQuery.trim()
      ? history.filter((item) => {
          const query = searchQuery.toLowerCase();
          return (
            item.date.includes(query) ||
            item.bmi.toString().includes(query) ||
            item.status.toLowerCase().includes(query)
          );
        }).length
      : history.length;

    if (isLoadingMore || displayedHistory.length >= totalFilteredLength) return;

    setIsLoadingMore(true);
    // Simulate network delay
    setTimeout(() => {
      setPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 500); // 0.5s delay
  };

  // Reset pagination when history changes or search query changes
  React.useEffect(() => {
    setPage(1);
  }, [history.length, searchQuery]);
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
            // borderBottomColor: themeColors.cardBorder, // Removed per request
          },
        ]}
      >
        {isSearching ? (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              marginLeft: 16,
              backgroundColor: themeColors.cardBg,
              borderRadius: 8,
              paddingHorizontal: 8,
            }}
          >
            <TextInput
              style={{ flex: 1, height: 40, color: themeColors.textPrimary }}
              placeholder="Search date, bmi..."
              placeholderTextColor={themeColors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => {
                setIsSearching(false);
                setSearchQuery("");
              }}
            >
              <MaterialIcons
                name="close"
                size={20}
                color={themeColors.textSecondary}
              />
            </TouchableOpacity>
          </View>
        ) : (
          <>
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
            <Text
              style={[styles.headerTitle, { color: themeColors.textPrimary }]}
            >
              History
            </Text>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setIsSearching(true)}
            >
              <MaterialIcons
                name="search"
                size={24}
                color={themeColors.textSecondary}
              />
            </TouchableOpacity>
          </>
        )}
        {/* Developer Test Button */}
      </View>

      <FlatList
        style={{ flex: 1 }}
        data={displayedHistory}
        extraData={[trends, isLoadingMore]}
        keyExtractor={(item) => item.id}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isLoadingMore ? (
            <View style={{ paddingVertical: 20 }}>
              <ActivityIndicator
                size="small"
                color={themeColors.textSecondary}
              />
            </View>
          ) : (
            <View style={{ height: 20 }} />
          )
        }
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
            {/* BMI Trend Analysis Graph Card */}
            <View
              style={[
                styles.graphCard,
                { backgroundColor: themeColors.graphCardBg },
              ]}
            >
              <View style={styles.graphHeader}>
                <View>
                  <Text
                    style={[
                      styles.graphTitle,
                      { color: themeColors.textSecondary },
                    ]}
                  >
                    BMI TREND ANALYSIS
                  </Text>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "baseline",
                      gap: 8,
                    }}
                  >
                    <Text
                      style={[
                        styles.graphBigValue,
                        { color: themeColors.textPrimary },
                      ]}
                    >
                      {trends.avgBmi > 0 ? trends.avgBmi : "--"}
                    </Text>
                    <Text
                      style={[
                        styles.graphChangeText,
                        { color: themeColors.primary },
                      ]}
                    >
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
                    height: 200, // Increased height for labels
                    width: Math.max(
                      Dimensions.get("window").width - 80,
                      history.length * 60 + 40, // Match widthStep (60) + padding
                    ),
                  }}
                >
                  {/* Grid Lines */}
                  <View style={styles.gridContainer}>
                    {[1, 2, 3, 4].map((i) => (
                      <View
                        key={i}
                        style={[
                          styles.gridLine,
                          { borderColor: themeColors.textPrimary },
                        ]}
                      />
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
                      {/* Smooth Path Logic */}
                      {(() => {
                        // Limit graph points for performance if history is huge
                        const graphData = history.slice(0, 50).reverse(); // Show last 50 points

                        // Ensure range includes standard reference points
                        const maxBMI = Math.max(
                          ...graphData.map((h) => h.bmi),
                          30,
                        );
                        const minBMI = Math.min(
                          ...graphData.map((h) => h.bmi),
                          15,
                        );
                        const range = maxBMI - minBMI || 1;
                        const height = 140; // available svg height for line
                        const widthStep = 60;
                        const startX = 10;

                        // Calculate Y for a given BMI
                        const getY = (bmi: number) =>
                          height - ((bmi - minBMI) / range) * height;

                        // Calculate points
                        const points = graphData.map((h, i) => ({
                          x: startX + i * widthStep,
                          y: getY(h.bmi),
                          date: new Date(h.date),
                          bmi: h.bmi,
                        }));

                        // Generate Smooth Path (Catmull-Rom or simple Bezier)
                        // Simplified smoothing: control points based on previous and next points
                        const line = (pointA: any, pointB: any) => {
                          const lengthX = pointB.x - pointA.x;
                          const lengthY = pointB.y - pointA.y;
                          return {
                            length: Math.sqrt(
                              Math.pow(lengthX, 2) + Math.pow(lengthY, 2),
                            ),
                            angle: Math.atan2(lengthY, lengthX),
                          };
                        };

                        const controlPoint = (
                          current: any,
                          previous: any,
                          next: any,
                          reverse?: boolean,
                        ) => {
                          const p = previous || current;
                          const n = next || current;
                          const smoothing = 0.2;
                          const o = line(p, n);
                          const angle = o.angle + (reverse ? Math.PI : 0);
                          const length = o.length * smoothing;
                          const x = current.x + Math.cos(angle) * length;
                          const y = current.y + Math.sin(angle) * length;
                          return { x, y };
                        };

                        const bezierCommand = (
                          point: any,
                          i: number,
                          a: any[],
                        ) => {
                          const cps = controlPoint(a[i - 1], a[i - 2], point);
                          const cpe = controlPoint(
                            point,
                            a[i - 1],
                            a[i + 1],
                            true,
                          );
                          return `C ${cps.x},${cps.y} ${cpe.x},${cpe.y} ${point.x},${point.y}`;
                        };

                        let d = `M ${points[0].x} ${points[0].y}`;
                        for (let i = 1; i < points.length; i++) {
                          d += " " + bezierCommand(points[i], i, points);
                        }

                        return (
                          <>
                            <Path
                              d={d}
                              stroke="url(#lineGradient)"
                              strokeWidth={3}
                              fill="none"
                            />
                            {points.map((p, i) => (
                              <React.Fragment key={i}>
                                <Circle
                                  cx={p.x}
                                  cy={p.y}
                                  r={4}
                                  fill={themeColors.primary}
                                />
                                {/* BMI Value Label */}
                                <SvgText
                                  x={p.x}
                                  y={p.y - 12}
                                  fill={themeColors.textPrimary}
                                  fontSize="10"
                                  fontWeight="bold"
                                  textAnchor="middle"
                                >
                                  {p.bmi.toFixed(1)}
                                </SvgText>
                                {/* Month Label (show only if different month/year or first) */}
                                {(i === 0 ||
                                  p.date.getMonth() !==
                                    points[i - 1].date.getMonth() ||
                                  p.date.getFullYear() !==
                                    points[i - 1].date.getFullYear()) && (
                                  <SvgText
                                    x={p.x}
                                    y={height + 25}
                                    fill="#94a3b8"
                                    fontSize="10"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                  >
                                    {p.date.toLocaleDateString("en-US", {
                                      month: "short",
                                      year: "2-digit",
                                    })}
                                  </SvgText>
                                )}
                              </React.Fragment>
                            ))}
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
            <View style={{ height: 20 }} />
          </>
        }
        renderItem={({ item, index }) => (
          <View style={styles.timelineItem}>
            {/* Continuous Line Segment */}
            <View
              style={[
                styles.timelineLineSegment,
                { backgroundColor: isDark ? "#2E3032" : "#f1f5f9" },
              ]}
            />

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
                <Text style={styles.timelineDate}>{formatDate(item.date)}</Text>
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
        )}
        ListEmptyComponent={
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
        }
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
    paddingBottom: 100, // Increased for bottom nav
  },
  graphCard: {
    // backgroundColor set dynamically now
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
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
    width: "100%",
  },
  timelineContainer: {
    paddingHorizontal: 8,
    // position: "relative", // Removed relative positioning as it's not needed for FlatList items
  },
  timelineLineSegment: {
    position: "absolute",
    left: 11, // Center of dot (24/2 = 12, -1 for line width)
    top: 0,
    bottom: 0,
    width: 2,
  },
  timelineItem: {
    paddingLeft: 32,
    marginBottom: 0,
    paddingBottom: 24,
    position: "relative",
  },
  timelineDotBg: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "transparent",
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
