const express = require('express');
const cors = require('cors');
const sodium = require('libsodium-wrappers');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

async function generateWireGuardKeyPair() {
  await sodium.ready;

  const keyPair = sodium.crypto_box_keypair();
  const privateKey = Buffer.from(keyPair.privateKey).toString('base64');
  const publicKey = Buffer.from(keyPair.publicKey).toString('base64');

  return { privateKey, publicKey };
}

app.get('/generate-keys', async (req, res) => {
  try {
    const keys = await generateWireGuardKeyPair();
    res.json(keys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate keys' });
  }
});

app.listen(PORT, () => {
  console.log(`VPN Backend running on http://localhost:${PORT}`);
});

