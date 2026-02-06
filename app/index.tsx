import Onboarding from "@/components/Onboarding";
import SplashScreen from "@/components/SplashScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

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

  const handleReplay = async () => {
    // Reset for demo purposes
    await AsyncStorage.removeItem("hasOnboarded");
    setShowSplash(true);
    setShowOnboarding(false);
  };

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

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.text}>BMI Go</Text>
      <Text style={styles.subtext}>Welcome to the App</Text>

      <TouchableOpacity style={styles.button} onPress={handleReplay}>
        <Text style={styles.buttonText}>Replay Splash Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
    backgroundColor: "#fff", // Or adapt to theme
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
  },
  subtext: {
    fontSize: 16,
    color: "#666",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#00ff9d",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    color: "#0c1d16",
    fontWeight: "bold",
    fontSize: 16,
  },
});
