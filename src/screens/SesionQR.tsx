import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useAuth } from '../../contexts/AuthContext'; // Si tienes contexto
import { URL } from '@env';

export default function ScanQR({ navigation }: any) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const { token } = useAuth(); // Obtener token del usuario autenticado

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    setScanned(true);

    try {
      const res = await fetch(`${API_URL}/api/qr/link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // 👈 token del celular
        },
        body: JSON.stringify({ sessionCode: data }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Fallo al vincular código QR');
      }

      Alert.alert('Éxito', 'Sesión vinculada con éxito.');
      navigation.goBack(); // o navega a otra pantalla si quieres
    } catch (error: any) {
      Alert.alert('Error', error.message);
      setScanned(false); // permitir reintentar
    }
  };

  if (hasPermission === null) {
    return <Text>Solicitando permiso de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se concedió acceso a la cámara</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />

      {scanned && (
        <Text style={styles.message}>Código escaneado. Procesando...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  message: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 12,
  },
});
