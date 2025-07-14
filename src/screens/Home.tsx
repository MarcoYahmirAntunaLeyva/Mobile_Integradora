import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

// Home Component
const Home = () => {
  const navigation = useNavigation();
  const [sensorData, setSensorData] = useState({
    latest: { phLevel: 0, phPercent: "0%", temperature: 0, conductivity: 0 },
    history: []
  });

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://172.20.140.110:3006/api/dataSensors', {
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
            conductivity: result.latest.conductivity || 0
          },
          history: result.history || []
        });
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    fetchData();
  }, []);

  // Combined data structure for FlatList
  const screenData = [
    { type: "header", key: "header" },
    { type: "image", key: "image" },
    { type: "ph", key: "ph" },
    { type: "progress", key: "progress" },
    { type: "metrics", key: "metrics" },
    ...sensorData.history.map((item, index) => ({ type: "phData", ...item, key: `phData-${index}` })),
    { type: "seeMore", key: "seeMore" },
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
              <Text style={styles.metricLabel}>Conductivity</Text>
              <Text style={styles.metricValue}>{sensorData.latest.conductivity}%</Text>
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
      case "seeMore":
        return (
          <TouchableOpacity style={styles.seeMoreButton}>
            <Text style={styles.seeMoreText}>See More</Text>
          </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: "bold",
  },
  topImage: {
    width: "100%",
    height: 150,
  },
  phContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
  },
  phLabel: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
  phPercent: {
    fontSize: 18,
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
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },
  metricBox: {
    backgroundColor: "#A5D6A7",
    borderRadius: 15,
    padding: 15,
    width: width * 0.4,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  metricLabel: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
  metricValue: {
    fontSize: 24,
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
    fontSize: 16,
    color: "#2ECC71",
  },
  listValue: {
    fontSize: 16,
    color: "#2ECC71",
  },
  seeMoreButton: {
    backgroundColor: "#2ECC71",
    alignSelf: "center",
    marginVertical: 20,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  seeMoreText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Home;