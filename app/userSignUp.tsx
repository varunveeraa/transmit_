import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ActivityIndicator, Animated, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { generateKeyPair, hashPublicKey } from '@/components/enDecrypt'; // Key generation logic
import { storeKey } from '@/components/keyPairStore'; // Key storage logic
import { db } from '../config/firebaseConfig'; // Firebase Firestore initialization
import { doc, setDoc } from 'firebase/firestore'; // Firestore methods for document creation

export default function CreateAccount() {
  const [loading, setLoading] = useState(false); // For showing loading state
  const [displayName, setDisplayName] = useState(''); // State for the display name input
  const [inputDisabled, setInputDisabled] = useState(false); // State to control input field disabling
  const fadeAnim = useState(new Animated.Value(0))[0]; // Fade-in animation
  const router = useRouter();

  // Fade-in effect for the logo and title
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Handle account creation (key generation) and navigation
  const handleCreateAccount = async () => {
    if (!displayName) {
      alert('Please enter a display name'); // Alert if no display name is entered
      return;
    }

    setLoading(true); // Show loading animation
    setInputDisabled(true); // Disable the input field

    setTimeout(async () => {
      try {
        // Generate key pair
        const keyPair = generateKeyPair('User'); // Replace 'User' with the user's info if available
        console.log("Key Pair Generated:", keyPair);

        await storeKey('privateKey', keyPair.privateKey);
        await storeKey('publicKey', keyPair.publicKey);

        // Hash the public key to use as the document ID
        const hashedPublicKey = await hashPublicKey(keyPair.publicKey);
        console.log("Using the hashed public key as the document ID...");

        // Use hashedPublicKey as the document ID and store the display name and public key
        await setDoc(doc(db, 'users', hashedPublicKey), {
          displayName,  // Store the entered display name
          publicKey: keyPair.publicKey, // Store the generated public key
        });

        console.log("Document created with hashed public key, display name, and public key!");

        router.push('/(tabs)/attempt1'); // Navigate to the next screen after key generation
      } catch (error) {
        console.error("Error creating account and storing key:", error);
        setLoading(false); // Reset loading state if there is an error
        setInputDisabled(false); // Re-enable the input if something goes wrong
      }
    }, 100); // Simulate a short delay to ensure loading animation starts
  };

  return (
    <View style={styles.container}>
      {/* Logo and Title */}
      <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
        <Text style={styles.logo}>T</Text>
      </Animated.View>
      <Text style={styles.title}>
        Pick Your Display Name
      </Text>
      <Text style={styles.subheading}>
        It can be your real name, an alias, or anything else you like - and you can change it any time.
      </Text>

      {/* TextInput for the display name */}
      <TextInput
        style={styles.input}
        placeholder="Enter display name"
        placeholderTextColor="#888888"
        value={displayName}
        onChangeText={setDisplayName}
        editable={!inputDisabled} // Disable the input after the button is clicked
        autoCapitalize="none" // Disable automatic capitalization
      />

      {/* If loading, show loader. If not, show the button */}
      <View style={styles.contentContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#00A86B" />
            <Text style={styles.loadingText}>Generating your secure keys...</Text>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              pressed ? styles.buttonPressed : null,
            ]}
            onPress={handleCreateAccount}
          >
            <Text style={styles.buttonText}>Create My Secure World</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Pitch black background
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 2,
    borderColor: '#00A86B',
    borderRadius: 50,
    padding: 20,
    width: 100,
    height: 100,
  },
  logo: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#00A86B',
    letterSpacing: 2,
    textAlign: 'center', // Center the text
    lineHeight: 100, // Add line height equal to the container height to vertically align it
  },  
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subheading: {
    fontSize: 14,
    color: '#AAAAAA',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#222222',
    borderRadius: 5,
    color: '#FFFFFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16,
    width: '80%',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingText: {
    color: '#00A86B',
    fontSize: 16,
    marginTop: 10,
  },
  button: {
    backgroundColor: '#00A86B',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 20,
    shadowColor: '#00A86B',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    backgroundColor: '#148F45',
  },
  transmitText: {
    color: '#00A86B', // Green color for the word "Transmit"
    fontSize: 32,
    fontStyle: 'italic',
    fontWeight: '900', // Bold font weight for a strong brand presence
    letterSpacing: 2,
  },
});
