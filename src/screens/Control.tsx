import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions, Animated } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Control Component
const Control = () => {
  const navigation = useNavigation();
  const [sensorData, setSensorData] = useState({
    latest: { phLevel: 0, phPercent: "0%", temperature: 0, humidity: 0 },
    history: []
  });
  const [motorStates, setMotorStates] = useState([
    { motor: 1, name: "Bomba Riego", state: false },
    { motor: 2, name: "Agitación", state: false },
    { motor: 3, name: "Cascada", state: false },
    { motor: 4, name: "Mosquitos", state: false }
  ]);
  const animatedValues = motorStates.map(() => new Animated.Value(0));

  // Fetch sensor data from the backend
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch('http://192.168.1.72:3006/api/dataSensors', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        setSensorData({
          latest: {
            phLevel: result.latest.phLevel || 0,
            phPercent: result.latest.phPercent || "0%",
            temperature: result.latest.temperature || 0,
            humidity: result.latest.humidity || 0
          },
          history: result.history || []
        });
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    // Fetch initial motor states
    const fetchMotorStates = async () => {
      try {
        const response = await fetch('http://172.20.140.110:3006/api/motorControl', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        setMotorStates(result.motors || motorStates);
        // Update animations based on initial states
        result.motors.forEach((motor, index) => {
          animatedValues[index].setValue(motor.state ? 1 : 0);
        });
      } catch (error) {
        console.error('Error fetching motor states:', error);
      }
    };

    fetchSensorData();
    fetchMotorStates();
  }, []);

  // Function to toggle motor state
  const toggleMotor = async (motorNumber, index) => {
    const currentState = motorStates.find(m => m.motor === motorNumber).state;
    const newState = !currentState;
    try {
      const response = await fetch('http://192.168.1.72:3006/api/motorControl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ motor: motorNumber, state: newState }),
      });
      const result = await response.json();
      setMotorStates(result.motors || motorStates.map(m =>
        m.motor === motorNumber ? { ...m, state: newState } : m
      ));
      
      // Animate switch
      Animated.timing(animatedValues[index], {
        toValue: newState ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } catch (error) {
      console.error(`Error toggling motor ${motorNumber}:`, error);
    }
  };

  // Combined data structure for FlatList
  const screenData = [
    { type: "header", key: "header" },
    { type: "image", key: "image" },
    { type: "ph", key: "ph" },
    { type: "progress", key: "progress" },
    { type: "metrics", key: "metrics" },
    ...sensorData.history.map((item, index) => ({ type: "phData", ...item, key: `phData-${index}` })),
    { type: "switches", key: "switches" },
  ];

  const renderItem = ({ item }) => {
    switch (item.type) {
      case "header":
        return (
          <View style={styles.header}>
            <Text style={styles.headerText}>SUUDAI</Text>
          </View>
        );
      case "image":
        return (
          <Image
            style={styles.topImage}
            source={{
              uri: "https://www.naturespath.com/wp-content/uploads/2020/01/Indoor-Garden.jpg",
            }}
          />
        );
      case "ph":
        return (
          <View style={styles.phContainer}>
            <Text style={styles.phLabel}>PH Level</Text>
            <Text style={styles.phPercent}>{sensorData.latest.phPercent}</Text>
          </View>
        );
      case "progress":
        return (
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: sensorData.latest.phPercent }]} />
          </View>
        );
      case "metrics":
        return (
          <View style={styles.metricsContainer}>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Temperature</Text>
              <Text style={styles.metricValue}>{sensorData.latest.temperature}°C</Text>
            </View>
            <View style={styles.metricBox}>
              <Text style={styles.metricLabel}>Humidity</Text>
              <Text style={styles.metricValue}>{sensorData.latest.humidity}%</Text>
            </View>
          </View>
        );
      case "phData":
        return (
          <View style={styles.listRow}>
            <Text style={styles.listText}>PH: {item.ph}</Text>
            <Text style={styles.listValue}>{item.value}</Text>
          </View>
        );
      case "switches":
        return (
          <View style={styles.switchContainer}>
            {motorStates.map((motor, index) => {
              const translateX = animatedValues[index].interpolate({
                inputRange: [0, 1],
                outputRange: [2, 24],
              });
              return (
                <View key={motor.motor} style={styles.switchRow}>
                  <Text style={styles.switchLabel}>{motor.name}</Text>
                  <TouchableOpacity
                    style={[
                      styles.switch,
                      { backgroundColor: motor.state ? '#2ECC71' : '#E0E0E0' }
                    ]}
                    onPress={() => toggleMotor(motor.motor, index)}
                  >
                    <Animated.View style={styles.switchHandle}/>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={screenData}
        keyExtractor={(item) => item.key}
        renderItem={renderItem}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

// Styles
const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  header: {
    backgroundColor: "#2ECC71",
    paddingVertical: 15,
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: isSmallDevice ? 22 : 24,
    fontWeight: "bold",
  },
  topImage: {
    width: "100%",
    height: isSmallDevice ? 120 : 150,
  },
  phContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
  },
  phLabel: {
    fontSize: isSmallDevice ? 16 : 18,
    color: "#333",
    fontWeight: "500",
  },
  phPercent: {
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: "bold",
    color: "#2ECC71",
  },
  progressBar: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    marginHorizontal: 20,
    marginVertical: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2ECC71",
    borderRadius: 5,
  },
  metricsContainer: {
    flexDirection: isSmallDevice ? "column" : "row",
    justifyContent: "space-around",
    marginVertical: 20,
    alignItems: isSmallDevice ? "center" : "flex-start",
  },
  metricBox: {
    backgroundColor: "#A5D6A7",
    borderRadius: 15,
    padding: 15,
    width: isSmallDevice ? width * 0.8 : width * 0.4,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    marginBottom: isSmallDevice ? 10 : 0,
  },
  metricLabel: {
    fontSize: isSmallDevice ? 14 : 16,
    color: "#fff",
    textAlign: "center",
  },
  metricValue: {
    fontSize: isSmallDevice ? 20 : 24,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 5,
  },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 8,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  listText: {
    fontSize: isSmallDevice ? 14 : 16,
    color: "#2ECC71",
  },
  listValue: {
    fontSize: isSmallDevice ? 14 : 16,
    color: "#2ECC71",
  },
  switchContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: isSmallDevice ? 14 : 16,
    color: "#333",
    fontWeight: "500",
  },
  switch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    padding: 2,
  },
  switchHandle: {
    width: 24,
    height: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  }
});

export default Control;