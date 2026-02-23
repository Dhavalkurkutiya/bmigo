import { useHistory } from "@/hooks/useHistory";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Appearance,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  useColorScheme,
} from "react-native";

const PRIMARY = "#00ff9d";
const SECONDARY = "#0ea5e9";

// Light Theme Colors
const LIGHT_BG = "#f8fafc";
const LIGHT_TEXT_MAIN = "#0f172a";
const LIGHT_TEXT_SUB = "#64748b";
const LIGHT_CARD_BG = "white";
const LIGHT_BORDER = "#f1f5f9";

// Dark Theme Colors
const DARK_BG = "#151718";
const DARK_TEXT_MAIN = "#ffffff";
const DARK_TEXT_SUB = "#94a3b8";
const DARK_CARD_BG = "#202325";
const DARK_BORDER = "#2E3032";

// Default Constants (Light Theme) for static styles
// const BACKGROUND_LIGHT = LIGHT_BG;
const TEXT_MAIN = LIGHT_TEXT_MAIN;
const TEXT_SUB = LIGHT_TEXT_SUB;

export default function ProfileScreen({ onBack }: { onBack?: () => void }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const { history } = useHistory();

  // Dynamic Colors
  const bgMain = isDark ? DARK_BG : LIGHT_BG;
  const textMain = isDark ? DARK_TEXT_MAIN : LIGHT_TEXT_MAIN;
  const textSub = isDark ? DARK_TEXT_SUB : LIGHT_TEXT_SUB;
  const cardBg = isDark ? DARK_CARD_BG : LIGHT_CARD_BG;
  const borderColor = isDark ? DARK_BORDER : LIGHT_BORDER;

  const currentRecord = history && history.length > 0 ? history[0] : null;
  const currentBmi = currentRecord ? currentRecord.bmi.toFixed(1) : "--";
  const currentStatus = currentRecord ? currentRecord.status : "No Data";
  const bmiProgress = currentRecord
    ? Math.min((currentRecord.bmi / 40) * 100, 100)
    : 0;

  const [displayMode, setDisplayMode] = useState<"system" | "light" | "dark">(
    "system",
  );
  const [showDisplayModeModal, setShowDisplayModeModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const [personalInfo, setPersonalInfo] = useState({
    name: "Guest",
    age: "",
    gender: "",
    goalWeight: "",
    profileImage: "",
  });
  const [showPersonalInfoModal, setShowPersonalInfoModal] = useState(false);
  const [showWeightHistoryModal, setShowWeightHistoryModal] = useState(false);
  const [tempInfo, setTempInfo] = useState({
    name: "",
    age: "",
    gender: "",
    goalWeight: "",
    profileImage: "",
  });

  let goalProgress = 0;
  let goalChangeText = "--";

  if (history && history.length > 0 && personalInfo.goalWeight) {
    const currentWeight = history[0].weight;
    const startWeight = history[history.length - 1].weight;
    const goalWeightNum = parseFloat(personalInfo.goalWeight);

    if (!isNaN(goalWeightNum)) {
      if (startWeight === goalWeightNum) {
        goalProgress = 100;
        goalChangeText = "0kg";
      } else {
        const targetDiff = startWeight - goalWeightNum;
        const currentDiff = startWeight - currentWeight;
        goalProgress = Math.min(
          Math.max((currentDiff / targetDiff) * 100, 0),
          100,
        );

        const weightChange = currentWeight - startWeight;
        goalChangeText =
          weightChange > 0
            ? `+${weightChange.toFixed(1)}kg`
            : `${weightChange.toFixed(1)}kg`;
      }
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const storedMode = await AsyncStorage.getItem("themeMode");
        if (storedMode === "light" || storedMode === "dark") {
          setDisplayMode(storedMode);
        }

        const storedInfo = await AsyncStorage.getItem("personalInfo");
        if (storedInfo) {
          setPersonalInfo(JSON.parse(storedInfo));
        }
      } catch (e) {
        console.error("Error loading theme mode", e);
      }
    })();
  }, []);

  const handleDisplayModeChange = async (mode: "system" | "light" | "dark") => {
    setDisplayMode(mode);
    setShowDisplayModeModal(false);
    try {
      if (mode === "system") {
        await AsyncStorage.removeItem("themeMode");
        Appearance.setColorScheme(null);
      } else {
        await AsyncStorage.setItem("themeMode", mode);
        Appearance.setColorScheme(mode);
      }
    } catch (e) {
      console.error("Error setting theme mode", e);
    }
  };

  const handleSavePersonalInfo = async () => {
    setPersonalInfo(tempInfo);
    setShowPersonalInfoModal(false);
    try {
      await AsyncStorage.setItem("personalInfo", JSON.stringify(tempInfo));
    } catch (e) {
      console.error("Error saving personal info", e);
    }
  };

  const pickImage = async () => {
    try {
      // Ask for permission first if using camera roll exclusively, but for picker it's built-in
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        const selectedUri = result.assets[0].uri;
        const newInfo = { ...personalInfo, profileImage: selectedUri };
        setPersonalInfo(newInfo); // Update dynamically
        await AsyncStorage.setItem("personalInfo", JSON.stringify(newInfo)); // Save instantly
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  return (
    <View style={[styles.safeArea, { backgroundColor: bgMain }]}>
      <View style={[styles.container, { backgroundColor: bgMain }]}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {/* Avatar Image */}
              <TouchableOpacity
                style={styles.imageWrapper}
                onPress={pickImage}
                activeOpacity={0.8}
              >
                {personalInfo.profileImage ? (
                  <Image
                    source={{
                      uri: personalInfo.profileImage,
                    }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <View
                    style={[
                      styles.avatarImage,
                      {
                        backgroundColor: PRIMARY,
                        justifyContent: "center",
                        alignItems: "center",
                      },
                    ]}
                  >
                    <Text
                      style={{
                        fontSize: 40,
                        fontWeight: "800",
                        color: "#0f172a",
                      }}
                    >
                      {personalInfo.name
                        ? personalInfo.name.charAt(0).toUpperCase()
                        : "U"}
                    </Text>
                  </View>
                )}
                <View style={styles.editIconContainer}>
                  <MaterialIcons name="edit" size={14} color="white" />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: textMain }]}>
                {personalInfo.name || "App User"}
              </Text>
              <Text style={[styles.userMeta, { color: textSub }]}>
                {personalInfo.age ? `${personalInfo.age} years • ` : ""}
                {personalInfo.gender ? `${personalInfo.gender} • ` : ""}
                Daily Tracker
              </Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {/* Current BMI Card */}
            <View
              style={[
                styles.statCard,
                { backgroundColor: cardBg, borderColor },
              ]}
            >
              <View style={styles.statHeader}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: "rgba(0, 255, 157, 0.1)" },
                  ]}
                >
                  <MaterialIcons
                    name="monitor-weight"
                    size={18}
                    color={PRIMARY}
                  />
                </View>
                <Text style={[styles.statLabel, { color: textSub }]}>
                  CURRENT BMI
                </Text>
              </View>
              <View style={styles.statValueRow}>
                <Text style={[styles.statValue, { color: textMain }]}>
                  {currentBmi}
                </Text>
                <Text style={[styles.statStatus, { color: PRIMARY }]}>
                  {currentStatus}
                </Text>
              </View>
              <View
                style={[
                  styles.progressBarBg,
                  { backgroundColor: isDark ? "#334155" : "#f1f5f9" },
                ]}
              >
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${bmiProgress}%`, backgroundColor: PRIMARY },
                  ]}
                />
              </View>
            </View>

            {/* Goal Progress Card */}
            <View
              style={[
                styles.statCard,
                { backgroundColor: cardBg, borderColor },
              ]}
            >
              <View style={styles.statHeader}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: "rgba(14, 165, 233, 0.1)" },
                  ]}
                >
                  <MaterialIcons name="flag" size={18} color={SECONDARY} />
                </View>
                <Text style={[styles.statLabel, { color: textSub }]}>
                  GOAL PROGRESS
                </Text>
              </View>
              <View style={styles.statValueRow}>
                <Text style={[styles.statValue, { color: textMain }]}>
                  {goalProgress.toFixed(0)}%
                </Text>
                <Text style={[styles.statSubValue, { color: textSub }]}>
                  {goalChangeText}
                </Text>
              </View>
              <View
                style={[
                  styles.progressBarBg,
                  { backgroundColor: isDark ? "#334155" : "#f1f5f9" },
                ]}
              >
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${goalProgress}%`, backgroundColor: SECONDARY },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Manage Data Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: textSub }]}>
                MANAGE YOUR DATA
              </Text>
              <MaterialIcons
                name="info-outline"
                size={16}
                color={isDark ? "#475569" : "#cbd5e1"}
              />
            </View>

            <View
              style={[
                styles.listContainer,
                { backgroundColor: cardBg, borderColor },
              ]}
            >
              <ListItem
                icon="person-outline"
                title="Personal Information"
                hasChevron
                textColor={textMain}
                subColor={textSub}
                borderColor={isDark ? DARK_BORDER : "#f8fafc"}
                onPress={() => {
                  setTempInfo(personalInfo);
                  setShowPersonalInfoModal(true);
                }}
              />
              <ListItem
                icon="history"
                title="Weight History"
                hasChevron
                textColor={textMain}
                subColor={textSub}
                borderColor={isDark ? DARK_BORDER : "#f8fafc"}
                onPress={() => setShowWeightHistoryModal(true)}
              />
            </View>
          </View>

          {/* App Preferences Section */}
          <View style={styles.section}>
            <Text
              style={[
                styles.sectionTitle,
                { marginBottom: 12, paddingHorizontal: 4, color: textSub },
              ]}
            >
              APP PREFERENCES
            </Text>

            <View
              style={[
                styles.listContainer,
                { backgroundColor: cardBg, borderColor },
              ]}
            >
              <ListItem
                icon="brightness-6" // dark_mode -> brightness-6 or similar
                title="Display Mode"
                textColor={textMain}
                subColor={textSub}
                borderColor={isDark ? DARK_BORDER : "#f8fafc"}
                onPress={() => setShowDisplayModeModal(true)}
                rightElement={
                  <Text style={[styles.valueText, { color: textSub }]}>
                    {displayMode.charAt(0).toUpperCase() + displayMode.slice(1)}
                  </Text>
                }
              />
            </View>
          </View>

          {/* Privacy Section (Modern) */}
          <View style={styles.section}>
            <TouchableOpacity
              onPress={() => setShowPrivacyModal(true)}
              activeOpacity={0.7}
              style={[
                styles.listContainer,
                {
                  backgroundColor: isDark
                    ? "rgba(32, 35, 37, 0.8)"
                    : "rgba(255, 255, 255, 0.8)",
                  borderWidth: 0,
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                  elevation: 4,
                },
              ]}
            >
              <View style={[styles.listItem, { borderBottomWidth: 0 }]}>
                <View style={styles.listItemLeft}>
                  <View
                    style={[
                      styles.iconCircle,
                      { backgroundColor: isDark ? "#2E3032" : "#f1f5f9" },
                    ]}
                  >
                    <MaterialIcons name="security" size={18} color={textSub} />
                  </View>
                  <Text
                    style={[
                      styles.itemTitle,
                      { fontWeight: "600", color: textMain },
                    ]}
                  >
                    Privacy & Security
                  </Text>
                </View>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={16}
                  color={isDark ? "#475569" : "#cbd5e1"}
                />
              </View>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: textSub }]}>
              <MaterialIcons
                name="verified-user"
                size={14}
                color={isDark ? "#475569" : "#cbd5e1"}
              />
              {"  "}VERIFIED WHO STANDARDS
            </Text>
          </View>

          {/* Bottom Padding for Tab Bar */}
          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Display Mode Modal */}
        <Modal
          visible={showDisplayModeModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDisplayModeModal(false)}
        >
          <TouchableWithoutFeedback
            onPress={() => setShowDisplayModeModal(false)}
          >
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View
                  style={[
                    styles.modalContent,
                    { backgroundColor: cardBg, borderColor },
                  ]}
                >
                  <Text style={[styles.modalTitle, { color: textMain }]}>
                    Select Display Mode
                  </Text>
                  {(["system", "light", "dark"] as const).map((mode) => (
                    <TouchableOpacity
                      key={mode}
                      style={styles.modalOption}
                      onPress={() => handleDisplayModeChange(mode)}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          { color: displayMode === mode ? PRIMARY : textMain },
                        ]}
                      >
                        {mode.charAt(0).toUpperCase() + mode.slice(1)}
                      </Text>
                      {displayMode === mode && (
                        <MaterialIcons name="check" size={20} color={PRIMARY} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        {/* Privacy Policy Modal */}
        <Modal
          visible={showPrivacyModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPrivacyModal(false)}
        >
          <View style={styles.privacyModalContainer}>
            <View
              style={[
                styles.privacyModalContent,
                { backgroundColor: bgMain, borderColor },
              ]}
            >
              <View style={styles.privacyModalHeader}>
                <Text style={[styles.privacyModalTitle, { color: textMain }]}>
                  Privacy & Security
                </Text>
                <TouchableOpacity
                  onPress={() => setShowPrivacyModal(false)}
                  style={styles.closeButton}
                >
                  <MaterialIcons name="close" size={24} color={textMain} />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={styles.privacyScroll}
                showsVerticalScrollIndicator={false}
              >
                <Text style={[styles.privacyText, { color: textSub }]}>
                  Your privacy is incredibly important to us. BMI Go is designed
                  with a privacy-first approach, ensuring that your data belongs
                  to you.{"\n\n"}
                  <Text style={{ fontWeight: "bold", color: textMain }}>
                    1. Local Storage{"\n"}
                  </Text>
                  All of your health data, including your height, weight,
                  personal information, BMI results, and history, is securely
                  stored directly on your device. We do not use remote servers
                  or cloud databases to store your personal information.{"\n\n"}
                  <Text style={{ fontWeight: "bold", color: textMain }}>
                    2. Usage of Data{"\n"}
                  </Text>
                  Your data is solely used to calculate your BMI, provide health
                  insights, and keep a history of your progress. We do not
                  share, sell, or distribute any of your personal data to third
                  parties.{"\n\n"}
                  <Text style={{ fontWeight: "bold", color: textMain }}>
                    3. App Permissions{"\n"}
                  </Text>
                  The application does not request or use any sensitive physical
                  activity or motion sensors data. Your personal privacy is
                  maintained at all times without unnecessary permissions.
                  {"\n\n"}
                  <Text style={{ fontWeight: "bold", color: textMain }}>
                    4. Security{"\n"}
                  </Text>
                  Given that the application runs locally and your data does not
                  leave your device, it remains as secure as the device itself.
                  Please ensure you use device-level security (such as screen
                  locks) to protect your information from unauthorized physical
                  access.{"\n\n"}
                  <Text style={{ fontWeight: "bold", color: textMain }}>
                    5. Medical Disclaimer{"\n"}
                  </Text>
                  This app is not a medical device and does not diagnose, treat,
                  cure, or prevent any medical condition. The BMI calculation
                  and related features are for informational purposes only.
                  Please consult a qualified healthcare professional for medical
                  advice regarding your health or weight changes.
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Personal Information Modal */}
        <Modal
          visible={showPersonalInfoModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowPersonalInfoModal(false)}
        >
          <View style={styles.privacyModalContainer}>
            <View
              style={[
                styles.privacyModalContent,
                { backgroundColor: bgMain, borderColor, minHeight: "65%" },
              ]}
            >
              <View style={styles.privacyModalHeader}>
                <Text style={[styles.privacyModalTitle, { color: textMain }]}>
                  Personal Info
                </Text>
                <TouchableOpacity
                  onPress={() => setShowPersonalInfoModal(false)}
                  style={styles.closeButton}
                >
                  <MaterialIcons name="close" size={24} color={textMain} />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: textSub }]}>
                  Name
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: textMain, borderColor, backgroundColor: cardBg },
                  ]}
                  value={tempInfo.name}
                  onChangeText={(t) => setTempInfo((p) => ({ ...p, name: t }))}
                  placeholder="Your Name"
                  placeholderTextColor={textSub}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: textSub }]}>Age</Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: textMain, borderColor, backgroundColor: cardBg },
                  ]}
                  value={tempInfo.age}
                  onChangeText={(t) => setTempInfo((p) => ({ ...p, age: t }))}
                  placeholder="Years"
                  keyboardType="numeric"
                  placeholderTextColor={textSub}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: textSub }]}>
                  Goal Weight (kg)
                </Text>
                <TextInput
                  style={[
                    styles.input,
                    { color: textMain, borderColor, backgroundColor: cardBg },
                  ]}
                  value={tempInfo.goalWeight}
                  onChangeText={(t) =>
                    setTempInfo((p) => ({ ...p, goalWeight: t }))
                  }
                  placeholder="Target Weight"
                  keyboardType="numeric"
                  placeholderTextColor={textSub}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, { color: textSub }]}>
                  Gender
                </Text>
                <View style={styles.genderRow}>
                  {["Male", "Female", "Other"].map((g) => (
                    <TouchableOpacity
                      key={g}
                      onPress={() => setTempInfo((p) => ({ ...p, gender: g }))}
                      style={[
                        styles.genderBtn,
                        { borderColor },
                        tempInfo.gender === g && {
                          backgroundColor: PRIMARY,
                          borderColor: PRIMARY,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: tempInfo.gender === g ? "#0f172a" : textMain,
                          fontWeight: tempInfo.gender === g ? "700" : "500",
                        }}
                      >
                        {g}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: textMain }]}
                onPress={handleSavePersonalInfo}
              >
                <Text style={[styles.saveBtnText, { color: bgMain }]}>
                  Save Changes
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Weight History Modal */}
        <Modal
          visible={showWeightHistoryModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowWeightHistoryModal(false)}
        >
          <View style={styles.privacyModalContainer}>
            <View
              style={[
                styles.privacyModalContent,
                { backgroundColor: bgMain, borderColor, minHeight: "75%" },
              ]}
            >
              <View style={styles.privacyModalHeader}>
                <Text style={[styles.privacyModalTitle, { color: textMain }]}>
                  Weight History
                </Text>
                <TouchableOpacity
                  onPress={() => setShowWeightHistoryModal(false)}
                  style={styles.closeButton}
                >
                  <MaterialIcons name="close" size={24} color={textMain} />
                </TouchableOpacity>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 40 }}
              >
                {history.length > 0 ? (
                  history.map((record) => (
                    <View
                      key={record.id}
                      style={[
                        styles.historyItem,
                        { backgroundColor: cardBg, borderColor },
                      ]}
                    >
                      <View style={styles.historyItemHeader}>
                        <Text style={[styles.historyDate, { color: textSub }]}>
                          {new Date(record.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </Text>
                        <View
                          style={[
                            styles.historyBadge,
                            {
                              backgroundColor:
                                record.status === "Normal"
                                  ? "rgba(0, 255, 157, 0.1)"
                                  : "rgba(255, 152, 0, 0.1)",
                            },
                          ]}
                        >
                          <Text
                            style={[
                              styles.historyBadgeText,
                              {
                                color:
                                  record.status === "Normal"
                                    ? PRIMARY
                                    : "#ff9800",
                              },
                            ]}
                          >
                            {record.status}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.historyRow}>
                        <View style={styles.historyBlock}>
                          <Text
                            style={[styles.historyLabel, { color: textSub }]}
                          >
                            Weight
                          </Text>
                          <Text
                            style={[styles.historyValue, { color: textMain }]}
                          >
                            {record.weight.toFixed(1)} kg
                          </Text>
                        </View>
                        <View style={styles.historyBlock}>
                          <Text
                            style={[styles.historyLabel, { color: textSub }]}
                          >
                            Height
                          </Text>
                          <Text
                            style={[styles.historyValue, { color: textMain }]}
                          >
                            {record.height.toFixed(1)} cm
                          </Text>
                        </View>
                        <View style={styles.historyBlock}>
                          <Text
                            style={[styles.historyLabel, { color: textSub }]}
                          >
                            BMI
                          </Text>
                          <Text
                            style={[styles.historyValue, { color: textMain }]}
                          >
                            {record.bmi.toFixed(1)}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))
                ) : (
                  <View style={styles.emptyHistory}>
                    <MaterialIcons
                      name="monitor-weight"
                      size={48}
                      color={textSub}
                      style={{ opacity: 0.5, marginBottom: 16 }}
                    />
                    <Text style={{ color: textSub, fontSize: 16 }}>
                      No history records yet
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

function ListItem({
  icon,
  title,
  hasChevron,
  rightElement,
  textColor,
  subColor,
  borderColor,
  onPress,
}: {
  icon: any;
  title: string;
  hasChevron?: boolean;
  rightElement?: React.ReactNode;
  textColor?: string;
  subColor?: string;
  borderColor?: string;
  onPress?: () => void;
}) {
  const content = (
    <View
      style={[styles.listItem, { borderBottomColor: borderColor || "#f8fafc" }]}
    >
      <View style={styles.listItemLeft}>
        <MaterialIcons name={icon} size={22} color={subColor || TEXT_SUB} />
        <Text style={[styles.itemTitle, { color: textColor || TEXT_MAIN }]}>
          {title}
        </Text>
      </View>
      {rightElement
        ? rightElement
        : hasChevron && (
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={subColor ? subColor + "80" : "#cbd5e1"}
            />
          )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: TEXT_MAIN,
    letterSpacing: -0.5,
  },
  headerButton: {
    width: 40,
    alignItems: "flex-end",
  },
  headerButtonLeft: {
    width: 40,
    alignItems: "flex-start",
  },
  scrollContent: {
    paddingBottom: 28,
  },
  profileSection: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    alignItems: "center",
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 24,
    width: 104,
    height: 104,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: "white",
    padding: 4,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  editIconContainer: {
    position: "absolute",
    bottom: 4,
    backgroundColor: PRIMARY,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: TEXT_MAIN,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 14,
    fontWeight: "500",
    color: TEXT_SUB,
  },
  statsGrid: {
    paddingHorizontal: 24,
    marginBottom: 32,
    flexDirection: "row",
    gap: 16, // Gap support in newer React Native
  },
  statCard: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 4,
    marginBottom: 16,
  },
  statValue: {
    fontSize: 30,
    fontWeight: "900",
    letterSpacing: -1,
  },
  statStatus: {
    fontSize: 12,
    fontWeight: "700",
  },
  statSubValue: {
    fontSize: 12,
    fontWeight: "700",
  },
  progressBarBg: {
    height: 6,
    width: "100%",
    backgroundColor: "#f1f5f9",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "900",
    color: TEXT_SUB,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  listContainer: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.02,
    shadowRadius: 2,
    elevation: 1,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f8fafc",
  },
  listItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: TEXT_MAIN,
  },
  toggleSwitch: {
    width: 40,
    height: 22,
    backgroundColor: PRIMARY,
    borderRadius: 11,
    padding: 2,
    justifyContent: "center",
  },
  toggleKnob: {
    width: 18,
    height: 18,
    backgroundColor: "white",
    borderRadius: 9,
    alignSelf: "flex-end",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  toggleGroup: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
    padding: 2,
    borderRadius: 8,
    gap: 4,
  },
  toggleOptionActive: {
    backgroundColor: "white",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  toggleTextActive: {
    fontSize: 10,
    fontWeight: "700",
    color: TEXT_MAIN,
  },
  toggleTextInactive: {
    fontSize: 10,
    fontWeight: "500",
    color: TEXT_SUB,
    paddingHorizontal: 8,
  },
  valueText: {
    fontSize: 13,
    fontWeight: "500",
    color: TEXT_SUB,
  },
  footer: {
    alignItems: "center",
    marginTop: 16,
    opacity: 0.5,
  },
  footerText: {
    fontSize: 10,
    fontWeight: "700",
    flexDirection: "row",
    alignItems: "center",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    padding: 24,
    paddingBottom: 48,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 20,
    textAlign: "center",
  },
  modalOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(150,150,150,0.1)",
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: "600",
  },
  privacyModalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  privacyModalContent: {
    height: "85%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 20,
    borderTopWidth: 1,
  },
  privacyModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  privacyModalTitle: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  closeButton: {
    padding: 4,
    backgroundColor: "rgba(150,150,150,0.1)",
    borderRadius: 20,
  },
  privacyScroll: {
    flex: 1,
  },
  privacyText: {
    fontSize: 15,
    lineHeight: 24,
    paddingBottom: 40,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontWeight: "500",
  },
  genderRow: {
    flexDirection: "row",
    gap: 8,
  },
  genderBtn: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
  },
  saveBtn: {
    marginTop: 10,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: "800",
  },
  historyItem: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  historyItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  historyDate: {
    fontSize: 14,
    fontWeight: "600",
  },
  historyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  historyBadgeText: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historyBlock: {
    alignItems: "center",
    flex: 1,
  },
  historyLabel: {
    fontSize: 11,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  historyValue: {
    fontSize: 18,
    fontWeight: "800",
  },
  emptyHistory: {
    alignItems: "center",
    marginTop: 60,
  },
});
