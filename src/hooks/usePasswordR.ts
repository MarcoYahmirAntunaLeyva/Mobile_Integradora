import { useState } from "react";
import { Alert } from "react-native";

const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [step, setStep] = useState<"request" | "reset">("request");

  const requestReset = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor ingresa tu correo electrónico");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://hostbackend-production-06a9.up.railway.app/api/users/request/passwordReset`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Correo enviado",
          "Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico."
        );
        setStep("reset");
      } else {
        Alert.alert("Error", data.message || "Error al solicitar el restablecimiento");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Las contraseñas no coinciden");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://hostbackend-production-06a9.up.railway.app/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        Alert.alert(
          "Contraseña actualizada",
          "Tu contraseña ha sido actualizada correctamente."
        );
        setStep("request");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        Alert.alert("Error", data.message || "Error al restablecer la contraseña");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    email,
    setEmail,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    token,
    setToken,
    step,
    isLoading,
    requestReset,
    resetPassword,
  };
};

export default usePasswordReset;
