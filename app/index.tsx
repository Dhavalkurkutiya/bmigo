import SplashScreen from "@/components/SplashScreen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const [showSplash, setShowSplash] = useState(true);

  // Auto-hide splash after 3 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSplash) {
      timer = setTimeout(() => {
        setShowSplash(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showSplash]);

  const handleReplay = () => {
    setShowSplash(true);
  };

  if (showSplash) {
    return <SplashScreen />;
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
