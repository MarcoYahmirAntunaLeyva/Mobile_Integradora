// useToken.ts
import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface TokenManagementProps {
  setIsCheckingToken: (isChecking: boolean) => void;
}

const useTokenManagement = ({ setIsCheckingToken }: TokenManagementProps) => {
  const navigation = useNavigation();

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

  const isTokenExpiredLocally = (token: string): boolean => {
    try {
      const decoded = decodeToken(token);
      if (!decoded || !decoded.exp) {
        return true;
      }
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return true;
    }
  };

  const renewToken = async (token: string) => {
    try {
      const response = await fetch(`http://192.168.1.72:3006/auth/timeTokenLife`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          await AsyncStorage.setItem("accessToken", data.token);
          return data.token;
        }
      }
      return null;
    } catch (error) {
      console.error("Error renewing token:", error);
      return null;
    }
  };

  const validateToken = async () => {
    try {
      const token = await AsyncStorage.getItem("accessToken");
      if (!token) {
        setIsCheckingToken(false);
        return;
      }

      // Verificar expiración local primero
      if (isTokenExpiredLocally(token)) {
        await AsyncStorage.removeItem("accessToken");
        setIsCheckingToken(false);
        return;
      }

      // Verificar con el servidor
      const response = await fetch(`http://192.168.1.72:3006/api/auth/timeTokenLife`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.timeToLife > 0) {
          // Si el token está por expirar, renovarlo
          if (data.timeToLife < 300) { // 5 minutos
            const newToken = await renewToken(token);
            if (!newToken) {
              console.warn("No se pudo renovar el token automáticamente");
            }
          }
          navigation.replace("Main");
        } else {
          await AsyncStorage.removeItem("accessToken");
          setIsCheckingToken(false);
        }
      } else {
        await AsyncStorage.removeItem("accessToken");
        setIsCheckingToken(false);
      }
    } catch (error) {
      console.error("Error validating token:", error);
      await AsyncStorage.removeItem("accessToken");
      setIsCheckingToken(false);
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  return { isTokenExpiredLocally, validateToken };
};

export default useTokenManagement;