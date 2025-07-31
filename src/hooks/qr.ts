import { globalToken } from './uselogin'; 

const API_URL = 'https://hostbackend-production-06a9.up.railway.app'; 

// Función para vincular token al QR
export const linkTokenToQR = async (sessionCode: string, globalToken: string): Promise<boolean> => {
  try {
    const res = await fetch(`${API_URL}/api/qr/link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${globalToken}`,
      },
      body: JSON.stringify({ sessionCode }),
    });

    if (!res.ok) {
      console.error("Error al vincular token al QR, status:", res.status);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Error linking token to QR:", err);
    return false;
  }
};

// Función para verificar token (usa TOKEN_MANUAL si existe)
export const checkQRToken = async (sessionCode: string): Promise<string | null> => {
  if (globalToken) {
    console.warn("Usando Token, no se consulta backend");
    return globalToken;
  }
  try {
    const res = await fetch(`${API_URL}/api/qr/status/${sessionCode}`);

    if (!res.ok) {
      console.error("Error al consultar estado del QR, status:", res.status);
      return null;
    }

    const data = await res.json();
    return data.token ?? null;
  } catch (error) {
    console.error("Error consultando estado del QR:", error);
    return null;
  }
};
