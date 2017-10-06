const config = {
  consumers: [], // Setup here producer addresses.
  psk: process.env.PSK || "pre-shared-key",
  port: parseInt(process.env.PORT || "",10) || 80,
  connectionTimeout: parseInt(process.env.TIMEOUT || "", 10) || 3000, // Miliseconds
}

export default config;
