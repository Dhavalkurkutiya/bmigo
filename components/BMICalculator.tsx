import ComingSoon from "@/components/ComingSoon";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

import React, { useEffect, useState } from "react";
import {
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
  const [weight, setWeight] = useState(72);
  const [age, setAge] = useState(26);
  const [isIndianMode, setIsIndianMode] = useState(false);
  const [isAthleteMode, setIsAthleteMode] = useState(false);

  const [activeTab, setActiveTab] = useState<
    "calculator" | "history" | "progress" | "profile"
  >("calculator");
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

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

  const themeColors = {
    // ... same theme colors
    background: isDark ? "#0d1b16" : "#f6f8f7",
    cardBg: isDark ? "#162621" : "#fff",
    textPrimary: isDark ? "#ffffff" : "#0d1b16",
    textSecondary: isDark ? "#94a3b8" : "#64748b",
    border: isDark ? "#2a3c34" : "#f1f5f9",
    iconBg: isDark ? "#2a3c34" : "#fff",
    genderBg: isDark ? "#2a3c34" : "#f1f5f9",
    primary: "#2bee9d",
  };

  return (
    <View
      style={[styles.container, { backgroundColor: themeColors.background }]}
    >
      {activeTab === "calculator" ? (
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

          {/* Height Slider */}
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
              <View>
                <Text style={styles.label}>HEIGHT</Text>
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
              </View>
              <MaterialIcons name="height" size={32} color="#2bee9d" />
            </View>

            <View style={styles.sliderContainer}>
              <Slider
                style={{ width: "100%", height: 40 }}
                minimumValue={100}
                maximumValue={250}
                step={1}
                value={height}
                onValueChange={setHeight}
                minimumTrackTintColor="#2bee9d"
                maximumTrackTintColor={isDark ? "#2a3c34" : "#e2e8f0"}
                thumbTintColor="#2bee9d"
              />
            </View>
            <View style={styles.sliderLabels}>
              <TouchableOpacity
                onPress={() => setHeight(Math.max(100, height - 1))}
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
              <Text style={styles.label}>WEIGHT (KG)</Text>
              <TextInput
                style={[styles.inputLarge, { color: themeColors.textPrimary }]}
                value={weight.toString()}
                onChangeText={(t) => setWeight(Number(t) || 0)}
                keyboardType="numeric"
                placeholderTextColor={themeColors.textSecondary}
              />
              <View style={styles.counterRow}>
                <TouchableOpacity
                  onPress={() => setWeight(Math.max(1, weight - 1))}
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
                  onPress={() => setWeight(weight + 1)}
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
                false: isDark ? "#2a3c34" : "#e2e8f0",
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
                false: isDark ? "#2a3c34" : "#e2e8f0",
                true: "#2bee9d",
              }}
              thumbColor={"#fff"}
            />
          </View>

          <TouchableOpacity
            style={styles.calculateButton}
            onPress={() =>
              onCalculate({
                gender,
                height,
                weight,
                age,
                isIndianMode,
                isAthleteMode,
              })
            }
          >
            <Text style={styles.calculateButtonText}>Calculate BMI</Text>
            <MaterialIcons name="trending-up" size={24} color="#0d1b16" />
          </TouchableOpacity>
        </ScrollView>
      ) : (
        <ComingSoon />
      )}

      {/* Bottom Nav Simulation */}
      {!isKeyboardVisible && (
        <View
          style={[
            styles.bottomNav,
            {
              backgroundColor: themeColors.cardBg,
              borderTopColor: themeColors.border,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab("calculator")}
          >
            <MaterialIcons
              name="calculate"
              size={24}
              color={
                activeTab === "calculator"
                  ? "#2bee9d"
                  : themeColors.textSecondary
              }
            />
            <Text
              style={[
                styles.navText,
                {
                  color:
                    activeTab === "calculator"
                      ? "#2bee9d"
                      : themeColors.textSecondary,
                },
              ]}
            >
              Calculator
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab("history")}
          >
            <MaterialIcons
              name="history"
              size={24}
              color={
                activeTab === "history" ? "#2bee9d" : themeColors.textSecondary
              }
            />
            <Text
              style={[
                styles.navText,
                {
                  color:
                    activeTab === "history"
                      ? "#2bee9d"
                      : themeColors.textSecondary,
                },
              ]}
            >
              History
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab("progress")}
          >
            <MaterialIcons
              name="analytics"
              size={24}
              color={
                activeTab === "progress" ? "#2bee9d" : themeColors.textSecondary
              }
            />
            <Text
              style={[
                styles.navText,
                {
                  color:
                    activeTab === "progress"
                      ? "#2bee9d"
                      : themeColors.textSecondary,
                },
              ]}
            >
              Progress
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.navItem}
            onPress={() => setActiveTab("profile")}
          >
            <MaterialIcons
              name="person"
              size={24}
              color={
                activeTab === "profile" ? "#2bee9d" : themeColors.textSecondary
              }
            />
            <Text
              style={[
                styles.navText,
                {
                  color:
                    activeTab === "profile"
                      ? "#2bee9d"
                      : themeColors.textSecondary,
                },
              ]}
            >
              Profile
            </Text>
          </TouchableOpacity>
        </View>
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
    padding: 24,
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
});
