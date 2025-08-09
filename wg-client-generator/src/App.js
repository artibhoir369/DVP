// App.js
import React, { useState } from 'react';
import { QRCodeSVG as QRCode } from 'qrcode.react';

function App() {
  const [serverPublicKey, setServerPublicKey] = useState('');
  const [serverEndpoint, setServerEndpoint] = useState('');
  const [config, setConfig] = useState('');
  const [serverCommand, setServerCommand] = useState('');

  const serverOptions = {
    blr1: {
      label: '🌏 blr1 - Bangalore, India (Best for India/UAE)',
      publicKey: '22QjOlWhPKvY587dQWoDni7KMh7S9RONnHL4fzICM28=',
      endpoint: 'avs.skyboundcyber.com:51820'
    },
    tor1: {
      label: '🍁 tor1 - Toronto, Canada',
      publicKey: 'REPLACE_WITH_TOR1_PUBLIC_KEY',
      endpoint: 'tor1.example.com:51820'
    },
    nyc3: {
      label: '🗽 nyc3 - New York, USA',
      publicKey: 'REPLACE_WITH_NYC3_PUBLIC_KEY',
      endpoint: 'nyc3.example.com:51820'
    },
    sfo3: {
      label: '🌉 sfo3 - San Francisco, USA',
      publicKey: 'REPLACE_WITH_SFO3_PUBLIC_KEY',
      endpoint: 'sfo3.example.com:51820'
    },
    lon1: {
      label: '🇬🇧 lon1 - London, UK',
      publicKey: 'REPLACE_WITH_LON1_PUBLIC_KEY',
      endpoint: 'lon1.example.com:51820'
    },
    fra1: {
      label: '🇩🇪 fra1 - Frankfurt, Germany',
      publicKey: 'REPLACE_WITH_FRA1_PUBLIC_KEY',
      endpoint: 'fra1.example.com:51820'
    }
  };

  const generateRandomIP = () => {
    const host = Math.floor(Math.random() * 254) + 2;
    return `10.0.0.${host}/32`;
  };

  const handleGenerate = async () => {
    if (!serverPublicKey || !serverEndpoint) {
      alert('Please select a VPN server.');
      return;
    }

    const response = await fetch('/api/generate-keys');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white font-sans px-4 py-8">
      <div className="max-w-3xl mx-auto bg-gray-950 rounded-lg shadow-lg p-6 border border-gray-700">
        <h1 className="text-4xl font-extrabold text-center mb-2 text-white">
          <span className="text-blue-500">Skybound</span><span className="text-purple-400">Cyber</span>
        </h1>
        <p className="text-center text-gray-400 text-sm mb-6">WireGuard Client Config Generator</p>

        <div className="mb-5">
          <label className="block mb-2 font-medium">🌐 Select VPN Server</label>
          <select
            onChange={(e) => {
              const selected = e.target.value;
              if (selected && serverOptions[selected]) {
                setServerPublicKey(serverOptions[selected].publicKey);
                setServerEndpoint(serverOptions[selected].endpoint);
              }
            }}
            className="w-full bg-gray-800 text-white border border-gray-600 px-4 py-2 rounded focus:outline-none"
            defaultValue=""
          >
            <option value="" disabled>Select a VPN Server</option>
            {Object.entries(serverOptions).map(([key, server]) => (
              <option key={key} value={key}>{server.label}</option>
            ))}
          </select>
        </div>

        {serverPublicKey && serverEndpoint && (
          <div className="mb-4 text-sm text-gray-300">
            <p><strong>🔐 Public Key:</strong> {serverPublicKey}</p>
            <p><strong>📡 Endpoint:</strong> {serverEndpoint}</p>
          </div>
        )}

        <button
          onClick={handleGenerate}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-2 px-4 rounded mb-6 font-semibold"
        >
          🎯 Generate WireGuard Config
        </button>

        {config && (
          <div className="mt-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">🧾 Client Configuration</h2>
              <pre className="bg-gray-800 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap text-green-200">{config}</pre>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">💻 Server Command</h2>
              <pre className="bg-gray-800 p-4 rounded text-sm text-yellow-300">{serverCommand}</pre>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">📱 QR Code</h2>
              <div id="qrcode-container" className="flex justify-center py-4">
                <QRCode value={config} size={200} fgColor="#ffffff" bgColor="#111827" />
              </div>

              <div className="flex gap-4 flex-wrap justify-center mt-4">
                <button
                  onClick={downloadQRCode}
                  className="bg-purple-600 hover:bg-purple-700 transition text-white py-2 px-4 rounded"
                >
                  ⬇️ Download QR Code
                </button>
                <button
                  onClick={downloadConfig}
                  className="bg-green-600 hover:bg-green-700 transition text-white py-2 px-4 rounded"
                >
                  📄 Download Config File
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

