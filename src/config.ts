const config = {
  consumers: ["192.168.1.126:20001/producer", "192.168.1.126:20002/producer", "192.168.1.126:20003/producer"],
  psk: process.env.PSK || "pre-shared-key",
  port: parseInt(process.env.PORT || "",10) || 80,
  connectionTimeout: parseInt(process.env.TIMEOUT || "", 10) || 3000, // Miliseconds
}

export default config;