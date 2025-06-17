import React, { useState } from "react";
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
} from "react-native";
import { BlurView } from "expo-blur";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from "expo-local-authentication";
import { URL } from '@env';



const LoginScreen: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<"login" | "register">("login");
  const [error, setError] = useState<string>("");
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

  const handleLogin = async () => {
    try {
      const apiUrl = `${URL}/api/auth/login-user`;
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
        await AsyncStorage.setItem('accessToken', data.accessToken);
        navigation.replace('Main');
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
      if (registerPassword !== confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }

      const apiUrl = `${URL}/api/auth/register-user`;
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
        navigation.replace('Main');
      } else {
        setError(data.message || 'Error al registrarse');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al conectar con el servicio local');
    }
  };

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
              source={require("../../assets/fondo.png")}
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
              onPress={() => setSelectedTab("login")}
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
              onPress={() => setSelectedTab("register")}
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