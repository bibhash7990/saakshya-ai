/**
 * Computes the SHA-256 hash of a file on the client side using the Web Crypto API.
 */
export const computeSHA256 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const arrayBuffer = reader.result as ArrayBuffer;
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', arrayBuffer);

        // Convert buffer to hex string
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

        resolve(hashHex);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(reader.error);
    };

    reader.readAsArrayBuffer(file);
  });
};

/**
 * Extracts system device, browser, and network metadata from client window.
 */
export const getClientMetadata = async () => {
  const userAgent = navigator.userAgent;

  // Simple OS detector
  let os = 'Unknown OS';
  if (userAgent.indexOf('Win') !== -1) os = 'Windows';
  else if (userAgent.indexOf('Mac') !== -1) os = 'macOS';
  else if (userAgent.indexOf('Linux') !== -1) os = 'Linux';
  else if (userAgent.indexOf('Android') !== -1) os = 'Android';
  else if (userAgent.indexOf('like Mac') !== -1) os = 'iOS';

  // Simple Browser detector
  let browser = 'Unknown Browser';
  if (userAgent.indexOf('Chrome') !== -1) browser = 'Chrome';
  else if (userAgent.indexOf('Firefox') !== -1) browser = 'Firefox';
  else if (userAgent.indexOf('Safari') !== -1 && userAgent.indexOf('Chrome') === -1) browser = 'Safari';
  else if (userAgent.indexOf('Edge') !== -1) browser = 'Edge';

  // Try fetching GPS coordinates (handles reject gracefully)
  let gps = null;
  try {
    const coords: any = await new Promise((res, rej) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => res({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy }),
        (err) => rej(err),
        { timeout: 3000 }
      );
    });
    gps = coords;
  } catch (err) {
    // Geolocation rejected or timed out
  }

  return {
    browser,
    os,
    gps,
    timestamp: new Date().toISOString(),
  };
};
