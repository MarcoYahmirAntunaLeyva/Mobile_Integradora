import React from "react";
import { Modal, View, Text, TextInput, TouchableOpacity } from "react-native";
import styles from "../styles/loginStyles";

interface PasswordResetModalProps {
  visible: boolean;
  onClose: () => void;
  email: string;
  setEmail: (email: string) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  token: string;
  setToken: (token: string) => void;
  step: "request" | "reset";
  isLoading: boolean;
  requestReset: () => void;
  resetPassword: () => void;
}

const PasswordResetModal: React.FC<PasswordResetModalProps> = ({
  visible,
  onClose,
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
}) => {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Recuperar Contraseña</Text>

          {step === "request" ? (
            <>
              <Text style={styles.modalText}>
                Ingresa tu correo electrónico para recibir un enlace de
                recuperación
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#4F944F"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
              <TouchableOpacity
                style={styles.loginButton}
                onPress={requestReset}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? "Enviando..." : "Enviar enlace"}
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.modalText}>
                Ingresa el token que recibiste por correo y tu nueva contraseña
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Token de verificación"
                placeholderTextColor="#4F944F"
                value={token}
                onChangeText={setToken}
              />
              <TextInput
                style={styles.input}
                placeholder="Nueva contraseña"
                placeholderTextColor="#4F944F"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
              <TextInput
                style={styles.input}
                placeholder="Confirmar nueva contraseña"
                placeholderTextColor="#4F944F"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
              <TouchableOpacity
                style={styles.loginButton}
                onPress={resetPassword}
                disabled={isLoading}
              >
                <Text style={styles.loginButtonText}>
                  {isLoading ? "Actualizando..." : "Actualizar contraseña"}
                </Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PasswordResetModal;
