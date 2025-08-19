# VPN Server Configuration Guide

**Server Url**: `https://avs.skyboundcyber.com`  

---

## 🧰 Prerequisites

- A device with internet access
- WireGuard installed:
  - **Desktop**: [Windows](https://www.wireguard.com/install/), [macOS](https://www.wireguard.com/install/), [Linux](https://www.wireguard.com/install/)
  - **Mobile**: [iOS (App Store)](https://apps.apple.com/us/app/wireguard/id1441195209), [Android (Play Store)](https://play.google.com/store/apps/details?id=com.wireguard.android)

---

## 🖥 Accessing the VPN Configuration UI

1. Open your browser and go to:
https://avs.skyboundcyber.com

2. From the UI, you can:
- Generate a new configuration
- Download the `.conf` file
- View or scan the QR code for mobile setup

## 🌍 Select VPN Server based on location

   #### 🇮🇳 Bangalore, India (`blr1`) – Best for India/UAE users


---

## 🎯 Generate Config

The UI will generate a unique configuration per client. A sample client configuration looks like this:

```ini

```
⚠️ Each configuration is unique per device. Do not reuse across multiple clients.

---

## Share Server Command with Admin to whitelist IP
## 💻 Server Command
```ini

```


## ⚙️ Setting Up App

### Option 1: Desktop App (using `.conf` file)

1. Open the WireGuard desktop app.
2. Click **“Add Tunnel” → “Add empty tunnel”** or **“Import tunnel(s) from file”**.
3. Select the downloaded `.conf` file.
4. Click **Activate** to connect.

---

### Option 2: Mobile App (using QR Code)

1. Open the WireGuard app on your mobile device.
2. Tap the **"+"** button to add a new tunnel.
3. Select **"Scan from QR Code"**.
4. Scan the QR code from the web UI.
5. Save and activate the tunnel.

---

## ✅ Verifying the Connection

- Your IP address should now reflect the VPN server.
- You can check it using: [https://ifconfig.me](https://ifconfig.me)

---

## 🔒 Security Notes

- Keep your `.conf` file and QR code **private**.
- Do **not** share your configuration publicly.
- Each configuration is uniquely tied to your device/session.

---


## 📬 Contact & Support

For help or new configurations, contact:  
📧 **+91 90537 61515**  

---
