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
import { SafeAreaView } from "react-native-safe-area-context";
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
    } else if (bmi < 35) {
      status = "Obese I";
      color = "#f97316";
    } else {
      status = "Obese II";
      color = "#ef4444";
    }
  }

  // Ideal weight
  const idealMin = 18.5 * heightM * heightM;
  const idealMax = (isIndian ? 22.9 : 24.9) * heightM * heightM;
  const idealWeight = ((idealMin + idealMax) / 2).toFixed(1);

  // Health Insight Logic
  let healthInsight = "";
  if (status.includes("Underweight")) {
    healthInsight =
      "You are below the recommended weight. diverse nutrient-rich diet and strength training may help.";
  } else if (status === "Normal") {
    healthInsight =
      "Excellent! You are at a healthy weight. Keep up the balanced diet and regular activity.";
  } else if (status.includes("Overweight")) {
    healthInsight =
      "You are slightly above ideal weight. Regular cardio and portion control can help you reach your goals.";
  } else if (status.includes("Obese")) {
    healthInsight =
      "Your weight may impact your health. Consulting a professional for a personalized plan is recommended.";
  } else {
    healthInsight = "Stay active and eat well to maintain good health.";
  }

  // --- NUTRITION ALGORITHM START ---
  // 1. Constants
  const ICMR_PROTEIN_PER_KG = 0.83;
  const ATHLETE_PROTEIN_MULTIPLIER = 1.8;
  const ATHLETE_MIN_ACTIVITY = 1.55;
  const DEFAULT_ACTIVITY = 1.375; // Assuming Lightly Active if not specified

  // 2. Input Setup
  const { weight, height, age, gender, isAthleteMode, isIndianMode } = data;
  let activityLevel = DEFAULT_ACTIVITY;

  // 3. BMR Calculation (Mifflin-St Jeor)
  let bmr = 0;
  if (gender === "male") {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // 4. TDEE Calculation
  if (isAthleteMode && activityLevel < ATHLETE_MIN_ACTIVITY) {
    activityLevel = ATHLETE_MIN_ACTIVITY;
  }
  const tdee = Math.round(bmr * activityLevel);

  let targetProtein = 0;
  if (isAthleteMode) {
    targetProtein = Math.round(weight * ATHLETE_PROTEIN_MULTIPLIER);
  } else {
    targetProtein = Math.round(weight * ICMR_PROTEIN_PER_KG);
  }
  const proteinCalories = targetProtein * 4;
  const remainingCalories = tdee - proteinCalories;

  let carbSplit = 0.5;
  let fatSplit = 0.5;

  if (isIndianMode) {
    carbSplit = 0.65;
    fatSplit = 0.35;
  }

  const targetCarbs = Math.round((remainingCalories * carbSplit) / 4);
  const targetFats = Math.round((remainingCalories * fatSplit) / 9);
  // --- NUTRITION ALGORITHM END ---

  return (
    <SafeAreaView
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
            {/* 
                Visual Scale Logic: 
                We map physical BMI ranges to flex values to ensure the marker lands on the correct color.
            */}
            <View style={styles.scaleBar}>
              {/* Underweight: < 18.5 */}
              <View
                style={[
                  styles.scaleSegment,
                  { backgroundColor: "#60a5fa", flex: 3.5 },
                ]}
              />
              {/* Normal: 18.5 - (23 Indian / 25 Std) */}
              <View
                style={[
                  styles.scaleSegment,
                  { backgroundColor: "#2bee9d", flex: isIndian ? 4.5 : 6.5 },
                ]}
              />
              {/* Overweight: (23/25) - (25/30) */}
              <View
                style={[
                  styles.scaleSegment,
                  { backgroundColor: "#fbbf24", flex: isIndian ? 2.0 : 5.0 },
                ]}
              />
              {/* Obese I: (25/30) - (30/35) */}
              <View
                style={[
                  styles.scaleSegment,
                  { backgroundColor: "#f97316", flex: 5.0 },
                ]}
              />
              {/* Obese II: > (30/35) */}
              <View
                style={[
                  styles.scaleSegment,
                  { backgroundColor: "#ef4444", flex: 5.0 },
                ]}
              />
            </View>

            {/* Marker Calculation */}
            {(() => {
              // Define visual bounds to match the flex ratios above
              const minVis = 15.0; // Starting BMI for the bar
              const maxVis = isIndian ? 35.0 : 40.0; // Ending BMI based on ranges

              // Calculate percentage
              const pct =
                ((Math.min(Math.max(bmi, minVis), maxVis) - minVis) /
                  (maxVis - minVis)) *
                100;

              return (
                <View
                  style={[
                    styles.marker,
                    {
                      left: `${pct}%`,
                    },
                  ]}
                >
                  <View
                    style={[styles.markerLine, { backgroundColor: color }]}
                  />
                  <View style={[styles.markerTag, { backgroundColor: color }]}>
                    <Text style={[styles.markerText, { color: "#ffffff" }]}>
                      {bmiFormatted}
                    </Text>
                  </View>
                </View>
              );
            })()}
          </View>

          <View style={styles.legendGrid}>
            <LegendItem color="#60a5fa" label={`Underweight (<18.5)`} />
            <LegendItem
              color="#2bee9d"
              label={`Normal (${isIndian ? "18.5-22.9" : "18.5-24.9"})`}
              isBold={status === "Normal"}
            />
            <LegendItem
              color="#fbbf24"
              label={`Overweight (${isIndian ? "23.0-24.9" : "25.0-29.9"})`}
              isBold={status.includes("Overweight")}
            />
            <LegendItem
              color="#f97316"
              label={`Obese I (${isIndian ? "25.0-29.9" : "30.0-34.9"})`}
              isBold={status === "Obese I" || (status === "Obese" && bmi < 35)}
            />
            <LegendItem
              color="#ef4444"
              label={`Obese II (${isIndian ? ">30.0" : ">35.0"})`}
              isBold={
                status === "Obese II" || (status === "Obese" && bmi >= 35)
              }
            />
          </View>
        </View>

        {/* Nutrition Plan */}
        <View
          style={[
            styles.cardFull,
            {
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border,
            },
          ]}
        >
          <Text style={[styles.label, { marginBottom: 16 }]}>
            DAILY NUTRITION TARGETS
          </Text>

          <View style={styles.rowBetween}>
            <View>
              <Text
                style={[styles.valueText, { color: themeColors.textPrimary }]}
              >
                {tdee}
              </Text>
              <Text style={styles.unit}>Calories / Day</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ fontSize: 10, color: themeColors.textSecondary }}>
                {isAthleteMode ? "Athlete Mode Active" : "Standard Mode"}
              </Text>
              <Text style={{ fontSize: 10, color: themeColors.textSecondary }}>
                Base: Mifflin-St Jeor
              </Text>
            </View>
          </View>

          <View style={styles.macroGrid}>
            <MacroCard
              label="Protein"
              value={`${targetProtein}g`}
              subLabel={isAthleteMode ? "High (1.8g/kg)" : "Std (0.83g/kg)"}
              color="#60a5fa"
              themeColors={themeColors}
            />
            <MacroCard
              label="Carbs"
              value={`${targetCarbs}g`}
              subLabel={isIndianMode ? "65% of rem." : "50% of rem."}
              color="#fbbf24"
              themeColors={themeColors}
            />
            <MacroCard
              label="Fats"
              value={`${targetFats}g`}
              subLabel={isIndianMode ? "35% of rem." : "50% of rem."}
              color="#f97316"
              themeColors={themeColors}
            />
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
              {healthInsight}
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
    </SafeAreaView>
  );
}

const MacroCard = ({ label, value, subLabel, color, themeColors }: any) => (
  <View
    style={[
      styles.macroCard,
      { backgroundColor: color + "15", borderColor: color + "30" },
    ]}
  >
    <Text style={[styles.macroLabel, { color: color }]}>{label}</Text>
    <Text style={[styles.macroValue, { color: themeColors.textPrimary }]}>
      {value}
    </Text>
    <Text style={styles.macroSub}>{subLabel}</Text>
  </View>
);

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
  macroGrid: {
    flexDirection: "row",
    gap: 8,
    marginTop: 16,
  },
  macroCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },
  macroLabel: {
    fontSize: 10,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 2,
  },
  macroSub: {
    fontSize: 9,
    color: "#64748b",
    textAlign: "center",
  },
});
