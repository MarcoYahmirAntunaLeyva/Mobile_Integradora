// EditProfile.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/editStyles";

const EditProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userData } = route.params;
  const [formData, setFormData] = useState({
    email: userData.email || "",
    phoneNumber: userData.phoneNumber || "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);

      if (
        formData.newPassword &&
        formData.newPassword !== formData.confirmPassword
      ) {
        Alert.alert("Error", "Las contraseñas no coinciden");
        setIsLoading(false);
        return;
      }

      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        throw new Error("No se encontró token de acceso");
      }

      // Preparar datos para enviar al backend
      const requestBody = {
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        newPassword: formData.newPassword || undefined,
      };

      const response = await fetch(
        `https://hostbackend-production-06a9.up.railway.app/api/users/updateDataUserByUser`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al actualizar perfil");
      }

      Alert.alert("Éxito", "Perfil actualizado correctamente");
      navigation.goBack();
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      Alert.alert(
        "Error",
        error.message ||
          "No se pudo actualizar el perfil. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SUUDAI</Text>
      </View>
            <LinearGradient
              colors={["#00B0FF", "#00C853"]}
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
      <Text style={styles.title}>Editar Informacion</Text>
      {[
        { label: "Email", field: "email", editable: true },
        { label: "Teléfono", field: "phoneNumber", editable: true },
      ].map(({ label, field, editable }) => (
        <View style={styles.inputGroup} key={field}>
          <Text style={styles.label}>{label}</Text>
          <TextInput
            style={[styles.input, !editable && styles.disabledInput]}
            value={formData[field]}
            onChangeText={(value) => handleChange(field, value)}
            editable={editable}
            keyboardType={field === "phoneNumber" ? "phone-pad" : "default"}
          />
        </View>
      ))}

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nueva Contraseña</Text>
        <TextInput
          style={styles.input}
          value={formData.newPassword}
          onChangeText={(value) => handleChange("newPassword", value)}
          secureTextEntry
          placeholder="Ingresa nueva contraseña"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirmar Contraseña</Text>
        <TextInput
          style={styles.input}
          value={formData.confirmPassword}
          onChangeText={(value) => handleChange("confirmPassword", value)}
          secureTextEntry
          placeholder="Confirma tu nueva contraseña"
        />
      </View>
      <View style={styles.buttonContainer}>
      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSave}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Guardar</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Cancelar</Text>
      </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

export default EditProfile;
