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
  ActivityIndicator
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const EditProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userData } = route.params;
  const [formData, setFormData] = useState({
    firstName: userData.firstName || "",
    middleName: userData.middleName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    phoneNumber: userData.phoneNumber || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Validar que las contraseñas coincidan si se están cambiando
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
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
        currentPassword: formData.currentPassword,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        newPassword: formData.newPassword || undefined
      };

      const response = await fetch(
        `http://192.168.1.72:3006/api/users/updateDataUserByUser`,
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
        error.message || "No se pudo actualizar el perfil. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      {[
        { label: "Nombre", field: "firstName", editable: false },
        { label: "Segundo Nombre", field: "middleName", editable: false },
        { label: "Apellido", field: "lastName", editable: false },
        { label: "Email", field: "email" },
        { label: "Teléfono", field: "phoneNumber" },
      ].map(({ label, field, editable = true }) => (
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

      <Text style={styles.sectionTitle}>Cambiar Contraseña</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Contraseña Actual</Text>
        <TextInput
          style={styles.input}
          value={formData.currentPassword}
          onChangeText={(value) => handleChange("currentPassword", value)}
          secureTextEntry
          placeholder="Ingresa tu contraseña actual"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nueva Contraseña</Text>
        <TextInput
          style={styles.input}
          value={formData.newPassword}
          onChangeText={(value) => handleChange("newPassword", value)}
          secureTextEntry
          placeholder="Ingresa nueva contraseña (mínimo 8 caracteres)"
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

      <TouchableOpacity 
        style={styles.saveButton} 
        onPress={handleSave}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>Guardar Cambios</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
        disabled={isLoading}
      >
        <Text style={styles.cancelText}>Cancelar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#444",
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 14,
    color: "#333",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#888",
  },
  saveButton: {
    backgroundColor: "#2ECC71",
    padding: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: "#B0BEC5",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  cancelText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default EditProfile;