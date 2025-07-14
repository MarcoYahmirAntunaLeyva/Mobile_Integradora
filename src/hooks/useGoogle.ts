import { useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google';
import { ResponseType } from 'expo-auth-session';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useGoogleSignIn = () => {
  const navigation = useNavigation();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: 'ID',
    iosClientId: 'ID',
    androidClientId: 'ID',
    responseType: ResponseType.Token,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        setAccessToken(authentication.accessToken);
        handleGoogleSignIn(authentication.accessToken);
      }
    }
  }, [response]);

  const handleGoogleSignIn = async (token: string) => {
    try {
      const response = await fetch(`http://192.168.1.72:3006/api/auth/login-google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        await AsyncStorage.setItem("accessToken", data.token);
        navigation.replace("Main");
      } else {
        console.error("Error en la autenticación con Google:", data.message);
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
    }
  };

  return { promptAsync, accessToken };
};

export default useGoogleSignIn;