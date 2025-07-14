import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import styles from "../styles/styles";

const LoadingComponent: React.FC = () => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#2E7D32" />
      <Text style={styles.loadingText}>Verificando sesión...</Text>
    </View>
  );
};

export default LoadingComponent;