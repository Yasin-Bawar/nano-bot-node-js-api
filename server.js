const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

// Function to get the private IPv4 (LAN) of this machine
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

// Local API endpoint
app.get("/api/ip", (req, res) => {
  const ipInfo = getPrivateIPv4();
  if (!ipInfo) {
    return res.status(404).json({ error: "No private IPv4 found" });
  }
  res.json(ipInfo);
});

app.listen(PORT, () => {
  console.log(`Local IP API running at http://localhost:${PORT}/api/ip`);
});
