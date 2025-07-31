import React from "react";
import { View, Image, ImageBackground, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";
import styles from "../styles/loginStyles";

const HeaderComponent: React.FC = () => {
  return (
    <View style={styles.logoWrapper}>
      <ImageBackground
        source={require("../../assets/fondo.png")}
        style={styles.logoContainer}
        resizeMode="cover"
      >
        <BlurView intensity={20} style={styles.blurView}>
          <Image
            source={require("../../assets/logo.png")}
            style={styles.logo}
          />
        </BlurView>
      </ImageBackground>
    </View>
  );
};

export default HeaderComponent;