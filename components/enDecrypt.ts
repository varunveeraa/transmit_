import CryptoES from 'crypto-es';
const RSAKey = require('react-native-rsa'); 
import * as Crypto from 'expo-crypto'; // Import expo-crypto for hashing


const bits = 1024;
const exponent = '10001';

const encryptMessage = (message: string, password: string) => {
  try {
    const encrypted = CryptoES.AES.encrypt(message, password).toString();
    return encrypted;
  } catch (error) {
    console.error('Error during encryption:', error);
  }
};

const decryptMessage = (encryptedMessage: string, password: string) => {
  try {
    const decryptedBytes = CryptoES.AES.decrypt(encryptedMessage, password);
    const decryptedText = decryptedBytes.toString(CryptoES.enc.Utf8);
    return decryptedText;
  } catch (error) {
    console.error('Error during decryption:', error);
  }
};

const generateKeyPair = (name: string) => {
  const rsa = new RSAKey();
  rsa.generate(bits, exponent);

  const publicKey = rsa.getPublicString(); // Public key in JSON format
  const privateKey = rsa.getPrivateString(); // Private key in JSON format

  console.log(`${name}'s Public Key:`, publicKey);
  console.log(`${name}'s Private Key:`, privateKey);

  return { publicKey, privateKey };
};

  // Function to hash the public key
  const hashPublicKey = async (publicKey: any) => {
    try {
      const hashedKey = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256, // Hashing algorithm
        publicKey
      );
      console.log("Hashed Public Key:", hashedKey); // Log the hashed public key
      return hashedKey;
    } catch (error) {
      console.error("Error hashing the public key:", error);
      throw error;
    }
  };

export { encryptMessage, decryptMessage, generateKeyPair, hashPublicKey };
