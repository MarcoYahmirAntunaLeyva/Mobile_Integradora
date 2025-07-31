import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import { linkTokenToQR } from "../hooks/qr";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");
const FRAME_SIZE = width * 0.7;

export default function SesionQr() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [isLinking, setIsLinking] = useState(false);
  const [qrContent, setQrContent] = useState<string | null>(null);

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    if (scanned || !data) return;

    setScanned(true);
    setQrContent(data.trim());
    setIsLinking(true);

    try {
      // Obtener el token almacenado en AsyncStorage
      const tokenActivo = await AsyncStorage.getItem("accessToken");
      
      if (!tokenActivo) {
        Alert.alert("Error", "No se encontró un token de sesión válido. Por favor inicia sesión primero.");
        setScanned(false);
        setIsLinking(false);
        setQrContent(null);
        return;
      }

      const success = await linkTokenToQR(data.trim(), tokenActivo);

      if (success) {
        Alert.alert("Sesión iniciada", "Token vinculado correctamente.");
        // Navegar a la pantalla principal si es necesario
        // navigation.navigate('Main');
      } else {
        Alert.alert("Error", "No se pudo vincular el token. Intenta de nuevo.");
        setScanned(false);
        setQrContent(null);
      }
    } catch (error) {
      console.error("Error al vincular token:", error);
      Alert.alert("Error", "Ocurrió un error al procesar el QR. Intenta de nuevo.");
      setScanned(false);
      setQrContent(null);
    } finally {
      setIsLinking(false);
    }
  };

  if (!permission?.granted) {
    return <Text style={styles.permissionText}>Solicitando permiso de cámara...</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarcodeScanned}
      />
      <View style={styles.overlay}>
        <View style={styles.scannerFrame}>
          <Text style={styles.scanText}>Coloca el QR para iniciar sesión</Text>
          {isLinking && <ActivityIndicator size="small" color="#fff" style={{ marginTop: 10 }} />}
        </View>
      </View>
      {qrContent && (
        <View style={styles.resultBox}>
          <Text style={styles.resultLabel}>Código escaneado:</Text>
          <Text style={styles.resultText}>{qrContent}</Text>
        </View>
      )}
    </View>
  );
}

// Los estilos permanecen igual
const styles = StyleSheet.create({
  container: { flex: 1 },
  permissionText: { flex: 1, textAlign: "center", textAlignVertical: "center", fontSize: 16 },
  overlay: { ...StyleSheet.absoluteFillObject, alignItems: "center", justifyContent: "center" },
  scannerFrame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderColor: "#00FF00",
    borderWidth: 3,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  scanText: {
    color: "#fff",
    fontSize: 16,
    textAlign:"center",
    fontWeight: "bold",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  resultBox: {
    position: "absolute",
    bottom: 60,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: 16,
    borderRadius: 10,
  },
  resultLabel: { color: "#aaa", fontSize: 14 },
  resultText: { color: "#fff", fontSize: 16, marginTop: 4 },
});