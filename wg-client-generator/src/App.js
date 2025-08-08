// App.js
import React, { useState } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';

function App() {
  const [serverPublicKey, setServerPublicKey] = useState('');
  const [serverEndpoint, setServerEndpoint] = useState('');
  const [config, setConfig] = useState('');
  const [serverCommand, setServerCommand] = useState('');

  const generateRandomIP = () => {
    const host = Math.floor(Math.random() * 254) + 2;
    return `10.0.0.${host}/32`;
  };

  const handleGenerate = async () => {
    if (!serverPublicKey || !serverEndpoint) {
      alert('Please enter server public key and endpoint.');
      return;
    }

    const response = await fetch('http://localhost:3001/generate-keys');
    if (!response.ok) {
      alert('Failed to generate keys from backend');
      return;
    }
    const { privateKey, publicKey } = await response.json();

    const ip = generateRandomIP();

    const conf = `
[Interface]
PrivateKey = ${privateKey}
Address = ${ip}
DNS = 1.1.1.1

[Peer]
PublicKey = ${serverPublicKey}
Endpoint = ${serverEndpoint}
AllowedIPs = 0.0.0.0/0, ::/0
PersistentKeepalive = 25
`.trim();

    const command = `sudo wg set wg0 peer ${publicKey} allowed-ips ${ip}`;

    setConfig(conf);
    setServerCommand(command);
  };

  const downloadConfig = () => {
    const blob = new Blob([config], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'wireguard-client.conf';
    link.click();
  };

  const downloadQRCode = () => {
    const svg = document.querySelector('#qrcode-container svg');
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      URL.revokeObjectURL(url);

      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = 'wireguard-qr.png';
      downloadLink.click();
    };

    img.src = url;
  };

  return (
    <div className="p-6 max-w-xl mx-auto font-mono">
      <h1 className="text-xl font-bold mb-4">WireGuard Config Generator</h1>

      <div className="mb-3">
        <label className="block mb-1">Server Public Key:</label>
        <input
          value={serverPublicKey}
          onChange={(e) => setServerPublicKey(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div className="mb-3">
        <label className="block mb-1">Server Endpoint (e.g. vpn.example.com:51820):</label>
        <input
          value={serverEndpoint}
          onChange={(e) => setServerEndpoint(e.target.value)}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Config
      </button>

      {config && (
        <div className="mt-6">
          <h2 className="font-bold mb-2">Client Configuration:</h2>
          <pre className="bg-gray-100 p-3 rounded overflow-x-auto whitespace-pre-wrap">{config}</pre>

          <h2 className="font-bold mt-4 mb-2">Server Command:</h2>
          <pre className="bg-gray-100 p-3 rounded overflow-x-auto">{serverCommand}</pre>

          <h2 className="font-bold mt-4 mb-2">QR Code:</h2>
          <div id="qrcode-container" className="mb-2">
            <QRCode value={config} size={256} />
          </div>

          <button
            onClick={downloadQRCode}
            className="mt-2 bg-purple-600 text-white px-4 py-2 rounded mr-2"
          >
            Download QR Code as PNG
          </button>

          <button
            onClick={downloadConfig}
            className="mt-2 bg-green-600 text-white px-4 py-2 rounded"
          >
            Download Config File
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

