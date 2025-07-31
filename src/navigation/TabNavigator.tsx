import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Home from '../screens/Home';
import History from '../screens/History';
import Control from '../screens/Control';
import ProfileStack from './ProfileNav'; 
import QR2 from '../screens/SesionQR'; 

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  // Function to decode JWT token
  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  // Check user role on component mount
  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const token = await AsyncStorage.getItem("accessToken");
        if (token) {
          const decoded = decodeToken(token);
          if (decoded && decoded.role === "Adm1ni$trad0r") {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking user role:", error);
        setIsAdmin(false);
      }
    };

    checkUserRole();
  }, []);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName: string;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'QR':
              iconName = 'qr-code-2';
              break;
            case 'History':
              iconName = 'history';
              break;
            case 'Control':
              iconName = 'settings';
              break;
            case 'Profile':
              iconName = 'person';
              break;
            default:
              iconName = 'help'; // fallback icon name
              break;
          }
          return (
            <View style={[styles.iconContainer, focused && styles.iconContainerFocused]}>
              <Icon name={iconName} size={24} style={[styles.icon, focused && styles.iconFocused]} />
            </View>
          );
        },
        tabBarActiveTintColor: '#2ECC71', // Match the app's green theme
        tabBarInactiveTintColor: '#A5D6A7', // Lighter green for inactive
        tabBarShowLabel: true,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 2,
          borderTopColor: '#e0e0e0',
          paddingBottom: 5,
          paddingTop: 5,
        },
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      {isAdmin && <Tab.Screen name="Control" component={Control} />}
      <Tab.Screen name="QR" component={QR2} />
      {isAdmin && <Tab.Screen name="History" component={History} />}
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  iconContainerFocused: {
    backgroundColor: '#E8F5E9', // Light green background when focused
  },
  icon: {
    fontSize: 24,
    color: '#B0BEC5', // Light Gray
  },
  iconFocused: {
    color: '#2ECC71', // Match the app's green theme
  },
});

export default TabNavigator;