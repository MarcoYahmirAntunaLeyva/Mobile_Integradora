import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Home from '../screens/Home';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = 'home';
              break;
            case 'QR':
              iconName = 'qr-code-2';
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
        tabBarShowLabel: false,
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
      {/* <Tab.Screen name="QR" component={ScanQR} /> */}
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