import BMICalculator, { BMIInputData } from "@/components/BMICalculator";
import BMIResult from "@/components/BMIResult";
import Onboarding from "@/components/Onboarding";
import SplashScreen from "@/components/SplashScreen";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ExpoSplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Alert, BackHandler, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [bmiData, setBmiData] = useState<BMIInputData | null>(null);

  useEffect(() => {
    // Hide native splash screen once the custom splash is mounted
    const hideNativeSplash = async () => {
      try {
        await ExpoSplashScreen.hideAsync();
      } catch (e) {
        console.warn("Error hiding splash screen:", e);
      }
    };

    hideNativeSplash();
  }, []);

  useEffect(() => {
    const checkOnboarding = async () => {
      // Minimum delay for splash animation
      const minDelay = new Promise((resolve) => setTimeout(resolve, 3000));
      const [storageStatus] = await Promise.all([
        AsyncStorage.getItem("hasOnboarded"),
        minDelay,
      ]);

      if (storageStatus === "true") {
        setShowOnboarding(false);
      } else {
        setShowOnboarding(true);
      }
      setShowSplash(false);
    };

    if (showSplash) {
      checkOnboarding();
    }
  }, [showSplash]);

  useEffect(() => {
    const backAction = () => {
      if (bmiData) {
        setBmiData(null);
        return true;
      }

      Alert.alert("Exit App", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel",
        },
        { text: "YES", onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => backHandler.remove();
  }, [bmiData]);

  const handleOnboardingFinish = async () => {
    await AsyncStorage.setItem("hasOnboarded", "true");
    setShowOnboarding(false);
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  if (showOnboarding) {
    return <Onboarding onFinish={handleOnboardingFinish} />;
  }

  if (bmiData) {
    return <BMIResult data={bmiData} onReset={() => setBmiData(null)} />;
  }

  return (
    <View style={[styles.container, isDark && styles.darkContainer]}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <SafeAreaView style={styles.safeArea}>
        <BMICalculator onCalculate={setBmiData} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f8f7",
  },
  darkContainer: {
    backgroundColor: "#0d1b16",
  },
  safeArea: {
    flex: 1,
  },
});
