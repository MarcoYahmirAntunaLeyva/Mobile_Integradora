import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SesionQr = () => {
  const navigation = useNavigation(); // Initialize navigation

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sesión con QR</Text>
      <Text style={styles.maintenance}>Mantenimiento</Text>
      <View style={styles.outerSquare}>
        <View style={styles.innerSquare} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E0F2E9", // Light green from image
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginBottom: 10,
    color: "#000000",
  },
  maintenance: {
    fontSize: 16,
    color: "#666666",
    marginBottom: 20,
  },
  outerSquare: {
    width: 300,
    height: 300,
    backgroundColor: "#C8E6C9", // Grayish-green from image
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#000000",
  },
  innerSquare: {
    width: 250,
    height: 250,
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    borderColor: "#000000",
    borderStyle: "dashed",
  },
});

export default SesionQr;