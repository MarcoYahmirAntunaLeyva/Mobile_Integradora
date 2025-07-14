// Perfil.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";

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
        `http://192.168.1.72:3006/api/users/getUserbyId/${decodedToken.userId}`,
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
      <LinearGradient
        colors={["#00C853", "#00B0FF"]}
        style={styles.profileHeader}
      >
        <Image
          style={styles.avatar}
          source={{
            uri: "https://cdn-icons-png.flaticon.com/512/847/847969.png",
          }}
        />
        <Text style={styles.name}>
          {`${userData.firstName} ${userData.middleName} ${userData.lastName}`.trim() || "Usuario"}
        </Text>
        <Text style={styles.email}>{userData.email || "correo@ejemplo.com"}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>
            {userData.role === "Adm1ni$trad0r"
              ? "Administrador"
              : userData.role === "M4ntenim1ent0"
              ? "Mantenimiento"
              : userData.role === "B0t4nic0"
              ? "Botánico"
              : userData.role === "Default"
              ? "Default"
              : "Usuario"}
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>Información Personal</Text>
        <View style={styles.infoGroup}>
          <Text style={styles.infoLabel}>Nombre</Text>
          <Text style={styles.infoText}>
            {userData.firstName || "No disponible"}
          </Text>
        </View>
        <View style={styles.infoGroup}>
          <Text style={styles.infoLabel}>Segundo Nombre</Text>
          <Text style={styles.infoText}>
            {userData.middleName || "No disponible"}
          </Text>
        </View>
        <View style={styles.infoGroup}>
          <Text style={styles.infoLabel}>Apellido</Text>
          <Text style={styles.infoText}>
            {userData.lastName || "No disponible"}
          </Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#e0f7fa",
    marginBottom: 10,
  },
  roleBadge: {
    backgroundColor: "#FFD600",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  roleText: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 12,
  },
  infoSection: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  infoGroup: {
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 14,
    color: "#444",
    marginBottom: 5,
  },
  infoText: {
    fontSize: 14,
    color: "#333",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  editButton: {
    backgroundColor: "#2ECC71",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  editText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Perfil;