import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';

// History Component
const History = () => {
  const navigation = useNavigation();
  const [sensorData, setSensorData] = useState([]);

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
        setSensorData(result.history || []);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.listRow}>
      <Text style={styles.listText}>PH: {item.ph}</Text>
      <Text style={styles.listValue}>{item.value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial</Text>
      <FlatList
        data={sensorData}
        keyExtractor={(item, index) => `phData-${index}`}
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
    paddingTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#2ECC71",
  },
  contentContainer: {
    paddingHorizontal: 20,
  },
  listRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  listText: {
    fontSize: 16,
    color: "#333",
  },
  listValue: {
    fontSize: 16,
    color: "#2ECC71",
  },
});

export default History;