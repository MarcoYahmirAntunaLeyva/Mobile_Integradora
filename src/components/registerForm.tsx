import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import styles from "../styles/styles";
import { jsx } from "react/jsx-runtime";

interface RegisterFormProps {
  middleName: string;
  setmiddleName: (middleName: string) => void;
  firstName: string;
  setfirstName: (firstName: string) => void;
  lastName: string;
  setlastName: (lastName: string) => void;
  email: string;
  setemail: (email: string) => void;
  phoneNumber: string;
  setphoneNumber: (phoneNumber: string) => void;
  password: string;
  setpassword: (password: string) => void;
  confirmPassword: string;
  setconfirmPassword: (confirmPassword: string) => void;
  error: string;
  handleRegister: () => void;
  handleGoogleSignIn: () => void;
}

const RegisterFormComponent: React.FC<RegisterFormProps> = ({
  middleName,
  setmiddleName,
  firstName,
  setfirstName,
  lastName,
  setlastName,
  email,
  setemail,
  phoneNumber,
  setphoneNumber,
  password,
  setpassword,
  confirmPassword,
  setconfirmPassword,
  error,
  handleRegister,
  handleGoogleSignIn,
}) => {
  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#4F944F"
        value={middleName}
        onChangeText={setmiddleName}
      />
      <TextInput
        style={styles.input}
        placeholder="Apellido"
        placeholderTextColor="#4F944F"
        value={firstName}
        onChangeText={setfirstName}
      />
      <TextInput
        style={styles.input}
        placeholder="Segundo Apellido"
        placeholderTextColor="#4F944F"
        value={lastName}
        onChangeText={setlastName}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        placeholderTextColor="#4F944F"
        value={email}
        onChangeText={setemail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Número de Teléfono"
        placeholderTextColor="#4F944F"
        value={phoneNumber}
        onChangeText={setphoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#4F944F"
        value={password}
        onChangeText={setpassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        placeholderTextColor="#4F944F"
        value={confirmPassword}
        onChangeText={setconfirmPassword}
        secureTextEntry
      />
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleRegister}
      >
        <Text style={styles.loginButtonText}>Registrate</Text>
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

export default RegisterFormComponent;