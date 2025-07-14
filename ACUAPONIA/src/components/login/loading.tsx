// filepath: c:\Users\marco\OneDrive\Desktop\Movil\ACUAPONIA\src\hooks\login\useGoogleAuth.ts
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";

interface GoogleAuthProps {
  setError: (error: string) => void;
  isTokenExpiredLocally: (token: string) => boolean;
}

const useGoogleAuth = ({ setError, isTokenExpiredLocally }: GoogleAuthProps) => {
  const navigation = useNavigation();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: "YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com", // Replace with your Google Client ID
  });

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      handleGoogleSignIn(id_token);
    }
  }, [response]);

  const handleGoogleSignIn = async (idToken: string) => {
    try {
      setError("");
      const apiUrl = "http://192.168.1.72:3006/api/auth/loginWithGoogle"; // Update with your API URL
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token && !isTokenExpiredLocally(data.token)) {
          await AsyncStorage.setItem("accessToken", data.token);
          navigation.replace("Main");
        } else {
          setError("Token recibido inválido");
        }
      } else {
        setError(data.message || "Error al autenticar con Google");
      }
    } catch (error) {
      console.error("Error en Google Sign-In:", error);
      setError("Error al conectar con Google");
    }
  };

  return { promptAsync };
};

export default useGoogleAuth;