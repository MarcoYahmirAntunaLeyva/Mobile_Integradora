import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import styles from "../styles/controlStyles";
import {Card} from "react-native-paper";
import Camera from "../components/camera"


const Control = () => {
  const navigation = useNavigation();
  const [motorStates, setMotorStates] = useState([
    { motor: 1, name: "Filtro Cascada", state: false },
    { motor: 2, name: "Sistema de Agitación", state: false },
    { motor: 3, name: "Sistema de Riego", state: false },
    { motor: 4, name: "Sistema de Filtración", state: false },
  ]);
  const animatedValues = motorStates.map(() => new Animated.Value(0));

  const toggleMotor = (motorNumber, index) => {
    const newState = !motorStates.find(m => m.motor === motorNumber).state;
    setMotorStates(prev => 
      prev.map(motor => 
        motor.motor === motorNumber 
          ? { ...motor, state: newState } 
          : motor
      )
    );
    Animated.timing(animatedValues[index], {
      toValue: newState ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>SUUDAI</Text>
      </View>

            {/* Image */}
      <Card style={styles.card}>
        <Camera />
      </Card>

      <View style={styles.lilheader}>
        <Text style={styles.title}>Control de Motores</Text>
      </View>

      {/* Motor Controls */}
      <View style={styles.switchContainer}>
        {motorStates.map((motor, index) => {
          const translateX = animatedValues[index].interpolate({
            inputRange: [0, 1],
            outputRange: [2, 24],
          });
          return (
            <View key={motor.motor} style={styles.switchCard}>
              <Text style={styles.switchLabel}>{motor.name}</Text>
              <TouchableOpacity
                style={[
                  styles.switchTrack,
                  { backgroundColor: motor.state ? "#2ECC71" : "#E74C3C" },
                ]}
                onPress={() => toggleMotor(motor.motor, index)}
              >
                <Animated.View 
                  style={[
                    styles.switchThumb, 
                    { transform: [{ translateX }] }
                  ]} 
                />
                <Text style={styles.stateText}>
                  {motor.state}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};
export default Control;