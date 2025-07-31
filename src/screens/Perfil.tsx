// Perfil.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/perfilStyles";

const Perfil = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    role: "Default",
    _id: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No se encontró token de acceso");
      }

      // Decodificar el token para obtener el userId
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const decodedToken = JSON.parse(jsonPayload);

      if (!decodedToken || !decodedToken.userId) {
        throw new Error("Token inválido");
      }

      const response = await fetch(
        `https://hostbackend-production-06a9.up.railway.app/api/users/getUserbyId/${decodedToken.userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener datos del usuario");
      }

      const data = await response.json();
      if (data.userPK) {
        setUserData({
          firstName: data.userPK.firstName || "",
          middleName: data.userPK.middleName || "",
          lastName: data.userPK.lastName || "",
          email: data.userPK.email || "",
          phoneNumber: data.userPK.phoneNumber?.toString() || "",
          role: data.userPK.role || "Default1",
          _id: data.userPK._id || "",
        });
      } else {
        throw new Error("Datos de usuario no encontrados");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert(
        "Error", 
        "No se pudo cargar la información del perfil. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("accessToken");
      navigation.replace("Login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      Alert.alert("Error", "No se pudo cerrar sesión.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2ECC71" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
          <Text style={styles.headerText}>SUUDAI</Text>
      </View>
      <LinearGradient
        colors={["#00B0FF","#00C853"]}
        style={styles.profileHeader}
      >
        <Image
          style={styles.avatar}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
          }}
        />
        <Text style={styles.name}>
          {`${userData.middleName}`.trim() || "Usuario"}
        </Text>
        <Text style={styles.email}>{userData.email || "greenhouse@gmail.com"}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {userData.role === "Adm1ni$trad0r"
              ? "Administrador"
              : userData.role === "M4ntenim1ent0"
              ? "Mantenimiento"
              : userData.role === "Default"
              ? "Default"
              : "Default"}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Información Personal</Text>
        <View style={styles.infoGroup}>
        </View>
        <View style={styles.infoGroup}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoText}>
            {userData.email || "No disponible"}
          </Text>
        </View>
        <View style={styles.infoGroup}>
          <Text style={styles.infoLabel}>Teléfono</Text>
          <Text style={styles.infoText}>
            {userData.phoneNumber || "No disponible"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate("EditProfile", { userData })}
        >
          <Text style={styles.editText}>Editar Perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
export default Perfil;