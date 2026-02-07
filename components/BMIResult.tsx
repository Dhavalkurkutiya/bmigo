import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BMIInputData } from "./BMICalculator";

interface BMIResultProps {
  data: BMIInputData;
  onReset: () => void;
}

export default function BMIResult({ data, onReset }: BMIResultProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const themeColors = {
    background: isDark ? "#0d1b16" : "#fff",
    cardBg: isDark ? "#162621" : "#fff",
    textPrimary: isDark ? "#ffffff" : "#0d1b16",
    textSecondary: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "#2a3c34" : "#f1f5f9",
    iconBg: isDark ? "#2a3c34" : "#fff",
  };
  // Simple BMI Logic
  const heightM = data.height / 100;
  const bmi = data.weight / (heightM * heightM);
  const bmiFormatted = bmi.toFixed(1);

  // Status Logic
  let status = "Normal";
  let color = "#2bee9d"; // Primary Green

  // Thresholds based on Indian Mode or Standard
  const isIndian = data.isIndianMode;

  if (isIndian) {
    if (bmi < 18.5) {
      status = "Underweight";
      color = "#60a5fa";
    } else if (bmi < 23) {
      status = "Normal";
      color = "#2bee9d";
    } else if (bmi < 25) {
      status = "Overweight";
      color = "#fbbf24";
    } else if (bmi < 30) {
      status = "Obese I";
      color = "#f97316";
    } else {
      status = "Obese II";
      color = "#ef4444";
    }
  } else {
    if (bmi < 18.5) {
      status = "Underweight";
      color = "#60a5fa";
    } else if (bmi < 25) {
      status = "Normal";
      color = "#2bee9d";
    } else if (bmi < 30) {
      status = "Overweight";
      color = "#fbbf24";
    } else {
      status = "Obese";
      color = "#ef4444";
    }
  }

  // Ideal weight
  const idealMin = 18.5 * heightM * heightM;
  const idealMax = (isIndian ? 22.9 : 24.9) * heightM * heightM;
  const idealWeight = ((idealMin + idealMax) / 2).toFixed(1);

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onReset}>
          <MaterialIcons
            name="arrow-back-ios"
            size={20}
            color={themeColors.textPrimary}
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: themeColors.textPrimary }]}>
          Results
        </Text>
        <TouchableOpacity>
          <MaterialIcons
            name="share"
            size={20}
            color={themeColors.textPrimary}
          />
        </TouchableOpacity>
      </View>

      {data.isIndianMode && (
        <View style={styles.badgeContainer}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>ICMR 2020 STANDARDS</Text>
          </View>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.content}>
        {/* Muscle Profile / Athlete Mode Banner */}
        {data.isAthleteMode && (
          <View style={styles.banner}>
            <View style={styles.bannerIcon}>
              <MaterialIcons name="fitness-center" size={24} color="#fff" />
            </View>
            <View>
              <Text style={styles.bannerTitle}>Healthy Muscle Profile</Text>
              <Text style={styles.bannerDesc}>
                Athlete Mode active: Results adjusted for high lean mass
                density.
              </Text>
            </View>
          </View>
        )}

        <View style={styles.grid}>
          {/* Gauge Placeholder */}
          <View
            style={[
              styles.cardCenter,
              {
                backgroundColor: themeColors.cardBg,
                borderColor: themeColors.border,
              },
            ]}
          >
            {/* SVG Gauge would go here, simplified for now */}
            <View style={[styles.gaugeCircle, { borderColor: color }]}>
              <Text
                style={[styles.scoreText, { color: themeColors.textPrimary }]}
              >
                {bmiFormatted}
              </Text>
            </View>
            <Text style={[styles.statusText, { color }]}>{status} Range</Text>
          </View>

          {/* Ideal Weight */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: themeColors.cardBg,
                borderColor: themeColors.border,
              },
            ]}
          >
            <Text style={styles.label}>IDEAL WEIGHT</Text>
            <View style={styles.rowBaseline}>
              <Text
                style={[styles.valueText, { color: themeColors.textPrimary }]}
              >
                {idealWeight}
              </Text>
              <Text style={[styles.unit, { fontSize: 12 }]}>kg</Text>
            </View>
            <View style={styles.diffRow}>
              <MaterialIcons
                name={
                  data.weight > Number(idealWeight)
                    ? "trending-down"
                    : "trending-up"
                }
                size={16}
                color="#2bee9d"
              />
              <Text style={styles.diffText}>
                {Math.abs(data.weight - Number(idealWeight)).toFixed(1)} kg{" "}
                <Text style={{ color: "#94a3b8" }}>(Diff)</Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Clinical Scale */}
        <View
          style={[
            styles.cardFull,
            {
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border,
            },
          ]}
        >
          <View style={styles.rowBetween}>
            <Text style={styles.label}>CLINICAL SCALE</Text>
            <Text style={styles.smallLabel}>Values in kg/m²</Text>
          </View>

          <View style={styles.scaleContainer}>
            {/* Simplified Visual Bar */}
            <View style={styles.scaleBar}>
              <View
                style={[
                  styles.scaleSegment,
                  { backgroundColor: "#60a5fa", flex: 15 },
                ]}
              />
              <View
                style={[
                  styles.scaleSegment,
                  { backgroundColor: "#2bee9d", flex: 25 },
                ]}
              />
              <View
                style={[
                  styles.scaleSegment,
                  { backgroundColor: "#fbbf24", flex: 15 },
                ]}
              />
              <View
                style={[
                  styles.scaleSegment,
                  { backgroundColor: "#f97316", flex: 20 },
                ]}
              />
              <View
                style={[
                  styles.scaleSegment,
                  { backgroundColor: "#ef4444", flex: 25 },
                ]}
              />
            </View>
            {/* Marker */}
            <View
              style={[
                styles.marker,
                {
                  left: `${Math.min(Math.max(((bmi - 15) / (35 - 15)) * 100, 0), 100)}%`,
                },
              ]}
            >
              <View
                style={[
                  styles.markerLine,
                  { backgroundColor: themeColors.textPrimary },
                ]}
              />
              <View style={styles.markerTag}>
                <Text style={styles.markerText}>{bmiFormatted}</Text>
              </View>
            </View>
          </View>

          <View style={styles.legendGrid}>
            <LegendItem color="#60a5fa" label="Underweight (<18.5)" />
            <LegendItem color="#2bee9d" label="Normal (18.5–22.9)" isBold />
            <LegendItem color="#fbbf24" label="Overweight (23.0–24.9)" />
            <LegendItem color="#ef4444" label="Obese (>30.0)" />
          </View>
        </View>

        {/* Insights */}
        <View
          style={[
            styles.cardFull,
            {
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border,
            },
          ]}
        >
          <Text style={[styles.label, { marginBottom: 12 }]}>
            HEALTH INSIGHTS
          </Text>
          <View style={styles.insightRow}>
            <MaterialIcons name="info" size={20} color="#3b82f6" />
            <Text
              style={[styles.insightText, { color: themeColors.textSecondary }]}
            >
              Your BMI is{" "}
              <Text
                style={{ fontWeight: "bold", color: themeColors.textPrimary }}
              >
                {bmiFormatted}
              </Text>
              , indicating you are in the {status} category for your height.
            </Text>
          </View>
          <View style={styles.insightRow}>
            <MaterialIcons name="check-circle" size={20} color="#2bee9d" />
            <Text
              style={[styles.insightText, { color: themeColors.textSecondary }]}
            >
              {status === "Normal"
                ? "Great job! Keep maintaining your healthy lifestyle."
                : "Consider consulting a healthcare provider for personalized advice."}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.restartButton,
            {
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border,
            },
          ]}
          onPress={onReset}
        >
          <MaterialIcons
            name="refresh"
            size={20}
            color={themeColors.textPrimary}
          />
          <Text
            style={[styles.restartText, { color: themeColors.textPrimary }]}
          >
            New Assessment
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const LegendItem = ({
  color,
  label,
  isBold,
}: {
  color: string;
  label: string;
  isBold?: boolean;
}) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendDot, { backgroundColor: color }]} />
    <Text
      style={[
        styles.legendText,
        isBold && { fontWeight: "bold", color: color },
      ]}
    >
      {label}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0d1b16",
  },
  badgeContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  badge: {
    backgroundColor: "#eefdf5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(43, 238, 157, 0.2)",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#29f086",
    letterSpacing: 0.5,
  },
  content: {
    padding: 20,
    gap: 16,
    paddingBottom: 100,
  },
  banner: {
    backgroundColor: "#2bee9d",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#2bee9d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  bannerIcon: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 8,
    borderRadius: 12,
  },
  bannerTitle: {
    fontWeight: "bold",
    color: "#0d1b16",
    fontSize: 14,
  },
  bannerDesc: {
    color: "rgba(13, 27, 22, 0.8)",
    fontSize: 11,
    marginTop: 2,
    maxWidth: "90%",
  },
  grid: {
    flexDirection: "row",
    gap: 12,
  },
  cardCenter: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    justifyContent: "center",
  },
  gaugeCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    borderTopColor: "transparent", // makeshift gauge look
    transform: [{ rotate: "-45deg" }],
  },
  scoreText: {
    fontSize: 24,
    fontWeight: "bold",
    transform: [{ rotate: "45deg" }], // counteract parent rotation
  },
  statusText: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  label: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  rowBaseline: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginTop: 4,
  },
  valueText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0d1b16",
  },
  unit: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
  },
  diffRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#f8fafc",
    gap: 4,
  },
  diffText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#2bee9d",
  },
  cardFull: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  smallLabel: {
    fontSize: 9,
    color: "#94a3b8",
    fontWeight: "500",
  },
  scaleContainer: {
    marginTop: 20,
    marginBottom: 8,
    position: "relative",
    height: 40,
  },
  scaleBar: {
    flexDirection: "row",
    height: 12,
    borderRadius: 6,
    overflow: "hidden",
  },
  scaleSegment: {},
  marker: {
    position: "absolute",
    top: -8,
    alignItems: "center",
    transform: [{ translateX: -10 }], // roughly center
  },
  markerLine: {
    width: 2,
    height: 24,
    backgroundColor: "#0d1b16",
    zIndex: 10,
  },
  markerTag: {
    backgroundColor: "#2bee9d",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
  },
  markerText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0d1b16",
  },
  legendGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: "45%",
  },
  legendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  legendText: {
    fontSize: 10,
    color: "#64748b",
  },
  insightRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  insightText: {
    fontSize: 11,
    color: "#475569",
    flex: 1,
    lineHeight: 16,
  },
  restartButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  restartText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#0d1b16",
  },
});
