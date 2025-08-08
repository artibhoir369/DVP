// keygen.js
import { generateKeyPair } from '@stablelib/x25519';
import { encode as base64Encode } from '@stablelib/base64';

export function generateWireGuardKeyPair() {
  const keyPair = generateKeyPair();

  return {
    privateKey: base64Encode(keyPair.secretKey),
    publicKey: base64Encode(keyPair.publicKey),
  };
}

