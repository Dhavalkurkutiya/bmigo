import { useHistory } from "@/hooks/useHistory";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

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

  const CIRCLE_SIZE = 120; // Original was 112px + padding = 128px ish
  const STROKE_WIDTH = 8;
  const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const progress = 0.72; // 72%
  const offset = CIRCUMFERENCE - progress * CIRCUMFERENCE;

  const currentRecord = history && history.length > 0 ? history[0] : null;
  const currentBmi = currentRecord ? currentRecord.bmi.toFixed(1) : "--";
  const currentStatus = currentRecord ? currentRecord.status : "No Data";
  const bmiProgress = currentRecord
    ? Math.min((currentRecord.bmi / 40) * 100, 100)
    : 0;

  return (
    <View style={[styles.safeArea, { backgroundColor: bgMain }]}>
      <View style={[styles.container, { backgroundColor: bgMain }]}>
        {/* Header */}
        {/* <View style={styles.header}>
          <TouchableOpacity
            onPress={() => (onBack ? onBack() : router.back())}
            style={styles.headerButtonLeft}
          >
            <MaterialIcons name="arrow-back-ios" size={20} color={TEXT_MAIN} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Health Hub</Text>
          <TouchableOpacity style={styles.headerButton}>
            <MaterialIcons
              name="notifications-none"
              size={24}
              color={TEXT_MAIN}
            />
          </TouchableOpacity>
        </View> */}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Section */}
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {/* Ring */}
              <View
                style={[
                  styles.ringContainer,
                  { transform: [{ rotate: "-120deg" }] },
                ]}
              >
                <Svg height={CIRCLE_SIZE} width={CIRCLE_SIZE}>
                  <Circle
                    cx={CIRCLE_SIZE / 2}
                    cy={CIRCLE_SIZE / 2}
                    r={RADIUS}
                    stroke={isDark ? "#334155" : "#e2e8f0"}
                    strokeWidth={STROKE_WIDTH}
                    fill="transparent"
                  />
                  <Circle
                    cx={CIRCLE_SIZE / 2}
                    cy={CIRCLE_SIZE / 2}
                    r={RADIUS}
                    stroke={PRIMARY}
                    strokeWidth={STROKE_WIDTH}
                    fill="transparent"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={offset}
                    strokeLinecap="round" // Optional, design seems sharp but round is nicer
                  />
                </Svg>
              </View>

              {/* Avatar Image */}
              <View style={styles.imageWrapper}>
                <Image
                  source={{
                    uri: "https://avatars.githubusercontent.com/u/57305529?v=4",
                  }}
                  style={styles.avatarImage}
                />
              </View>

              {/* Pro Badge */}
              <View style={[styles.proBadge, { borderColor: cardBg }]}>
                <Text style={styles.proText}>PRO</Text>
              </View>
            </View>

            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: textMain }]}>
                Dhaval Kurkutia
              </Text>
              <Text style={[styles.userMeta, { color: textSub }]}>
                Joined Jan 2026 • Daily Tracker
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
                <Text style={[styles.statValue, { color: textMain }]}>84%</Text>
                <Text style={[styles.statSubValue, { color: textSub }]}>
                  -2.4kg
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
                    { width: "84%", backgroundColor: SECONDARY },
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
              />
              <ListItem
                icon="history"
                title="Weight History"
                hasChevron
                textColor={textMain}
                subColor={textSub}
                borderColor={isDark ? DARK_BORDER : "#f8fafc"}
              />
              <ListItem
                icon="sync"
                title="Apple Health Sync"
                textColor={textMain}
                subColor={textSub}
                borderColor={isDark ? DARK_BORDER : "#f8fafc"}
                rightElement={
                  <View style={styles.toggleSwitch}>
                    <View style={styles.toggleKnob} />
                  </View>
                }
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
                icon="straighten"
                title="Units"
                textColor={textMain}
                subColor={textSub}
                borderColor={isDark ? DARK_BORDER : "#f8fafc"}
                rightElement={
                  <View
                    style={[
                      styles.toggleGroup,
                      { backgroundColor: isDark ? "#2E3032" : "#f1f5f9" },
                    ]}
                  >
                    <View
                      style={[
                        styles.toggleOptionActive,
                        { backgroundColor: isDark ? "#475569" : "white" },
                      ]}
                    >
                      <Text
                        style={[
                          styles.toggleTextActive,
                          { color: isDark ? "white" : TEXT_MAIN },
                        ]}
                      >
                        Metric
                      </Text>
                    </View>
                    <Text style={styles.toggleTextInactive}>Imperial</Text>
                  </View>
                }
              />
              <ListItem
                icon="brightness-6" // dark_mode -> brightness-6 or similar
                title="Display Mode"
                textColor={textMain}
                subColor={textSub}
                borderColor={isDark ? DARK_BORDER : "#f8fafc"}
                rightElement={
                  <Text style={[styles.valueText, { color: textSub }]}>
                    System
                  </Text>
                }
              />
            </View>
          </View>

          {/* Privacy Section (Modern) */}
          <View style={styles.section}>
            <View
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
            </View>
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
      </View>
    </View>
  );
}

// Helper Component for List Items
function ListItem({
  icon,
  title,
  hasChevron,
  rightElement,
  textColor,
  subColor,
  borderColor,
}: {
  icon: any;
  title: string;
  hasChevron?: boolean;
  rightElement?: React.ReactNode;
  textColor?: string;
  subColor?: string;
  borderColor?: string;
}) {
  return (
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
    width: 120, // Match CIRCLE_SIZE
    height: 120,
    justifyContent: "center",
    alignItems: "center",
  },
  ringContainer: {
    position: "absolute",
    // Center it
    top: 0,
    left: 0,
  },
  imageWrapper: {
    width: 104, // 112px in HTML (w-28 h-28) minus padding?
    // HTML: w-28 (7rem=112px). p-1.
    // Here let's make it fit nicely inside the ring.
    // If ring is 120, R=56.
    // Image should be slightly smaller.
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
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
  },
  proBadge: {
    position: "absolute",
    bottom: -4,
    right: 8,
    backgroundColor: PRIMARY,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "white",
    zIndex: 10,
    elevation: 3,
  },
  proText: {
    color: "#0f172a",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
});
