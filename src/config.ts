const config = {
  consumers: [],
  id: process.env.UID || "1",
  psk: process.env.PSK || "pre-shared-key",
  port: process.env.PORT || 80,
}

export default config;