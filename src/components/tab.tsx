import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import styles from "../styles/styles";

interface TabSelectorProps {
  selectedTab: "login" | "register";
  setSelectedTab: (tab: "login" | "register") => void;
  setError: (error: string) => void;
}

const TabSelectorComponent: React.FC<TabSelectorProps> = ({
  selectedTab,
  setSelectedTab,
  setError,
}) => {
  return (
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tabButton,
          selectedTab === "login" && styles.activeTab,
        ]}
        onPress={() => {
          setSelectedTab("login");
          setError("");
        }}
      >
        <Text
          style={[
            styles.tabText,
            selectedTab === "login" && styles.activeTabText,
          ]}
        >
          Iniciar Sesión
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.tabButton,
          selectedTab === "register" && styles.activeTab,
        ]}
        onPress={() => {
          setSelectedTab("register");
          setError("");
        }}
      >
        <Text
          style={[
            styles.tabText,
            selectedTab === "register" && styles.activeTabText,
          ]}
        >
          Registrarse
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TabSelectorComponent;