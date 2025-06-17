// import React, { useState, useEffect } from 'react';
// import { View, StyleSheet, Text, Button } from 'react-native';
// import { BarCodeScanner } from 'expo-barcode-scanner';

// export default function ScanQr() {
//   const [hasPermission, setHasPermission] = useState<boolean | null>(null);
//   const [scanned, setScanned] = useState(false);

//   useEffect(() => {
//     const getBarCodeScannerPermissions = async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === 'granted');
//     };

//     getBarCodeScannerPermissions();
//   }, []);

//   const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
//     setScanned(true);
//     alert(`Código escaneado!\nTipo: ${type}\nDatos: ${data}`);
//   };

//   if (hasPermission === null) {
//     return <Text>Solicitando permiso para la cámara...</Text>;
//   }
//   if (hasPermission === false) {
//     return <Text>No se otorgaron permisos para la cámara</Text>;
//   }

//   return (
//     <View style={styles.container}>
//       <BarCodeScanner
//         onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//         style={StyleSheet.absoluteFillObject}
//         barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
//       />
      
//       {scanned && (
//         <Button
//           title="Escanear otro código"
//           onPress={() => setScanned(false)}
//           color="#ffffff"
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     flexDirection: 'column',
//     justifyContent: 'flex-end',
//   },
// });