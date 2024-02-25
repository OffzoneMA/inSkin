import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

export default function Getstarted({ navigation }) {
  const [colorsReversed, setColorsReversed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setColorsReversed(true);
      setTimeout(() => {
        navigation.navigate("AuthNavigator");
      }, 2000); // Redirection après 2 secondes
    }, 5000); // Changement de couleur après 5 secondes

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={colorsReversed ? ["#FFFFFf", "#FFFFFF"] : ["#FB74E2", "#8A0BFF"]}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={[styles.text, styles.shadow, { color: colorsReversed ? "#FB74E2" : "#FFFFFF" }]}>INSKIN</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 40,
    fontWeight: "bold",
  },
  shadow: {
    textShadowColor: "#000000", // Couleur de l'ombre
    textShadowOffset: { width: 0, height: 0 }, // Offset de l'ombre
    textShadowRadius: 5, // Rayon de l'ombre
  },
});
