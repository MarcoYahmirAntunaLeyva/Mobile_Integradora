import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from "expo-local-authentication";

const LoginScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"login" | "register">("login");
  const [error, setError] = useState<string>("");
  const [isCheckingToken, setIsCheckingToken] = useState<boolean>(true);
  const navigation = useNavigation();
  const { height, width } = Dimensions.get("window");

  // State for Login
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // State for Register
  const [nombre, setNombre] = useState<string>("");
  const [apellido, setApellido] = useState<string>("");
  const [segundoApellido, setSegundoApellido] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [telefono, setTelefono] = useState<string>("");
  const [registerPassword, setRegisterPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // Función para decodificar el token JWT
  const decodeToken = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  // Función para verificar si el token ha expirado localmente
  const isTokenExpiredLocally = (token: string): boolean => {
    try {
      const decoded = decodeToken(token);
      if (!decoded || !decoded.exp) {
        return true;
      }
      
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  };

  // Función para renovar token automáticamente
  const renewToken = async (userId: string) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      if (!token) return false;

      const apiUrl = `http://192.168.1.88:3000/api/auth/update/${userId}`;
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.accessToken) {
          await AsyncStorage.setItem('accessToken', data.accessToken);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error renewing token:', error);
      return false;
    }
  };

  // Función para validar token usando el endpoint getTimeToken
  const validateToken = async () => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      
      if (!token) {
        setIsCheckingToken(false);
        return;
      }

      // Verificar primero si el token ha expirado localmente
      if (isTokenExpiredLocally(token)) {
        console.log('Token expired locally');
        await AsyncStorage.removeItem('accessToken');
        setIsCheckingToken(false);
        return;
      }

      // Decodificar el token para obtener el userId
      const tokenPayload = decodeToken(token);
      if (!tokenPayload || !tokenPayload.userId) {
        console.log('Invalid token payload');
        await AsyncStorage.removeItem('accessToken');
        setIsCheckingToken(false);
        return;
      }

      const userId = tokenPayload.userId;
      const apiUrl = `http://192.168.1.88:3000/api/auth/time/${userId}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        // Si timeToLife es mayor a 0, el token sigue siendo válido
        if (data.timeToLife > 0) {
          console.log(`Token válido, tiempo restante: ${data.timeToLife} segundos`);
          
          // Si el token expira en menos de 5 minutos, renovarlo automáticamente
          if (data.timeToLife < 300) { // 300 segundos = 5 minutos
            console.log('Token próximo a expirar, renovando automáticamente...');
            const renewed = await renewToken(userId);
            if (renewed) {
              console.log('Token renovado exitosamente');
            } else {
              console.warn('No se pudo renovar el token automáticamente');
            }
          }
          
          // Token válido, navegar a Main
          navigation.replace('Main');
        } else {
          // Token expirado según el servidor
          console.log('Token expirado según el servidor');
          await AsyncStorage.removeItem('accessToken');
          setIsCheckingToken(false);
        }
      } else if (response.status === 401) {
        // Token inválido o expirado
        console.log('Token inválido o expirado (401)');
        await AsyncStorage.removeItem('accessToken');
        setIsCheckingToken(false);
      } else {
        // Otro error del servidor
        console.log(`Error del servidor: ${response.status}`);
        await AsyncStorage.removeItem('accessToken');
        setIsCheckingToken(false);
      }
    } catch (error) {
      console.error('Error validating token:', error);
      // En caso de error, remover token y mostrar login
      await AsyncStorage.removeItem('accessToken');
      setIsCheckingToken(false);
    }
  };

  // Función para validar token manualmente (puede ser llamada desde otros componentes)
  const checkTokenValidity = async (): Promise<boolean> => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      
      if (!token) {
        return false;
      }

      // Verificar expiración local
      if (isTokenExpiredLocally(token)) {
        await AsyncStorage.removeItem('accessToken');
        return false;
      }

      // Verificar con el servidor
      const tokenPayload = decodeToken(token);
      if (!tokenPayload || !tokenPayload.userId) {
        await AsyncStorage.removeItem('accessToken');
        return false;
      }

      const userId = tokenPayload.userId;
      const apiUrl = `http://192.168.1.88:3000/api/auth/time/${userId}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.timeToLife > 0) {
          return true;
        }
      }
      
      await AsyncStorage.removeItem('accessToken');
      return false;
    } catch (error) {
      console.error('Error checking token validity:', error);
      await AsyncStorage.removeItem('accessToken');
      return false;
    }
  };

  // Validar token al montar el componente
  useEffect(() => {
    validateToken();
  }, []);

  // Función para validar token periodicamente (opcional)
  useEffect(() => {
    const interval = setInterval(async () => {
      const isValid = await checkTokenValidity();
      if (!isValid) {
        // Si el token no es válido, limpiar el intervalo y redirigir al login
        clearInterval(interval);
        navigation.replace('Login');
      }
    }, 60000); // Verificar cada minuto

    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    try {
      setError(""); // Limpiar errores previos
      const apiUrl = 'http://192.168.1.88:3000/api/auth/login-user';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Verificar que el token sea válido antes de guardarlo
        if (data.accessToken && !isTokenExpiredLocally(data.accessToken)) {
          await AsyncStorage.setItem('accessToken', data.accessToken);
          navigation.replace('Main');
        } else {
          setError('Token recibido inválido');
        }
      } else {
        setError(data.message || 'Credenciales incorrectas');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al conectar con el servicio local');
    }
  };

  const handleBiometricAuth = async () => {
  try {
    setError(""); // Limpiar errores previos

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      setError("Biometría no disponible en este dispositivo.");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Inicia sesión",
      disableDeviceFallback: false,
    });

    if (result.success) {
      // Acceso directo sin verificar el token
      navigation.replace("Main");
    } else {
      setError("Autenticación biométrica fallida.");
    }
  } catch (e) {
    console.error(e);
    setError("Ocurrió un error con la biometría.");
  }
};

  const handleRegister = async () => {
    try {
      setError(""); // Limpiar errores previos
      
      if (registerPassword !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }

      const apiUrl = 'http://192.168.1.88:3000/api/auth/register-user';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre,
          apellido,
          segundoApellido,
          correo,
          telefono,
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Si el registro incluye un token, guardarlo después de verificar que sea válido
        if (data.accessToken && !isTokenExpiredLocally(data.accessToken)) {
          await AsyncStorage.setItem('accessToken', data.accessToken);
        }
        navigation.replace('Main');
      } else {
        setError(data.message || 'Error al registrarse');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al conectar con el servicio local');
    }
  };

  // Mostrar loading mientras se valida el token
  if (isCheckingToken) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={styles.loadingText}>Verificando sesión...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
    >
      <View style={styles.logoWrapper}>
        <ImageBackground
          source={require("../../assets/fondo.png")}
          style={styles.logoContainer}
          resizeMode="cover"
        >
          <BlurView intensity={20} style={styles.blurView}>
            <Image
              source={require("../../assets/logo.png")}
              style={styles.logo}
            />
          </BlurView>
        </ImageBackground>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formWrapper}>
          <Text style={styles.title}>SUDAI ACUAPONIA</Text>

          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === "login" && styles.activeTab,
              ]}
              onPress={() => {
                setSelectedTab("login");
                setError(""); // Limpiar errores al cambiar tab
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "login" && styles.activeTabText,
                ]}
              >
                Iniciar Sesión
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.tabButton,
                selectedTab === "register" && styles.activeTab,
              ]}
              onPress={() => {
                setSelectedTab("register");
                setError(""); // Limpiar errores al cambiar tab
              }}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === "register" && styles.activeTabText,
                ]}
              >
                Registrarse
              </Text>
            </TouchableOpacity>
          </View>

          {selectedTab === "login" ? (
            <>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#4F944F"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#4F944F"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
              <TouchableOpacity>
                <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <TouchableOpacity style={styles.googleButton}>
                <View style={styles.googleContent}>
                  <Image
                    source={require("../../assets/gog.png")}
                    style={styles.gog}
                  />
                  <Text style={styles.googleButtonText}>Continuar con Google</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.qrButton} onPress={handleBiometricAuth}>
                <Text style={styles.qrButtonText}>Iniciar con Biometría</Text>
              </TouchableOpacity>
              <Text style={styles.privacyText}>Privacidad y términos</Text>
            </>
          ) : (
            <>
              <TextInput
                style={styles.input}
                placeholder="Nombre"
                placeholderTextColor="#4F944F"
                value={nombre}
                onChangeText={setNombre}
              />
              <TextInput
                style={styles.input}
                placeholder="Apellido"
                placeholderTextColor="#4F944F"
                value={apellido}
                onChangeText={setApellido}
              />
              <TextInput
                style={styles.input}
                placeholder="Segundo Apellido"
                placeholderTextColor="#4F944F"
                value={segundoApellido}
                onChangeText={setSegundoApellido}
              />
              <TextInput
                style={styles.input}
                placeholder="Correo Electrónico"
                placeholderTextColor="#4F944F"
                value={correo}
                onChangeText={setCorreo}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TextInput
                style={styles.input}
                placeholder="Número de Teléfono"
                placeholderTextColor="#4F944F"
                value={telefono}
                onChangeText={setTelefono}
                keyboardType="phone-pad"
              />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#4F944F"
                value={registerPassword}
                onChangeText={setRegisterPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Confirmar Contraseña"
                placeholderTextColor="#4F944F"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <TouchableOpacity style={styles.loginButton} onPress={handleRegister}>
                <Text style={styles.loginButtonText}>Registrate</Text>
              </TouchableOpacity>
              {error ? <Text style={styles.error}>{error}</Text> : null}
              <TouchableOpacity style={styles.googleButton}>
                <View style={styles.googleContent}>
                  <Image
                    source={require("../../assets/gog.png")}
                    style={styles.gog}
                  />
                  <Text style={styles.googleButtonText}>Continuar con Google</Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.privacyText}>Privacidad y términos</Text>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F6F6",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#2E7D32",
    fontWeight: "500",
  },
  logoWrapper: {
    overflow: "hidden",
    height: 200,
  },
  logoContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  formWrapper: {
    backgroundColor: "#fff",
    margin: 15,
    padding: 20,
    paddingVertical: 25,
    borderRadius: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    maxHeight: "150%",
    borderWidth: 1,
    borderColor: "#E0F2E9",
  },
  title: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#2E7D32",
    textTransform: "uppercase",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    padding: 2,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    borderRadius: 12,
    backgroundColor: "#E8F5E9",
  },
  activeTab: {
    backgroundColor: "#2E7D32",
  },
  tabText: {
    fontSize: 15,
    color: "#666",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#fff",
    fontWeight: "bold",
  },
  input: {
    height: 50,
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#C8E6C9",
    marginBottom: 15,
    fontSize: 16,
    color: "#333",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  forgotPassword: {
    textAlign: "left",
    color: "#388E3C",
    fontSize: 13,
    marginBottom: 15,
    textDecorationLine: "underline",
  },
  error: {
    color: "#D32F2F",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#2E7D32",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
  googleButton: {
    backgroundColor: "#fff",
    borderColor: "#C8E6C9",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    elevation: 2,
  },
  googleContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  gog: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    marginRight: 12,
  },
  googleButtonText: {
    color: "#424242",
    fontSize: 16,
  },
  qrButton: {
    backgroundColor: "#fff",
    borderColor: "#C8E6C9",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    elevation: 2,
  },
  qrButtonText: {
    color: "#388E3C",
    fontSize: 16,
  },
  privacyText: {
    textAlign: "center",
    color: "#757575",
    fontSize: 13,
    marginTop: 10,
  },
});

export default LoginScreen;