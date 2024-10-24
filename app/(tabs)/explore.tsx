import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import CryptoES from 'crypto-es'; // Import AES for message encryption
const RSAKey = require('react-native-rsa'); // Import RSAKey for RSA encryption

const bits = 1024; // Key size in bits (1024, 2048, etc.)
const exponent = '10001'; // Exponent for the key generation, represented in hexadecimal (common RSA exponent)

// Generate RSA key pair for either Bob or Alice
const generateKeyPair = (name: string) => {
  const rsa = new RSAKey();
  rsa.generate(bits, exponent);

  const publicKey = rsa.getPublicString(); // Public key in JSON format
  const privateKey = rsa.getPrivateString(); // Private key in JSON format

  console.log(`${name}'s Public Key:`, publicKey);
  console.log(`${name}'s Private Key:`, privateKey);

  return { publicKey, privateKey };
};

// Function to simulate the hybrid encryption process between Bob and Alice
const simulateBobAlice = () => {
  try {
    // Step 1: Bob and Alice generate their key pairs
    console.log("Bob and Alice generate their RSA keys...");
    const bobKeyPair = generateKeyPair('Bob');
    const aliceKeyPair = generateKeyPair('Alice');

    // Step 2: Alice generates an AES key
    const aesKey = CryptoES.lib.WordArray.random(32).toString(CryptoES.enc.Base64); // Generate a 256-bit AES key
    console.log("Alice's AES Key:", aesKey);

    // Step 3: Alice encrypts the AES key using Bob's RSA public key and sends it to Bob
    const aliceRSA = new RSAKey();
    aliceRSA.setPublicString(bobKeyPair.publicKey); // Alice uses Bob's public key to encrypt the AES key
    const encryptedAESKey = aliceRSA.encrypt(aesKey);
    console.log("Alice's Encrypted AES Key to Bob:", encryptedAESKey);

    // Step 4: Bob decrypts the AES key using his RSA private key
    const bobRSA = new RSAKey();
    bobRSA.setPrivateString(bobKeyPair.privateKey); // Bob uses his private key to decrypt the AES key
    const decryptedAESKey = bobRSA.decrypt(encryptedAESKey);
    console.log("Bob's Decrypted AES Key:", decryptedAESKey);

    // Step 5: Alice encrypts a message using AES and the shared AES key
    const messageFromAlice = 'Hello Bob, this is Alice!';
    const encryptedMessageFromAlice = CryptoES.AES.encrypt(messageFromAlice, decryptedAESKey).toString();
    console.log("Alice's Encrypted Message to Bob (AES):", encryptedMessageFromAlice);

    // Step 6: Bob decrypts the message using AES and the shared AES key
    const decryptedMessageForBob = CryptoES.AES.decrypt(encryptedMessageFromAlice, decryptedAESKey).toString(CryptoES.enc.Utf8);
    console.log("Bob's Decrypted Message from Alice:", decryptedMessageForBob);

    // Step 7: Bob replies with a message, encrypts it using AES and the shared AES key
    const messageFromBob = 'Hello Alice, this is Bob!';
    const encryptedMessageFromBob = CryptoES.AES.encrypt(messageFromBob, decryptedAESKey).toString();
    console.log("Bob's Encrypted Message to Alice (AES):", encryptedMessageFromBob);

    // Step 8: Alice decrypts the message using AES and the shared AES key
    const decryptedMessageForAlice = CryptoES.AES.decrypt(encryptedMessageFromBob, decryptedAESKey).toString(CryptoES.enc.Utf8);
    console.log("Alice's Decrypted Message from Bob:", decryptedMessageForAlice);

    // Return the results for UI display
    return {
      bobPublicKey: bobKeyPair.publicKey,
      alicePublicKey: aliceKeyPair.publicKey,
      encryptedAESKey,
      encryptedMessageFromAlice,
      decryptedMessageForBob,
      encryptedMessageFromBob,
      decryptedMessageForAlice
    };

  } catch (error) {
    console.error('Error during Bob-Alice hybrid encryption simulation:', error);
  }
};

const KeyGeneratorComponent = () => {
  const [simulationData, setSimulationData] = useState<any>(null);

  useEffect(() => {
    // Simulate the Bob-Alice message exchange
    const result = simulateBobAlice();
    setSimulationData(result); // Store the result in state for rendering in the UI
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Bob and Alice Hybrid Encryption Simulation</Text>
        <Text style={styles.subtitle}>Check the console for detailed simulation logs.</Text>

        {simulationData && (
          <View>
            <Text style={styles.label}>Bob's Public Key:</Text>
            <Text style={styles.text} selectable>{simulationData.bobPublicKey}</Text>

            <Text style={styles.label}>Alice's Public Key:</Text>
            <Text style={styles.text} selectable>{simulationData.alicePublicKey}</Text>

            <Text style={styles.label}>Encrypted AES Key (from Alice to Bob):</Text>
            <Text style={styles.text} selectable>{simulationData.encryptedAESKey}</Text>

            <Text style={styles.label}>Alice's Encrypted Message to Bob (AES):</Text>
            <Text style={styles.text} selectable>{simulationData.encryptedMessageFromAlice}</Text>

            <Text style={styles.label}>Bob's Decrypted Message from Alice:</Text>
            <Text style={styles.text}>{simulationData.decryptedMessageForBob}</Text>

            <Text style={styles.label}>Bob's Encrypted Message to Alice (AES):</Text>
            <Text style={styles.text} selectable>{simulationData.encryptedMessageFromBob}</Text>

            <Text style={styles.label}>Alice's Decrypted Message from Bob:</Text>
            <Text style={styles.text}>{simulationData.decryptedMessageForAlice}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

// Styling for dark background
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212', // Dark background color
  },
  innerContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text color for dark background
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#AAAAAA', // Light gray color for subtitles
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text color
    marginTop: 10,
  },
  text: {
    fontSize: 14,
    color: '#CCCCCC', // Light gray for regular text
    marginTop: 5,
  },
});

export default KeyGeneratorComponent;
