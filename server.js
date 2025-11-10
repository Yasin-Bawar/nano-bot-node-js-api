const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

function getPrivateIPv4() {
  const ifaces = os.networkInterfaces();
  for (const name of Object.keys(ifaces)) {
    for (const iface of ifaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return {
          interface: name,
          address: iface.address,
          netmask: iface.netmask
        };
      }
    }
  }
  return null;
}

app.get("/api/ip", (req, res) => {
  const ipInfo = getPrivateIPv4();
  if (!ipInfo) {
    return res.status(404).json({ error: "No private IPv4 found" });
  }
  res.json(ipInfo);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
