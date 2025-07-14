import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
// import { GoogleSignin, statusCodes } from "@react-native-google-signin/google-signin";


interface AuthProps {
  setError: (error: string) => void;
  isTokenExpiredLocally: (token: string) => boolean;
}

const useAuth = ({ setError, isTokenExpiredLocally }: AuthProps) => {
  const navigation = useNavigation();
  // const URL = process.env.URL_Back

  const handleLogin = async (email: string, password: string) => {
    try {
      setError("");
      const response = await fetch(`http://192.168.1.72:3006/api/auth/login-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
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
        setError(data.message || "Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error al conectar con el servicio local");
    }
  };


  const handleRegister = async (
    middleName: string,
    firstName: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    password: string,
    confirmPassword: string
  ) => {
    try {
      setError("");
      if (password !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }

      const apiUrl = `http://192.168.1.72:3006/api/users/createUser`;
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          middleName,
          firstName,
          lastName,
          email,
          phoneNumber,
          password: password,
          confirmPassword: confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.token && !isTokenExpiredLocally(data.token)) {
          await AsyncStorage.setItem("accessToken", data.token);
        }
        navigation.replace("Main");
      } else {
        setError(data.message || "Error al registrarse");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error al conectar con el servicio local");
    }
  };

  return { handleLogin, handleRegister };
};

export default useAuth;