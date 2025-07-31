import React, { useState } from "react";
import { View, Image, ActivityIndicator, StyleSheet, ImageErrorEventData, NativeSyntheticEvent } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Text } from "react-native-paper";

const Camera: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const camera = "https://invernadero.ngrok.io/video";

  const handleError = (error: NativeSyntheticEvent<ImageErrorEventData>) => {
    console.log('Image loading error:', error.nativeEvent.error);
    setLoading(false);
    setError(true);
  };

  // Mostrar directamente el estado de error si la cámara está desconectada
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialIcons name="videocam-off" size={48} color="#757575" />
          <Text style={styles.errorTitle}>Cámara inactiva</Text>
          <Text style={styles.errorMessage}>
            No se puede cargar la transmisión en este momento
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <MaterialIcons name="videocam" size={48} color="#757575" />
          <Text style={styles.loadingText}>Conectando a la cámara...</Text>
        </View>
      ) : (
        <Image
          source={{ uri: camera }}
          style={styles.image}
          onLoad={() => {
            setLoading(false);
            setError(false);
          }}
          onError={handleError}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
    marginVertical: 10,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#757575',
    marginTop: 8,
  },
  errorContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    color: '#424242',
  },
  errorMessage: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginTop: 4,
  },
});

export default Camera;