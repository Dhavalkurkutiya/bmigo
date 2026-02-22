import BottomTabBar from "@/components/BottomTabBar";
import HistoryScreen from "@/components/HistoryScreen";
import ProfileScreen from "@/components/ProfileScreen";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useHistory } from "@/hooks/useHistory";
import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

import React, { useEffect, useState } from "react";
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface BMICalculatorProps {
  onCalculate: (data: BMIInputData) => void;
}

export interface BMIInputData {
  gender: "male" | "female";
  height: number; // cm
  weight: number; // kg
  age: number;
  isIndianMode: boolean;
  isAthleteMode: boolean;
}

export default function BMICalculator({ onCalculate }: BMICalculatorProps) {
  const [gender, setGender] = useState<"male" | "female">("male");
  const [height, setHeight] = useState(175);
  const [weight, setWeight] = useState("72");
  const [age, setAge] = useState(26);
  const [isIndianMode, setIsIndianMode] = useState(false);
  const [isAthleteMode, setIsAthleteMode] = useState(false);

  // New State for Unit Conversion
  const [heightUnit, setHeightUnit] = useState<"cm" | "ft">("cm");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("9");
  // Keep height state for CM value, update when unit is CM
  // Keep weight state as raw input value

  const [activeTab, setActiveTab] = useState<"home" | "stats" | "hub">("home");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  const { history, loading } = useHistory();

  useEffect(() => {
    if (!loading && history && history.length > 0 && !isDataLoaded) {
      const latest = history[0];
      setHeight(Math.round(latest.height));
      setWeight(latest.weight.toString());
      setIsAthleteMode(latest.mode === "athlete");

      const inches = latest.height / 2.54;
      const ft = Math.floor(inches / 12);
      const remainingInches = Math.round(inches % 12);
      setHeightFt(ft.toString());
      setHeightIn(remainingInches.toString());

      setIsDataLoaded(true);
    } else if (!loading && !isDataLoaded) {
      setIsDataLoaded(true);
    }
  }, [history, loading, isDataLoaded]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleCalculate = () => {
    // 1. Validate Inputs
    // Age Validation
    if (age < 10 || age > 100) {
      Alert.alert("Invalid Age", "Please enter an age between 10 and 100.");
      return;
    }

    // Height Validation & Normalization
    let finalHeightCm = 0;
    if (heightUnit === "cm") {
      finalHeightCm = height;
    } else {
      const ft = parseFloat(heightFt || "0");
      const inch = parseFloat(heightIn || "0");
      finalHeightCm = ft * 30.48 + inch * 2.54;
    }

    if (finalHeightCm < 50 || finalHeightCm > 250) {
      Alert.alert(
        "Invalid Height",
        "Height must be between 50cm (approx 1ft 8in) and 250cm (approx 8ft 2in).",
      );
      return;
    }

    // Weight Validation & Normalization
    let finalWeightKg = 0;
    const parsedWeight = parseFloat(weight) || 0;
    if (weightUnit === "kg") {
      finalWeightKg = parsedWeight;
    } else {
      finalWeightKg = parsedWeight / 2.20462;
    }

    if (finalWeightKg < 20 || finalWeightKg > 300) {
      Alert.alert(
        "Invalid Weight",
        "Weight must be between 20kg (44lbs) and 300kg (660lbs).",
      );
      return;
    }

    // 2. Proceed if Valid
    onCalculate({
      gender,
      height: finalHeightCm,
      weight: finalWeightKg,
      age,
      isIndianMode,
      isAthleteMode,
    });
  };

  const themeColors = {
    // ... same theme colors
    background: isDark ? "#151718" : "#f6f8f7",
    cardBg: isDark ? "#202325" : "#fff",
    textPrimary: isDark ? "#ffffff" : "#0d1b16",
    textSecondary: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "#2E3032" : "#f1f5f9",
    iconBg: isDark ? "#2E3032" : "#fff",
    genderBg: isDark ? "#2E3032" : "#f1f5f9",
    primary: "#2bee9d",
    toggleBg: isDark ? "#101213" : "#ebeef2",
    toggleActiveBg: isDark ? "#2C3032" : "#fff",
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {activeTab === "home" ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Custom Header */}
          <View style={styles.header}>
            <View>
              <View style={styles.logoRow}>
                <Text
                  style={[styles.logoText, { color: themeColors.textPrimary }]}
                >
                  BMI
                </Text>
                <Text style={[styles.logoText, { color: "#0ea5e9" }]}> Go</Text>
              </View>
              <Text style={styles.tagline}>ACCURACY & EMPATHY</Text>
            </View>
            <View style={styles.headerRight}>
              <Text
                style={[
                  styles.smartInputText,
                  { color: themeColors.textPrimary },
                ]}
              >
                Smart Input
              </Text>
              <View style={styles.progressBarBg}>
                <View style={styles.progressBarFill} />
              </View>
            </View>
          </View>

          {/* Gender Selection */}
          <View style={styles.section}>
            <Text style={styles.label}>SELECT GENDER</Text>
            <View
              style={[
                styles.genderContainer,
                { backgroundColor: themeColors.genderBg },
              ]}
            >
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "male" && {
                    backgroundColor: themeColors.cardBg,
                    shadowColor: "#000",
                  },
                ]}
                onPress={() => setGender("male")}
              >
                <MaterialIcons
                  name="male"
                  size={24}
                  color={
                    gender === "male"
                      ? themeColors.textPrimary
                      : themeColors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.genderText,
                    gender === "male"
                      ? { color: themeColors.textPrimary }
                      : { color: themeColors.textSecondary },
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderButton,
                  gender === "female" && {
                    backgroundColor: themeColors.cardBg,
                    shadowColor: "#000",
                  },
                ]}
                onPress={() => setGender("female")}
              >
                <MaterialIcons
                  name="female"
                  size={24}
                  color={
                    gender === "female"
                      ? themeColors.textPrimary
                      : themeColors.textSecondary
                  }
                />
                <Text
                  style={[
                    styles.genderText,
                    gender === "female"
                      ? { color: themeColors.textPrimary }
                      : { color: themeColors.textSecondary },
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Height Section */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: themeColors.cardBg,
                borderColor: themeColors.border,
              },
            ]}
          >
            <View style={styles.cardHeader}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 12 }}
              >
                <Text style={styles.label}>HEIGHT</Text>
                {/* Unit Switch */}
                <View
                  style={[
                    styles.unitToggleContainer,
                    {
                      backgroundColor: themeColors.toggleBg,
                      borderColor: themeColors.border,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => setHeightUnit("cm")}
                    style={[
                      styles.unitToggleButton,
                      heightUnit === "cm" && [
                        styles.unitToggleButtonActive,
                        { backgroundColor: themeColors.toggleActiveBg },
                      ],
                    ]}
                  >
                    <Text
                      style={[
                        styles.unitText,
                        heightUnit === "cm" && [
                          styles.unitTextActive,
                          { color: themeColors.textPrimary },
                        ],
                      ]}
                    >
                      CM
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setHeightUnit("ft")}
                    style={[
                      styles.unitToggleButton,
                      heightUnit === "ft" && [
                        styles.unitToggleButtonActive,
                        { backgroundColor: themeColors.toggleActiveBg },
                      ],
                    ]}
                  >
                    <Text
                      style={[
                        styles.unitText,
                        heightUnit === "ft" && [
                          styles.unitTextActive,
                          { color: themeColors.textPrimary },
                        ],
                      ]}
                    >
                      FT
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <MaterialIcons name="height" size={32} color="#2bee9d" />
            </View>

            {heightUnit === "cm" ? (
              <>
                <View style={styles.heightValueContainer}>
                  <TextInput
                    style={[
                      styles.largeValue,
                      { color: themeColors.textPrimary },
                    ]}
                    value={height.toString()}
                    onChangeText={(text) => {
                      const val = parseInt(text);
                      if (!isNaN(val)) {
                        setHeight(val);
                      } else if (text === "") {
                        setHeight(0);
                      }
                    }}
                    keyboardType="numeric"
                    maxLength={3}
                  />
                  <Text style={styles.unit}>cm</Text>
                </View>

                <View style={styles.sliderContainer}>
                  <Slider
                    style={{ width: "100%", height: 40 }}
                    minimumValue={50}
                    maximumValue={250}
                    step={1}
                    value={height}
                    onValueChange={setHeight}
                    minimumTrackTintColor="#2bee9d"
                    maximumTrackTintColor={isDark ? "#2E3032" : "#e2e8f0"}
                    thumbTintColor="#2bee9d"
                  />
                </View>
                <View style={styles.sliderLabels}>
                  <TouchableOpacity
                    onPress={() => setHeight(Math.max(50, height - 1))}
                    style={[
                      styles.counterButton,
                      {
                        backgroundColor: themeColors.cardBg,
                        borderColor: themeColors.border,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="remove"
                      size={20}
                      color={themeColors.textPrimary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setHeight(Math.min(250, height + 1))}
                    style={[
                      styles.counterButton,
                      {
                        backgroundColor: themeColors.cardBg,
                        borderColor: themeColors.border,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="add"
                      size={20}
                      color={themeColors.textPrimary}
                    />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.ftContainer}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subLabel}>FEET</Text>
                  <TextInput
                    style={[
                      styles.largeValue,
                      {
                        color: themeColors.textPrimary,
                        borderBottomWidth: 1,
                        borderColor: themeColors.border,
                      },
                    ]}
                    value={heightFt}
                    onChangeText={setHeightFt}
                    keyboardType="numeric"
                    maxLength={1}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.subLabel}>INCHES</Text>
                  <TextInput
                    style={[
                      styles.largeValue,
                      {
                        color: themeColors.textPrimary,
                        borderBottomWidth: 1,
                        borderColor: themeColors.border,
                      },
                    ]}
                    value={heightIn}
                    onChangeText={setHeightIn}
                    keyboardType="numeric"
                    maxLength={2}
                  />
                </View>
              </View>
            )}
          </View>

          {/* Weight & Age */}
          <View style={styles.row}>
            <View
              style={[
                styles.halfCard,
                {
                  backgroundColor: themeColors.cardBg,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 4, // Add gap for when it wraps
                }}
              >
                <Text style={styles.label}>WEIGHT</Text>
                <View
                  style={[
                    styles.unitToggleContainer,
                    {
                      backgroundColor: themeColors.toggleBg,
                      borderColor: themeColors.border,
                    },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => setWeightUnit("kg")}
                    style={[
                      styles.unitToggleButton,
                      weightUnit === "kg" && [
                        styles.unitToggleButtonActive,
                        { backgroundColor: themeColors.toggleActiveBg },
                      ],
                    ]}
                  >
                    <Text
                      style={[
                        styles.unitText,
                        weightUnit === "kg" && [
                          styles.unitTextActive,
                          { color: themeColors.textPrimary },
                        ],
                      ]}
                    >
                      KG
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setWeightUnit("lbs")}
                    style={[
                      styles.unitToggleButton,
                      weightUnit === "lbs" && [
                        styles.unitToggleButtonActive,
                        { backgroundColor: themeColors.toggleActiveBg },
                      ],
                    ]}
                  >
                    <Text
                      style={[
                        styles.unitText,
                        weightUnit === "lbs" && [
                          styles.unitTextActive,
                          { color: themeColors.textPrimary },
                        ],
                      ]}
                    >
                      LBS
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TextInput
                style={[styles.inputLarge, { color: themeColors.textPrimary }]}
                value={weight}
                onChangeText={(t) => {
                  let formatted = t.replace(/,/g, ".");
                  formatted = formatted.replace(/[^0-9.]/g, "");
                  const parts = formatted.split(".");
                  if (parts.length > 2) {
                    setWeight(parts[0] + "." + parts.slice(1).join(""));
                  } else {
                    setWeight(formatted);
                  }
                }}
                keyboardType="decimal-pad"
                placeholder={weightUnit === "kg" ? "KG" : "LBS"}
                placeholderTextColor={themeColors.textSecondary}
              />
              <View style={styles.counterRow}>
                <TouchableOpacity
                  onPress={() => {
                    const w = parseFloat(weight) || 0;
                    setWeight(Math.max(1, w - 1).toString());
                  }}
                  style={[
                    styles.counterButton,
                    {
                      backgroundColor: themeColors.cardBg,
                      borderColor: themeColors.border,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="remove"
                    size={20}
                    color={themeColors.textPrimary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const w = parseFloat(weight) || 0;
                    setWeight((w + 1).toString());
                  }}
                  style={[
                    styles.counterButton,
                    {
                      backgroundColor: themeColors.cardBg,
                      borderColor: themeColors.border,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="add"
                    size={20}
                    color={themeColors.textPrimary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={[
                styles.halfCard,
                {
                  backgroundColor: themeColors.cardBg,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <Text style={styles.label}>AGE</Text>
              <TextInput
                style={[styles.inputLarge, { color: themeColors.textPrimary }]}
                value={age.toString()}
                onChangeText={(t) => setAge(Number(t) || 0)}
                keyboardType="numeric"
                placeholderTextColor={themeColors.textSecondary}
              />
              <View style={styles.counterRow}>
                <TouchableOpacity
                  onPress={() => setAge(Math.max(1, age - 1))}
                  style={[
                    styles.counterButton,
                    {
                      backgroundColor: themeColors.cardBg,
                      borderColor: themeColors.border,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="remove"
                    size={20}
                    color={themeColors.textPrimary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setAge(age + 1)}
                  style={[
                    styles.counterButton,
                    {
                      backgroundColor: themeColors.cardBg,
                      borderColor: themeColors.border,
                    },
                  ]}
                >
                  <MaterialIcons
                    name="add"
                    size={20}
                    color={themeColors.textPrimary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Toggles */}
          <View
            style={[
              styles.toggleCard,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.6)",
                borderColor: themeColors.border,
              },
            ]}
          >
            <View style={styles.toggleInfo}>
              <View style={styles.iconCircle}>
                <MaterialIcons name="public" size={24} color="#2bee9d" />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.toggleTitle,
                    { color: themeColors.textPrimary },
                  ]}
                >
                  Indian Mode (ICMR 2020)
                </Text>
                <Text style={styles.toggleDesc}>
                  Adjusts results for localized health standards.
                </Text>
              </View>
            </View>
            <Switch
              value={isIndianMode}
              onValueChange={setIsIndianMode}
              trackColor={{
                false: isDark ? "#2E3032" : "#e2e8f0",
                true: "#2bee9d",
              }}
              thumbColor={"#fff"}
            />
          </View>

          <View
            style={[
              styles.toggleCard,
              {
                backgroundColor: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(255,255,255,0.6)",
                borderColor: themeColors.border,
              },
            ]}
          >
            <View style={styles.toggleInfo}>
              <View style={styles.iconCircle}>
                <MaterialIcons
                  name="fitness-center"
                  size={24}
                  color="#2bee9d"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.toggleTitle,
                    { color: themeColors.textPrimary },
                  ]}
                >
                  Athlete Mode
                </Text>
                <Text style={styles.toggleDesc}>
                  Optimized for high muscle mass.
                </Text>
              </View>
            </View>
            <Switch
              value={isAthleteMode}
              onValueChange={setIsAthleteMode}
              trackColor={{
                false: isDark ? "#2E3032" : "#e2e8f0",
                true: "#2bee9d",
              }}
              thumbColor={"#fff"}
            />
          </View>

          <TouchableOpacity
            style={styles.calculateButton}
            onPress={handleCalculate}
          >
            <Text style={styles.calculateButtonText}>Calculate BMI</Text>
            <MaterialIcons name="trending-up" size={24} color="#0d1b16" />
          </TouchableOpacity>

          <View
            style={{ marginTop: 10, marginBottom: 20, paddingHorizontal: 10 }}
          >
            <Text
              style={{
                fontSize: 11,
                color: isDark ? "#64748b" : "#94a3b8",
                textAlign: "center",
                fontStyle: "italic",
                lineHeight: 16,
              }}
            >
              Disclaimer: BMI Go is not a medical device. It does not diagnose,
              treat, cure, or prevent any medical condition. Please consult a
              healthcare professional for medical advice.
            </Text>
          </View>
        </ScrollView>
      ) : activeTab === "stats" ? (
        <HistoryScreen onBack={() => setActiveTab("home")} />
      ) : activeTab === "hub" ? (
        <ProfileScreen onBack={() => setActiveTab("home")} />
      ) : null}

      {/* Bottom Nav Simulation */}
      {!isKeyboardVisible && (
        <BottomTabBar currentTab={activeTab} onTabPress={setActiveTab} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8f7",
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 32,
    marginTop: 20,
  },
  logoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoText: {
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#94a3b8",
    letterSpacing: 1.5,
    marginTop: 4,
  },
  headerRight: {
    alignItems: "flex-end",
    gap: 6,
    paddingBottom: 4,
  },
  smartInputText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  progressBarBg: {
    width: 80,
    height: 4,
    backgroundColor: "#e2e8f0",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBarFill: {
    width: "30%",
    height: "100%",
    backgroundColor: "#2bee9d",
    borderRadius: 2,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 12,
    letterSpacing: 1,
  },
  genderContainer: {
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    borderRadius: 30,
    padding: 6,
    height: 64,
  },
  genderButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 26,
    gap: 8,
  },
  genderButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  genderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748b",
  },
  genderTextActive: {
    color: "#0d1b16",
  },
  card: {
    backgroundColor: "#fff", // Or slightly transparent if using a bg image
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  heightValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
  },
  largeValue: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#0d1b16",
  },
  unit: {
    fontSize: 16,
    color: "#94a3b8",
    fontWeight: "500",
  },
  sliderContainer: {
    height: 40,
    justifyContent: "center",
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  row: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  halfCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  inputLarge: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#0d1b16",
    padding: 0,
    marginVertical: 12,
  },
  counterRow: {
    flexDirection: "row",
    gap: 12,
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  toggleInfo: {
    flex: 1,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(43, 238, 157, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0d1b16",
  },
  toggleDesc: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
    marginRight: 8,
  },
  calculateButton: {
    backgroundColor: "#2bee9d",
    borderRadius: 32,
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 32,
    shadowColor: "#2bee9d",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    gap: 12,
  },
  calculateButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0d1b16",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-around",
    paddingBottom: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  navItem: {
    alignItems: "center",
    gap: 4,
  },
  navText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase",
  },

  // New Styles for Unit Toggles
  unitToggleContainer: {
    flexDirection: "row",
    backgroundColor: "#ebeef2", // Slightly darker than #f1f5f9
    borderRadius: 8,
    padding: 2,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  unitToggleButton: {
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 6,
  },
  unitToggleButtonActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  unitText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94a3b8",
  },
  unitTextActive: {
    color: "#0d1b16",
    fontWeight: "bold",
  },
  ftContainer: {
    flexDirection: "row",
    gap: 20,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  subLabel: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#94a3b8",
    marginBottom: 4,
    letterSpacing: 1,
  },
});
