import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/historyStyles";

const History = () => {
  const navigation = useNavigation();
  const [sensorData, setSensorData] = useState([]);

  // Fetch data from the backend with polling
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://hostbackend-production-06a9.up.railway.app/api/labView/allRegisters', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const result = await response.json();
        setSensorData(result.data || []);
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    // Fetch data immediately
    fetchData();
    
    // Set up polling every 5 seconds (less frequent than control screen)
    const intervalId = setInterval(fetchData, 5000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to format time from date
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>SUUDAI</Text>
      </View>

      <Text style={styles.title}>Historial Completo</Text>

      {/* History Table */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Time</Text>
          <Text style={styles.headerCell}>Temp</Text>
          <Text style={styles.headerCell}>Cond.</Text>
          <Text style={styles.headerCell}>PH</Text>
          {/* <Text style={styles.headerCell}>Level</Text> */}
        </View>

        {/* Table Rows */}
        {sensorData.map((item, index) => {
          const sensor = item.sensors && item.sensors.length > 0 ? item.sensors[0] : null;
          return (
            <View key={`row-${index}`} style={[
              styles.tableRow,
              index % 2 === 0 ? styles.evenRow : styles.oddRow
            ]}>
              <Text style={styles.tableCell}>{formatTime(item.createDate)}</Text>
              <Text style={styles.tableCell}>{sensor ? Math.round(sensor.temperature) : 0}°C</Text>
              <Text style={styles.tableCell}>{sensor ? Math.round(sensor.conductivity) : 0} µS</Text>
              <Text style={styles.tableCell}>{sensor ? Math.round(sensor.ph) : 0}%</Text>
              {/* <Text style={styles.tableCell}>{sensor ? Math.round(sensor.level) : 0}%</Text> */}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default History;