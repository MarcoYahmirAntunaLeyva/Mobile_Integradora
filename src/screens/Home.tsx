import React, { useState, useEffect } from "react";
import { View, Text, Image, ScrollView} from "react-native";
import { useNavigation } from '@react-navigation/native';
import styles from "../styles/homeStyles";
import { Card } from "react-native-paper";
import Camera from "../components/camera";

const Home = () => {
  const navigation = useNavigation();
  const [sensorData, setSensorData] = useState({
    latest: { ph: 0, temperature: 0, conductivity: 0, level: 0 },
    history: []
  });

  // Fetch data from the backend with polling
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch latest register
        const latestResponse = await fetch('https://hostbackend-production-06a9.up.railway.app/api/labView/lastRegister', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const latestResult = await latestResponse.json();
        
        // Fetch last 5 registers for history
        const historyResponse = await fetch('https://hostbackend-production-06a9.up.railway.app/api/labView/allRegisters?limit=5', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const historyResult = await historyResponse.json();

        if (latestResult.data && latestResult.data.sensors && latestResult.data.sensors.length > 0) {
          const latestSensor = latestResult.data.sensors[0];
          setSensorData({
            latest: {
              ph: latestSensor.ph || 0,
              temperature: latestSensor.temperature || 0,
              conductivity: latestSensor.conductivity || 0,
              level: latestSensor.level || 0
            },
            history: historyResult.data || []
          });
        }
      } catch (error) {
        console.error('Error fetching sensor data:', error);
      }
    };

    // Fetch data immediately
    fetchData();
    
    // Set up polling every second
    const intervalId = setInterval(fetchData, 1000);
    
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

      {/* Image */}
      <Card style={styles.card}>
        <Camera />
      </Card>

      {/* PH Level */}
      <View style={styles.phContainer}>
        <Text style={styles.phLabel}>Level</Text>
        
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBar}>
        <View style={[
          styles.progressFill,
          { width: `${(sensorData.latest.level / 1) * 25}%` }
        ]} />
      </View>

      {/* Metrics */}
      <View style={styles.metricsContainer}>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Temperature</Text>
          <Text style={styles.metricValue}>{Math.round(sensorData.latest.temperature)}°C</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricLabel}>Conductivity</Text>
          <Text style={styles.metricValue}>{Math.round(sensorData.latest.conductivity)} µs</Text>
        </View>
      </View>

      {/* History Table */}
      <View style={styles.tableContainer}>
        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Time</Text>
          <Text style={styles.headerCell}>Temp</Text>
          <Text style={styles.headerCell}>Cond.</Text>
          <Text style={styles.headerCell}>PH</Text>
        </View>

        {/* Table Rows - Limited to last 5 records */}
        {sensorData.history.slice(0, 5).map((item, index) => {
          const sensor = item.sensors && item.sensors.length > 0 ? item.sensors[0] : null;
          return (
            <View key={`row-${index}`} style={[
              styles.tableRow,
              index % 2 === 0 ? styles.evenRow : styles.oddRow
            ]}>
              <Text style={styles.tableCell}>{formatTime(item.createDate)}</Text>
              <Text style={styles.tableCell}>{sensor ? Math.round(sensor.temperature) : 0}°C</Text>
              <Text style={styles.tableCell}>{sensor ? Math.round(sensor.conductivity) : 0} µs</Text>
              <Text style={styles.tableCell}>{sensor ? Math.round(sensor.ph) : 0}%</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default Home;