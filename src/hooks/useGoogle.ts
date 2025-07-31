import { useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google';
import { ResponseType } from 'expo-auth-session';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useGoogleSignIn = () => {
  const navigation = useNavigation();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  
  const [request, response, promptAsync] = Google.useAuthRequest({
  androidClientId: '568951402476-00rpbcj1fgmogfvq86cm2k140vvd7je7.apps.googleusercontent.com',
  iosClientId: '568951402476-00rpbcj1fgmogfvq86cm2k140vvd7je7.apps.googleusercontent.com', 
  webClientId: '568951402476-00rpbcj1fgmogfvq86cm2k140vvd7je7.apps.googleusercontent.com', 
  responseType: ResponseType.Code, 
  scopes: ["openid", "profile", "email"],
  usePKCE: true, 
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
      const response = await fetch(`https://hostbackend-production-06a9.up.railway.app/api/auth/login-google`, {
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
        // Puedes mostrar un mensaje al usuario aquí
      }
    } catch (error) {
      console.error("Error al conectar con el servidor:", error);
      // Manejo de errores para el usuario
    }
  };

  return { promptAsync, accessToken };
};

export default useGoogleSignIn;