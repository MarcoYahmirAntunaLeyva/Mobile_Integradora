import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import styles from "../styles/loginStyles";

interface LoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error: string;
  handleLogin: () => void;
  handleGoogleSignIn: () => void;
  handleForgotPassword: () => void; 
}

const LoginFormComponent: React.FC<LoginFormProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  error,
  handleLogin,
  handleGoogleSignIn,
  handleForgotPassword,
}) => {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#4F944F"
        value={email}
        onChangeText={setEmail}
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
      <TouchableOpacity onPress={handleForgotPassword}>
        <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity
        style={styles.googleButton}
        onPress={handleGoogleSignIn}
        disabled={!handleGoogleSignIn}
      >
        <View style={styles.googleContent}>
          <Image
            source={require("../../assets/gog.png")}
            style={styles.gog}
          />
          <Text style={styles.googleButtonText}>Continuar con Google</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.privacyText}>Privacidad y términos</Text>
    </View>
  );
};

export default LoginFormComponent;
