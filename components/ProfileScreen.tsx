import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

const PRIMARY = "#00ff9d";
const SECONDARY = "#0ea5e9";
const BACKGROUND_LIGHT = "#f8fafc";
const TEXT_MAIN = "#0f172a";
const TEXT_SUB = "#64748b";

export default function ProfileScreen({ onBack }: { onBack?: () => void }) {
  const CIRCLE_SIZE = 120; // Original was 112px + padding = 128px ish
  const STROKE_WIDTH = 8;
  const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  const progress = 0.72; // 72%
  const offset = CIRCUMFERENCE - progress * CIRCUMFERENCE;

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
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
                    stroke="#e2e8f0"
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
                    uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBXzgMGxuAKGo3FUZ347_bMgzptkQI71COiN9Vi3AuOIzpTHQduD2hoXYToEdqYvpwrR10NdqPUmWorUVMhzjZa2xIhQ2_TDRBVRZhwh2Fe8yKRmXdtE4loui7EsQy_7MVt107gHQ0-RrO9cGJqhb7Hlbb19QuUrYqUOFaf3LCvZimz-NQEyGG8ImR7uuLIaCRBX9Lw22Y0ed0JRIX0Rr-NFMWyPW4j60HMqfPm3lpgNwD0b9gDMcbR9rjzOr1V44xLxNxA0oRFwRUY",
                  }}
                  style={styles.avatarImage}
                />
              </View>

              {/* Pro Badge */}
              <View style={styles.proBadge}>
                <Text style={styles.proText}>PRO</Text>
              </View>
            </View>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>Alex Harrison</Text>
              <Text style={styles.userMeta}>
                Joined Oct 2023 • Daily Tracker
              </Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {/* Current BMI Card */}
            <View style={styles.statCard}>
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
                <Text style={styles.statLabel}>CURRENT BMI</Text>
              </View>
              <View style={styles.statValueRow}>
                <Text style={styles.statValue}>22.4</Text>
                <Text style={[styles.statStatus, { color: PRIMARY }]}>
                  Normal
                </Text>
              </View>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: "72%", backgroundColor: PRIMARY },
                  ]}
                />
              </View>
            </View>

            {/* Goal Progress Card */}
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <View
                  style={[
                    styles.iconCircle,
                    { backgroundColor: "rgba(14, 165, 233, 0.1)" },
                  ]}
                >
                  <MaterialIcons name="flag" size={18} color={SECONDARY} />
                </View>
                <Text style={styles.statLabel}>GOAL PROGRESS</Text>
              </View>
              <View style={styles.statValueRow}>
                <Text style={styles.statValue}>84%</Text>
                <Text style={styles.statSubValue}>-2.4kg</Text>
              </View>
              <View style={styles.progressBarBg}>
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
              <Text style={styles.sectionTitle}>MANAGE YOUR DATA</Text>
              <MaterialIcons name="info-outline" size={16} color="#cbd5e1" />
            </View>

            <View style={styles.listContainer}>
              <ListItem
                icon="person-outline"
                title="Personal Information"
                hasChevron
              />
              <ListItem icon="history" title="Weight History" hasChevron />
              <ListItem
                icon="sync"
                title="Apple Health Sync"
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
                { marginBottom: 12, paddingHorizontal: 4 },
              ]}
            >
              APP PREFERENCES
            </Text>

            <View style={styles.listContainer}>
              <ListItem
                icon="straighten"
                title="Units"
                rightElement={
                  <View style={styles.toggleGroup}>
                    <View style={styles.toggleOptionActive}>
                      <Text style={styles.toggleTextActive}>Metric</Text>
                    </View>
                    <Text style={styles.toggleTextInactive}>Imperial</Text>
                  </View>
                }
              />
              <ListItem
                icon="brightness-6" // dark_mode -> brightness-6 or similar
                title="Display Mode"
                rightElement={<Text style={styles.valueText}>System</Text>}
              />
            </View>
          </View>

          {/* Privacy Section (Modern) */}
          <View style={styles.section}>
            <View
              style={[
                styles.listContainer,
                {
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
                    style={[styles.iconCircle, { backgroundColor: "#f1f5f9" }]}
                  >
                    <MaterialIcons name="security" size={18} color={TEXT_SUB} />
                  </View>
                  <Text style={[styles.itemTitle, { fontWeight: "600" }]}>
                    Privacy & Security
                  </Text>
                </View>
                <MaterialIcons
                  name="arrow-forward-ios"
                  size={16}
                  color="#cbd5e1"
                />
              </View>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              <MaterialIcons name="verified-user" size={14} color="#cbd5e1" />
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
}: {
  icon: any;
  title: string;
  hasChevron?: boolean;
  rightElement?: React.ReactNode;
}) {
  return (
    <View style={styles.listItem}>
      <View style={styles.listItemLeft}>
        <MaterialIcons name={icon} size={22} color={TEXT_SUB} />
        <Text style={styles.itemTitle}>{title}</Text>
      </View>
      {rightElement
        ? rightElement
        : hasChevron && (
            <MaterialIcons name="chevron-right" size={24} color="#cbd5e1" />
          )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BACKGROUND_LIGHT,
  },
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_LIGHT,
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
    backgroundColor: "white",
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
    color: TEXT_SUB,
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
    color: TEXT_MAIN,
    letterSpacing: -1,
  },
  statStatus: {
    fontSize: 12,
    fontWeight: "700",
  },
  statSubValue: {
    fontSize: 12,
    fontWeight: "700",
    color: TEXT_SUB,
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
    backgroundColor: "white",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
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
    color: TEXT_SUB,
    flexDirection: "row",
    alignItems: "center",
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
});
